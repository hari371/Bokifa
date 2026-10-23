import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
	return (
		<main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
			<div className="max-w-lg text-center">
				<p className="text-7xl font-bold text-primary sm:text-8xl">404</p>

				<h1 className="mt-5 text-2xl font-bold sm:text-3xl">
					Page Not Found
				</h1>

				<p className="mt-3 text-sm leading-6 text-muted sm:text-base">
					The page you're looking for doesn't exist or may have been moved.
				</p>

				<div className="mt-7 flex flex-wrap justify-center gap-3">
					<Link
						to="/"
						className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-white transition ease-in-out duration-500 hover:bg-primary-hover"
					>
						<FiArrowLeft size={17} />
						Back to Home
					</Link>

					<Link
						to="/books"
						className="border border-border px-5 py-3 text-sm font-semibold transition ease-in-out duration-500 hover:border-primary hover:text-primary"
					>
						Browse Books
					</Link>
				</div>
			</div>
		</main>
	)
}