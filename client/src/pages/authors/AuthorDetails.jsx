import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiBookOpen } from 'react-icons/fi'
import api from '../../services/api'
import BookCard from '../../components/BookCard'

const serverBaseUrl = (
	import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '')

const getImageUrl = (image) => {
	if (!image) return ''
	if (/^https?:\/\//i.test(image)) return image

	return `${serverBaseUrl}/${image.replace(/^\/+/, '')}`
}

const extractItems = (payload, collectionKey) => {
	if (Array.isArray(payload)) {
		if (payload.length === 1 && Array.isArray(payload[0])) {
			return extractItems(payload[0], collectionKey)
		}

		return payload
	}

	if (!payload || typeof payload !== 'object') return []

	for (const key of [collectionKey, 'data', 'results', 'items', 'rows']) {
		if (payload[key] !== undefined) {
			return extractItems(payload[key], collectionKey)
		}
	}

	return []
}

const getAuthorName = (book) => {
	if (typeof book.author === 'string') return book.author
	if (book.author && typeof book.author === 'object') {
		return book.author.name || book.author.author_name || ''
	}

	return book.author_name || ''
}

export default function AuthorDetails() {
	const { id } = useParams()
	const [author, setAuthor] = useState(null)
	const [books, setBooks] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let active = true

		const fetchDetails = async () => {
			try {
				const [authorsResponse, booksResponse] = await Promise.all([
					api.get('/authors'),
					api.get('/books').catch(() => ({ data: [] })),
				])

				const authors = extractItems(authorsResponse.data, 'authors')
				const allBooks = extractItems(booksResponse.data, 'books')

				const selectedAuthor = authors.find(
					(item) =>
						String(item.id ?? item.author_id) === String(id),
				)

				if (active) {
					setAuthor(selectedAuthor || null)
					setBooks(allBooks)
					setError('')
				}
			} catch {
				if (active) {
					setError('Unable to load author details. Please try again later.')
				}
			} finally {
				if (active) setLoading(false)
			}
		}

		fetchDetails()

		return () => {
			active = false
		}
	}, [id])

	const authorBooks = useMemo(() => {
		if (!author) return []

		const authorId = author.id ?? author.author_id
		const authorName = String(author.name || author.author_name || '')
			.trim()
			.toLowerCase()

		return books
			.filter((book) => {
				const bookAuthorId =
					book.author_id ??
					book.authorId ??
					book.author?.id ??
					book.author?.author_id

				if (bookAuthorId !== undefined && bookAuthorId !== null) {
					return String(bookAuthorId) === String(authorId)
				}

				return getAuthorName(book).trim().toLowerCase() === authorName
			})
			.map((book) => ({
				...book,
				id: book.id ?? book.book_id,
				image: book.image ?? book.image_url,
				author: getAuthorName(book) || author.name || author.author_name,
			}))
	}, [author, books])

	if (loading) {
		return (
			<section className="px-4 py-16 text-center text-muted">
				Loading author details...
			</section>
		)
	}

	if (error) {
		return (
			<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-12">
				<p className="text-red-600">{error}</p>
				<Link
					to="/authors"
					className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-hover"
				>
					<FiArrowLeft />
					Back to Authors
				</Link>
			</section>
		)
	}

	if (!author) {
		return (
			<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-12">
				<h1 className="text-2xl font-bold">Author not found</h1>
				<p className="mt-3 text-muted">
					This author is not available in the current collection.
				</p>
				<Link
					to="/authors"
					className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-hover"
				>
					<FiArrowLeft />
					Back to Authors
				</Link>
			</section>
		)
	}

	const name = author.name || author.author_name || 'Author'
	const image = getImageUrl(author.image_url || author.image)

	return (
		<>
			<section className="bg-secondary px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
				<div className="mx-auto max-w-7xl">
					<Link
						to="/authors"
						className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition ease-in-out duration-500 hover:text-primary"
					>
						<FiArrowLeft size={18} />
						All Authors
					</Link>

					<div className="flex flex-col items-center gap-7 sm:flex-row sm:items-start sm:gap-10">
						<div className="size-40 shrink-0 overflow-hidden rounded-full bg-white sm:size-48 lg:size-56">
							{image ? (
								<img
									src={image}
									alt={name}
									className="size-full rounded-full object-cover"
									onError={(event) => {
										event.currentTarget.style.display = 'none'
									}}
								/>
							) : (
								<div className="flex size-full items-center justify-center rounded-full text-6xl font-bold text-primary">
									{name.charAt(0).toUpperCase()}
								</div>
							)}
						</div>

						<div className="flex-1 text-center sm:pt-5 sm:text-left">
							<p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
								Meet the storyteller
							</p>
							<h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
								{name}
							</h1>
							<p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted sm:justify-start">
								<FiBookOpen size={18} className="text-primary" />
								{authorBooks.length}{' '}
								{authorBooks.length === 1 ? 'book' : 'books'} in our collection
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
				<div className="mx-auto max-w-7xl">
					<div className="max-w-4xl">
						<h2 className="text-2xl font-bold sm:text-3xl">
							About the Author
						</h2>
						<p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted sm:text-base">
							{author.bio || 'A biography has not been added for this author yet.'}
						</p>
					</div>

					<div className="mt-14 border-t border-border pt-10 sm:mt-16 sm:pt-12">
						<div className="mb-8">
							<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
								Explore the collection
							</p>
							<h2 className="text-2xl font-bold sm:text-3xl">
								Books by {name}
							</h2>
						</div>

						{authorBooks.length === 0 ? (
							<p className="border border-border py-12 text-center text-muted">
								No books by this author were found in the current collection.
							</p>
						) : (
							<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
								{authorBooks.map((book, index) => (
									<BookCard
										key={book.id ?? `${book.title}-${index}`}
										book={book}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</section>
		</>
	)
}
