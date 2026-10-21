(() => {
  'use strict';
  const form = document.querySelector('[data-inquiry],#consultation-form');
  const choice = form?.querySelector('[name="reference"],#reference-choice');
  if (!form || !choice) return;
  const controls = [...document.querySelectorAll('[data-piece][data-post],[data-reference][data-post]')];
  const normalizeSource = value => {
    try { const url = new URL(value, document.baseURI); return url.origin + url.pathname; }
    catch { return ''; }
  };
  const references = controls.map(link => {
    const card = link.closest('[data-category]') || link.closest('article');
    const image = card?.querySelector('[data-lightbox]');
    return {
      name: link.dataset.piece || link.dataset.reference,
      post: link.dataset.post, link, card,
      image: normalizeSource(image?.dataset.full || image?.querySelector('img')?.src || '')
    };
  });
  const icon = path => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', path); svg.append(line); return svg;
  };
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.classList.add('showroom-photo-link');
    let affordance = link.querySelector('.expand,.open-photo,.piece-expand');
    if (!affordance) {
      affordance = document.createElement('span');
      affordance.className = 'showroom-expand'; link.append(affordance);
    }
    affordance.setAttribute('aria-hidden', 'true');
    affordance.replaceChildren(icon('M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5'));
  });

  // Optional dimensions stay in the same form, with their existing event handlers.
  const optional = [];
  const fieldset = form.querySelector('fieldset');
  if (fieldset?.querySelector('[name="width"]')) {
    optional.push(fieldset);
    const idea = form.querySelector('[name="idea"]')?.closest('.field');
    if (idea) optional.push(idea);
  } else {
    ['#room-name', '#room-width', '#room-depth', '#request-note'].forEach(selector => {
      const field = form.querySelector(selector)?.closest('.field');
      if (!field) return;
      const owner = field.parentElement?.classList.contains('field-row') ? field.parentElement : field;
      if (!optional.includes(owner)) optional.push(owner);
    });
  }
  if (optional.length && !form.querySelector('.showroom-measures')) {
    const details = document.createElement('details');
    details.className = 'showroom-measures';
    const summary = document.createElement('summary');
    summary.textContent = 'Adicionar medidas e detalhes';
    summary.append(icon('M12 5v14M5 12h14'));
    const note = document.createElement('p');
    note.textContent = 'Opcional. Você também pode começar escolhendo uma peça e combinar os detalhes na conversa.';
    const body = document.createElement('div'); body.className = 'showroom-measures-body';
    optional[0].before(details);
    details.append(summary, body); body.append(note, ...optional);
  }

  const dock = document.createElement('aside');
  dock.className = 'showroom-dock'; dock.hidden = true;
  dock.setAttribute('aria-label', 'Atalhos para sua consulta');
  const dockCopy = document.createElement('div');
  const dockLabel = document.createElement('span'); dockLabel.className = 'showroom-dock-label';
  dockLabel.textContent = 'Sua próxima peça';
  const dockName = document.createElement('span'); dockName.className = 'showroom-dock-name';
  dockName.textContent = 'Escolha com calma'; dockCopy.append(dockLabel, dockName);
  const dockAction = document.createElement('a'); dockAction.href = '#consulta';
  dockAction.className = 'showroom-dock-action'; dockAction.textContent = 'Pedir orçamento';
  dockAction.append(icon('M5 12h14m-6-6 6 6-6 6'));
  dock.append(dockCopy, dockAction); document.body.append(dock);
  const status = document.createElement('p');
  status.className = 'showroom-sr'; status.setAttribute('role', 'status');
  document.body.append(status);
  const updateSelection = announce => {
    const selected = references.find(item => item.name === choice.value);
    dockLabel.textContent = selected ? 'Na sua consulta' : 'Sua próxima peça';
    dockName.textContent = selected ? selected.name : 'Escolha com calma';
    references.forEach(item => {
      if (!item.card) return;
      const chosen = Boolean(selected && item.name === selected.name && item.post === selected.post);
      item.card.dataset.showroomSelected = String(chosen);
      let label = item.card.querySelector('.showroom-chosen');
      if (!label) {
        label = document.createElement('span'); label.className = 'showroom-chosen';
        label.textContent = 'Na sua consulta'; label.hidden = true;
        item.card.querySelector('h3')?.after(label);
      }
      label.hidden = !chosen;
    });
    if (announce) status.textContent = selected ? `${selected.name} adicionada à sua consulta.` : 'Consulta sem peça escolhida.';
  };
  choice.addEventListener('change', () => updateSelection(true));
  controls.forEach(link => link.addEventListener('click', () => {
    updateSelection(true);
    requestAnimationFrame(() => choice.focus({ preventScroll: true }));
  }));
  updateSelection(false);

  let heroVisible = true, formVisible = false, activeDialog;
  const updateDock = () => {
    dock.hidden = heroVisible || formVisible || Boolean(activeDialog?.open);
  };
  const hero = document.querySelector('.hero');
  const consultation = document.getElementById('consulta') || form;
  if ('IntersectionObserver' in window && hero) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === consultation) formVisible = entry.isIntersecting;
      });
      updateDock();
    });
    observer.observe(hero); observer.observe(consultation);
  }
  dockAction.addEventListener('click', () => requestAnimationFrame(() => choice.focus({ preventScroll: true })));
  document.body.dataset.showroomReady = 'true';

  // Keep the existing accessible gallery; add a direct route from photo to enquiry.
  const enhanceDialog = dialog => {
    if (dialog.dataset.showroomActions) return;
    dialog.dataset.showroomActions = 'true'; activeDialog = dialog;
    const image = dialog.querySelector('.atelier-lightbox-image');
    const caption = dialog.querySelector('.atelier-lightbox-caption');
    const actions = document.createElement('div'); actions.className = 'showroom-photo-actions';
    const name = document.createElement('p'); name.className = 'showroom-photo-name';
    const choose = document.createElement('button'); choose.type = 'button';
    choose.className = 'showroom-photo-choose'; choose.textContent = 'Consultar esta peça';
    const source = document.createElement('a'); source.target = '_blank';
    source.rel = 'noopener noreferrer'; source.textContent = 'Ver publicação original';
    actions.append(name, choose, source); dialog.append(actions);
    let selected;
    const refresh = () => {
      selected = references.find(item => item.image && item.image === normalizeSource(image?.getAttribute('src') || ''));
      actions.hidden = !selected;
      if (selected) { name.textContent = selected.name; source.href = selected.post; }
      if (caption) caption.textContent = caption.textContent.replace(/https?:\/\/\S+/g, '').trim();
      updateDock();
    };
    choose.addEventListener('click', () => {
      if (!selected) return;
      dialog.close(); selected.link.click();
    });
    dialog.addEventListener('close', updateDock);
    new MutationObserver(refresh).observe(dialog, { attributes: true, attributeFilter: ['open', 'src'], subtree: true });
    refresh();
  };
  document.querySelectorAll('.atelier-lightbox').forEach(enhanceDialog);
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1 && node.matches('.atelier-lightbox')) enhanceDialog(node);
  }))).observe(document.body, { childList: true });
})();
