/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-locations block (maps to Hero block)
 *
 * Source: https://www.rwjbh.org/
 * Base Block: hero
 *
 * Block Structure (from Block Collection example):
 * - Row 1: Background image
 * - Row 2: Heading + description + CTA
 *
 * Source HTML Pattern (from captured DOM at line 805):
 * <section class="lct-cta fll-mbl" id="LocationCta">
 *   <div class="lct-background"><picture><img src="locations.jpg"></picture></div>
 *   <div class="lct-text">
 *     <h2>Convenient Locations in Your Community</h2>
 *     <p>Access quality health care services...</p>
 *     <a href="/our-locations/" class="btn">Find a Location</a>
 *   </div>
 * </section>
 *
 * Generated: 2026-02-13
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract background image
  // VALIDATED: Found <picture><img src="./images/...locations.jpg"> at line 808
  const img = element.querySelector('picture img, img');
  if (img) {
    cells.push([img.cloneNode(true)]);
  }

  // Extract text content (heading, description, CTA)
  const contentCell = document.createElement('div');

  // VALIDATED: Found <h4>Convenient Locations in Your Community</h4> inside <div class="cta"> at line 811
  const heading = element.querySelector('.cta h4, .cta h3, .cta h2, h4, h3, h2, h1');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.appendChild(h2);
  }

  // VALIDATED: Found <p>Access quality health care services...</p> at line 812
  const desc = element.querySelector('.cta p, p');
  if (desc && desc.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    contentCell.appendChild(p);
  }

  // VALIDATED: Found <a class="btn v5" href="/our-locations/">Find a Location</a> at line 813
  const cta = element.querySelector('.cta a.btn, a.btn, a[href*="locations"]');
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
