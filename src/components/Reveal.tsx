import type { ReactNode } from 'react'
import { useReveal } from '../lib/useReveal'

export function useRevealParent<T extends HTMLElement>() {
  return useReveal<T>(0.25)
}

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, on } = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`reveal ${on ? 'on' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string
  title: ReactNode
  sub?: string
}) {
  return (
    <Reveal className="max-w-xl">
      <p className="eyebrow eyebrow-rule">{eyebrow}</p>
      <h2 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-5 text-base leading-relaxed text-ink-2">{sub}</p>}
    </Reveal>
  )
}
