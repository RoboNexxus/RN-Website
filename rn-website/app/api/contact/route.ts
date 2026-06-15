import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  // Basic server-side validation
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const discordRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "New Contact Form Submission",
          color: 0x47a0b8,
          description: `**From:** ${name} (${email})`,
          fields: [
            { name: "Subject", value: subject, inline: false },
            {
              name: "Message",
              value: message.length > 1024 ? message.substring(0, 1021) + "..." : message,
              inline: false,
            },
          ],
          footer: { text: "• Robo Nexus Contact Form •" },
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  if (!discordRes.ok) {
    return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
