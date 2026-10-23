const pool = require('../config/db')

async function getOrCreateCart(userId, connection = pool) {
	await connection.execute(
		'INSERT INTO carts (user_id) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)',
		[userId]
	)

	const [carts] = await connection.execute(
		'SELECT id FROM carts WHERE user_id = ?',
		[userId]
	)

	return carts[0].id
}

async function getCart(req, res, next) {
	try {
		const cartId = await getOrCreateCart(req.user.id)

		const [items] = await pool.execute(
			`SELECT
				ci.id AS cart_item_id,
				b.id AS book_id,
				b.title,
				b.price,
				b.image_url,
				b.author_id,
				a.name AS author_name,
				ci.quantity,
				(b.price * ci.quantity) AS line_total
			FROM cart_items ci
			INNER JOIN books b ON b.id = ci.book_id
			INNER JOIN authors a ON a.id = b.author_id
			WHERE ci.cart_id = ?
			ORDER BY ci.id DESC`,
			[cartId]
		)

		const total = items.reduce(
			(sum, item) => sum + Number(item.line_total),
			0
		)

		return res.status(200).json({
			success: true,
			items,
			total: Number(total.toFixed(2)),
		})
	} catch (error) {
		next(error)
	}
}

async function addToCart(req, res, next) {
	try {
		const bookId = Number(req.body.bookId)
		const quantity = req.body.quantity === undefined ? 1 : Number(req.body.quantity)

		if (!Number.isSafeInteger(bookId) || bookId < 1) {
			return res.status(400).json({
				success: false,
				message: 'A valid book ID is required.',
			})
		}

		if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
			return res.status(400).json({
				success: false,
				message: 'Quantity must be between 1 and 99.',
			})
		}

		const [books] = await pool.execute(
			'SELECT id FROM books WHERE id = ?',
			[bookId]
		)

		if (books.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'Book not found.',
			})
		}

		const cartId = await getOrCreateCart(req.user.id)

		await pool.execute(
			`INSERT INTO cart_items (cart_id, book_id, quantity)
			VALUES (?, ?, ?)
			ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
			[cartId, bookId, quantity]
		)

		return res.status(200).json({
			success: true,
			message: 'Book added to cart.',
		})
	} catch (error) {
		next(error)
	}
}

async function updateCartItem(req, res, next) {
	try {
		const itemId = Number(req.params.itemId)
		const quantity = Number(req.body.quantity)

		if (!Number.isSafeInteger(itemId) || itemId < 1) {
			return res.status(400).json({
				success: false,
				message: 'A valid cart item ID is required.',
			})
		}

		if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
			return res.status(400).json({
				success: false,
				message: 'Quantity must be between 1 and 99.',
			})
		}

		const cartId = await getOrCreateCart(req.user.id)

		const [result] = await pool.execute(
			'UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ?',
			[quantity, itemId, cartId]
		)

		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Cart item not found.',
			})
		}

		return res.status(200).json({
			success: true,
			message: 'Cart quantity updated.',
		})
	} catch (error) {
		next(error)
	}
}

async function removeCartItem(req, res, next) {
	try {
		const itemId = Number(req.params.itemId)

		if (!Number.isSafeInteger(itemId) || itemId < 1) {
			return res.status(400).json({
				success: false,
				message: 'A valid cart item ID is required.',
			})
		}

		const cartId = await getOrCreateCart(req.user.id)

		const [result] = await pool.execute(
			'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
			[itemId, cartId]
		)

		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Cart item not found.',
			})
		}

		return res.status(200).json({
			success: true,
			message: 'Book removed from cart.',
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	getCart,
	addToCart,
	updateCartItem,
	removeCartItem,
}
