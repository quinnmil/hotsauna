import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessions } from "@/lib/schema";
import { FALLBACK_NAME, LIT_THRESHOLD_MS } from "@/lib/time";
import { LightForm } from "@/components/LightForm";
import { Poller } from "@/components/Poller";
import { RelativeTime } from "@/components/RelativeTime";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rows = await db
    .select()
    .from(sessions)
    .orderBy(desc(sessions.litAt))
    .limit(1);

  const latest = rows[0];
  const litAtIso = latest ? new Date(latest.litAt).toISOString() : null;
  const isLit =
    !!latest && Date.now() - new Date(latest.litAt).getTime() < LIT_THRESHOLD_MS;
  const displayName = latest?.name?.trim() || FALLBACK_NAME;
  const locationName = process.env.LOCATION_NAME ?? "hotsauna";

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-6 pt-10 pb-12">
      <Poller />

      <header className="font-serif text-base tracking-tight text-muted">
        {locationName}
      </header>

      <main className="flex flex-1 flex-col justify-center gap-12 py-10">
        <section className="space-y-2">
          {isLit && litAtIso ? (
            <>
              <h1 className="font-serif text-4xl leading-tight text-ember">
                Lit by {displayName}
              </h1>
              <p className="font-serif text-lg italic text-muted">
                <RelativeTime iso={litAtIso} />
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-4xl leading-tight text-foreground">
                The sauna is cold
              </h1>
              {latest && litAtIso ? (
                <p className="font-serif text-lg italic text-muted">
                  Last lit <RelativeTime iso={litAtIso} /> by {displayName}
                </p>
              ) : (
                <p className="font-serif text-lg italic text-muted">
                  No one has lit it yet
                </p>
              )}
            </>
          )}
        </section>

        <LightForm />
      </main>
    </div>
  );
}
