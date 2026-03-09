import { NextRequest, NextResponse } from "next/server";

type EmailBody = {
  email: string;
  source?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: EmailBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, source = "unknown" } = body;

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  }

  console.log(`[email-capture] email=${email} source=${source}`);

  const webhookUrl = process.env.EMAIL_CAPTURE_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    }).catch((err) => {
      console.error("[email-capture] webhook forward failed:", err);
    });
  }

  return NextResponse.json({ ok: true });
}
