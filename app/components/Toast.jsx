"use client";

import { useEffect } from "react";

export default function Toast({
	message,
	type = "success",
	onClose,
	duration = 4000,
}) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	const typeStyles = {
		success: "bg-gradient-to-r from-cyan-500 to-cyan-600 border-cyan-400",
		error: "bg-gradient-to-r from-cyan-700 to-cyan-800 border-cyan-600",
		info: "bg-gradient-to-r from-cyan-600 to-cyan-700 border-cyan-500",
		warning: "bg-gradient-to-r from-cyan-500 to-cyan-600 border-cyan-400",
	};

	const icons = {
		success: "✓",
		error: "✕",
		info: "i",
		warning: "!",
	};

	return (
		<div className="fixed top-4 right-4 z-50 animate-slide-in">
			<div
				className={`${typeStyles[type]} text-white px-6 py-4 rounded-xl shadow-2xl border-2 max-w-md flex items-start gap-3 backdrop-blur-sm`}>
				<div className="text-2xl font-bold">{icons[type]}</div>
				<div className="flex-1">
					<p className="font-medium text-sm leading-relaxed">{message}</p>
				</div>
				<button
					onClick={onClose}
					className="text-white hover:text-gray-200 transition-colors ml-2 text-xl font-bold leading-none">
					×
				</button>
			</div>
		</div>
	);
}
