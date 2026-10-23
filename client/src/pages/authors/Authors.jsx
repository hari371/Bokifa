import { useEffect, useMemo, useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import api from '../../services/api'
import { Link } from 'react-router-dom'

const serverBaseUrl = (
	import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '')

const getImageUrl = (image) => {
	if (!image) return ''
	if (/^https?:\/\//i.test(image)) return image

	return `${serverBaseUrl}/${image.replace(/^\/+/, '')}`
}

const extractAuthors = (payload) => {
	if (Array.isArray(payload)) {
		if (payload.length === 1 && Array.isArray(payload[0])) {
			return extractAuthors(payload[0])
		}

		return payload
	}

	if (!payload || typeof payload !== 'object') return []

	for (const key of ['authors', 'data', 'results', 'items', 'rows']) {
		if (payload[key] !== undefined) {
			return extractAuthors(payload[key])
		}
	}

	return []
}

const controlClass =
	'w-full border border-border bg-white py-3 pl-11 pr-4 text-sm outline-none transition ease-in-out duration-500 focus:border-primary'

export default function Authors() {
	const [authors, setAuthors] = useState([])
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let active = true

		const fetchAuthors = async () => {
			try {
				const response = await api.get('/authors')
				const items = extractAuthors(response.data)

				if (active) {
					setAuthors(items)
					setError('')
				}
			} catch {
				if (active) {
					setError('Unable to load authors. Please try again later.')
				}
			} finally {
				if (active) setLoading(false)
			}
		}

		fetchAuthors()

		return () => {
			active = false
		}
	}, [])

	const filteredAuthors = useMemo(() => {
		const query = search.trim().toLowerCase()

		if (!query) return authors

		return authors.filter((author) => {
			const name = String(author.name || author.author_name || '').toLowerCase()
			const bio = String(author.bio || '').toLowerCase()

			return name.includes(query) || bio.includes(query)
		})
	}, [authors, search])

	return (
		<section className="min-h-screen px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 text-center">
					<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
						Meet the storytellers
					</p>
					<h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
						Our Authors
					</h1>
					<p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
						Get to know the authors behind the stories in our collection.
					</p>
				</div>

				<div className="mx-auto mb-8 max-w-xl">
					<label htmlFor="author-search" className="mb-2 block text-sm font-medium">
						Search authors
					</label>
					<div className="relative">
						<FiSearch
							size={18}
							className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
						/>
						<input
							id="author-search"
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search by author name or bio..."
							className={controlClass}
						/>
						{search && (
							<button
								type="button"
								onClick={() => setSearch('')}
								aria-label="Clear author search"
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
							? 'Loading authors...'
							: `${filteredAuthors.length} ${filteredAuthors.length === 1 ? 'author' : 'authors'} found`}
					</p>
				</div>

				{loading ? (
					<div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
						{Array.from({ length: 8 }, (_, index) => (
							<div key={index} className="flex animate-pulse flex-col items-center">
								<div className="size-28 rounded-full bg-secondary sm:size-32 lg:size-36" />
								<div className="mt-4 h-4 w-2/3 bg-secondary" />
								<div className="mt-3 h-3 w-full bg-secondary" />
								<div className="mt-2 h-3 w-4/5 bg-secondary" />
							</div>
						))}
					</div>
				) : error ? (
					<div className="py-16 text-center">
						<p className="text-red-600">{error}</p>
					</div>
				) : filteredAuthors.length === 0 ? (
					<div className="border border-border py-16 text-center">
						<h2 className="text-xl font-semibold">
							{authors.length === 0 ? 'No authors available yet' : 'No authors found'}
						</h2>
						<p className="mt-2 text-sm text-muted">
							{authors.length === 0
								? 'Authors will appear here when they are available.'
								: 'Try another name or search term.'}
						</p>
						{search && (
							<button
								type="button"
								onClick={() => setSearch('')}
								className="mt-5 inline-flex items-center gap-2 font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
							>
								<FiX size={16} />
								Clear search
							</button>
						)}
					</div>
				) : (
					<div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
						{filteredAuthors.map((author, index) => {
							const name = author.name || author.author_name || 'Author'
							const image = author.image_url || author.image
							const bio = author.bio || ''
							const id = author.id ?? author.author_id ?? `${name}-${index}`

							return (
								<Link
                                    key={id}
                                    to={`/authors/${id}`}
                                    className="group flex min-w-0 flex-col items-center text-center"
                                >
                                    <div className="size-28 shrink-0 overflow-hidden rounded-full bg-secondary sm:size-32 lg:size-36">
                                        {image ? (
                                            <img
                                                src={getImageUrl(image)}
                                                alt={name}
                                                loading="lazy"
                                                className="size-full rounded-full object-cover transition ease-in-out duration-500 group-hover:scale-105"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = 'none'
                                                }}
                                            />
                                        ) : (
                                            <div className="flex size-full items-center justify-center rounded-full text-4xl font-bold text-primary">
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="mt-4 text-base font-semibold transition ease-in-out duration-500 group-hover:text-primary sm:text-lg">
                                        {name}
                                    </h2>

                                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted">
                                        {bio || 'Explore this author’s books in the Bokifa collection.'}
                                    </p>
                                </Link>
							)
						})}
					</div>
				)}
			</div>
		</section>
	)
}
