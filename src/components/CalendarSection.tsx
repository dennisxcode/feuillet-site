import type { ReactNode } from 'react'
import { Reveal, SectionHead } from './Reveal'

type Tone = 'accent' | 'amber' | 'violet' | 'info'

const TONE: Record<Tone, string> = {
  accent: 'bg-accent-soft text-accent',
  amber: 'bg-amber-soft text-amber',
  violet: 'bg-violet-soft text-violet',
  info: 'bg-info-soft text-info',
}

interface Pill {
  label: string
  tone: Tone
}

interface Day {
  n: number
  today?: boolean
  period?: string
  pills: Pill[]
}

const DAYS: Day[] = [
  { n: 24, period: 'P1 MAT', pills: [{ label: 'DM physique', tone: 'accent' }] },
  { n: 25, period: 'P3 ANG', pills: [{ label: 'Tutorat 17h', tone: 'info' }, { label: 'Essay draft', tone: 'accent' }] },
  { n: 26, period: 'P4 HIS', pills: [] },
  { n: 27, today: true, period: 'P2 CHIM', pills: [{ label: 'Examen ch. 3', tone: 'amber' }] },
  { n: 28, period: 'P1 MAT', pills: [{ label: 'Phys DM remise', tone: 'accent' }] },
  { n: 29, pills: [{ label: 'Projet héros', tone: 'violet' }] },
  { n: 30, pills: [] },
]

function Cell({ day }: { day: Day }) {
  return (
    <div
      className={`min-h-24 border-r border-b border-line-soft p-1.5 transition-colors last:border-r-0 hover:bg-surface ${
        day.today ? 'bg-surface ring-1 ring-inset ring-accent/50' : ''
      }`}
    >
      <p className="text-[10px] tnum text-ink-3">{day.n}</p>
      {day.period && (
        <p className="mt-1 inline-block rounded-xs border border-line px-1 py-px text-[9px] tracking-wide text-ink-3">
          {day.period}
        </p>
      )}
      <div className="mt-1.5 space-y-1">
        {day.pills.map((p) => (
          <p key={p.label} className={`truncate rounded-xs px-1.5 py-0.5 text-[10px] ${TONE[p.tone]}`}>
            {p.label}
          </p>
        ))}
      </div>
    </div>
  )
}

const LEGEND: Array<[string, Tone]> = [
  ['Work', 'accent'],
  ['Exam', 'amber'],
  ['Project', 'violet'],
  ['Event', 'info'],
]

function Dot({ tone }: { tone: Tone }) {
  return (
    <span
      className="inline-block size-1.5 rounded-full"
      style={{
        background:
          tone === 'accent' ? 'var(--color-accent)' : tone === 'amber' ? 'var(--color-amber)' : tone === 'violet' ? 'var(--color-violet)' : 'var(--color-info)',
      }}
    />
  )
}

export function CalendarSection() {
  return (
    <section id="calendar" className="py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead
          eyebrow="Calendar"
          title={
            <>
              One calendar.
              <br />
              Everything on it.
            </>
          }
          sub="Assignments, exams, personal projects and your class grid share the same week. Work lands on the period it belongs to."
        />

        <Reveal delay={150} className="mt-14">
          <div className="card overflow-hidden bg-panel">
            <div className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
              <p className="text-xs uppercase tracking-[0.18em] text-ink-2">August 2026</p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={`size-1.5 rounded-full ${i === 0 ? 'bg-ink-2' : 'bg-line'}`} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-7 border-b border-line-soft">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
                <p key={d} className="border-r border-line-soft py-2 text-center text-[10px] tracking-[0.14em] text-ink-3 last:border-r-0">
                  {d}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {DAYS.map((d) => (
                <Cell key={d.n} day={d} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line-soft px-5 py-3">
              {LEGEND.map(([label, tone]) => (
                <span key={label} className="flex items-center gap-1.5 text-[11px] text-ink-3">
                  <Dot tone={tone} /> {label as ReactNode}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
