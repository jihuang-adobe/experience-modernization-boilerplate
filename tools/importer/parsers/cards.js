/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://wknd.site/us/en.html
 * Base Block: cards
 *
 * Block Structure:
 * - Each row: [image, text content (title link + description)]
 *
 * Source HTML Pattern:
 * <ul class="cmp-image-list">
 *   <li class="cmp-image-list__item">
 *     <article class="cmp-image-list__item-content">
 *       <a class="cmp-image-list__item-image-link" href="...">
 *         <div class="cmp-image-list__item-image"><img .../></div>
 *       </a>
 *       <a class="cmp-image-list__item-title-link" href="...">
 *         <span class="cmp-image-list__item-title">Title</span>
 *       </a>
 *       <span class="cmp-image-list__item-description">Description</span>
 *     </article>
 *   </li>
 * </ul>
 *
 * Generated: 2026-02-25
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each card is a .cmp-image-list__item
  // VALIDATED: Found .cmp-image-list__item elements in captured DOM
  const items = element.querySelectorAll('.cmp-image-list__item');

  items.forEach((item) => {
    // Extract image
    // VALIDATED: Found .cmp-image-list__item-image img in captured DOM
    const img = item.querySelector('.cmp-image-list__item-image img')
      || item.querySelector('img');

    // Extract title link
    // VALIDATED: Found .cmp-image-list__item-title-link with nested .cmp-image-list__item-title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleText = item.querySelector('.cmp-image-list__item-title');

    // Extract description
    // VALIDATED: Found .cmp-image-list__item-description in captured DOM
    const description = item.querySelector('.cmp-image-list__item-description');

    // Build text content cell
    const textCell = document.createElement('div');

    if (titleLink && titleText) {
      // Create bold linked title
      const strong = document.createElement('strong');
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.textContent = titleText.textContent;
      strong.append(link);
      textCell.append(strong);
    } else if (titleText) {
      const strong = document.createElement('strong');
      strong.textContent = titleText.textContent;
      textCell.append(strong);
    }

    if (description) {
      const descText = document.createTextNode(' ' + description.textContent);
      textCell.append(descText);
    }

    // Row: [image, text content]
    if (img) {
      cells.push([img.cloneNode(true), textCell]);
    } else {
      cells.push([textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
