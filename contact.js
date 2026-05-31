// ── CONTACT FORM VALIDATION ─────────────────────────────────────

const form = document.getElementById('contactForm');
if (!form) return;

function validate() {
  let valid = true;

  const firstName = document.getElementById('firstName');
  const phone     = document.getElementById('phone');
  const subject   = document.getElementById('subject');
  const message   = document.getElementById('message');

  // First name
  const fnGroup = firstName.closest('.form-group');
  if (!firstName.value.trim()) {
    fnGroup.classList.add('error'); valid = false;
  } else { fnGroup.classList.remove('error'); }

  // Phone — must have at least 10 digits
  const phoneGroup = phone.closest('.form-group');
  const digits = phone.value.replace(/\D/g, '');
  if (digits.length < 10) {
    phoneGroup.classList.add('error'); valid = false;
  } else { phoneGroup.classList.remove('error'); }

  // Subject
  const subGroup = subject.closest('.form-group');
  if (!subject.value) {
    subGroup.classList.add('error'); valid = false;
  } else { subGroup.classList.remove('error'); }

  // Message
  const msgGroup = message.closest('.form-group');
  if (!message.value.trim() || message.value.trim().length < 10) {
    msgGroup.classList.add('error'); valid = false;
  } else { msgGroup.classList.remove('error'); }

  return valid;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;

  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // ── OPTION A: Formspree (recommended for static sites)
  // Replace YOUR_FORM_ID with your Formspree endpoint
  // https://formspree.io — free tier: 50 submissions/month
  const FORMSPREE_ID = 'YOUR_FORM_ID'; // e.g. 'xaybcdeg'

  if (FORMSPREE_ID !== 'YOUR_FORM_ID') {
    const data = new FormData(form);
    fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST', body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (res.ok) showSuccess();
      else throw new Error('Server error');
    })
    .catch(() => {
      btn.textContent = 'Send Message ✉';
      btn.disabled = false;
      alert('Something went wrong. Please try emailing us directly.');
    });
  } else {
    // Demo mode — show success after a short delay
    setTimeout(showSuccess, 800);
  }
});

function showSuccess() {
  form.querySelectorAll('.form-group, .form-row, button[type=submit]')
    .forEach(el => el.style.display = 'none');
  const success = document.getElementById('formSuccess');
  success.style.display = 'block';
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Live validation on blur
['firstName','phone','subject','message'].forEach(id => {
  document.getElementById(id)?.addEventListener('blur', validate);
});
