import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import api from "../services/api";

function AdminLogin() {
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = event => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value
		});
	};

	const handleSubmit = async event => {
		event.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await api.post("/admin-auth/login", formData);

			localStorage.setItem("bokifa_token", response.data.token);
			localStorage.setItem("bokifa_admin", JSON.stringify(response.data.admin));

			navigate("/admin/dashboard");
		} catch (error) {
			setError(
				error.response?.data?.message || "Unable to connect to the server."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] px-4 py-10">
			<div data-aos="fade-up" className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
				<section className="flex flex-col justify-between bg-[#183b32] p-8 text-white sm:p-12">
					<div>
						<p className="text-3xl font-bold tracking-wide">BOKIFA</p>
						<p className="mt-2 text-sm tracking-[0.25em] text-[#e6c995]">
							YOUR WORLD OF BOOKS
						</p>
					</div>

					<div className="my-12">
						<p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#e6c995]">
							Administration
						</p>
						<h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
							Every story starts somewhere.
						</h1>
						<p className="mt-5 max-w-sm leading-7 text-white/75">
							Manage your books, authors, and stories from one place.
						</p>
					</div>

					<p className="text-sm text-white/60">
						Bokifa Admin Portal
					</p>
				</section>

				<section className="flex items-center p-8 sm:p-12">
					<div className="w-full">
						<p className="text-sm font-semibold uppercase tracking-widest text-[#98703b]">
							Welcome back
						</p>
						<h2 className="mt-3 text-3xl font-bold text-gray-900">
							Admin Login
						</h2>
						<p className="mt-2 text-gray-500">
							Enter your credentials to access the dashboard.
						</p>

						<form onSubmit={handleSubmit} className="mt-8 space-y-5">
							<div>
								<label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
									Email address
								</label>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="username"
									value={formData.email}
									onChange={handleChange}
									placeholder="admin@example.com"
									required
									className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition ease-in-out duration-500 focus:border-[#183b32] focus:ring-2 focus:ring-[#183b32]/15"
								/>
							</div>

							<div>
								<label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Enter your password"
									required
									className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition ease-in-out duration-500 focus:border-[#183b32] focus:ring-2 focus:ring-[#183b32]/15"
								/>
							</div>

							{error && (
								<p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
									{error}
								</p>
							)}

							<button
								type="submit"
								disabled={loading}
								className="w-full rounded-lg bg-[#183b32] px-4 py-3 font-semibold text-white transition ease-in-out duration-500 hover:bg-[#285749] disabled:cursor-not-allowed disabled:opacity-60"
							>
								{loading ? "Signing in..." : "Sign In"}
							</button>
						</form>

						<p className="mt-6 text-center text-xs leading-5 text-gray-400">
							Authorized administrators only.
						</p>
					</div>
				</section>
			</div>
		</main>
	);
}

export default AdminLogin;
