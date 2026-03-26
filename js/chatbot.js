(function() {
  const CONFIG = {
    botName: 'WorkLoop',
    greeting: 'Hei! Jeg er WorkLoops AI-assistent. Hvordan kan jeg hjelpe deg i dag?',
    placeholder: 'Skriv en melding...',
    suggestions: [
      'Hva tilbyr WorkLoop?',
      'Hva koster det?',
      'Bestill en gratis AI-audit'
    ]
  };

  const KB = [
    {
      keywords: ['hei', 'hallo', 'heisann', 'yo', 'morn'],
      response: 'Hei! Hyggelig at du tar kontakt. Hva kan jeg hjelpe deg med?'
    },
    {
      keywords: ['tilbyr', 'tjenester', 'hva gjor', 'hva gjør', 'produkter', 'losninger', 'løsninger'],
      response: 'WorkLoop tilbyr tre hovedtjenester:\n\n**AI-Audit** (gratis) — Vi analyserer bedriften din og identifiserer hvor AI og automatisering kan spare deg mest tid og penger.\n\n**AI-Sprint** — Et fastsatt prosjekt der vi bygger og implementerer en konkret AI-losning for deg pa 2-4 uker.\n\n**AI-Retainer** — Lopende partnerskap der vi drifter, optimerer og utvider AI-losningene dine over tid.\n\nVil du vite mer om noen av disse?'
    },
    {
      keywords: ['pris', 'kost', 'betale', 'billig', 'dyr', 'budsjett', 'investering'],
      response: 'Prisene vare avhenger av prosjektets omfang:\n\n**AI-Audit** — Gratis og uforpliktende.\n**AI-Sprint** — Fra kr 14 900 (engangsbelop).\n**AI-Retainer** — Fra kr 1 990/mnd for drift og support.\n\nVi gir alltid et tydelig pristilbud for du forplikter deg til noe. Vil du bestille en gratis AI-audit for a finne ut hva som passer?'
    },
    {
      keywords: ['audit', 'gratis', 'analyse', 'kartlegging', 'vurdering'],
      response: 'Var gratis AI-audit er det beste stedet a starte! Vi ser pa bedriften din og identifiserer konkrete muligheter for automatisering.\n\nDu kan bestille en audit her: [workloop.no/contact](/contact)\n\nIngen forpliktelser — bare en arlig vurdering av hva AI kan gjore for deg.'
    },
    {
      keywords: ['chatbot', 'chat', 'bot', 'kundeservice', 'agent'],
      response: 'Vi bygger skreddersydde AI-chatboter som kan:\n\n- Svare pa kundehenvendelser 24/7\n- Booke timer og mater\n- Fange opp og kvalifisere leads\n- Integreres med kalendere, CRM og epost\n\nAlt tilpasset din bedrifts tone-of-voice og behov. Vil du hore mer?'
    },
    {
      keywords: ['automat', 'n8n', 'workflow', 'arbeidsflyt', 'effektiv'],
      response: 'Vi spesialiserer oss pa automatisering av repetitive oppgaver ved hjelp av AI og verktoy som n8n, Power Automate og Azure.\n\nEksempler pa hva vi automatiserer:\n- Fakturahendtering og regnskap\n- Kundeoppfolging og lead-hendtering\n- Rapportering og datautveksling\n- Booking og timeplanlegging\n\nHva slags oppgaver bruker din bedrift mest tid pa?'
    },
    {
      keywords: ['microsoft', '365', 'power', 'azure', 'teams', 'sharepoint'],
      response: 'Vi er eksperter pa Microsoft 365-okosystemet! Vi hjelper bedrifter med a utnytte verktoyene de allerede betaler for:\n\n- **Power Automate** for arbeidsflyter\n- **Power Apps** for skreddersydde apper\n- **Copilot** og AI-integrasjoner\n- **Azure** for skalerbare losninger\n\nMange bedrifter bruker bare en brodel av det Microsoft 365 kan tilby.'
    },
    {
      keywords: ['kontakt', 'ring', 'epost', 'mail', 'snakke', 'mote', 'mote'],
      response: 'Du kan na oss pa flere mater:\n\n**E-post:** post@workloop.no\n**Nettside:** [workloop.no/contact](/contact)\n\nVi er tilgjengelige mandag til fredag, 08-16. Bestill gjerne en gratis AI-audit sa tar vi en uforpliktende samtale!'
    },
    {
      keywords: ['hvem', 'teamet', 'grunder', 'om dere', 'bakgrunn'],
      response: 'WorkLoop er grunnlagt av et norsk team med bred erfaring innen teknologi:\n\n- **Tom Hynne** — CEO, 5+ ar som IT-konsulent\n- **Daniel Lystad** — CTO, Microsoft 365-ekspert\n- **Gabriel Wollan** — Medgrunder, automatiseringsekspert\n- **Abdul-Rafeh Akvi** — Cybersecurity\n- **Philip Tordenskjold** — Marketing Manager\n\nVi er akkurat store nok til a levere — og akkurat sma nok til at du alltid vet hvem du snakker med.'
    },
    {
      keywords: ['sikker', 'gdpr', 'personvern', 'data', 'trygg'],
      response: 'Sikkerhet star hoyest hos oss. Vi folger:\n\n- **GDPR** — All databehandling innenfor EOS\n- **Databehandleravtale** inngars med alle kunder\n- **Kryptering** av data i transit og i ro\n- Dedikert cybersecurity-ekspert pa teamet\n\nDu kan automatisere med ro i magen.'
    }
  ];

  function findResponse(message) {
    const lower = message.toLowerCase().replace(/[?!.,]/g, '');
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of KB) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (lower.includes(kw)) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch) return bestMatch.response;

    return 'Beklager, jeg er ikke helt sikker pa hva du mener. Kan du prove a formulere det pa en annen mate?\n\nDu kan ogsa kontakte oss direkte pa **post@workloop.no** eller [bestille en gratis AI-audit](/contact).';
  }

  function formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#3D9BE1;text-decoration:underline;">$1</a>')
      .replace(/\n/g, '<br>');
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .wl-chat-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #1A2E44;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .wl-chat-fab:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 28px rgba(0,0,0,0.3);
      }
      .wl-chat-fab svg {
        width: 28px;
        height: 28px;
        fill: white;
        transition: transform 0.2s ease;
      }
      .wl-chat-fab.open svg.icon-chat { display: none; }
      .wl-chat-fab:not(.open) svg.icon-close { display: none; }

      .wl-chat-window {
        position: fixed;
        bottom: 100px;
        right: 24px;
        width: 380px;
        max-height: 520px;
        border-radius: 16px;
        background: #fff;
        box-shadow: 0 8px 40px rgba(0,0,0,0.18);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 9998;
        opacity: 0;
        transform: translateY(16px) scale(0.95);
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
      }
      .wl-chat-window.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .wl-chat-header {
        background: #1A2E44;
        padding: 18px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .wl-chat-header-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #3D9BE1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .wl-chat-header-avatar svg {
        width: 20px;
        height: 20px;
        fill: white;
      }
      .wl-chat-header-info h4 {
        color: #fff;
        font-size: 15px;
        font-weight: 700;
        margin: 0;
        line-height: 1.2;
      }
      .wl-chat-header-info p {
        color: rgba(255,255,255,0.55);
        font-size: 12px;
        margin: 2px 0 0;
      }
      .wl-chat-header-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #4ade80;
        margin-left: auto;
        flex-shrink: 0;
      }

      .wl-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-height: 260px;
        max-height: 320px;
      }

      .wl-msg {
        max-width: 85%;
        padding: 10px 14px;
        border-radius: 14px;
        font-size: 13px;
        line-height: 1.6;
        word-wrap: break-word;
      }
      .wl-msg.bot {
        background: #f1f5f9;
        color: #1e293b;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
      }
      .wl-msg.user {
        background: #1A2E44;
        color: #fff;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      .wl-msg a {
        color: #3D9BE1;
        text-decoration: underline;
      }
      .wl-msg.user a {
        color: #93c5fd;
      }

      .wl-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 0 16px 12px;
      }
      .wl-suggestion-btn {
        background: #eef4ff;
        color: #1A2E44;
        border: 1px solid #c7d7fa;
        border-radius: 100px;
        padding: 6px 14px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .wl-suggestion-btn:hover {
        background: #dbe8ff;
      }

      .wl-chat-input-area {
        border-top: 1px solid #e5e7eb;
        padding: 12px 16px;
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .wl-chat-input {
        flex: 1;
        border: 1px solid #e5e7eb;
        border-radius: 24px;
        padding: 10px 16px;
        font-size: 13px;
        outline: none;
        font-family: inherit;
        transition: border-color 0.15s ease;
      }
      .wl-chat-input:focus {
        border-color: #3D9BE1;
      }
      .wl-chat-send {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #3D9BE1;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.15s ease;
      }
      .wl-chat-send:hover {
        background: #2b8ad4;
      }
      .wl-chat-send svg {
        width: 18px;
        height: 18px;
        fill: white;
      }

      .wl-typing {
        display: flex;
        gap: 4px;
        padding: 10px 14px;
        align-self: flex-start;
      }
      .wl-typing span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #94a3b8;
        animation: wl-bounce 1.2s ease-in-out infinite;
      }
      .wl-typing span:nth-child(2) { animation-delay: 0.15s; }
      .wl-typing span:nth-child(3) { animation-delay: 0.3s; }
      @keyframes wl-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-6px); }
      }

      @media (max-width: 480px) {
        .wl-chat-window {
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          max-height: 100%;
          height: 100%;
          border-radius: 0;
        }
        .wl-chat-messages {
          max-height: none;
          flex: 1;
        }
        .wl-chat-fab {
          bottom: 16px;
          right: 16px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createWidget() {
    // FAB button
    const fab = document.createElement('button');
    fab.className = 'wl-chat-fab';
    fab.setAttribute('aria-label', 'Apne chat');
    fab.innerHTML = `
      <svg class="icon-chat" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7z"/></svg>
      <svg class="icon-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    `;

    // Chat window
    const win = document.createElement('div');
    win.className = 'wl-chat-window';
    win.innerHTML = `
      <div class="wl-chat-header">
        <div class="wl-chat-header-avatar">
          <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <div class="wl-chat-header-info">
          <h4>${CONFIG.botName}</h4>
          <p>AI-assistent</p>
        </div>
        <div class="wl-chat-header-dot"></div>
      </div>
      <div class="wl-chat-messages" id="wlMessages"></div>
      <div class="wl-suggestions" id="wlSuggestions"></div>
      <div class="wl-chat-input-area">
        <input type="text" class="wl-chat-input" id="wlInput" placeholder="${CONFIG.placeholder}" autocomplete="off">
        <button class="wl-chat-send" id="wlSend" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(win);

    const messages = document.getElementById('wlMessages');
    const suggestionsEl = document.getElementById('wlSuggestions');
    const input = document.getElementById('wlInput');
    const sendBtn = document.getElementById('wlSend');
    let isOpen = false;
    let suggestionsShown = true;

    function addMessage(text, type) {
      const msg = document.createElement('div');
      msg.className = 'wl-msg ' + type;
      msg.innerHTML = formatMessage(text);
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'wl-typing';
      typing.id = 'wlTyping';
      typing.innerHTML = '<span></span><span></span><span></span>';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
      const t = document.getElementById('wlTyping');
      if (t) t.remove();
    }

    function showSuggestions() {
      suggestionsEl.innerHTML = '';
      CONFIG.suggestions.forEach(function(text) {
        const btn = document.createElement('button');
        btn.className = 'wl-suggestion-btn';
        btn.textContent = text;
        btn.addEventListener('click', function() { sendMessage(text); });
        suggestionsEl.appendChild(btn);
      });
    }

    function hideSuggestions() {
      if (suggestionsShown) {
        suggestionsEl.innerHTML = '';
        suggestionsShown = false;
      }
    }

    function sendMessage(text) {
      if (!text.trim()) return;
      hideSuggestions();
      addMessage(text, 'user');
      input.value = '';
      input.disabled = true;

      showTyping();
      var delay = 600 + Math.random() * 800;
      setTimeout(function() {
        hideTyping();
        var response = findResponse(text);
        addMessage(response, 'bot');
        input.disabled = false;
        input.focus();
      }, delay);
    }

    fab.addEventListener('click', function() {
      isOpen = !isOpen;
      fab.classList.toggle('open', isOpen);
      win.classList.toggle('visible', isOpen);
      if (isOpen) {
        if (messages.children.length === 0) {
          addMessage(CONFIG.greeting, 'bot');
          showSuggestions();
        }
        input.focus();
      }
    });

    sendBtn.addEventListener('click', function() {
      sendMessage(input.value);
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendMessage(input.value);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { injectStyles(); createWidget(); });
  } else {
    injectStyles();
    createWidget();
  }
})();
