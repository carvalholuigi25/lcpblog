export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
 
<channel>
  <title>LCPBlog</title>
  <link>https://localhost:3000</link>
  <description>Welcome to LCPBlog!</description>
</channel>
 
</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}