import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

interface FAQSectionProps {
  faqCategories?: any[]
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

const FAQSection: React.FC<FAQSectionProps> = ({ faqCategories = [] }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    faqCategories.length > 0 ? faqCategories[0]._id : null,
  )
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Get active category data
  const activeCategoryData = faqCategories.find((cat) => cat._id === activeCategory)
  const activeQuestions = activeCategoryData?.faq?.faqs || []

  // Keep all FAQs closed on mount and when category changes
  useEffect(() => {
    setIsOpen({})
  }, [activeCategory])

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

  // Don't render if no FAQ categories
  if (!faqCategories || faqCategories.length === 0) {
    return null
  }

  return (
    <Section className="justify-center bg-white">
      <Wrapper className="w-full">
        <div className="w-full lg:py-24">
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
      </Wrapper>
    </Section>
  )
}

export default FAQSection
