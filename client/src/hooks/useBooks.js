
import { useEffect, useState } from 'react'
import api from '../services/api'

const extractBooks = (payload) => {
	if (Array.isArray(payload)) {
		if (payload.length === 0) return []

		const nestedArray = payload.find(Array.isArray)

		if (nestedArray) {
			return extractBooks(nestedArray)
		}

		return payload
	}

	if (!payload || typeof payload !== 'object') {
		return []
	}

	for (const key of ['books', 'data', 'results', 'items', 'rows']) {
		if (payload[key] !== undefined) {
			const result = extractBooks(payload[key])

			if (result.length > 0 || Array.isArray(payload[key])) {
				return result
			}
		}
	}

	return []
}

export default function useBooks() {
	const [books, setBooks] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let active = true

		const fetchBooks = async () => {
			try {
				const response = await api.get('/books')
				const items = extractBooks(response.data)

				const normalizedBooks = items.map((book) => ({
					...book,
					id: book.id ?? book.book_id ?? book.bookId,
					image: book.image ?? book.image_url ?? book.imageUrl,
					author:
						typeof book.author === 'string'
							? book.author
							: book.author?.name ?? book.author_name ?? '',
				}))

				if (active) {
					setBooks(normalizedBooks)
					setError('')
				}
			} catch (err) {
				if (active) {
					setError(
						err.response?.data?.message ||
							'Unable to load books. Please check the backend connection.',
					)
				}
			} finally {
				if (active) {
					setLoading(false)
				}
			}
		}

		fetchBooks()

		return () => {
			active = false
		}
	}, [])

	return { books, loading, error }
}
