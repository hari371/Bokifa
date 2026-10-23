import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import api from '../../../services/api'

const getImageUrl = (image) => {
	if (!image) return ''
	if (/^https?:\/\//i.test(image)) return image

	return `http://localhost:5000/${image.replace(/^\/+/, '')}`
}

export default function FeaturedAuthors() {
	const [authors, setAuthors] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let active = true

		const fetchAuthors = async () => {
			try {
				const response = await api.get('/authors')
				const data = response.data

				const items = Array.isArray(data)
					? data
					: Array.isArray(data.authors)
						? data.authors
						: Array.isArray(data.data)
							? data.data
							: []

				if (active) {
					setAuthors(items)
				}
			} catch {
				if (active) {
					setError('Unable to load authors right now.')
				}
			} finally {
				if (active) {
					setLoading(false)
				}
			}
		}

		fetchAuthors()

		return () => {
			active = false
		}
	}, [])

	return (
		<section className="px-4 py-16 sm:px-6 lg:px-12 lg:py-20">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 text-center">
					<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
						Meet the storytellers
					</p>
					<h2 className="text-3xl font-bold sm:text-4xl">
						Our Featured Authors
					</h2>
					<p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
						Discover the authors behind your next favourite read.
					</p>
				</div>

				{loading ? (
					<p className="py-10 text-center text-muted">Loading authors...</p>
				) : error ? (
					<p className="py-10 text-center text-red-600">{error}</p>
				) : authors.length === 0 ? (
					<p className="py-10 text-center text-muted">
						No authors available yet.
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
								slidesPerView: 5,
								spaceBetween: 24,
							},
						}}
						className="!pb-12"
						style={{ '--swiper-theme-color': '#027a36' }}
					>
						{authors.map((author) => {
							const name = author.name || author.author_name || 'Author'
							const image = author.image_url || author.image
							const id = author.id ?? author.author_id ?? name

							return (
								<SwiperSlide key={id} className="h-auto">
									<article className="flex h-full flex-col items-center px-2 text-center">
										<div className="size-28 shrink-0 overflow-hidden rounded-full bg-secondary sm:size-32 lg:size-36">
											{image ? (
												<img
													src={getImageUrl(image)}
													alt={name}
													loading="lazy"
													className="size-full rounded-full object-cover"
												/>
											) : (
												<div className="flex size-full items-center justify-center rounded-full text-4xl font-bold text-primary">
													{name.charAt(0).toUpperCase()}
												</div>
											)}
										</div>

										<h3 className="mt-4 text-base font-semibold">
											{name}
										</h3>

										{author.bio && (
											<p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
												{author.bio}
											</p>
										)}
									</article>
								</SwiperSlide>
							)
						})}
					</Swiper>
				)}
			</div>
		</section>
	)
}
