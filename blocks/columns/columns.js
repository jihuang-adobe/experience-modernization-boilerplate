/**
 * Restructure a text column whose content is a single <p> containing
 * <em> (pretitle) + <strong> (title) + text (description) + <strong><a> (CTA).
 * Splits them into separate elements so CSS can style each independently.
 */
function restructureColumnContent(col) {
  const p = col.querySelector('p');
  if (!p) return;

  const em = p.querySelector(':scope > em');
  const strongs = [...p.querySelectorAll(':scope > strong')];

  const titleStrong = strongs.find((s) => !s.querySelector('a'));
  const ctaStrong = strongs.find((s) => s.querySelector('a'));

  if (!titleStrong) return;

  // Collect description text nodes
  const descParts = [];
  p.childNodes.forEach((node) => {
    if (node === em || node === titleStrong || node === ctaStrong) return;
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      descParts.push(node.textContent.trim());
    }
  });

  const frag = document.createDocumentFragment();

  if (em) {
    const pretitle = document.createElement('p');
    pretitle.className = 'columns-pretitle';
    pretitle.textContent = em.textContent;
    frag.appendChild(pretitle);
  }

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
    ctaP.className = 'columns-cta';
    ctaP.appendChild(ctaStrong.querySelector('a').cloneNode(true));
    frag.appendChild(ctaP);
  }

  p.replaceWith(frag);
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Setup image columns and restructure text columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      } else {
        restructureColumnContent(col);
      }
    });
  });
}
