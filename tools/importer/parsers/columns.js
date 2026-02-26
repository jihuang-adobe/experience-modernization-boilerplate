/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (featured teaser)
 *
 * Source: https://wknd.site/us/en.html
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: [image, text content (pretitle + heading + description + CTA)]
 *
 * Source HTML Pattern:
 * <div class="teaser cmp-teaser--featured">
 *   <div class="cmp-teaser">
 *     <div class="cmp-teaser__content">
 *       <p class="cmp-teaser__pretitle">Featured Article</p>
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
  // Extract image
  // VALIDATED: Found .cmp-teaser__image img in captured DOM (#featured-teaser-home)
  const img = element.querySelector('.cmp-teaser__image img')
    || element.querySelector('img');

  // Extract pretitle
  // VALIDATED: Found .cmp-teaser__pretitle in captured DOM
  const pretitle = element.querySelector('.cmp-teaser__pretitle')
    || element.querySelector('p.pretitle');

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

  // Build text content cell with pretitle, heading, description, and CTA
  const textCell = document.createElement('div');
  if (pretitle) {
    const em = document.createElement('em');
    em.textContent = pretitle.textContent;
    textCell.append(em);
  }
  if (heading) textCell.append(heading.cloneNode(true));
  if (description) textCell.append(description.cloneNode(true));
  if (cta) {
    const strong = document.createElement('strong');
    strong.append(cta.cloneNode(true));
    textCell.append(strong);
  }

  // Row: [image, text content]
  const cells = [];
  if (img) {
    cells.push([img.cloneNode(true), textCell]);
  } else {
    cells.push([textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
