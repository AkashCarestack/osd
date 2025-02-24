import { useTracking } from "cs-tracker";
import React, { useEffect } from "react";

declare global {
  interface Window {
    hbspt: any;
  }
}

interface HubspotFormProps {
    formId: string;
    className?: string;
}

const HubspotFormLegal = ({ formId, className }: HubspotFormProps) => {
  const { trackEvent } = useTracking({}, {});
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/v2.js";
    script.defer = true;
    document.body.appendChild(script);
    script.addEventListener("load", () => {
      // @TS-ignore
      if (window?.hbspt) {
        // @TS-ignore
        window.hbspt.forms.create({
          portalId: "4832409",
          formId: formId,
          target: `#hubspotForm${formId}`,
          
        });
      }
    });
  }, [formId]);

  return (
    <div
      className={`${className ? className : "legal-form"
        }`}
    >
      <div id={`hubspotForm${formId}`}></div>
    </div>
  );
};

export default HubspotFormLegal;
