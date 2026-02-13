export default function decorate(block) {
  const slides = [...block.children];
  if (slides.length < 2) return;

  // Build slide track
  const track = document.createElement('div');
  track.classList.add('carousel-track');

  slides.forEach((slide) => {
    slide.classList.add('carousel-slide');
    track.appendChild(slide);
  });

  block.textContent = '';
  block.appendChild(track);

  // Navigation arrows
  const nav = document.createElement('div');
  nav.classList.add('carousel-nav');
  nav.innerHTML = `
    <button class="carousel-prev" aria-label="Previous slide">&#8249;</button>
    <button class="carousel-next" aria-label="Next slide">&#8250;</button>
  `;
  block.appendChild(nav);

  // Scroll behavior
  const prev = nav.querySelector('.carousel-prev');
  const next = nav.querySelector('.carousel-next');

  const scrollAmount = () => {
    const slide = track.querySelector('.carousel-slide');
    return slide ? slide.offsetWidth : 200;
  };

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });
}
