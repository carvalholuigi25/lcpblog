"use client";
import { redirect } from "next/navigation";
import * as config from "@applocale/utils/config";

export default function RootPage() {
  const langdef = config.getConfigSync().language;
  redirect("/"+langdef);  
}
