/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://www.rwjbh.org/
 * Base Block: columns
 *
 * Block Structure (from Block Collection example):
 * - Row N: One cell per column [content1, content2, ...]
 *
 * Handles 4 different column layouts on the homepage:
 * 1. ContentAreaHome (line 493): 2/3 article + 1/3 sidebar
 * 2. AnnouncementSection (line 578): 1/3 text + 2/3 image content
 * 3. FindADoctorHome2023 (line 819): 3-column with images and CTA
 * 4. NewsEventContainer2023 (line 1040): News (1/3) + Events (2/3)
 *
 * Generated: 2026-02-13
 */
export default function parse(element, { document }) {
  const cells = [];

  // Strategy: Detect column children based on common layout patterns
  // Look for direct children that represent visual columns

  // Pattern 1: article + aside (ContentAreaHome)
  const article = element.querySelector('article');
  const aside = element.querySelector('aside');
  if (article && aside) {
    cells.push([article.cloneNode(true), aside.cloneNode(true)]);
    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 2: Direct div children with column classes (third, two-thirds, etc.)
  const columnChildren = element.querySelectorAll(':scope > div, :scope > .third, :scope > .two-thirds');
  if (columnChildren.length >= 2) {
    const row = [];
    columnChildren.forEach((col) => {
      row.push(col.cloneNode(true));
    });
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 3: News/Events container with named boxes
  const newsBox = element.querySelector('.news-box');
  const eventsBox = element.querySelector('.events-box');
  if (newsBox && eventsBox) {
    cells.push([newsBox.cloneNode(true), eventsBox.cloneNode(true)]);
    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 4: Find a Doctor - image containers + search
  const leftImg = element.querySelector('.image-container-left, .find-left');
  const searchBox = element.querySelector('.doctor-search-container, .physician-search');
  const rightImg = element.querySelector('.image-container-right, .find-right');
  if (searchBox) {
    const row = [];
    if (leftImg) row.push(leftImg.cloneNode(true));
    row.push(searchBox.cloneNode(true));
    if (rightImg) row.push(rightImg.cloneNode(true));
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
    element.replaceWith(block);
    return;
  }

  // Fallback: Treat all direct children as columns
  const children = element.children;
  if (children.length >= 2) {
    const row = [];
    for (let i = 0; i < children.length; i++) {
      row.push(children[i].cloneNode(true));
    }
    cells.push(row);
  } else if (children.length === 1) {
    cells.push([element.cloneNode(true)]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
