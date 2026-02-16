import { ArrowTopRightIcon } from '@sanity/icons'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

import Anchor from '~/components/commonSections/Anchor'
import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

interface FAQItem {
  id: number
  question: string
  answer: string
}

interface FAQData {
  faqs: FAQItem[]
  title: string
  description: string
  readNowLink: string
}

interface FAQSectionProps {
  faqData?: FAQData | null
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqData }) => {
  const [activeId, setActiveId] = useState<number | null>(null)

  // Default data if not provided
  const defaultData: FAQData = {
    faqs: [
      {
        id: 1,
        question: 'How long does onboarding take?',
        answer:
          'A dental analytics platform aggregates data from your practice management software (PMS), financial tools, and other sources to provide real-time dashboards, insights, and key performance indicators (KPIs) to help you make data-driven decisions.',
      },
      {
        id: 2,
        question: 'What systems are supported for integration?',
        answer:
          'We support integration with major practice management software systems including Dentrix, Eaglesoft, Open Dental, and many others. Our platform is designed to work seamlessly with your existing technology stack.',
      },
      {
        id: 3,
        question: 'Are training resources available for new staff?',
        answer:
          'Yes, we provide comprehensive training resources including video tutorials, documentation, and live training sessions. New staff members can access our learning management system with step-by-step guides and best practices.',
      },
      {
        id: 4,
        question: 'Who do we contact for technical support?',
        answer:
          'You can reach our technical support team through multiple channels: email at support@osdental.com, phone at our dedicated support line, or through the in-app support chat. Our team is available during business hours to assist with any technical issues.',
      },
      {
        id: 5,
        question: 'How are updates communicated?',
        answer:
          'We communicate updates through multiple channels including email notifications, in-app announcements, and our partner portal. Major updates are announced at least two weeks in advance, and detailed release notes are available in our documentation center.',
      },
    ],
    title: 'Frequently Asked Questions',
    description:
      'Frequently asked questions from partners, covering onboarding, integrations, workflows, and support.',
    readNowLink: '#',
  }

  // Transform Sanity data to match component interface
  const transformFAQData = (sanityData: any): FAQData | null => {
    if (!sanityData || !sanityData.faqs || !Array.isArray(sanityData.faqs)) {
      return null
    }

    return {
      title: sanityData.title || defaultData.title,
      description: sanityData.description || defaultData.description,
      readNowLink: sanityData.readNowLink || defaultData.readNowLink,
      faqs: sanityData.faqs.map((faq: any, index: number) => ({
        id: index + 1,
        question: faq.question || '',
        answer: faq.answer || '',
      })),
    }
  }

  const transformedData = faqData ? transformFAQData(faqData) : null
  const data = transformedData || defaultData

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <Section className="justify-center bg-white">
      <Wrapper className="flex flex-col lg:flex-row gap-8 lg:gap-[136px] items-start w-full">
        {/* Left Sidebar - Sticky */}
        <div className="flex flex-col gap-6 lg:gap-6 items-start py-12 lg:py-24 lg:sticky lg:top-0 w-full lg:w-[391px] shrink-0">
          <div className="flex flex-col gap-6 items-start relative shrink-0 text-[#18181b] w-full whitespace-pre-wrap">
            <h2 className="font-manrope font-extrabold leading-[1.1] relative shrink-0 text-4xl lg:text-[48px] tracking-[-0.96px] w-full">
              {data.title}
            </h2>
            <p className="font-inter font-medium leading-[1.6] not-italic opacity-80 relative shrink-0 text-base w-full">
              {data.description}
            </p>
          </div>
          <Anchor
            href={data.readNowLink}
            className="flex gap-2 items-center relative shrink-0 group"
          >
            <span className="font-inter font-medium leading-[1.6] not-italic relative shrink-0 text-[#18181b] text-base">
              Read Now
            </span>
            <div className="flex items-center justify-center relative shrink-0">
              <div className="-scale-y-100 flex-none">
                <div className="relative size-5">
                  <ArrowTopRightIcon className="block max-w-none size-full text-[#18181b]" />
                </div>
              </div>
            </div>
          </Anchor>
        </div>

        {/* Right Side - FAQ Items */}
        <div className="flex flex-1 flex-col gap-3 items-start min-h-px min-w-px py-12 lg:py-24 relative w-full">
          {data.faqs.map((faq) => {
            const isActive = activeId === faq.id
            return (
              <div
                key={faq.id}
                className={`border border-[rgba(24,24,27,0.1)] border-solid flex flex-col p-6 relative rounded-[10px] w-full cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'bg-[rgba(24,24,27,0.05)] gap-3'
                    : 'bg-transparent gap-6'
                } hover:border-[rgba(24,24,27,0.2)]`}
                onClick={() => toggleFAQ(faq.id)}
              >
                <div className="flex gap-3 items-center relative w-full">
                  <p className="flex-1 font-inter font-medium leading-[1.3] not-italic relative text-[#18181b] text-xl">
                    {faq.question}
                  </p>
                  <motion.div
                    className="relative shrink-0 size-4 flex items-center justify-center"
                    animate={{ rotate: isActive ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 2L8 14M2 8L14 8"
                        stroke="#18181B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                </div>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="font-inter font-normal leading-[1.6] not-italic opacity-70 relative text-[#18181b] text-base w-full"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </div>
            )
          })}
        </div>
      </Wrapper>
    </Section>
  )
}

export default FAQSection
