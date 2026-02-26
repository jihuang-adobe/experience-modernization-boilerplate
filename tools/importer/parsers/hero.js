/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://wknd.site/us/en.html
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: background image
 * - Row 2: text content (heading + description + CTA)
 *
 * Source HTML Pattern:
 * <div class="teaser cmp-teaser--hero cmp-teaser--imagebottom">
 *   <div class="cmp-teaser">
 *     <div class="cmp-teaser__content">
 *       <h2 class="cmp-teaser__title">...</h2>
 *       <div class="cmp-teaser__description">...</div>
 *       <a class="cmp-teaser__action-link">...</a>
 *     </div>
 *     <div class="cmp-teaser__image"><img .../></div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-25
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract background image
  // VALIDATED: Found .cmp-teaser__image img in captured DOM (#teaser-ef0ce278d1)
  const img = element.querySelector('.cmp-teaser__image img')
    || element.querySelector('img');

  // Row 1: Background image
  if (img) {
    cells.push([img.cloneNode(true)]);
  }

  // Extract heading
  // VALIDATED: Found .cmp-teaser__title (h2) in captured DOM
  const heading = element.querySelector('.cmp-teaser__title')
    || element.querySelector('h2, h1, h3');

  // Extract description
  // VALIDATED: Found .cmp-teaser__description in captured DOM
  const description = element.querySelector('.cmp-teaser__description')
    || element.querySelector('[class*="description"]');

  // Extract CTA link
  // VALIDATED: Found .cmp-teaser__action-link in captured DOM
  const cta = element.querySelector('.cmp-teaser__action-link')
    || element.querySelector('a[href]');

  // Row 2: Text content (heading, description, CTA)
  const textCell = document.createElement('div');
  if (heading) textCell.append(heading.cloneNode(true));
  if (description) textCell.append(description.cloneNode(true));
  if (cta) {
    const strong = document.createElement('strong');
    strong.append(cta.cloneNode(true));
    textCell.append(strong);
  }

  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}
