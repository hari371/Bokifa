import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiSliders, FiX } from 'react-icons/fi'
import BookCard from '../../components/BookCard'
import useBooks from '../../hooks/useBooks'

const getAuthorName = (book) => {
	if (typeof book.author === 'string') return book.author
	if (book.author && typeof book.author === 'object') {
		return book.author.name || book.author.author_name || ''
	}

	return book.author_name || ''
}

const controlClass =
	'w-full border border-border bg-white px-3 py-3 text-sm outline-none transition ease-in-out duration-500 focus:border-primary'

export default function Books() {
	const { books, loading, error } = useBooks()
	const [searchParams, setSearchParams] = useSearchParams()
	const [selectedAuthor, setSelectedAuthor] = useState('all')
	const [priceRange, setPriceRange] = useState('all')
	const [sortBy, setSortBy] = useState('default')

	const search = searchParams.get('search') || ''

	const authors = useMemo(() => {
		return [...new Set(books.map(getAuthorName).filter(Boolean))].sort(
			(a, b) => a.localeCompare(b),
		)
	}, [books])

	const filteredBooks = useMemo(() => {
		const query = search.trim().toLowerCase()

		const result = books.filter((book) => {
			const title = String(book.title || '').toLowerCase()
			const author = getAuthorName(book).toLowerCase()
			const description = String(book.description || '').toLowerCase()
			const price = Number(book.price)

			const matchesSearch =
				!query ||
				title.includes(query) ||
				author.includes(query) ||
				description.includes(query)

			const matchesAuthor =
				selectedAuthor === 'all' || getAuthorName(book) === selectedAuthor

			let matchesPrice = true

			if (priceRange !== 'all') {
				if (!Number.isFinite(price)) {
					matchesPrice = false
				} else if (priceRange === 'under300') {
					matchesPrice = price < 300
				} else if (priceRange === '300to600') {
					matchesPrice = price >= 300 && price <= 600
				} else if (priceRange === 'above600') {
					matchesPrice = price > 600
				}
			}

			return matchesSearch && matchesAuthor && matchesPrice
		})

		if (sortBy === 'title') {
			result.sort((a, b) =>
				String(a.title || '').localeCompare(String(b.title || '')),
			)
		} else if (sortBy === 'price-low') {
			result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
		} else if (sortBy === 'price-high') {
			result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
		}

		return result
	}, [books, search, selectedAuthor, priceRange, sortBy])

	const hasActiveFilters =
		search.trim() !== '' ||
		selectedAuthor !== 'all' ||
		priceRange !== 'all' ||
		sortBy !== 'default'

	const clearFilters = () => {
		setSearchParams({}, { replace: true })
		setSelectedAuthor('all')
		setPriceRange('all')
		setSortBy('default')
	}

	return (
		<section className="min-h-screen px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
			<div className="mx-auto max-w-7xl">
				<div className="mb-8">
					<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
						Explore Bokifa
					</p>
					<h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
						Our Book Collection
					</h1>
					<p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
						Find your next favourite read from our collection of books.
					</p>
				</div>

				<div className="mb-8 border border-border bg-secondary p-4 sm:p-5">
					<div className="mb-5 flex items-center gap-2">
						<FiSliders size={19} className="text-primary" />
						<h2 className="font-semibold">Find your book</h2>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div>
							<label htmlFor="book-search" className="mb-2 block text-sm font-medium">
								Search
							</label>
							<div className="relative">
								<FiSearch
									size={18}
									className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
								/>
								<input
									id="book-search"
									type="search"
									value={search}
									onChange={(event) => {
										const value = event.target.value
										setSearchParams(
											value ? { search: value } : {},
											{ replace: true },
										)
									}}
									placeholder="Title, author, or description"
									className={`${controlClass} pl-10`}
								/>
							</div>
						</div>

						<div>
							<label htmlFor="author-filter" className="mb-2 block text-sm font-medium">
								Author
							</label>
							<select
								id="author-filter"
								value={selectedAuthor}
								onChange={(event) => setSelectedAuthor(event.target.value)}
								className={controlClass}
							>
								<option value="all">All authors</option>
								{authors.map((author) => (
									<option key={author} value={author}>
										{author}
									</option>
								))}
							</select>
						</div>

						<div>
							<label htmlFor="price-filter" className="mb-2 block text-sm font-medium">
								Price range
							</label>
							<select
								id="price-filter"
								value={priceRange}
								onChange={(event) => setPriceRange(event.target.value)}
								className={controlClass}
							>
								<option value="all">All prices</option>
								<option value="under300">Under ₹300</option>
								<option value="300to600">₹300–₹600</option>
								<option value="above600">Above ₹600</option>
							</select>
						</div>

						<div>
							<label htmlFor="sort-books" className="mb-2 block text-sm font-medium">
								Sort by
							</label>
							<select
								id="sort-books"
								value={sortBy}
								onChange={(event) => setSortBy(event.target.value)}
								className={controlClass}
							>
								<option value="default">Default order</option>
								<option value="title">Title: A to Z</option>
								<option value="price-low">Price: Low to High</option>
								<option value="price-high">Price: High to Low</option>
							</select>
						</div>
					</div>

					{hasActiveFilters && (
						<button
							type="button"
							onClick={clearFilters}
							className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
						>
							<FiX size={16} />
							Clear filters
						</button>
					)}
				</div>

				<div className="mb-5 flex items-center justify-between gap-3">
					<p className="text-sm text-muted">
						{loading
							? 'Loading books...'
							: `${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'} found`}
					</p>
				</div>

				{loading ? (
					<div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-7">
						{Array.from({ length: 8 }, (_, index) => (
							<div key={index} className="animate-pulse">
								<div className="aspect-3/4 bg-secondary" />
								<div className="mt-4 h-4 w-3/4 bg-secondary" />
								<div className="mt-3 h-3 w-1/2 bg-secondary" />
								<div className="mt-3 h-4 w-1/4 bg-secondary" />
							</div>
						))}
					</div>
				) : error ? (
					<div className="py-16 text-center">
						<p className="text-red-600">{error}</p>
					</div>
				) : filteredBooks.length === 0 ? (
					<div className="border border-border py-16 text-center">
						<h2 className="text-xl font-semibold">
							{books.length === 0
								? 'No books available yet'
								: 'No matching books found'}
						</h2>
						<p className="mt-2 text-sm text-muted">
							{books.length === 0
								? 'Books will appear here once they are available in the catalogue.'
								: 'Try changing your search or filters.'}
						</p>
						{hasActiveFilters && (
							<button
								type="button"
								onClick={clearFilters}
								className="mt-5 bg-primary px-5 py-3 text-sm font-semibold text-white transition ease-in-out duration-500 hover:bg-primary-hover"
							>
								Clear filters
							</button>
						)}
					</div>
				) : (
					<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-12">
						{filteredBooks.map((book, index) => (
							<BookCard
								key={book.id ?? book.book_id ?? `${book.title}-${index}`}
								book={book}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	)
}
