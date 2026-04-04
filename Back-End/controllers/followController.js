// backend/controllers/followController.js
import db from '../config/db.js';

const getFollowing = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await db.query(`
      SELECT u.id, u.username, u.email 
      FROM follows f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = $1
      ORDER BY f.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await db.query(`
      SELECT u.id, u.username, u.email 
      FROM follows f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = $1
      ORDER BY f.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export { getFollowing, getFollowers };