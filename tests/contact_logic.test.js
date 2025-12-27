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
  const label = document.getElementById('contactText');
  
  if (!link.href.includes("mailto:contact@nataliaguerramusic.com")) throw new Error("EN href incorrect: " + link.href);
  if (!link.href.includes("subject=Music%20Enquiry")) throw new Error("EN subject incorrect: " + link.href);
  if (label.textContent !== "Contact") throw new Error("EN label incorrect: " + label.textContent);

  // Simulate Spanish
  setLang('es');
  if (!link.href.includes("mailto:contacto@nataliaguerramusic.com")) throw new Error("ES href incorrect: " + link.href);
  if (!link.href.includes("subject=Consulta%20Musical")) throw new Error("ES subject incorrect: " + link.href); // Note encoding
  if (label.textContent !== "Contacto") throw new Error("ES label incorrect: " + label.textContent);
  
  console.log("Logic check passed");
} catch (e) {
  console.error("Logic check FAILED:", e.message);
  failed = true;
}

if (failed) process.exit(1);
