
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
	FiArrowLeft,
	FiBookOpen,
	FiEdit2,
	FiFileText,
	FiImage,
	FiPlus,
	FiTrash2,
	FiUsers,
	FiX,
} from 'react-icons/fi'
import api from '../services/api'

const configurations = {
	authors: {
		title: 'Authors',
		singular: 'Author',
		endpoint: '/admin/authors',
		nameField: 'name',
		icon: FiUsers,
		fields: [
			{ name: 'name', label: 'Author Name', required: true },
			{ name: 'bio', label: 'Biography', type: 'textarea' },
			{ name: 'image_url', label: 'Profile Image', type: 'file' },
		],
	},
	books: {
		title: 'Books',
		singular: 'Book',
		endpoint: '/admin/books',
		nameField: 'title',
		icon: FiBookOpen,
		fields: [
			{ name: 'title', label: 'Book Title', required: true },
			{ name: 'description', label: 'Description', type: 'textarea' },
			{
				name: 'price',
				label: 'Price (₹)',
				type: 'number',
				required: true,
			},
			{ name: 'image_url', label: 'Book Cover', type: 'file' },
		],
		hasAuthor: true,
	},
	blogs: {
		title: 'Blogs',
		singular: 'Blog',
		endpoint: '/admin/blogs',
		nameField: 'title',
		icon: FiFileText,
		fields: [
			{ name: 'title', label: 'Blog Title', required: true },
			{ name: 'description', label: 'Description', type: 'textarea' },
			{ name: 'image_url', label: 'Blog Image', type: 'file' },
		],
		hasAuthor: true,
	},
}

const emptyForm = (config) => {
	const values = {}

	config.fields.forEach((field) => {
		values[field.name] = ''
	})

	if (config.hasAuthor) {
		values.author_id = ''
	}

	return values
}

const extractItems = (payload, collectionKey) => {
	if (Array.isArray(payload)) {
		if (payload.length === 1 && Array.isArray(payload[0])) {
			return extractItems(payload[0], collectionKey)
		}

		return payload
	}

	if (!payload || typeof payload !== 'object') {
		return []
	}

	for (const key of [collectionKey, 'data', 'items', 'results', 'rows']) {
		if (payload[key] !== undefined) {
			return extractItems(payload[key], collectionKey)
		}
	}

	return []
}

const getRecordId = (item) =>
	item.id ?? item.book_id ?? item.author_id ?? item.blog_id

const getAuthorName = (item) => {
	if (typeof item.author === 'string') return item.author

	if (item.author && typeof item.author === 'object') {
		return item.author.name || item.author.author_name || ''
	}

	return item.author_name || ''
}

const apiBaseUrl = (
	import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '')

const getImageUrl = (image) => {
	if (!image) return ''
	if (/^https?:\/\//i.test(image)) return image

	return `${apiBaseUrl}/${image.replace(/^\/+/, '')}`
}

const inputClass =
	'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition ease-in-out duration-500 focus:border-[#183b32] focus:ring-2 focus:ring-[#183b32]/10'

const primaryButtonClass =
	'inline-flex items-center justify-center gap-2 rounded-lg bg-[#183b32] px-5 py-3 text-sm font-semibold text-white transition ease-in-out duration-500 hover:bg-[#285749] disabled:cursor-not-allowed disabled:opacity-60'

export default function ContentManager() {
	const { type } = useParams()
	const navigate = useNavigate()
	const config = configurations[type]

	const [recordsState, setRecordsState] = useState({
		type: '',
		items: [],
	})
	const [authorsState, setAuthorsState] = useState({
		type: '',
		items: [],
	})
	const [loadedType, setLoadedType] = useState('')
	const [errorState, setErrorState] = useState({
		type: '',
		message: '',
	})
	const [successState, setSuccessState] = useState({
		type: '',
		message: '',
	})
	const [formState, setFormState] = useState({
		type: '',
		values: {},
	})
	const [editingState, setEditingState] = useState({
		type: '',
		id: null,
	})
	const [imageState, setImageState] = useState({
		type: '',
		file: null,
	})
	const [saving, setSaving] = useState(false)

	const items = recordsState.type === type ? recordsState.items : []
	const authors = authorsState.type === type ? authorsState.items : []
	const form =
		formState.type === type
			? formState.values
			: config
				? emptyForm(config)
				: {}
	const editingId = editingState.type === type ? editingState.id : null
	const selectedImage = imageState.type === type ? imageState.file : null
	const loading = loadedType !== type
	const error = errorState.type === type ? errorState.message : ''
	const success = successState.type === type ? successState.message : ''

	useEffect(() => {
		if (!config) return undefined

		let active = true

		const loadData = async () => {
			try {
				const itemResponse = await api.get(config.endpoint)
				const nextItems = extractItems(itemResponse.data, type)

				let nextAuthors = []

				if (config.hasAuthor) {
					const authorResponse = await api.get('/admin/authors')
					nextAuthors = extractItems(authorResponse.data, 'authors')
				}

				if (active) {
					setRecordsState({ type, items: nextItems })
					setAuthorsState({ type, items: nextAuthors })
					setErrorState({ type, message: '' })
					setLoadedType(type)
				}
			} catch (requestError) {
				if (active) {
					setErrorState({
						type,
						message:
							requestError.response?.data?.message ||
							'Unable to load records. Please check your admin session.',
					})
					setLoadedType(type)
				}
			}
		}

		loadData()

		return () => {
			active = false
		}
	}, [type])

	const resetForm = () => {
		setFormState({ type, values: emptyForm(config) })
		setEditingState({ type, id: null })
		setImageState({ type, file: null })
		setErrorState({ type, message: '' })
		setSuccessState({ type, message: '' })
	}

	const handleChange = (event) => {
		const { name, value } = event.target

		setFormState((previous) => ({
			type,
			values: {
				...(previous.type === type ? previous.values : emptyForm(config)),
				[name]: value,
			},
		}))
	}

	const handleImageChange = (event) => {
		setImageState({
			type,
			file: event.target.files?.[0] || null,
		})
	}

	const handleEdit = (item) => {
		const nextForm = emptyForm(config)

		config.fields.forEach((field) => {
			nextForm[field.name] = item[field.name] ?? ''
		})

		if (config.hasAuthor) {
			nextForm.author_id =
				item.author_id != null ? String(item.author_id) : ''
		}

		setFormState({ type, values: nextForm })
		setEditingState({ type, id: getRecordId(item) })
		setImageState({ type, file: null })
		setErrorState({ type, message: '' })
		setSuccessState({ type, message: '' })

		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const refreshItems = async () => {
		const response = await api.get(config.endpoint)

		setRecordsState({
			type,
			items: extractItems(response.data, type),
		})

		if (config.hasAuthor) {
			const authorResponse = await api.get('/admin/authors')

			setAuthorsState({
				type,
				items: extractItems(authorResponse.data, 'authors'),
			})
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setSaving(true)
		setErrorState({ type, message: '' })
		setSuccessState({ type, message: '' })

		const payload = { ...form }

		if (config.hasAuthor) {
			if (!payload.author_id) {
				setErrorState({
					type,
					message: 'Please select an author.',
				})
				setSaving(false)
				return
			}

			payload.author_id = Number(payload.author_id)
		}

		if (type === 'books') {
			payload.price = Number(payload.price)

			if (!Number.isFinite(payload.price) || payload.price < 0) {
				setErrorState({
					type,
					message: 'Please enter a valid non-negative price.',
				})
				setSaving(false)
				return
			}
		}

		const formData = new FormData()

		Object.entries(payload).forEach(([key, value]) => {
			formData.append(key, value ?? '')
		})

		if (selectedImage) {
			formData.append('image', selectedImage)
		}

		try {
			if (editingId != null) {
				await api.put(`${config.endpoint}/${editingId}`, formData)
			} else {
				await api.post(config.endpoint, formData)
			}

			setSuccessState({
				type,
				message: `${config.singular} ${
					editingId != null ? 'updated' : 'created'
				} successfully.`,
			})
			setFormState({ type, values: emptyForm(config) })
			setEditingState({ type, id: null })
			setImageState({ type, file: null })

			const fileInput = document.getElementById('image_url')
			if (fileInput) fileInput.value = ''

			try {
				await refreshItems()
			} catch {
				setErrorState({
					type,
					message: 'Saved successfully, but the list could not be refreshed.',
				})
			}
		} catch (requestError) {
			setErrorState({
				type,
				message:
					requestError.response?.data?.message ||
					`Failed to save ${config.singular.toLowerCase()}.`,
			})
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async (item) => {
		const itemName = item[config.nameField] || config.singular

		if (
			!window.confirm(
				`Delete "${itemName}"? This action cannot be undone.`,
			)
		) {
			return
		}

		setErrorState({ type, message: '' })
		setSuccessState({ type, message: '' })

		try {
			await api.delete(`${config.endpoint}/${getRecordId(item)}`)

			setSuccessState({
				type,
				message: `${config.singular} deleted successfully.`,
			})

			setRecordsState((previous) => ({
				type,
				items:
					previous.type === type
						? previous.items.filter(
								(entry) =>
									String(getRecordId(entry)) !==
									String(getRecordId(item)),
							)
						: [],
			}))
		} catch (requestError) {
			setErrorState({
				type,
				message:
					requestError.response?.data?.message ||
					`Failed to delete ${config.singular.toLowerCase()}.`,
			})
		}
	}

	const handleLogout = () => {
		localStorage.removeItem('bokifa_token')
		localStorage.removeItem('bokifa_admin')
		navigate('/admin/login', { replace: true })
	}

	if (!config) {
		return (
			<main className="min-h-screen bg-[#f7f4ee] px-4 py-16 text-center">
				<h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
				<Link
					to="/admin/dashboard"
					className="mt-5 inline-flex items-center gap-2 font-semibold text-[#183b32] hover:underline"
				>
					<FiArrowLeft />
					Return to Dashboard
				</Link>
			</main>
		)
	}

	const Icon = config.icon

	return (
		<main className="min-h-screen bg-[#f7f4ee]">
			<header className="border-b border-gray-200 bg-white">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-8">
					<div>
						<Link
							to="/admin/dashboard"
							className="text-2xl font-bold tracking-wide text-[#183b32]"
						>
							BOKIFA
						</Link>
						<p className="mt-1 text-xs tracking-widest text-gray-500">
							CONTENT MANAGEMENT
						</p>
					</div>

					<div className="flex items-center gap-3">
						<Link
							to="/admin/dashboard"
							className="hidden items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition ease-in-out duration-500 hover:bg-gray-100 sm:inline-flex"
						>
							<FiArrowLeft size={16} />
							Dashboard
						</Link>
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition ease-in-out duration-500 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
						>
							Log Out
						</button>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
				<div className="mb-8">
					<Link
						to="/admin/dashboard"
						className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition ease-in-out duration-500 hover:text-[#183b32] sm:hidden"
					>
						<FiArrowLeft size={16} />
						Dashboard
					</Link>

					<p className="text-sm font-semibold uppercase tracking-widest text-[#98703b]">
						Admin Workspace
					</p>
					<div className="mt-3 flex items-center gap-4">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#e9f0eb] text-[#183b32]">
							<Icon size={23} />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
								Manage {config.title}
							</h1>
							<p className="mt-1 text-sm text-gray-600">
								Create, edit, and maintain your {config.title.toLowerCase()}.
							</p>
						</div>
					</div>
				</div>

				{error && (
					<div
						role="alert"
						className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
					>
						{error}
					</div>
				)}

				{success && (
					<div
						role="status"
						className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
					>
						{success}
					</div>
				)}

				<section className="mb-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
					<div className="mb-6 flex items-center justify-between gap-4">
						<div>
							<h2 className="text-xl font-bold text-gray-900">
								{editingId != null
									? `Edit ${config.singular}`
									: `Add ${config.singular}`}
							</h2>
							<p className="mt-1 text-sm text-gray-500">
								Enter the information below.
							</p>
						</div>

						{editingId != null && (
							<button
								type="button"
								onClick={resetForm}
								className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#183b32]"
							>
								<FiX size={17} />
								Cancel
							</button>
						)}
					</div>

					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
							{config.fields.map((field) => (
								<div
									key={field.name}
									className={field.type === 'textarea' ? 'md:col-span-2' : ''}
								>
									<label
										htmlFor={field.name}
										className="mb-2 block text-sm font-medium text-gray-700"
									>
										{field.label}
										{field.required && (
											<span className="ml-1 text-red-600">*</span>
										)}
									</label>

									{field.type === 'textarea' ? (
										<textarea
											id={field.name}
											name={field.name}
											value={form[field.name] ?? ''}
											onChange={handleChange}
											required={field.required}
											rows={4}
											className={`${inputClass} resize-y`}
										/>
									) : field.type === 'file' ? (
										<div>
											<input
												id={field.name}
												name="image"
												type="file"
												accept="image/jpeg,image/png,image/webp,image/gif"
												onChange={handleImageChange}
												className={inputClass}
											/>

											{selectedImage && (
												<p className="mt-2 text-xs text-[#183b32]">
													Selected: {selectedImage.name}
												</p>
											)}

											{!selectedImage && form.image_url && (
												<div className="mt-3 flex items-center gap-3">
													<img
														src={getImageUrl(form.image_url)}
														alt="Current image"
														className="size-16 rounded-lg border border-gray-200 object-cover"
														onError={(event) => {
															event.currentTarget.style.display = 'none'
														}}
													/>
													<div className="min-w-0">
														<p className="text-xs font-medium text-gray-700">
															Current image
														</p>
														<p className="mt-1 break-all text-xs text-gray-500">
															{form.image_url}
														</p>
													</div>
												</div>
											)}

											<p className="mt-2 text-xs text-gray-500">
												JPG, PNG, WEBP, or GIF. Maximum size: 5 MB.
											</p>
										</div>
									) : (
										<input
											id={field.name}
											name={field.name}
											type={field.type === 'number' ? 'number' : 'text'}
											value={form[field.name] ?? ''}
											onChange={handleChange}
											required={field.required}
											min={field.type === 'number' ? '0' : undefined}
											step={field.type === 'number' ? '0.01' : undefined}
											className={inputClass}
										/>
									)}
								</div>
							))}

							{config.hasAuthor && (
								<div className="md:col-span-2">
									<label
										htmlFor="author_id"
										className="mb-2 block text-sm font-medium text-gray-700"
									>
										Author <span className="text-red-600">*</span>
									</label>
									<select
										id="author_id"
										name="author_id"
										value={form.author_id ?? ''}
										onChange={handleChange}
										required
										className={inputClass}
									>
										<option value="">Select an author</option>
										{authors.map((author) => {
											const authorId = getRecordId(author)

											return (
												<option key={authorId} value={String(authorId)}>
													{author.name || author.author_name}
												</option>
											)
										})}
									</select>

									{authors.length === 0 && !loading && (
										<p className="mt-2 text-xs text-amber-700">
											No authors found. Add an author before creating this
											{` ${config.singular.toLowerCase()}`}.
										</p>
									)}
								</div>
							)}
						</div>

						<div className="mt-6 flex flex-wrap gap-3">
							<button
								type="submit"
								disabled={saving || loading}
								className={primaryButtonClass}
							>
								{editingId != null ? (
									<FiEdit2 size={17} />
								) : (
									<FiPlus size={18} />
								)}
								{saving
									? 'Saving...'
									: editingId != null
										? `Update ${config.singular}`
										: `Create ${config.singular}`}
							</button>

							{editingId != null && (
								<button
									type="button"
									onClick={resetForm}
									className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition ease-in-out duration-500 hover:bg-gray-100"
								>
									Cancel
								</button>
							)}
						</div>
					</form>
				</section>

				<section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
					<div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-8">
						<div>
							<h2 className="text-xl font-bold text-gray-900">
								All {config.title}
							</h2>
							<p className="mt-1 text-sm text-gray-500">
								{items.length} {items.length === 1 ? 'record' : 'records'}
							</p>
						</div>
						<Icon size={22} className="text-[#183b32]" />
					</div>

					{loading ? (
						<p className="px-5 py-12 text-center text-sm text-gray-500">
							Loading {config.title.toLowerCase()}...
						</p>
					) : items.length === 0 ? (
						<div className="px-5 py-12 text-center">
							<FiImage size={30} className="mx-auto text-gray-400" />
							<h3 className="mt-4 font-semibold text-gray-900">
								No {config.title.toLowerCase()} yet
							</h3>
							<p className="mt-2 text-sm text-gray-500">
								Create your first {config.singular.toLowerCase()} using the
								form above.
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full min-w-[680px] text-left">
								<thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
									<tr>
										<th className="px-5 py-4 font-semibold sm:px-8">
											{config.singular}
										</th>
										<th className="px-5 py-4 font-semibold">
											{config.hasAuthor ? 'Author' : 'Details'}
										</th>
										{type === 'books' && (
											<th className="px-5 py-4 font-semibold">Price</th>
										)}
										<th className="px-5 py-4 text-right font-semibold sm:px-8">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{items.map((item, index) => {
										const id = getRecordId(item)
										const title = item[config.nameField] || config.singular
										const image = item.image_url || item.image
										const authorId =
											item.author_id ??
											item.author?.id ??
											item.author?.author_id

										const selectedAuthor = authors.find(
											(author) =>
												String(getRecordId(author)) === String(authorId),
										)

										const authorName =
											getAuthorName(item) ||
											selectedAuthor?.name ||
											selectedAuthor?.author_name ||
											''

										return (
											<tr key={id ?? `${title}-${index}`}>
												<td className="px-5 py-4 sm:px-8">
													<div className="flex min-w-0 items-center gap-3">
														{image ? (
															<img
																src={getImageUrl(image)}
																alt=""
																className="size-12 shrink-0 rounded-lg bg-gray-100 object-cover"
																onError={(event) => {
																	event.currentTarget.style.visibility = 'hidden'
																}}
															/>
														) : (
															<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#e9f0eb] text-[#183b32]">
																<Icon size={20} />
															</div>
														)}

														<div className="min-w-0">
															<p className="truncate font-semibold text-gray-900">
																{title}
															</p>
															{(type === 'authors' || type === 'blogs') &&
																item.description && (
																	<p className="mt-1 max-w-xs truncate text-xs text-gray-500">
																		{item.description}
																	</p>
																)}
															{type === 'authors' && item.bio && (
																<p className="mt-1 max-w-xs truncate text-xs text-gray-500">
																	{item.bio}
																</p>
															)}
														</div>
													</div>
												</td>

												<td className="px-5 py-4 text-sm text-gray-600">
													{config.hasAuthor
														? authorName || 'Author not assigned'
														: 'Author profile'}
												</td>

												{type === 'books' && (
													<td className="px-5 py-4 text-sm font-semibold text-gray-800">
														₹{Number(item.price || 0).toLocaleString('en-IN')}
													</td>
												)}

												<td className="px-5 py-4 sm:px-8">
													<div className="flex justify-end gap-2">
														<button
															type="button"
															onClick={() => handleEdit(item)}
															title={`Edit ${title}`}
															aria-label={`Edit ${title}`}
															className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition ease-in-out duration-500 hover:border-[#183b32] hover:bg-[#e9f0eb] hover:text-[#183b32]"
														>
															<FiEdit2 size={16} />
														</button>
														<button
															type="button"
															onClick={() => handleDelete(item)}
															title={`Delete ${title}`}
															aria-label={`Delete ${title}`}
															className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition ease-in-out duration-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
														>
															<FiTrash2 size={16} />
														</button>
													</div>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					)}
				</section>
			</div>
		</main>
	)
}
