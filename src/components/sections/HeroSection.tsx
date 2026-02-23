import React from 'react'

import Anchor from '~/components/commonSections/Anchor'
import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

interface HeroData {
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
  heroData?: HeroData | null
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
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
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
    const vidyardRegex = /(?:share\.vidyard\.com\/watch\/|vidyard\.com\/watch\/|play\.vidyard\.com\/)([a-zA-Z0-9]+)(?:\?|$|\/)/
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

const HeroSection: React.FC<HeroSectionProps> = ({ heroData }) => {
  // Default dummy data
  const defaultHeroData: HeroData = {
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
      'https://cdn.sanity.io/images/rcbknqsy/production/c57bdee986c4836572b6747a44da0a80dfb21674-3058x1020.png',
    videoLink: '#',
  }

  // Transform Sanity data to match component interface
  const transformHeroData = (sanityData: any): HeroData | null => {
    if (!sanityData) {
      return null
    }

    // Auto-generate thumbnail if not provided but videoLink exists
    const videoThumbnail =
      sanityData.videoThumbnail ||
      (sanityData.videoLink
        ? generateVideoThumbnail(sanityData.videoLink)
        : null) ||
      defaultHeroData.videoThumbnail

    return {
      title: sanityData.title || defaultHeroData.title,
      titleHighlight: sanityData.titleHighlight || defaultHeroData.titleHighlight,
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
        sanityData.backgroundImage || defaultHeroData.backgroundImage,
      videoThumbnail,
      videoLink: sanityData.videoLink || defaultHeroData.videoLink,
    }
  }

  const transformedData = heroData ? transformHeroData(heroData) : null
  const data = transformedData || defaultHeroData

  // Extract video info for embedding
  const videoInfo = data.videoLink ? extractVideoInfo(data.videoLink) : { platform: null, videoId: null }
  const canEmbedVideo = videoInfo.platform && videoInfo.videoId

  return (
    <div className="w-full flex gap-1 items-center bg-[#18181b] relative overflow-hidden pt-headerSpacerMob md:pt-headerSpacer">
      {/* Blurred background image */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{
            filter: 'blur(25px)',
            backgroundImage: `url(${data.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: '50%',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      <Section className="justify-center w-full !py-0 relative z-10">
        <Wrapper className="flex h-auto flex-col">
          <div className="flex flex-col items-start justify-center py-12 md:py-[130px] relative shrink-0 w-full">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-[96px] items-start lg:items-center relative shrink-0 w-full">
              {/* Left Content */}
              <div className="flex flex-col gap-8 lg:gap-12 items-start justify-end flex-1 w-full">
                <div className="flex flex-col gap-4 lg:gap-6 items-start w-full text-white">
                  {/* Main heading */}
                  <h1 className="w-full text-white text-[28px] md:text-[40px] lg:text-[56px] font-manrope font-bold not-italic leading-[110%] tracking-[-1.12px]">
                    {data.title}
                    {data.titleHighlight && (
                      <>
                        <br aria-hidden="true" />
                        <span className="text-white/50">{data.titleHighlight}</span>
                      </>
                    )}
                  </h1>

                  {/* Description text */}
                  <p className="w-full text-white font-inter text-lg not-italic font-medium leading-[160%] opacity-80">
                    {data.description}
                  </p>
                </div>

                {/* Primary Button */}
                <Anchor
                  href={data.primaryButtonLink || '#'}
                  className="bg-white flex items-center overflow-hidden px-6 py-3 relative rounded-[5px] shrink-0 hover:bg-zinc-100 transition-colors"
                >
                  <span className="font-inter font-medium leading-[1.6] text-[#18181b] text-base text-center whitespace-nowrap">
                    {data.primaryButtonText || 'Book a Clinical Demo'}
                  </span>
                </Anchor>
              </div>

              {/* Right Content - Video Player (Visible on all devices) */}
              <div className="w-full lg:w-[495px] shrink-0 h-[200px] md:h-[250px] lg:h-[280px] rounded-[18px] overflow-hidden relative" style={{ backgroundColor: 'transparent', background: 'transparent' }}>
                {canEmbedVideo ? (
                  // Embedded Video Player - Auto-plays, loops, no controls
                  <div className="w-full h-full rounded-[18px] overflow-hidden" style={{ backgroundColor: 'transparent', background: 'transparent' }}>
                    <iframe
                      src={getVideoEmbedUrl(videoInfo.platform!, videoInfo.videoId!) || ''}
                      className="w-full h-full border-0"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={data.secondaryButtonText || 'Video Player'}
                      style={{ 
                        backgroundColor: 'transparent',
                        background: 'transparent',
                        margin: 0,
                        padding: 0,
                        display: 'block',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ) : (
                  // Video Thumbnail with Play Button (fallback for non-embeddable videos)
                  <>
                    {/* Video Thumbnail Background */}
                    {data.videoThumbnail && (
                      <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                          backgroundImage: `url(${data.videoThumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                    )}

                    {/* Blue overlay */}
                    <div className="absolute inset-0 bg-[#2727e6] mix-blend-color" />

                    {/* Play Button Overlay */}
                    <Anchor
                      href={data.videoLink || data.secondaryButtonLink || '#'}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-xl bg-black/30 border border-white/30 flex gap-2 items-center overflow-hidden pl-3.5 pr-4 py-2 rounded-full hover:bg-black/40 transition-colors"
                    >
                      <PlayIcon />
                      <span className="font-inter font-medium leading-[1.5] text-[15px] text-white whitespace-nowrap">
                        {data.secondaryButtonText || 'Clinical Dashboards Overview'}
                      </span>
                    </Anchor>
                  </>
                )}
              </div>
            </div>
          </div>
        </Wrapper>
      </Section>
    </div>
  )
}

export default HeroSection
