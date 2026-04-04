// backend/controllers/profileController.js
import db from '../config/db.js';

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT id, username, email, created_at 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    // Проверяем уникальность username и email
    if (username) {
      const existingUser = await db.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, userId]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Имя пользователя уже занято' });
      }
    }

    if (email) {
      const existingEmail = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
      if (existingEmail.rows.length > 0) {
        return res.status(400).json({ error: 'Email уже занят' });
      }
    }

    const result = await db.query(
      `UPDATE users 
       SET username = COALESCE($1, username),
           email = COALESCE($2, email)
       WHERE id = $3 
       RETURNING id, username, email`,
      [username, email, userId]
    );

    res.json({ message: 'Профиль обновлён', user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export { getCurrentUser, updateProfile };