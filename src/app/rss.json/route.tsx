import { generateRssFeed } from "@applocale/utils/rss";

export async function GET() {
  return new Response(await generateRssFeed("json"), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}