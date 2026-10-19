(() => {
  const form = document.getElementById('brief-form');
  const service = document.getElementById('service');
  const reference = document.getElementById('genuino-reference');
  const idea = document.getElementById('idea');
  if (!form || !service || !reference || !idea) return;
  const referencePosts = new Map([...document.querySelectorAll('[data-piece]')].map(link => [link.dataset.piece, link.dataset.post]));
  const prepare = () => {
    if (!reference.value) return;
    const selectedService = reference.selectedOptions[0]?.dataset.service;
    if (selectedService) service.value = selectedService;
    idea.value = `Gostei do trabalho: ${reference.value}.${referencePosts.get(reference.value) ? '\nPublicação: ' + referencePosts.get(reference.value) : ''}\nQuero uma avaliação para a minha casa.`;
  };
  reference.addEventListener('change', prepare);
  document.querySelectorAll('a[data-service]').forEach(link => link.addEventListener('click', () => {
    service.value = link.dataset.service;
    if (link.dataset.piece) {
      reference.value = link.dataset.piece;
      prepare();
    }
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const details = idea.value.trim();
    const post = referencePosts.get(reference.value);
    const sourceLine = post && !details.includes(post) ? '\nPublicação: ' + post : '';
    const message = `Olá, Genuíno! Quero conversar sobre ${service.value.toLocaleLowerCase('pt-BR')}.${reference.value ? '\nReferência: ' + reference.value + '.' : ''}${sourceLine}${details ? '\n\nMinha ideia: ' + details : ''}`;
    window.open(`https://wa.me/5562996290867?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
})();
