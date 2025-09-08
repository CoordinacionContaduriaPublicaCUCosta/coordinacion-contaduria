let faqData = [];
let horarioData = [];

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
      btn.onclick = () => {
        appendMessage('user', f.pregunta);
        appendMessage('bot', f.respuesta);
      };
      buttonsDiv.appendChild(btn);
    });

  } catch(err) {
    console.error('Error al cargar FAQ:', err);
  }
}

function getAnswer(userMessage) {
  const msg = userMessage.toLowerCase();

  // Responder sobre horario
  if(msg.includes('horario') || msg.includes('atención')){
    let horarioText = "Nuestro horario de atención es:\n";
    for(let dia in horarioData){
      horarioText += `${capitalize(dia)}: ${horarioData[dia]}\n`;
    }
    return horarioText;
  }

  // Pregunta especial: constancia
  if (msg.includes("constancia")) {
    return `Para tramitar una constancia, descarga el formato aquí: 
    <a href="docs/constancia.pdf" target="_blank">Descargar Constancia</a>`;
  }

  // Buscar en FAQ
  for(let f of faqData){
    const question = f.pregunta.toLowerCase();
    if(msg.includes(question) || question.includes(msg)){
      return f.respuesta;
    }
  }

  return "Lo siento, no tengo la respuesta a esa pregunta. Intenta con otra o revisa la sección de FAQ.";
}

function appendMessage(sender, message) {
  const chatBox = document.getElementById('chat-box');
  const div = document.createElement('div');
  div.classList.add('chat-message', sender);

  // Detectar si hay link a PDF
  if (message.includes('docs/')) {
    div.innerHTML = message.replace(
      /<a href="([^"]+)"[^>]*>[^<]+<\/a>/g,
      `<a href="$1" target="_blank" class="pdf-btn">📄 Descargar PDF</a>`
    );
  } else {
    div.innerHTML = message;
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleSend() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if(message === '') return;

  appendMessage('user', message);
  const answer = getAnswer(message);
  setTimeout(() => appendMessage('bot', answer), 500);
  input.value = '';
  input.focus();
}

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}

document.getElementById('send-btn').addEventListener('click', handleSend);
document.getElementById('user-input').addEventListener('keypress', function(e){
  if(e.key === 'Enter') handleSend();
});

window.addEventListener('DOMContentLoaded', loadFAQ);
