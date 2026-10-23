
import { Navigate, Route, Routes } from 'react-router-dom'
import StoreLayout from './layouts/StoreLayout'
import Home from './pages/home/Home'
import Books from './pages/books/Books'
import BookDetails from './pages/books/BookDetails'
import Authors from './pages/authors/Authors'
import AuthorDetails from './pages/authors/AuthorDetails'
import Blogs from './pages/blogs/Blogs'
import BlogDetails from './pages/blogs/BlogDetails'
import Cart from './pages/cart/Cart'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFound from './pages/not-found/NotFound'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ContentManager from './pages/ContentManager'

function ProtectedAdminRoute({ children }) {
	const token = localStorage.getItem('bokifa_token')

	return token ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
	return (
		<Routes>
			<Route element={<StoreLayout />}>
				<Route path="/" element={<Home />} />
				<Route path="/books" element={<Books />} />
				<Route path="/books/:id" element={<BookDetails />} />
				<Route path="/authors" element={<Authors />} />
				<Route path="/authors/:id" element={<AuthorDetails />} />
				<Route path="/blogs" element={<Blogs />} />
				<Route path="/blogs/:id" element={<BlogDetails />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Route>

			<Route path="/admin/login" element={<AdminLogin />} />

			<Route
				path="/admin/dashboard"
				element={
					<ProtectedAdminRoute>
						<AdminDashboard />
					</ProtectedAdminRoute>
				}
			/>

			<Route
				path="/admin/:type"
				element={
					<ProtectedAdminRoute>
						<ContentManager />
					</ProtectedAdminRoute>
				}
			/>

			<Route path="/404" element={<NotFound />} />
			<Route path="*" element={<Navigate to="/404" replace />} />
		</Routes>
	)
}
