/* Atelier — progressive, dependency-free interactions. Copy with atelier.css. */
(() => {
  'use strict';

  if (document.documentElement.dataset.atelierInitialized) return;
  document.documentElement.dataset.atelierInitialized = 'true';

  const start = () => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const headers = [...document.querySelectorAll('[data-header], .atelier-header')];
    const parallax = [...document.querySelectorAll('[data-parallax]')];
    let frame = 0;

    const updateScroll = () => {
      frame = 0;
      const y = window.scrollY || 0;
      const distance = Math.max(0, root.scrollHeight - window.innerHeight);
      root.style.setProperty('--atelier-scroll', distance ? Math.min(1, y / distance).toFixed(4) : '0');
      headers.forEach(header => {
        header.classList.toggle('atelier-scrolled', y > 24);
        header.dataset.atelierScrolled = String(y > 24);
      });
      parallax.forEach(element => {
        if (reducedMotion.matches) {
          element.style.setProperty('--atelier-parallax-y', '0px');
          return;
        }
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        const parsed = Number.parseFloat(element.dataset.parallax);
        const strength = Number.isFinite(parsed) ? Math.max(-0.2, Math.min(0.2, parsed)) : 0.055;
        // Offset the prior translation so a stationary element never feeds back into its own position.
        const prior = Number.parseFloat(element.style.getPropertyValue('--atelier-parallax-y')) || 0;
        const center = rect.top - prior + rect.height / 2;
        const offset = Math.max(-70, Math.min(70, (window.innerHeight / 2 - center) * strength));
        element.style.setProperty('--atelier-parallax-y', `${offset.toFixed(2)}px`);
      });
    };
    const requestScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateScroll); };
    window.addEventListener('scroll', requestScroll, { passive: true });
    window.addEventListener('resize', requestScroll, { passive: true });
    window.addEventListener('load', requestScroll, { once: true });
    updateScroll();

    // Without JS, IntersectionObserver or motion permission, every section remains visible.
    const revealElements = [...document.querySelectorAll('[data-reveal]')];
    let revealObserver;
    if ('IntersectionObserver' in window && !reducedMotion.matches) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.atelierVisible = 'true';
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
      revealElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        // Do not hide the initial viewport or content reached before this script loaded.
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.dataset.atelierVisible = 'true';
        } else if (rect.bottom <= 0) {
          element.dataset.atelierVisible = 'true';
        } else {
          element.dataset.atelierReveal = 'ready';
          revealObserver.observe(element);
        }
      });
    }

    document.querySelectorAll('[data-magnetic]').forEach(element => {
      let bounds;
      const reset = () => {
        bounds = null;
        element.style.setProperty('--atelier-magnetic-x', '0px');
        element.style.setProperty('--atelier-magnetic-y', '0px');
      };
      element.addEventListener('pointerenter', event => {
        if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches) return;
        bounds = element.getBoundingClientRect();
      });
      element.addEventListener('pointermove', event => {
        if (!bounds || event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches) return;
        const x = Math.max(-8, Math.min(8, (event.clientX - bounds.left - bounds.width / 2) * 0.13));
        const y = Math.max(-8, Math.min(8, (event.clientY - bounds.top - bounds.height / 2) * 0.18));
        element.style.setProperty('--atelier-magnetic-x', `${x.toFixed(2)}px`);
        element.style.setProperty('--atelier-magnetic-y', `${y.toFixed(2)}px`);
      });
      element.addEventListener('pointerleave', reset);
      element.addEventListener('pointercancel', reset);
      element.addEventListener('focus', reset);
      window.addEventListener('scroll', reset, { passive: true });
    });

    // The site's own CSS decides when the toggle appears; there is no imposed breakpoint.
    const menus = [...document.querySelectorAll('[data-menu-toggle]')].map(toggle => {
      const id = toggle.getAttribute('aria-controls') || toggle.dataset.menuToggle;
      const menu = id ? document.getElementById(id.replace(/^#/, '')) : document.querySelector('[data-menu]');
      if (!menu) return null;
      if (!menu.id) menu.id = `atelier-menu-${Math.random().toString(36).slice(2, 9)}`;
      toggle.setAttribute('aria-controls', menu.id);
      toggle.setAttribute('aria-expanded', 'false');
      const item = { toggle, menu, open: false };
      const sync = () => {
        const style = window.getComputedStyle(toggle);
        const mobile = toggle.getClientRects().length > 0 && style.display !== 'none' && style.visibility !== 'hidden';
        menu.hidden = mobile && !item.open;
        menu.dataset.atelierOpen = String(item.open);
        toggle.setAttribute('aria-expanded', String(item.open));
        toggle.dataset.atelierOpen = String(item.open);
      };
      item.sync = sync;
      toggle.addEventListener('click', event => {
        event.preventDefault();
        const opening = !item.open;
        menus.forEach(other => { if (other !== item) { other.open = false; other.sync(); } });
        item.open = opening;
        sync();
        if (opening && event.detail === 0) menu.querySelector('a, button, [tabindex="0"]')?.focus();
      });
      menu.addEventListener('click', event => {
        if (event.target.closest('a[href]')) { item.open = false; sync(); }
      });
      sync();
      return item;
    }).filter(Boolean);
    const closeMenus = (returnFocus = false) => {
      menus.forEach(item => {
        if (!item.open) return;
        item.open = false;
        item.sync();
        if (returnFocus) item.toggle.focus();
      });
    };
    document.addEventListener('click', event => {
      if (!menus.some(item => item.menu.contains(event.target) || item.toggle.contains(event.target))) closeMenus();
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenus(true); });
    window.addEventListener('resize', () => menus.forEach(item => item.sync()), { passive: true });

    // A filter group can contain its own controls, tiles and optional live result count.
    const activeFilterAnimations = new Set();
    const filterScopes = new Set([...document.querySelectorAll('[data-filter]')].map(button => button.closest('[data-filter-group]') || document));
    filterScopes.forEach(scope => {
      const owns = node => (node.closest('[data-filter-group]') || document) === scope;
      const controls = [...scope.querySelectorAll('[data-filter]')].filter(owns);
      const items = [...scope.querySelectorAll('[data-category]')].filter(owns);
      const status = [...scope.querySelectorAll('[data-filter-status]')].find(owns);
      const filterAnimations = new WeakMap();
      let filteringStarted = false;
      const apply = selected => {
        const category = selected.dataset.filter || 'all';
        controls.forEach(control => {
          const active = control === selected;
          control.dataset.atelierActive = String(active);
          if (control.getAttribute('role') === 'tab') {
            control.setAttribute('aria-selected', String(active));
            control.tabIndex = active ? 0 : -1;
          } else control.setAttribute('aria-pressed', String(active));
        });
        let count = 0;
        items.forEach(item => {
          const categories = (item.dataset.category || '').split(/[\s,]+/);
          const visible = category === 'all' || category === '*' || categories.includes(category);
          filterAnimations.get(item)?.cancel();
          item.hidden = !visible;
          if (visible) {
            count += 1;
            item.dataset.atelierVisible = 'true';
            if (filteringStarted && !reducedMotion.matches && typeof item.animate === 'function') {
              const animation = item.animate(
                [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 360, delay: Math.min(count - 1, 5) * 35, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }
              );
              filterAnimations.set(item, animation);
              activeFilterAnimations.add(animation);
              const forget = () => activeFilterAnimations.delete(animation);
              animation.addEventListener('finish', forget, { once: true });
              animation.addEventListener('cancel', forget, { once: true });
            }
          }
        });
        if (status) {
          status.setAttribute('aria-live', 'polite');
          status.textContent = `${count} ${count === 1 ? 'item nesta seleção' : 'itens nesta seleção'}`;
        }
        filteringStarted = true;
        requestScroll();
      };
      controls.forEach(control => {
        control.addEventListener('click', event => { event.preventDefault(); apply(control); });
        if (control.getAttribute('role') !== 'tab') return;
        control.addEventListener('keydown', event => {
          const tabs = controls.filter(button => button.getAttribute('role') === 'tab');
          const index = tabs.indexOf(control);
          let next;
          if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
          if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
          if (event.key === 'Home') next = tabs[0];
          if (event.key === 'End') next = tabs[tabs.length - 1];
          if (next) { event.preventDefault(); apply(next); next.focus(); }
        });
      });
      const initial = controls.find(button => button.getAttribute('aria-pressed') === 'true' || button.getAttribute('aria-selected') === 'true')
        || controls.find(button => ['all', '*'].includes(button.dataset.filter));
      if (initial) apply(initial);
    });

    let dialog;
    let dialogImage;
    let dialogCaption;
    let dialogStatus;
    let dialogRetry;
    let returnFocus;
    let scrollLock;
    let gallery = [];
    let galleryIndex = 0;
    let galleryPrevious;
    let galleryNext;
    let galleryPosition;
    const changeGallery = direction => {
      if (gallery.length < 2) return;
      galleryIndex = (galleryIndex + direction + gallery.length) % gallery.length;
      showLightboxImage(gallery[galleryIndex]);
    };
    const restoreScroll = () => {
      if (!scrollLock) return;
      const saved = scrollLock;
      scrollLock = null;
      ['overflow', 'padding-right'].forEach(property => {
        if (saved[property].value) document.body.style.setProperty(property, saved[property].value, saved[property].priority);
        else document.body.style.removeProperty(property);
      });
    };
    const closeLightbox = () => { if (dialog?.open) dialog.close(); };
    const createLightbox = () => {
      dialog = document.createElement('dialog');
      dialog.className = 'atelier-lightbox';
      dialog.setAttribute('aria-label', 'Imagem ampliada');
      dialog.setAttribute('aria-describedby', 'atelier-lightbox-caption');
      dialog.tabIndex = -1;
      const icon = path => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.setAttribute('d', path);
        svg.append(line);
        return svg;
      };
      const toolbar = document.createElement('div');
      toolbar.className = 'atelier-lightbox-toolbar';
      const close = document.createElement('button');
      close.className = 'atelier-lightbox-close';
      close.type = 'button';
      close.setAttribute('aria-label', 'Fechar imagem ampliada');
      close.append(icon('M6 6 18 18M18 6 6 18'));
      close.addEventListener('click', closeLightbox);
      const navigation = document.createElement('div');
      navigation.className = 'atelier-lightbox-navigation';
      galleryPrevious = document.createElement('button');
      galleryPrevious.type = 'button';
      galleryPrevious.setAttribute('aria-label', 'Ver foto anterior');
      galleryPrevious.append(icon('M19 12H5m6-6-6 6 6 6'));
      galleryPrevious.addEventListener('click', () => changeGallery(-1));
      galleryPosition = document.createElement('p');
      galleryPosition.className = 'atelier-lightbox-position';
      galleryPosition.setAttribute('aria-live', 'polite');
      galleryNext = document.createElement('button');
      galleryNext.type = 'button';
      galleryNext.setAttribute('aria-label', 'Ver próxima foto');
      galleryNext.append(icon('M5 12h14m-6-6 6 6-6 6'));
      galleryNext.addEventListener('click', () => changeGallery(1));
      navigation.append(galleryPrevious, galleryPosition, galleryNext);
      const figure = document.createElement('figure');
      figure.className = 'atelier-lightbox-figure';
      dialogImage = document.createElement('img');
      dialogImage.className = 'atelier-lightbox-image';
      dialogImage.alt = '';
      dialogImage.decoding = 'async';
      dialogCaption = document.createElement('figcaption');
      dialogCaption.className = 'atelier-lightbox-caption';
      dialogCaption.id = 'atelier-lightbox-caption';
      dialogStatus = document.createElement('p');
      dialogStatus.className = 'atelier-lightbox-status';
      dialogStatus.setAttribute('role', 'status');
      dialogRetry = document.createElement('button');
      dialogRetry.type = 'button';
      dialogRetry.className = 'atelier-lightbox-retry';
      dialogRetry.textContent = 'Carregar imagem novamente';
      dialogRetry.hidden = true;
      dialogRetry.addEventListener('click', () => {
        close.focus({ preventScroll: true });
        dialogRetry.hidden = true;
        dialog.dataset.atelierLoading = 'true';
        dialogImage.setAttribute('aria-busy', 'true');
        dialogStatus.textContent = 'Carregando imagem…';
        dialogImage.src = dialogImage.src;
      });
      dialogImage.addEventListener('load', () => {
        dialog.dataset.atelierLoading = 'false';
        dialogStatus.textContent = '';
        dialogRetry.hidden = true;
        dialogImage.setAttribute('aria-busy', 'false');
      });
      dialogImage.addEventListener('error', () => {
        dialog.dataset.atelierLoading = 'false';
        dialogImage.setAttribute('aria-busy', 'false');
        dialogRetry.hidden = false;
        dialogStatus.textContent = 'A imagem não carregou. Confira sua conexão e tente novamente.';
      });
      figure.append(dialogImage, dialogCaption);
      toolbar.append(close, navigation);
      dialog.append(toolbar, figure, dialogStatus, dialogRetry);
      let swipeStart;
      dialogImage.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'touch' || !event.isPrimary) return;
        swipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
        // Keep the finger gesture on the image; vertical page scrolling can still cancel it.
        try { dialogImage.setPointerCapture(event.pointerId); } catch { /* Pointer already cancelled. */ }
      });
      dialogImage.addEventListener('pointerup', event => {
        if (!swipeStart || event.pointerId !== swipeStart.pointerId) return;
        const dx = event.clientX - swipeStart.x;
        const dy = event.clientY - swipeStart.y;
        swipeStart = null;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) changeGallery(dx < 0 ? 1 : -1);
      });
      const cancelSwipe = event => { if (swipeStart?.pointerId === event.pointerId) swipeStart = null; };
      dialogImage.addEventListener('pointercancel', cancelSwipe);
      dialogImage.addEventListener('lostpointercapture', cancelSwipe);
      document.body.append(dialog);
      dialog.addEventListener('cancel', event => { event.preventDefault(); closeLightbox(); });
      dialog.addEventListener('close', () => {
        swipeStart = null;
        restoreScroll();
        if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      });
      dialog.addEventListener('click', event => { if (event.target === dialog) closeLightbox(); });
      // Native modal dialogs contain focus; this also supports older dialog implementations.
      dialog.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          changeGallery(event.key === 'ArrowRight' ? 1 : -1);
          return;
        }
        if (event.key !== 'Tab') return;
        const focusable = [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
          .filter(node => !node.disabled && node.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first) { event.preventDefault(); dialog.focus(); }
        else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
    };
    const showLightboxImage = trigger => {
      const thumbnail = trigger.matches('img') ? trigger : trigger.querySelector('img');
      const source = trigger.dataset.full || thumbnail?.currentSrc || thumbnail?.src;
      const caption = trigger.dataset.caption || thumbnail?.alt || trigger.getAttribute('aria-label') || 'Detalhe do móvel';
      dialogImage.alt = trigger.dataset.alt || thumbnail?.alt || caption;
      dialogCaption.textContent = caption;
      dialogRetry.hidden = true;
      dialogImage.setAttribute('aria-busy', 'true');
      dialogStatus.textContent = 'Carregando imagem…';
      dialog.dataset.atelierLoading = 'true';
      // Some original posts have letterbox bars. Keep only their measured photo area.
      const crop = (trigger.dataset.imageWindow || '').trim().split(/\s+/).map(Number);
      if (crop.length === 4 && crop.every(Number.isFinite) && crop[0] > 0 && crop[1] > crop[3] && crop[2] >= 0 && crop[3] > 0 && crop[2] + crop[3] <= crop[1]) {
        dialogImage.dataset.atelierImageWindow = 'true';
        dialogImage.style.setProperty('--atelier-window-ratio', String(crop[0] / crop[3]));
        dialogImage.style.setProperty('--atelier-window-position', `50% ${crop[2] / (crop[1] - crop[3]) * 100}%`);
      } else {
        delete dialogImage.dataset.atelierImageWindow;
        dialogImage.style.removeProperty('--atelier-window-ratio');
        dialogImage.style.removeProperty('--atelier-window-position');
      }
      dialogImage.src = source;
      galleryPrevious.hidden = gallery.length < 2;
      galleryNext.hidden = gallery.length < 2;
      galleryPosition.textContent = gallery.length > 1 ? `${galleryIndex + 1} de ${gallery.length}` : 'Detalhe da foto';
    };
    const openLightbox = trigger => {
      const thumbnail = trigger.matches('img') ? trigger : trigger.querySelector('img');
      const source = trigger.dataset.full || thumbnail?.currentSrc || thumbnail?.src;
      if (!source) return;
      if (!dialog) createLightbox();
      // Leave the normal link usable on browsers without native dialog support.
      if (typeof dialog.showModal !== 'function') { window.open(source, '_blank', 'noopener'); return; }
      returnFocus = trigger;
      const scope = trigger.closest('[data-filter-group], [data-gallery]') || trigger.closest('section') || document;
      const sources = new Set();
      gallery = [...scope.querySelectorAll('[data-lightbox]')].filter(item => {
        const image = item.matches('img') ? item : item.querySelector('img');
        const url = item.dataset.full || image?.currentSrc || image?.src;
        if (!url || sources.has(url) || item.closest('[hidden]') || !item.getClientRects().length) return false;
        sources.add(url);
        return true;
      });
      if (!gallery.includes(trigger)) gallery.unshift(trigger);
      galleryIndex = gallery.indexOf(trigger);
      showLightboxImage(trigger);
      if (!dialog.open) {
        scrollLock = {};
        ['overflow', 'padding-right'].forEach(property => {
          scrollLock[property] = { value: document.body.style.getPropertyValue(property), priority: document.body.style.getPropertyPriority(property) };
        });
        const gap = window.innerWidth - root.clientWidth;
        const padding = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
        document.body.style.setProperty('overflow', 'hidden');
        if (gap > 0) document.body.style.setProperty('padding-right', `${padding + gap}px`);
        try { dialog.showModal(); } catch (error) { restoreScroll(); throw error; }
      }
    };
    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      if (!trigger.matches('button, a[href], input, [tabindex]')) {
        trigger.tabIndex = 0;
        trigger.setAttribute('role', 'button');
        const image = trigger.matches('img') ? trigger : trigger.querySelector('img');
        trigger.setAttribute('aria-label', `Ampliar: ${trigger.dataset.caption || image?.alt || 'imagem do móvel'}`);
      }
      trigger.addEventListener('click', event => { event.preventDefault(); openLightbox(trigger); });
      if (!trigger.matches('button, a[href], input')) {
        trigger.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(trigger); }
        });
      }
    });

    const motionPreferenceChanged = () => {
      if (reducedMotion.matches) {
        activeFilterAnimations.forEach(animation => animation.cancel());
        activeFilterAnimations.clear();
        revealObserver?.disconnect();
        revealElements.forEach(element => { element.dataset.atelierVisible = 'true'; });
        document.querySelectorAll('[data-magnetic]').forEach(element => {
          element.style.setProperty('--atelier-magnetic-x', '0px');
          element.style.setProperty('--atelier-magnetic-y', '0px');
        });
      }
      requestScroll();
    };
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', motionPreferenceChanged);
    else reducedMotion.addListener(motionPreferenceChanged);
    root.dataset.atelierReady = 'true';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
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
