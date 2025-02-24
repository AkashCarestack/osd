
import HubspotFormLegal from '~/components/commonSections/HubspotLegalForm'
import Section from '~/components/Section'

function UsOptOutRequest() {
  return (
    <div className="w-full flex justify-center py-40 px-8 legal-content">
      <Section className=" w-full md:max-w-5xl flex flex-col">
        <div className="flex flex-col text-center justify-center mb-10">
          <h1 className="text-4xl font-semibold">
          Good Methods Global Inc. dba VoiceStack <br/>
          Sale of Personal Information Opt-Out Request Form
          </h1>
          {/* <h2 className="text-3xl font-semibold">United Kingdom (the “DPA”)</h2>  */}
        </div>

        <div class="legal">
          <div class="legal--inner">
            <div class="legal_page_body">
              <span>
                <p class="legal__text">
                  Each California resident (“Resident”) has the right to opt-out
                  of the sale of their personal information by Good Methods
                  Global Inc. (“VoiceStack”).
                </p>
                <p class="legal__text">
                  In order for us to respond to your request to opt-out of the
                  sale of your personal information, we ask that you submit your
                  request using the form below.
                </p>
                <p class="legal__text">
                  We will complete your request to opt-out within 15 days of
                  VoiceStack’s receipt of a fully completed form and, if you are
                  an Authorized Agent, proof of your legal authority to opt-out.
                  You do not have to use this form, but using this form should
                  make it easier for you to make sure you have provided us with
                  all relevant information and for us to process your request.
                  You may also submit your opt-out request via email at <a href="mailto:privacyconcerns@voicestack.com">
                    privacyconcerns@voicestack.com
                  </a>
                  .
                </p>
                <p class="legal__text">
                  For more information regarding VoiceStack’s privacy practices
                  please review our Privacy Policy available at: <a href="https://www.voicestack.com/legal/2025-01/privacy-policy">
                  https://www.voicestack.com/legal/2025-01/privacy-policy
                  </a>
                  .
                </p>

                <h2 class="legal__section-title">
                  1. California Resident’s Name and Contact Information
                </h2>
                <p class="legal__text">
                  Please provide the Resident’s information below. If you are
                  making this opt-out request on the Resident’s behalf, you
                  should provide your name and contact information in Section 3.
                </p>
                <p class="legal__text">
                  We will only use the information you provide on this form to
                  (i) identify you, (ii) respond to your opt-out request if
                  needed, and (iii) keep a record of your opt-out request and
                  our response.
                </p>
              </span>
              <HubspotFormLegal formId="29261e6e-3d10-4ca1-b909-7f0b1fa722d1"/>
              <span>
                <h2 class="legal__section-title">
                  2. Requests Made by an Authorized Agent on a Resident’s Behalf
                </h2>
                <p class="legal__text">
                  Please complete this section of the form with your name and
                  contact details if you are acting as an authorized agent on
                  the Resident’s behalf.
                </p>
              </span>
              <HubspotFormLegal formId="0a29f8e8-0d49-4d8a-a207-1c7fa5da452f"/>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default UsOptOutRequest
