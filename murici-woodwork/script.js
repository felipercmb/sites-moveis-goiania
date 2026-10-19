/* Gallery and motion stay in atelier.js; this brief only prepares a user-reviewed message. */
(() => {
  const form = document.getElementById('project-form');
  const choice = document.getElementById('murici-piece');
  const idea = document.getElementById('murici-idea');
  if (!form || !choice || !idea) return;
  const referencePosts = new Map([...document.querySelectorAll('[data-piece]')].map(link => [link.dataset.piece, link.dataset.post]));
  const prepare = () => {
    if (choice.value) idea.value = `Gostei da referência: ${choice.value}.${referencePosts.get(choice.value) ? '\nPublicação: ' + referencePosts.get(choice.value) : ''}\nQuero conversar sobre uma peça para o meu espaço.`;
  };
  choice.addEventListener('change', prepare);
  document.querySelectorAll('[data-piece]').forEach(link => {
    link.addEventListener('click', () => {
      choice.value = link.dataset.piece;
      prepare();
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const subject = choice.value ? `a referência ${choice.value}` : 'uma peça em madeira para o meu espaço';
    const details = idea.value.trim();
    const post = referencePosts.get(choice.value);
    const sourceLine = post && !details.includes(post) ? '\nPublicação: ' + post : '';
    const message = `Olá, Murici! Quero conversar sobre ${subject}.${sourceLine}${details ? '\n\n' + details : ''}`;
    window.open(`https://wa.me/5562999567830?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
})();
