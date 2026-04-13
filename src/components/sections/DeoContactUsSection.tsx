import React from 'react'

import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M4 6.5h16v11H4v-11z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 7L12 12l7.5-5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * DEO partner home: support contact block above the footer.
 */
export default function DeoContactUsSection() {
  const email = 'help@osdental.ai'

  return (
    <Section className="justify-center bg-[#f4f4f5] py-12 md:py-16">
      <Wrapper className="w-full justify-center px-0 sm:px-2">
        <div className="mx-auto w-full max-w-3xl text-center">
          <h2 className="mx-auto max-w-3xl text-center font-manrope text-3xl font-bold !leading-[107.143%] text-gray-950 md:text-center md:text-5xl xl:text-[56px]">
            Get Support
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-700">
            For any support requests, please contact us via email.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={`mailto:${email}`}
              className="inline-flex max-w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-6 py-4 text-left font-medium text-zinc-900 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <MailIcon className="h-5 w-5 shrink-0 text-zinc-900" />
              <span className="truncate">{email}</span>
            </a>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-center text-[14px] leading-relaxed text-gray-400">
            Please include the practice name and a short description of the
            issue in the subject line. Provide detailed information in the body
            of the email.
          </p>
        </div>
      </Wrapper>
    </Section>
  )
}
