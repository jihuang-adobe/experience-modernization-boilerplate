import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Restructure card body: split <p> containing <strong><a> (title) + text (description)
 * into separate title and description elements.
 */
function restructureCardBody(body) {
  const p = body.querySelector('p');
  if (!p) return;

  const strong = p.querySelector(':scope > strong');
  if (!strong) return;

  const link = strong.querySelector('a');

  // Collect description text nodes
  const descParts = [];
  p.childNodes.forEach((node) => {
    if (node === strong) return;
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      descParts.push(node.textContent.trim());
    }
  });

  const frag = document.createDocumentFragment();

  // Title
  const titleP = document.createElement('p');
  titleP.className = 'cards-card-title';
  if (link) {
    titleP.appendChild(link.cloneNode(true));
  } else {
    titleP.textContent = strong.textContent;
  }
  frag.appendChild(titleP);

  // Description
  if (descParts.length) {
    const desc = document.createElement('p');
    desc.className = 'cards-card-description';
    desc.textContent = descParts.join(' ');
    frag.appendChild(desc);
  }

  p.replaceWith(frag);
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
        restructureCardBody(div);
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });
  block.replaceChildren(ul);
}
