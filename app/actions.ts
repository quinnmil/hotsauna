"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { sessions } from "@/lib/schema";
import { LIT_THRESHOLD_MS } from "@/lib/time";

export async function lightSauna(_prevState: unknown, formData: FormData): Promise<null> {
  const raw = formData.get("name");
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  const name = trimmed === "" ? null : trimmed.slice(0, 60);

  const [latest] = await db
    .select()
    .from(sessions)
    .orderBy(desc(sessions.createdAt))
    .limit(1);

  const stillLit =
    !!latest &&
    latest.action !== "extinguished" &&
    Date.now() - new Date(latest.createdAt).getTime() < LIT_THRESHOLD_MS;

  await db.insert(sessions).values({
    name,
    action: stillLit ? "stoked" : "lit",
  });

  revalidatePath("/");
  return null;
}

export async function extinguishSauna(): Promise<void> {
  await db.insert(sessions).values({
    name: null,
    action: "extinguished",
  });

  revalidatePath("/");
}
