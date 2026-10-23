const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

const register = async (req, res) => {
	try {
		const { name, email, password } = req.body || {}
		const normalizedName = String(name || '').trim()
		const normalizedEmail = String(email || '').trim().toLowerCase()

		if (!normalizedName || !normalizedEmail || !password) {
			return res.status(400).json({
				success: false,
				message: 'Name, email, and password are required.',
			})
		}

		if (normalizedName.length < 2 || normalizedName.length > 150) {
			return res.status(400).json({
				success: false,
				message: 'Name must be between 2 and 150 characters.',
			})
		}

		if (normalizedEmail.length > 255) {
			return res.status(400).json({
				success: false,
				message: 'Email address is too long.',
			})
		}

		if (String(password).length < 8) {
			return res.status(400).json({
				success: false,
				message: 'Password must contain at least 8 characters.',
			})
		}

		const [existingUsers] = await db.query(
			'SELECT id FROM bokifa_store.users WHERE email = ? LIMIT 1',
			[normalizedEmail],
		)

		if (existingUsers.length > 0) {
			return res.status(409).json({
				success: false,
				message: 'An account with this email already exists.',
			})
		}

		const passwordHash = await bcrypt.hash(password, 12)

		const [result] = await db.query(
			'INSERT INTO bokifa_store.users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
			[normalizedName, normalizedEmail, passwordHash, 'user'],
		)

		return res.status(201).json({
			success: true,
			message: 'Account created successfully.',
			user: {
				id: result.insertId,
				name: normalizedName,
				email: normalizedEmail,
				role: 'user',
			},
		})
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({
				success: false,
				message: 'An account with this email already exists.',
			})
		}

		console.error('Registration error:', error.message)

		return res.status(500).json({
			success: false,
			message: 'Unable to create your account right now.',
		})
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body || {}
		const normalizedEmail = String(email || '').trim().toLowerCase()

		if (!normalizedEmail || !password) {
			return res.status(400).json({
				success: false,
				message: 'Email and password are required.',
			})
		}

		if (!process.env.JWT_SECRET) {
			return res.status(500).json({
				success: false,
				message: 'Authentication is not configured.',
			})
		}

		const [users] = await db.query(
			'SELECT id, name, email, password_hash, role FROM bokifa_store.users WHERE email = ? LIMIT 1',
			[normalizedEmail],
		)

		if (users.length === 0) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password.',
			})
		}

		const user = users[0]
		const passwordMatches = await bcrypt.compare(
			password,
			user.password_hash,
		)

		if (!passwordMatches) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password.',
			})
		}

		const token = jwt.sign(
			{
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1d' },
		)

		return res.status(200).json({
			success: true,
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		})
	} catch (error) {
		console.error('Login error:', error.message)

		return res.status(500).json({
			success: false,
			message: 'Unable to sign in right now.',
		})
	}
}

module.exports = { register, login }
