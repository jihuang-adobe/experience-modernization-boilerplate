/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for RWJBarnabas Health website cleanup
 * Purpose: Remove non-content elements (header, footer, nav, forms, widgets)
 * Applies to: www.rwjbh.org (all templates)
 * Generated: 2026-02-13
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (migration-work/cleaned.html)
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove header/navigation zone
    // EXTRACTED: Found <header class="icobalt ilayout" id="HeaderZone"> at line 8
    WebImporter.DOMUtils.remove(element, [
      '#HeaderZone',
      '#HeaderContainer',
    ]);

    // Remove footer zone
    // EXTRACTED: Found <footer class="icobalt ilayout" id="FooterZone"> at line 1127
    WebImporter.DOMUtils.remove(element, [
      '#FooterZone',
    ]);

    // Remove AudioEye accessibility widget
    // EXTRACTED: Found <div id="ae_enabled_site"> and <div id="ae_app"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#ae_enabled_site',
      '#ae_app',
      '.audioeye-skip-link',
      '.ae-offscreen',
      '[class*="ae-compliance"]',
    ]);

    // Remove urgent message/alert banners
    // EXTRACTED: Found <div id="SystemWideUrgentMessage"> and <div id="UrgentMessage">
    WebImporter.DOMUtils.remove(element, [
      '#SystemWideUrgentMessage',
      '#UrgentMessage',
      '.urgent-message-container',
    ]);

    // Unwrap form elements that interfere with block parsing
    // EXTRACTED: Found <form id="Form_FindADoctorHome2023"> wrapping doctor search
    const forms = element.querySelectorAll('form');
    forms.forEach((form) => {
      while (form.firstChild) {
        form.parentNode.insertBefore(form.firstChild, form);
      }
      form.remove();
    });

    // Remove scrolling navigation buttons from carousel
    // EXTRACTED: Found <div class="scrolling-buttons award-scroll-footer">
    WebImporter.DOMUtils.remove(element, [
      '.scrolling-buttons',
      '.scrolling-list-nav',
    ]);

    // Remove drawn arrow decorations
    // EXTRACTED: Found <div class="drawn-arrow-container">
    WebImporter.DOMUtils.remove(element, [
      '.drawn-arrow-container',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'source',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove empty optional content placeholders
    // EXTRACTED: Found <div class="optional" id="TopOptionalContentAnnouncement"> (empty)
    WebImporter.DOMUtils.remove(element, [
      '#TopOptionalContentAnnouncement',
    ]);
  }
}
