export async function onRequest(context) {
  const { request, env } = context;

  // Allow only POST
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const data = await request.json();

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Trade Enquiry <onboarding@resend.dev>",
        to: ["psaibalaji121@gmail.com"],
        subject: `New Trade Enquiry - ${data.product}`,
        html: `
          <h2>New International Trade Enquiry</h2>
          <p><strong>Full Name:</strong> ${data.full_name}</p>
          <p><strong>Company:</strong> ${data.company_name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Country:</strong> ${data.country}</p>
          <p><strong>Product:</strong> ${data.product}</p>
          <p><strong>Quantity:</strong> ${data.quantity}</p>
          <p><strong>Details:</strong> ${data.details}</p>
        `
      })
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return new Response(errorText, { status: 500 });
    }

    return new Response("Email sent successfully", { status: 200 });

  } catch (error) {
    return new Response("Server Error", { status: 500 });
  }
}