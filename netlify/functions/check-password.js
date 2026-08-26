export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { password } = await request.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ success: false }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch {
    return new Response(
      JSON.stringify({ success: false }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
