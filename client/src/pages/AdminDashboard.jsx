import { Link, useNavigate } from 'react-router-dom'

function AdminDashboard() {
	const navigate = useNavigate();
	const admin = JSON.parse(localStorage.getItem("bokifa_admin") || "{}");

	const handleLogout = () => {
		localStorage.removeItem("bokifa_token");
		localStorage.removeItem("bokifa_admin");
		navigate("/admin/login");
	};

	const sections = [
		{
			title: "Books",
			description: "Manage your book catalog, prices, authors, and images.",
			path: "/admin/books"
		},
		{
			title: "Authors",
			description: "Create and maintain author profiles and images.",
			path: "/admin/authors"
		},
		{
			title: "Blogs",
			description: "Publish and manage blog articles and their authors.",
			path: "/admin/blogs"
		}
	];

	return (
		<main className="min-h-screen bg-[#f7f4ee]">
			<header className="border-b border-gray-200 bg-white">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
					<div>
						<p className="text-2xl font-bold tracking-wide text-[#183b32]">
							BOKIFA
						</p>
						<p className="mt-1 text-xs tracking-widest text-gray-500">
							ADMINISTRATION
						</p>
					</div>

					<button
						onClick={handleLogout}
						className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition ease-in-out duration-500 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
					>
						Log Out
					</button>

					<Link
						to="/"
						className="rounded-lg bg-[#183b32] px-4 py-2 text-sm font-medium text-white transition ease-in-out duration-500 hover:bg-[#285749]"
					>
						View Store
					</Link>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
				<section data-aos="fade-up">
					<p className="text-sm font-semibold uppercase tracking-widest text-[#98703b]">
						Control Center
					</p>
					<h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
						Welcome, {admin.name || "Admin"}
					</h1>
					<p className="mt-3 text-gray-600">
						Manage the content displayed throughout your Bokifa store.
					</p>
				</section>

				<section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{sections.map((section, index) => (
						<article
							key={section.title}
							data-aos="fade-up"
							data-aos-delay={index * 100}
							className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition ease-in-out duration-500 hover:-translate-y-1 hover:shadow-lg"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f0eb] text-xl font-bold text-[#183b32]">
								{section.title.charAt(0)}
							</div>
							<h2 className="mt-6 text-xl font-bold text-gray-900">
								{section.title}
							</h2>
							<p className="mt-3 min-h-12 leading-6 text-gray-600">
								{section.description}
							</p>
							<button
								onClick={() => navigate(section.path)}
								className="mt-6 font-semibold text-[#183b32] transition ease-in-out duration-500 hover:text-[#98703b]"
							>
								Manage {section.title} →
							</button>
						</article>
					))}
				</section>
			</div>
		</main>
	);
}

export default AdminDashboard;
