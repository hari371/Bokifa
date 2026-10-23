import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi'
import api from '../../services/api'

export default function Login() {
	const navigate = useNavigate()
	const location = useLocation()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setLoading(true)

		try {
			const response = await api.post('/user-auth/login', {
                email: email.trim(),
                password,
            })

			const result = response.data?.data || response.data
			const token = result.token || result.accessToken
			const user = result.user

			if (!token) {
				setError('The server did not return an authentication token.')
				return
			}

			localStorage.setItem('token', token)

			if (user) {
				localStorage.setItem('user', JSON.stringify(user))
			}
            window.dispatchEvent(new Event('bokifa-auth-change'))
			navigate(location.state?.from?.pathname || '/', { replace: true })
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Unable to sign in. Please check your details and try again.',
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:py-16">
			<div className="w-full max-w-md">
				<div className="mb-8 text-center">
					<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
						Welcome back
					</p>
					<h1 className="text-3xl font-bold sm:text-4xl">Sign In</h1>
					<p className="mt-3 text-sm leading-6 text-muted">
						Sign in to continue your Bokifa journey.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="border border-border bg-white p-6 sm:p-8"
				>
					{error && (
						<p role="alert" className="mb-5 bg-red-50 p-3 text-sm text-red-700">
							{error}
						</p>
					)}

					<div className="mb-5">
						<label htmlFor="login-email" className="mb-2 block text-sm font-semibold">
							Email Address
						</label>
						<input
							id="login-email"
							type="email"
							autoComplete="email"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="you@example.com"
							className="w-full border border-border px-4 py-3 text-sm outline-none transition ease-in-out duration-500 focus:border-primary"
						/>
					</div>

					<div className="mb-6">
						<label htmlFor="login-password" className="mb-2 block text-sm font-semibold">
							Password
						</label>
						<div className="relative">
							<input
								id="login-password"
								type={showPassword ? 'text' : 'password'}
								autoComplete="current-password"
								required
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Enter your password"
								className="w-full border border-border px-4 py-3 pr-12 text-sm outline-none transition ease-in-out duration-500 focus:border-primary"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((current) => !current)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted transition ease-in-out duration-500 hover:text-primary"
							>
								{showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
							</button>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 font-semibold text-white transition ease-in-out duration-500 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
					>
						<FiLogIn size={18} />
						{loading ? 'Signing in...' : 'Sign In'}
					</button>

					<p className="mt-6 text-center text-sm text-muted">
						Don't have an account?{' '}
						<Link
							to="/register"
							className="font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
						>
							Create one
						</Link>
					</p>
				</form>
			</div>
		</section>
	)
}
