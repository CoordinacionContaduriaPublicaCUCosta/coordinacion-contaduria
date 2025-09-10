let faqData = [];
let horarioData = [];
let lastMessage = ""; // Para evitar repetir la misma pregunta

async function loadFAQ() {
  try {
    const resp = await fetch('data.json');
    const data = await resp.json();
    faqData = data.faq;
    horarioData = data.horario;

    // Crear botones rápidos para FAQ
    const buttonsDiv = document.getElementById('chat-buttons');
    buttonsDiv.innerHTML = '';
    faqData.forEach(f => {
      const btn = document.createElement('button');
      btn.textContent = f.pregunta;
      btn.classList.add('faq-btn');
      btn.onclick = () => sendMessage(f.pregunta);
      buttonsDiv.appendChild(btn);
    });

    // Mensaje de bienvenida con animación "Escribiendo..."
    const typingDiv = appendMessage('bot', "Escribiendo...", null, true);
    setTimeout(() => {
      typingDiv.remove();
      appendMessage('bot', "¡Hola! 🤖 Soy tu asistente de la Coordinación de Contaduría ContaBot. Puedes escribirme tus dudas o usar los botones rápidos para consultar información.");
    }, 2000);

  } catch(err) {
    console.error('Error al cargar FAQ:', err);
  }
}

// Función principal para enviar mensaje
function sendMessage(message) {
  const input = document.getElementById('user-input');

  if(message.trim() === "") return;

  // Evitar enviar el mismo mensaje consecutivo
  if(message.trim() === lastMessage) {
    alert("No puedes enviar la misma pregunta consecutivamente.");
    return;
  }

  lastMessage = message.trim();
  appendMessage('user', message);

  // Mostrar animación de espera
  const typingDiv = appendMessage('bot', "Escribiendo...", null, true);

  // Esperar 3 segundos antes de mostrar la respuesta real
  setTimeout(() => {
    typingDiv.remove(); // quitar animación de espera
    const answer = getAnswer(message);
    appendMessage('bot', answer.respuesta, answer.pdf);
  }, 3000);

  input.value = '';
  input.focus();
}

// appendMessage acepta un PDF opcional y flag de espera
function appendMessage(sender, message, pdf = null, isTyping = false) {
  const chatBox = document.getElementById('chat-box');
  if(!chatBox) return; // Protección si no existe

  const div = document.createElement('div');
  div.classList.add('chat-message', sender);

  // Crear icono
  const icon = document.createElement('span');
  icon.classList.add('chat-icon');
  icon.textContent = sender === 'user' ? '🧑' : '🤖';
  div.appendChild(icon);

  // Crear contenido del mensaje
  const content = document.createElement('span');
  content.classList.add('chat-content');
  content.textContent = message;
  div.appendChild(content);

  // Si hay PDF, agregamos botón
  if(pdf){
    const pdfBtn = document.createElement('a');
    pdfBtn.href = pdf;
    pdfBtn.target = '_blank';
    pdfBtn.textContent = '📄 Descargar PDF';
    pdfBtn.classList.add('pdf-btn');
    div.appendChild(document.createElement('br'));
    div.appendChild(pdfBtn);
  }

  if(isTyping) div.classList.add('typing'); // clase para animación

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  return div; // si es animación, devolvemos el div para quitarlo después
}

function getAnswer(userMessage) {
  const msg = userMessage.toLowerCase();

  // Responder sobre horario
  if(msg.includes('horario') || msg.includes('atención')){
    let horarioText = "Nuestro horario de atención es:\n";
    for(let dia in horarioData){
      horarioText += `${capitalize(dia)}: ${horarioData[dia]}\n`;
    }
    return { respuesta: horarioText };
  }

  // Buscar en FAQ
  for(let f of faqData){
    const question = f.pregunta.toLowerCase();
    if(msg.includes(question) || question.includes(msg)){
      return f; // incluye respuesta y PDF si existe
    }
  }

  return { respuesta: "Lo siento, no tengo la respuesta a esa pregunta. Intenta con otra o revisa la sección de FAQ." };
}

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}



function getAnswer(userMessage) {
  const msg = userMessage.toLowerCase();

  // Saludos
  if(/hola|buenas|qué tal|hey/.test(msg)){
    return { respuesta: "¡Hola! 👋 Bienvenido al chat de la Coordinación. Pregunta lo que necesites sobre trámites, horarios, servicio social o reglamentos." };
  }

  // Despedidas
  if(/adiós|gracias|nos vemos|bye/.test(msg)){
    return { respuesta: "¡Gracias por usar el chat! 😊 Recuerda que siempre puedes volver a preguntar cuando quieras." };
  }

  // Preguntar por el servicio social
  if(msg.includes("servicio social")){
    return { respuesta: "Puedes iniciar tu servicio social al cumplir el 60% de tus créditos. Consulta más información en la sección Servicio Social del inicio." };
  }

  // Responder sobre horario
  if(msg.includes('horario') || msg.includes('atención')){
    let horarioText = "Nuestro horario de atención es:\n";
    for(let dia in horarioData){
      horarioText += `${capitalize(dia)}: ${horarioData[dia]}\n`;
    }
    return { respuesta: horarioText };
  }

  // Buscar en FAQ
  for(let f of faqData){
    const question = f.pregunta.toLowerCase();
    if(msg.includes(question) || question.includes(msg)){
      return f;
    }
  }

  // Si no encontró nada
  return { respuesta: "No entendí tu pregunta 🤔. Intenta con otra palabra o revisa las opciones de FAQ aquí abajo 👇" };
}





// Eventos de input
document.getElementById('send-btn').addEventListener('click', () => sendMessage(document.getElementById('user-input').value));
document.getElementById('user-input').addEventListener('keypress', function(e){
  if(e.key === 'Enter') sendMessage(document.getElementById('user-input').value);
});

window.addEventListener('DOMContentLoaded', loadFAQ);
