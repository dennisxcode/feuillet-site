import { Reveal, SectionHead } from './Reveal'

interface Subject {
  name: string
  mark: number
  klass: number
  lowest?: boolean
}

const SUBJECTS: Subject[] = [
  { name: 'Français', mark: 88, klass: 81 },
  { name: 'Maths', mark: 74, klass: 78 },
  { name: 'Chimie', mark: 62, klass: 71, lowest: true },
  { name: 'Histoire', mark: 91, klass: 85 },
]

const R = 36
const C = 2 * Math.PI * R

function Ring({ value }: { value: number }) {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
      <circle cx="48" cy="48" r={R} fill="none" stroke="var(--color-accent-dim)" strokeWidth="6" />
      <circle
        cx="48"
        cy="48"
        r={R}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={C * (1 - value)}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s' }}
      />
    </svg>
  )
}

function Bars({ mark, klass }: { mark: number; klass: number }) {
  return (
    <div className="w-24 shrink-0 space-y-1">
      <div className="h-1 rounded-full bg-line-soft">
        <div className="h-1 rounded-full bg-ink-2" style={{ width: `${mark}%` }} />
      </div>
      <div className="h-1 rounded-full bg-line-soft">
        <div className="h-1 rounded-full bg-line" style={{ width: `${klass}%` }} />
      </div>
    </div>
  )
}

export function Grades() {
  return (
    <section id="grades" className="border-t border-line-soft py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
        <SectionHead
          eyebrow="Grades"
          title={
            <>
              Know where you stand
              <br />
              before the bulletin does.
            </>
          }
          sub="Sign in to your school portal once. Marks arrive with the class average beside them, weighted by what each evaluation was worth. And every number shows its age, so a stale mark looks stale."
        />

        <Reveal delay={150}>
          <div className="card mx-auto max-w-md p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-ink-2">Étape 2</p>
              <p className="flex items-center gap-1.5 text-[11px] text-ink-3 tnum">
                <span className="size-1.5 rounded-full bg-accent" />
                Synced 4 min ago
              </p>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <div className="relative grid place-items-center">
                <Ring value={0.842} />
                <p className="font-display absolute text-2xl tnum">84.2%</p>
              </div>
              <div>
                <p className="text-sm text-ink-2">Weighted average</p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-xs bg-accent-soft px-2 py-1 text-xs text-accent tnum">
                  +3.4 depuis l'étape 1
                </p>
              </div>
            </div>

            <ul className="mt-7 divide-y divide-line-soft border-t border-line-soft pt-2">
              {SUBJECTS.map((s) => {
                const up = s.mark >= s.klass
                return (
                  <li key={s.name} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm text-ink">
                        {s.name}
                        {s.lowest && (
                          <span className="rounded-xs bg-amber-soft px-1.5 py-px text-[10px] text-amber">
                            lowest
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[11px] text-ink-3 tnum">
                        class {s.klass}%
                      </p>
                    </div>
                    <Bars mark={s.mark} klass={s.klass} />
                    <p className={`w-12 shrink-0 text-right text-sm tnum ${up ? 'text-accent' : 'text-danger'}`}>
                      {up ? '▲' : '▼'} {s.mark}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
          <p className="mx-auto mt-4 max-w-md text-center text-xs text-ink-3">
            Worst subject named first, not best. That's the point.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
