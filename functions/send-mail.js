export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Add CORS headers so the frontend can talk to the backend
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

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
        to: ["launchmyportfolio@gmail.com"], // Must be your Resend login email
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
      return new Response(JSON.stringify({ error: errorText }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    return new Response(JSON.stringify({ message: "Sent!" }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
}

// Handle the OPTIONS request for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}