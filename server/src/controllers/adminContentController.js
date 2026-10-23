const pool = require('../config/db')

async function getAuthors(req, res, next) {
	try {
		const [result] = await pool.query('CALL GetAuthors()')
		res.json({ success: true, authors: result[0] })
	} catch (error) {
		next(error)
	}
}

async function createAuthor(req, res, next) {
	try {
		const { name, bio, image_url } = req.body

		if (typeof name !== 'string' || !name.trim()) {
			return res.status(400).json({ success: false, message: 'Author name is required.' })
		}

		await pool.execute('CALL AddAuthor(?, ?, ?)', [
			name.trim(),
			typeof bio === 'string' ? bio : null,
			typeof image_url === 'string' && image_url.trim() ? image_url.trim() : null,
		])

		res.status(201).json({ success: true, message: 'Author created successfully.' })
	} catch (error) {
		next(error)
	}
}

async function updateAuthor(req, res, next) {
	try {
		const { name, bio, image_url } = req.body
		const id = Number(req.params.id)

		if (!Number.isSafeInteger(id) || id < 1 || typeof name !== 'string' || !name.trim()) {
			return res.status(400).json({ success: false, message: 'A valid ID and author name are required.' })
		}

		await pool.execute('CALL UpdateAuthor(?, ?, ?, ?)', [
			id,
			name.trim(),
			typeof bio === 'string' ? bio : null,
			typeof image_url === 'string' && image_url.trim() ? image_url.trim() : null,
		])

		res.json({ success: true, message: 'Author updated successfully.' })
	} catch (error) {
		next(error)
	}
}

async function deleteAuthor(req, res, next) {
	try {
		const id = Number(req.params.id)

		if (!Number.isSafeInteger(id) || id < 1) {
			return res.status(400).json({ success: false, message: 'A valid author ID is required.' })
		}

		await pool.execute('CALL DeleteAuthor(?)', [id])
		res.json({ success: true, message: 'Author deleted successfully.' })
	} catch (error) {
		next(error)
	}
}

async function getBooks(req, res, next) {
	try {
		const [result] = await pool.query('CALL GetBooks()')
		res.json({ success: true, books: result[0] })
	} catch (error) {
		next(error)
	}
}

async function createBook(req, res, next) {
	try {
		const { title, description, price, image_url, author_id } = req.body
		const bookPrice = Number(price)
		const authorId = Number(author_id)

		if (
			typeof title !== 'string' ||
			!title.trim() ||
			!Number.isFinite(bookPrice) ||
			bookPrice < 0 ||
			!Number.isSafeInteger(authorId) ||
			authorId < 1
		) {
			return res.status(400).json({ success: false, message: 'Valid title, price, and author ID are required.' })
		}

		await pool.execute('CALL AddBook(?, ?, ?, ?, ?)', [
			title.trim(),
			typeof description === 'string' ? description : null,
			bookPrice,
			typeof image_url === 'string' && image_url.trim() ? image_url.trim() : null,
			authorId,
		])

		res.status(201).json({ success: true, message: 'Book created successfully.' })
	} catch (error) {
		next(error)
	}
}

async function updateBook(req, res, next) {
	try {
		const { title, description, price, image_url, author_id } = req.body
		const id = Number(req.params.id)
		const bookPrice = Number(price)
		const authorId = Number(author_id)

		if (
			!Number.isSafeInteger(id) ||
			id < 1 ||
			typeof title !== 'string' ||
			!title.trim() ||
			!Number.isFinite(bookPrice) ||
			bookPrice < 0 ||
			!Number.isSafeInteger(authorId) ||
			authorId < 1
		) {
			return res.status(400).json({ success: false, message: 'Valid book ID, title, price, and author ID are required.' })
		}

		await pool.execute('CALL UpdateBook(?, ?, ?, ?, ?, ?)', [
			id,
			title.trim(),
			typeof description === 'string' ? description : null,
			bookPrice,
			typeof image_url === 'string' && image_url.trim() ? image_url.trim() : null,
			authorId,
		])

		res.json({ success: true, message: 'Book updated successfully.' })
	} catch (error) {
		next(error)
	}
}

async function deleteBook(req, res, next) {
	try {
		const id = Number(req.params.id)

		if (!Number.isSafeInteger(id) || id < 1) {
			return res.status(400).json({ success: false, message: 'A valid book ID is required.' })
		}

		await pool.execute('CALL DeleteBook(?)', [id])
		res.json({ success: true, message: 'Book deleted successfully.' })
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

async function createBlog(req, res, next) {
	try {
		const { title, description, image_url, author_id } = req.body
		const authorId = Number(author_id)

		if (
			typeof title !== 'string' ||
			!title.trim() ||
			!Number.isSafeInteger(authorId) ||
			authorId < 1
		) {
			return res.status(400).json({ success: false, message: 'Valid title and author ID are required.' })
		}

		await pool.execute('CALL AddBlog(?, ?, ?, ?)', [
			title.trim(),
			typeof description === 'string' ? description : null,
			typeof image_url === 'string' && image_url.trim() ? image_url.trim() : null,
			authorId,
		])

		res.status(201).json({ success: true, message: 'Blog created successfully.' })
	} catch (error) {
		next(error)
	}
}

async function updateBlog(req, res, next) {
	try {
		const { title, description, image_url, author_id } = req.body
		const id = Number(req.params.id)
		const authorId = Number(author_id)

		if (
			!Number.isSafeInteger(id) ||
			id < 1 ||
			typeof title !== 'string' ||
			!title.trim() ||
			!Number.isSafeInteger(authorId) ||
			authorId < 1
		) {
			return res.status(400).json({ success: false, message: 'Valid blog ID, title, and author ID are required.' })
		}

		await pool.execute('CALL UpdateBlog(?, ?, ?, ?, ?)', [
			id,
			title.trim(),
			typeof description === 'string' ? description : null,
			typeof image_url === 'string' && image_url.trim() ? image_url.trim() : null,
			authorId,
		])

		res.json({ success: true, message: 'Blog updated successfully.' })
	} catch (error) {
		next(error)
	}
}

async function deleteBlog(req, res, next) {
	try {
		const id = Number(req.params.id)

		if (!Number.isSafeInteger(id) || id < 1) {
			return res.status(400).json({ success: false, message: 'A valid blog ID is required.' })
		}

		await pool.execute('CALL DeleteBlog(?)', [id])
		res.json({ success: true, message: 'Blog deleted successfully.' })
	} catch (error) {
		next(error)
	}
}

module.exports = {
	getAuthors,
	createAuthor,
	updateAuthor,
	deleteAuthor,
	getBooks,
	createBook,
	updateBook,
	deleteBook,
	getBlogs,
	createBlog,
	updateBlog,
	deleteBlog,
}
