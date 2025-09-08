// script.js - carga data.json, maneja formulario, chat FAQ y enlaces de contacto
const DATA_URL = 'data.json';

async function loadData(){
  try{
    const r = await fetch(DATA_URL);
    const data = await r.json();

    // Horario
    const h = document.getElementById('horario-content');
    if(h){
      h.innerHTML = `<p><strong>Días:</strong> ${data.horario.dias}</p>
                     <p><strong>Horas:</strong> ${data.horario.horas}</p>`;
    }

    // Trámites
    const tList = document.getElementById('tramites-list');
    if(tList){
      tList.innerHTML = '';
      data.tramites.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${t.titulo}</strong> — ${t.descripcion}`;
        tList.appendChild(li);
      });
    }

    // Reglamentos
    const rEl = document.getElementById('reglamentos-content');
    if(rEl){
      rEl.innerHTML = data.reglamentos.map((r, i)=>`<p><strong>${i+1}.</strong> ${r}</p>`).join('');
    }

    // FAQs
    const faqList = document.getElementById('faq-list');
    if(faqList){
      faqList.innerHTML = data.faq.map(f => `<p><strong>${f.pregunta}</strong><br>${f.respuesta}</p>`).join('');
    }

    // Contact links
    const correo = data.contacto.email || 'coordinacion@ejemplo.com';
    const phoneRaw = data.contacto.phone || '+5213220000000';
    const whatsappNumber = data.contacto.whatsapp || '5213220000000';
    const correoLink = document.getElementById('correo-link');
    const telLink = document.getElementById('tel-link');
    const waLink = document.getElementById('wa-link');
    const openWa = document.getElementById('open-wa');
    const openMail = document.getElementById('open-mail');

    if(correoLink) correoLink.href = `mailto:${correo}`;
    if(telLink) telLink.href = `tel:${phoneRaw}`;
    if(waLink) waLink.href = `https://wa.me/${whatsappNumber}`;
    if(openWa) openWa.href = `https://wa.me/${whatsappNumber}`;
    if(openMail) openMail.href = `mailto:${correo}`;

  }catch(e){
    console.error('No se pudo cargar data.json', e);
  }
}

// Simple chat bot local (reglas por palabra clave)
function initChatBot(){
  const chatForm = document.getElementById('chat-form');
  const chatBox = document.getElementById('chat-box');

  const rules = [
    {q:['horario','hora','horas'], a:'Nuestro horario de atención es de lunes a viernes, 9:00 a 14:00.'},
    {q:['trámite','tramite','tramites'], a:'Puedes ver la lista de trámites en la sección "Trámites" de la página principal.'},
    {q:['reglamento','reglamentos'], a:'Los reglamentos están disponibles en la sección "Reglamentos". Si deseas, podemos enviártelos por correo.'},
    {q:['contacto','teléfono','telefono','correo','email'], a:'Puedes contactarnos por correo o WhatsApp desde la página de contacto.'},
    {q:['gracias','ok','perfecto'], a:'Con gusto. ¿Necesitas algo más?'}
  ];

  function botReply(text){
    const t = text.toLowerCase();
    for(const r of rules){
      for(const token of r.q){
        if(t.includes(token)){
          return r.a;
        }
      }
    }
    return 'Lo siento, no entendí. Puedes intentar preguntar por "horario", "trámites" o "contacto".';
  }

  if(chatForm){
    chatForm.addEventListener('submit', e=>{
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const text = input.value.trim();
      if(!text) return;
      // mostrar mensaje del usuario
      const me = document.createElement('div'); me.className='me'; me.textContent = text;
      chatBox.appendChild(me);
      chatBox.scrollTop = chatBox.scrollHeight;
      input.value='';

      // respuesta del bot (simulada con pequeña demora)
      setTimeout(()=>{
        const bot = document.createElement('div'); bot.className='bot';
        bot.textContent = botReply(text);
        chatBox.appendChild(bot);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 400);
    });
  }
}

// Contact form: abre mailto con datos (sin servidor)
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const result = document.getElementById('form-result');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const to = document.querySelector('#correo-link')?.href?.replace('mailto:','') || 'coordinacion@ejemplo.com';
    const subject = encodeURIComponent(`Contacto app: ${name}`);
    const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\n${message}`);
    // Abrir el cliente de correo
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    if(result) result.textContent = 'Se abrirá tu cliente de correo para enviar el mensaje.';
  });
}

window.addEventListener('load', ()=>{
  loadData();
  initChatBot();
  initContactForm();
});
