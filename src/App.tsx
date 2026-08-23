import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Problem } from './components/Problem'
import { Capture } from './components/Capture'
import { CalendarSection } from './components/CalendarSection'
import { Grades } from './components/Grades'
import { Connectors } from './components/Connectors'
import { Notch } from './components/Notch'
import { Garden } from './components/Garden'
import { Reminders } from './components/Reminders'
import { FinalCta, Footer } from './components/FinalCta'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Capture />
        <CalendarSection />
        <Grades />
        <Connectors />
        <Notch />
        <Garden />
        <Reminders />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
