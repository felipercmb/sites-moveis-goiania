(() => {
  'use strict';
  const features = {
    storage: ['Organização', 'Um lugar para cada coisa.', 'Planejar os espaços de guardar ajuda a deixar a bancada livre e a rotina mais prática.'],
    light: ['Iluminação', 'Luz que valoriza os detalhes.', 'Nichos iluminados criam profundidade. Converse sobre como integrar a luz à marcenaria do seu ambiente.'],
    finish: ['Acabamentos', 'Texturas em boa companhia.', 'O encontro do amadeirado com superfícies claras cria uma composição acolhedora. Explore materiais e cores com a equipe.']
  };
  const buttons = document.querySelectorAll('[data-feature]');
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const [label, title, description] = features[button.dataset.feature];
    document.getElementById('detail-label').textContent = label;
    document.getElementById('detail-title').textContent = title;
    document.getElementById('detail-description').textContent = description;
  }));
})();

/* Turn a portfolio reference into a useful conversation; no message is sent here. */
(() => {
  'use strict';
  const enquiry = document.querySelector('[data-enquiry]');
  if (!enquiry) return;
  const piece = enquiry.querySelector('[data-enquiry-piece]');
  const size = enquiry.querySelector('[data-enquiry-size]');
  const note = enquiry.querySelector('[data-enquiry-note]');
  const preview = enquiry.querySelector('[data-enquiry-preview]');
  const status = enquiry.querySelector('[data-enquiry-status]');
  const referencePosts = new Map([...document.querySelectorAll('[data-enquiry-choice]')].map(link => [link.dataset.enquiryChoice, link.dataset.enquiryPost]).filter(([, post]) => post));
  const update = () => {
    const lines = [enquiry.dataset.enquiryIntro];
    if (piece.value) lines.push(`Referência do portfólio: ${piece.value}.`);
    if (referencePosts.has(piece.value)) lines.push(`Publicação de referência: ${referencePosts.get(piece.value)}`);
    if (size.value.trim()) lines.push(`Medidas aproximadas: ${size.value.trim()}.`);
    if (note.value.trim()) lines.push(`Minha ideia: ${note.value.trim()}.`);
    lines.push('Podem me orientar sobre possibilidades, orçamento e prazo?');
    preview.value = lines.join('\n');
    status.textContent = '';
    const copy = enquiry.querySelector('[data-enquiry-copy]');
    if (copy) copy.textContent = 'Copiar minha ideia';
  };
  enquiry.addEventListener('input', update);
  enquiry.addEventListener('change', update);
  if (enquiry.tagName === 'FORM') enquiry.addEventListener('submit', update);
  document.querySelectorAll('[data-enquiry-choice]').forEach(link => {
    link.addEventListener('click', event => {
      const match = [...piece.options].find(option => option.value === link.dataset.enquiryChoice);
      if (!match) return;
      event.preventDefault();
      piece.value = match.value;
      update();
      status.textContent = `Referência selecionada: ${match.value}.`;
      document.getElementById('contato').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      piece.focus({ preventScroll: true });
    });
  });
  enquiry.querySelector('[data-enquiry-copy]')?.addEventListener('click', async event => {
    const copyButton = event.currentTarget;
    update();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(preview.value);
      copyButton.textContent = 'Ideia copiada';
      status.textContent = `Sua ideia foi copiada. Abra o Instagram e cole na conversa com ${enquiry.dataset.enquiryBrand}.`;
    } catch {
      preview.closest('details').open = true;
      preview.focus();
      preview.select();
      status.textContent = 'Selecione e copie a mensagem abaixo. Depois, cole na conversa do Instagram.';
    }
  });
  update();
})();
