const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function registerUser({ name, email, password }) {
	const normalizedEmail = email.trim().toLowerCase()

	const [existingUsers] = await pool.execute(
		'SELECT id FROM users WHERE email = ?',
		[normalizedEmail]
	)

	if (existingUsers.length > 0) {
		const error = new Error('An account with this email already exists.')
		error.statusCode = 409
		throw error
	}

	const passwordHash = await bcrypt.hash(password, 12)

	const [result] = await pool.execute(
		'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
		[name.trim(), normalizedEmail, passwordHash]
	)

	return {
		id: result.insertId,
		name: name.trim(),
		email: normalizedEmail,
		role: 'user',
	}
}

async function loginUser({ email, password }) {
	const normalizedEmail = email.trim().toLowerCase()

	const [users] = await pool.execute(
		'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
		[normalizedEmail]
	)

	if (users.length === 0) {
		const error = new Error('Invalid email or password.')
		error.statusCode = 401
		throw error
	}

	const user = users[0]
	const passwordMatches = await bcrypt.compare(password, user.password_hash)

	if (!passwordMatches) {
		const error = new Error('Invalid email or password.')
		error.statusCode = 401
		throw error
	}

	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not configured.')
	}

	const token = jwt.sign(
		{ id: user.id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: '1d' }
	)

	return {
		token,
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
	}
}

module.exports = {
	registerUser,
	loginUser,
}
