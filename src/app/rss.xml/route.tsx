import { generateRssFeed } from "@applocale/utils/rss";

export async function GET() {
  return new Response(await generateRssFeed("xml"), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}