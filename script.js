function goTo(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.classList.remove('active'));

  document.getElementById(sectionId).classList.add('active');
}

function smoothScroll(target) {
  const element = document.querySelector(target);
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const duration = 1500; // velocidad del scroll
  let start;

  function animation(currentTime) {
    if (start === undefined) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 3);
    window.scrollTo(0, startPosition + (targetPosition - startPosition) * progress);

    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

// Seleccionamos elementos
const form = document.getElementById('form');
const scoreValue = document.getElementById('scoreValue');
const scoreFill = document.getElementById('scoreFill');
const interpretation = document.getElementById('interpretation');
const adviceList = document.getElementById('adviceList');
const clearBtn = document.getElementById('clear');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  calculateStress();
});

clearBtn.addEventListener('click', function() {
  form.reset();
  scoreValue.textContent = '--';
  scoreFill.style.width = '0%';
  interpretation.textContent = 'Completa el formulario y presiona "Calcular y Guardar".';
  adviceList.innerHTML = '';
});

function calculateStress() {
  const sleep = Number(document.getElementById('sleep').value);
  const exercise = Number(document.getElementById('exercise').value);
  const coffee = Number(document.getElementById('coffee').value);
  const screens = Number(document.getElementById('screens').value);
  const load = Number(document.getElementById('load').value);
  const meditation = document.getElementById('meditation').value;

  // 1️⃣ Calcular puntaje
  let score = 0;
  score += Math.max(0, 8 - sleep) * 2;           
  score += Math.max(0, 60 - exercise) * 0.5;
  score += coffee * 1.5;
  score += screens * 1;
  score += load * 1.5;
  score -= meditation === 'yes' ? 2 : 0;

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  // 2️⃣ Mostrar puntaje y barra
  scoreValue.textContent = `${Math.round(score)}/100`;
  scoreFill.style.width = `${Math.round(score)}%`;

  // 3️⃣ Interpretar nivel
  let level = '';
  let color = '';
  let generalAdvice = [];

  if (score < 30) {
    level = 'Bajo';
    color = '#6aa84f';
    generalAdvice = ['Mantén tus hábitos: buen descanso y actividad física.'];
  } else if (score < 60) {
    level = 'Moderado';
    color = '#f6b26b';
    generalAdvice = ['Intenta pausas activas, reducir pantallas y mejorar sueño.'];
  } else {
    level = 'Alto';
    color = '#e06666';
    generalAdvice = ['Prioriza descanso, habla con un adulto o profesional si persiste.'];
  }

  scoreFill.style.background = color;
  interpretation.innerHTML = `<strong>Nivel:</strong> ${level} · Puntaje: ${Math.round(score)}/100`;

  // 4️⃣ Consejos específicos
  const specificAdvice = generateSpecificAdvice({ sleep, exercise, coffee, screens, load, meditation });
  adviceList.innerHTML = '';
  generalAdvice.concat(specificAdvice).forEach(a => {
    const li = document.createElement('li');
    li.innerText = a;
    adviceList.appendChild(li);
  });
}


function generateSpecificAdvice(d) {
  const list = [];
  if (d.sleep < 6) list.push('Dormir menos de 6 horas aumenta el riesgo de fatiga: intenta acostarte 30 min antes.');
  if (d.exercise < 20) list.push('Incluir 20–30 minutos de actividad reduce la tensión y mejora el ánimo.');
  if (d.coffee >= 4) list.push('Reduce la ingesta de cafeína, sobre todo en la tarde.');
  if (d.screens >= 5) list.push('Haz pausas digitales: 10 min cada hora de pantalla.');
  if (d.load >= 8) list.push('Organiza tareas y divide el estudio en bloques para evitar sobrecarga.');
  if (d.meditation === 'yes') list.push('Excelente: la meditación ayuda a regular las emociones.');
  return list;
}

// pestañas laterales
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // desactivar todas
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    // activar la seleccionada
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

