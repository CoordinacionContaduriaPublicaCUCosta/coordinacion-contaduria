async function loadData() {
  try {
    const resp = await fetch('data.json');
    const data = await resp.json();

    // Horario
    document.getElementById('horario-content').innerHTML =
      `<p><strong>Días:</strong> ${data.horario.dias}</p>
       <p><strong>Horas:</strong> ${data.horario.horas}</p>`;

    // Trámites
    const tramitesEl = document.getElementById('tramites-content');
    tramitesEl.innerHTML = '';
    data.tramites.forEach(t => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${t.titulo}</strong><br>${t.descripcion}`;
      div.style.marginBottom = "10px";
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
      div.style.marginBottom = "10px";
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

window.addEventListener('DOMContentLoaded', loadData);
