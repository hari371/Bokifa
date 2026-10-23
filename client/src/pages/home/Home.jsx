import Hero from './components/Hero'
import Categories from './components/Categories'
import FeaturedCollection from './components/FeaturedCollection'
import Banner from './components/Banner'
import Reviews from './components/Reviews'
import FeaturedAuthors from './components/FeaturedAuthors'
import PicksForYou from './components/PicksForYou'
import useBooks from '../../hooks/useBooks'
import News from "./components/News"

export default function Home() {
	const { books, loading, error } = useBooks()

	return (
		<>
			<Hero />
			<Categories />
			<FeaturedCollection
				books={books}
				loading={loading}
				error={error}
			/>
			<Banner />
			<Reviews />
			<FeaturedAuthors />
			<PicksForYou
				books={books}
				loading={loading}
				error={error}
			/>
            <News />
		</>
	)
}