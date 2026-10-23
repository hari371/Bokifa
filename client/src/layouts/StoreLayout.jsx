import { Outlet } from 'react-router-dom'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function StoreLayout() {
	return (
		<>
			<AnnouncementBar />
			<Navbar />
			<main>
				<Outlet />
			</main>
			<Footer />
		</>
	)
}