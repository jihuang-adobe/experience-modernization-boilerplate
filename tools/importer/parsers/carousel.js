/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block
 *
 * Source: https://www.rwjbh.org/
 * Base Block: carousel
 *
 * Block Structure (from Block Collection example):
 * - Row N: [image, optional text content]
 *
 * Source HTML Pattern (from captured DOM at line 596):
 * <section class="award-container v2" id="AwardContainer2023">
 *   <div class="award-box flex visible">
 *     <div class="award-header relative third visible" id="AwardBoxHeader">
 *       <h4>Quality That Sets Us Apart</h4>
 *       <a href="...">Learn More</a>
 *     </div>
 *     <div class="award-box-holder two-thirds ui-repeater">
 *       <ul class="award-list flex-row items-20">
 *         <li class="item-N flex-middle-center fourth">
 *           <a href="..."><figure><picture><img ...></picture></figure></a>
 *         </li>
 *       </ul>
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2026-02-13
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract each award item as a carousel slide
  // VALIDATED: Found <ul class="award-list flex-row items-20"> with <li> children at line 612
  const awardItems = element.querySelectorAll('.award-list > li');

  if (awardItems.length > 0) {
    awardItems.forEach((item) => {
      const link = item.querySelector('a');
      const img = item.querySelector('img');

      if (img) {
        // Resolve lazy-loaded images: prefer data-src over src for lazy-loaded placeholders
        const realSrc = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.src;
        const isPlaceholder = !realSrc || realSrc.startsWith('data:image/gif') || realSrc.startsWith('data:image/svg');

        if (!isPlaceholder) {
          const imgClone = img.cloneNode(true);
          imgClone.src = realSrc;

          if (link && link.href) {
            const wrapper = document.createElement('div');
            const linkEl = document.createElement('a');
            linkEl.href = link.href;
            linkEl.appendChild(imgClone);
            wrapper.appendChild(linkEl);
            cells.push([wrapper]);
          } else {
            cells.push([imgClone]);
          }
        }
      }
    });
  }

  // Fallback: if no items found via award-list, try generic image list
  if (cells.length === 0) {
    const images = element.querySelectorAll('img');
    images.forEach((img) => {
      const realSrc = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.src;
      const isPlaceholder = !realSrc || realSrc.startsWith('data:image/gif') || realSrc.startsWith('data:image/svg');
      if (!isPlaceholder) {
        const imgClone = img.cloneNode(true);
        imgClone.src = realSrc;
        cells.push([imgClone]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel', cells });
  element.replaceWith(block);
}
