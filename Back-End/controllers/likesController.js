// backend/controllers/likesController.js
import db from '../config/db.js';

const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Проверяем, существует ли лайк
    const existing = await db.query(
      'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    let liked = false;

    if (existing.rows.length > 0) {
      // Удаляем лайк
      await db.query(
        'DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
        [postId, userId]
      );
      liked = false;
    } else {
      // Добавляем лайк
      await db.query(
        'INSERT INTO likes (post_id, user_id) VALUES ($1, $2)',
        [postId, userId]
      );
      liked = true;
    }

    // Возвращаем актуальное количество лайков
    const countResult = await db.query(
      'SELECT COUNT(*) as likes_count FROM likes WHERE post_id = $1',
      [postId]
    );

    const likes_count = parseInt(countResult.rows[0].likes_count);

    res.json({
      message: liked ? 'Лайк добавлен' : 'Лайк удалён',
      liked: liked,
      likes_count: likes_count
    });

  } catch (error) {
    next(error);
  }
};

export { toggleLike };