/**
 * Shared HubSpot v2 embed overrides for hero demo cards (Curve, Fortune, DEO, etc.).
 * Scoped with `.hero-hubspot-form-shell` so other HubSpot blocks stay unchanged.
 */
export const heroHubspotFormEmbedGlobalCss = `
.hero-hubspot-form-shell {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.hero-hubspot-form-shell .hs-form,
.hero-hubspot-form-shell .hs-form label,
.hero-hubspot-form-shell .hs-form input,
.hero-hubspot-form-shell .hs-form textarea,
.hero-hubspot-form-shell .hs-form select,
.hero-hubspot-form-shell .hs-form button,
.hero-hubspot-form-shell .legal-consent-container,
.hero-hubspot-form-shell .hs-richtext {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}
.hero-hubspot-form-shell .hs-form fieldset {
  max-width: 100% !important;
  background: #ffffff !important;
}
.hero-hubspot-form-shell .hs-form-field {
  margin-bottom: 24px;
}
.hero-hubspot-form-shell .hs-form-field label {
  color: #3f3f46 !important;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: normal;
}
.hero-hubspot-form-shell .hs-form-required label::after {
  color: #ca6458 !important;
}
.hero-hubspot-form-shell .hs-form-required-symbol,
.hero-hubspot-form-shell abbr.hs-form-required-symbol,
.hero-hubspot-form-shell .hero-hs-required-star {
  color: #ca6458 !important;
}
.hero-hubspot-form-shell input.hs-input,
.hero-hubspot-form-shell textarea.hs-input,
.hero-hubspot-form-shell select.hs-input {
  width: 100% !important;
  border-radius: 6px;
  border: 1px solid #d4d4d8 !important;
  padding: 0.5rem 0.65rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  background: #ffffff !important;
  color: #18181b !important;
}
.hero-hubspot-form-shell .hs_submit.hs-submit {
  margin-top: 16px !important;
}
.hero-hubspot-form-shell .hs-button.primary,
.hero-hubspot-form-shell input[type='submit'].hs-button {
  width: 100%;
  margin-top: 0;
  background: #2627e6 !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  line-height: 1.6 !important;
  letter-spacing: normal !important;
}
.hero-hubspot-form-shell .hs-button.primary:hover,
.hero-hubspot-form-shell input[type='submit'].hs-button:hover {
  background: #1c1dc4 !important;
  color: #ffffff !important;
}
.hero-hubspot-form-shell .legal-consent-container,
.hero-hubspot-form-shell .hs-richtext,
.hero-hubspot-form-shell .hs-richtext p {
  color: #52525b !important;
  font-size: 0.75rem;
  line-height: 1.5;
  font-weight: 400;
}
.hero-hubspot-form-shell .hs-error-msgs,
.hero-hubspot-form-shell .hs-error-msgs ul,
.hero-hubspot-form-shell .hs-error-msgs li {
  color: #ca6458 !important;
}
.hero-hubspot-form-shell .hs-error-msgs label,
.hero-hubspot-form-shell .hs-error-msg {
  color: #ca6458 !important;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}
.hero-hubspot-form-shell .hs-form-field.hs-error .hs-error-msgs,
.hero-hubspot-form-shell .hs-form-field.hs-error .hs-error-msgs label,
.hero-hubspot-form-shell .hs-form-field.hs-error .hs-error-msgs .hs-error-msg {
  color: #ca6458 !important;
}
.hero-hubspot-form-shell .hs-form-field.hs-error input.hs-input,
.hero-hubspot-form-shell .hs-form-field.hs-error textarea.hs-input,
.hero-hubspot-form-shell .hs-form-field.hs-error select.hs-input {
  border-color: #ca6458 !important;
}
.hero-hubspot-form-shell input.hs-input.error,
.hero-hubspot-form-shell textarea.hs-input.error,
.hero-hubspot-form-shell select.hs-input.error {
  border-color: #ca6458 !important;
}
.hero-hubspot-form-shell .hbspt-form,
.hero-hubspot-form-shell .hs-form,
.hero-hubspot-form-shell form {
  min-height: 0 !important;
}
.hero-hubspot-form-shell fieldset.form-columns-2 {
  display: flex !important;
  flex-wrap: wrap !important;
  column-gap: 10px !important;
  row-gap: 0 !important;
  align-items: flex-start !important;
  padding-bottom: 0 !important;
}
.hero-hubspot-form-shell fieldset.form-columns-2 > .hs-form-field {
  box-sizing: border-box !important;
  flex: 1 1 calc(50% - 5px) !important;
  max-width: calc(50% - 5px) !important;
  min-width: 0 !important;
  float: none !important;
  width: auto !important;
}
.hero-hubspot-form-shell fieldset.form-columns-2 > .hs-form-field[class*='fieldtype-textarea'],
.hero-hubspot-form-shell fieldset.form-columns-2 > .hs-form-field[class*='fieldtype-rich_text'] {
  flex: 1 1 100% !important;
  max-width: 100% !important;
}
`
