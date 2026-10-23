const authService = require('../services/authService')

async function register(req, res, next) {
	try {
		const { name, email, password } = req.body

		if (
			typeof name !== 'string' ||
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			!name.trim() ||
			!email.trim() ||
			!password
		) {
			return res.status(400).json({
				success: false,
				message: 'Name, email, and password are required.',
			})
		}

		if (password.length < 8) {
			return res.status(400).json({
				success: false,
				message: 'Password must be at least 8 characters long.',
			})
		}

		const user = await authService.registerUser({ name, email, password })

		return res.status(201).json({
			success: true,
			message: 'Account created successfully.',
			user,
		})
	} catch (error) {
		next(error)
	}
}

async function login(req, res, next) {
	try {
		const { email, password } = req.body

		if (
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			!email.trim() ||
			!password
		) {
			return res.status(400).json({
				success: false,
				message: 'Email and password are required.',
			})
		}

		const result = await authService.loginUser({ email, password })

		return res.status(200).json({
			success: true,
			message: 'Login successful.',
			...result,
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	register,
	login,
}
