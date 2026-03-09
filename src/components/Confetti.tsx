"use client";

import * as React from "react";
import confetti from "canvas-confetti";

export default function Confetti() {
  React.useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#0066FF", "#00A86B", "#f6f3ef", "#0a0a0a"],
    });
  }, []);

  return null;
}
