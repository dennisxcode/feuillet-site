import { Reveal } from './Reveal'

const PAPER_LINES = [
  { text: 'Maths : p.72, ex. 4 à 7', rot: -0.8 },
  { text: 'DM physique à remettre vendredi', rot: 0.6 },
  { text: 'Anglais : vocab quiz lundi', rot: -0.4 },
  { text: 'Réviser ch. 3 : examen jeudi !', rot: 0.9 },
]

const TASKS = [
  {
    title: 'Maths p.72, ex. 4 à 7',
    meta: 'MATH · due ven. 28 août',
    tone: 'accent' as const,
    delay: 200,
  },
  {
    title: 'Remettre le DM de physique',
    meta: 'PHYSIQUE · ven. 28 août',
    tone: 'accent' as const,
    delay: 350,
  },
  {
    title: 'Vocab quiz',
    meta: 'ANGLAIS · lun. 31 août',
    tone: 'info' as const,
    delay: 500,
  },
  {
    title: 'Examen : chapitre 3',
    meta: 'SCI · jeu. 27 août',
    tone: 'amber' as const,
    exam: true,
    delay: 650,
  },
]

const TONE_BG: Record<string, string> = {
  accent: 'bg-accent-soft text-accent',
  info: 'bg-info-soft text-info',
  amber: 'bg-amber-soft text-amber',
}

export function Capture() {
  return (
    <section id="capture" className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
        <Reveal>
          <p className="eyebrow eyebrow-rule">Capture</p>
          <h2 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight md:text-5xl">
            Photograph your agenda.
            <br />
            Get your week back.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-2">
            A photo of your paper agenda becomes real tasks with subjects, due dates and
            periods. French agendas included, because yours is one.
          </p>
          <p className="mt-8 text-sm text-ink-3">
            One photo every couple of days. That's the whole input.
          </p>
        </Reveal>

        <div className="relative">
          <Reveal className="relative z-10 w-[86%] rotate-[-2.5deg]">
            <div className="paper rounded-xl p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a8266]">
                Agenda · semaine 3
              </p>
              {PAPER_LINES.map((l) => (
                <p key={l.text} className="handwrite py-[5px] text-[17px]" style={{ transform: `rotate(${l.rot}deg)` }}>
                  {l.text}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={300} className="absolute right-0 top-14 z-20 w-[62%] rotate-[2deg]">
            <div className="card overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2 border-b border-line-soft px-4 py-2.5">
                <span className="size-2 rounded-full bg-danger/70" />
                <span className="size-2 rounded-full bg-amber/70" />
                <span className="size-2 rounded-full bg-accent/70" />
                <span className="ml-2 text-xs text-ink-3">This week</span>
              </div>
              <ul className="divide-y divide-line-soft">
                {TASKS.map((t) => (
                  <li key={t.title} className="flex items-start gap-3 px-4 py-3">
                    <span
                      className={`mt-1 size-3.5 shrink-0 rounded-[3px] border ${
                        t.exam ? 'border-amber/60' : 'border-line'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">{t.title}</p>
                      <p className="mt-1 flex items-center gap-2 text-[11px] tnum">
                        <span className={`rounded-xs px-1.5 py-0.5 ${TONE_BG[t.tone]}`}>
                          {t.meta.split(' · ')[0]}
                        </span>
                        <span className="text-ink-3">{t.meta.split(' · ')[1]}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div aria-hidden className="h-[420px] sm:h-[380px] md:h-[400px]" />
        </div>
      </div>
    </section>
  )
}
