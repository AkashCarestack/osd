import Router from 'next/router'
import { useEffect, useRef,useState } from 'react'

import styles from './progressBar.module.scss'

export default function Progress() {
  const timerRef: any = useRef(null)
  const previousUrlRef = useRef('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = (url: any) => {
      if (url !== previousUrlRef.current) {
        // Suppress progress bar for topic redirects (e.g., /topic/slug -> /topic/slug/content)
        const isTopicRedirect = previousUrlRef.current.includes('/topic/') && 
                                 url.includes('/topic/') && 
                                 url.split('/').length > previousUrlRef.current.split('/').length
        
        if (!isTopicRedirect) {
          previousUrlRef.current = url
          setProgress(1)
          increment()
        } else {
          // Update previousUrlRef but don't show progress
          previousUrlRef.current = url
        }
      }
    }

    const increment = () => {
      const timeout = 100
      setProgress((prevProgress) => {
        const percent = Math.round(prevProgress + Math.random() * 10)
        const next = Math.min(prevProgress + percent, 80)
        if (next < 80) {
          timerRef.current = setTimeout(increment, timeout)
          return next
        }
        return 80
      })
    }

    const complete = () => {
      clearTimeout(timerRef.current)
      setProgress(100)

      setTimeout(() => {
        setProgress(0)
      }, 250)
    }

    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', complete)
    Router.events.on('routeChangeError', complete)

    return () => {
      clearTimeout(timerRef.current)
      Router.events.off('routeChangeStart', start)
      Router.events.off('routeChangeComplete', complete)
      Router.events.off('routeChangeError', complete)
    }
  }, [])

  return (
    <div className={`${styles['progress']}`}>
      <div
        className={styles.indicator}
        style={{
          width: `${progress}%`,
          opacity: progress > 0 && progress < 100 ? 1 : 0,
        }}
      />
    </div>
  )
}
