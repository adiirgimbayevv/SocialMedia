import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { toggleLike } from './controllers/likesController.js';
import { getCurrentUser, updateProfile } from './controllers/profileController.js';
import { getFollowing, getFollowers } from './controllers/followController.js';

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

// --- POSTS ---
app.get('/posts', verifyToken, getPosts);
app.get('/posts/:id', verifyToken, getPostById);
app.post('/posts', verifyToken, createPost);
app.put('/posts/:id', verifyToken, updatePost);
app.delete('/posts/:id', verifyToken, deletePost);

// --- COMMENTS (полный CRUD) ---
app.get('/posts/:postId/comments', verifyToken, getPostComments);
app.post('/posts/:postId/comments', verifyToken, createComment);
app.put('/comments/:id', verifyToken, updateComment);
app.delete('/comments/:id', verifyToken, deleteComment);

// --- LIKES ---
app.post('/posts/:postId/like', verifyToken, toggleLike);

// --- FOLLOW / UNFOLLOW ---
app.post('/users/:id/follow', verifyToken, followUser);
app.post('/users/:id/unfollow', verifyToken, unfollowUser);

// --- PROFILE (новое) ---
app.get('/users/me', verifyToken, getCurrentUser);           // ← добавь
app.put('/users/me', verifyToken, updateProfile);  

// --- FOLLOWERS / FOLLOWING ---
app.get('/users/me/following', verifyToken, getFollowing);   // ← добавь
app.get('/users/me/followers', verifyToken, getFollowers); // ← добавь

// --- ADMIN ROUTES ---
import { getAllPostsForAdmin } from './controllers/postsController.js';

// Только для чтения всех постов (для админ-панели)
app.get('/admin/posts', verifyToken, getAllPostsForAdmin);

// Глобальный обработчик ошибок
app.use(errorHandler);

// --- ЗАПУСК СЕРВЕРА ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`сервер запущен на порту ${PORT}`);
});