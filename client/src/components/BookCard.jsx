
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiEye, FiLayers, FiCheck } from 'react-icons/fi'

const apiBaseUrl = (
	import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '')

const getImageUrl = (image) => {
	if (!image) return ''
	if (/^https?:\/\//i.test(image)) return image

	return `${apiBaseUrl}/${image.replace(/^\/+/, '')}`
}

export default function BookCard({ book, onAddToCart }) {
	const [added, setAdded] = useState(false)
	const imageUrl = getImageUrl(book.image || book.image_url)

	const handleAddToCart = () => {
		if (onAddToCart) {
			onAddToCart(book)
			setAdded(true)
			return
		}

		try {
			const savedCart = JSON.parse(
				localStorage.getItem('bokifa_cart') || '[]',
			)
			const cart = Array.isArray(savedCart) ? savedCart : []
			const id = book.id ?? book.book_id

			if (id == null) return

			const existingItem = cart.find(
				(item) => String(item.id ?? item.book_id) === String(id),
			)

			const updatedCart = existingItem
				? cart.map((item) =>
						String(item.id ?? item.book_id) === String(id)
							? {
									...item,
									quantity: Number(item.quantity || 1) + 1,
								}
							: item,
					)
				: [
						...cart,
						{
							...book,
							id,
							image: book.image || book.image_url,
							author:
								typeof book.author === 'string'
									? book.author
									: book.author?.name || book.author_name || '',
							quantity: 1,
						},
					]

			localStorage.setItem('bokifa_cart', JSON.stringify(updatedCart))
			setAdded(true)
		} catch {
			setAdded(false)
		}
	}

	return (
		<article className="group min-w-0">
			<div className="relative overflow-hidden bg-secondary">
				<Link to={`/books/${book.id ?? book.book_id}`} className="block">
					{imageUrl ? (
						<img
							src={imageUrl}
							alt={book.title}
							loading="lazy"
							onError={(event) => {
								event.currentTarget.style.visibility = 'hidden'
							}}
							className="aspect-3/4 w-full object-cover transition ease-in-out duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="flex aspect-3/4 w-full items-center justify-center text-sm text-muted">
							Cover unavailable
						</div>
					)}
				</Link>

				<div className="absolute right-3 top-3 flex translate-x-14 flex-col gap-2 opacity-0 transition ease-in-out duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100">
					<button
						type="button"
						onClick={handleAddToCart}
						aria-label={`Add ${book.title} to cart`}
						title={added ? 'Added to cart' : 'Add to cart'}
						className="flex size-10 items-center justify-center bg-white rounded-full text-foreground shadow-sm transition ease-in-out duration-500 hover:bg-primary hover:text-white"
					>
						{added ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
					</button>

					<Link
						to={`/books/${book.id ?? book.book_id}`}
						aria-label={`View ${book.title} details`}
						title="View details"
						className="flex size-10 items-center justify-center bg-white rounded-full text-foreground shadow-sm transition ease-in-out duration-500 hover:bg-primary hover:text-white"
					>
						<FiEye size={18} />
					</Link>

					<button
						type="button"
						aria-label={`Compare ${book.title}`}
						title="Compare"
						className="flex size-10 items-center justify-center bg-white rounded-full text-foreground shadow-sm transition ease-in-out duration-500 hover:bg-primary hover:text-white"
					>
						<FiLayers size={18} />
					</button>
				</div>
			</div>

			<div className="pt-4">
				<h3 className="truncate text-base font-semibold transition ease-in-out duration-500 group-hover:text-primary">
					{book.title}
				</h3>
				<p className="mt-1 truncate text-sm text-muted">
					{typeof book.author === 'string'
						? book.author
						: book.author?.name || book.author_name || ''}
				</p>
				<p className="mt-2 font-semibold">
					₹{Number(book.price).toLocaleString('en-IN')}
				</p>
			</div>
		</article>
	)
}
