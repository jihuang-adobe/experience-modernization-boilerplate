/* eslint-disable no-param-reassign */

/**
 * Convert a paragraph starting with markdown heading syntax into
 * a proper heading element, splitting body content that follows
 * the heading phrase into a sibling wrapper.
 */
function convertHeadingParagraph(p) {
  const first = p.firstChild;
  if (!first || first.nodeType !== Node.TEXT_NODE) return;
  const match = first.textContent.match(/^(#{1,6})\s+/);
  if (!match) return;

  const level = match[1].length;
  first.textContent = first.textContent.replace(/^#{1,6}\s+/, '');

  const heading = document.createElement(`h${level}`);
  const body = document.createElement('div');
  let inBody = false;

  // Words that commonly start body/sentence text after a heading phrase
  const bodyRe = /^(.{10,60}?)\s+(With|Our|The|Search|Access|We|At|In|For|An|As|Each|All|This|That)\s/;

  [...p.childNodes].forEach((node) => {
    if (inBody) {
      body.appendChild(node);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'A' || node.tagName === 'STRONG') {
        inBody = true;
        body.appendChild(node);
        return;
      }
      heading.appendChild(node);
      return;
    }

    // Long text nodes may contain heading text + body text
    if (node.nodeType === Node.TEXT_NODE && node.textContent.length > 20) {
      const bm = node.textContent.match(bodyRe);
      if (bm) {
        heading.appendChild(
          document.createTextNode(bm[1].trimEnd()),
        );
        body.appendChild(
          document.createTextNode(node.textContent.slice(bm[1].length)),
        );
        inBody = true;
        return;
      }
    }

    heading.appendChild(node);
  });

  // Trim trailing whitespace from heading
  const last = heading.lastChild;
  if (last?.nodeType === Node.TEXT_NODE) {
    last.textContent = last.textContent.trimEnd();
  }

  const frag = document.createDocumentFragment();
  frag.appendChild(heading);
  if (body.childNodes.length) frag.appendChild(body);
  p.replaceWith(frag);
}

/**
 * Handle inline ### headings that appear after an image in a paragraph.
 * Splits the paragraph and inserts a proper heading element.
 */
function convertInlineHeadings(block) {
  block.querySelectorAll('p').forEach((p) => {
    [...p.childNodes].forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const m = node.textContent.match(/^\s*(#{2,6})\s+(.+)/);
      if (!m) return;
      const level = m[1].length;
      const heading = document.createElement(`h${level}`);
      heading.textContent = m[2].trim();
      node.replaceWith(heading);
    });

    // If the <p> now contains block-level elements, unwrap them
    if (p.querySelector('h2, h3, h4, h5, h6')) {
      const frag = document.createDocumentFragment();
      [...p.childNodes].forEach((child) => frag.appendChild(child));
      p.replaceWith(frag);
    }
  });
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Pass 1: convert paragraphs that START with ## / ### headings
  block.querySelectorAll('p').forEach((p) => convertHeadingParagraph(p));

  // Pass 2: handle ### headings that appear mid-paragraph (after images)
  convertInlineHeadings(block);

  // Setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
