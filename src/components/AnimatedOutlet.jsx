import { useEffect, useRef, useState } from 'react'
import { useOutlet, useLocation, useNavigationType } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getRouteMeta } from '../config/appShell'

const MOBILE_QUERY = '(max-width: 720px)'

const fadeVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const slideVariants = {
  forward: {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-30%' },
  },
  back: {
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '30%' },
  },
}

function AnimatedOutlet() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const element = useOutlet()
  const prevPathRef = useRef(location.pathname)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const prevPath = prevPathRef.current
  useEffect(() => {
    prevPathRef.current = location.pathname
  }, [location.pathname])

  let variants = fadeVariants
  if (isMobile) {
    const prevIsTabRoot = getRouteMeta(prevPath).mode === 'brand'
    const currentIsTabRoot = getRouteMeta(location.pathname).mode === 'brand'
    const isTabSwitch = prevIsTabRoot && currentIsTabRoot
    if (!isTabSwitch) {
      variants = navigationType === 'POP' ? slideVariants.back : slideVariants.forward
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimatedOutlet
