require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// This is your secret data, safe here
const VALID_CREDENTIALS = {
    "2030kallison@johnstonschools.org": "2030k",
    "44736@student.southeastpolk.org": "44736",
    "infinitecodehs@gmail.com": "infinite",
    "48161@student.southeastpolk.org": "48161",
    "55581@student.southeastpolk.org": "55581"
};

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (VALID_CREDENTIALS[username] && VALID_CREDENTIALS[username] === password) {
        // For simplicity, just send success (consider using sessions/JWT for real apps)
        return res.json({ success: true, message: 'Login successful' });
    }
    res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Message sending route
app.post('/send-message', async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Message content is required' });

    try {
        const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });
        if (response.ok) return res.json({ success: true, message: 'Message sent' });
        else return res.status(500).json({ success: false, message: 'Failed to send message' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));