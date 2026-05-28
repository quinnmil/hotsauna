import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessions } from "@/lib/schema";
import { FALLBACK_NAME, LIT_THRESHOLD_MS } from "@/lib/time";
import { FireBackground } from "@/components/FireBackground";
import { LightForm } from "@/components/LightForm";
import { Poller } from "@/components/Poller";
import { RelativeTime } from "@/components/RelativeTime";
import { TapToExtinguish } from "@/components/TapToExtinguish";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [latest] = await db
    .select()
    .from(sessions)
    .orderBy(desc(sessions.createdAt))
    .limit(1);

  const createdAtIso = latest ? new Date(latest.createdAt).toISOString() : null;
  const isLit =
    !!latest &&
    latest.action !== "extinguished" &&
    Date.now() - new Date(latest.createdAt).getTime() < LIT_THRESHOLD_MS;
  const wasStoke = isLit && latest.action === "stoked";
  const displayName = latest?.name?.trim() || FALLBACK_NAME;
  const locationName = process.env.LOCATION_NAME ?? "hotsauna";

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-6 pt-10 pb-12">
      {isLit && <FireBackground />}
      <Poller />
      {isLit && <TapToExtinguish />}

      <header className="font-serif text-base tracking-tight text-muted">
        {locationName}
      </header>

      <main className="flex flex-1 flex-col justify-center gap-12 py-10">
        <section className="space-y-2">
          {isLit && createdAtIso ? (
            <>
              <h1 className="font-serif text-4xl leading-tight text-ember">
                {wasStoke ? "Stoked" : "Lit"} by {displayName}
              </h1>
              <p className="font-serif text-lg italic text-muted">
                <RelativeTime iso={createdAtIso} />
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-4xl leading-tight text-foreground">
                The sauna is cold
              </h1>
              <p className="font-serif text-lg italic text-muted">
                Lets change that
              </p>
            </>
          )}
        </section>

        <LightForm isLit={isLit} />
      </main>
    </div>
  );
}
