(() => {
 'use strict';
 const form=document.getElementById('inquiry-form');
 const choice=document.getElementById('piece-choice');
 const message=document.getElementById('inquiry-message');
 const status=document.getElementById('inquiry-status');
 const whatsapp=document.getElementById('whatsapp-link');
 const copy=document.getElementById('copy-message');
 const length=document.getElementById('space-length');
 const width=document.getElementById('space-width');
 const use=document.getElementById('space-use');
 if(!form||!choice||!message||!status||!whatsapp||!copy) return;
 const syncLink=()=>{
  const text=message.value.trim();
  whatsapp.href='https://wa.me/5562992069121?text='+encodeURIComponent(text||'Olá, Jacarandá! Quero conversar sobre móveis para meu espaço.');
  copy.textContent='Copiar mensagem';
 };
 const prepare=()=>{
  const selected=choice.selectedOptions[0];
  const lines=[choice.value?`Olá, Jacarandá! Gostei da referência: ${choice.value}.`:'Olá, Jacarandá! Quero conhecer as opções de móveis para meu espaço.'];
  if(selected?.dataset.post) lines.push('Publicação: '+selected.dataset.post);
  if(use.value.trim()) lines.push('Onde quero usar: '+use.value.trim()+'.');
  if(length.value.trim()) lines.push('Comprimento disponível: '+length.value.trim()+'.');
  if(width.value.trim()) lines.push('Largura disponível: '+width.value.trim()+'.');
  lines.push('Podem me ajudar com as medidas da peça, composição e disponibilidade?');
  message.value=lines.join('\n');syncLink();
  status.textContent='Mensagem preparada. Revise o texto e abra o WhatsApp; nada foi enviado.';
 };
 form.addEventListener('submit',event=>{event.preventDefault();prepare();message.focus({preventScroll:true});});
 choice.addEventListener('change',prepare);
 message.addEventListener('input',syncLink);
 document.querySelectorAll('[data-piece]').forEach(link=>link.addEventListener('click',()=>{
  choice.value=link.dataset.piece;prepare();
  status.textContent='Referência selecionada: '+choice.value+'. Acrescente suas medidas e prepare a mensagem.';
 }));
 whatsapp.addEventListener('click',()=>{syncLink();status.textContent='A consulta será aberta no WhatsApp. Confira o destinatário e envie quando quiser.';});
 copy.addEventListener('click',async()=>{
  const text=message.value.trim();
  if(!text){status.textContent='Escreva uma mensagem antes de copiar.';message.focus();return;}
  try{
   if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(text);copy.textContent='Mensagem copiada';status.textContent='Mensagem copiada. Você pode colar no atendimento da loja.';
  }catch{
   message.focus();message.select();status.textContent='O texto está selecionado. Copie pelo menu do seu aparelho.';
  }
 });
 syncLink();
})();
