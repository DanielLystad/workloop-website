const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Contact form API endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, company, phone, message, interest } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Mangler påkrevde felt.' });
  }

  console.log('=== Ny kontakthenvendelse ===');
  console.log(`Navn:      ${name}`);
  console.log(`E-post:    ${email}`);
  console.log(`Bedrift:   ${company || '—'}`);
  console.log(`Telefon:   ${phone || '—'}`);
  console.log(`Interesse: ${interest || '—'}`);
  console.log(`Melding:   ${message}`);
  console.log(`Tidspunkt: ${new Date().toISOString()}`);
  console.log('============================');

  res.json({ ok: true, message: 'Takk! Vi tar kontakt innen 1 virkedag.' });
});

// Catch-all: serve index.html for HTML routes (SPA-style fallback for clean URLs)
app.get('*', (req, res) => {
  const requestedFile = req.path.replace(/^\//, '') || 'index.html';
  const filePath = path.join(__dirname, 'public', requestedFile);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
});

app.listen(PORT, () => {
  console.log(`WorkLoop AS nettsted kjører på http://localhost:${PORT}`);
});
