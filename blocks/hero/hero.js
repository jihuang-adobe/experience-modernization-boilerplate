/**
 * Restructure hero text content from a single <p> containing
 * <strong> (title) + text (description) + <strong><a> (CTA)
 * into separate heading, paragraph, and CTA elements.
 */
export default function decorate(block) {
  const textRow = block.querySelector(':scope > div:last-child');
  if (!textRow) return;

  // Find the paragraph with mixed inline content (may be nested in a div)
  const p = textRow.querySelector('p');
  if (!p) return;

  const strongs = [...p.querySelectorAll(':scope > strong')];
  const titleStrong = strongs.find((s) => !s.querySelector('a'));
  const ctaStrong = strongs.find((s) => s.querySelector('a'));

  if (!titleStrong) return;

  // Collect description text nodes
  const descParts = [];
  p.childNodes.forEach((node) => {
    if (node === titleStrong || node === ctaStrong) return;
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      descParts.push(node.textContent.trim());
    }
  });

  const frag = document.createDocumentFragment();

  const heading = document.createElement('h2');
  heading.textContent = titleStrong.textContent;
  frag.appendChild(heading);

  if (descParts.length) {
    const desc = document.createElement('p');
    desc.textContent = descParts.join(' ');
    frag.appendChild(desc);
  }

  if (ctaStrong) {
    const ctaP = document.createElement('p');
    ctaP.className = 'hero-cta';
    ctaP.appendChild(ctaStrong.querySelector('a').cloneNode(true));
    frag.appendChild(ctaP);
  }

  p.replaceWith(frag);
}
