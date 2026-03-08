const express = require('express');
const authRoutes = require('./routes/auth.routes.js');
const interviewRoutes = require("./routes/interview.routes.js")
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use('/api/auth', authRoutes)
app.use('/api/interview', interviewRoutes)
module.exports = app;