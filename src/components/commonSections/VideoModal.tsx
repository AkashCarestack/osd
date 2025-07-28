import { CloseIcon } from '@sanity/icons'
import * as React from 'react'

type VideoPlatform = 'vimeo' | 'vidyard' | 'youtube'

interface VideoItem {
  _id?: string
  platform: VideoPlatform
  videoId: string
  title?: string
}

interface VideoProps {
  videoDetails: VideoItem | VideoItem[]
  className?: string
  isPopup?: boolean
  onClose?: () => void
  video?: VideoItem | VideoItem[]
}

const getIframeUrl = (platform: VideoPlatform, videoId: string): string => {
  switch (platform) {
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    case 'vidyard':
      return `https://play.vidyard.com/${videoId}?autoplay=1`
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

// Move VideoIframe outside of the main component to avoid re-creation on each render
const VideoIframe: React.FC<VideoItem> = ({
  platform,
  videoId,
  title = '',
}) => (
  <iframe
    src={getIframeUrl(platform, videoId)}
    title={title}
    frameBorder="0"
    allowFullScreen
    className="w-full h-full"
  />
)

export const VideoModal: React.FC<VideoProps> = ({
  videoDetails,
  className = '',
  isPopup = false,
  onClose,
  video,
}) => {
  const videoData = video || videoDetails

  if (!videoData) {
    return null
  }

  return (
    <div
    onClick={isPopup ? onClose : undefined}
      className={`${
        isPopup
          ? 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
          : ''
      } ${className}`}
    >
      <div
        className={`${
          isPopup
            ? 'relative w-full max-w-xl h-[500px] b rounded-lg overflow-hidden'
            : 'w-full aspect-[16/9] relative'
        }`}
      >
        {isPopup && onClose && (
          <button
            className="absolute top-10 right-0  hover:text-gray-800 transition-colors duration-200 p-1 rounded-full"
            onClick={onClose}
            aria-label="Close video"
          >
            <CloseIcon color="white" height={30} />
          </button>
        )}

        {Array.isArray(videoData) ? (
          videoData.map((item) => (
            <VideoIframe
              key={item._id || `${item.platform}-${item.videoId}`}
              {...item}
            />
          ))
        ) : (
          <VideoIframe {...videoData} />
        )}
      </div>
    </div>
  )
}

export { getIframeUrl }
