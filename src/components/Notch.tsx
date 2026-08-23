import { useEffect, useState } from 'react'
import { Reveal } from './Reveal'
import { FeuilletLeaf } from './Logo'
import { useReveal } from '../lib/useReveal'

function Checkbox({ done }: { done?: boolean }) {
  return (
    <span
      className={`grid size-[15px] shrink-0 place-items-center rounded-[4px] border transition ${
        done ? 'border-accent bg-accent text-[#10130f]' : 'border-line'
      }`}
    >
      {done && (
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.5l2.5 2.5 4.5-6" />
        </svg>
      )}
    </span>
  )
}

const UP_NEXT = [
  { title: 'Maths p.72 ex. 4 à 7', meta: 'due ven.', done: true },
  { title: 'Read history ch. 4', meta: 'due sam.', done: false },
  { title: 'Physics DM', meta: 'due lun.', done: false },
]

export function Notch() {
  const { ref, on } = useReveal<HTMLDivElement>(0.35)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!on) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOpen(true)
      return
    }
    let alive = true
    let t: number | undefined
    const run = (o: boolean) => {
      setOpen(o)
      t = window.setTimeout(() => {
        if (alive) run(!o)
      }, o ? 4200 : 2000)
    }
    t = window.setTimeout(() => {
      if (alive) run(true)
    }, 800)
    return () => {
      alive = false
      if (t !== undefined) window.clearTimeout(t)
    }
  }, [on])

  return (
    <section id="mac" className="overflow-hidden border-t border-line-soft py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-5">
        <Reveal className="md:col-span-2">
          <p className="eyebrow eyebrow-rule">On the Mac</p>
          <h2 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight md:text-5xl">
            A panel that lives in your notch.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-2">
            Peek at what's next without opening anything. Tick the top three from the top of
            your screen, catch your lowest subject before it slips, watch a study block count
            down.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            When you're done it gathers away like a genie.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {['Up next', 'Grades', 'Tree', 'Mirror', 'Timer'].map((c) => (
              <span key={c} className="rounded-md border border-line px-2.5 py-1 text-xs text-ink-3">
                {c}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150} className="md:col-span-3">
          <div
            ref={ref}
            className="relative mx-auto aspect-[16/10] max-w-xl overflow-hidden rounded-[28px] border border-line"
            style={
              {
                '--pbg': open ? '#201d18' : '#000000',
                background:
                  'radial-gradient(ellipse 90% 70% at 20% 0%, rgba(143,174,134,0.10), transparent 60%), radial-gradient(ellipse 80% 70% at 90% 100%, rgba(171,143,206,0.07), transparent 60%), #121110',
              } as React.CSSProperties
            }
          >
            <div className="absolute inset-x-0 top-0 z-30 flex h-7 items-center justify-between px-5 text-[11px] text-ink-3 tnum">
              <FeuilletLeaf size={11} />
              <p>jeu. 27 août&ensp;&ensp;21:47</p>
            </div>

            <div className="absolute inset-x-0 bottom-3 z-10 mx-auto flex w-fit gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="size-8 rounded-lg border border-white/[0.06] bg-white/[0.04]" />
              ))}
            </div>

            <div
              className="absolute left-1/2 top-0 z-20 -translate-x-1/2"
              style={{ '--pbg': open ? '#201d18' : '#000000' } as React.CSSProperties}
            >
              <div
                className="pcorner"
                style={{
                  left: '-15px',
                  background: 'radial-gradient(circle 15px at 0% 100%, transparent 14.5px, var(--pbg) 15px)',
                }}
              />
              <div
                className="pcorner"
                style={{
                  right: '-15px',
                  background: 'radial-gradient(circle 15px at 100% 100%, transparent 14.5px, var(--pbg) 15px)',
                }}
              />
              <div
                className="relative overflow-hidden"
                style={{
                  width: open ? 'min(400px, 76vw)' : '180px',
                  height: open ? 334 : 30,
                  background: open ? 'var(--color-surface-2)' : '#000',
                  borderRadius: open ? '0 0 22px 22px' : '0 0 14px 14px',
                  boxShadow: open ? '0 30px 60px -18px rgba(0,0,0,0.7)' : 'none',
                  transition: open
                    ? 'width 0.55s cubic-bezier(0.32,0.72,0.24,1), height 0.55s cubic-bezier(0.32,0.72,0.24,1) 0.1s, background-color 0.4s ease'
                    : 'height 0.5s cubic-bezier(0.55,0,0.85,0.36), width 0.5s cubic-bezier(0.55,0,0.85,0.36) 0.12s, background-color 0.4s ease',
                }}
              >
                <div
                  className="flex h-full flex-col gap-3 px-5 pb-4 pt-9"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? 'none' : 'translateY(6px)',
                    transition: open
                      ? 'opacity 0.35s ease 0.32s, transform 0.35s ease 0.32s'
                      : 'opacity 0.15s ease, transform 0.15s ease',
                  }}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-3">Up next</p>
                    <ul className="mt-2 space-y-1.5">
                      {UP_NEXT.map((t) => (
                        <li key={t.title} className={`flex items-center gap-2.5 text-[13px] ${t.done ? 'text-ink-3 line-through decoration-ink-3/60' : 'text-ink'}`}>
                          <Checkbox done={t.done} />
                          <span className="truncate">{t.title}</span>
                          <span className="ml-auto shrink-0 text-[10px] text-ink-3 tnum">{t.meta}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-line-soft pt-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-3">Lowest right now</p>
                    <p className="mt-1.5 flex items-baseline gap-2 text-[13px]">
                      <span className="text-danger">Chimie 62%</span>
                      <span className="text-[11px] text-ink-3 tnum">class 71%</span>
                      <span className="ml-auto rounded-xs bg-amber-soft px-1.5 py-0.5 text-[10px] text-amber">exam jeu.</span>
                    </p>
                  </div>

                  <div className="mt-auto flex items-center gap-2 border-t border-line-soft pt-3">
                    <FeuilletLeaf size={13} />
                    <p className="text-[12px] text-ink-2">
                      <span className="text-accent tnum">12</span> feuillets this week
                    </p>
                    <svg className="ml-auto text-ink-3" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs tracking-wide text-ink-3">
            Width first, height a beat behind. The same hinge the real panel opens with.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
