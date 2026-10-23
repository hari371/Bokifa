const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
	const authorization = req.headers.authorization

	if (!authorization || !authorization.startsWith('Bearer ')) {
		return res.status(401).json({
			success: false,
			message: 'Authentication required.',
		})
	}

	const token = authorization.slice(7)

	try {
		if (!process.env.JWT_SECRET) {
			throw new Error('JWT_SECRET is not configured.')
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		req.user = {
			id: decoded.id,
			role: decoded.role,
		}

		next()
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'Invalid or expired token.',
		})
	}
}

function requireAdmin(req, res, next) {
	if (req.user?.role !== 'admin') {
		return res.status(403).json({
			success: false,
			message: 'Admin access required.',
		})
	}

	next()
}

module.exports = {
	authenticateToken,
	requireAdmin,
}
