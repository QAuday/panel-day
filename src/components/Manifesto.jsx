import { motion } from 'framer-motion'
import './Manifesto.css'

function Manifesto() {
  return (
    <section id="story" className="manifesto">
      <div className="container manifesto__inner">
        <motion.span
          className="eyebrow manifesto__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Our Story
        </motion.span>

        <motion.h2
          className="manifesto__statement"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          We don&rsquo;t print
          <br />
          borrowed heroes.
          <br />
          <span className="manifesto__accent">We print original ones.</span>
        </motion.h2>

        <motion.p
          className="manifesto__body"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          Panel Day is built on a simple idea: your story doesn&rsquo;t need
          one big moment — it&rsquo;s written one day, one panel, at a time.
          Every design we print is drawn from scratch: no licensed
          characters, no borrowed logos. Just bold, original art on premium
          cotton, made for people who show up and draw their own panel, every
          day.
        </motion.p>
      </div>
    </section>
  )
}

export default Manifesto
