import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart, FiCheck } from 'react-icons/fi'
import useBooks from '../../hooks/useBooks'

const serverBaseUrl = (
	import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '')

const getImageUrl = (image) => {
	if (!image) return ''
	if (/^https?:\/\//i.test(image)) return image

	return `${serverBaseUrl}/${image.replace(/^\/+/, '')}`
}

const getAuthorName = (book) => {
	if (typeof book.author === 'string') return book.author
	if (book.author && typeof book.author === 'object') {
		return book.author.name || book.author.author_name || ''
	}

	return book.author_name || ''
}

export default function BookDetails() {
	const { id } = useParams()
	const { books, loading, error } = useBooks()
	const [quantity, setQuantity] = useState(1)
	const [added, setAdded] = useState(false)

	const book = books.find(
		(item) => String(item.id ?? item.book_id) === String(id),
	)

	const handleAddToCart = () => {
		try {
			const savedCart = JSON.parse(
				localStorage.getItem('bokifa_cart') || '[]',
			)
			const cart = Array.isArray(savedCart) ? savedCart : []
			const bookId = String(book.id ?? book.book_id)
			const existingItem = cart.find(
				(item) => String(item.id ?? item.book_id) === bookId,
			)

			const updatedCart = existingItem
				? cart.map((item) =>
						String(item.id ?? item.book_id) === bookId
							? { ...item, quantity: Number(item.quantity || 0) + quantity }
							: item,
					)
				: [
						...cart,
						{
							...book,
							id: book.id ?? book.book_id,
							image: book.image || book.image_url,
							author: getAuthorName(book),
							quantity,
						},
					]

			localStorage.setItem('bokifa_cart', JSON.stringify(updatedCart))
			setAdded(true)
		} catch {
			setAdded(false)
		}
	}

	if (loading) {
		return (
			<section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-12">
				<p className="text-center text-muted">Loading book details...</p>
			</section>
		)
	}

	if (error) {
		return (
			<section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-12">
				<p className="text-center text-red-600">{error}</p>
				<div className="mt-6 text-center">
					<Link to="/books" className="font-semibold text-primary hover:text-primary-hover">
						Back to Books
					</Link>
				</div>
			</section>
		)
	}

	if (!book) {
		return (
			<section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-12">
				<h1 className="text-2xl font-bold">Book not found</h1>
				<p className="mt-3 text-muted">
					This book may no longer be available in our collection.
				</p>
				<Link
					to="/books"
					className="mt-6 inline-flex items-center gap-2 font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
				>
					<FiArrowLeft />
					Back to Books
				</Link>
			</section>
		)
	}

	const image = getImageUrl(book.image || book.image_url)
	const author = getAuthorName(book)
	const price = Number(book.price)

	return (
		<section className="px-4 py-10 sm:px-6 lg:px-12 lg:py-16">
			<div className="mx-auto max-w-7xl">
				<Link
					to="/books"
					className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition ease-in-out duration-500 hover:text-primary"
				>
					<FiArrowLeft size={18} />
					Back to Books
				</Link>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
					<div className="mx-auto w-full max-w-md">
						<div className="overflow-hidden rounded-xl bg-secondary">
							{image ? (
								<img
									src={image}
									alt={book.title}
									onError={(event) => {
										event.currentTarget.style.display = 'none'
									}}
									className="aspect-[3/4] w-full object-cover"
								/>
							) : (
								<div className="flex aspect-[3/4] items-center justify-center text-muted">
									Cover unavailable
								</div>
							)}
						</div>
					</div>

					<div className="flex flex-col justify-center">
						<p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
							Bokifa Book Collection
						</p>

						<h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
							{book.title}
						</h1>

						<p className="mt-4 text-base text-muted">
							{author ? (
								<>
									By <span className="font-semibold text-foreground">{author}</span>
								</>
							) : (
								'Author details unavailable'
							)}
						</p>

						<div className="mt-6 border-y border-border py-5">
							<p className="text-3xl font-bold text-primary">
								{Number.isFinite(price)
									? `₹${price.toLocaleString('en-IN')}`
									: 'Price unavailable'}
							</p>
						</div>

						<div className="mt-6">
							<h2 className="mb-3 text-lg font-semibold">About this book</h2>
							<p className="whitespace-pre-line text-sm leading-7 text-muted sm:text-base">
								{book.description || 'No description is available for this book yet.'}
							</p>
						</div>

						<div className="mt-8 flex flex-wrap items-center gap-4">
							<div className="flex h-12 items-center border border-border">
								<button
									type="button"
									onClick={() => {
										setQuantity((current) => Math.max(1, current - 1))
										setAdded(false)
									}}
									aria-label="Decrease quantity"
									disabled={quantity <= 1}
									className="flex h-full w-11 items-center justify-center transition ease-in-out duration-500 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
								>
									<FiMinus size={16} />
								</button>

								<span className="w-10 text-center font-semibold">
									{quantity}
								</span>

								<button
									type="button"
									onClick={() => {
										setQuantity((current) => current + 1)
										setAdded(false)
									}}
									aria-label="Increase quantity"
									className="flex h-full w-11 items-center justify-center transition ease-in-out duration-500 hover:text-primary"
								>
									<FiPlus size={16} />
								</button>
							</div>

							<button
								type="button"
								onClick={handleAddToCart}
								className="flex h-12 flex-1 items-center justify-center gap-2 bg-primary px-6 font-semibold text-white transition ease-in-out duration-500 hover:bg-primary-hover sm:flex-none"
							>
								{added ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
								{added ? 'Added to Cart' : 'Add to Cart'}
							</button>
						</div>

						{added && (
							<p role="status" className="mt-3 text-sm text-primary">
								Added to your cart.
							</p>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
