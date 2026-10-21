(() => {
  'use strict';
  const cards = [...document.querySelectorAll('[data-proposal]')];
  const filters = [...document.querySelectorAll('[data-hub-filter]')];
  const search = document.getElementById('search');
  const count = document.getElementById('result-count');
  const empty = document.getElementById('empty-state');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const requestedBatch = new URLSearchParams(window.location.search).get('lote');
  let category = requestedBatch === 'estofados' ? 'lote3' : 'all';
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
  // The public batch link initializes the same filter as the visible control.
  if (category !== 'all') update();
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

/* Round the painted photograph itself, including object-fit:contain letterboxing. */
(() => {
  'use strict';
  const start = () => {
    const observed = new WeakSet();
    const images = new Set();
    const windows = '.source-photo-window,.source-crop-window,.photo-letterbox-window';
    const number = value => Number.parseFloat(value) || 0;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const position = (token, space, axis) => {
      if (!token || token === 'center') return space / 2;
      if (token === 'left' || token === 'top') return 0;
      if (token === 'right' || token === 'bottom') return space;
      if (token.endsWith('%')) return space * clamp(number(token) / 100, 0, 1);
      if (token.endsWith('px')) return clamp(number(token), 0, space);
      return space / 2;
    };
    const roundPhoto = image => {
      const sourceWindow = image.closest(windows);
      if (sourceWindow) {
        sourceWindow.dataset.atelierPhotoWindow = 'true';
        delete image.dataset.atelierPhotoRounded;
        image.style.removeProperty('--atelier-photo-clip');
        return;
      }
      if (!image.naturalWidth || !image.naturalHeight || !image.clientWidth || !image.clientHeight) return;
      const style = getComputedStyle(image);
      const pl = number(style.paddingLeft), pr = number(style.paddingRight);
      const pt = number(style.paddingTop), pb = number(style.paddingBottom);
      const bl = number(style.borderLeftWidth), bt = number(style.borderTopWidth);
      const width = Math.max(0, image.clientWidth - pl - pr);
      const height = Math.max(0, image.clientHeight - pt - pb);
      if (!width || !height) return;
      let paintedWidth = width, paintedHeight = height;
      if (style.objectFit === 'contain' || style.objectFit === 'scale-down' || style.objectFit === 'none') {
        let scale = style.objectFit === 'none' ? 1 : Math.min(width / image.naturalWidth, height / image.naturalHeight);
        if (style.objectFit === 'scale-down') scale = Math.min(1, scale);
        paintedWidth = Math.min(width, image.naturalWidth * scale);
        paintedHeight = Math.min(height, image.naturalHeight * scale);
      }
      let tokens = style.objectPosition.trim().split(/\s+/);
      if (tokens.length === 1) tokens = /top|bottom/.test(tokens[0]) ? ['center', tokens[0]] : [tokens[0], 'center'];
      const x = bl + pl + position(tokens[0], width - paintedWidth, 'x');
      const y = bt + pt + position(tokens[1], height - paintedHeight, 'y');
      const right = Math.max(0, image.offsetWidth - x - paintedWidth);
      const bottom = Math.max(0, image.offsetHeight - y - paintedHeight);
      // Echo the nearest curved frame while leaving the furniture's visible edges intact.
      const cap = Math.min(32, Math.min(paintedWidth, paintedHeight) * .12);
      const floor = Math.min(12, cap);
      let owner = image.parentElement, frame;
      for (let depth = 0; owner && depth < 4; depth++, owner = owner.parentElement) {
        const candidate = getComputedStyle(owner);
        if (['borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius'].some(k => number(candidate[k]) > 4)) { frame = candidate; break; }
      }
      const radii = ['borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius'].map(key => {
        const value = frame?.[key] || '24px';
        const radius = value.includes('%') ? paintedWidth * number(value) / 100 : number(value);
        return clamp(radius || 24, floor, cap).toFixed(2) + 'px';
      });
      image.style.setProperty('--atelier-photo-clip', `inset(${Math.max(0,y).toFixed(2)}px ${right.toFixed(2)}px ${bottom.toFixed(2)}px ${Math.max(0,x).toFixed(2)}px round ${radii.join(' ')})`);
      image.dataset.atelierPhotoRounded = 'true';
    };
    const observer = 'ResizeObserver' in window ? new ResizeObserver(entries => entries.forEach(entry => roundPhoto(entry.target))) : null;
    const watch = image => {
      if (observed.has(image)) { roundPhoto(image); return; }
      observed.add(image); images.add(image); observer?.observe(image); roundPhoto(image);
    };
    document.querySelectorAll('main img').forEach(watch);
    // Capturing load also covers images created later by the photo gallery, on every change.
    document.addEventListener('load', event => {
      const image = event.target;
      if (image instanceof HTMLImageElement && image.matches('main img,.atelier-lightbox-image')) watch(image);
    }, true);
    let frame = 0;
    window.addEventListener('resize', () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; images.forEach(roundPhoto); });
    }, { passive: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
