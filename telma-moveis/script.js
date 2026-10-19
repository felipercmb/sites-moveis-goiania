/* Site-specific navigation from the room shortcuts into the collection. */
document.querySelectorAll('[data-choose-filter]').forEach(link => {
  link.addEventListener('click', () => {
    const category = link.dataset.chooseFilter;
    const control = [...document.querySelectorAll('[data-filter]')].find(button => button.dataset.filter === category);
    control?.click();
  });
});

/* Prepare a contextual request; the visitor reviews and sends it in WhatsApp. */
document.getElementById('room-request').addEventListener('submit', event => {
  event.preventDefault();
  const room = document.getElementById('room').value;
  const piece = document.getElementById('piece-interest').value.trim();
  const reference = [...document.querySelectorAll('.product')].find(card => card.querySelector('h3')?.textContent === piece)?.querySelector('.piece-source')?.href;
  const measures = document.getElementById('measure').value.trim();
  const idea = document.getElementById('idea').value.trim();
  const message = [
    'Olá, Telma! Quero conhecer opções para: ' + room + '.',
    piece ? 'Peça de interesse: ' + piece + '.' : '',
    reference ? 'Publicação de referência: ' + reference : '',
    measures ? 'Medidas aproximadas: ' + measures + '.' : '',
    idea ? 'O que procuro: ' + idea : '',
    'Podem me ajudar com modelos, medidas e valores?'
  ].filter(Boolean).join('\n\n');
  window.open('https://wa.me/556232104961?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
});
