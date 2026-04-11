import React, { useEffect, useMemo, useState } from 'react'

import Anchor from '~/components/commonSections/Anchor'
import { VideoModal } from '~/components/commonSections/VideoModal'
import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

interface HeroData {
  eyebrow?: string
  title: string
  titleHighlight?: string
  description: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  backgroundImage?: string
  videoThumbnail?: string
  videoLink?: string
}

interface HeroSectionProps {
  /** Sanity shape or pre-merged defaults; partial fields are filled in `transformHeroData`. */
  heroData?: HeroData | Record<string, unknown> | null
  /** Pearl-style LP layout (Curve partner page). */
  layout?: 'default' | 'curvePearl'
}

/** Resolve hero media from GROQ string, legacy object shapes, or empty values. */
function cmsHeroImageUrl(value: unknown): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') {
    const t = value.trim()
    return t.length > 0 ? t : undefined
  }
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>
    const direct = o.url
    if (typeof direct === 'string' && direct.trim()) return direct.trim()
    const asset = o.asset
    if (asset && typeof asset === 'object' && asset !== null) {
      const u = (asset as { url?: unknown }).url
      if (typeof u === 'string' && u.trim()) return u.trim()
    }
  }
  return undefined
}

function HeroCoverImg({
  src,
  fallback,
  className,
}: {
  src: string | undefined
  fallback: string
  className?: string
}) {
  const candidates = useMemo(() => {
    const list = [src, fallback]
      .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
      .map((s) => s.trim())
    return [...new Set(list)]
  }, [src, fallback])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [candidates.join('|')])

  const url = candidates[Math.min(index, candidates.length - 1)] ?? fallback

  return (
    <img
      key={url}
      src={url}
      alt=""
      className={className}
      decoding="async"
      onError={() =>
        setIndex((i) => (i + 1 < candidates.length ? i + 1 : i))
      }
    />
  )
}

// Function to extract video platform and ID from URL
interface VideoInfo {
  platform: 'youtube' | 'vimeo' | 'vidyard' | null
  videoId: string | null
}

const extractVideoInfo = (videoUrl: string): VideoInfo => {
  if (!videoUrl) return { platform: null, videoId: null }

  try {
    // YouTube
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const youtubeMatch = videoUrl.match(youtubeRegex)
    if (youtubeMatch && youtubeMatch[1]) {
      return { platform: 'youtube', videoId: youtubeMatch[1] }
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
    const vimeoMatch = videoUrl.match(vimeoRegex)
    if (vimeoMatch && vimeoMatch[1]) {
      return { platform: 'vimeo', videoId: vimeoMatch[1] }
    }

    // Vidyard (handles share.vidyard.com, vidyard.com, and play.vidyard.com)
    const vidyardRegex =
      /(?:share\.vidyard\.com\/watch\/|vidyard\.com\/watch\/|play\.vidyard\.com\/)([a-zA-Z0-9]+)(?:\?|$|\/)/
    const vidyardMatch = videoUrl.match(vidyardRegex)
    if (vidyardMatch && vidyardMatch[1]) {
      return { platform: 'vidyard', videoId: vidyardMatch[1] }
    }

    return { platform: null, videoId: null }
  } catch (error) {
    console.error('Error extracting video info:', error)
    return { platform: null, videoId: null }
  }
}

// Function to generate thumbnail URL
const generateVideoThumbnail = (videoUrl: string): string | null => {
  if (!videoUrl) return null

  const videoInfo = extractVideoInfo(videoUrl)

  if (!videoInfo.platform || !videoInfo.videoId) return null

  switch (videoInfo.platform) {
    case 'youtube':
      return `https://img.youtube.com/vi/${videoInfo.videoId}/maxresdefault.jpg`
    case 'vimeo':
      return `https://vumbnail.com/${videoInfo.videoId}.jpg`
    case 'vidyard':
      return `https://embed.vidyard.com/${videoInfo.videoId}.jpg`
    default:
      return null
  }
}

// Function to get iframe embed URL
const getVideoEmbedUrl = (platform: string, videoId: string): string | null => {
  switch (platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${videoId}&iv_load_policy=3&showinfo=0&color=white&theme=dark`
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&controls=0&loop=1&title=0&byline=0&portrait=0&background=1&transparent=1`
    case 'vidyard':
      return `https://play.vidyard.com/${videoId}?autoplay=1&muted=1&loop=1&controls=0&transparent=1`
    default:
      return null
  }
}

// Play icon SVG component
const PlayIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M4 3.5V12.5L12.5 8L4 3.5Z"
      fill="white"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const HeroSection: React.FC<HeroSectionProps> = ({
  heroData,
  layout = 'default',
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // Default dummy data
  const defaultHeroData: HeroData = {
    eyebrow: '',
    title: 'Turn Data Into Action with Clinical Dashboards',
    titleHighlight: '',
    description:
      'Your data should do more than sit in reports, it should drive smarter decisions and measurable growth.',
    primaryButtonText: 'Book a Clinical Demo',
    primaryButtonLink: '#',
    secondaryButtonText: 'Clinical Dashboards Overview',
    secondaryButtonLink: '#',
    backgroundImage:
      'https://cdn.sanity.io/images/rcbknqsy/production/c57bdee986c4836572b6747a44da0a80dfb21674-3058x1020.png',
    videoThumbnail:
      'https://cdn.sanity.io/images/rcbknqsy/production/3e10a80054ff751b2c3ad43b7e2f53b276ca5887-990x800.png',
    videoLink: '#',
  }

  // Transform Sanity data to match component interface
  const transformHeroData = (sanityData: any): HeroData | null => {
    if (!sanityData) {
      return null
    }

    // Auto-generate thumbnail if not provided but videoLink exists
    const videoLinkRaw =
      typeof sanityData.videoLink === 'string' ? sanityData.videoLink.trim() : ''
    const thumbFromCms = cmsHeroImageUrl(sanityData.videoThumbnail)
    const videoThumbnail =
      thumbFromCms ||
      (videoLinkRaw
        ? generateVideoThumbnail(videoLinkRaw)
        : null) ||
      defaultHeroData.videoThumbnail

    const bgFromCms = cmsHeroImageUrl(sanityData.backgroundImage)

    return {
      eyebrow:
        typeof sanityData.eyebrow === 'string'
          ? sanityData.eyebrow
          : defaultHeroData.eyebrow,
      title: sanityData.title || defaultHeroData.title,
      titleHighlight:
        sanityData.titleHighlight || defaultHeroData.titleHighlight,
      description: sanityData.description || defaultHeroData.description,
      primaryButtonText:
        sanityData.primaryButtonText || defaultHeroData.primaryButtonText,
      primaryButtonLink:
        sanityData.primaryButtonLink || defaultHeroData.primaryButtonLink,
      secondaryButtonText:
        sanityData.secondaryButtonText || defaultHeroData.secondaryButtonText,
      secondaryButtonLink:
        sanityData.secondaryButtonLink || defaultHeroData.secondaryButtonLink,
      backgroundImage:
        bgFromCms || defaultHeroData.backgroundImage,
      videoThumbnail,
      videoLink: videoLinkRaw || defaultHeroData.videoLink,
    }
  }

  const transformedData = heroData ? transformHeroData(heroData) : null
  const data = transformedData || defaultHeroData
  const isPearlHero = layout === 'curvePearl'

  // Extract video info for embedding
  const videoInfo = data.videoLink
    ? extractVideoInfo(data.videoLink)
    : { platform: null, videoId: null }
  const canEmbedVideo = Boolean(videoInfo.platform && videoInfo.videoId)
  /** Thumbnail art often already includes a play chip; avoid duplicating our overlay. */
  const showPlayChipOverlay = canEmbedVideo || !isPearlHero

  // Placeholder image URL
  const placeholderImage =
    'https://cdn.sanity.io/images/rcbknqsy/production/4c9eae156681fce630a561f64177da5bb8703bc1-990x800.png'

  // Prepare video data for VideoModal
  const videoModalData = canEmbedVideo
    ? {
        videoPlatform: videoInfo.platform!,
        videoId: videoInfo.videoId!,
        title: data.secondaryButtonText || 'Video Player',
      }
    : null

  return (
    <div
      className={`w-full flex gap-1 items-center bg-[#18181b] relative overflow-hidden pt-headerSpacerMob md:pt-headerSpacer ${
        isPearlHero ? 'border-b border-white/[0.06]' : ''
      }`}
    >
      {/* Full-bleed background (img so load errors can fall back; avoids broken url() from non-string CMS) */}
      {data.backgroundImage ? (
        <HeroCoverImg
          src={data.backgroundImage}
          fallback={defaultHeroData.backgroundImage!}
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
        />
      ) : null}
      {isPearlHero ? (
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0b0b0f]/95 from-[22%] via-[#18181b]/40 via-[52%] to-[#18181b]/10"
          aria-hidden
        />
      ) : null}

      <Section className="justify-center w-full !py-0 relative z-10">
        <Wrapper className="flex h-auto flex-col">
          <div
            className={`flex flex-col items-start justify-center relative shrink-0 w-full ${
              isPearlHero
                ? 'py-14 md:py-24 lg:py-[120px]'
                : 'py-12 md:py-[130px]'
            }`}
          >
            <div
              className={`flex w-full ${
                isPearlHero
                  ? 'flex-col-reverse lg:flex-row-reverse gap-10 lg:gap-16 xl:gap-24 items-center'
                  : 'flex-col lg:flex-row gap-8 lg:gap-[96px] items-start lg:items-center'
              }`}
            >
              {/* Copy column (Pearl: image leads on mobile via flex-row-reverse) */}
              <div
                className={`flex flex-col gap-8 lg:gap-10 items-start justify-end flex-1 w-full ${
                  isPearlHero ? 'lg:max-w-[560px]' : ''
                }`}
              >
                <div
                  className={`flex flex-col gap-4 lg:gap-5 items-start w-full text-white ${
                    isPearlHero ? 'text-left' : ''
                  }`}
                >
                  {data.eyebrow?.trim() ? (
                    <p className="w-full text-xs md:text-sm font-semibold tracking-[0.14em] text-indigo-400 uppercase font-inter">
                      {data.eyebrow.trim()}
                    </p>
                  ) : null}
                  {/* Main heading */}
                  <h1
                    className={`w-full text-white font-manrope font-bold not-italic md:leading-[110%] leading-[1.08] tracking-[-1.12px] ${
                      isPearlHero
                        ? 'text-[34px] md:text-[44px] lg:text-[52px]'
                        : 'text-[36px] md:text-[40px] lg:text-[56px]'
                    }`}
                  >
                    {data.title}
                    {data.titleHighlight && (
                      <>
                        <br aria-hidden="true" />
                        <span className="text-white/50">
                          {data.titleHighlight}
                        </span>
                      </>
                    )}
                  </h1>

                  {/* Description text */}
                  <p
                    className={`w-full text-white font-inter not-italic font-medium leading-[160%] opacity-80 ${
                      isPearlHero ? 'text-base md:text-lg max-w-[540px]' : 'text-lg'
                    }`}
                  >
                    {data.description}
                  </p>
                </div>

                {/* Primary Button */}
                <Anchor
                  href={data.primaryButtonLink || '#'}
                  className={`bg-white flex items-center overflow-hidden px-6 py-3 relative rounded-[5px] shrink-0 hover:bg-zinc-100 transition-colors ${
                    isPearlHero ? 'shadow-lg shadow-black/25 md:px-8 md:py-3.5' : ''
                  }`}
                >
                  <span className="font-inter font-medium leading-[1.6] text-[#18181b] text-base text-center whitespace-nowrap">
                    {data.primaryButtonText || 'Book a Clinical Demo'}
                  </span>
                </Anchor>
              </div>

              {/* Right Content - Clickable Placeholder Image */}
              <div
                className={`w-full shrink-0 overflow-hidden relative cursor-pointer group ${
                  isPearlHero
                    ? 'bg-[#dae7ff] lg:flex-1 lg:max-w-[560px] rounded-[28px] ring-1 ring-white/10 shadow-2xl shadow-black/50'
                    : 'bg-zinc-900 lg:w-[495px] rounded-[18px]'
                }`}
                style={{ aspectRatio: '990/800' }}
                onClick={() => {
                  if (canEmbedVideo) {
                    setIsVideoModalOpen(true)
                  } else if (data.videoLink && data.videoLink !== '#') {
                    window.open(data.videoLink, '_blank')
                  }
                }}
              >
                <HeroCoverImg
                  src={
                    typeof data.videoThumbnail === 'string' &&
                    data.videoThumbnail.trim()
                      ? data.videoThumbnail.trim()
                      : undefined
                  }
                  fallback={placeholderImage}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 to-transparent" />

                {showPlayChipOverlay ? (
                  <div className="absolute bottom-4 right-4 backdrop-blur-xl bg-black/30 border border-white/30 flex gap-2 items-center overflow-hidden pl-3.5 pr-4 py-2 rounded-full group-hover:bg-black/40 transition-colors pointer-events-none">
                    <PlayIcon />
                    <span className="font-inter font-medium leading-[1.5] text-[15px] text-white whitespace-nowrap">
                      {data.secondaryButtonText || 'Clinical Dashboards Overview'}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Wrapper>
      </Section>

      {/* Video Modal Popup */}
      {isVideoModalOpen && videoModalData && (
        <VideoModal
          isPopup={true}
          videoDetails={videoModalData}
          className="pt-9 flex items-start"
          onClose={() => setIsVideoModalOpen(false)}
        />
      )}
    </div>
  )
}

export default HeroSection
