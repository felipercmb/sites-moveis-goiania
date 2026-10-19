/* The shared Atelier module handles the gallery, filters, navigation and motion. */
(() => {
  document.documentElement.dataset.site = 'kasa-moveis';
  const choice = document.getElementById('kasa-piece');
  const message = document.getElementById('kasa-message');
  const status = document.getElementById('kasa-inquiry-status');
  const copy = document.getElementById('kasa-copy');
  if (!choice || !message || !status || !copy) return;
  const referencePosts = new Map([...document.querySelectorAll('[data-piece]')].map(link => [link.dataset.piece, link.dataset.post]));
  const prepare = () => {
    message.value = choice.value
      ? `Olá, Kasa! Gostei da referência: ${choice.value}.${referencePosts.get(choice.value) ? '\nPublicação: ' + referencePosts.get(choice.value) : ''}\nPodem confirmar as medidas, a condição e a disponibilidade dessa peça?`
      : 'Olá, Kasa! Quero conhecer as opções de móveis para minha casa. Podem me ajudar com modelos, medidas, condição e disponibilidade?';
    copy.firstChild.textContent = 'Copiar consulta ';
    status.textContent = choice.value
      ? `Referência selecionada: ${choice.value}. Revise o texto, copie e abra o Instagram.`
      : 'Nada é enviado por aqui. Você revisa e envia a consulta no Instagram.';
  };
  choice.addEventListener('change', prepare);
  document.querySelectorAll('[data-piece]').forEach(link => {
    link.addEventListener('click', () => {
      choice.value = link.dataset.piece;
      prepare();
    });
  });
  copy.addEventListener('click', async () => {
    const text = message.value.trim();
    if (!text) {
      status.textContent = 'Escreva sua consulta antes de copiar.';
      message.focus();
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      copy.firstChild.textContent = 'Consulta copiada ';
      status.textContent = 'Consulta copiada. Abra o Instagram e cole a mensagem na conversa com a loja.';
    } catch {
      message.focus();
      message.select();
      status.textContent = 'O texto está selecionado. Copie pelo menu do seu aparelho e cole na conversa do Instagram.';
    }
  });
})();
