import { CloseIcon } from '@sanity/icons'
import * as React from 'react'
import Button from './Button'
import useMediaQuery from '~/utils/useMediaQueryHook'

type VideoPlatform = 'vimeo' | 'vidyard' | 'youtube'

export interface VideoItem {
  _id?: string
  videoPlatform: VideoPlatform
  videoId: string
  title?: string
  // Backward compatibility
  platform?: VideoPlatform
}

interface VideoProps {
  videoDetails: VideoItem | VideoItem[]
  className?: string
  isPopup?: boolean
  onClose?: () => void
  video?: VideoItem | VideoItem[]
  openForm?: () => void
  hasDemoBanner?: boolean
  refer?: any
}

const getIframeUrl = (
  videoPlatform: VideoPlatform,
  videoId: string,
): string => {
  switch (videoPlatform) {
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}?transparent=1&background=0`
    case 'vidyard':
      return `https://play.vidyard.com/${videoId}?transparent=1`
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`
    default:
      throw new Error(`Unsupported platform: ${videoPlatform}`)
  }
}

// Move VideoIframe outside of the main component to avoid re-creation on each render
const VideoIframe: React.FC<VideoItem> = ({
  videoPlatform,
  platform,
  videoId,
  title = '',
}) => {
  // Support both videoPlatform (new) and platform (old) for backward compatibility
  const platformToUse = videoPlatform || platform
  if (!platformToUse) {
    return null
  }
  
  return (
    <iframe
      src={getIframeUrl(platformToUse, videoId)}
      title={title}
      frameBorder="0"
      allowFullScreen
      className="w-full h-full inset-0 absolute"
      style={{ backgroundColor: 'transparent' }}
    />
  )
}

export const VideoModal: React.FC<VideoProps> = ({
  videoDetails,
  className = '',
  isPopup = false,
  onClose,
  openForm,
  video,
  hasDemoBanner,
  refer,
}) => {
  const videoData = video || videoDetails

  const toggleRef = React.useRef(null)
  const isMobile = useMediaQuery(767)

  // Close the modal if clicking on the parent outside the child
  const handleParentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click target is the parent
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  if (!videoData) {
    return null
  }

  return (
    <div
      onClick={handleParentClick}
      className={`${
        isPopup
          ? 'fixed top-0 left-0 w-full h-full flex items-center justify-center overflow-hidden'
          : ''
      } ${className}`}
      style={isPopup ? { 
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 20
      } : undefined}
    >
      <div className="w-full max-w-[750px] relative" ref={toggleRef}>
        {isPopup && onClose && (
          <button
            style={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ffffff',
              cursor: 'pointer',
              right: '-18px',
              top: '-22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              border: 'none',
              padding: 0,
            }}
            onClick={onClose}
            aria-label="Close video"
          >
            <CloseIcon color="black" height={16} width={16} />
          </button>
        )}
        <div
          className={`${
            isPopup
              ? 'relative w-full aspect-[1810/1080]'
              : 'w-full aspect-[16/9] relative'
          }`}
          style={{ backgroundColor: 'transparent' }}
        >
          {Array.isArray(videoData) ? (
            videoData.map((item) => (
              <VideoIframe
                key={item._id || `${item.videoPlatform || item.platform}-${item.videoId}`}
                {...item}
              />
            ))
          ) : (
            <VideoIframe {...videoData} />
          )}
        </div>
        {hasDemoBanner && (
          <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-10 items-center py-4 md:py-6 px-8 bg-white">
            <span className="text-[18px] md:text-[23px] font-medium text-gray-900">
              Book a meeting with us
            </span>

            <Button
              type="primary"
              onClick={() => {
                openForm?.()
                onClose?.()
              }}
            >
              <span className="text-base font-medium">{`Book free demo`}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export { getIframeUrl }
