
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

const router = express.Router()

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body || {}

		if (!email?.trim() || !password) {
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

		const [result] = await pool.query('CALL GetAdminByEmail(?)', [
			email.trim().toLowerCase(),
		])

		const admin = result?.[0]?.[0]

		if (!admin) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password.',
			})
		}

		const passwordMatches = await bcrypt.compare(
			password,
			admin.password,
		)

		if (!passwordMatches) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password.',
			})
		}

		const token = jwt.sign(
			{
				id: admin.id,
				email: admin.email,
				role: 'admin',
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1d' },
		)

		return res.json({
			success: true,
			message: 'Login successful.',
			token,
			admin: {
				id: admin.id,
				name: admin.name,
				email: admin.email,
			},
		})
	} catch (error) {
		console.error('Admin login error:', error.message)

		return res.status(500).json({
			success: false,
			message: 'Unable to sign in.',
		})
	}
})

module.exports = router
