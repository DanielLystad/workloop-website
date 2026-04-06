(function() {
  var WEB3FORMS_KEY = '767f7c2f-a4c5-4561-8125-ae3544cf7bc8';

  var CONFIG = {
    botName: 'WorkLoop',
    greeting: 'Hei! Jeg er WorkLoops AI-assistent. Hvordan kan jeg hjelpe deg i dag?',
    placeholder: 'Skriv en melding...',
    suggestions: [
      'Hva tilbyr WorkLoop?',
      'Hva koster det?',
      'Book en gratis samtale'
    ]
  };

  var KB = [
    { keywords: ['hei', 'hallo', 'heisann', 'yo', 'morn'], response: 'Hei! Hyggelig at du tar kontakt. Hva kan jeg hjelpe deg med?' },
    { keywords: ['tilbyr', 'tjenester', 'hva gjor', 'hva gjør', 'produkter', 'losninger', 'løsninger'], response: 'WorkLoop hjelper bedrifter med:\n\n- **Automatisering** av repetitive oppgaver\n- **AI-løsninger** tilpasset din bedrift\n- **Integrasjoner** mellom systemer\n- **Rådgivning** om digitalisering\n\nVi tilpasser alltid løsningen til dine behov. Vil du ta en prat?' },
    { keywords: ['pris', 'kost', 'betale', 'billig', 'dyr', 'budsjett', 'investering'], response: 'Prisene våre avhenger av prosjektets omfang og kompleksitet. Vi gir alltid et tydelig og uforpliktende tilbud før du forplikter deg til noe.\n\nTa kontakt for en samtale, så finner vi den beste løsningen for ditt budsjett!' },
    { keywords: ['bestill', 'book', 'avtale', 'mote', 'møte', 'samtale', 'time'], response: '__BOOKING__' },
    { keywords: ['chatbot', 'chat', 'bot', 'kundeservice', 'agent'], response: 'Vi bygger skreddersydde AI-chatboter som kan:\n\n- Svare på kundehenvendelser 24/7\n- Booke timer og møter\n- Fange opp og kvalifisere leads\n- Integreres med kalendere, CRM og epost\n\nAlt tilpasset din bedrifts tone-of-voice og behov. Vil du høre mer?' },
    { keywords: ['automat', 'n8n', 'workflow', 'arbeidsflyt', 'effektiv'], response: 'Vi spesialiserer oss på automatisering av repetitive oppgaver ved hjelp av AI og verktøy som n8n, Power Automate og Azure.\n\nEksempler på hva vi automatiserer:\n- Fakturahåndtering og regnskap\n- Kundeoppfølging og lead-håndtering\n- Rapportering og datautveksling\n- Booking og timeplanlegging\n\nHva slags oppgaver bruker din bedrift mest tid på?' },
    { keywords: ['microsoft', '365', 'power', 'azure', 'teams', 'sharepoint'], response: 'Vi er eksperter på Microsoft 365-økosystemet! Vi hjelper bedrifter med å utnytte verktøyene de allerede betaler for:\n\n- **Power Automate** for arbeidsflyter\n- **Power Apps** for skreddersydde apper\n- **Copilot** og AI-integrasjoner\n- **Azure** for skalerbare løsninger\n\nMange bedrifter bruker bare en brøkdel av det Microsoft 365 kan tilby.' },
    { keywords: ['kontakt', 'ring', 'epost', 'mail', 'snakke'], response: 'Du kan nå oss på flere måter:\n\n**E-post:** kontakt@workloop.no\n**Nettside:** [workloop.no/contact](/contact)\n\nVi er tilgjengelige mandag til fredag, 08-16. Du kan også booke en gratis samtale direkte her i chatten!' },
    { keywords: ['hvem', 'teamet', 'grunder', 'om dere', 'bakgrunn'], response: 'WorkLoop er grunnlagt av et norsk team med bred erfaring innen teknologi:\n\n- **Tom Hynne** — CEO, 5+ år som IT-konsulent\n- **Daniel Lystad** — CTO, Microsoft 365-ekspert\n- **Gabriel Wollan** — Medgrunder, automatiseringsekspert\n- **Abdul-Rafeh Akvi** — Cybersecurity\n- **Philip Tordenskjold** — Marketing Manager\n\nSe mer om oss på forsiden!' },
    { keywords: ['sikker', 'gdpr', 'personvern', 'data', 'trygg'], response: 'Sikkerhet står høyest hos oss. Vi følger:\n\n- **GDPR** — All databehandling innenfor EOS\n- **Databehandleravtale** inngås med alle kunder\n- **Kryptering** av data i transit og i ro\n- Dedikert cybersecurity-ekspert på teamet\n\nDu kan automatisere med ro i magen.' }
  ];

  // Booking flow
  var booking = { active: false, step: 0, data: {} };
  var STEPS = [
    { key: 'name', prompt: 'La oss sette opp en gratis samtale! Hva heter du?', validate: function(v) { return v.length >= 2; }, error: 'Vennligst oppgi navnet ditt.' },
    { key: 'email', prompt: 'Hva er din e-postadresse?', validate: function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, error: 'Det ser ikke ut som en gyldig e-postadresse. Prøv igjen.' },
    { key: 'date', prompt: 'Hvilken dato passer? (skriv f.eks. **2026-04-01** eller **mandag**)', validate: function(v) { return parseDate(v) !== null; }, error: 'Jeg forstod ikke datoen. Skriv f.eks. **2026-04-01**, **mandag**, **tirsdag**, eller **neste uke**.' },
    { key: 'time', prompt: 'Hvilket tidspunkt? Vi har tider mellom 08:00 og 15:30 (30-min intervaller).', validate: function(v) { return parseTime(v) !== null; }, error: 'Velg et tidspunkt mellom 08:00 og 15:30. Skriv f.eks. **10:00** eller **14:30**.' }
  ];

  function parseDate(input) {
    var lower = input.toLowerCase().trim();
    var days = { 'mandag': 1, 'tirsdag': 2, 'onsdag': 3, 'torsdag': 4, 'fredag': 5 };
    var match = lower.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) { var d = new Date(input + 'T12:00:00'); if (d.getDay() >= 1 && d.getDay() <= 5) return input; return null; }
    for (var name in days) {
      if (lower.includes(name)) { var today = new Date(); var diff = days[name] - today.getDay(); if (diff <= 0) diff += 7; today.setDate(today.getDate() + diff); return today.toISOString().split('T')[0]; }
    }
    if (lower.includes('morgen')) { var tom = new Date(); tom.setDate(tom.getDate() + 1); if (tom.getDay() === 0) tom.setDate(tom.getDate() + 1); if (tom.getDay() === 6) tom.setDate(tom.getDate() + 2); return tom.toISOString().split('T')[0]; }
    if (lower.includes('neste uke')) { var nw = new Date(); var daysToMon = (8 - nw.getDay()) % 7; if (daysToMon === 0) daysToMon = 7; nw.setDate(nw.getDate() + daysToMon); return nw.toISOString().split('T')[0]; }
    return null;
  }

  function parseTime(input) {
    var match = input.trim().match(/^(\d{1,2})[:\.]?(\d{2})?$/);
    if (!match) return null;
    var h = parseInt(match[1]); var m = parseInt(match[2] || '0');
    if (m !== 0 && m !== 30) m = m < 15 ? 0 : 30;
    if (h < 8 || h > 15 || (h === 15 && m > 30)) return null;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  function formatDateNorwegian(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    var days = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
    var months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
    return days[d.getDay()] + ' ' + d.getDate() + '. ' + months[d.getMonth()];
  }

  function submitBooking(data, addMessage, showTyping, hideTyping) {
    showTyping();
    var formData = new FormData();
    formData.append('access_key', WEB3FORMS_KEY);
    formData.append('subject', 'Ny booking via chatbot — ' + data.name);
    formData.append('from_name', data.name);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('message', 'BOOKING VIA CHATBOT\n\nNavn: ' + data.name + '\nE-post: ' + data.email + '\nDato: ' + data.date + '\nTid: ' + data.time);
    fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
    .then(function(r) { return r.json(); })
    .then(function(json) {
      hideTyping();
      if (json.success) {
        addMessage('Bookingen er sendt! Her er oppsummeringen:\n\n- **Navn:** ' + data.name + '\n- **Dato:** ' + formatDateNorwegian(data.date) + '\n- **Tid:** ' + data.time + '\n\nVi bekrefter tidspunktet innen 1 virkedag på **' + data.email + '**.\n\nDu kan også [laste ned kalenderinvitasjonen](/contact#booking) fra kontaktsiden vår.', 'bot');
      } else { addMessage('Beklager, noe gikk galt. Du kan også booke via [kontaktsiden vår](/contact#booking).', 'bot'); }
    })
    .catch(function() { hideTyping(); addMessage('Tilkoblingsfeil. Prøv igjen, eller book via [kontaktsiden vår](/contact#booking).', 'bot'); });
  }

  function findResponse(message) {
    var lower = message.toLowerCase().replace(/[?!.,]/g, '');
    var bestMatch = null; var bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var score = 0;
      for (var j = 0; j < KB[i].keywords.length; j++) { if (lower.includes(KB[i].keywords[j])) score++; }
      if (score > bestScore) { bestScore = score; bestMatch = KB[i]; }
    }
    if (bestMatch) return bestMatch.response;
    return 'Beklager, jeg er ikke helt sikker på hva du mener. Kan du prøve å formulere det på en annen måte?\n\nDu kan også kontakte oss direkte på **kontakt@workloop.no** eller [booke en gratis samtale](/contact#booking).';
  }

  function formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br>');
  }

  /* ─── STYLES ─── */
  function injectStyles() {
    var s = document.createElement('style');
    s.textContent = [
      /* FAB */
      '.wl-fab{position:fixed;bottom:24px;right:24px;width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#1A2E44 0%,#243b57 100%);border:none;cursor:pointer;box-shadow:0 4px 16px rgba(26,46,68,.35),0 1px 3px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;z-index:9999;transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s ease}',
      '.wl-fab:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(26,46,68,.4),0 2px 6px rgba(0,0,0,.1)}',
      '.wl-fab:active{transform:scale(.95)}',
      '.wl-fab svg{width:26px;height:26px;fill:#fff;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .2s ease}',
      '.wl-fab svg{position:absolute}',
      '.wl-fab.open .ic-chat{transform:rotate(90deg) scale(0);opacity:0}',
      '.wl-fab:not(.open) .ic-close{transform:rotate(-90deg) scale(0);opacity:0}',
      '.wl-fab.open .ic-close{transform:rotate(0) scale(1);opacity:1}',
      '.wl-fab:not(.open) .ic-chat{transform:rotate(0) scale(1);opacity:1}',
      /* FAB pulse ring */
      '.wl-fab::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(61,155,225,.5);animation:wl-ring 2.5s ease-out infinite;pointer-events:none}',
      '.wl-fab.opened::after{display:none}',
      '@keyframes wl-ring{0%{transform:scale(1);opacity:.6}70%{transform:scale(1.35);opacity:0}100%{transform:scale(1.35);opacity:0}}',

      /* Window */
      '.wl-win{position:fixed;bottom:100px;right:24px;width:388px;max-height:540px;border-radius:20px;background:#fff;box-shadow:0 12px 48px rgba(0,0,0,.16),0 2px 8px rgba(0,0,0,.08);display:flex;flex-direction:column;overflow:hidden;z-index:9998;opacity:0;transform:translateY(20px) scale(.96);pointer-events:none;transition:opacity .3s cubic-bezier(.22,1,.36,1),transform .3s cubic-bezier(.22,1,.36,1)}',
      '.wl-win.vis{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}',
      '.wl-win.closing{opacity:0;transform:translateY(12px) scale(.97);transition-duration:.2s}',

      /* Header */
      '.wl-hdr{background:linear-gradient(135deg,#1A2E44 0%,#22364f 100%);padding:18px 20px;display:flex;align-items:center;gap:12px}',
      '.wl-hdr-av{width:40px;height:40px;border-radius:14px;background:rgba(61,155,225,.2);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;flex-shrink:0}',
      '.wl-hdr-av svg{width:20px;height:20px;fill:#3D9BE1}',
      '.wl-hdr-info h4{color:#fff;font-size:15px;font-weight:700;margin:0;line-height:1.2}',
      '.wl-hdr-info p{color:rgba(255,255,255,.5);font-size:12px;margin:2px 0 0}',
      '.wl-hdr-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;margin-left:auto;flex-shrink:0;box-shadow:0 0 6px rgba(74,222,128,.5)}',

      /* Messages */
      '.wl-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:260px;max-height:330px;scroll-behavior:smooth}',
      '.wl-msgs::-webkit-scrollbar{width:4px}',
      '.wl-msgs::-webkit-scrollbar-track{background:transparent}',
      '.wl-msgs::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:4px}',

      '.wl-msg{max-width:84%;padding:11px 15px;border-radius:18px;font-size:13.5px;line-height:1.65;word-wrap:break-word;opacity:0;transform:translateY(8px);animation:wl-msgIn .3s cubic-bezier(.22,1,.36,1) forwards}',
      '.wl-msg.bot{background:#f1f5f9;color:#1e293b;align-self:flex-start;border-bottom-left-radius:6px}',
      '.wl-msg.user{background:linear-gradient(135deg,#1A2E44 0%,#243b57 100%);color:#fff;align-self:flex-end;border-bottom-right-radius:6px}',
      '.wl-msg a{color:#3D9BE1;text-decoration:none;border-bottom:1px solid rgba(61,155,225,.3);transition:border-color .15s ease}',
      '.wl-msg a:hover{border-color:#3D9BE1}',
      '.wl-msg.user a{color:#93c5fd;border-bottom-color:rgba(147,197,253,.3)}',
      '.wl-msg strong{font-weight:600}',
      '@keyframes wl-msgIn{to{opacity:1;transform:translateY(0)}}',

      /* Typing */
      '.wl-typing{display:flex;gap:5px;padding:12px 16px;align-self:flex-start;opacity:0;animation:wl-msgIn .25s ease forwards}',
      '.wl-typing span{width:8px;height:8px;border-radius:50%;background:#94a3b8;animation:wl-dot 1.4s ease-in-out infinite}',
      '.wl-typing span:nth-child(2){animation-delay:.15s}',
      '.wl-typing span:nth-child(3){animation-delay:.3s}',
      '@keyframes wl-dot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-8px);opacity:1}}',

      /* Suggestions */
      '.wl-sug{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 12px}',
      '.wl-sug-btn{background:#f0f4ff;color:#1A2E44;border:1px solid #c7d7fa;border-radius:100px;padding:7px 15px;font-size:12.5px;font-weight:500;cursor:pointer;transition:all .2s ease;opacity:0;transform:translateY(6px);animation:wl-sugIn .25s ease forwards}',
      '.wl-sug-btn:nth-child(1){animation-delay:0s}',
      '.wl-sug-btn:nth-child(2){animation-delay:.06s}',
      '.wl-sug-btn:nth-child(3){animation-delay:.12s}',
      '.wl-sug-btn:hover{background:#dce6ff;transform:translateY(-1px);box-shadow:0 2px 8px rgba(61,155,225,.15)}',
      '.wl-sug-btn:active{transform:scale(.96)}',
      '@keyframes wl-sugIn{to{opacity:1;transform:translateY(0)}}',

      /* Input area */
      '.wl-input-area{border-top:1px solid #eef0f4;padding:12px 16px;display:flex;gap:8px;align-items:center;background:#fafbfc}',
      '.wl-input{flex:1;border:1.5px solid #e5e7eb;border-radius:24px;padding:10px 16px;font-size:13.5px;outline:none;font-family:inherit;background:#fff;transition:border-color .2s ease,box-shadow .2s ease}',
      '.wl-input:focus{border-color:#3D9BE1;box-shadow:0 0 0 3px rgba(61,155,225,.12)}',
      '.wl-send{width:40px;height:40px;border-radius:50%;background:#3D9BE1;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s ease;position:relative;overflow:hidden}',
      '.wl-send:hover{background:#2b8ad4;transform:scale(1.05)}',
      '.wl-send:active{transform:scale(.93)}',
      '.wl-send svg{width:17px;height:17px;fill:#fff;position:relative;left:1px}',
      '.wl-send:disabled{opacity:.5;cursor:default;transform:none}',

      /* Booking progress */
      '.wl-bk-prog{display:flex;gap:4px;padding:0 16px 4px}',
      '.wl-bk-step{flex:1;height:3px;border-radius:2px;background:#e5e7eb;transition:background .4s ease,transform .3s ease}',
      '.wl-bk-step.done{background:#3D9BE1}',
      '.wl-bk-step.active{background:#1A2E44;transform:scaleY(1.3)}',
      '.wl-bk-cancel{font-size:11px;color:#94a3b8;text-align:center;padding:2px 16px 8px;cursor:pointer;transition:color .15s ease}',
      '.wl-bk-cancel:hover{color:#64748b}',

      /* Reduced motion */
      '@media(prefers-reduced-motion:reduce){',
      '.wl-fab,.wl-fab svg,.wl-win,.wl-msg,.wl-typing,.wl-sug-btn,.wl-send,.wl-bk-step{animation:none!important;transition:none!important}',
      '.wl-msg,.wl-sug-btn{opacity:1;transform:none}',
      '.wl-fab::after{display:none}',
      '.wl-win.vis{opacity:1;transform:none}',
      '}',

      /* Mobile */
      '@media(max-width:480px){',
      '.wl-win{right:0;bottom:0;left:0;width:100%;max-height:100%;height:100%;border-radius:0}',
      '.wl-msgs{max-height:none;flex:1}',
      '.wl-fab{bottom:16px;right:16px}',
      '}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ─── WIDGET ─── */
  function createWidget() {
    var fab = document.createElement('button');
    fab.className = 'wl-fab';
    fab.setAttribute('aria-label', 'Åpne chat');
    fab.innerHTML = '<svg class="ic-chat" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7z"/></svg><svg class="ic-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

    var win = document.createElement('div');
    win.className = 'wl-win';
    win.innerHTML = [
      '<div class="wl-hdr">',
        '<div class="wl-hdr-av"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></div>',
        '<div class="wl-hdr-info"><h4>' + CONFIG.botName + '</h4><p>AI-assistent</p></div>',
        '<div class="wl-hdr-dot"></div>',
      '</div>',
      '<div class="wl-msgs" id="wlM"></div>',
      '<div id="wlBP"></div>',
      '<div class="wl-sug" id="wlS"></div>',
      '<div class="wl-input-area">',
        '<input type="text" class="wl-input" id="wlI" placeholder="' + CONFIG.placeholder + '" autocomplete="off">',
        '<button class="wl-send" id="wlSnd" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>',
      '</div>'
    ].join('');

    document.body.appendChild(fab);
    document.body.appendChild(win);

    var msgs = document.getElementById('wlM');
    var sugEl = document.getElementById('wlS');
    var progEl = document.getElementById('wlBP');
    var input = document.getElementById('wlI');
    var sendBtn = document.getElementById('wlSnd');
    var isOpen = false;
    var sugShown = true;

    function addMessage(text, type) {
      var msg = document.createElement('div');
      msg.className = 'wl-msg ' + type;
      msg.innerHTML = formatMessage(text);
      msgs.appendChild(msg);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function showTyping() {
      var t = document.createElement('div');
      t.className = 'wl-typing'; t.id = 'wlT';
      t.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(t);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function hideTyping() { var t = document.getElementById('wlT'); if (t) t.remove(); }

    function showSuggestions() {
      sugEl.innerHTML = '';
      CONFIG.suggestions.forEach(function(text) {
        var btn = document.createElement('button');
        btn.className = 'wl-sug-btn';
        btn.textContent = text;
        btn.addEventListener('click', function() { handleInput(text); });
        sugEl.appendChild(btn);
      });
    }

    function hideSuggestions() { if (sugShown) { sugEl.innerHTML = ''; sugShown = false; } }

    function updateProgress() {
      if (!booking.active) { progEl.innerHTML = ''; return; }
      var html = '<div class="wl-bk-prog">';
      for (var i = 0; i < STEPS.length; i++) {
        var cls = 'wl-bk-step';
        if (i < booking.step) cls += ' done';
        else if (i === booking.step) cls += ' active';
        html += '<div class="' + cls + '"></div>';
      }
      html += '</div><div class="wl-bk-cancel" id="wlBC">Avbryt booking</div>';
      progEl.innerHTML = html;
      document.getElementById('wlBC').addEventListener('click', function() {
        booking.active = false; booking.step = 0; booking.data = {};
        progEl.innerHTML = '';
        addMessage('Bookingen er avbrutt. Hva annet kan jeg hjelpe deg med?', 'bot');
      });
    }

    function startBooking() {
      booking.active = true; booking.step = 0; booking.data = {};
      updateProgress();
      addMessage(STEPS[0].prompt, 'bot');
    }

    function handleBookingStep(text) {
      var step = STEPS[booking.step];
      var value = text.trim();
      if (step.key === 'date') { var parsed = parseDate(value); if (!parsed) { addMessage(step.error, 'bot'); return; } value = parsed; }
      if (step.key === 'time') { var pt = parseTime(value); if (!pt) { addMessage(step.error, 'bot'); return; } value = pt; }
      if (!step.validate(value)) { addMessage(step.error, 'bot'); return; }
      booking.data[step.key] = value;
      booking.step++;
      updateProgress();
      if (booking.step >= STEPS.length) {
        booking.active = false; progEl.innerHTML = '';
        submitBooking(booking.data, addMessage, showTyping, hideTyping);
        return;
      }
      showTyping();
      setTimeout(function() { hideTyping(); addMessage(STEPS[booking.step].prompt, 'bot'); }, 400 + Math.random() * 300);
    }

    function handleInput(text) {
      if (!text.trim()) return;
      hideSuggestions();
      addMessage(text, 'user');
      input.value = '';
      if (booking.active) { handleBookingStep(text); return; }
      input.disabled = true; sendBtn.disabled = true;
      showTyping();
      setTimeout(function() {
        hideTyping();
        var response = findResponse(text);
        if (response === '__BOOKING__') {
          addMessage('Supert! La meg hjelpe deg med å booke en gratis samtale.', 'bot');
          setTimeout(function() { startBooking(); }, 500);
        } else { addMessage(response, 'bot'); }
        input.disabled = false; sendBtn.disabled = false; input.focus();
      }, 600 + Math.random() * 600);
    }

    fab.addEventListener('click', function() {
      isOpen = !isOpen;
      fab.classList.toggle('open', isOpen);
      if (isOpen) {
        fab.classList.add('opened');
        win.classList.remove('closing');
        win.classList.add('vis');
        if (msgs.children.length === 0) { addMessage(CONFIG.greeting, 'bot'); showSuggestions(); }
        input.focus();
      } else {
        win.classList.add('closing');
        setTimeout(function() { win.classList.remove('vis', 'closing'); }, 200);
      }
    });

    sendBtn.addEventListener('click', function() { handleInput(input.value); });
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') handleInput(input.value); });

    // Focus trap: keep Tab within chatbot when open
    win.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        isOpen = false;
        fab.classList.remove('open');
        win.classList.add('closing');
        setTimeout(function() { win.classList.remove('vis', 'closing'); }, 200);
        fab.focus();
        return;
      }
      if (e.key === 'Tab') {
        var focusable = win.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"]), a[href]');
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { injectStyles(); createWidget(); });
  } else { injectStyles(); createWidget(); }
})();
