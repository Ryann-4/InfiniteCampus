require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (your frontend HTML, CSS, client JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// POST endpoint to receive messages from frontend and send to Discord
app.post('/send-message', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      return res.json({ message: 'Message sent!' });
    } else {
      return res.status(500).json({ error: 'Failed to send message to Discord' });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
