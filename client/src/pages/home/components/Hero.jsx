import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import hero1 from '../../../assets/images/hero/hero (1).jpg'
import hero2 from '../../../assets/images/hero/hero (2).jpg'
import hero3 from '../../../assets/images/hero/hero (3).jpg'

const slides = [
	{
		image: hero1,
		eyebrow: 'WELCOME TO AP BOKIFA',
		title: 'Every book opens a new world.',
		description: 'Discover stories, explore new ideas, and find your next favourite read.',
	},
	{
		image: hero2,
		eyebrow: 'YOUR NEXT GREAT READ',
		title: 'Find the story that stays with you.',
		description: 'Explore books for every mood, every interest, and every reader.',
	},
	{
		image: hero3,
		eyebrow: 'A WORLD OF STORIES',
		title: 'Make room for a little more reading.',
		description: 'Browse our collection and discover something worth turning the page for.',
	},
]

export default function Hero() {
	return (
		<section className="relative overflow-hidden bg-secondary">
			<Swiper
				modules={[Autoplay, EffectFade, Pagination, Navigation]}
				effect="fade"
				loop
				autoplay={{ delay: 5000, disableOnInteraction: false }}
				pagination={{ clickable: true }}
				navigation
				className="bokifa-hero"
			>
				{slides.map((slide) => (
					<SwiperSlide key={slide.image}>
						<div className="relative min-h-[520px] md:min-h-[620px]">
							<img
								src={slide.image}
								alt=""
								className="absolute inset-0 h-full w-full object-cover"
							/>
							<div className="absolute inset-0 bg-black/45" />

							<div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-6 py-20 md:min-h-[620px] md:px-12">
								<div className="max-w-2xl text-white" data-aos="fade-up">
									<p className="mb-5 text-sm font-semibold tracking-[0.2em] text-white/85">
										{slide.eyebrow}
									</p>
									<h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
										{slide.title}
									</h1>
									<p className="mt-6 max-w-xl text-base leading-7 text-white/85 md:text-lg">
										{slide.description}
									</p>
									<Link
										to="/books"
										className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-semibold text-white transition ease-in-out duration-500 hover:bg-primary-hover"
									>
										Explore Books
										<FiArrowRight size={19} />
									</Link>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	)
}
