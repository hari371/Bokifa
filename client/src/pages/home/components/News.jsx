import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import api from '../../../services/api'

const serverBaseUrl = (
	import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '')

const getImageUrl = (image) => {
	if (!image) return ''
	if (/^https?:\/\//i.test(image)) return image

	return `${serverBaseUrl}/${image.replace(/^\/+/, '')}`
}

const getBlogs = (payload) => {
	if (Array.isArray(payload)) {
		if (payload.length === 1 && Array.isArray(payload[0])) {
			return getBlogs(payload[0])
		}

		return payload
	}

	if (!payload || typeof payload !== 'object') return []

	for (const key of ['blogs', 'data', 'results', 'items', 'rows']) {
		if (payload[key] !== undefined) {
			return getBlogs(payload[key])
		}
	}

	return []
}

export default function News() {
	const [blogs, setBlogs] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let active = true

		const fetchBlogs = async () => {
			try {
				const response = await api.get('/blogs')
				const items = getBlogs(response.data)

				if (active) {
					setBlogs(items)
					setError('')
				}
			} catch {
				if (active) {
					setError('Unable to load blog posts right now.')
				}
			} finally {
				if (active) setLoading(false)
			}
		}

		fetchBlogs()

		return () => {
			active = false
		}
	}, [])

	return (
		<section className="bg-secondary px-4 py-16 sm:px-6 lg:px-12 lg:py-20">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 flex items-end justify-between gap-4">
					<div>
						<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
							From the Bokifa blog
						</p>
						<h2 className="text-3xl font-bold sm:text-4xl">
							Latest News & Stories
						</h2>
						<p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
							Explore book news, reading inspiration, and stories from our blog.
						</p>
					</div>
				</div>

				{loading ? (
					<p className="py-10 text-center text-muted">Loading blog posts...</p>
				) : error ? (
					<p className="py-10 text-center text-red-600">{error}</p>
				) : blogs.length === 0 ? (
					<p className="py-10 text-center text-muted">
						No blog posts available yet.
					</p>
				) : (
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
						{blogs.map((blog, index) => {
							const title = blog.title || 'Untitled blog'
							const image = blog.image_url || blog.image
							const description = blog.description || blog.excerpt || ''
							const author = blog.author_name || blog.author || ''
							const id = blog.id ?? blog.blog_id ?? index

							return (
								<SwiperSlide key={id} className="h-auto">
									<article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition ease-in-out duration-500 hover:-translate-y-1 hover:shadow-lg">
										<div className="aspect-[16/10] overflow-hidden bg-secondary">
											{image ? (
												<img
													src={getImageUrl(image)}
													alt={title}
													loading="lazy"
													className="size-full object-cover transition ease-in-out duration-500 hover:scale-105"
												/>
											) : (
												<div className="flex size-full items-center justify-center text-sm text-muted">
													Image unavailable
												</div>
											)}
										</div>

										<div className="flex flex-1 flex-col p-5 sm:p-6">
											{author && (
												<p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
													By {typeof author === 'string' ? author : author.name || 'Bokifa'}
												</p>
											)}

											<h3 className="text-lg font-bold leading-snug sm:text-xl">
												{title}
											</h3>

											<p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted">
												{description || 'Discover more from the Bokifa blog.'}
											</p>
										</div>
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