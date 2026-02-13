/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://www.rwjbh.org/
 * Base Block: hero
 *
 * Block Structure (from Block Collection example):
 * - Row 1: Background image
 * - Row 2: Heading + optional subheading + optional CTA
 *
 * Source HTML Pattern (from captured DOM at line 462):
 * <section class="banner-area" id="BannerAreaHome2023">
 *   <div class="banner-image"><picture><img src="..."></picture></div>
 *   <div class="banner-text"><h1>...</h1></div>
 * </section>
 *
 * Generated: 2026-02-13
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract hero background image
  // VALIDATED: Found <picture> with <img src="./images/...mainstage2.jpg"> at line 466
  const img = element.querySelector('.banner-image img, .banner-bg img, picture img, img');
  if (img) {
    cells.push([img.cloneNode(true)]);
  }

  // Extract heading content
  // VALIDATED: Found <div class="bnnr-txt"> with <strong class="txt_kck"> and <strong class="txt_big"> at lines 469-472
  const contentCell = document.createElement('div');

  // Try structured heading first (h1/h2), then fallback to banner text divs
  const heading = element.querySelector('h1, h2');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.appendChild(h1);
  } else {
    // Fallback: Extract from banner text container with <strong> elements
    const bannerText = element.querySelector('.bnnr-txt');
    if (bannerText) {
      const textParts = bannerText.querySelectorAll('strong, span, p');
      const combinedText = [];
      textParts.forEach((part) => {
        const text = part.textContent.trim();
        if (text) combinedText.push(text);
      });
      if (combinedText.length > 0) {
        const h1 = document.createElement('h1');
        h1.textContent = combinedText.join(' ');
        contentCell.appendChild(h1);
      }
    } else {
      // Last resort: any text content in overlay divs
      const overlayText = element.querySelector('[class*="txt"], [class*="text"], [class*="overlay"]');
      if (overlayText && overlayText.textContent.trim()) {
        const h1 = document.createElement('h1');
        h1.textContent = overlayText.textContent.trim();
        contentCell.appendChild(h1);
      }
    }
  }

  // Extract optional CTA
  const cta = element.querySelector('.banner-text a.btn, .banner-cta a, .bnnr-txt a');
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href || cta.getAttribute('href');
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    contentCell.appendChild(p);
  }

  if (contentCell.childNodes.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}
