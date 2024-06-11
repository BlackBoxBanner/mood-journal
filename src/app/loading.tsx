const Loading = () => {
	return (
		<section className="flex justify-center items-center h-screen w-screen">
			<div className="flex gap-4 items-center justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="icon icon-tabler icons-tabler-outline icon-tabler-activity-heartbeat"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M3 12h4.5l1.5 -6l4 12l2 -9l1.5 3h4.5" />
				</svg>
				<p className="text-xl">Loading</p>
			</div>
		</section>
	);
};

export default Loading;
