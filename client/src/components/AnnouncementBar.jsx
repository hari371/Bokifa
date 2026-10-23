
export default function AnnouncementBar() {
	const message = 'Special Sale! Discover your next favourite book at Bokifa.'

	return (
		<div className="overflow-hidden bg-primary py-2 text-sm text-white">
			<div className="mx-auto w-2/3 overflow-hidden">
				<div className="marquee-track">
					<p>{message}</p>
					<p aria-hidden="true">{message}</p>
				</div>
			</div>
		</div>
	)
}
