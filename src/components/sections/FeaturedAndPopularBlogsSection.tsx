// FeaturedAndPopularBlogs.tsx
import { Post } from '~/interfaces/post'
import Wrapper from '../../layout/Wrapper'
import Card from '../Card'
import H2Large from '../typography/H2Large'
import Section from '../Section'

interface FeaturedAndPopularBlogsProps {
  featuredBlog: Post
  popularBlogs: Post[]
}

const FeaturedAndPopularBlogs = ({
  featuredBlog,
  popularBlogs,
}: FeaturedAndPopularBlogsProps) => {

  if([featuredBlog]?.length > 0 && (popularBlogs.length <= 10)) return null  

  return (
    <Section className="justify-center md:pt-24 md:pb-12">
      <Wrapper 
        className={`justify-between md:flex-row flex-col gap-8 md:gap-12 xl:gap-24`}
      >
        <div className="flex flex-col gap-9 xl:w-5/12 w-full h-full flex-1">
          {featuredBlog && <Card
            minHeight={350}
            cardColor="bg-purple-800"
            cardType="top-image-card"
            post={featuredBlog}
          />}
        </div>
        <div className="flex flex-col gap-12 xl:w-6/12 w-full  flex-1">
          <H2Large className="">Most Popular</H2Large>
          <div className=" flex gap-8  w-full flex-wrap items-stretch">
            {popularBlogs.map((blog, index) => (
              <Card cardType="left-image-card" key={index} post={blog} />
            ))}
          </div>
        </div>
      </Wrapper>
    </Section>
  )
}

export default FeaturedAndPopularBlogs
