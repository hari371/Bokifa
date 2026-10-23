import { Link } from 'react-router-dom'
import promotionOne from '../../../assets/images/promotions/promotion (1).jpg'
import promotionTwo from '../../../assets/images/promotions/promotion (2).jpg'
import promotionThree from '../../../assets/images/promotions/promotion (3).jpg'

const promotions = [
	{
		image: promotionOne,
		label: 'Discover Your Next Read',
		title: 'Every Book Opens a New World',
		description: 'Find stories that stay with you.',
	},
	{
		image: promotionTwo,
		label: 'Made for Book Lovers',
		title: 'Your Next Favourite Is Here',
		description: 'Explore stories for every mood.',
	},
	{
		image: promotionThree,
		label: 'Build Your Collection',
		title: 'Stories Worth Keeping',
		description: 'Make room for your next great read.',
	},
]

export default function Banner() {
	return (
		<section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
			<div className="mx-auto max-w-[1600px]">
				<div className="mb-8 text-center">
					<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
						Something special for readers
					</p>
					<h2 className="text-3xl font-bold sm:text-4xl">
						Find Your Next Favourite
					</h2>
					<p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
						Explore new worlds, discover memorable characters, and find books
						you will want to read again.
					</p>
				</div>

				<div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
					{promotions.map((promotion) => (
						<Link
							key={promotion.title}
							to="/books"
							className="group relative flex h-[300px] min-w-0 flex-1 flex-col justify-end overflow-hidden rounded-2xl transition ease-in-out duration-500"
						>
							<img
								src={promotion.image}
								alt={promotion.title}
								loading="lazy"
								className="absolute inset-0 size-full object-cover object-center transition ease-in-out duration-500 group-hover:scale-105"
							/>

							<div className="relative z-10 p-5 text-white sm:p-6 [text-shadow:0_2px_6px_rgba(0,0,0,0.85)]">
								<p className="mb-2 text-xs font-semibold uppercase tracking-widest">
									{promotion.label}
								</p>
								<h3 className="max-w-xs text-xl font-bold leading-tight sm:text-2xl">
									{promotion.title}
								</h3>
								<p className="mt-2 text-sm">
									{promotion.description}
								</p>
								<span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
									Explore Books
									<span className="transition ease-in-out duration-500 group-hover:translate-x-1">
										→
									</span>
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}
