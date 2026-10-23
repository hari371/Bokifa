import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import api from '../../services/api'

const serverBaseUrl = (
	import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '')

const getImageUrl = (image) => {
	if (!image) return ''
	if (/^https?:\/\//i.test(image)) return image

	return `${serverBaseUrl}/${image.replace(/^\/+/, '')}`
}

const extractBlogs = (payload) => {
	if (Array.isArray(payload)) {
		if (payload.length === 1 && Array.isArray(payload[0])) {
			return extractBlogs(payload[0])
		}

		return payload
	}

	if (!payload || typeof payload !== 'object') return []

	for (const key of ['blogs', 'data', 'results', 'items', 'rows']) {
		if (payload[key] !== undefined) {
			return extractBlogs(payload[key])
		}
	}

	return []
}

const getAuthorName = (blog) => {
	if (typeof blog.author === 'string') return blog.author

	if (blog.author && typeof blog.author === 'object') {
		return blog.author.name || blog.author.author_name || ''
	}

	return blog.author_name || ''
}

export default function Blogs() {
	const [blogs, setBlogs] = useState([])
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let active = true

		const fetchBlogs = async () => {
			try {
				const response = await api.get('/blogs')

				if (active) {
					setBlogs(extractBlogs(response.data))
					setError('')
				}
			} catch {
				if (active) {
					setError('Unable to load blog posts. Please try again later.')
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

	const filteredBlogs = useMemo(() => {
		const query = search.trim().toLowerCase()

		if (!query) return blogs

		return blogs.filter((blog) => {
			const title = String(blog.title || '').toLowerCase()
			const description = String(blog.description || '').toLowerCase()
			const author = getAuthorName(blog).toLowerCase()

			return (
				title.includes(query) ||
				description.includes(query) ||
				author.includes(query)
			)
		})
	}, [blogs, search])

	return (
		<section className="min-h-screen px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 text-center">
					<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
						Stories, news and inspiration
					</p>
					<h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
						The Bokifa Blog
					</h1>
					<p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
						Explore articles and discover more from the world of books.
					</p>
				</div>

				<div className="mx-auto mb-8 max-w-xl">
					<label htmlFor="blog-search" className="mb-2 block text-sm font-medium">
						Search articles
					</label>

					<div className="relative">
						<FiSearch
							size={18}
							className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
						/>

						<input
							id="blog-search"
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search by title, author or topic..."
							className="w-full border border-border bg-white py-3 pl-11 pr-11 text-sm outline-none transition ease-in-out duration-500 focus:border-primary"
						/>

						{search && (
							<button
								type="button"
								onClick={() => setSearch('')}
								aria-label="Clear search"
								className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted transition ease-in-out duration-500 hover:text-primary"
							>
								<FiX size={18} />
							</button>
						)}
					</div>
				</div>

				<div className="mb-6">
					<p className="text-sm text-muted">
						{loading
							? 'Loading articles...'
							: `${filteredBlogs.length} ${filteredBlogs.length === 1 ? 'article' : 'articles'} found`}
					</p>
				</div>

				{loading ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }, (_, index) => (
							<div key={index} className="animate-pulse">
								<div className="aspect-[16/10] bg-secondary" />
								<div className="mt-4 h-5 w-3/4 bg-secondary" />
								<div className="mt-3 h-3 w-full bg-secondary" />
								<div className="mt-2 h-3 w-4/5 bg-secondary" />
							</div>
						))}
					</div>
				) : error ? (
					<div className="py-16 text-center">
						<p className="text-red-600">{error}</p>
					</div>
				) : filteredBlogs.length === 0 ? (
					<div className="border border-border py-16 text-center">
						<h2 className="text-xl font-semibold">
							{blogs.length === 0 ? 'No blog posts available yet' : 'No articles found'}
						</h2>
						<p className="mt-2 text-sm text-muted">
							{blogs.length === 0
								? 'Published blog posts will appear here.'
								: 'Try a different title, author, or search term.'}
						</p>
						{search && (
							<button
								type="button"
								onClick={() => setSearch('')}
								className="mt-5 font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
							>
								Clear search
							</button>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
						{filteredBlogs.map((blog, index) => {
							const id = blog.id ?? blog.blog_id
							const title = blog.title || 'Untitled article'
							const image = blog.image_url || blog.image
							const author = getAuthorName(blog)

							return (
								<Link
									key={id ?? `${title}-${index}`}
									to={`/blogs/${id}`}
									className="group flex min-w-0 flex-col overflow-hidden border border-border bg-white transition ease-in-out duration-500 hover:-translate-y-1 hover:shadow-lg"
								>
									<div className="aspect-[16/10] overflow-hidden bg-secondary">
										{image ? (
											<img
												src={getImageUrl(image)}
												alt={title}
												loading="lazy"
												className="size-full object-cover transition ease-in-out duration-500 group-hover:scale-105"
											/>
										) : (
											<div className="flex size-full items-center justify-center text-sm text-muted">
												Image unavailable
											</div>
										)}
									</div>

									<div className="flex flex-1 flex-col p-5 sm:p-6">
										{author && (
											<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
												By {author}
											</p>
										)}

										<h2 className="text-xl font-bold leading-snug transition ease-in-out duration-500 group-hover:text-primary">
											{title}
										</h2>

										<p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted">
											{blog.description || 'Discover more from the Bokifa blog.'}
										</p>

										<span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
											Read Article
											<span className="transition ease-in-out duration-500 group-hover:translate-x-1">
												→
											</span>
										</span>
									</div>
								</Link>
							)
						})}
					</div>
				)}
			</div>
		</section>
	)
}
