const express = require('express')
const cors = require('cors')
const path = require('path')

require('dotenv').config()

const pool = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const { authenticateToken } = require('./middleware/authMiddleware')
const cartRoutes = require('./routes/cartRoutes')
const adminContentRoutes = require('./routes/adminContentRoutes')
const publicContentRoutes = require('./routes/publicContentRoutes')
const userAuthRoutes = require('./routes/userAuthRoutes')
const adminAuthRoutes = require('./routes/adminAuthRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
	origin: 'http://localhost:5173',
}))

app.use(express.json())
app.use('/assests', express.static(path.resolve(__dirname, '../../assests')))

app.get('/api/health', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Bokifa API is running',
	})
})

app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/admin', adminContentRoutes)
app.use('/api', publicContentRoutes)
app.use('/api/user-auth', userAuthRoutes)
app.use('/api/admin-auth', adminAuthRoutes)
app.use('/api/admin', adminContentRoutes)

app.get('/api/auth/me', authenticateToken, (req, res) => {
	res.status(200).json({
		success: true,
		user: req.user,
	})
})

async function startServer() {
	try {
		const connection = await pool.getConnection()
		await connection.ping()
		connection.release()

		console.log('MySQL database connected successfully')

		app.listen(PORT, () => {
			console.log(`Bokifa API running at http://localhost:${PORT}`)
		})
	} catch (error) {
		console.error('Failed to connect to MySQL:', error.message)
		process.exit(1)
	}
}

startServer()
