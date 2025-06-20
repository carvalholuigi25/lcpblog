"use client";
import { redirect } from "next/navigation";
import { getDefLocale } from "./[locale]/helpers/defLocale";

export default function RootPage() {
  const langdef = getDefLocale();
  redirect("/"+langdef);  
}
