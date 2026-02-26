export default function decorate(block) {
  // Metadata block is for page metadata only, hide the visual rendering
  const section = block.closest('.section');
  if (section) {
    section.style.display = 'none';
  }
}
