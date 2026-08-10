import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

const HeroScene = lazy(() => import('./HeroScene'))

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__inner container">
        <motion.div
          className="hero__content"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span variants={item} className="eyebrow hero__eyebrow">
            Original Graphic Tees
          </motion.span>

          <motion.h1 variants={item} className="hero__title">
            Every day is
            <br />
            a new panel
            <br />
            <span className="hero__title-accent">panel day</span>
          </motion.h1>

          <motion.p variants={item} className="hero__subtitle">
            No borrowed heroes. No licensed logos. Just original art, printed on
            premium cotton — because every day deserves its own panel.
          </motion.p>

          <motion.div variants={item} className="hero__actions">
            <a href="#collection" className="btn btn-invert">
              View the drop
            </a>
            <a href="#notify" className="btn hero__btn-outline">
              Get notified
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </motion.div>
      </div>

      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span className="hero__scroll-line" />
        Scroll
      </motion.div>
    </section>
  )
}

export default Hero
