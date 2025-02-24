import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useRef, useState } from 'react'
import Section from '~/components/Section'
import TagsCarousel from '~/components/sections/TagsCarousel'
import Wrapper from '~/layout/Wrapper'
import { UlistIcon } from '@sanity/icons'

interface TagSelectProps {
  tags: any[]
  tagLimit?: number
  showTags?: boolean
  showHeading?: boolean
  className?: string
  onTagChange?: (tag: any) => void
}

export default function TagSelect({
  tags,
  tagLimit,
  showTags = false,
  showHeading = false,
  className,
  onTagChange,
}: TagSelectProps) {
  const [visibleTagCount, setVisibleTagCount] = useState(tagLimit)
  const [selectedTag, setSelectedTag] = useState('')
  const [hideTags, setHideTags] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const slug = router.query.slug as string
    if (slug) {
      setSelectedTag(slug)
      localStorage.setItem('selectedTag', slug)
    }
  }, [router.query.slug])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [selectedTag])

  const onTagChanges = (tag: any) => {
    setSelectedTag(tag.slug.current)
    if (onTagChange) {
      onTagChange(tag)
    }
  }

  return showTags && (
  <Section className="bg-zinc-900 justify-center !py-0">
      <Wrapper>
        
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 pt-6 md:pt-6 pb-6 w-full md:items-center">
            {/* {showHeading && selectedTag && (
            <h2 className="md:text-5xl text-xl text-center font-manrope font-extrabold text-cs-zinc-900">
              {`"${tags.find(tag => tag.slug.current === selectedTag)?.tagName || ''}"`}
            </h2>
          )} */}

            {/* <Link
              href={`/browse`}
              className="text-[14px] font-medium leading-[1.5] text-zinc-500 flex items-center gap-x-1 hover:text-zinc-300 group"
            >
              <UlistIcon width={25} height={25} />
              All Topics
            </Link> */}

            <div className="flex-1 overflow-hidden max-w-full">
              <div
                className={`flex gap-x-8 relative px-8 slider-mask tags-slider`}
              >
                {tags && (
                  <TagsCarousel
                    tags={tags}
                    selectedTag={selectedTag}
                    onTagChanges={onTagChanges}
                  />
                )}
              </div>
            </div>
          </div>
      </Wrapper>
    </Section>
  )
}
