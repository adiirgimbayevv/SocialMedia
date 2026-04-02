require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { register, login } = require('./controllers/authController');
const { getPosts } = require('./controllers/postsController');
const verifyToken = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Auth
app.post('/auth/register', register);
app.post('/auth/login', login);

// Posts (Защищенный маршрут с пагинацией)
// Пример использования: GET /posts?page=1&limit=10
app.get('/posts', verifyToken, getPosts);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});