
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const bcrypt = require('bcryptjs')
const pool = require('../src/config/db')

async function createAdmin() {
	const name = process.env.ADMIN_NAME?.trim()
	const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
	const password = process.env.ADMIN_PASSWORD

	if (!name || !email || !password) {
		throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in server/.env.')
	}

	if (password.length > 12 || password.length < 5) {
		throw new Error('Admin password must be at least 5 to 12 characters long.')
	}

	const [existingUsers] = await pool.execute(
		'SELECT id, role FROM users WHERE email = ?',
		[email]
	)

	if (existingUsers.length > 0) {
		throw new Error('This email already exists. The script will not change an existing account.')
	}

	const passwordHash = await bcrypt.hash(password, 12)

	await pool.execute(
		'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
		[name, email, passwordHash, 'admin']
	)

	console.log(`Admin account created for ${email}.`)
}

createAdmin()
	.catch(error => {
		console.error('Admin setup failed:', error.message)
		process.exitCode = 1
	})
	.finally(async () => {
		await pool.end()
	})
