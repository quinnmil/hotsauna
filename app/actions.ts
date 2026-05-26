"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { sessions } from "@/lib/schema";

export async function lightSauna(_prevState: unknown, formData: FormData): Promise<null> {
  const raw = formData.get("name");
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  const name = trimmed === "" ? null : trimmed.slice(0, 60);

  await db.insert(sessions).values({ name });

  revalidatePath("/");
  return null;
}
