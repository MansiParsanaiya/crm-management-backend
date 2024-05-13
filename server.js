const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const branchRoutes = require('./routes/branchRoutes');
const studentRoutes = require('./routes/studentRoutes');
const feesRoutes = require('./routes/feesRoutes');
const courseRoutes = require('./routes/courseRoutes')
const projectRoutes = require('./routes/projectRoutes')
const taskRoutes = require('./routes/taskRoutes')

const connection = require('./connect');


var cors = require('cors');
const branchController = require('./controllers/BranchController');

const app = express();
app.use(cors())

// server port


// Connect to MongoDB
// mongoose.connect(process.env.DB_URL);

connection();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/account', accountRoutes);
app.use('/branch', branchRoutes);
app.use('/student', studentRoutes)
app.use('/fees', feesRoutes)
app.use('/courses', courseRoutes)
app.use('/project', projectRoutes)
app.use('/task', taskRoutes)

// Start the server
app.listen(() => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
