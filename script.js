
async function loadData() {
  try {
    const resp = await fetch('data.json');
    const data = await resp.json();

    // Horario
    const horarioEl = document.getElementById('horario-content');
    horarioEl.innerHTML = '';
    for (let dia in data.horario) {
      const li = document.createElement('li');
      li.textContent = `${capitalize(dia)}: ${data.horario[dia]}`;
      horarioEl.appendChild(li);
    }

    // Trámites
    const tramitesEl = document.getElementById('tramites-content');
    tramitesEl.innerHTML = '';
    data.tramites.forEach(t => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${t.titulo}</strong><br>${t.descripcion}`;
      div.classList.add('item-card');
      tramitesEl.appendChild(div);
    });

    // Reglamentos
    const reglamentosEl = document.getElementById('reglamentos-content');
    reglamentosEl.innerHTML = '';
    data.reglamentos.forEach(r => {
      const p = document.createElement('p');
      p.textContent = r;
      reglamentosEl.appendChild(p);
    });

    // FAQ
    const faqEl = document.getElementById('faq-content');
    faqEl.innerHTML = '';
    data.faq.forEach(f => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${f.pregunta}</strong><br>${f.respuesta}`;
      div.classList.add('item-card');
      faqEl.appendChild(div);
    });

    // Contacto
    document.getElementById('correo-display').textContent = data.contacto.email;
    document.getElementById('telefono-display').textContent = data.contacto.phone;
    document.getElementById('whatsapp-display').textContent = data.contacto.whatsapp;

  } catch (err) {
    console.error('Error al cargar data.json:', err);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.addEventListener('DOMContentLoaded', loadData);

