const db = require('../config/db');

// 1. READ ALL для конкретного поста (с пагинацией и JOIN)
const getPostComments = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT c.id, c.content, c.created_at, c.user_id, u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1
            ORDER BY c.created_at ASC
            LIMIT $2 OFFSET $3
        `;
        const result = await db.query(query, [postId, limit, offset]);

        const countResult = await db.query('SELECT COUNT(*) FROM comments WHERE post_id = $1', [postId]);
        const totalComments = parseInt(countResult.rows[0].count);

        res.json({
            data: result.rows,
            pagination: {
                totalItems: totalComments,
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
                itemsPerPage: limit
            }
        });
    } catch (error) {
        next(error);
    }
};

// 2. CREATE (комментарий к посту)
const createComment = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const result = await db.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
            [postId, userId, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// 3. UPDATE (только свой коммент)
const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const result = await db.query(
            'UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [content, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'Нет прав на изменение или комментарий не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// 4. DELETE (только свой коммент)
const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await db.query(
            'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'Нет прав на удаление или комментарий не найден' });
        }

        res.json({ message: 'Комментарий удален', deletedId: id });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPostComments, createComment, updateComment, deleteComment };