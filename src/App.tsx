import Boot from './components/Boot'
import ErrorBoundary from './components/ErrorBoundary'
import Frame from './components/Frame'
import Nav from './components/Nav'
import KalmanCursor from './components/KalmanCursor'
import Autopilot from './components/Autopilot'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Publications from './components/Publications'
import Connect from './components/Connect'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Boot />
      <Frame />
      <Nav />
      <ErrorBoundary><KalmanCursor /></ErrorBoundary>
      <ErrorBoundary><Autopilot /></ErrorBoundary>
      <main className="shell">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Publications />
        <Connect />
        <Footer />
      </main>
    </>
  )
}
