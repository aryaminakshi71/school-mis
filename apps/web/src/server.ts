export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "") {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head><title>School MIS</title></head>
          <body>
            <h1>School MIS</h1>
            <p>Welcome to School Management Information System</p>
            <nav>
              <a href="/">Home</a> |
              <a href="/features">Features</a> |
              <a href="/pricing">Pricing</a> |
              <a href="/faq">FAQ</a> |
              <a href="/about">About</a> |
              <a href="/login">Login</a> |
              <a href="/signup">Signup</a>
            </nav>
          </body>
        </html>
      `,
        { headers: { "Content-Type": "text/html" } },
      );
    }

    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head><title>School MIS - ${url.pathname}</title></head>
        <body>
          <h1>School MIS</h1>
          <p>Page: ${url.pathname}</p>
          <nav>
            <a href="/">Home</a> |
            <a href="/features">Features</a> |
            <a href="/pricing">Pricing</a> |
            <a href="/faq">FAQ</a> |
            <a href="/about">About</a> |
            <a href="/login">Login</a> |
            <a href="/signup">Signup</a>
          </nav>
        </body>
      </html>
    `,
      { headers: { "Content-Type": "text/html" } },
    );
  },
};
