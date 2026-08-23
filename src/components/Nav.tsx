import { useEffect, useState } from 'react'
import { FeuilletLogo } from './Logo'

export const WEB_APP_URL = 'https://feuillet-theta.vercel.app'
export const RELEASES_URL = 'https://github.com/dennisxcode/feuillet-releases/releases/latest'
export const GITHUB_URL = 'https://github.com/dennisxcode/feuillet'

const LINKS = [
  { href: '#capture', label: 'Capture' },
  { href: '#calendar', label: 'Calendar' },
  { href: '#grades', label: 'Grades' },
  { href: '#sources', label: 'Sources' },
  { href: '#mac', label: 'Mac' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line-soft bg-canvas/80 backdrop-blur-md' : ''
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" aria-label="Feuillet home">
          <FeuilletLogo height={20} className="text-ink" />
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={WEB_APP_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm text-ink-2 transition-colors hover:text-ink sm:block"
          >
            Open web app
          </a>
          <a
            href={RELEASES_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-accent px-3.5 py-1.5 text-sm text-[#10130f] transition hover:brightness-110"
          >
            Download
          </a>
        </div>
      </div>
    </header>
  )
}
