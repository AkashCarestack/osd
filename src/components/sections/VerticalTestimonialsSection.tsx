import Image from 'next/image'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Anchor from '~/components/commonSections/Anchor'
import ImageLoader from '~/components/commonSections/ImageLoader'
import { VideoModal } from '~/components/commonSections/VideoModal'
import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

/** Fallback header when section fields are empty */
const DEFAULT_VERTICAL_TESTIMONIAL_HEADER = {
  eyebrow: 'Testimonials',
  heading: 'Trusted by Business Owners and Staff Members',
  description:
    'OS Dental streamlines workflows and facilitates quick decision making. Our customers love us, as is evidenced by their testimonials.',
} as const

export interface VerticalTestimonialItem {
  _id: string
  name?: string
  slug?: string
  testimonialOrder?: number
  designation?: string
  practiceName?: string
  region?: string
  keyStatement?: string
  mainStatement?: string
  subStatement?: string
  logoWhite?: string
  logoColored?: string
  cardBackgroundImage?: string
  cardBackgroundImageHover?: string
  /** Image URL (poster) or direct video file URL for hover — see cmsItemToSlide */
  videoThumbnailUrl?: string
  verticalVideoUrl?: string
  horizontalVideos?: {
    _id?: string
    title?: string
    platform?: 'youtube' | 'vimeo' | 'vidyard'
    videoId?: string
  }[]
}

export interface VerticalTestimonialSectionData {
  eyebrow?: string
  heading?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  items?: VerticalTestimonialItem[] | null
}

/** Slide shape consumed by the slider (maps from CMS + reference-video pattern). */
interface SlideLogo {
  _id: string
  name?: string
  designation?: string
  practiceName?: string
  place?: string
  keyStatement?: string
  mainStatement?: string
  subStatement?: string
  primaryLogo?: { url?: string }
  secondaryLogo?: { url?: string }
  /** Sanity portrait (card background; falls back to secondary hover image in CMS) */
  cardPortraitUrl?: string
  /** Optional URL poster on top of portrait (video thumbnail URL field) */
  posterOverrideUrl?: string
  /** posterOverrideUrl || cardPortraitUrl (legacy single field) */
  imageThumbnail?: string
  /** MP4 URL for hover preview */
  thumbnail?: string
  /** First linked Videos doc title (modal iframe title) */
  modalVideoTitle?: string
  /** YouTube / Vimeo / Vidyard — click opens VideoModal (matches CMS copy). */
  embedVideo?: {
    platform: 'youtube' | 'vimeo' | 'vidyard'
    videoId: string
  } | null
}

function sortItems(items: VerticalTestimonialItem[]) {
  return [...items].sort(
    (a, b) => (a.testimonialOrder ?? 0) - (b.testimonialOrder ?? 0),
  )
}

function sanitizeMediaUrl(url: unknown): string {
  if (typeof url !== 'string') return ''
  return url.trim()
}

/** True when the URL field points at a file we should play in the hover <video> (not a poster image). */
function isLikelyVideoAssetUrl(url: string): boolean {
  const u = url.trim().toLowerCase()
  if (!u) return false
  const path = u.split(/[?#]/)[0] ?? u
  if (/\.(mp4|webm|mov|m4v|ogv|ogg)$/i.test(path)) return true
  if (/[?&]format=(mp4|webm|mov)\b/i.test(u)) return true
  return false
}

function videoMimeTypeForUrl(url: string): string {
  const path = url.trim().split(/[?#]/)[0]?.toLowerCase() ?? ''
  if (path.endsWith('.webm')) return 'video/webm'
  if (path.endsWith('.ogg') || path.endsWith('.ogv')) return 'video/ogg'
  if (path.endsWith('.mov')) return 'video/quicktime'
  return 'video/mp4'
}

function cmsItemToSlide(item: VerticalTestimonialItem): SlideLogo {
  const hv = item.horizontalVideos?.[0]
  let embedVideo: SlideLogo['embedVideo'] = null

  if (hv != null && hv.videoId != null) {
    const rawId = String(hv.videoId).trim()
    if (rawId) {
      const p = String(hv.platform ?? '')
        .toLowerCase()
        .trim()
      const youtubeFromUrl = extractYoutubeVideoId(rawId)
      if (p === 'youtube' || (!p && youtubeFromUrl)) {
        const id = p === 'youtube' ? extractYoutubeVideoId(rawId) : youtubeFromUrl
        if (id) embedVideo = { platform: 'youtube', videoId: id }
      } else if (p === 'vimeo' || p === 'vidyard') {
        embedVideo = { platform: p, videoId: rawId }
      }
    }
  }

  const rawVideoThumbUrl = sanitizeMediaUrl(item.videoThumbnailUrl)
  const verticalFileUrl = sanitizeMediaUrl(item.verticalVideoUrl)

  let posterOverride = ''
  /** Hover <video> src: vertical file, unless URL field is a direct video asset (then URL wins). */
  let hoverVideoUrl = verticalFileUrl

  if (rawVideoThumbUrl) {
    if (isLikelyVideoAssetUrl(rawVideoThumbUrl)) {
      hoverVideoUrl = rawVideoThumbUrl
    } else {
      posterOverride = rawVideoThumbUrl
    }
  }

  const cardPortrait =
    sanitizeMediaUrl(item.cardBackgroundImage) ||
    sanitizeMediaUrl(item.cardBackgroundImageHover) ||
    ''

  return {
    _id: item._id,
    name: item.name,
    designation: item.designation,
    practiceName: item.practiceName,
    place: item.region,
    keyStatement: item.keyStatement,
    mainStatement: item.mainStatement,
    subStatement: item.subStatement,
    primaryLogo: item.logoColored ? { url: item.logoColored } : undefined,
    secondaryLogo: item.logoWhite ? { url: item.logoWhite } : undefined,
    cardPortraitUrl: cardPortrait || undefined,
    posterOverrideUrl: posterOverride || undefined,
    imageThumbnail: posterOverride || cardPortrait || '',
    thumbnail: hoverVideoUrl,
    modalVideoTitle:
      typeof hv?.title === 'string' ? hv.title.trim() : undefined,
    embedVideo,
  }
}

function youtubeIdFromEmbed(logo: SlideLogo): string {
  if (logo.embedVideo?.platform !== 'youtube') return ''
  return (
    extractYoutubeVideoId(logo.embedVideo.videoId) ||
    logo.embedVideo.videoId.trim()
  )
}

function extractYoutubeVideoId(raw: string | undefined | null): string {
  if (raw == null || typeof raw !== 'string') return ''
  const s = raw.trim()
  if (!s) return ''
  if (/^[a-zA-Z0-9_-]{6,32}$/.test(s)) return s
  try {
    const u = new URL(s.includes('://') ? s : `https://${s}`)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : ''
    }
    const v = u.searchParams.get('v')
    if (v && /^[a-zA-Z0-9_-]+$/.test(v)) return v
    const parts = u.pathname.split('/').filter(Boolean)
    const embedI = parts.indexOf('embed')
    if (embedI >= 0 && parts[embedI + 1]) {
      const id = parts[embedI + 1]
      return /^[a-zA-Z0-9_-]+$/.test(id) ? id : ''
    }
    const shortsI = parts.indexOf('shorts')
    if (shortsI >= 0 && parts[shortsI + 1]) {
      const id = parts[shortsI + 1]
      return /^[a-zA-Z0-9_-]+$/.test(id) ? id : ''
    }
  } catch {
    /* ignore */
  }
  return ''
}

type YoutubeThumbTier = 'maxres' | 'sd' | 'hq'

function youtubeStillImageUrl(videoId: string, tier: YoutubeThumbTier): string {
  const id = videoId.trim()
  if (!id) return ''
  const file =
    tier === 'maxres'
      ? 'maxresdefault'
      : tier === 'sd'
        ? 'sddefault'
        : 'hqdefault'
  return `https://i.ytimg.com/vi/${id}/${file}.jpg`
}

function youtubePosterUrl(videoId: string | undefined) {
  if (!videoId || typeof videoId !== 'string') return ''
  return youtubeStillImageUrl(videoId, 'maxres')
}

/** next/image fill poster — removes itself on error so no broken-image icon over the card */
function SafeFillPosterImage({
  src,
  className,
  sizes,
  quality = 90,
  unoptimized,
}: {
  src: string
  className?: string
  sizes: string
  quality?: number
  unoptimized?: boolean
}) {
  const [failed, setFailed] = useState(false)
  if (!src.trim() || failed) return null
  return (
    <Image
      src={src}
      fill
      className={className}
      sizes={sizes}
      quality={quality}
      alt=""
      unoptimized={unoptimized}
      onError={() => setFailed(true)}
    />
  )
}

function YoutubePosterImage({
  videoId,
  className,
  alt,
  visible,
}: {
  videoId: string
  className?: string
  alt: string
  visible: boolean
}) {
  const [tier, setTier] = useState<YoutubeThumbTier | 'off'>('maxres')

  useEffect(() => {
    setTier('maxres')
  }, [videoId])

  if (tier === 'off') return null

  return (
    <Image
      src={youtubeStillImageUrl(videoId, tier as YoutubeThumbTier)}
      onError={() => {
        setTier((t) => {
          if (t === 'maxres') return 'sd'
          if (t === 'sd') return 'hq'
          return 'off'
        })
      }}
      fill
      className={`absolute inset-0 object-cover z-0 ${className ?? ''} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      alt={alt}
      sizes="(max-width: 640px) 92vw, min(480px, 33vw)"
      quality={90}
    />
  )
}

function youtubeHoverPreviewSrc(videoId: string) {
  const id = encodeURIComponent(videoId.trim())
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`
}

function youtubeInlinePlaySrc(videoId: string) {
  const id = encodeURIComponent(videoId.trim())
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=1`
}

const youtubeIframeCoverStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  transform: 'scale(1.25)',
  transformOrigin: 'center center',
  border: 'none',
  backgroundColor: 'transparent',
}

/** Muted autoplay preview; stays inside the 9:16 card (no opacity gate — YouTube often never fires onLoad). */
function YoutubeHoverPreviewLayer({ videoId }: { videoId: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      <div className="relative h-full w-full overflow-hidden bg-black">
        <iframe
          title="YouTube hover preview"
          src={youtubeHoverPreviewSrc(videoId)}
          className="border-0 opacity-100"
          style={youtubeIframeCoverStyle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  )
}

function testimonialQuoteFromSlide(logo: SlideLogo): string {
  if (logo.keyStatement?.trim()) return logo.keyStatement.trim()
  if (logo.mainStatement?.trim()) return logo.mainStatement.trim()
  if (logo.subStatement?.trim()) return logo.subStatement.trim()
  return ''
}

const PrevArrow = ({ onClick, currentSlide }: any) => {
  const isDisabled = currentSlide === 0
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`w-10 h-10 sm:w-12 sm:h-12 bg-white border border-zinc-200 flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-0 sm:-left-4 z-10 rounded-md ${
        isDisabled
          ? 'pointer-events-none opacity-50'
          : 'hover:bg-zinc-50 transition-colors'
      }`}
      aria-label="Previous"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M15.8333 10H4.16658"
          stroke="#030712"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 4.16699L4.16667 10.0003L10 15.8337"
          stroke="#030712"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

const NextArrow = ({
  onClick,
  currentSlide,
  slideCount,
  slidesToShow = 1,
}: any) => {
  const isDisabled =
    slideCount <= slidesToShow || currentSlide >= slideCount - slidesToShow
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`w-10 h-10 sm:w-12 sm:h-12 bg-white border border-zinc-200 flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-0 sm:-right-4 z-10 rounded-md ${
        isDisabled
          ? 'pointer-events-none opacity-50'
          : 'hover:bg-zinc-50 transition-colors'
      }`}
      aria-label="Next"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M4.16675 10H15.8334"
          stroke="#030712"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 4.16699L15.8333 10.0003L10 15.8337"
          stroke="#030712"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

const ArrowUpRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    aria-hidden="true"
  >
    <path
      d="M4 12L12 4M12 4H6M12 4V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

interface TestimonialSliderProps {
  slides: SlideLogo[]
  settings: any
  isSliding?: boolean
  hideLogo?: boolean
  onOpenVideoModal?: (v: {
    platform: 'youtube' | 'vimeo' | 'vidyard'
    videoId: string
    title: string
  }) => void
}

const TestimonialSlider = ({
  slides,
  settings,
  hideLogo = false,
  isSliding = false,
  onOpenVideoModal,
}: TestimonialSliderProps) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null)
  const [inlineYoutubeSlideIndex, setInlineYoutubeSlideIndex] = useState<
    number | null
  >(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const handleVideoPlay = (index: number) => {
    const video = videoRefs.current[index]
    if (video) {
      video.currentTime = 0
      void video.play().catch(() => {})
    }
  }

  const handleCardClick = (index: number, logo: SlideLogo) => {
    if (logo.embedVideo?.platform === 'youtube' && youtubeIdFromEmbed(logo)) {
      setInlineYoutubeSlideIndex((cur) => (cur === index ? null : index))
      setActiveVideoIndex(null)
      return
    }
    if (
      logo.embedVideo &&
      onOpenVideoModal &&
      (logo.embedVideo.platform === 'vimeo' ||
        logo.embedVideo.platform === 'vidyard')
    ) {
      const title =
        logo.modalVideoTitle?.trim() ||
        logo.name?.trim() ||
        'Video'
      onOpenVideoModal({
        platform: logo.embedVideo.platform,
        videoId: logo.embedVideo.videoId,
        title,
      })
      return
    }
    const video = videoRefs.current[index]
    if (video) {
      video.currentTime = 0
      video.play().catch(() => {})
    }
  }

  const mergedSliderSettings = useMemo(() => {
    const { beforeChange, ...rest } = settings
    return {
      ...rest,
      beforeChange: (...args: unknown[]) => {
        setInlineYoutubeSlideIndex(null)
        setActiveVideoIndex(null)
        videoRefs.current.forEach((v) => {
          if (v) {
            v.pause()
            v.currentTime = 0
          }
        })
        beforeChange?.(...args)
      },
    }
  }, [settings])

  if (!slides.length) return null

  return (
    <div
      className={`vertical-testimonial-slider relative mx-auto min-h-[520px] w-full max-w-[960px] bg-white [&_.slick-slide>div]:flex [&_.slick-slide>div]:justify-center ${
        isSliding ? 'vertical-testimonial-slider--animating' : ''
      }`}
    >
      <Slider {...mergedSliderSettings}>
        {slides.map((logo, i) => {
          const youtubeId = youtubeIdFromEmbed(logo)
          const cardPortrait = sanitizeMediaUrl(logo.cardPortraitUrl)
          const posterOverride = sanitizeMediaUrl(logo.posterOverrideUrl)
          const ytPoster = youtubePosterUrl(youtubeId)
          const mp4Url = sanitizeMediaUrl(logo?.thumbnail)
          const hasMp4HoverPreview = mp4Url.length > 0
          const useYtGeneratedPoster =
            Boolean(youtubeId) && !cardPortrait && !posterOverride
          const showPosterStack =
            Boolean(cardPortrait || posterOverride || useYtGeneratedPoster)
          const showMp4Hover = hasMp4HoverPreview
          const showYtHoverPreview = Boolean(youtubeId) && !hasMp4HoverPreview
          const showYtIframeHover =
            showYtHoverPreview &&
            activeVideoIndex === i &&
            inlineYoutubeSlideIndex !== i
          const hidePosterForHoverVideo =
            activeVideoIndex === i &&
            (showMp4Hover || showYtHoverPreview) &&
            inlineYoutubeSlideIndex !== i
          /** Hide floating “Play” chip while hover preview is actually playing */
          const hideHoverPlayChip =
            activeVideoIndex === i &&
            (showMp4Hover || showYtHoverPreview) &&
            inlineYoutubeSlideIndex !== i
          const quoteSnippet = testimonialQuoteFromSlide(logo)
          const hasHoverVideo = Boolean(youtubeId) || hasMp4HoverPreview
          const hasClickVideo =
            Boolean(logo.embedVideo) || hasMp4HoverPreview
          const overlayLogoUrl = sanitizeMediaUrl(
            logo?.secondaryLogo?.url || logo?.primaryLogo?.url || '',
          )

          return (
            <div
              key={logo._id}
              className={`min-h-[500px] px-1 ${
                hasClickVideo ? 'group cursor-pointer' : 'cursor-default'
              }`}
              onMouseEnter={() => {
                setInlineYoutubeSlideIndex((cur) =>
                  cur != null && cur !== i ? null : cur,
                )
                if (inlineYoutubeSlideIndex === i) return
                if (!hasHoverVideo || isSliding) return
                if (hasMp4HoverPreview) {
                  videoRefs.current.forEach((v, idx) => {
                    if (idx !== i && v) {
                      v.pause()
                      v.currentTime = 0
                    }
                  })
                  setActiveVideoIndex(i)
                  const video = videoRefs.current[i]
                  if (video) {
                    const sameSlideStillActive = activeVideoIndex === i
                    const keepTimeline =
                      sameSlideStillActive ||
                      (!video.paused && video.currentTime > 0)
                    if (keepTimeline) {
                      void video.play().catch(() => {})
                    } else {
                      video.currentTime = 0
                      void video.play().catch(() => {})
                    }
                  }
                  return
                }
                if (youtubeId) {
                  // Do not pause sibling MP4s — brief hover on a YouTube card was killing the neighbor clip.
                  setActiveVideoIndex(i)
                }
              }}
              onClick={() => {
                if (!hasClickVideo || isSliding) return
                handleCardClick(i, logo)
              }}
            >
              <div className="relative flex aspect-[9/16] min-h-[500px] w-full max-w-[400px] flex-col justify-center overflow-hidden rounded-2xl shadow-md">
                <div className="relative h-full w-full bg-zinc-900">
                  {inlineYoutubeSlideIndex === i && youtubeId ? (
                    <div className="absolute inset-0 z-[20] overflow-hidden rounded-2xl bg-black">
                      <iframe
                        title={
                          logo.modalVideoTitle ||
                          logo.name ||
                          'Video'
                        }
                        src={youtubeInlinePlaySrc(youtubeId)}
                        style={youtubeIframeCoverStyle}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        className="border-0"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  ) : null}
                  {showPosterStack ? (
                    <>
                      {cardPortrait ? (
                        <SafeFillPosterImage
                          src={cardPortrait}
                          className={`absolute z-0 object-cover ${
                            hidePosterForHoverVideo
                              ? 'opacity-0'
                              : 'opacity-100'
                          } ${
                            isSliding || hidePosterForHoverVideo
                              ? ''
                              : 'transition-opacity duration-100 ease-out'
                          }`}
                          sizes="(max-width: 640px) 92vw, min(400px, 33vw)"
                          quality={90}
                          unoptimized={
                            !cardPortrait.includes('cdn.sanity.io')
                          }
                        />
                      ) : null}
                      {posterOverride ? (
                        <SafeFillPosterImage
                          src={posterOverride}
                          className={`absolute object-cover ${
                            cardPortrait ? 'z-[1]' : 'z-0'
                          } ${
                            hidePosterForHoverVideo
                              ? 'opacity-0'
                              : 'opacity-100'
                          } ${
                            isSliding || hidePosterForHoverVideo
                              ? ''
                              : 'transition-opacity duration-100 ease-out'
                          }`}
                          sizes="(max-width: 640px) 92vw, min(400px, 33vw)"
                          quality={90}
                          unoptimized={
                            !posterOverride.includes('cdn.sanity.io')
                          }
                        />
                      ) : null}
                      {useYtGeneratedPoster && youtubeId ? (
                        <div className="absolute inset-0 z-0">
                          <YoutubePosterImage
                            videoId={youtubeId}
                            visible={!hidePosterForHoverVideo}
                            className="object-cover"
                            alt=""
                          />
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  {showYtIframeHover && youtubeId ? (
                    <YoutubeHoverPreviewLayer
                      key={`yt-hover-${youtubeId}`}
                      videoId={youtubeId}
                    />
                  ) : null}

                  {showMp4Hover ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el
                      }}
                      poster={
                        posterOverride ||
                        cardPortrait ||
                        ytPoster ||
                        undefined
                      }
                      style={{
                        backgroundColor: 'transparent',
                        objectFit: 'cover',
                      }}
                      className={`absolute z-[2] inset-0 h-full w-full min-h-full min-w-full object-cover ${
                        activeVideoIndex === i
                          ? 'opacity-100'
                          : 'opacity-0 transition-opacity duration-100 ease-out'
                      }`}
                      loop
                      muted
                      playsInline
                      preload="auto"
                    >
                      <source src={mp4Url} type={videoMimeTypeForUrl(mp4Url)} />
                    </video>
                  ) : null}

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_100%),linear-gradient(180deg,rgba(0,0,0,0)_0%,#000_100%)]">
                    <div className="w-full">
                      <div
                        className={`flex flex-col gap-3 group-hover:opacity-0 group-hover:pointer-events-none ${
                          isSliding ? '' : 'transition-opacity duration-200'
                        }`}
                      >
                        {!hideLogo && overlayLogoUrl.length > 0 && (
                          <div className="flex h-12 w-full min-h-0 max-w-[min(100%,280px)] items-end justify-start">
                            <ImageLoader
                              image={overlayLogoUrl}
                              className="relative h-12 w-full"
                              alt="Company logo"
                              imageClassName="!object-contain !object-left !object-bottom"
                            />
                          </div>
                        )}

                        {quoteSnippet ? (
                          <h3 className="line-clamp-4 text-base font-medium leading-[140%] xl:text-lg font-manrope">
                            &ldquo;{quoteSnippet}&rdquo;
                          </h3>
                        ) : null}
                        <div className="h-px w-full bg-white/20" />
                        <span>
                          {logo?.name ? (
                            <p className="text-sm font-medium xl:text-base font-manrope">
                              {logo.name}
                            </p>
                          ) : null}
                          {(() => {
                            const sub = [
                              logo?.designation,
                              logo?.practiceName,
                              logo?.place,
                            ]
                              .filter(
                                (v) =>
                                  typeof v === 'string' &&
                                  v.trim().length > 0,
                              )
                              .join(' · ')
                            return sub ? (
                              <p className="text-sm text-white/70 font-inter">
                                {sub}
                              </p>
                            ) : null
                          })()}
                        </span>
                      </div>

                        {hasClickVideo ? (
                          <div
                            className={`pointer-events-none absolute inset-0 flex items-end justify-center pb-6 ${
                              hideHoverPlayChip
                                ? 'opacity-0'
                                : 'opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100'
                            } ${
                              isSliding ? '' : 'transition-all duration-100 ease-out'
                            }`}
                          >
                            <span className="rounded-full flex items-center gap-2 border border-white/20 bg-black/30 text-white px-4 py-2 text-sm font-medium font-inter backdrop-blur-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="16"
                              viewBox="0 0 17 16"
                              fill="none"
                              className="shrink-0"
                              aria-hidden
                            >
                              <path
                                d="M3.5 3.73c0-.27.07-.53.21-.76.13-.23.33-.42.57-.55.24-.13.5-.2.77-.19.27.01.53.09.77.23l6.7 4.27c.21.13.39.32.51.54.12.23.19.48.19.74 0 .26-.07.52-.19.74-.12.22-.3.41-.51.54l-6.7 4.27c-.23.15-.49.23-.76.24-.27.01-.53-.06-.77-.19-.24-.13-.44-.32-.57-.55-.14-.23-.21-.49-.21-.76V3.73Z"
                                fill="white"
                              />
                            </svg>
                            Play
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

const VerticalTestimonialsSection: React.FC<{
  data?: VerticalTestimonialSectionData | null
  /** Pearl-style LP: centered title block (Curve). */
  headerLayout?: 'split' | 'centered'
}> = ({ data, headerLayout = 'split' }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(3)
  const [showArrows, setShowArrows] = useState(true)
  const [isSliding, setIsSliding] = useState(false)
  const [embedModal, setEmbedModal] = useState<{
    platform: 'youtube' | 'vimeo' | 'vidyard'
    videoId: string
    title: string
  } | null>(null)

  const rawItems = sortItems((data?.items || []).filter(Boolean))
  const slides = rawItems.map(cmsItemToSlide)

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      if (w >= 1280) setSlidesToShow(3)
      else if (w >= 768) setSlidesToShow(2)
      else setSlidesToShow(1)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setShowArrows(slides.length > slidesToShow)
  }, [slides.length, slidesToShow])

  if (!data) return null

  const headingText =
    data.heading?.trim() ||
    (slides.length > 0
      ? DEFAULT_VERTICAL_TESTIMONIAL_HEADER.heading
      : '')

  // Need either a configured heading or at least one resolved testimonial
  if (!headingText && slides.length === 0) return null

  const eyebrow =
    data.eyebrow?.trim() || DEFAULT_VERTICAL_TESTIMONIAL_HEADER.eyebrow
  const heading = headingText
  const description =
    data.description?.trim() ||
    DEFAULT_VERTICAL_TESTIMONIAL_HEADER.description

  const testimonialCount = slides.length
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 450,
    cssEase: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    waitForAnimate: true,
    slidesToShow,
    slidesToScroll: 1,
    arrows: showArrows,
    beforeChange: () => setIsSliding(true),
    afterChange: (index: number) => {
      setCurrentSlide(index)
      setIsSliding(false)
    },
    prevArrow: <PrevArrow currentSlide={currentSlide} />,
    nextArrow: (
      <NextArrow
        currentSlide={currentSlide}
        slideCount={testimonialCount}
        slidesToShow={slidesToShow}
      />
    ),
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 1, arrows: showArrows },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1, arrows: showArrows },
      },
      {
        breakpoint: 0,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: showArrows },
      },
    ],
  }

  const isHeaderCentered = headerLayout === 'centered'

  return (
    <>
      <Section
        className={`justify-center md:!pt-20 md:!pb-24 !py-14 ${
          isHeaderCentered ? 'bg-zinc-50' : 'bg-white'
        }`}
      >
        <Wrapper className="mx-auto flex w-full flex-col gap-10 md:gap-12">
          <div
            className={
              isHeaderCentered
                ? 'flex w-full flex-col items-center gap-8 text-center'
                : 'flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'
            }
          >
            <div
              className={
                isHeaderCentered
                  ? 'flex w-full max-w-[800px] flex-col items-center gap-4 mx-auto'
                  : 'flex w-full max-w-[720px] flex-col items-start gap-4'
              }
            >
              <p
                className={`text-xs md:text-sm font-semibold tracking-[0.12em] uppercase font-inter ${
                  isHeaderCentered ? 'text-zinc-500' : 'text-indigo-600'
                }`}
              >
                {eyebrow}
              </p>
              <h2 className="text-[28px] md:text-[40px] lg:text-[48px] text-zinc-900 font-manrope font-extrabold leading-[1.08] tracking-[-0.02em]">
                {heading}
              </h2>
              <p
                className={`text-zinc-600 font-inter text-base md:text-lg leading-[1.6] ${
                  isHeaderCentered ? 'max-w-[640px] mx-auto' : 'max-w-[640px]'
                }`}
              >
                {description}
              </p>
            </div>
            {data.ctaText?.trim() && data.ctaLink?.trim() && (
              <Anchor
                href={data.ctaLink}
                className={`inline-flex items-center gap-2 rounded-full bg-indigo-600 text-white px-6 py-3 font-inter font-medium text-sm md:text-base hover:bg-indigo-700 transition-colors shrink-0 ${
                  isHeaderCentered ? 'mx-auto' : ''
                }`}
              >
                {data.ctaText.trim()}
                <ArrowUpRight />
              </Anchor>
            )}
          </div>

          <div className="relative w-full overflow-x-visible overflow-y-visible">
            {slides.length > 0 ? (
              <TestimonialSlider
                slides={slides}
                settings={sliderSettings}
                isSliding={isSliding}
                onOpenVideoModal={(v) => setEmbedModal(v)}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center">
                <p className="mx-auto max-w-lg font-inter text-base text-zinc-600">
                  No testimonial cards are showing yet. In Sanity, open this
                  partner&apos;s <strong>Home</strong> document, then under{' '}
                  <strong>Vertical testimonial section</strong> add references in
                  the <strong>Testimonials</strong> list. Publish each{' '}
                  <strong>Vertical testimonial</strong> and the Home document, then
                  run a fresh build (or restart dev) so the page picks up the data.
                </p>
              </div>
            )}
          </div>
        </Wrapper>
      </Section>

      {embedModal && (
        <VideoModal
          isPopup
          videoDetails={{
            videoPlatform: embedModal.platform,
            videoId: embedModal.videoId,
            title: embedModal.title,
            autoplay: true,
          }}
          onClose={() => setEmbedModal(null)}
        />
      )}
    </>
  )
}

export default VerticalTestimonialsSection
