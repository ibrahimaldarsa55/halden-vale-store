import Image from "next/image";
import { unsplash } from "@/lib/format";
import { Reveal } from "./reveal";

const PILLARS = [
  { n: "01", title: "Honest materials", body: "Solid oak, spun brass, high-fired stoneware. Nothing veneered, nothing lacquered to hide its age." },
  { n: "02", title: "Small workshops", body: "Fourteen partner ateliers across Portugal, Denmark and Italy — most fewer than ten people strong." },
  { n: "03", title: "Made to last", body: "A 25-year frame guarantee on furniture, and a lifetime repair service on everything we make." },
];

export function BrandStory() {
  return (
    <section id="story" aria-labelledby="story-title" className="bg-ink text-alabaster">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-36">
        <div className="relative lg:col-span-5">
          <Reveal className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={unsplash("1583847268964-b28dc8f51f92", 1400)}
              alt="A sunlit living room furnished with oak, linen and ceramics"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal
            delay={0.2}
            className="absolute -bottom-8 right-4 w-40 overflow-hidden border-[6px] border-ink sm:w-56 lg:-right-10"
          >
            <div className="relative aspect-square">
              <Image
                src={unsplash("1610701596007-11502861dcfa", 600)}
                alt="Speckled stoneware cups"
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="eyebrow text-brass">The Atelier</p>
            <h2 id="story-title" className="mt-6 font-serif text-4xl font-light leading-[1.05] md:text-6xl">
              Slow design for rooms <span className="italic text-brass">that breathe.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-alabaster/70 md:text-base">
              <p>
                Halden &amp; Vale began in 2011 in a former cork warehouse on the banks of the Douro, where architect Inês Halden and
                cabinetmaker Tomas Vale set out to make the few objects a home genuinely needs — and to make them properly.
              </p>
              <p>
                Fifteen years on, we still design every piece in that same workshop. Each is produced in limited runs, signed by the hands
                that made it, and built to be handed down rather than replaced.
              </p>
            </div>
          </Reveal>
          <ul className="mt-12 grid gap-8 border-t border-alabaster/15 pt-10 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <li key={p.n}>
                <Reveal delay={0.1 * i}>
                  <span className="font-serif text-3xl text-brass">{p.n}</span>
                  <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.16em]">{p.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-alabaster/60">{p.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
