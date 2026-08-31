const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const pool = require('../db/pool');

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `You are ScamShield's scam-detection analyst. You will be given a piece of text (a message, email body, or offer) or a URL that a person is worried might be a scam.

Analyze it and respond ONLY with a JSON object, no preamble, no markdown fences, in this exact shape:
{
  "risk_level": "low" | "medium" | "high",
  "red_flags": ["short phrase", "short phrase"],
  "explanation": "2-3 plain-language sentences explaining the verdict",
  "suggested_action": "one clear, concrete next step for the user"
}

Base your judgment on common scam patterns: urgency/pressure tactics, requests for money or gift cards, requests for personal/financial info, too-good-to-be-true offers, impersonation of trusted brands or people, suspicious/mismatched URLs, poor grammar combined with official claims, unsolicited contact. If the input is too short or ambiguous to assess, say so honestly in the explanation and use "medium" risk with a suggestion to verify independently.`;

router.post('/', async (req, res) => {
  const { input_type, input_content } = req.body;

  if (!input_type || !input_content || !['text', 'url'].includes(input_type)) {
    return res.status(400).json({ error: 'input_type ("text" or "url") and input_content are required.' });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: `Input type: ${input_type}\n\nContent to analyze:\n${input_content}` }
      ]
    });

    const raw = message.content.find(block => block.type === 'text')?.text || '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    let result;
    try {
      result = JSON.parse(cleaned);
    } catch (parseErr) {
      return res.status(502).json({ error: 'Could not parse analysis result. Please try again.' });
    }

    // Log the check for analytics (best-effort, don't block the response on failure)
    pool.query(
      `INSERT INTO checks (input_type, input_content, risk_level, explanation, suggested_action)
       VALUES ($1, $2, $3, $4, $5)`,
      [input_type, input_content, result.risk_level, result.explanation, result.suggested_action]
    ).catch(err => console.error('Failed to log check:', err.message));

    res.json(result);
  } catch (err) {
    console.error('Scam check failed:', err.message);
    res.status(500).json({ error: 'Something went wrong analyzing this. Please try again.' });
  }
});

module.exports = router;
