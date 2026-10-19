/* Site-specific enhancement: keep service disclosures focused, without hiding content on load. */
document.querySelectorAll('.service-list details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.service-list details').forEach(other => {
      if (other !== detail) other.open = false;
    });
  });
});


/* Build a customer-controlled enquiry from an actual portfolio reference. */
(() => {
  const form = document.querySelector('[data-interest-form]');
  if (!form) return;
  const interest = form.elements.namedItem('interest');
  const measures = form.elements.namedItem('measures');
  const details = form.elements.namedItem('details');
  const preview = form.querySelector('[data-request-preview]');
  const link = form.querySelector('[data-request-link]');
  const status = form.querySelector('[data-request-status]');
  const referenceLabel = document.querySelector('[data-request-reference]');
  let reference = '';
  let referenceUrl = '';
  let message = '';
  const update = () => {
    const lines = [`Olá! Quero conversar com a ${form.dataset.brand} sobre ${interest.value.toLocaleLowerCase('pt-BR')}.`];
    if (reference) lines.push(`Gostei desta referência do portfólio: ${reference}`);
    if (referenceUrl) lines.push(`Publicação de referência: ${referenceUrl}`);
    if (measures.value.trim()) lines.push(`Medidas aproximadas: ${measures.value.trim()}`);
    if (details.value.trim()) lines.push(`Minha ideia: ${details.value.trim()}`);
    lines.push('Podemos conversar sobre as possibilidades para o meu espaço?');
    message = lines.join('\n\n');
    preview.textContent = message;
    if (form.dataset.channel === 'whatsapp') {
      link.href = `https://wa.me/${form.dataset.phone}?text=${encodeURIComponent(message)}`;
    }
  };
  form.addEventListener('input', () => { update(); status.textContent = ''; });
  form.addEventListener('change', update);
  interest.addEventListener('change', () => {
    reference = '';
    referenceUrl = '';
    referenceLabel.hidden = true;
    document.querySelectorAll('[data-select-interest]').forEach(button => button.classList.remove('is-selected'));
    update();
  });
  form.addEventListener('submit', event => { event.preventDefault(); link.focus(); });
  document.querySelectorAll('[data-select-interest]').forEach(button => {
    button.addEventListener('click', () => {
      interest.value = button.dataset.selectInterest;
      reference = button.dataset.reference || '';
      referenceUrl = button.dataset.referenceUrl || '';
      referenceLabel.textContent = reference ? `Sua referência: ${reference}` : '';
      referenceLabel.hidden = !reference;
      document.querySelectorAll('[data-select-interest]').forEach(other => other.classList.toggle('is-selected', other === button));
      update();
      status.textContent = 'Interesse selecionado. Acrescente as medidas ou os detalhes que quiser.';
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.querySelector('#seu-pedido').scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
      interest.focus({ preventScroll: true });
    });
  });
  form.querySelector('[data-copy-request]').addEventListener('click', async () => {
    update();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(message);
      status.textContent = form.dataset.channel === 'instagram' ? 'Pedido copiado. Abra o Instagram e cole a mensagem no direct.' : 'Pedido copiado. Você também pode abrir a conversa no WhatsApp.';
    } catch {
      const disclosure = form.querySelector('.request-preview');
      disclosure.open = true;
      const range = document.createRange();
      range.selectNodeContents(preview);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Selecione e copie a mensagem abaixo para compartilhar com a equipe.';
    }
  });
  update();
})();
