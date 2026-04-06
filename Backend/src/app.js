const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"].filter(Boolean),
    credentials: true
}));

// require all the routes here
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.route');

// using all the routes here
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

app.get('/', (req, res) => {
    res.send('PrepAI Backend is running!');
});

module.exports = app;