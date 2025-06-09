/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { NextResponse } from "next/server";
import { getTranslations } from 'next-intl/server';
import { checkIfValuesNotExistLocales } from '@/app/i18n/locales';
import * as config from '@applocale/utils/config';

const GetMsgTranslated = async (key: string, val?: any) => {
  const t = await getTranslations("ui.forms.settings.messages");
  return t(key, val); 
}

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
      const regex = /^[a-z]{2,3}(?:-[a-zA-Z]{4})?(?:-[A-Z]{2,3})?$/;
      const filePath = path.join(process.cwd(), 'src/config.json');

      if(!fs.existsSync(path.join(process.cwd(), "src/app/[locale]/styles/themes/extras/layouts/") + data.theme + ".scss")) {
        return NextResponse.json({ error: await GetMsgTranslated("themenotfound", {themeName: ""+data.theme}) }, {status: 500});
      }

      if(data.language) {
        if(checkIfValuesNotExistLocales(data.language)) {
          return NextResponse.json({ error: await GetMsgTranslated("langnotfound", {languageName: ""+data.language}) }, {status: 500});
        }
      
        if(!regex.test(data.language)) {
          return NextResponse.json({ error: await GetMsgTranslated("langinvalidformat") }, {status: 500});
        }
      }
      
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