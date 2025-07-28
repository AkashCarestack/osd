import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import XSMedium from '../typography/XSMedium'
import Anchor from './Anchor'

function ShareableLinks({ props }) {
  const { asPath: route } = useRouter()
  const encodedUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}${route}`)
  

  return (
    <div className="flex flex-col gap-3">
      <XSMedium className="uppercase  !text-zinc-600">
        Share this post{' '}
      </XSMedium>
      <div className="flex gap-6">
        <Anchor
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel=" noreferrer"
          title="linkedin"
          className="group"
        >
          <div className="cursor-pointer hover:bg-zinc-200 rounded-md p-1 transition duration-200 ease-in-out">
            <svg
              className="group-hover:text-zinc-800 text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_8427_911)">
                <path
                  d="M18.5195 0H1.47656C0.660156 0 0 0.644531 0 1.44141V18.5547C0 19.3516 0.660156 20 1.47656 20H18.5195C19.3359 20 20 19.3516 20 18.5586V1.44141C20 0.644531 19.3359 0 18.5195 0ZM5.93359 17.043H2.96484V7.49609H5.93359V17.043ZM4.44922 6.19531C3.49609 6.19531 2.72656 5.42578 2.72656 4.47656C2.72656 3.52734 3.49609 2.75781 4.44922 2.75781C5.39844 2.75781 6.16797 3.52734 6.16797 4.47656C6.16797 5.42188 5.39844 6.19531 4.44922 6.19531ZM17.043 17.043H14.0781V12.4023C14.0781 11.2969 14.0586 9.87109 12.5352 9.87109C10.9922 9.87109 10.7578 11.0781 10.7578 12.3242V17.043H7.79688V7.49609H10.6406V8.80078H10.6797C11.0742 8.05078 12.043 7.25781 13.4844 7.25781C16.4883 7.25781 17.043 9.23438 17.043 11.8047V17.043Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_8427_911">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </Anchor>
        <Anchor
          href={`https://www.facebook.com/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel=" noreferrer"
          title="facebook"
          className="group"
        >
          <div className="cursor-pointer hover:bg-zinc-200 rounded-md p-1 transition duration-200 ease-in-out">
            <svg
              className="group-hover:text-zinc-800 text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_8427_912)">
                <path
                  d="M10 0C4.4772 0 0 4.4772 0 10C0 14.6896 3.2288 18.6248 7.5844 19.7056V13.056H5.5224V10H7.5844V8.6832C7.5844 5.2796 9.1248 3.702 12.4664 3.702C13.1 3.702 14.1932 3.8264 14.6404 3.9504V6.7204C14.4044 6.6956 13.9944 6.6832 13.4852 6.6832C11.8456 6.6832 11.212 7.3044 11.212 8.9192V10H14.4784L13.9172 13.056H11.212V19.9268C16.1636 19.3288 20.0004 15.1128 20.0004 10C20 4.4772 15.5228 0 10 0Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_8427_912">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </Anchor>
        <Anchor
          href={`https://twitter.com/share?text=${encodeURIComponent(props)}&url=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          title="twitter"
          className="group"
        >
          <div className="cursor-pointer hover:bg-zinc-200 rounded-md p-1 transition duration-200 ease-in-out">
            <svg
              className="group-hover:text-zinc-800 text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.2718 1.58659H18.0831L11.9414 8.60617L19.1666 18.1582H13.5093L9.07828 12.365L4.00821 18.1582H1.19528L7.76445 10.65L0.833252 1.58659H6.63418L10.6394 6.88187L15.2718 1.58659ZM14.2852 16.4756H15.8429L5.78775 3.18087H4.11614L14.2852 16.4756Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </Anchor>
      </div>
    </div>
  )
}

export default ShareableLinks
