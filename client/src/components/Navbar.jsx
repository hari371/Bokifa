
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
	FiSearch,
	FiShoppingCart,
	FiUser,
	FiMenu,
	FiX,
	FiLogOut,
} from 'react-icons/fi'
import logo from '../assets/images/logo.png'

const navLinks = [
	{ label: 'Home', to: '/' },
	{ label: 'Books', to: '/books' },
	{ label: 'Authors', to: '/authors' },
	{ label: 'Blogs', to: '/blogs' },
	{ label: 'Admin', to: '/admin/login' },
]

const readAuthState = () => ({
	isAuthenticated: Boolean(localStorage.getItem('token')),
})

export default function Navbar() {
	const [search, setSearch] = useState('')
	const [menuOpen, setMenuOpen] = useState(false)
	const [auth, setAuth] = useState(readAuthState)
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		setAuth(readAuthState())
		setMenuOpen(false)
	}, [location.pathname])

	useEffect(() => {
		const syncAuth = () => setAuth(readAuthState())

		window.addEventListener('storage', syncAuth)
		window.addEventListener('bokifa-auth-change', syncAuth)

		return () => {
			window.removeEventListener('storage', syncAuth)
			window.removeEventListener('bokifa-auth-change', syncAuth)
		}
	}, [])

	const handleSearch = (event) => {
		event.preventDefault()
		const query = search.trim()

		navigate(query ? `/books?search=${encodeURIComponent(query)}` : '/books')
		setMenuOpen(false)
	}

	const handleLogout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		localStorage.removeItem('bokifa_user')
		setAuth({ isAuthenticated: false })
		setMenuOpen(false)
		window.dispatchEvent(new Event('bokifa-auth-change'))
		navigate('/', { replace: true })
	}

	const navLinkClass = ({ isActive }) =>
		`relative py-3 text-sm font-semibold transition ease-in-out duration-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition after:duration-300 ${
			isActive
				? 'text-primary after:scale-x-100'
				: 'text-foreground hover:text-primary hover:after:scale-x-100'
		}`

	const searchForm = (mobile = false) => (
		<form
			onSubmit={handleSearch}
			className={`flex items-center overflow-hidden rounded-full border border-border bg-secondary/60 transition ease-in-out duration-500 focus-within:border-primary focus-within:bg-white ${
				mobile ? 'w-full' : 'w-full max-w-xl'
			}`}
		>
			<FiSearch className="ml-4 shrink-0 text-muted" size={18} />
			<input
				type="search"
				value={search}
				onChange={(event) => setSearch(event.target.value)}
				placeholder="Search books, authors..."
				aria-label="Search books"
				className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
			/>
			<button
				type="submit"
				aria-label="Submit search"
				className="mr-1.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition ease-in-out duration-500 hover:bg-primary-hover"
			>
				<FiSearch size={16} />
			</button>
		</form>
	)

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-white">
			<div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[88px] lg:px-8">
				<Link to="/" aria-label="Bokifa home" className="shrink-0">
					<img
						src={logo}
						alt="Ap Bokifa"
						className="h-10 w-auto max-w-[145px] object-contain sm:h-11"
					/>
				</Link>

				<div className="hidden min-w-0 flex-1 justify-center px-6 lg:flex">
					{searchForm()}
				</div>

				<div className="flex shrink-0 items-center gap-3 sm:gap-4 lg:gap-5">
					{auth.isAuthenticated ? (
						<button
							type="button"
							onClick={handleLogout}
							className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-foreground transition ease-in-out duration-500 hover:text-primary sm:px-3"
						>
							<FiLogOut size={19} />
							<span className="hidden sm:inline">Log Out</span>
						</button>
					) : (
						<>
							<Link
								to="/login"
								aria-label="Sign in"
								className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-foreground transition ease-in-out duration-500 hover:text-primary sm:px-3"
							>
								<FiUser size={20} />
								<span className="hidden sm:inline">Sign In</span>
							</Link>

							<Link
								to="/register"
								className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition ease-in-out duration-500 hover:bg-primary-hover sm:inline-flex"
							>
								Register
							</Link>
						</>
					)}

					<Link
						to="/cart"
						aria-label="Shopping cart"
						title="Shopping cart"
						className="flex size-10 items-center justify-center rounded-full text-foreground transition ease-in-out duration-500 hover:bg-secondary hover:text-primary"
					>
						<FiShoppingCart size={21} />
					</Link>

					<button
						type="button"
						onClick={() => setMenuOpen((current) => !current)}
						aria-label={menuOpen ? 'Close menu' : 'Open menu'}
						aria-expanded={menuOpen}
						className="flex size-10 items-center justify-center rounded-full text-foreground transition ease-in-out duration-500 hover:bg-secondary hover:text-primary lg:hidden"
					>
						{menuOpen ? <FiX size={23} /> : <FiMenu size={23} />}
					</button>
				</div>
			</div>

			<nav className="hidden border-t border-border/70 lg:block">
				<div className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-12 px-8">
					{navLinks.map(({ label, to }) => (
						<NavLink
							key={to}
							to={to}
							end={to === '/'}
							className={navLinkClass}
						>
							{label}
						</NavLink>
					))}
				</div>
			</nav>

			{menuOpen && (
				<div className="border-t border-border bg-white px-4 py-5 shadow-lg sm:px-6 lg:hidden">
					<div className="mb-5">{searchForm(true)}</div>

					<nav className="flex flex-col divide-y divide-border/70">
						{navLinks.map(({ label, to }) => (
							<NavLink
								key={to}
								to={to}
								end={to === '/'}
								onClick={() => setMenuOpen(false)}
								className={({ isActive }) =>
									`py-3.5 text-sm font-semibold transition ease-in-out duration-500 ${
										isActive
											? 'text-primary'
											: 'text-foreground hover:text-primary'
									}`
								}
							>
								{label}
							</NavLink>
						))}
					</nav>

					<div className="mt-4 border-t border-border pt-4">
						{auth.isAuthenticated ? (
							<button
								type="button"
								onClick={handleLogout}
								className="flex items-center gap-2 py-2 text-sm font-semibold text-foreground transition ease-in-out duration-500 hover:text-primary"
							>
								<FiLogOut size={18} />
								Log Out
							</button>
						) : (
							<div className="flex items-center gap-3">
								<Link
									to="/login"
									onClick={() => setMenuOpen(false)}
									className="flex-1 rounded-full border border-border px-4 py-3 text-center text-sm font-semibold transition ease-in-out duration-500 hover:border-primary hover:text-primary"
								>
									Sign In
								</Link>
								<Link
									to="/register"
									onClick={() => setMenuOpen(false)}
									className="flex-1 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition ease-in-out duration-500 hover:bg-primary-hover"
								>
									Register
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	)
}
