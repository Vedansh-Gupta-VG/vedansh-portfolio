// ============================================================================
// CONTACT SECTION — terminal-style contact form
// ----------------------------------------------------------------------------
// This form uses EmailJS (https://www.emailjs.com) to actually deliver the
// message to Vedansh's inbox, without needing a custom backend server.
// EmailJS's free tier sends the request straight from the browser to your
// connected email account (Gmail etc.) using a public key that is SAFE to
// expose in client-side code — it can only send through the template you
// configured, it cannot read your inbox or send arbitrary emails elsewhere.
//
// SETUP (one-time, do this before deploying):
//   1. Create a free account at https://www.emailjs.com
//   2. Add an Email Service (connect your Gmail: vedanshgupta.off@gmail.com)
//   3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
//   4. Copy your Public Key, Service ID, and Template ID
//   5. Paste them into the CONFIG block below
//   6. Add a reCAPTCHA/hCaptcha block on the EmailJS template settings page
//      to stop bots from spamming the form (optional but recommended)
// ============================================================================
(() => {
  // ---- CONFIG: replace these three placeholders with your real EmailJS IDs ----
  const EMAILJS_PUBLIC_KEY = 'zU7SjG41jJWpfw3aW';
  const EMAILJS_SERVICE_ID = 'service_8yzzsha';
  const EMAILJS_TEMPLATE_ID = 'template_iz2kq0e';

  const form = document.getElementById('contactForm');
  if (!form) return;

  // Initialize EmailJS once the SDK script (loaded in index.html) is available.
  // blockHeadless rejects requests coming from headless browsers (a common
  // way spam scripts submit forms without a real user present) — this is
  // enforced by EmailJS itself, so it can't be bypassed the way a purely
  // client-side check could. Not adding limitRate here since it would just
  // duplicate the 60-second cooldown already enforced below.
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY, blockHeadless: true });
  }

  // 60-second submission cooldown: stops a script (or an impatient double-click)
  // from firing off repeated sends. Stored in localStorage rather than a plain
  // JS variable so it survives a page refresh too — a bot can't bypass it by
  // just reloading the page and resubmitting.
  const COOLDOWN_MS = 60 * 1000;
  const COOLDOWN_KEY = 'contact_last_sent_at';

  function cooldownRemainingMs() {
    const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    const remaining = COOLDOWN_MS - (Date.now() - last);
    return remaining > 0 ? remaining : 0;
  }

  function markSent() {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  }

  const nameField = document.getElementById('contactName');
  const emailField = document.getElementById('contactEmail');
  const messageField = document.getElementById('contactMessage');
  const honeypotField = document.getElementById('contactWebsite');
  const sendBtn = document.getElementById('contactSendBtn');
  const status = document.getElementById('contactStatus');

  // Auto-grow the message textarea to fit its content, so typing a long
  // message pushes the box taller instead of trapping the text behind an
  // internal scrollbar. Runs on every keystroke and once on page load in
  // case the field starts pre-filled.
  function autosizeMessage() {
    messageField.style.height = 'auto';
    messageField.style.height = messageField.scrollHeight + 'px';
  }
  messageField.addEventListener('input', autosizeMessage);
  autosizeMessage();

  const IDLE_HTML = 'vedansh@portfolio:~$ Waiting for your message... <span class="contact__terminal-cursor"></span>';

  // Basic client-side email shape check (not a substitute for server-side validation,
  // but good enough to catch typos before wasting a send attempt)
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function clearErrors() {
    [nameField, emailField, messageField].forEach(f => f.closest('.contact__field').classList.remove('has-error'));
  }

  // Returns false and flags empty/invalid fields if the form isn't ready to submit
  function validate() {
    clearErrors();
    let valid = true;
    if (!nameField.value.trim()) { nameField.closest('.contact__field').classList.add('has-error'); valid = false; }
    if (!emailField.value.trim() || !isValidEmail(emailField.value.trim())) { emailField.closest('.contact__field').classList.add('has-error'); valid = false; }
    if (!messageField.value.trim()) { messageField.closest('.contact__field').classList.add('has-error'); valid = false; }
    return valid;
  }

  // Helper to append one line of terminal-style output
  function line(text, cls) {
    const div = document.createElement('div');
    div.className = 'status-line' + (cls ? ' ' + cls : '');
    div.innerHTML = text;
    return div;
  }

  function showError(message) {
    status.innerHTML = '';
    status.appendChild(line('vedansh@portfolio:~$ send_message()'));
    status.appendChild(line('&#10007; ERROR: ' + (message || 'Please complete all required fields.'), 'status-error'));
    setTimeout(() => { status.innerHTML = IDLE_HTML; }, 3200);
  }

  // Plays the terminal "sending" animation while the real EmailJS request
  // happens in the background, then reveals success or failure once it resolves
  async function runSendSequence(name, email, message) {
    status.innerHTML = '';
    status.appendChild(line('vedansh@portfolio:~$ send_message()'));

    const steps = [
      '&gt; Initializing secure connection...',
      '&gt; Validating input............... <span class="status-ok">OK</span>',
      '&gt; Encrypting message............ <span class="status-ok">OK</span>',
      '&gt; Sending message............... <span class="status-ok">&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608; 100%</span>',
    ];

    // Kick off the real network request in parallel with the visual animation
    const sendPromise = (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY')
      ? emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: name,
          from_email: email,
          message: message,
        })
      : Promise.reject(new Error('EmailJS is not configured yet'));

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 320));
      status.appendChild(line(step));
    }

    let sent = true;
    try {
      await sendPromise;
    } catch (err) {
      sent = false;
      console.error('Contact form send failed:', err);
    }

    await new Promise(r => setTimeout(r, 400));
    status.innerHTML = '';

    if (sent) {
      markSent();
      status.appendChild(line('&#10003; Message sent successfully!', 'status-success'));
      status.appendChild(line('&nbsp;'));
      status.appendChild(line(`Thank you for reaching out, ${name}.`, 'status-muted'));
      status.appendChild(line("I'll get back to you as soon as possible.", 'status-muted'));
    } else {
      status.appendChild(line('&#10007; Message failed to send.', 'status-error'));
      status.appendChild(line('&nbsp;'));
      status.appendChild(line('Please try again, or email me directly at vedanshgupta.off@gmail.com', 'status-muted'));
    }
    status.appendChild(line('&nbsp;'));
    status.appendChild(line('vedansh@portfolio:~$ <span class="contact__terminal-cursor"></span>'));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check: a real visitor can never see or fill this field, so
    // any value here means a bot filled every input it could find. Drop the
    // submission immediately, before validation and before EmailJS is ever
    // called — this costs zero EmailJS quota and sends no email.
    if (honeypotField && honeypotField.value.trim()) {
      form.reset();
      return;
    }

    if (!validate()) { showError(); return; }

    // Cooldown check: block a resend within 60s of the last successful send,
    // and tell the visitor how many seconds are left instead of a generic error.
    const remaining = cooldownRemainingMs();
    if (remaining > 0) {
      const seconds = Math.ceil(remaining / 1000);
      showError(`Please wait ${seconds}s before sending another message.`);
      return;
    }

    sendBtn.disabled = true;
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();
    await runSendSequence(name, email, message);
    sendBtn.disabled = false;
    form.reset();
    autosizeMessage();
  });
})();
