/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://www.rwjbh.org/
 * Base Block: cards
 *
 * Block Structure (from Block Collection example):
 * - Row N: [image, content (title + description + link)]
 *
 * Source HTML Pattern (from captured DOM at line 931):
 * <section class="specialty-services-container fll-mbl" id="TwoRowSpecialtyServices2023">
 *   <div class="service-header">...</div>
 *   <ul class="specialties-box new ui-repeater" id="TwoRowSpecialtiesV2">
 *     <li class="specialty item-N third relative v1">
 *       <a href="...">
 *         <div class="specialty-info">
 *           <h4>Title</h4>
 *           <p>Description</p>
 *         </div>
 *         <div class="specialty-image-area relative">
 *           <picture><img src="..."></picture>
 *         </div>
 *       </a>
 *     </li>
 *   </ul>
 * </section>
 *
 * Generated: 2026-02-13
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract each specialty service card
  // VALIDATED: Found <ul class="specialties-box"> with <li class="specialty"> children at lines 941-1038
  const cardItems = element.querySelectorAll('.specialties-box > li.specialty') ||
                    element.querySelectorAll('ul > li');

  if (cardItems.length > 0) {
    cardItems.forEach((item) => {
      // Extract card link
      // VALIDATED: Found <a href="/treatment-care/..."> wrapping card content
      const link = item.querySelector('a');

      // Extract image from specialty-image-area
      // VALIDATED: Found <div class="specialty-image-area"><picture><img></picture></div>
      const img = item.querySelector('.specialty-image-area img') ||
                  item.querySelector('picture img') ||
                  item.querySelector('img:not([src^="data:"])');

      // Extract title from specialty-info (use first h4 to avoid duplicate from image area)
      // VALIDATED: Found <div class="specialty-info"><h4>Cancer Services</h4>
      const title = item.querySelector('.specialty-info h4') ||
                    item.querySelector('.specialty-info h3') ||
                    item.querySelector('h4');

      // Extract description
      // VALIDATED: Found <p>description text</p> inside .specialty-info
      const desc = item.querySelector('.specialty-info p') ||
                   item.querySelector('p');

      // Build image cell
      const imageCell = document.createElement('div');
      if (img) {
        imageCell.appendChild(img.cloneNode(true));
      }

      // Build content cell
      const contentCell = document.createElement('div');
      if (title) {
        const h = document.createElement('h3');
        h.textContent = title.textContent.trim();
        if (link && link.href) {
          const a = document.createElement('a');
          a.href = link.href || link.getAttribute('href');
          a.textContent = title.textContent.trim();
          h.textContent = '';
          h.appendChild(a);
        }
        contentCell.appendChild(h);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        contentCell.appendChild(p);
      }

      cells.push([imageCell, contentCell]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
