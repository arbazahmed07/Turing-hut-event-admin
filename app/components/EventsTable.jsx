export default function EventsTable({
	events,
	onEdit,
	onDelete,
	onAdd,
	loading,
}) {
	return (
		<div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-500 rounded-2xl shadow-2xl overflow-hidden">
			<div className="p-4 md:p-6 border-b border-gray-700 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
				<h2 className="text-xl md:text-2xl font-bold text-cyan-300">Events</h2>
				<button
					onClick={onAdd}
					disabled={loading}
					className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/50 disabled:shadow-none border-2 border-cyan-400 disabled:border-gray-600">
					Add New Event
				</button>
			</div>

			{loading && (
				<div className="p-8 text-center">
					<div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
					<p className="mt-4 text-gray-400 font-medium">Loading events...</p>
				</div>
			)}

			{!loading && events.length === 0 && (
				<div className="p-12 text-center">
					<p className="text-gray-400 text-lg font-medium">No events found.</p>
					<p className="text-gray-500 text-sm mt-2">
						Click "Add New Event" to create one.
					</p>
				</div>
			)}

			{!loading && events.length > 0 && (
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-900/50 border-b border-gray-700">
							<tr>
								<th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
									File Name
								</th>
								<th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider hidden md:table-cell">
									Path
								</th>
								<th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider hidden lg:table-cell">
									Preview
								</th>
								<th className="px-4 md:px-6 py-4 text-right text-xs font-bold text-cyan-400 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700">
							{events.map((event) => (
								<tr
									key={event.path}
									className="hover:bg-gray-700/50 transition-colors">
									<td className="px-4 md:px-6 py-4">
										<div className="text-sm font-medium text-white">
											{event.name}
										</div>
									</td>
									<td className="px-4 md:px-6 py-4 hidden md:table-cell">
										<div className="text-sm text-gray-400">{event.path}</div>
									</td>
									<td className="px-4 md:px-6 py-4 hidden lg:table-cell">
										<div className="text-sm text-gray-500 max-w-md truncate">
											{event.content.substring(0, 100)}...
										</div>
									</td>
									<td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											onClick={() => onEdit(event)}
											className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/20 mr-2 md:mr-3 transition-all font-medium px-3 py-1.5 rounded-lg border-2 border-cyan-500 hover:border-cyan-400">
											Edit
										</button>
										<button
											onClick={() => onDelete(event)}
											className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/20 transition-all font-medium px-3 py-1.5 rounded-lg border-2 border-cyan-600 hover:border-cyan-500">
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
