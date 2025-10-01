"use client";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
			<div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-scale-in">
				<div className="flex items-center gap-3 mb-4">
					<div className="text-3xl font-bold text-cyan-400">!</div>
					<h3 className="text-xl font-bold text-white">Confirm Action</h3>
				</div>

				<p className="text-gray-300 mb-6 leading-relaxed">{message}</p>

				<div className="flex gap-3 justify-end">
					<button
						onClick={onCancel}
						className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95">
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/50 border-2 border-cyan-400">
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}
