import { Link } from 'react-router-dom'
import category1 from '../../../assets/images/categories/Category-lcon (1).png'
import category2 from '../../../assets/images/categories/Category-lcon (2).png'
import category3 from '../../../assets/images/categories/Category-lcon (3).png'
import category4 from '../../../assets/images/categories/Category-lcon (4).png'
import category5 from '../../../assets/images/categories/Category-lcon (5).png'
import category6 from '../../../assets/images/categories/Category-lcon (6).png'
import category7 from '../../../assets/images/categories/Category-lcon (7).png'
import category8 from '../../../assets/images/categories/Category-lcon (8).png'

const categories = [
	{ name: 'Fiction', image: category1 },
	{ name: 'Mystery', image: category2 },
	{ name: 'Romance', image: category3 },
	{ name: 'Fantasy', image: category4 },
	{ name: 'Biography', image: category5 },
	{ name: 'History', image: category6 },
	{ name: 'Science', image: category7 },
	{ name: 'Children', image: category8 },
]

export default function Categories() {
	return (
		<section className="bg-secondary px-5 py-16 md:px-10 md:py-20">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
							Find your interest
						</p>
						<h2 className="text-3xl font-bold md:text-4xl">
							Explore Categories
						</h2>
					</div>
					<Link
						to="/books"
						className="font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
					>
						View All Books →
					</Link>
				</div>

				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
					{categories.map((category) => (
						<Link
							key={category.name}
							to={`/books?category=${encodeURIComponent(category.name)}`}
							className="group flex flex-col items-center gap-4 rounded-xl border border-border bg-background p-5 text-center transition ease-in-out duration-500 hover:-translate-y-1 hover:border-primary"
						>
							<div className="flex h-16 w-16 items-center justify-center">
								<img
									src={category.image}
									alt=""
									loading="lazy"
									className="max-h-full max-w-full object-contain transition ease-in-out duration-500 group-hover:scale-110"
								/>
							</div>
							<h3 className="text-sm font-semibold transition ease-in-out duration-500 group-hover:text-primary">
								{category.name}
							</h3>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}
