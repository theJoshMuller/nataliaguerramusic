# Contact Localization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Localize the contact link (mailto href and label) and email subject in `index.html`, adding support for distinct English/Spanish email addresses.

**Architecture:** Update the existing vanilla JS `copy` object and `setLang` function within `index.html`. Use a Node.js-based test harness with a minimal DOM mock to verify logic correctness without a browser.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Node.js (for testing only).

### Task 1: Setup Test Infrastructure

**Files:**
- Create: `tests/setup.js`

**Step 1: Write the DOM Mock**
Create a reusable setup file that mocks the browser environment expected by the `index.html` script.

```javascript
// tests/setup.js
const fs = require('fs');
const path = require('path');

global.document = {
  getElementById: (id) => {
    if (!global.mockElements[id]) {
      global.mockElements[id] = {
        textContent: '',
        href: '',
        style: {},
        setAttribute: (k, v) => {},
        addEventListener: (e, cb) => {},
        classList: { add:()=>{}, remove:()=>{} }
      };
    }
    return global.mockElements[id];
  },
  documentElement: { lang: 'en' }
};

global.mockElements = {};

// Helper to load the script from index.html
global.loadIndexScript = () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  eval(scriptContent); 
};
```

**Step 2: Verify Setup**
Run `node tests/setup.js` to ensure it compiles.
(It won't output anything, but shouldn't crash).

### Task 2: Implement TDD Cycle for Logic

**Files:**
- Create: `tests/contact_logic.test.js`
- Modify: `index.html`

**Step 1: Write the failing test**

```javascript
// tests/contact_logic.test.js
require('./setup');

// Reset mocks
global.mockElements = {};

// Load code
global.loadIndexScript();

// TEST 1: Check Data Structure
let failed = false;
try {
  if (copy.en.email !== "contact@nataliaguerramusic.com") throw new Error("Missing EN email");
  if (copy.es.email !== "contacto@nataliaguerramusic.com") throw new Error("Missing ES email");
  if (copy.en.emailSubject !== "Music Enquiry") throw new Error("Missing EN subject");
  if (copy.es.emailSubject !== "Consulta Musical") throw new Error("Missing ES subject");
  console.log("Data check passed");
} catch (e) {
  console.error("Data check FAILED:", e.message);
  failed = true;
}

// TEST 2: Check Logic
try {
  // Simulate English
  setLang('en');
  const link = document.getElementById('contactLink');
  if (!link.href.includes("mailto:contact@nataliaguerramusic.com")) throw new Error("EN href incorrect: " + link.href);
  if (!link.href.includes("subject=Music%20Enquiry")) throw new Error("EN subject incorrect: " + link.href);

  // Simulate Spanish
  setLang('es');
  if (!link.href.includes("mailto:contacto@nataliaguerramusic.com")) throw new Error("ES href incorrect: " + link.href);
  if (!link.href.includes("subject=Consulta%20Musical")) throw new Error("ES subject incorrect: " + link.href); // Note encoding
  
  console.log("Logic check passed");
} catch (e) {
  console.error("Logic check FAILED:", e.message);
  failed = true;
}

if (failed) process.exit(1);
```

**Step 2: Run test to verify it fails**
Run: `node tests/contact_logic.test.js`
Expected: Fail at "Data check".

**Step 3: Implement Data in `index.html`**
Add the email and subject fields to `copy`.

**Step 4: Run test again**
Run: `node tests/contact_logic.test.js`
Expected: Fail at "Logic check" (href not updating).

**Step 5: Implement Logic in `index.html`**
Update `setLang` to set `els.contactLink.href`.
*Note:* This will fail because `els.contactLink` is undefined in the `els` map in `index.html`.
So we must also add `contactLink` to the `els` map in `index.html`.
BUT `contactLink` ID doesn't exist in HTML yet.
The script `loadIndexScript` mocks `getElementById`, so `els` will pick up the mock. This is fine for logic testing.

**Step 6: Run test to verify it passes**
Run: `node tests/contact_logic.test.js`
Expected: PASS.

### Task 3: Update HTML Structure

**Files:**
- Modify: `index.html`

**Step 1: Add ID to Contact Link**
Add `id="contactLink"` to the `<a>` tag.
Also update the `span` ID if needed (it is already `contactText`).
Verify visually or with `grep`.

**Step 2: Manual Verification**
Open `index.html` in browser (or check text file).
Check that `href` is constructed correctly when clicking (or assume logic test covers it if structure matches).

**Step 3: Cleanup**
Remove `tests/` directory (optional, but good for cleanliness).
OR keep it? Let's keep it for future.

### Task 4: Content Cleanup

**Files:**
- Modify: `index.html`

**Step 1: Clean up Label Text**
Change "Contact / Contacto" to just "Contact" (en) and "Contacto" (es) in `copy` object.
The existing code has:
`contact: "Contact / Contacto"`
Update it to:
`contact: "Contact"` (en)
`contact: "Contacto"` (es)

**Step 2: Verify**
Run `node tests/contact_logic.test.js`. Add assertions for `contactText` content if desired.

### Task 5: Final Commit

**Step 1: Commit Changes**
`git add index.html tests/`
`git commit -m "feat: Localize contact link email and subject"`
