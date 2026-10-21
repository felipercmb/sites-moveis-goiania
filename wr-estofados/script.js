(() => {
  'use strict';
  const form = document.querySelector('[data-inquiry]');
  if (!form) return;
  const choice = form.querySelector('[name="reference"]');
  const message = form.querySelector('[data-message]');
  const status = form.querySelector('[data-inquiry-status]');
  const copy = form.querySelector('[data-copy]');
  const open = form.querySelector('[data-open-contact]');
  const references = new Map([...document.querySelectorAll('[data-piece][data-post]')].map(link => [link.dataset.piece, link.dataset.post]));
  const channel = form.dataset.channel;
  const initialStatus = channel === 'instagram'
    ? 'Copie a consulta e cole na conversa do Instagram. Você escolhe quando enviar.'
    : channel === 'whatsapp-short'
      ? 'Copie o texto e cole na conversa. O link oficial abre o WhatsApp da loja, sem preencher a mensagem automaticamente.'
      : 'O WhatsApp abre com o texto para você revisar. A mensagem só é enviada quando você confirmar por lá.';
  const updateDestination = () => {
    if (channel === 'whatsapp') open.href = `${form.dataset.contact}?text=${encodeURIComponent(message.value.trim())}`;
    else open.href = form.dataset.contact;
  };
  const prepare = () => {
    const lines = [`Olá, ${form.dataset.business}!`];
    const selectedPost = references.get(choice.value);
    if (choice.value && selectedPost) lines.push(`Gostei da referência: ${choice.value}.`, `Publicação: ${selectedPost}`);
    else lines.push(form.dataset.general);
    const service = form.querySelector('[name="service"]');
    if (service?.value) lines.push(`O que procuro: ${service.value}.`);
    const measures = ['width', 'depth', 'height'].map((key, index) => {
      const value = form.elements.namedItem(key)?.value.trim();
      return value ? `${['largura', 'profundidade', 'altura'][index]}: ${value}` : null;
    }).filter(Boolean);
    if (measures.length) lines.push(`Espaço disponível — ${measures.join('; ')}.`);
    const idea = form.elements.namedItem('idea').value.trim();
    if (idea) lines.push(`Minha ideia: ${idea}`);
    lines.push(form.dataset.question);
    message.value = lines.join('\n');
    copy.textContent = 'Copiar consulta';
    status.textContent = initialStatus;
    updateDestination();
  };
  choice.addEventListener('change', prepare);
  form.querySelectorAll('[name="width"], [name="depth"], [name="height"], [name="idea"], [name="service"]').forEach(field => {
    field.addEventListener(field.tagName === 'SELECT' ? 'change' : 'input', prepare);
  });
  message.addEventListener('input', () => {
    copy.textContent = 'Copiar consulta';
    status.textContent = initialStatus;
    updateDestination();
  });
  document.querySelectorAll('[data-piece][data-post]').forEach(link => link.addEventListener('click', () => {
    choice.value = link.dataset.piece;
    prepare();
  }));
  copy.addEventListener('click', async () => {
    const text = message.value.trim();
    if (!text) { status.textContent = 'Escreva sua consulta antes de copiar.'; message.focus(); return; }
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      copy.textContent = 'Consulta copiada';
      status.textContent = channel === 'instagram'
        ? 'Consulta copiada. Abra o Instagram e cole o texto na conversa com a loja.'
        : 'Consulta copiada. Abra o WhatsApp e revise o texto antes de enviar.';
    } catch {
      message.focus(); message.select();
      status.textContent = 'O texto está selecionado. Copie pelo menu do aparelho e cole na conversa da loja.';
    }
  });
  open.addEventListener('click', event => {
    if (!message.value.trim()) { event.preventDefault(); status.textContent = 'Escreva sua consulta antes de abrir a conversa.'; message.focus(); }
    else updateDestination();
  });
  form.addEventListener('submit', event => { event.preventDefault(); prepare(); message.focus(); });
  prepare();
})();
