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
