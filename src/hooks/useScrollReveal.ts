'use client'

import { useEffect, useRef } from 'react'

/**
 * useScrollReveal - Uses IntersectionObserver to add a 'revealed' class
 * when elements scroll into view. Elements with 'scroll-reveal' class start
 * at opacity:0.3 (visible even without JS), and animate to full visibility
 * when the 'revealed' class is added.
 */
export function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            // Once revealed, stop observing to avoid re-triggering
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    // Observe all elements with scroll-reveal classes
    const selectors = [
      '.scroll-reveal',
      '.scroll-reveal-left',
      '.scroll-reveal-right',
      '.scroll-reveal-scale',
    ]

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        observerRef.current?.observe(el)
      })
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])
}

/**
 * useScrollProgress - Simple scroll progress tracker that updates a CSS variable.
 * No Framer Motion dependency.
 */
export function useScrollProgress() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      document.documentElement.style.setProperty('--scroll-progress', `${progress * 100}%`)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}
