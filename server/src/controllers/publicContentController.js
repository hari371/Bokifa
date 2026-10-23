const pool = require('../config/db')

async function getBooks(req, res, next) {
	try {
		const [result] = await pool.query('CALL GetBooks()')
		res.json({ success: true, books: result[0] })
	} catch (error) {
		next(error)
	}
}

async function getAuthors(req, res, next) {
	try {
		const [result] = await pool.query('CALL GetAuthors()')
		res.json({ success: true, authors: result[0] })
	} catch (error) {
		next(error)
	}
}

async function getBlogs(req, res, next) {
	try {
		const [result] = await pool.query('CALL GetBlogs()')
		res.json({ success: true, blogs: result[0] })
	} catch (error) {
		next(error)
	}
}

module.exports = { getBooks, getAuthors, getBlogs }
