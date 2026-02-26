function restructureSlideContent(slide, document) {
  const textDiv = slide.querySelector('div:last-child');
  if (!textDiv) return;

  const p = textDiv.querySelector('p');
  if (!p) return;

  // Extract strong (title), text nodes (description), and link (CTA)
  const strong = p.querySelector(':scope > strong:first-child');
  const link = p.querySelector(':scope > a');

  // Build description from remaining text nodes
  const descParts = [];
  p.childNodes.forEach((node) => {
    if (node === strong || node === link) return;
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      descParts.push(node.textContent.trim());
    }
  });

  // Rebuild text div with separated elements
  textDiv.innerHTML = '';

  if (strong) {
    const heading = document.createElement('h2');
    heading.textContent = strong.textContent;
    textDiv.appendChild(heading);
  }

  if (descParts.length) {
    const desc = document.createElement('p');
    desc.textContent = descParts.join(' ');
    textDiv.appendChild(desc);
  }

  if (link) {
    const ctaP = document.createElement('p');
    ctaP.className = 'carousel-cta';
    const ctaLink = link.cloneNode(true);
    ctaP.appendChild(ctaLink);
    textDiv.appendChild(ctaP);
  }
}

export default function decorate(block) {
  const slides = [...block.children];
  if (slides.length < 2) return;

  // Build slide track
  const track = document.createElement('div');
  track.classList.add('carousel-track');

  slides.forEach((slide) => {
    slide.classList.add('carousel-slide');
    restructureSlideContent(slide, document);
    // Ensure all carousel images load eagerly (not lazy)
    slide.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
    track.appendChild(slide);
  });

  block.textContent = '';
  block.appendChild(track);

  // Dot indicators
  const dots = document.createElement('div');
  dots.classList.add('carousel-dots');
  block.appendChild(dots);

  // Navigation arrows
  const nav = document.createElement('div');
  nav.classList.add('carousel-nav');
  nav.innerHTML = `
    <button class="carousel-prev" aria-label="Previous slide">&#8249;</button>
    <button class="carousel-next" aria-label="Next slide">&#8250;</button>
  `;
  block.appendChild(nav);

  let currentSlide = 0;

  function updateDots() {
    dots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function showSlide(index) {
    const total = slides.length;
    currentSlide = ((index % total) + total) % total;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    track.style.transition = 'transform 0.5s ease';
    updateDots();
  }

  // Create dot buttons (after showSlide is defined)
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => showSlide(i));
    dots.appendChild(dot);
  });

  const prev = nav.querySelector('.carousel-prev');
  const next = nav.querySelector('.carousel-next');

  prev.addEventListener('click', () => showSlide(currentSlide - 1));
  next.addEventListener('click', () => showSlide(currentSlide + 1));
}
