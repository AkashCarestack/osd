import siteConfig from 'config/siteConfig'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface AssociatedContentProps {
  associatedContent?: Array<{
    _id: string
    title: string
    slug: {
      current: string
    }
    contentType?: string
    language?: string
  }>
  currentSlug?: string
  categorySlug?: string
}

const AssociatedContent = ({
  associatedContent,
  currentSlug,
  categorySlug,
}: AssociatedContentProps) => {
  const router = useRouter()
  const { locale } = router.query
  const currentLocale = (locale as string) || 'en'

  if (!associatedContent || associatedContent.length === 0) {
    return null
  }

  // Filter by language if language field exists
  const filteredContent = associatedContent.filter((item) => {
    if (!item.language) return true
    return item.language === currentLocale
  })

  if (filteredContent.length === 0) {
    return null
  }

  const baseUrl = categorySlug
    ? `/${locale}/${siteConfig.categoryBaseUrls.base}/${categorySlug}`
    : ''

  return (
    <div className="bg-zinc-50 flex flex-col gap-6 p-6 rounded-[10px] w-full">
      <div className="border-b border-zinc-200 pb-3">
        <h2 className="font-medium text-base leading-[1.6] text-zinc-900">
          Articles in this section
        </h2>
      </div>
      <div className="flex gap-[6px] items-start leading-[1.5] text-zinc-600 text-sm">
        <div className="flex flex-col gap-3 border-r border-zinc-300 pr-[6px]">
          {filteredContent.map((_, index) => (
            <p key={index} className="font-normal shrink-0">
              {index + 1}.
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {filteredContent.map((item, index) => {
            const contentSlug = item?.slug?.current || item?.slug
            const href = baseUrl
              ? `${baseUrl}/${contentSlug}`
              : `/${locale}/${siteConfig.pageURLs[item?.contentType as keyof typeof siteConfig.pageURLs] || 'article'}/${contentSlug}`
            
            const isActive = contentSlug === currentSlug

            return (
              <Link
                key={item._id || index}
                href={href}
                className={`shrink-0 w-full hover:underline hover:underline-offset-4 ${
                  isActive ? 'font-medium' : 'font-normal'
                }`}
              >
                {item.title}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AssociatedContent
