import { FeuilletLeaf } from './Logo'
import { Reveal, useRevealParent } from './Reveal'

const PLACES = ['Paper agenda', 'Todoist', 'Notion', 'Google Calendar', 'Grade portal']

export function Problem() {
  const { ref, on } = useRevealParent<HTMLDivElement>()
  return (
    <section id="problem" className="border-y border-line-soft bg-panel py-20 md:py-28">
      <div ref={ref} className={`mx-auto max-w-4xl px-6 text-center ${on ? 'on' : ''}`}>
        <Reveal>
          <p className="eyebrow">The problem</p>
          <h2 className="font-display mx-auto mt-5 max-w-2xl text-3xl leading-[1.08] tracking-tight md:text-5xl">
            You check five places to know what tomorrow is.
          </h2>
        </Reveal>

        <Reveal delay={150} className="mt-12 flex flex-wrap items-stretch justify-center gap-3">
          {PLACES.map((p, i) => (
            <span
              key={p}
              className="strike-chip rounded-md border border-line px-4 py-2.5 text-sm text-ink-2"
              style={{ transitionDelay: `${i * 140}ms` }}
            >
              {p}
            </span>
          ))}
        </Reveal>

        <Reveal delay={900} className="mt-10 flex flex-col items-center gap-4">
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none" stroke="var(--color-ink-3)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8 2v18M2 14l6 6 6-6" />
          </svg>
          <span className="inline-flex items-center gap-2.5 rounded-lg border border-accent/40 bg-accent-soft px-5 py-3 text-base text-accent">
            <FeuilletLeaf size={16} />
            Feuillet
          </span>
          <p className="max-w-md text-sm leading-relaxed text-ink-3">
            One place that knows what's due, what it's worth, and how you're doing.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
