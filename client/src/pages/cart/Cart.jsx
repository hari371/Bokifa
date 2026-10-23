
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
	FiArrowLeft,
	FiMinus,
	FiPlus,
	FiShoppingBag,
	FiTrash2,
} from 'react-icons/fi'

const serverBaseUrl = (
	import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '')

const getImageUrl = (image) => {
	if (!image) return ''
	if (/^https?:\/\//i.test(image)) return image

	return `${serverBaseUrl}/${image.replace(/^\/+/, '')}`
}

const readCart = () => {
	try {
		const savedCart = JSON.parse(localStorage.getItem('bokifa_cart') || '[]')
		return Array.isArray(savedCart) ? savedCart : []
	} catch {
		return []
	}
}

const getBookId = (book) => String(book.id ?? book.book_id)

const formatPrice = (price) =>
	`₹${Number(price || 0).toLocaleString('en-IN', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`

export default function Cart() {
	const [items, setItems] = useState(readCart)

	const saveCart = (nextItems) => {
		setItems(nextItems)

		try {
			localStorage.setItem('bokifa_cart', JSON.stringify(nextItems))
		} catch {
			return
		}
	}

	const updateQuantity = (bookId, change) => {
		const updatedItems = items.map((item) => {
			if (getBookId(item) !== bookId) return item

			return {
				...item,
				quantity: Math.max(1, Number(item.quantity || 1) + change),
			}
		})

		saveCart(updatedItems)
	}

	const removeItem = (bookId) => {
		saveCart(items.filter((item) => getBookId(item) !== bookId))
	}

	const subtotal = items.reduce((total, item) => {
		const price = Number(item.price)
		const quantity = Number(item.quantity || 1)

		return total + (Number.isFinite(price) ? price * quantity : 0)
	}, 0)

	return (
		<section className="min-h-[60vh] px-4 py-10 sm:px-6 lg:px-12 lg:py-16">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10">
					<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
						Your Bokifa collection
					</p>
					<h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
						Shopping Cart
					</h1>
					<p className="mt-3 text-sm text-muted">
						{items.length} {items.length === 1 ? 'item' : 'items'} in your cart
					</p>
				</div>

				{items.length === 0 ? (
					<div className="flex flex-col items-center border border-border px-5 py-16 text-center sm:py-20">
						<div className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
							<FiShoppingBag size={28} />
						</div>
						<h2 className="mt-5 text-2xl font-bold">Your cart is empty</h2>
						<p className="mt-3 max-w-md text-sm leading-6 text-muted">
							Your next favourite read is waiting. Explore our collection and
							add a book to get started.
						</p>
						<Link
							to="/books"
							className="mt-6 inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-white transition ease-in-out duration-500 hover:bg-primary-hover"
						>
							Explore Books
							<FiArrowLeft className="rotate-180" size={17} />
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-10">
						<div className="min-w-0 lg:col-span-2">
							<div className="divide-y divide-border border-y border-border">
								{items.map((item, index) => {
									const id = getBookId(item)
									const image = getImageUrl(item.image || item.image_url)
									const quantity = Number(item.quantity || 1)
									const price = Number(item.price || 0)

									return (
										<article
											key={`${id}-${index}`}
											className="flex gap-4 py-5 sm:gap-6"
										>
											<Link
												to={`/books/${id}`}
												className="w-24 shrink-0 self-start overflow-hidden bg-secondary sm:w-32"
											>
												{image ? (
													<img
														src={image}
														alt={item.title || 'Book cover'}
														className="aspect-[3/4] w-full object-cover"
														onError={(event) => {
															event.currentTarget.style.visibility = 'hidden'
														}}
													/>
												) : (
													<div className="flex aspect-[3/4] items-center justify-center p-2 text-center text-xs text-muted">
														Cover unavailable
													</div>
												)}
											</Link>

											<div className="flex min-w-0 flex-1 flex-col">
												<div className="flex items-start justify-between gap-3">
													<div className="min-w-0">
														<Link
															to={`/books/${id}`}
															className="font-semibold transition ease-in-out duration-500 hover:text-primary sm:text-lg"
														>
															{item.title || 'Untitled book'}
														</Link>
														{item.author && (
															<p className="mt-1 text-sm text-muted">
																{typeof item.author === 'string'
																	? item.author
																	: item.author.name || ''}
															</p>
														)}
													</div>

													<button
														type="button"
														onClick={() => removeItem(id)}
														aria-label={`Remove ${item.title || 'book'} from cart`}
														title="Remove item"
														className="shrink-0 p-2 text-muted transition ease-in-out duration-500 hover:text-red-600"
													>
														<FiTrash2 size={18} />
													</button>
												</div>

												<p className="mt-3 font-semibold">
													{formatPrice(price)}
												</p>

												<div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
													<div className="flex h-9 items-center border border-border">
														<button
															type="button"
															onClick={() => updateQuantity(id, -1)}
															disabled={quantity <= 1}
															aria-label="Decrease quantity"
															className="flex h-full w-9 items-center justify-center transition ease-in-out duration-500 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
														>
															<FiMinus size={14} />
														</button>

														<span className="w-8 text-center text-sm font-semibold">
															{quantity}
														</span>

														<button
															type="button"
															onClick={() => updateQuantity(id, 1)}
															aria-label="Increase quantity"
															className="flex h-full w-9 items-center justify-center transition ease-in-out duration-500 hover:text-primary"
														>
															<FiPlus size={14} />
														</button>
													</div>

													<p className="text-sm font-bold sm:text-base">
														{formatPrice(price * quantity)}
													</p>
												</div>
											</div>
										</article>
									)
								})}
							</div>

							<Link
								to="/books"
								className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
							>
								<FiArrowLeft size={17} />
								Continue shopping
							</Link>
						</div>

						<aside className="border border-border p-5 sm:p-6 lg:sticky lg:top-6">
							<h2 className="text-xl font-bold">Order Summary</h2>

							<div className="mt-6 flex items-center justify-between gap-4 text-sm">
								<span className="text-muted">Items</span>
								<span>{items.reduce((sum, item) => sum + Number(item.quantity || 1), 0)}</span>
							</div>

							<div className="mt-4 flex items-center justify-between gap-4 text-sm">
								<span className="text-muted">Subtotal</span>
								<span className="font-semibold">{formatPrice(subtotal)}</span>
							</div>

							<div className="mt-5 border-t border-border pt-5">
								<div className="flex items-center justify-between gap-4">
									<span className="font-semibold">Total</span>
									<span className="text-xl font-bold text-primary">
										{formatPrice(subtotal)}
									</span>
								</div>
								<p className="mt-3 text-xs leading-5 text-muted">
									Shipping and payment details will be calculated during checkout.
								</p>
							</div>

							<p className="mt-6 border border-border bg-secondary p-4 text-sm leading-6 text-muted">
								Your cart is saved in this browser. Checkout and payment
								integration will be added separately.
							</p>
						</aside>
					</div>
				)}
			</div>
		</section>
	)
}
