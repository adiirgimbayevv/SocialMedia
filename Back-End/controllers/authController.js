import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'not unique email' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, passwordHash]
        );

        res.status(201).json({ message: 'registration success', user: newUser.rows[0] });
    } catch (error) {
        next(error);
    }
};

// ... весь код до login ...

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'wrong email or password' });
        }

        const user = userResult.rows[0];

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'wrong email or password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // ← ИСПРАВЛЕНИЕ: возвращаем user
        res.json({ 
            message: 'success', 
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};

export { register, login };