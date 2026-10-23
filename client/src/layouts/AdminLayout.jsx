import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FiBookOpen, FiUsers, FiFileText, FiLogOut, FiGrid } from 'react-icons/fi'

const links = [
	{ label: 'Dashboard', to: '/admin', icon: FiGrid, end: true },
	{ label: 'Books', to: '/admin/books', icon: FiBookOpen },
	{ label: 'Authors', to: '/admin/authors', icon: FiUsers },
	{ label: 'Blogs', to: '/admin/blogs', icon: FiFileText },
]

export default function AdminLayout() {
	const navigate = useNavigate()

	const linkClass = ({ isActive }) =>
		`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ease-in-out duration-500 ${
			isActive
				? 'bg-primary text-white'
				: 'text-foreground hover:bg-secondary hover:text-primary'
		}`

	const handleLogout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		navigate('/admin/login', { replace: true })
	}

	return (
		<div className="min-h-screen bg-secondary md:flex">
			<aside className="flex w-full flex-col border-b border-border bg-background p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
				<NavLink to="/admin" className="mb-8 text-2xl font-bold text-primary">
					Bokifa Admin
				</NavLink>

				<nav className="flex flex-col gap-2">
					{links.map(({ label, to, icon: Icon, end }) => (
						<NavLink key={to} to={to} end={end} className={linkClass}>
							<Icon size={19} />
							{label}
						</NavLink>
					))}
				</nav>

				<button
					type="button"
					onClick={handleLogout}
					className="mt-6 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-foreground transition ease-in-out duration-500 hover:bg-secondary hover:text-primary md:mt-auto"
				>
					<FiLogOut size={19} />
					Log out
				</button>
			</aside>

			<div className="min-w-0 flex-1">
				<header className="border-b border-border bg-background px-5 py-5 md:px-8">
					<p className="font-semibold">Content Management</p>
				</header>
				<main className="p-5 md:p-8">
					<Outlet />
				</main>
			</div>
		</div>
	)
}
