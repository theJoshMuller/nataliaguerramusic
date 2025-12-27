# Contact Link Localization Design

## Overview
The goal is to localize the "Contact" link on the website's index page. Currently, it has a hardcoded generic `mailto` link and a mixed-language label. We will update it to support distinct email addresses and subject lines for English and Spanish, matching the existing localization pattern.

## Implementation Details

### Data Model
The existing `copy` object in `index.html` will be expanded.

**English (`en`):**
- `contact`: "Contact"
- `email`: "contact@nataliaguerramusic.com"
- `emailSubject`: "Music Enquiry"

**Spanish (`es`):**
- `contact`: "Contacto"
- `email`: "contacto@nataliaguerramusic.com"
- `emailSubject`: "Consulta Musical"

### DOM Elements
- The `<a>` tag for the contact button will receive a new ID: `contactLink`.
- The existing `contactText` span will continue to be used for the label text.

### Logic (`setLang` function)
The `setLang` function currently updates text content. It will be updated to also modify the `href` attribute of the contact link.

Pseudocode:
```javascript
function setLang(lang) {
  const d = copy[lang];
  // ... existing text updates ...
  els.contactText.textContent = d.contact;
  
  // New link construction
  els.contactLink.href = `mailto:${d.email}?subject=${encodeURIComponent(d.emailSubject)}`;
}
```

### Verification
- **Visual Check:** Verify the button text changes between "Contact" and "Contacto" when toggling languages.
- **Functional Check:** Hover/Click the link in English mode to verify it points to `contact@nataliaguerramusic.com` with subject "Music Enquiry".
- **Functional Check:** Hover/Click the link in Spanish mode to verify it points to `contacto@nataliaguerramusic.com` with subject "Consulta Musical".
