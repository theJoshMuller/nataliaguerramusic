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
  // Helper to extract script content that handles the logic
  // We look for the main script block. 
  // Note: This regex might need adjustment if there are multiple script tags.
  // Based on the plan, we assume there is one main script or we need to find the specific one.
  // The plan used: html.match(/<script>([\s\S]*?)<\/script>/)[1];
  // Let's stick to the plan's code.
  const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  // Expose variables to global scope for testing
  const toRun = scriptContent + "; global.copy = copy; global.setLang = setLang; global.els = els;";
  eval(toRun); 
};
