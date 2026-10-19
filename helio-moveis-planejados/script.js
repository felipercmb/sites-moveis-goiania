/* Atelier handles navigation, filters and the accessible gallery. */
(() => {
  'use strict';
  const form=document.querySelector('[data-enquiry]');
  if(!form)return;
  const reference=form.elements.namedItem('reference');
  const interest=form.elements.namedItem('interest');
  const measures=form.elements.namedItem('measures');
  const details=form.elements.namedItem('details');
  const message=form.elements.namedItem('message');
  const action=form.querySelector('[data-open-conversation]');
  const status=form.querySelector('[data-enquiry-status]');
  const syncLink=()=>{if(form.dataset.channel==='whatsapp')action.href=`https://wa.me/${form.dataset.phone}?text=${encodeURIComponent(message.value.trim())}`;};
  const prepare=()=>{
    const option=reference.selectedOptions[0];
    const lines=[`Olá, ${form.dataset.brand}! Quero conversar sobre ${interest.value.toLocaleLowerCase('pt-BR')}.`];
    if(option?.value){lines.push(`Gostei desta referência: ${option.textContent}.`);lines.push(`Publicação: ${option.dataset.post}`);}
    if(measures.value.trim())lines.push(`Medidas aproximadas: ${measures.value.trim()}`);
    if(details.value.trim())lines.push(`Minha ideia: ${details.value.trim()}`);
    lines.push('Podemos avaliar as possibilidades para o meu ambiente?');
    message.value=lines.join('\n\n');syncLink();status.textContent='';
  };
  [reference,interest,measures,details].forEach(field=>field.addEventListener('input',prepare));
  message.addEventListener('input',()=>{syncLink();status.textContent='';});
  document.querySelectorAll('[data-select-reference]').forEach(button=>button.addEventListener('click',()=>{
    reference.value=button.dataset.selectReference;
    if(button.dataset.interest)interest.value=button.dataset.interest;
    prepare();
    document.querySelectorAll('[data-select-reference]').forEach(b=>b.classList.toggle('is-selected',b===button));
    status.textContent='Referência escolhida. Acrescente medidas e revise a mensagem.';
    document.getElementById('seu-pedido').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    reference.focus({preventScroll:true});
  }));
  form.addEventListener('submit',event=>{event.preventDefault();action.focus();});
  form.querySelector('[data-copy-message]').addEventListener('click',async()=>{
    if(!message.value.trim()){status.textContent='Escreva sua mensagem antes de copiar.';message.focus();return;}
    try{if(!navigator.clipboard?.writeText)throw new Error();await navigator.clipboard.writeText(message.value);status.textContent=form.dataset.channel==='whatsapp'?'Mensagem copiada. Você pode abrir a conversa no WhatsApp.':'Mensagem copiada. Abra o Instagram e cole no direct.';}
    catch{message.focus();message.select();status.textContent='A mensagem está selecionada. Use Copiar no menu do seu aparelho.';}
  });
  prepare();
})();
