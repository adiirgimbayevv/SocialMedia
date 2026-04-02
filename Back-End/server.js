import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

// --- ИМПОРТЫ КОНТРОЛЛЕРОВ ---
import { register, login } from './controllers/authController.js';
import {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} from './controllers/postsController.js';
import {
    getPostComments,
    createComment,
    updateComment,
    deleteComment
} from './controllers/commentsController.js';

// НОВЫЙ ИМПОРТ ДЛЯ FOLLOW/UNFOLLOW
import { followUser, unfollowUser } from './controllers/usersController.js';

// --- ИМПОРТЫ MIDDLEWARE ---
import verifyToken from './middlewares/authMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';

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
//        НОВЫЕ МАРШРУТЫ ДЛЯ ПОДПИСОК (FOLLOW)
// ==========================================

// --- USERS (FOLLOW/UNFOLLOW) ---
app.post('/users/:id/follow', verifyToken, followUser);
app.post('/users/:id/unfollow', verifyToken, unfollowUser);


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