import fs from 'fs';
import path from 'path';
import { NextResponse } from "next/server";
import * as config from '@applocale/utils/config';

export async function GET(req: Request) {
  try {
    const result = (await config.getConfig());
    return NextResponse.json({ result }, {status: 200});
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Failed to load data. Message: ' + err, req }, {status: 500});
  }
}

export async function POST(req: Request) {
  const res = await req.json()
  return NextResponse.json({ res })
}

export async function PUT(req: Request) {
    const data = await req.json();

    try {
      const filePath = path.join(process.cwd(), 'src/config.json');
      
      // Ensure the 'data' directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      fs.writeFile(filePath, JSON.stringify({config: data}, null, 2), (err) => {
        if (err) {
          console.error(err);
          return NextResponse.json({ error: 'Failed to update data. Message: ' + err }, {status: 500});
        }
        
        NextResponse.json({ result: data }, { status: 200 });
      });

      return NextResponse.json({ result: "Updated!" }, {status: 200});
    } catch (err) {
      return NextResponse.json({ error: 'Failed to update data. Message: ' + err }, {status: 500});
    }
}