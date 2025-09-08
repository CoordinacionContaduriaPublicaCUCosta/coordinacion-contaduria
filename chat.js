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

  return "Lo siento, no tengo la respuesta a esa pregunta. Intenta con otra o revisa la sección de FAQ.";
}

function appendMessage(sender, message) {
  const chatBox = document.getElementById('chat-box');
  const div = document.createElement('div');
  div.classList.add('chat-message', sender);

  // Si la respuesta contiene un link a PDF, lo convertimos en botón
  if (message.includes('docs/AFILIATE_AL_IMSS_2023.pdf')) {
    const btn = document.createElement('a');
    btn.href = 'docs/AFILIATE_AL_IMSS_2023.pdf';
    btn.target = '_blank';
    btn.textContent = '📄 Descargar PDF IMSS 2023';
    btn.classList.add('pdf-btn');
    div.textContent = message.split('<a')[0]; // mantiene el texto antes del link
    div.appendChild(btn);
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
