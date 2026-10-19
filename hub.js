(() => {
  'use strict';
  const cards = [...document.querySelectorAll('[data-proposal]')];
  const filters = [...document.querySelectorAll('[data-hub-filter]')];
  const search = document.getElementById('search');
  const count = document.getElementById('result-count');
  const empty = document.getElementById('empty-state');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let category = 'all';
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();

  const update = () => {
    const query = normalize(search.value);
    let visible = 0;
    cards.forEach(card => {
      const categories = card.dataset.categories.split(' ');
      const matches = (category === 'all' || categories.includes(category)) && normalize(card.dataset.search).includes(query);
      card.hidden = !matches;
      if (matches) { visible += 1; card.dataset.visible = 'true'; }
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.hubFilter === category)));
    count.textContent = `${visible} ${visible === 1 ? 'proposta' : 'propostas'}`;
    empty.hidden = visible !== 0;
  };
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.hubFilter; update(); }));
  search.addEventListener('input', update);
  document.getElementById('reset-filters').addEventListener('click', () => {
    category = 'all'; search.value = ''; update(); search.focus();
  });
  // Filters only change this page's view; research data and the local previews remain read-only.
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.dataset.visible = 'true'; observer.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -20px 0px', threshold: 0.04 });
    cards.forEach(card => {
      if (card.getBoundingClientRect().top < window.innerHeight) card.dataset.visible = 'true';
      else { card.dataset.observe = 'true'; observer.observe(card); }
    });
    const revealAll = () => {
      if (!motion.matches) return;
      observer.disconnect();
      cards.forEach(card => { card.dataset.visible = 'true'; });
    };
    if (motion.addEventListener) motion.addEventListener('change', revealAll);
    else motion.addListener(revealAll);
  }
})();
