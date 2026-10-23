import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi'
import api from '../../services/api'

export default function Register() {
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')

		if (password.length < 8) {
			setError('Your password must contain at least 8 characters.')
			return
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		setLoading(true)

		try {
			await api.post('/user-auth/register', {
                name: name.trim(),
                email: email.trim(),
                password,
            })

			navigate('/login', {
				replace: true,
				state: { message: 'Account created. Please sign in.' },
			})
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Unable to create your account. Please try again.',
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
						Join Bokifa
					</p>
					<h1 className="text-3xl font-bold sm:text-4xl">Create Account</h1>
					<p className="mt-3 text-sm leading-6 text-muted">
						Create an account to begin your next reading journey.
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
						<label htmlFor="register-name" className="mb-2 block text-sm font-semibold">
							Full Name
						</label>
						<input
							id="register-name"
							type="text"
							autoComplete="name"
							required
							minLength={2}
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="Enter your name"
							className="w-full border border-border px-4 py-3 text-sm outline-none transition ease-in-out duration-500 focus:border-primary"
						/>
					</div>

					<div className="mb-5">
						<label htmlFor="register-email" className="mb-2 block text-sm font-semibold">
							Email Address
						</label>
						<input
							id="register-email"
							type="email"
							autoComplete="email"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="you@example.com"
							className="w-full border border-border px-4 py-3 text-sm outline-none transition ease-in-out duration-500 focus:border-primary"
						/>
					</div>

					<div className="mb-5">
						<label htmlFor="register-password" className="mb-2 block text-sm font-semibold">
							Password
						</label>
						<div className="relative">
							<input
								id="register-password"
								type={showPassword ? 'text' : 'password'}
								autoComplete="new-password"
								required
								minLength={8}
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="At least 8 characters"
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

					<div className="mb-6">
						<label htmlFor="register-confirm-password" className="mb-2 block text-sm font-semibold">
							Confirm Password
						</label>
						<input
							id="register-confirm-password"
							type={showPassword ? 'text' : 'password'}
							autoComplete="new-password"
							required
							minLength={8}
							value={confirmPassword}
							onChange={(event) => setConfirmPassword(event.target.value)}
							placeholder="Enter your password again"
							className="w-full border border-border px-4 py-3 text-sm outline-none transition ease-in-out duration-500 focus:border-primary"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 font-semibold text-white transition ease-in-out duration-500 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
					>
						<FiUserPlus size={18} />
						{loading ? 'Creating account...' : 'Create Account'}
					</button>

					<p className="mt-6 text-center text-sm text-muted">
						Already have an account?{' '}
						<Link
							to="/login"
							className="font-semibold text-primary transition ease-in-out duration-500 hover:text-primary-hover"
						>
							Sign in
						</Link>
					</p>
				</form>
			</div>
		</section>
	)
}
