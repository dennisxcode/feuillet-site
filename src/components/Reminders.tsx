import type { ReactNode } from 'react'
import { Reveal, SectionHead } from './Reveal'

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </svg>
  )
}

function TimerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M10 2h4M12 8v5l3 3" />
      <circle cx="12" cy="13" r="8.5" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9v6M14 9v6" />
    </svg>
  )
}

const TILES: Array<{ icon: ReactNode; name: string; body: string }> = [
  {
    icon: <MoonIcon />,
    name: 'Nightly check-in',
    body: 'Tomorrow, summarized the night before at your check-in time. One notification, never a feed.',
  },
  {
    icon: <SunIcon />,
    name: 'Due today',
    body: "Everything due today plus whatever's late, in one morning digest.",
  },
  {
    icon: <TimerIcon />,
    name: 'Exam pacing',
    body: 'Study reminders counting down from exam day, so the eve always lands.',
  },
  {
    icon: <PauseIcon />,
    name: 'Stalled work',
    body: 'The oldest untouched item only, on a widening interval. Nudged, not nagged.',
  },
]

export function Reminders() {
  return (
    <section id="reminders" className="py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead
          eyebrow="Reminders"
          title="Nudges that respect the night."
          sub="Four kinds, all on by default, all editable. They exist because big projects get forgotten until it is too late."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="card group h-full p-6 transition-colors hover:border-ink-3">
                <span className="grid size-10 place-items-center rounded-md border border-line bg-surface-2 text-ink-2 transition-colors group-hover:text-accent">
                  {t.icon}
                </span>
                <h3 className="mt-5 text-base text-ink">{t.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
