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

  // 👋 Saludos
  if (/hola|buenas|qué tal|hey|holi/.test(msg)) {
    return { respuesta: "¡Hola! 👋 Bienvenido al chat de la Coordinación Académica. Pregunta lo que necesites sobre trámites, servicio social, reglamentos o formación integral." };
  }

  // 🙋 Despedidas
  if (/adiós|gracias|nos vemos|bye|hasta luego/.test(msg)) {
    return { respuesta: "¡Gracias por usar el chat! 😊 Vuelve cuando quieras, siempre estoy aquí para ayudarte." };
  }

  // ❓ Dudas / No entendí
  if (/no entiendo|explícame|ayuda|qué hago|dime/.test(msg)) {
    return { respuesta: "Entiendo tu duda 🤔. Puedes preguntarme sobre: horarios, trámites, servicio social, prácticas profesionales, formación integral o reglamento." };
  }

  // 📍 Ubicación
  if (/dónde está|ubicación|coordinación|oficina/.test(msg)) {
    return { respuesta: "La Coordinación Académica está dentro del Centro Universitario de la Costa. Puedes acudir directamente en horario de atención para más apoyo." };
  }

  // 🕐 Horario de atención
  if (/horario|atención|a qué hora|cuándo atienden/.test(msg)) {
    let horarioText = "Nuestro horario de atención es:\n";
    for (let dia in horarioData) {
      horarioText += `${capitalize(dia)}: ${horarioData[dia]}\n`;
    }
    return { respuesta: horarioText };
  }

  // 📚 Reprobadas
  if (/repruebo|qué pasa si repruebo|perdí la materia|no pasé/.test(msg)) {
    return { respuesta: "Si repruebas en ordinario y extraordinario, deberás repetir la materia en el siguiente ciclo donde se ofrezca. Si no logras acreditarla nuevamente, serás dado de baja. (Ver Artículo 33)." };
  }

  // 📖 Artículos 33 y 35
  if (/artículo 33|artículo 35|me aplicaron el 33|me aplicaron el 35/.test(msg)) {
    return { respuesta: "Si fuiste dado de baja por el artículo 33, puedes solicitar por escrito a la Comisión de Educación una nueva oportunidad antes del siguiente ciclo. Si no apruebas en esa oportunidad, se aplicará el artículo 35 y la baja será definitiva." };
  }

  // 🏅 Servicio Social
  if (/servicio social|cómo hago servicio social|quiero hacer servicio social/.test(msg)) {
    return { respuesta: "Puedes iniciar tu servicio social al cumplir el 60% de tus créditos. Debes acudir con tu coordinador y revisar las convocatorias vigentes en la Coordinación Académica." };
  }

  // 🎓 Prácticas Profesionales
  if (/prácticas profesionales|cómo hago prácticas/.test(msg)) {
    return { respuesta: "Las prácticas profesionales se realizan una vez que cumplas con los requisitos de tu plan de estudios. Acude con tu Coordinador para conocer las empresas y convenios disponibles." };
  }

  // 📄 Trámites
  if (/trámite|qué necesito|documentos|requisitos/.test(msg)) {
    return { respuesta: "Puedes realizar distintos trámites como constancias, revalidaciones, formación integral y más. Acude con tu Coordinador con la documentación correspondiente para iniciar el proceso." };
  }

  // 🎭 Formación Integral
  if (/formación integral|créditos extracurriculares|actividades extracurriculares/.test(msg)) {
    return { respuesta: "Debes acreditar 12 actividades extracurriculares (culturales, deportivas, talleres, etc.) para obtener 4 créditos. Solicita el reconocimiento con tu Coordinador entregando oficio y constancias." };
  }

  // 📨 Contacto
  if (/correo|teléfono|contacto|coordinador/.test(msg)) {
    return { respuesta: "Puedes contactar a tu Coordinador de Carrera directamente en la oficina de Coordinación Académica o a través del correo institucional del Centro Universitario de la Costa." };
  }

  // 🔍 Buscar en FAQ (exacto o parcial)
  for (let f of faqData) {
    const question = f.pregunta.toLowerCase();
    if (msg.includes(question) || question.includes(msg)) {
      return f;
    }
  }

  // 🛑 No encontró nada
  return { respuesta: "No entendí tu pregunta 😅. Puedes intentar con otra palabra o revisar las opciones de FAQ aquí abajo 👇" };
}




// Eventos de input
document.getElementById('send-btn').addEventListener('click', () => sendMessage(document.getElementById('user-input').value));
document.getElementById('user-input').addEventListener('keypress', function(e){
  if(e.key === 'Enter') sendMessage(document.getElementById('user-input').value);
});

window.addEventListener('DOMContentLoaded', loadFAQ);
