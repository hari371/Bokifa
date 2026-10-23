import { FiStar } from 'react-icons/fi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const reviews = [
	{
		id: 1,
		name: 'Riya Sharma',
		type: 'Fiction Reader',
		rating: 5,
		review:
			'Finding my next read feels easier when I can explore different stories in one place.',
	},
	{
		id: 2,
		name: 'Arjun Verma',
		type: 'Avid Reader',
		rating: 5,
		review:
			'I enjoy browsing book collections and discovering titles I might otherwise miss.',
	},
	{
		id: 3,
		name: 'Ananya Patel',
		type: 'Book Enthusiast',
		rating: 4,
		review:
			'A lovely place to explore books and find something new to enjoy in my free time.',
	},
	{
		id: 4,
		name: 'Kabir Mehta',
		type: 'Regular Reader',
		rating: 5,
		review:
			'Having different kinds of stories together makes choosing my next book enjoyable.',
	},
	{
		id: 5,
		name: 'Meera Joshi',
		type: 'Weekend Reader',
		rating: 5,
		review:
			'I like being able to browse a collection and take my time choosing a book.',
	},
	{
		id: 6,
		name: 'Aditya Rao',
		type: 'Book Collector',
		rating: 4,
		review:
			'The collection gives me a good starting point whenever I want something new to read.',
	},
	{
		id: 7,
		name: 'Ishita Kapoor',
		type: 'Story Lover',
		rating: 5,
		review:
			'Exploring books is one of my favourite ways to discover new worlds and characters.',
	},
	{
		id: 8,
		name: 'Dev Malhotra',
		type: 'Fiction Fan',
		rating: 5,
		review:
			'A convenient way to browse titles and look for my next weekend read.',
	},
]

export default function Reviews() {
	return (
		<section className="bg-secondary px-4 py-16 sm:px-6 lg:px-12 lg:py-20">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 text-center">
					<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
						Reader experiences
					</p>
					<h2 className="text-3xl font-bold sm:text-4xl">
						Words From Book Lovers
					</h2>
					<p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
						Every book has a story. Every reader has one to share.
					</p>
					<p className="mt-2 text-xs text-muted">
						Sample reviews for development preview.
					</p>
				</div>

				<Swiper
					modules={[Navigation, Pagination]}
					navigation
					pagination={{ clickable: true }}
					slidesPerView={1}
					spaceBetween={20}
					breakpoints={{
						640: {
							slidesPerView: 2,
							spaceBetween: 20,
						},
						1024: {
							slidesPerView: 3,
							spaceBetween: 24,
						},
					}}
					className="!pb-12"
					style={{ '--swiper-theme-color': '#027a36' }}
				>
					{reviews.map((review) => (
						<SwiperSlide key={review.id} className="h-auto">
							<article className="flex h-full min-h-[270px] flex-col border border-border bg-white p-6 sm:p-7">
								<div
									className="mb-5 flex gap-1 text-primary"
									aria-label={`${review.rating} out of 5 stars`}
								>
									{Array.from({ length: 5 }, (_, index) => (
										<FiStar
											key={index}
											size={17}
											fill={index < review.rating ? 'currentColor' : 'none'}
										/>
									))}
								</div>

								<blockquote className="flex-1 text-sm leading-7 text-muted">
									“{review.review}”
								</blockquote>

								<div className="mt-6 border-t border-border pt-5">
									<h3 className="font-semibold">{review.name}</h3>
									<p className="mt-1 text-sm text-muted">{review.type}</p>
								</div>
							</article>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	)
}
