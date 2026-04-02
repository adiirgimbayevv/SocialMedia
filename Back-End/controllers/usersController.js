// controllers/usersController.js
import db from '../config/db.js';

const followUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const followerId = req.user.id;

    await db.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [followerId, id]
    );

    res.json({ message: 'Подписка успешна' });
  } catch (error) {
    next(error);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const followerId = req.user.id;

    await db.query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, id]
    );

    res.json({ message: 'Отписка успешна' });
  } catch (error) {
    next(error);
  }
};

export { followUser, unfollowUser };