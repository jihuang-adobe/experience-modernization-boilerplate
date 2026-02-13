export default function decorate(block) {
  // Convert markdown heading syntax in paragraphs to proper headings
  block.querySelectorAll('p').forEach((p) => {
    const text = p.textContent.trim();
    const match = text.match(/^(#{1,6})\s+(.+)/);
    if (match) {
      const [, hashes, content] = match;
      const heading = document.createElement(`h${hashes.length}`);
      heading.textContent = content;
      p.replaceWith(heading);
    }
  });

  // Two-tone heading: split into light intro + bold remainder
  // Original: "Bringing the Best" (400) + "Doctors and Services
  // to Your Neighborhood" (700, larger)
  const h1 = block.querySelector('h1');
  if (h1 && !h1.querySelector('.hero-text-bold')) {
    const fullText = h1.textContent.trim();
    const splitPatterns = [
      /^(Bringing the Best)\s+(.+)$/i,
      /^([^.]{10,30})\s+((?:Doctors|Services|Care).+)$/i,
    ];
    const matched = splitPatterns
      .map((pattern) => fullText.match(pattern))
      .find((m) => m);
    if (matched) {
      const [, intro, rest] = matched;
      h1.textContent = '';
      h1.appendChild(document.createTextNode(`${intro} `));
      const bold = document.createElement('span');
      bold.className = 'hero-text-bold';
      bold.textContent = rest;
      h1.appendChild(bold);
    }
  }
}
