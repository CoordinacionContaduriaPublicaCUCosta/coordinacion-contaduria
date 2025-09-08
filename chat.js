let faqData = [];
let horarioData = {};

async function loadFAQ() {
  try {
    const resp = await fetch('data.json');
    const data = await resp.json();
    faqData = data.faq;
    horarioData = data.horario;
  } catch(err) {
    console.error('Error al cargar data.json:', err);
  }
}

function appendMessage(sender, message) {
  const chatBox = document.getElementById('chat-box');
  const div = document.createElement('div');
  div.classList.add('chat-message', sender);
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
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

  // Buscar en FAQ
  for(let f of faqData){
    const question = f.pregunta.toLowerCase();
    if(msg.includes(question) || question.includes(msg)){
      return f.respuesta;
    }
  }

  // Respuesta por defecto
  return "Lo siento, no tengo la respuesta a esa pregunta. Intenta con otra o revisa la sección de FAQ.";
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
