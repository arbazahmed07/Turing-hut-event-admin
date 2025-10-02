"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function EventEditor({
	event,
	onSave,
	onCancel,
	loading,
	error,
}) {
	const [fileName, setFileName] = useState("");
	const [content, setContent] = useState("");
	const [showPreview, setShowPreview] = useState(true);
	const [selectedImage, setSelectedImage] = useState(null);
	const [imagePreview, setImagePreview] = useState("");

	useEffect(() => {
		if (event) {
			setFileName(event.name);
			setContent(event.content);
		} else {
			// Default template for new events with comprehensive frontmatter
			const currentDate = new Date().toISOString().split("T")[0];
			setFileName("");
			setContent(``);
		}
	}, [event]);

	const handleImageSelect = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				alert("Please select a valid image file");
				return;
			}

			// Validate file size (5MB limit)
			if (file.size > 5 * 1024 * 1024) {
				alert("Image size should be less than 5MB");
				return;
			}

			setSelectedImage(file);

			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => setImagePreview(e.target.result);
			reader.readAsDataURL(file);
		}
	};

	const removeImage = () => {
		setSelectedImage(null);
		setImagePreview("");
	};

	const handleSave = () => {
		if (!fileName.trim()) {
			alert("Please enter a file name");
			return;
		}

		// Ensure the file has .md or .mdx extension
		let finalFileName = fileName.trim();
		if (!finalFileName.endsWith(".md") && !finalFileName.endsWith(".mdx")) {
			finalFileName += ".md";
		}

		onSave(finalFileName, content, event, selectedImage);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
			<div className="max-w-7xl mx-auto">
				<div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-500 rounded-2xl shadow-2xl p-4 md:p-6 mb-4">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
							{event ? "Edit Event" : "Add New Event"}
						</h1>
						<button
							onClick={onCancel}
							disabled={loading}
							className="text-gray-400 hover:text-white transition-colors text-2xl font-bold px-3 py-1 rounded-lg border-2 border-gray-600 hover:border-cyan-500">
							✕
						</button>
					</div>

					<div className="mb-6">
						<label className="block text-sm font-medium mb-2 text-gray-300">
							File Name
						</label>
						<input
							type="text"
							value={fileName}
							onChange={(e) => setFileName(e.target.value)}
							disabled={!!event || loading}
							placeholder="event-name.md"
							className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:bg-gray-800 disabled:text-gray-500 transition-all"
						/>
						<p className="text-xs text-gray-400 mt-2">
							{event
								? "File name cannot be changed when editing"
								: "Will automatically add .md extension if not provided. Spaces will be replaced with dashes."}
						</p>
					</div>

					{/* Image Upload Section */}
					<div className="mb-6">
						<label className="block text-sm font-medium mb-2 text-gray-300">
							Event Image (Optional)
						</label>

						{!selectedImage && !imagePreview && (
							<div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-cyan-500 transition-colors">
								<input
									type="file"
									accept="image/*"
									onChange={handleImageSelect}
									disabled={loading}
									className="hidden"
									id="image-upload"
								/>
								<label
									htmlFor="image-upload"
									className="cursor-pointer flex flex-col items-center space-y-2">
									<svg
										className="w-12 h-12 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
										/>
									</svg>
									<span className="text-gray-400">
										Click to upload an image
									</span>
									<span className="text-xs text-gray-500">
										PNG, JPG, GIF up to 5MB
									</span>
								</label>
							</div>
						)}

						{(selectedImage || imagePreview) && imagePreview && (
							<div className="border-2 border-gray-600 rounded-xl p-4">
								<div className="flex items-start space-x-4">
									<img
										src={imagePreview}
										alt="Event preview"
										className="w-32 h-32 object-cover rounded-lg"
									/>
									<div className="flex-1">
										<p className="text-sm text-gray-300 mb-2">
											{selectedImage ? selectedImage.name : "Current image"}
										</p>
										<div className="flex space-x-2">
											<label
												htmlFor="image-upload-replace"
												className="px-3 py-1 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 cursor-pointer transition-colors">
												Replace
											</label>
											<input
												type="file"
												accept="image/*"
												onChange={handleImageSelect}
												disabled={loading}
												className="hidden"
												id="image-upload-replace"
											/>
											<button
												onClick={removeImage}
												disabled={loading}
												className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
												Remove
											</button>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="mb-6">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
							<label className="block text-sm font-medium text-gray-300">
								Content
							</label>
							<button
								onClick={() => setShowPreview(!showPreview)}
								className="text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 text-cyan-300 rounded-xl transition-all transform hover:scale-105 active:scale-95 self-start sm:self-auto border-2 border-cyan-500">
								{showPreview ? "Hide Preview" : "Show Preview"}
							</button>
						</div>

						<div
							className={`grid ${
								showPreview ? "lg:grid-cols-2" : "grid-cols-1"
							} gap-4`}>
							<div>
								<textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									disabled={loading}
									placeholder="Enter markdown content..."
									className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 font-mono text-sm disabled:bg-gray-800 transition-all"
									style={{ resize: "vertical", minHeight: "400px" }}
								/>
							</div>

							{showPreview && (
								<div
									className="border-2 border-gray-600 rounded-xl p-4 overflow-auto bg-gray-800"
									style={{ minHeight: "400px", maxHeight: "600px" }}>
									<div className="prose prose-invert prose-sm max-w-none">
										<ReactMarkdown>{content}</ReactMarkdown>
									</div>
								</div>
							)}
						</div>
					</div>

					{error && (
						<div className="mb-4 p-4 bg-cyan-500/10 border-2 border-cyan-500 text-cyan-200 rounded-xl text-sm">
							{error}
						</div>
					)}

					<div className="flex flex-col sm:flex-row justify-end gap-3">
						<button
							onClick={onCancel}
							disabled={loading}
							className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl font-medium transition-all border-2 border-gray-600 hover:border-gray-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed">
							Cancel
						</button>
						<button
							onClick={handleSave}
							disabled={loading}
							className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl font-medium transition-all border-2 border-cyan-400 hover:border-cyan-300 disabled:from-gray-600 disabled:to-gray-700 disabled:border-gray-600 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/50 disabled:shadow-none">
							{loading
								? "Saving..."
								: event
								? "Update (Create PR)"
								: "Create (Create PR)"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
