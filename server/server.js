const express = require('express');
const app = express();
const morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();


app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(cors());

readdirSync('./routes').map((c) => app.use('/api', require('./routes/' + c)));

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.post('/api/users', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const user = await prisma.user.create({
      data: { email, name, password },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
