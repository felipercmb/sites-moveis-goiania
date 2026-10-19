(() => {
  'use strict';
  const form = document.getElementById('consultation-form');
  if (!form) return;
  const choice = document.getElementById('reference-choice');
  const room = document.getElementById('room-name');
  const width = document.getElementById('room-width');
  const height = document.getElementById('room-height');
  const message = document.getElementById('consultation-message');
  const status = document.getElementById('consultation-status');
  const copy = document.getElementById('copy-consultation');
  const prepare = () => {
    const selected = choice.selectedOptions[0];
    const lines = ['Olá, Art Leal! Quero conversar sobre móveis planejados para meu espaço.'];
    if (choice.value) lines.push(`Gostei desta referência: ${choice.value}.`, `Publicação: ${selected.dataset.post}`);
    if (room.value.trim()) lines.push(`Ambiente que quero planejar: ${room.value.trim()}.`);
    if (width.value.trim()) lines.push(`Largura disponível (aproximada): ${width.value.trim()}.`);
    if (height.value.trim()) lines.push(`Altura disponível (aproximada): ${height.value.trim()}.`);
    lines.push('Podem me orientar sobre as possibilidades, medidas e orçamento?');
    message.value = lines.join('\n\n');
    copy.firstChild.textContent = 'Copiar mensagem ';
    status.textContent = 'Mensagem preparada. Revise o texto, copie e envie pelo Instagram da Art Leal.';
  };
  form.addEventListener('submit', event => { event.preventDefault(); prepare(); });
  choice.addEventListener('change', prepare);
  document.querySelectorAll('[data-reference]').forEach(link => {
    link.addEventListener('click', () => {
      const option = [...choice.options].find(item => item.value === link.dataset.reference && item.dataset.post === link.dataset.post);
      if (!option) return;
      choice.value = option.value;
      prepare();
    });
  });
  copy.addEventListener('click', async () => {
    if (!message.value.trim()) {
      message.focus();
      status.textContent = 'Escreva ou prepare a mensagem antes de copiar.';
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(message.value);
      copy.firstChild.textContent = 'Mensagem copiada ';
      status.textContent = 'Mensagem copiada. Abra o Instagram, cole no atendimento da Art Leal e envie quando quiser.';
    } catch {
      message.focus();
      message.select();
      message.setSelectionRange(0, message.value.length);
      status.textContent = 'Texto selecionado. Use Copiar no seu dispositivo e depois cole na conversa do Instagram.';
    }
  });
  message.addEventListener('input', () => { copy.firstChild.textContent = 'Copiar mensagem '; });
})();
