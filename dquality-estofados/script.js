(() => {
 'use strict';
 const form=document.getElementById('consultation-form');
 if(!form)return;
 const choice=form.querySelector('#reference-choice');
 const room=form.querySelector('#room-name');
 const width=form.querySelector('#room-width');
 const depth=form.querySelector('#room-depth');
 const note=form.querySelector('#request-note');
 const message=form.querySelector('#consultation-message');
 const status=form.querySelector('#consultation-status');
 const copy=form.querySelector('#copy-consultation');
 const send=form.querySelector('[data-send-message]');
 const refreshLink=()=>{if(send){send.href=form.dataset.whatsapp+'?text='+encodeURIComponent(message.value);send.hidden=!message.value.trim();}};
 const prepare=()=>{
  const option=choice.selectedOptions[0];
  const lines=[`Olá, ${form.dataset.business}! Quero conversar sobre uma referência para meu espaço.`];
  if(choice.value)lines.push(`Referência: ${choice.value}.`,`Publicação: ${option.dataset.post}`);
  if(room.value.trim())lines.push(`Ambiente: ${room.value.trim()}.`);
  if(width.value.trim())lines.push(`Largura disponível aproximada: ${width.value.trim()}.`);
  if(depth.value.trim())lines.push(`Profundidade disponível aproximada: ${depth.value.trim()}.`);
  if(note.value.trim())lines.push(`O que procuro: ${note.value.trim()}`);
  lines.push('Podem me orientar sobre medidas, possibilidades e orçamento?');
  message.value=lines.join('\n\n');copy.textContent='Copiar mensagem';refreshLink();
  status.textContent=send?'Mensagem preparada. Revise o texto e abra o WhatsApp quando quiser.':'Mensagem preparada. Revise o texto, copie e abra o Instagram para conversar.';
 };
 form.addEventListener('submit',event=>{event.preventDefault();prepare();});
 choice.addEventListener('change',prepare);
 document.querySelectorAll('[data-reference]').forEach(link=>link.addEventListener('click',()=>{
  const option=[...choice.options].find(item=>item.value===link.dataset.reference&&item.dataset.post===link.dataset.post);
  if(option){choice.value=option.value;prepare();}
 }));
 message.addEventListener('input',()=>{copy.textContent='Copiar mensagem';refreshLink();});
 copy.addEventListener('click',async()=>{
  if(!message.value.trim()){message.focus();status.textContent='Prepare ou escreva a mensagem antes de copiar.';return;}
  try{
   if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(message.value);copy.textContent='Mensagem copiada';
   status.textContent='Mensagem copiada. Cole na conversa e envie quando quiser.';
  }catch{
   message.focus();message.select();message.setSelectionRange(0,message.value.length);
   status.textContent='Texto selecionado. Use Copiar no seu dispositivo e cole na conversa.';
  }
 });
})();
