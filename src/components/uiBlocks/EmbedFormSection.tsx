import React, { useContext, useEffect, useState } from 'react'
import AuthorInfo from '../commonSections/AuthorInfo'
import DescriptionText from '../typography/DescriptionText'
import H3Medium from '../typography/H3Medium'
import ChordIcon from '~/assets/reactiveAssets/ChordIcon'
import Image from 'next/image'
import ImageLoader from '../commonSections/ImageLoader'
import H4Medium from '../typography/H4Medium'
import H2Large from '../typography/H2Large'
import SanityPortableText from '../blockEditor/sanityBlockEditor'
import { useGlobalData } from '../Context/GlobalDataContext'
import { EmbedForm } from '../uiBlocks/EmbedForm'
import { download_file } from '~/utils/common'
import SidebarTitle from '../typography/SidebarTitle'
import useMediaQuery from '~/utils/useMediaQueryHook'
import { BookDemoContext } from '../Context/BookDemoProvider'


interface EmbedFormSectionProps {
  caseStudySection: any
}

const EmbedFormSection: React.FC<EmbedFormSectionProps> = ({ ...props }: any) => {
  let { siteSettings } = useGlobalData()
  const isMobile = useMediaQuery(767);
  
  let embedFormdata = props.embedForm || props
  
  // Extract form configuration from the embedForm data
  const formId = embedFormdata?.formId || embedFormdata?.embedForm?.formId
  const meetingLink = embedFormdata?.meetingLink || embedFormdata?.embedForm?.meetingLink
  const eventName = embedFormdata?.eventName || embedFormdata?.embedForm?.eventName
  const videoLink = embedFormdata?.videoLink || embedFormdata?.embedForm?.videoLink
  
  
  const [formData, setIsOpen] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  let { isDemoPopUpShown, setIsDemoPopUpShown } = useContext(BookDemoContext)



  if (!embedFormdata) {
    return null
  }

  const pdfUrl = embedFormdata?.attachment?.asset?.url
  const name = embedFormdata?.attachment?.asset.originalFilename

  return (
      <div id={`#hubspotForm`} className={` not-prose flex flex-col gap-6  ${!isMobile && openForm ? 'h-[400px]':'' }`}>
        <SidebarTitle className=" !text-3xl border-zinc-200 pt-6 pb-2">{embedFormdata?.sidebarTitle }</SidebarTitle>
        <EmbedForm
          className={`pt-9 relative  flex items-start`}
          onClose={() => setOpenForm(false)}
          type={'embedForm'}
          data={{
            embedForm: {
              formId,
              meetingLink,
              eventName,
              videoLink
            },
            ...isDemoPopUpShown
          }}
          siteSettings={siteSettings}
          onSubmitSuccess={() => {
            if (pdfUrl) {
              download_file(pdfUrl, `${embedFormdata?.title?.originalFilename ? embedFormdata?.title?.originalFilename :  name}`);
            }
          }}
        />

      </div>
  )
}

export default EmbedFormSection
