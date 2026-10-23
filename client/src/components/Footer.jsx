
import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import logo from '../assets/images/logo.png'
import paymentImage from '../assets/images/pay.png'

export default function Footer() {
	return (
		<footer className="bg-foreground px-5 py-14 text-white md:px-10">
			<div className="mx-auto max-w-7xl">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<Link to="/" className="inline-block">
							<img
								src={logo}
								alt="Ap Bokifa"
								className="h-12 w-auto object-contain"
							/>
						</Link>
						<p className="mt-5 max-w-xs text-sm leading-7 text-white/70">
							Discover your next favourite read and explore a world of stories with Ap Bokifa.
						</p>
					</div>

					<div>
						<h3 className="mb-5 font-semibold">Explore</h3>
						<div className="flex flex-col items-start gap-3 text-sm text-white/70">
							<Link className="transition ease-in-out duration-500 hover:text-primary" to="/books">All Books</Link>
							<Link className="transition ease-in-out duration-500 hover:text-primary" to="/authors">Our Authors</Link>
							<Link className="transition ease-in-out duration-500 hover:text-primary" to="/blogs">Our Blog</Link>
						</div>
					</div>

					<div>
						<h3 className="mb-5 font-semibold">Your Account</h3>
						<div className="flex flex-col items-start gap-3 text-sm text-white/70">
							<Link className="transition ease-in-out duration-500 hover:text-primary" to="/login">Sign In</Link>
							<Link className="transition ease-in-out duration-500 hover:text-primary" to="/register">Create Account</Link>
							<Link className="transition ease-in-out duration-500 hover:text-primary" to="/cart">Shopping Cart</Link>
						</div>
					</div>

					<div>
						<h3 className="mb-5 font-semibold">Discover More</h3>
						<Link
							to="/books"
							className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold transition ease-in-out duration-500 hover:bg-primary-hover"
						>
							Browse Books <FiArrowUpRight size={17} />
						</Link>
						{paymentImage && (
							<img
								src={paymentImage}
								alt="Available payment methods"
								className="mt-6 max-w-48 object-contain"
								loading="lazy"
							/>
						)}
					</div>
				</div>

				<div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-white/60">
					© {new Date().getFullYear()} Ap Bokifa. All rights reserved.
				</div>
			</div>
		</footer>
	)
}
