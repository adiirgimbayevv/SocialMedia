// backend/controllers/postsController.js
import db from '../config/db.js';

// 1. READ ALL
const getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const userId = req.user.id;

        const query = `
            SELECT 
                p.id, 
                p.content, 
                p.created_at, 
                p.user_id, 
                u.username,
                COUNT(l.id) AS likes_count,
                BOOL_OR(l.user_id = $3) AS liked_by_user
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON l.post_id = p.id
            GROUP BY p.id, u.username
            ORDER BY p.created_at DESC
            LIMIT $1 OFFSET $2
        `;

        const result = await db.query(query, [limit, offset, userId]);

        const countResult = await db.query('SELECT COUNT(*) FROM posts');
        const totalPosts = parseInt(countResult.rows[0].count);

        res.json({
            data: result.rows,
            pagination: {
                totalItems: totalPosts,
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                itemsPerPage: limit
            }
        });
    } catch (error) {
        next(error);
    }
};

// 2. READ ONE
const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const query = `
            SELECT 
                p.id, 
                p.content, 
                p.created_at, 
                p.user_id, 
                u.username,
                COUNT(l.id) AS likes_count,
                BOOL_OR(l.user_id = $2) AS liked_by_user
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON l.post_id = p.id
            WHERE p.id = $1
            GROUP BY p.id, u.username
        `;

        const result = await db.query(query, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пост не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// 3. CREATE
const createPost = async (req, res, next) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;

        const result = await db.query(
            'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
            [userId, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// 4. UPDATE
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const result = await db.query(
            'UPDATE posts SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [content, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'Нет прав на изменение или пост не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// 5. DELETE
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await db.query(
            'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'Нет прав на удаление или пост не найден' });
        }

        res.json({ message: 'Пост успешно удален', deletedId: id });
    } catch (error) {
        next(error);
    }
};

// Для администратора — получить все посты всех пользователей
const getAllPostsForAdmin = async (req, res, next) => {
    try {
        // Проверяем что это действительно админ
        const userResult = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows[0]?.role !== 'admin') {
            return res.status(403).json({ error: 'Нет доступа' });
        }

        const result = await db.query(`
            SELECT posts.*, users.username 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            ORDER BY posts.created_at DESC
        `);

        res.json({ data: result.rows });
    } catch (error) {
        next(error);
    }
};

export { getPosts, getPostById, createPost, updatePost, deletePost, getAllPostsForAdmin };
