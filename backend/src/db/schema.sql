-- ScamShield database schema

CREATE TABLE IF NOT EXISTS reports (
  id            SERIAL PRIMARY KEY,
  scam_type     VARCHAR(50) NOT NULL,        -- phishing, romance, job, crypto, delivery, other
  title         VARCHAR(200),
  description   TEXT NOT NULL,
  raw_content   TEXT,                        -- the pasted message/text involved
  url           TEXT,                        -- the link involved, if any
  contact_info  VARCHAR(200),                -- phone number / email / handle used by the scammer
  reporter_name VARCHAR(100) DEFAULT 'Anonymous',
  status        VARCHAR(20) DEFAULT 'unverified',  -- unverified, confirmed, disputed
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS checks (
  id            SERIAL PRIMARY KEY,
  input_type    VARCHAR(10) NOT NULL,        -- text, url
  input_content TEXT NOT NULL,
  risk_level    VARCHAR(10),                 -- low, medium, high
  explanation   TEXT,
  suggested_action TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_scam_type ON reports(scam_type);
CREATE INDEX IF NOT EXISTS idx_reports_contact_info ON reports(contact_info);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
