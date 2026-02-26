/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block
 *
 * Source: https://wknd.site/us/en.html
 * Base Block: carousel
 *
 * Block Structure:
 * - Each row: [image, text content (heading + description + CTA)]
 *
 * Source HTML Pattern:
 * <div class="cmp-carousel--hero">
 *   <div class="cmp-carousel">
 *     <div class="cmp-carousel__content">
 *       <div class="cmp-carousel__item">
 *         <div class="cmp-teaser--hero">
 *           <div class="cmp-teaser">
 *             <div class="cmp-teaser__content">
 *               <h2 class="cmp-teaser__title">...</h2>
 *               <div class="cmp-teaser__description">...</div>
 *               <a class="cmp-teaser__action-link">...</a>
 *             </div>
 *             <div class="cmp-teaser__image"><img .../></div>
 *           </div>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-25
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each carousel slide is a .cmp-carousel__item containing a teaser
  // VALIDATED: Found .cmp-carousel__item elements in captured DOM
  const slides = element.querySelectorAll('.cmp-carousel__item');

  slides.forEach((slide) => {
    // Extract image from teaser
    // VALIDATED: Found .cmp-teaser__image img in captured DOM
    const img = slide.querySelector('.cmp-teaser__image img')
      || slide.querySelector('img');

    // Extract heading
    // VALIDATED: Found .cmp-teaser__title (h2) in captured DOM
    const heading = slide.querySelector('.cmp-teaser__title')
      || slide.querySelector('h2, h1, h3');

    // Extract description
    // VALIDATED: Found .cmp-teaser__description in captured DOM
    const description = slide.querySelector('.cmp-teaser__description')
      || slide.querySelector('p');

    // Extract CTA link
    // VALIDATED: Found .cmp-teaser__action-link in captured DOM
    const cta = slide.querySelector('.cmp-teaser__action-link')
      || slide.querySelector('a[href]');

    // Build text content cell
    const textCell = document.createElement('div');
    if (heading) textCell.append(heading.cloneNode(true));
    if (description) textCell.append(description.cloneNode(true));
    if (cta) textCell.append(cta.cloneNode(true));

    // Row: [image, text content]
    if (img) {
      cells.push([img.cloneNode(true), textCell]);
    } else {
      cells.push([textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel', cells });
  element.replaceWith(block);
}
