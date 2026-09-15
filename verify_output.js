const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'dist', 'blog', 'como-calcular-el-iva-facilmente-con-una-calculadora-de-iva', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('HTML File size:', html.length, 'bytes');

// 1. Check title and description
const titleMatch = html.match(/<title>(.*?)<\/title>/);
console.log('Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');

const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
console.log('Description:', descMatch ? descMatch[1] : 'NOT FOUND');

// 2. Canonical
const canonMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
console.log('Canonical:', canonMatch ? canonMatch[1] : 'NOT FOUND');

// 3. Open Graph
const ogTitle = html.match(/<meta property="og:title" content="([^"]*)"/);
const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/);
const ogImageAlt = html.match(/<meta property="og:image:alt" content="([^"]*)"/);
const ogType = html.match(/<meta property="og:type" content="([^"]*)"/);
console.log('OG Title:', ogTitle ? ogTitle[1] : 'NOT FOUND');
console.log('OG Image:', ogImage ? ogImage[1] : 'NOT FOUND');
console.log('OG Image Alt:', ogImageAlt ? ogImageAlt[1] : 'NOT FOUND');
console.log('OG Type:', ogType ? ogType[1] : 'NOT FOUND');

// 4. Schema markup
const schemaMatches = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
console.log('\nJSON-LD blocks found:', schemaMatches.length);
schemaMatches.forEach((sm, i) => {
  try {
    const parsed = JSON.parse(sm[1]);
    console.log(`Schema ${i+1} @type:`, JSON.stringify(parsed['@type']), parsed.name || parsed.headline || '');
  } catch (e) {
    console.error(`Schema ${i+1} JSON parse error:`, e.message);
  }
});

// 5. Check images inside article
const imgMatches = [...html.matchAll(/<img[^>]+>/g)];
console.log('\nImages found in page:', imgMatches.length);
imgMatches.forEach(img => console.log('  Image tag:', img[0]));

// 6. Check for HR tags
const hrMatches = html.match(/<hr[^>]*>/gi);
console.log('\nHR tags found:', hrMatches ? hrMatches.length : 0);

// 7. Check article content for hyphens (in headings, paragraphs, alts, breadcrumbs)
const articleMatch = html.match(/<article[\s\S]*?<\/article>/);
if (articleMatch) {
  const articleHtml = articleMatch[0];
  // Strip tags but keep alt text and text content
  const textWithoutTags = articleHtml
    .replace(/<img[^>]*alt="([^"]*)"[^>]*>/g, ' ALT_TEXT_START $1 ALT_TEXT_END ')
    .replace(/<[^>]*>/g, ' ');

  console.log('\nChecking hyphens in article text and alts...');
  // check for standard hyphen, en-dash, em-dash, non-breaking hyphen
  const hyphenMatches = textWithoutTags.match(/[\u002D\u2010\u2011\u2012\u2013\u2014\u2015]/g);
  if (hyphenMatches && hyphenMatches.length > 0) {
    console.log('WARNING: Found hyphens in article text/alts:', hyphenMatches.length);
  } else {
    console.log('SUCCESS: ZERO hyphens found in article text, headings, alts, and elements!');
  }
}
