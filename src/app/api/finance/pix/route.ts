import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userName, monthReference, amount } = body;

  try {
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_amount: amount,
        description: `Mensalidade ${monthReference} - ${userName}`,
        payment_method_id: "pix",
        payer: {
          email: "teste@mercadopago.com", // sandbox
        },
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      id: data.id,
      qrCodeBase64: data.point_of_interaction.transaction_data.qr_code_base64,
      copiaCola: data.point_of_interaction.transaction_data.qr_code,
      status: data.status,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao gerar cobrança Pix" }, { status: 500 });
  }
}
