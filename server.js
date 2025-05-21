require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./'));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email route
app.get('/test-email', (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Test Email',
    text: 'This is a test email to verify the email configuration.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending test email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send test email', error });
    }

    console.log('Test email sent:', info.response);
    res.status(200).json({ success: true, message: 'Test email sent successfully!' });
  });
});

// API endpoint for form submission
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields' });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Your email where you want to receive messages
    subject: `Portfolio Contact from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}

      Message:
      ${message}
    `,
    replyTo: email,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send email', error });
    }

    console.log('Email sent:', info.response);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  });
});

const port = process.env.PORT || PORT;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
