import { useRouter } from 'next/router'
import * as React from 'react'

import HubSpotForm from './HubspotForm'

export interface EmbedFormProps {
  className?: string
  isPopup?: boolean
  onClose?: () => void
  source?: string
  source1?: string
  onSubmitSuccess?: () => void
  data?:any
  siteSettings?:any
  type?:string
}


export const EmbedForm: React.FC<EmbedFormProps> = ({
  onSubmitSuccess,
  data,
  siteSettings,
  type
}) => {
  
    const router = useRouter();
    // Extract form ID from embedForm field data structure
    const formId = data?.embedForm?.formId || data?.formId || (siteSettings && siteSettings[0]?.demoMainFormId ? siteSettings[0]?.demoMainFormId : '6b2d6906-028e-4d65-9cd1-34d528e0d5c0')
    const meetingLink = data?.embedForm?.meetingLink || data?.meetingLink || (siteSettings && siteSettings[0]?.demoMeetingLink ? siteSettings[0]?.demoMeetingLink : undefined);    
    const eventName = data?.embedForm?.eventName || data?.eventName || (siteSettings && siteSettings[0]?.dmeoFormEventName ? siteSettings[0]?.dmeoFormEventName : undefined);
    const videoLink = data?.embedForm?.videoLink || data?.videoLink;
    const sidebarTitle = data?.embedForm?.sidebarTitle || data?.sidebarTitle;
    const pdfUrl = data?.embedForm?.pdfUrl || data?.pdfUrl;
    
    


  
  return (
    <div
    id='hubspotForm'
    className={` `}
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
   
    <div
      className="fixed  transition-opacity"
      aria-hidden="true"
    ></div>

    <div className="">
      <div
        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
       
        <div
          className="relative transform overflow-hidden rounded-lg min-h-[706px]
          bg-white text-left  transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div className="bg-white">
            <div className="sm-3 sm:mt-0 sm:text-left w-full flex flex-col gap-8"
            >
              <div className="mt-2 w-full mb-8">
                <HubSpotForm type={type} onSubmitSuccess={onSubmitSuccess} id={formId} eventName={eventName} meetingLink={meetingLink} videoLink={videoLink} sidebarTitle={sidebarTitle} pdfUrl={pdfUrl}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default EmbedForm

