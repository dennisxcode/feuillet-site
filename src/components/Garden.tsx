import { useEffect, useState } from 'react'
import { Reveal, SectionHead } from './Reveal'
import { useReveal } from '../lib/useReveal'

const LEAVES: Array<{ x: number; y: number; r: number; d: number }> = [
  { x: 166, y: 174, r: 10, d: 1.15 },
  { x: 148, y: 192, r: -30, d: 1.3 },
  { x: 96, y: 146, r: -160, d: 1.45 },
  { x: 114, y: 164, r: 140, d: 1.6 },
  { x: 138, y: 138, r: 0, d: 1.75 },
  { x: 148, y: 120, r: 24, d: 1.9 },
  { x: 134, y: 94, r: -8, d: 2.05 },
  { x: 162, y: 206, r: 40, d: 2.2 },
  { x: 116, y: 214, r: -50, d: 2.35 },
]

const LEAF_PATH = 'M0 0C10 -7 24 -5 28 8C16 17 3 12 0 0Z'

function useCount(target: number, on: boolean) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!on) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / 1100)
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [on, target])
  return v
}

export function Garden() {
  const { ref, on } = useReveal<HTMLDivElement>(0.4)
  const count = useCount(24, on)

  return (
    <section id="garden" className="border-t border-line-soft bg-panel py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
        <SectionHead
          eyebrow="The garden"
          title={
            <>
              Finished work
              <br />
              grows feuillets.
            </>
          }
          sub="Every finished thing earns a leaf and the sprig grows one more. No streaks to break, no quotas, no guilt when you rest. Just a quiet record that you did what you said you would."
        />

        <div ref={ref} className={`flex flex-col items-center ${on ? 'on' : ''}`}>
          <svg viewBox="0 0 260 300" className="w-56 md:w-64">
            <line x1="30" y1="274" x2="230" y2="274" stroke="var(--color-line)" strokeWidth="1" />
            <path
              d="M130 274C128 226 118 198 130 160C138 134 124 118 133 90"
              fill="none"
              stroke="var(--color-ink-2)"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={on ? 0 : 1}
              style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1) 0.1s' }}
            />
            <path
              d="M129 202C142 190 152 186 166 180"
              fill="none"
              stroke="var(--color-ink-3)"
              strokeWidth="3.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={on ? 0 : 1}
              style={{ transition: 'stroke-dashoffset 0.7s ease 0.9s' }}
            />
            <path
              d="M126 170C114 160 104 158 94 152"
              fill="none"
              stroke="var(--color-ink-3)"
              strokeWidth="3.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={on ? 0 : 1}
              style={{ transition: 'stroke-dashoffset 0.7s ease 1s' }}
            />
            {LEAVES.map((l, i) => (
              <g key={i} className="leafg" transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
                <path
                  d={LEAF_PATH}
                  fill="var(--color-accent)"
                  style={{ transitionDelay: `${l.d}s` }}
                />
              </g>
            ))}
          </svg>

          <p className="font-display mt-6 text-6xl tnum text-ink">{count}</p>
          <p className="mt-2 text-sm text-ink-3">feuillets this month</p>
        </div>
      </div>
    </section>
  )
}
