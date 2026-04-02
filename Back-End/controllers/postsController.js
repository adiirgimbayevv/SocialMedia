const db = require('../config/db');

const getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT
                p.id, p.content, p.created_at, u.username
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

module.exports = { getPosts };