import { FeuilletLeaf, FeuilletLogo } from './Logo'
import { RELEASES_URL, WEB_APP_URL } from './Nav'

const LEAVES = [
  { left: '12%', top: '22%', size: 15, dur: '9s', delay: '0s', op: 0.35 },
  { left: '22%', top: '58%', size: 11, dur: '12s', delay: '-3s', op: 0.22 },
  { left: '78%', top: '30%', size: 17, dur: '10s', delay: '-5s', op: 0.3 },
  { left: '86%', top: '64%', size: 12, dur: '13s', delay: '-2s', op: 0.24 },
  { left: '65%', top: '14%', size: 10, dur: '11s', delay: '-7s', op: 0.2 },
  { left: '33%', top: '76%', size: 14, dur: '14s', delay: '-9s', op: 0.26 },
]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-44 pb-28 text-center md:pt-56 md:pb-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 8%, rgba(143,174,134,0.13), transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-[0.13]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(240,237,231,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(240,237,231,0.05) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 75% 60% at 50% 20%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 20%, black 30%, transparent 75%)',
        }}
      />
      {LEAVES.map((l, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute animate-[drift_ease-in-out_infinite]"
          style={{
            left: l.left,
            top: l.top,
            opacity: l.op,
            animationDuration: l.dur,
            animationDelay: l.delay,
          }}
        >
          <FeuilletLeaf size={l.size} />
        </span>
      ))}

      <p className="eyebrow rise relative" style={{ animationDelay: '0.05s' }}>
        The all in one student app
      </p>

      <div
        className="rise relative mx-auto mt-8 w-fit"
        style={{ animationDelay: '0.18s' }}
      >
        <div
          aria-hidden
          className="absolute inset-x-8 top-1/2 -z-10 h-24 -translate-y-1/3 rounded-full blur-3xl"
          style={{ background: 'rgba(143,174,134,0.16)' }}
        />
        <FeuilletLogo height={110} className="mx-auto h-auto max-h-[24vw] max-w-[86vw]" />
      </div>

      <p
        className="rise relative mx-auto mt-9 max-w-xl px-6 text-lg leading-relaxed text-ink-2"
        style={{ animationDelay: '0.32s' }}
      >
        Assignments, exams, projects, grades and your calendar, gathered into one calm place.
        Check one thing at night instead of five.
      </p>

      <div
        className="rise relative mt-10 flex flex-wrap items-center justify-center gap-4"
        style={{ animationDelay: '0.45s' }}
      >
        <a href={RELEASES_URL} target="_blank" rel="noreferrer" className="btn-primary">
          Download for Mac
        </a>
        <a href="#capture" className="btn-ghost">
          Take the tour
        </a>
      </div>

      <p
        className="rise relative mt-6 text-xs tracking-wide text-ink-3 tnum"
        style={{ animationDelay: '0.55s' }}
      >
        Mac and web today. Phones next.
      </p>

      <a
        href="#problem"
        aria-label="Scroll to content"
        className="animate-cue absolute bottom-8 left-1/2 -translate-x-1/2 text-ink-3"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  )
}
