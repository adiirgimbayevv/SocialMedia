require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- ИМПОРТЫ КОНТРОЛЛЕРОВ ---
const { register, login } = require('./controllers/authController');
const {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} = require('./controllers/postsController');
const {
    getPostComments,
    createComment,
    updateComment,
    deleteComment
} = require('./controllers/commentsController');

// --- ИМПОРТЫ MIDDLEWARE ---
const verifyToken = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// --- БАЗОВЫЕ НАСТРОЙКИ ---
app.use(cors());
app.use(express.json());

// ==========================================
//                 МАРШРУТЫ
// ==========================================

// --- AUTH ---
app.post('/auth/register', register);
app.post('/auth/login', login);

// --- POSTS (CRUD) ---
// Пример получения с пагинацией: GET /posts?page=1&limit=10
app.get('/posts', verifyToken, getPosts);
app.get('/posts/:id', verifyToken, getPostById);
app.post('/posts', verifyToken, createPost);
app.put('/posts/:id', verifyToken, updatePost);
app.delete('/posts/:id', verifyToken, deletePost);

// --- COMMENTS (CRUD) ---
// Чтение и создание привязаны к конкретному посту
// Пример получения с пагинацией: GET /posts/1/comments?page=1&limit=10
app.get('/posts/:postId/comments', verifyToken, getPostComments);
app.post('/posts/:postId/comments', verifyToken, createComment);

// Обновление и удаление идут по ID самого комментария
app.put('/comments/:id', verifyToken, updateComment);
app.delete('/comments/:id', verifyToken, deleteComment);


// ==========================================
//           ОБРАБОТКА ОШИБОК
// ==========================================
// Глобальный обработчик должен идти в самом конце списка app.use()
app.use(errorHandler);

// --- ЗАПУСК СЕРВЕРА ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`сервер запущен на порту ${PORT}`);
});