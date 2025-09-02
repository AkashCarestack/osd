import { useTracking } from 'cs-tracker'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getCookie } from '~/utils/tracker/cookie'
import useMediaQuery from '~/utils/useMediaQueryHook';
import { downloadPDF } from '~/utils/downloadHelper';

declare global {
  interface Window {
    hbspt?: any;
    dataLayer: any[];
    type?: string
  }
}

const HubSpotForm = ({
  onSubmitSuccess,
  id,
  eventName,
  meetingLink,
  videoLink,
  type,
  title = 'Download the Full Report for Free',
  sidebarTitle,
  pdfUrl
}: {
  onSubmitSuccess?: () => void
  id?: string
  eventName?: string
  meetingLink?: string
  videoLink?: string
  type?: string
  title?: string
  sidebarTitle?: string
  pdfUrl?: string
}) => {
  const { trackEvent } = useTracking({}, {});  
  const router = useRouter();
  const isMobile = useMediaQuery(767);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  

  useEffect(() => {
    const window2 = window
   const loadHubSpotScript = async () => {
      // Ensure script is only fetched once
      if (
        !document.querySelector(`script[src="//js.hsforms.net/forms/v2.js"]`)
      ) {
        const scriptEl = document.createElement('script')
        scriptEl.setAttribute('charset', 'utf-8')
        scriptEl.setAttribute('type', 'text/javascript')
        scriptEl.src = '//js.hsforms.net/forms/v2.js'

        // Append the script to the document body
        document.body.appendChild(scriptEl)
        

        // Wait for the script to load
        scriptEl.onload = () => {
          setIsScriptLoaded(true);
          if (window?.hbspt) {
            // Create the form
            window.hbspt.forms.create({
              portalId: '4832409',
              region: 'na1',
              formId: id || '6b2d6906-028e-4d65-9cd1-34d528e0d5c0',
              
              // formId: "f2fbfea3-a1e5-4e17-a506-a9d341a45458",
              
              target: '#hubspotForm',
              inlineMessage: `
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clip-path="url(#clip0_2381_7595)">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58578L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.7071L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z" fill="#10B981"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_2381_7595">
                        <rect width="16" height="16" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                      <span style="font-size: 14px">Thank you</span>
              </div>
            `,
              onFormReady: function ($form, ctx) {
                // Prefill email from localStorage if available
                const savedEmail = localStorage.getItem('email')
                if (savedEmail) {
                  const emailInput = $form.querySelector('input[name="email"]')
                  if (emailInput) {
                    emailInput.value = savedEmail
                    emailInput.focus()
                  }
                }
                
                // Add a small delay to ensure form is fully rendered
                setTimeout(() => {
                  setIsFormLoaded(true);
                }, 100);
              },
              onFormSubmit: function (form) {
                const formData = new FormData(form); 
                const allowedFields = [
                  "email",
                  "company",
                  "firstname",
                  "lastname",
                  "mobilephone",
                  "practicename",
                ]; // List of valid form field names
                const params = new URLSearchParams();
              
                // Filter only the allowed fields from the formData
                for (const [key, value] of formData.entries()) {
                  if (allowedFields.includes(key)) {
                    params.append(key, value as string);
                  }
                }
                
                const email = form.querySelector('input[name="email"]').value
                window2.dataLayer.push({
                  email: email,
                  event: eventName || 'resource_download',
                });
                if(meetingLink){
                  document.getElementById("successMessage").style.display = "block";
                }
                
                trackEvent({
                  e_name: eventName || 'resource_download',
                  e_type: "form-submission",
                  e_time: new Date(),
                  e_path: window?.location.href,
                  user_segment:getCookie("__cs_vs"),
                  url_params: { email, ...params },
                  current_path: window?.location.href,
                  base_path: window.location.origin + window.location.pathname,
                  domain: window.location.origin,
                  destination_url: null,
                  referrer_url: window.document.referrer,
                });
                if (onSubmitSuccess) {
                  onSubmitSuccess();
                }

                const urlParams = new URLSearchParams(window.location.search);

                
                // Only include video_link if sidebar title indicates playbook download
                const isPlaybookDownload = sidebarTitle && sidebarTitle.toLowerCase().includes('download this resource for free');
                
                let query;
                if (isPlaybookDownload) {
                  // For playbook downloads, only send essential parameters
                  query = new URLSearchParams({
                    email: email,
                    page_url: window.location.href,
                    video_link: videoLink || '',
                    sidebar_title: sidebarTitle || ''
                  });
                } else {
                  // For regular forms, send all tracking parameters
                  query = new URLSearchParams({
                    email: email,
                    source: urlParams.get("utm_source") || '',
                    campaign: urlParams.get("utm_campaign") || '',
                    medium: urlParams.get("utm_medium") || '',
                    term: urlParams.get("utm_term") || '',
                    lead_source: urlParams.get("lead_source") || '',
                    page_url: window.location.href
                  });
                }
                

                
                setTimeout(async () => {
                  try {
                    const response = await fetch(`/api/hs?${query.toString()}`);
                    const responseData = await response.json();
                    
                    // Handle meeting link redirect
                    if (meetingLink) {
                      const meetingUrl = `${meetingLink}?${params.toString()}`;
                      router.push(meetingUrl);
                    }
                    
                    // Handle video link - only for non-playbook downloads
                    if (videoLink && !isPlaybookDownload) {
                      window.open(videoLink, '_blank');
                    }
                    
                    // Handle PDF download for playbook downloads
                    if (responseData.downloadInfo && responseData.downloadInfo.shouldDownload) {
                      downloadPDF(responseData.downloadInfo.pdfUrl, responseData.downloadInfo.filename);
                    }
                  } catch (error) {
                    console.error('Failed to send HubSpot data:', error);
                  }
                }, 3000);
              },
              
            } as any)
          }
        }
      }
    }

    loadHubSpotScript()

    // Cleanup the script if necessary
    return () => {
      const hubspotScript = document.querySelector(
        `script[src="//js.hsforms.net/forms/v2.js"]`,
      )
      if (hubspotScript) hubspotScript.remove()
    }
  }, [id, eventName, router, trackEvent, meetingLink, videoLink, sidebarTitle, onSubmitSuccess])

  return (
    <>
      <div className="hubspot-form-container">
        {/* Custom Title */}
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          {title}
        </h2>
        
        {/* Loading Indicator */}
        {!isFormLoaded && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600">Loading form...</span>
          </div>
        )}
        
        {/* HubSpot Form Target - Only render when script is loaded */}
        {isScriptLoaded && (
          <div id="hubspotForm" className={`hubspot-form-wrapper ${!isFormLoaded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto transition-all duration-500 ease-in-out'}`}></div>
        )}
        
        {/* Success Message */}
        <div id="successMessage" style={{display: 'none', marginTop: '20px'}}>
          Please wait..
        </div>
      </div>

      <style jsx global>{`
        .hubspot-form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 8px;
        }

        .hubspot-form-wrapper {
          width: 100%;
        }

        /* Form styling to match the clean design */
        #hubspotForm {
          width: 100%;
        }

        #hubspotForm fieldset {
          width: 100%;
          display: block !important;
          gap: 0 !important;
          max-width: none !important;
          border: none;
          padding: 0;
          margin: 0;
        }

        #hubspotForm .hs-form-field {
          margin-bottom: 1rem;
        }

        #hubspotForm .hs-form-field label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        #hubspotForm .hs-form-field input,
        #hubspotForm .hs-form-field select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 1rem;
          background: white;
        }

        #hubspotForm .hs-form-field input:focus,
        #hubspotForm .hs-form-field select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        #hubspotForm .hs-error-msgs {
          color: #dc2626 !important;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        #hubspotForm .hs-error-msgs label {
          color: #dc2626 !important;
        }

        #hubspotForm .hs-error-msgs .hs-error-msg {
          color: #dc2626 !important;
        }

        /* HubSpot validation error styling */
        #hubspotForm .hs-form-field.hs-error .hs-error-msgs,
        #hubspotForm .hs-form-field.hs-error .hs-error-msgs label,
        #hubspotForm .hs-form-field.hs-error .hs-error-msgs .hs-error-msg {
          color: #dc2626 !important;
        }

        /* Additional error message styling */
        #hubspotForm .hs-error-msgs ul,
        #hubspotForm .hs-error-msgs li {
          color: #dc2626 !important;
        }

        /* Field validation error styling */
        #hubspotForm .hs-form-field.hs-error input,
        #hubspotForm .hs-form-field.hs-error select {
          border-color: #dc2626 !important;
        }

        #hubspotForm .actions {
          margin-top: 1.5rem;
          margin-bottom: ${type !== "embedForm" && !isMobile ? "16px" : "0"};
        }

        #hubspotForm .hs-button {
          width: 100%;
          padding: 0.875rem 1.5rem;
          background-color: #1f2937;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        #hubspotForm .hs-button:hover {
          background-color: #111827;
        }

        /* Success message styling */
        #hubspotForm .submitted-message {
          display: ${meetingLink ? 'none' : 'block'};
          height: 100% !important;
          width: 100%;
          text-align: center;
          padding: 2rem;
          color: #059669;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hubspot-form-container {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  )
}

export default HubSpotForm
