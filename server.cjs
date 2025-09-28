const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
const users = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    requires2FA: true
  },
  {
    id: '2',
    email: 'user@company.com',
    name: 'Regular User',
    requires2FA: false
  },
  {
    id: '3',
    email: 'blocked@company.com',
    name: 'Blocked User',
    requires2FA: false
  },
  {
    id: '4',
    email: 'expired@company.com',
    name: 'Expired User',
    requires2FA: false
  }
];

app.get('/api/users', (req, res) => {
  res.json({ users });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  setTimeout(() => {
    if (Math.random() < 0.1) {
      return res.status(500).json({
        success: false,
        message: 'Network error: Unable to connect to server'
      });
    }

    if (Math.random() < 0.05) {
      return res.status(500).json({
        success: false,
        message: 'Server error: Internal server error (500)'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (email === 'blocked@company.com') {
      return res.json({
        success: false,
        message: 'Account is blocked. Please contact support.'
      });
    }

    if (email === 'expired@company.com') {
      return res.json({
        success: false,
        message: 'Account has expired. Please renew your subscription.'
      });
    }

    if (email === 'maintenance@company.com') {
      return res.json({
        success: false,
        message: 'System is under maintenance. Please try again later.'
      });
    }

    if (email === 'ratelimit@company.com') {
      return res.json({
        success: false,
        message: 'Too many login attempts. Please try again in 15 minutes.'
      });
    }

    const user = users.find(u => u.email === email && password === 'test123');

    if (!user) {
      return res.json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      user,
      requires2FA: user.requires2FA
    });
  }, 1000);
});

app.post('/api/verify-2fa', (req, res) => {
  const { userId, code } = req.body;
  
  setTimeout(() => {
    if (code !== '131311') {
      return res.json({
        success: false,
        message: 'Invalid code'
      });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  }, 800);
});

app.post('/api/logout', (req, res) => {
  setTimeout(() => {
    res.json({ success: true });
  }, 300);
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📡 Available endpoints:`);
  console.log(`   GET  /api/users`);
  console.log(`   POST /api/login`);
  console.log(`   POST /api/verify-2fa`);
  console.log(`   POST /api/logout`);
});
