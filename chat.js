let faqData = [];

async function loadFAQ() {
  try {
    const resp = await fetch('data.json');
    const data = await resp.json();
    faqData = data.faq;
  } catch(err) {
    console.error('Error al cargar FAQ:', err);
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
  setTimeout(() => appendMessage('bot', answer), 500); // simulando respuesta
  input.value = '';
  input.focus();
}

document.getElementById('send-btn').addEventListener('click', handleSend);
document.getElementById('user-input').addEventListener('keypress', function(e){
  if(e.key === 'Enter') handleSend();
});

// Cargar FAQ al iniciar
window.addEventListener('DOMContentLoaded', loadFAQ);
