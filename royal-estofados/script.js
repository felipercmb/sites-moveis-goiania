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
 let lastPrepared='';
 let previousContext=[];
 let edited=false;
 let writing=false;
 const refreshLink=()=>{
  const empty=!message.value.trim();
  copy.disabled=empty;
  if(send){send.href=form.dataset.whatsapp+'?text='+encodeURIComponent(message.value);send.hidden=empty;}
 };
 const contextLines=()=>{
  const option=choice.selectedOptions[0];
  const lines=[];
  if(choice.value&&option?.dataset.post)lines.push(`Referência: ${choice.value}.`,`Publicação: ${option.dataset.post}`);
  if(room.value.trim())lines.push(`Ambiente: ${room.value.trim()}.`);
  if(width.value.trim())lines.push(`Largura disponível aproximada: ${width.value.trim()}.`);
  if(depth.value.trim())lines.push(`Profundidade disponível aproximada: ${depth.value.trim()}.`);
  if(note.value.trim())lines.push(`O que procuro: ${note.value.trim()}`);
  return lines;
 };
 const publish=text=>{
  writing=true;message.value=text;
  message.dispatchEvent(new Event('input',{bubbles:true}));
  writing=false;refreshLink();
 };
 const prepare=()=>{
  const context=contextLines();
  if(!context.length&&!message.value.trim()){
   status.textContent='Escolha uma peça ou conte o que você procura para preparar a mensagem.';
   choice.focus();refreshLink();return;
  }
  if(edited&&message.value.trim()){
   let draft=message.value;
   // Only replace generated context that is still present verbatim. Personal
   // edits remain intact; the latest piece/post and measurements are appended.
   const remaining=[...context];
   for(const previous of previousContext){
    const key=previous.split(':',1)[0];
    const index=remaining.findIndex(line=>line.split(':',1)[0]===key);
    if(draft.includes(previous)){
     draft=draft.replace(previous,index>=0?remaining[index]:'');
     if(index>=0)remaining.splice(index,1);
    }
   }
   const added=remaining.filter(line=>!draft.includes(line));
   publish([draft.trim(),...added].filter(Boolean).join('\n\n').replace(/\n{3,}/g,'\n\n'));
   status.textContent='Dados atualizados. Seu texto foi mantido; revise a mensagem antes de abrir a conversa.';
  }else{
   const lines=[`Olá, ${form.dataset.business}! Quero conversar sobre uma peça para meu espaço.`,...context,'Podem me orientar sobre medidas e orçamento?'];
   lastPrepared=lines.join('\n\n');publish(lastPrepared);
   status.textContent=send?'Mensagem preparada. Revise o texto e abra o WhatsApp quando quiser.':'Mensagem preparada. Revise o texto, copie e abra o Instagram para conversar.';
  }
  previousContext=context;
 };
 form.addEventListener('submit',event=>{event.preventDefault();prepare();});
 choice.addEventListener('change',prepare);
 document.querySelectorAll('[data-reference]').forEach(link=>link.addEventListener('click',()=>{
  const option=[...choice.options].find(item=>item.value===link.dataset.reference&&item.dataset.post===link.dataset.post);
  if(option){choice.value=option.value;prepare();}
 }));
 message.addEventListener('input',()=>{
  if(!writing)edited=Boolean(message.value.trim())&&message.value!==lastPrepared;
  copy.textContent='Copiar mensagem';refreshLink();
 });
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
 refreshLink();
})();
