const db = require('../config/db');

// 1. READ ALL (с пагинацией и JOIN)
const getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT p.id, p.content, p.created_at, p.user_id, u.username
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const result = await db.query(query, [limit, offset]);

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

// 2. READ ONE (с JOIN)
const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT p.id, p.content, p.created_at, p.user_id, u.username
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = $1
        `;
        const result = await db.query(query, [id]);

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
        const userId = req.user.id; // Берем id из токена (authMiddleware)

        const result = await db.query(
            'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
            [userId, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// 4. UPDATE (только свой пост)
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

// 5. DELETE (только свой пост)
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

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };