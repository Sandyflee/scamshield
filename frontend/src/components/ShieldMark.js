import React from 'react';

export default function ShieldMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M24 4L8 10V22C8 32.5 14.7 40.9 24 44C33.3 40.9 40 32.5 40 22V10L24 4Z"
        fill="#0B1E3D"
      />
      <path
        d="M24 4L8 10V22C8 32.5 14.7 40.9 24 44V4Z"
        fill="#16305C"
      />
      <path
        d="M17 24.5L21.5 29L31.5 18"
        stroke="#F5A623"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
