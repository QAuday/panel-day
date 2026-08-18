import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TeePlaceholder from './TeePlaceholder'
import './ProductGallery.css'

// Generic view angles every tee gets — not per-product content, just the
// standard shots a real photoshoot would produce. Used only until real
// photos are set on the product (via product.images).
const FALLBACK_VIEWS = ['Front', 'Back', 'Detail']
const SWIPE_THRESHOLD = 60

function ProductGallery({ images, label }) {
  const hasRealImages = Array.isArray(images) && images.length > 0

  const slides = useMemo(() => {
    if (hasRealImages) return images.map((src) => ({ type: 'image', src }))
    return FALLBACK_VIEWS.map((view) => ({ type: 'placeholder', view }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRealImages, images, label])

  const [activeIndex, setActiveIndex] = useState(0)
  const thumbRefs = useRef([])

  useEffect(() => {
    setActiveIndex(0)
  }, [label])

  useEffect(() => {
    const el = thumbRefs.current[activeIndex]
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeIndex])

  function goTo(index) {
    setActiveIndex((index + slides.length) % slides.length)
  }

  function handleDragEnd(_, info) {
    if (info.offset.x < -SWIPE_THRESHOLD) goTo(activeIndex + 1)
    else if (info.offset.x > SWIPE_THRESHOLD) goTo(activeIndex - 1)
  }

  const active = slides[activeIndex]
  const viewClass = active.type === 'placeholder' ? `product-gallery__slide--${active.view.toLowerCase()}` : ''

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className={`product-gallery__slide ${viewClass}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            drag={slides.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
          >
            {active.type === 'image' ? (
              <img src={active.src} alt={label} className="product-gallery__img" draggable={false} />
            ) : (
              <TeePlaceholder label={label} />
            )}
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="product-gallery__nav product-gallery__nav--prev"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className="product-gallery__nav product-gallery__nav--next"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {active.type === 'placeholder' && (
          <span className="product-gallery__view-label">{active.view}</span>
        )}
      </div>

      {slides.length > 1 && (
        <div className="product-gallery__thumbs" role="tablist" aria-label="Product images">
          {slides.map((slide, i) => (
            <button
              key={i}
              ref={(el) => (thumbRefs.current[i] = el)}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              className={`product-gallery__thumb ${i === activeIndex ? 'product-gallery__thumb--active' : ''}`}
              onClick={() => goTo(i)}
            >
              {slide.type === 'image' ? (
                <img src={slide.src} alt="" />
              ) : (
                <div
                  className={`product-gallery__thumb-placeholder product-gallery__thumb-placeholder--${slide.view.toLowerCase()}`}
                >
                  <TeePlaceholder label="" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGallery
