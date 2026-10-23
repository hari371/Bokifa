import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
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

export default function BlogDetails() {
	const { id } = useParams()
	const [blog, setBlog] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let active = true

		const fetchBlog = async () => {
			try {
				const response = await api.get('/blogs')
				const blogs = extractBlogs(response.data)

				const selectedBlog = blogs.find(
					(item) => String(item.id ?? item.blog_id) === String(id),
				)

				if (active) {
					setBlog(selectedBlog || null)
					setError('')
				}
			} catch {
				if (active) {
					setError('Unable to load this article. Please try again later.')
				}
			} finally {
				if (active) setLoading(false)
			}
		}

		fetchBlog()

		return () => {
			active = false
		}
	}, [id])

	if (loading) {
		return (
			<section className="px-4 py-16 text-center text-muted">
				Loading article...
			</section>
		)
	}

	if (error) {
		return (
			<section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
				<p className="text-red-600">{error}</p>
				<Link
					to="/blogs"
					className="mt-5 inline-flex items-center gap-2 font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
				>
					<FiArrowLeft />
					Back to Blogs
				</Link>
			</section>
		)
	}

	if (!blog) {
		return (
			<section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
				<h1 className="text-2xl font-bold">Article not found</h1>
				<p className="mt-3 text-muted">
					This article may no longer be available.
				</p>
				<Link
					to="/blogs"
					className="mt-5 inline-flex items-center gap-2 font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
				>
					<FiArrowLeft />
					Back to Blogs
				</Link>
			</section>
		)
	}

	const title = blog.title || 'Untitled article'
	const image = getImageUrl(blog.image_url || blog.image)
	const author = getAuthorName(blog)

	return (
		<article className="min-h-screen px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
			<div className="mx-auto max-w-4xl">
				<Link
					to="/blogs"
					className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition ease-in-out duration-500 hover:text-primary"
				>
					<FiArrowLeft size={18} />
					Back to Blogs
				</Link>

				<header className="mb-8">
					<p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
						From the Bokifa Blog
					</p>

					<h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
						{title}
					</h1>

					{author && (
						<p className="mt-4 text-sm text-muted">
							By <span className="font-semibold text-foreground">{author}</span>
						</p>
					)}
				</header>

				{image && (
					<div className="mb-8 overflow-hidden rounded-xl bg-secondary">
						<img
							src={image}
							alt={title}
							className="max-h-[560px] w-full object-cover"
						/>
					</div>
				)}

				<div className="max-w-none">
					<h2 className="mb-4 text-xl font-bold">About this article</h2>
					<div className="whitespace-pre-line text-sm leading-8 text-muted sm:text-base">
						{blog.description || 'No article description is available yet.'}
					</div>
				</div>

				<div className="mt-12 border-t border-border pt-6">
					<Link
						to="/blogs"
						className="inline-flex items-center gap-2 font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
					>
						<FiArrowLeft />
						Explore More Articles
					</Link>
				</div>
			</div>
		</article>
	)
}
