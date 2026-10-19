
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API du Blog - Serveur Modulaire Opérationnel (SoC)'
  });
});

app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);

(async () => {
  try {
     console.log('URI USED:', process.env.MONGODB_URI);
    await connectDB(process.env.MONGODB_URI);

    app.listen(PORT, () => {
      console.log(`Serveur modulaire en écoute sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erreur de démarrage du serveur :', err.message);
    process.exit(1);
  }
})();
