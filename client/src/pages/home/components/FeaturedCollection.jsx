import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import BookCard from '../../../components/BookCard'

export default function FeaturedCollection({ books, loading, error }) {
	const featuredBooks = books.slice(0, 10)

	return (
		<section className="bg-secondary px-4 py-16 sm:px-6 lg:px-12 lg:py-20">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 flex items-end justify-between gap-4">
					<div>
						<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
							Reader favourites
						</p>
						<h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
							Featured Collection
						</h2>
						<p className="mt-3 text-sm text-muted sm:text-base">
							Discover your next favourite read.
						</p>
					</div>

					<Link
						to="/books"
						className="shrink-0 text-sm font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
					>
						View all books →
					</Link>
				</div>

				{loading ? (
					<p className="py-10 text-center text-muted">Loading books...</p>
				) : error ? (
					<p className="py-10 text-center text-red-600">{error}</p>
				) : featuredBooks.length === 0 ? (
					<p className="py-10 text-center text-muted">
						No books available yet.
					</p>
				) : (
					<Swiper
						modules={[Navigation, Pagination]}
						navigation
						pagination={{ clickable: true }}
						slidesPerView={2}
						spaceBetween={16}
						breakpoints={{
							640: {
								slidesPerView: 3,
								spaceBetween: 20,
							},
							1024: {
								slidesPerView: 4,
								spaceBetween: 24,
							},
						}}
						className="!pb-12"
						style={{ '--swiper-theme-color': '#027a36' }}
					>
						{featuredBooks.map((book) => (
							<SwiperSlide key={book.id} className="h-auto">
								<BookCard book={book} />
							</SwiperSlide>
						))}
					</Swiper>
				)}
			</div>
		</section>
	)
}
