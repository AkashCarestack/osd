import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import Layout from '~/components/Layout'
import Anchor from '~/components/commonSections/Anchor'
import { getClient } from '~/lib/sanity.client'
import {
  getAllFAQs,
  getCategories,
  getFooterData,
  getHomeSettings,
  getSiteSettings,
} from '~/lib/sanity.queries'
import { defaultMetaTag } from '~/utils/customHead'
import { generateFAQJSONLD } from '~/utils/generateJSONLD'

interface FAQPageProps {
  faqCategories: any[]
  categories: any[]
  siteSettings: any
  homeSettings: any
  footerData: any
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { locale: 'en' } },
      { params: { locale: 'en-GB' } },
      { params: { locale: 'en-AU' } },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<FAQPageProps> = async ({ params }) => {
  const client = getClient()
  const region = (params?.locale as string) || 'en'

  const [faqCategories, categories, siteSettings, homeSettings, footerData] =
    await Promise.all([
      getAllFAQs(client),
      getCategories(client),
      getSiteSettings(client),
      getHomeSettings(client, region),
      getFooterData(client, region),
    ])

  // Filter categories that have FAQs
  const categoriesWithFAQs = faqCategories.filter(
    (category) => category.faq && category.faq.faqs && category.faq.faqs.length > 0,
  )

  return {
    props: {
      faqCategories: categoriesWithFAQs,
      categories,
      siteSettings,
      homeSettings,
      footerData,
    },
  }
}

// Plus Icon Component
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
)

// Minus Icon Component
const MinusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 12H4"
    />
  </svg>
)

// ChevronDown Icon Component
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
)

// Indicator Icon Component
const IndicatorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M5.83325 5.83301H14.1666V14.1663"
      stroke="black"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83325 14.1663L14.1666 5.83301"
      stroke="black"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Category Indicator Icon
const CategoryIndicatorIcon = ({
  isActive,
  isHovered,
}: {
  isActive: boolean
  isHovered: boolean
}) => {
  const shouldShow = isActive || isHovered

  return shouldShow ? (
    <motion.span
      className="w-5 h-5 flex items-center justify-center flex-shrink-0"
      initial={false}
      animate={{
        opacity: shouldShow ? 1 : 0,
        scale: shouldShow ? 1 : 0.8,
        x: shouldShow ? 0 : -4,
      }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <IndicatorIcon />
    </motion.span>
  ) : null
}

// Category Button Component
const CategoryButton = ({
  category,
  isActive,
  onClick,
}: {
  category: any
  isActive: boolean
  onClick: () => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={`font-geist text-base leading-[150%] border-b border-b-gray-200 tracking-normal p-3 !text-left ${
        isActive ? 'text-gray-950 font-medium' : 'text-gray-500 font-normal'
      }`}
    >
      <div className="flex flex-row gap-2 items-center">
        <CategoryIndicatorIcon isActive={isActive} isHovered={isHovered} />
        <span className="relative inline-block">
          <span
            className="font-medium invisible"
            aria-hidden="true"
            style={{ display: 'inline-block' }}
          >
            {category.categoryName}
          </span>
          <motion.span
            className="absolute top-0 left-0"
            animate={{
              fontWeight: isActive || isHovered ? 500 : 400,
              color: isActive || isHovered ? '#030712' : '#6B7280',
            }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {category.categoryName}
          </motion.span>
        </span>
      </div>
    </motion.button>
  )
}


export default function FAQPage({
  faqCategories,
  categories,
  siteSettings,
  homeSettings,
  footerData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const locale = (router.query.locale as string) || 'en'
  const [activeCategory, setActiveCategory] = useState<string | null>(
    faqCategories.length > 0 ? faqCategories[0]._id : null,
  )
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://osdental.io'
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const canonicalUrl = `${baseUrl}${localePrefix}/faq`

  // Get active category data
  const activeCategoryData = faqCategories.find((cat) => cat._id === activeCategory)
  const activeQuestions = activeCategoryData?.faq?.faqs || []

  // Initialize first question as open when category changes
  useEffect(() => {
    if (activeCategory && activeQuestions.length > 0) {
      const firstQuestionId = `${activeCategory}-0`
      setIsOpen({ [firstQuestionId]: true })
    }
  }, [activeCategory, activeQuestions.length])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as Element
        if (!target.closest('.dropdown-container')) {
          setIsDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  // Generate FAQ JSON-LD for all FAQs
  const allFAQsForJSONLD = faqCategories.flatMap((category) =>
    category.faq?.faqs?.map((faq: any) => ({
      question: faq.question,
      answer: faq.answer,
    })) || [],
  )

  const faqJSONLD =
    allFAQsForJSONLD.length > 0
      ? generateFAQJSONLD(
          { faqs: allFAQsForJSONLD, name: 'Frequently Asked Questions' },
          canonicalUrl,
        )
      : null

  const showActiveCategory = (categoryId: string) => {
    if (categoryId === activeCategory) return
    setActiveCategory(categoryId)
  }

  const toggleQuestion = (questionId: string) => {
    setIsOpen((prev) => {
      const isCurrentlyOpen = prev[questionId] || false
      // If clicking on an already open question, close it (close all)
      if (isCurrentlyOpen) {
        return {}
      }
      // Otherwise, close all others and open only this one
      return { [questionId]: true }
    })
  }

  const siteSettingWithImage = siteSettings?.find((e: any) => e?.openGraphImage)

  return (
    <GlobalDataProvider
      data={categories}
      featuredTags={homeSettings?.featuredTags}
      homeSettings={homeSettings}
      footerData={footerData}
    >
      <Layout>
        {siteSettingWithImage ? defaultMetaTag(siteSettingWithImage) : <></>}
        <Head>
          <title>Frequently Asked Questions | OS Dental University</title>
          <meta
            name="description"
            content="Find answers to frequently asked questions about dental practice management, software features, integrations, and more."
          />
          <link rel="canonical" href={canonicalUrl} key="canonical" />
          {faqJSONLD && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: faqJSONLD }}
            />
          )}
        </Head>

        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 pt-24 lg:pt-32 pb-8 lg:pb-16">
            {/* Page Header Section */}
            <div className="mb-12">
              {/* Main Header with Title, Button, and Description */}
              <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
                {/* Left Side - Title and Button */}
                <div className="flex-1 lg:max-w-[50%]">
                  <h1 className="font-manrope md:text-5xl text-3xl md:font-bold font-semibold leading-tight tracking-tight text-gray-950 mb-6">
                    OS Dental University Frequently Asked Questions
                  </h1>
                  <Anchor
                    href="https://osdental.io/?refer=carestack"
                    className="inline-flex items-center justify-center bg-cs-primary hover:bg-[#42dd88] transition-colors duration-200 px-6 py-3 rounded-lg text-gray-900 font-medium text-base"
                  >
                    Book Free Demo
                  </Anchor>
                </div>

                {/* Right Side - Description */}
                <div className="flex-1 lg:max-w-[50%]">
                  <p className="text-gray-600 text-base leading-relaxed">
                    If you have a question about OS Dental University, then someone else has likely
                    already asked about the same topic. We've collected a list of the most
                    frequently asked questions, so feel free to browse by topic to find an answer.
                    And please don't hesitate to contact our support team for additional
                    information!
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex lg:flex-row flex-col md:justify-between gap-8">
              {/* Mobile Dropdown */}
              <div className="lg:hidden w-full">
                <div
                  className="relative dropdown-container"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <button className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-[12px] px-4 py-3 text-left font-medium leading-[155%] md:text-lg text-sm text-gray-950">
                    <span>
                      {activeCategoryData?.categoryName || 'Select Category'}
                    </span>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg z-10 max-h-60 overflow-y-auto"
                      >
                        {faqCategories.map((category: any) => (
                          <motion.button
                            key={category._id}
                            onClick={() => {
                              showActiveCategory(category._id)
                              setIsDropdownOpen(false)
                            }}
                            whileHover={{ backgroundColor: '#F9FAFB' }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-left px-3 py-2 font-medium leading-[155%] md:text-lg text-sm first:rounded-t-[12px] last:rounded-b-[12px] ${
                              activeCategory === category._id
                                ? 'bg-gray-100 text-gray-950'
                                : 'text-gray-500'
                            }`}
                          >
                            {category.categoryName}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop Categories Sidebar */}
              <div className="hidden lg:flex flex-col sticky top-[100px] self-start gap-1.5 flex-1 max-w-[369px]">
                {faqCategories.map((category: any) => (
                  <CategoryButton
                    key={category._id}
                    category={category}
                    isActive={activeCategory === category._id}
                    onClick={() => showActiveCategory(category._id)}
                  />
                ))}
              </div>

              {/* Questions and Answers */}
              <AnimatePresence mode="wait">
                {activeQuestions.length > 0 && (
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="gap-3 flex flex-col flex-1 lg:max-w-[712px]"
                  >
                    {activeQuestions.map((faqItem: any, index: number) => {
                      const questionId = `${activeCategory}-${index}`
                      const isQuestionOpen = isOpen[questionId] || false

                      return (
                        <motion.div
                          onClick={() => toggleQuestion(questionId)}
                          key={questionId}
                          className={`cursor-pointer border md:rounded-[16px] rounded-[6px] md:p-6 p-4 border-gray-200 ${
                            !isQuestionOpen ? 'bg-white' : '!bg-[#F9FAFB]'
                          }`}
                          whileHover={
                            !isQuestionOpen ? { backgroundColor: '#F9FAFB' } : {}
                          }
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <button className="w-full text-left flex items-center justify-between rounded-[16px]">
                            <dt className="font-medium font-geist tracking-normal leading-[155%] md:text-lg text-base text-gray-950 pr-4">
                              {faqItem.question}
                            </dt>
                            <div className="flex-shrink-0">
                              <motion.div
                                animate={{ rotate: isQuestionOpen ? 0 : 0 }}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                              >
                                <AnimatePresence mode="wait">
                                  {isQuestionOpen ? (
                                    <motion.div
                                      key="minus"
                                      initial={{ opacity: 0, rotate: -90 }}
                                      animate={{ opacity: 1, rotate: 0 }}
                                      exit={{ opacity: 0, rotate: 90 }}
                                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                    >
                                      <MinusIcon className="w-5 h-5 text-gray-950" />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      key="plus"
                                      initial={{ opacity: 0, rotate: 90 }}
                                      animate={{ opacity: 1, rotate: 0 }}
                                      exit={{ opacity: 0, rotate: -90 }}
                                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                    >
                                      <PlusIcon className="w-5 h-5 text-gray-950" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            </div>
                          </button>
                          <AnimatePresence initial={false}>
                            {isQuestionOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: [0.4, 0, 0.2, 1],
                                  opacity: { duration: 0.2 },
                                }}
                                className="font-geist overflow-hidden"
                              >
                                <dd className="text-gray-600 font-geist tracking-normal md:text-base text-sm leading-[145%] font-normal md:pt-4 pt-2 whitespace-pre-wrap">
                                  {faqItem.answer}
                                </dd>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Layout>
    </GlobalDataProvider>
  )
}
