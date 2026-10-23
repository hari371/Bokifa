import { Link } from 'react-router-dom'
import BookCard from '../../../components/BookCard'

export default function PicksForYou({ books, loading, error }) {
	const picks = books.slice(4, 8)

	if (!loading && !error && picks.length === 0) {
		return null
	}

	return (
		<section className="px-4 py-16 sm:px-6 lg:px-12 lg:py-20">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 flex items-end justify-between gap-4">
					<div>
						<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
							Your next great read
						</p>
						<h2 className="text-3xl font-bold sm:text-4xl">
							Picks for You
						</h2>
						<p className="mt-3 text-sm leading-6 text-muted sm:text-base">
							Explore more stories from the Bokifa collection.
						</p>
					</div>

					<Link
						to="/books"
						className="shrink-0 text-sm font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
					>
						Explore all →
					</Link>
				</div>

				{loading ? (
					<p className="py-10 text-center text-muted">
						Loading books...
					</p>
				) : error ? (
					<p className="py-10 text-center text-red-600">{error}</p>
				) : (
					<div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-7">
						{picks.map((book) => (
							<BookCard key={book.id} book={book} />
						))}
					</div>
				)}
			</div>
		</section>
	)
}
