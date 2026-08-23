import type { ReactNode } from 'react'
import { Reveal, SectionHead } from './Reveal'

function TodoistIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2.5" y="2.5" width="15" height="15" rx="4" />
      <path d="M6.5 10.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GcalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2.5" y="3.5" width="15" height="14" rx="3" />
      <path d="M2.5 8h15M6.5 2v3M13.5 2v3" strokeLinecap="round" />
      <path d="M7 12.5h6M7 15h3.5" strokeLinecap="round" />
    </svg>
  )
}

function ClassroomIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7l8-4 8 4-8 4-8-4z" strokeLinejoin="round" />
      <path d="M6 9v4c0 1.2 2 2.5 4 2.5s4-1.3 4-2.5V9" strokeLinecap="round" />
      <path d="M18 7v5" strokeLinecap="round" />
    </svg>
  )
}

const CARDS: Array<{ icon: ReactNode; name: string; lines: string[] }> = [
  {
    icon: <TodoistIcon />,
    name: 'Todoist',
    lines: [
      'Lists arrive as ordinary work, unmapped ones included.',
      'Tick here and it closes there. A leaf only once Todoist confirms.',
    ],
  },
  {
    icon: <GcalIcon />,
    name: 'Google Calendar',
    lines: [
      'Reads your calendars as events, work, or both, per calendar.',
      'Open work mirrors back out to one calendar of ours, so deadlines sit in the calendar app already on your phone.',
    ],
  },
  {
    icon: <ClassroomIcon />,
    name: 'Google Classroom',
    lines: [
      'Assignments land with their course attached and whether they have been handed in.',
      'Wherever the school allows it.',
    ],
  },
]

export function Connectors() {
  return (
    <section id="sources" className="border-t border-line-soft py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead
          eyebrow="Sources"
          title="Bring what already exists."
          sub="Your work doesn't have to move in all at once. Connect a source and it feeds the board; migrate when you're ready."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.name} delay={i * 120}>
              <div className="card group h-full p-6 transition-colors hover:border-ink-3">
                <div className="flex items-center gap-3 text-ink">
                  <span className="grid size-10 place-items-center rounded-md border border-line bg-surface-2 text-ink-2 transition-colors group-hover:text-accent">
                    {c.icon}
                  </span>
                  <h3 className="text-lg">{c.name}</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {c.lines.map((l) => (
                    <li key={l} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
                      <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-ink-3" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 text-center text-xs tracking-wide text-ink-3">
            Read first. Feuillet cannot touch anything it did not create.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
