import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Preencha todos os campos." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY não configurada." },
        { status: 500 }
      );
    }

    if (!process.env.CONTACT_EMAIL) {
      return NextResponse.json(
        { error: "CONTACT_EMAIL não configurado." },
        { status: 500 }
      );
    }

    const result = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL],
      subject: `Novo contato - ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Novo contato</h2>
          <p><b>Nome:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Mensagem:</b></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    console.log("RESEND RESULT:", result);

    if (result.error) {
      console.error("RESEND ERROR:", result.error);

      return NextResponse.json(
        { error: "Erro ao enviar e-mail." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO NA API:", error);

    return NextResponse.json(
      { error: "Erro ao enviar." },
      { status: 500 }
    );
  }
}