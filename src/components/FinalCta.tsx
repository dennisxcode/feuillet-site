import { FeuilletLogo } from './Logo'
import { GITHUB_URL, RELEASES_URL, WEB_APP_URL } from './Nav'
import { Reveal } from './Reveal'

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-line-soft py-32 text-center md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 55% 60% at 50% 100%, rgba(143,174,134,0.11), transparent 70%)',
        }}
      />
      <Reveal>
        <h2 className="font-display mx-auto max-w-3xl px-6 text-4xl leading-[1.04] tracking-tight md:text-6xl">
          Better than paper,
          <br />
          or not worth opening.
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p className="mx-auto mt-6 max-w-md px-6 text-base leading-relaxed text-ink-2">
          Built by a student who quit four planners. If it stops earning its place on the
          dock, it goes.
        </p>
      </Reveal>
      <Reveal delay={240} className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a href={RELEASES_URL} target="_blank" rel="noreferrer" className="btn-primary">
          Download for Mac
        </a>
        <a href={WEB_APP_URL} target="_blank" rel="noreferrer" className="btn-ghost">
          Open the web app
        </a>
      </Reveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line-soft py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-4">
          <FeuilletLogo height={16} className="text-ink-2" />
          <p className="text-xs text-ink-3 tnum">© 2026 Dennis Xue</p>
        </div>
        <nav className="flex items-center gap-6 text-xs text-ink-3">
          <a href={WEB_APP_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
            Web app
          </a>
          <a href={RELEASES_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
            Releases
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
