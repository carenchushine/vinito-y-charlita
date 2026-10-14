/* ==========================================================================
   INTERACCIÓN Y LÓGICA 8-BITS - CITA CON LEO MATTIOLI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTOS DEL DOM ---
  const stageQuestion = document.getElementById('stage-question');
  const stageLeo = document.getElementById('stage-leo');
  const stageFinal = document.getElementById('stage-final');

  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const arena = document.getElementById('arena');
  const dodgeFeedback = document.getElementById('dodge-feedback');

  const dateForm = document.getElementById('date-form');
  const inputDate = document.getElementById('input-date');
  const inputTime = document.getElementById('input-time');
  const inputPlace = document.getElementById('input-place');
  const inputNote = document.getElementById('input-note');
  const placeChips = document.querySelectorAll('.chip');

  const sumDate = document.getElementById('sum-date');
  const sumTime = document.getElementById('sum-time');
  const sumPlace = document.getElementById('sum-place');
  const sumNote = document.getElementById('sum-note');
  const sumNoteLine = document.getElementById('sum-note-line');

  const btnWhatsapp = document.getElementById('btn-whatsapp');
  const btnCopy = document.getElementById('btn-copy');
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const heartsBg = document.getElementById('hearts-bg');

  // CONFIGURACIÓN DE DESTINATARIO WHATSAPP
  // Celular original: +54 9 01133564970
  // Formato internacional WhatsApp (Argentina sin el 0 de prefijo interurbano): 5491133564970
  const WHATSAPP_PHONE = '5491133564970';

  // --- MOTOR DE SONIDO 8-BITS CON WEB AUDIO API ---
  let audioCtx = null;
  let isSoundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sonido de evasión (boing / retro slide)
  function playDodgeSound() {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';

      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  // Sonido de click / blip retro
  function playBlipSound(freq = 600, duration = 0.08) {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';

      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  // Fanfarria triunfal de "SÍ"
  function playYesFanfare() {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const notes = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 659.25, d: 0.1 },  // E5
      { f: 783.99, d: 0.1 },  // G5
      { f: 1046.50, d: 0.35 } // C6
    ];

    let delay = 0;
    notes.forEach(note => {
      setTimeout(() => {
        playBlipSound(note.f, note.d);
      }, delay);
      delay += note.d * 1000 * 0.9;
    });
  }

  // Melodía romántica chiptune "¡AY AMOR!"
  function playAyAmorJingle() {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    // Acordes y notas románticas estilo cumbia santafesina retro
    const melody = [
      { f: 440.00, t: 0.00, d: 0.15 }, // A4
      { f: 554.37, t: 0.15, d: 0.15 }, // C#5
      { f: 659.25, t: 0.30, d: 0.15 }, // E5
      { f: 880.00, t: 0.45, d: 0.35 }, // A5
      { f: 830.61, t: 0.85, d: 0.15 }, // G#5
      { f: 880.00, t: 1.00, d: 0.40 }, // A5
      { f: 659.25, t: 1.45, d: 0.20 }, // E5
      { f: 739.99, t: 1.70, d: 0.50 }  // F#5 sostenido
    ];

    melody.forEach(item => {
      setTimeout(() => {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';

          const now = audioCtx.currentTime;
          osc.frequency.setValueAtTime(item.f, now);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + item.d);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(now);
          osc.stop(now + item.d);
        } catch (e) {}
      }, item.t * 1000);
    });
  }

  // Control de sonido Mute/Unmute
  soundToggle.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
    if (isSoundEnabled) {
      initAudio();
      playBlipSound(880, 0.1);
    }
  });

  // --- FONDO ANIMADO DE CORAZONES RETRO ---
  function createFloatingHeart() {
    const symbols = ['❤️', '🍷', '💖', '🌹', '✨', '💕'];
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 95 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 3.5) + 's';
    heart.style.fontSize = (Math.random() * 14 + 16) + 'px';
    heartsBg.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 7000);
  }

  setInterval(createFloatingHeart, 500);

  // --- LÓGICA DEL BOTÓN 'NO' QUE SE ESCAPA ---
  const dodgePhrases = [
    "¡Ese botón no! 😉",
    "¡Ni lo pienses! 🍷",
    "¡Esa opción está rota!",
    "¡El león no lo permite! 🦁",
    "¡Probá con el verde! 👉",
    "¡No te vayas nada! 🎶",
    "¡Es por el SÍ, corazón!",
    "¡Casi, pero no! 😂"
  ];
  let phraseIndex = 0;
  let isMoving = false;

  function dodgeButton(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (isMoving) return;
    isMoving = true;

    playDodgeSound();

    // Mensaje divertido emergente
    phraseIndex = (phraseIndex + 1) % dodgePhrases.length;
    dodgeFeedback.textContent = dodgePhrases[phraseIndex];
    dodgeFeedback.classList.remove('hidden');

    // Cambiar a posición fixed para que pueda moverse por la pantalla visible
    btnNo.style.position = 'fixed';

    const padding = 30;
    const btnRect = btnNo.getBoundingClientRect();
    const btnWidth = btnRect.width || 120;
    const btnHeight = btnRect.height || 50;

    // Dimensiones de la ventana
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    let randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    let randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    // Si tenemos la posición del cursor o toque, asegurarse de que no quede cerca del cursor
    if (e) {
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);

      if (clientX !== null && clientY !== null) {
        const dist = Math.hypot(randomX - clientX, randomY - clientY);
        if (dist < 180) {
          randomX = (clientX > window.innerWidth / 2) ? padding : maxX;
          randomY = (clientY > window.innerHeight / 2) ? padding : maxY;
        }
      }
    }

    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
    btnNo.style.transform = `scale(1.1) rotate(${(Math.random() * 16 - 8)}deg)`;

    setTimeout(() => {
      btnNo.style.transform = 'scale(1) rotate(0deg)';
      isMoving = false;
    }, 150);
  }

  // Detección por proximidad del cursor (se aleja ANTES de tocarlo)
  window.addEventListener('mousemove', (e) => {
    if (!stageQuestion.classList.contains('active')) return;

    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    // Si el cursor se acerca a menos de 85px, se escapa
    if (distance < 85) {
      dodgeButton(e);
    }
  });

  // Eventos adicionales en caso de movimiento rápido o mobile
  btnNo.addEventListener('mouseenter', dodgeButton);
  btnNo.addEventListener('mouseover', dodgeButton);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodgeButton(e);
  }, { passive: false });
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    dodgeButton(e);
  });

  // --- CLICK EN 'SÍ' (ETAPA 1 -> ETAPA 2) ---
  btnYes.addEventListener('click', () => {
    initAudio();
    playYesFanfare();

    // Efecto de corazones extra
    for (let i = 0; i < 20; i++) {
      setTimeout(createFloatingHeart, i * 60);
    }

    // Configurar fecha mínima para que sea hoy
    const today = new Date().toISOString().split('T')[0];
    inputDate.min = today;
    
    // Sugerir fecha por defecto (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    inputDate.value = tomorrow.toISOString().split('T')[0];

    // Ocultar botón 'No' para que no quede flotando
    btnNo.style.display = 'none';

    // Transición suave de etapas
    stageQuestion.classList.remove('active');
    stageQuestion.classList.add('hidden');

    stageLeo.classList.remove('hidden');
    stageLeo.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Selección rápida de lugares con los chips
  placeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playBlipSound(700, 0.05);
      inputPlace.value = chip.getAttribute('data-place');
      inputPlace.focus();
    });
  });

  // Formateador amigable de fecha (ej: Viernes 24 de Octubre de 2026)
  function formatFriendlyDate(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);

      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formatted = d.toLocaleDateString('es-AR', options);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (e) {
      return dateStr;
    }
  }

  // --- ENVÍO DEL FORMULARIO DE CITA (ETAPA 2 -> ETAPA 3) ---
  dateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedDate = inputDate.value;
    const selectedTime = inputTime.value;
    const selectedPlace = inputPlace.value.trim();
    const optionalNote = inputNote.value.trim();

    if (!selectedDate || !selectedTime || !selectedPlace) {
      alert('¡Por favor completá la fecha, hora y lugar para nuestra cita!');
      return;
    }

    const friendlyDate = formatFriendlyDate(selectedDate);

    // Completar el ticket final
    sumDate.textContent = `${friendlyDate} (${selectedDate})`;
    sumTime.textContent = `${selectedTime} hs`;
    sumPlace.textContent = selectedPlace;

    if (optionalNote) {
      sumNote.textContent = optionalNote;
      sumNoteLine.style.display = 'flex';
    } else {
      sumNoteLine.style.display = 'none';
    }

    // Armar el mensaje para WhatsApp
    let waMessage = `¡Hola! 🍷❤️ Acepté la invitación para tomar un vinito y charlar:\n\n` +
      `📅 Fecha: ${friendlyDate}\n` +
      `⏰ Hora: ${selectedTime} hs\n` +
      `📍 Lugar: ${selectedPlace}\n`;

    if (optionalNote) {
      waMessage += `💌 Mensaje: ${optionalNote}\n`;
    }

    waMessage += `\n¡Ay amor! 🦁🎶`;

    // URL codificada para WhatsApp Web / App
    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
    btnWhatsapp.href = waUrl;

    // Transición a la etapa final
    stageLeo.classList.remove('active');
    stageLeo.classList.add('hidden');

    stageFinal.classList.remove('hidden');
    stageFinal.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Tocar el gran jingle "¡AY AMOR!"
    playAyAmorJingle();

    // Lluvia de corazones festivos
    for (let i = 0; i < 35; i++) {
      setTimeout(createFloatingHeart, i * 40);
    }

    // Intento de apertura automática de WhatsApp tras una pequeña pausa
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);
  });

  // Botón para copiar los datos al portapapeles
  btnCopy.addEventListener('click', () => {
    const textToCopy = `🍷❤️ CITA CONFIRMADA:\n` +
      `📅 Fecha: ${sumDate.textContent}\n` +
      `⏰ Hora: ${sumTime.textContent}\n` +
      `📍 Lugar: ${sumPlace.textContent}\n` +
      (sumNote.textContent && sumNote.textContent !== '---' ? `💌 Nota: ${sumNote.textContent}\n` : '') +
      `¡Ay amor! 🦁`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      playBlipSound(1000, 0.08);
      const originalText = btnCopy.textContent;
      btnCopy.textContent = '✅ ¡Copiado al portapapeles!';
      setTimeout(() => {
        btnCopy.textContent = originalText;
      }, 2500);
    }).catch(() => {
      alert('Detalles de la cita:\n\n' + textToCopy);
    });
  });
});
