"use client";

import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import EventsTable from "./components/EventsTable";
import EventEditor from "./components/EventEditor";
import Toast from "./components/Toast";
import ConfirmDialog from "./components/ConfirmDialog";

export default function Home() {
	const [pat, setPat] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [octokit, setOctokit] = useState(null);
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [editingEvent, setEditingEvent] = useState(null);
	const [isAdding, setIsAdding] = useState(false);

	// User-provided repository configuration
	const [baseRepoPath, setBaseRepoPath] = useState("");
	const [targetFolderPath, setTargetFolderPath] = useState("");
	const [imagePath, setImagePath] = useState("");

	// Toast notifications
	const [toast, setToast] = useState(null);

	// Confirm dialog
	const [confirmDialog, setConfirmDialog] = useState(null);

	// Parse repository info from base repo path
	const getRepoInfo = () => {
		if (!baseRepoPath) return { repoOwner: "", repoName: "" };

		// Extract owner and repo from GitHub URL or path
		// Supports formats like: github.com/owner/repo, owner/repo, https://github.com/owner/repo
		const match = baseRepoPath.match(/(?:github\.com\/)?([^\/]+)\/([^\/\s]+)/);
		if (match) {
			return { repoOwner: match[1], repoName: match[2] };
		}
		return { repoOwner: "", repoName: "" };
	};

	const { repoOwner, repoName } = getRepoInfo();

	const showToast = (message, type = "success") => {
		setToast({ message, type });
	};

	const showConfirm = (message, onConfirm) => {
		setConfirmDialog({ message, onConfirm });
	};

	const handleAuthenticate = async () => {
		if (!pat.trim()) {
			setError("Please enter a GitHub Personal Access Token");
			return;
		}

		if (!baseRepoPath.trim()) {
			setError("Please enter the base repository path");
			return;
		}

		if (!targetFolderPath.trim()) {
			setError("Please enter the target folder path");
			return;
		}

		if (!imagePath.trim()) {
			setError("Please enter the image path");
			return;
		}

		const { repoOwner: owner, repoName: name } = getRepoInfo();
		if (!owner || !name) {
			setError(
				"Invalid repository path. Use format: owner/repo or github.com/owner/repo"
			);
			return;
		}

		try {
			const oktokitInstance = new Octokit({ auth: pat });
			const { data: user } = await oktokitInstance.users.getAuthenticated();

			setOctokit(oktokitInstance);
			setIsAuthenticated(true);
			setError("");
			showToast(`Welcome, ${user.login}! 🎉`, "success");
			console.log("Authenticated as:", user.login);
			// Load events immediately after authentication
			loadEvents();
		} catch (err) {
			setError("Authentication failed. Please check your PAT.");
			showToast("Authentication failed. Please verify your token.", "error");
			console.error(err);
		}
	};

	const loadEvents = async () => {
		if (!octokit) return;

		setLoading(true);
		setError("");

		try {
			// Get the contents of the events directory
			const { data: contents } = await octokit.repos.getContent({
				owner: repoOwner,
				repo: repoName,
				path: targetFolderPath,
			});

			// Filter for markdown files
			const markdownFiles = Array.isArray(contents)
				? contents.filter(
						(file) => file.name.endsWith(".md") || file.name.endsWith(".mdx")
				  )
				: [contents];

			// Fetch content of each file
			const eventsData = await Promise.all(
				markdownFiles.map(async (file) => {
					const { data: fileData } = await octokit.repos.getContent({
						owner: repoOwner,
						repo: repoName,
						path: file.path,
					});

					const content = Buffer.from(fileData.content, "base64").toString(
						"utf-8"
					);

					return {
						name: file.name,
						path: file.path,
						sha: fileData.sha,
						content: content,
					};
				})
			);

			setEvents(eventsData);
			if (eventsData.length > 0) {
				showToast(
					`Loaded ${eventsData.length} event${
						eventsData.length > 1 ? "s" : ""
					}`,
					"success"
				);
			}
		} catch (err) {
			const errorMsg = err.message.includes("404")
				? `Directory "${targetFolderPath}" not found. Please check the path.`
				: err.message.includes("403")
				? "Access denied. Check your PAT permissions."
				: `Failed to load events: ${err.message}`;
			setError(errorMsg);
			showToast(errorMsg, "error");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (event) => {
		setEditingEvent(event);
		setIsAdding(false);
	};

	const handleAdd = () => {
		setEditingEvent(null);
		setIsAdding(true);
	};

	const handleDelete = async (event) => {
		showConfirm(
			`Are you sure you want to delete "${event.name}"? This action cannot be undone.`,
			async () => {
				setConfirmDialog(null);
				setLoading(true);
				try {
					await octokit.repos.deleteFile({
						owner: repoOwner,
						repo: repoName,
						path: event.path,
						message: `Delete ${event.name}`,
						sha: event.sha,
					});

					setError("");
					showToast(`${event.name} deleted successfully! 🗑️`, "success");
					loadEvents();
				} catch (err) {
					const errorMsg = err.message.includes("404")
						? "File not found. It may have been deleted already."
						: `Failed to delete file: ${err.message}`;
					setError(errorMsg);
					showToast(errorMsg, "error");
					console.error(err);
				} finally {
					setLoading(false);
				}
			}
		);
	};

	const uploadImage = async (imageFile, branchName, eventFileName) => {
		try {
			// Use the event filename instead of extracting from frontmatter
			// Remove .md or .mdx extension from filename
			const fileNameWithoutExt = eventFileName.replace(/\.(md|mdx)$/i, "");

			// Generate image filename based on event filename and file extension
			const fileExtension = imageFile.name.split(".").pop().toLowerCase();
			const imageName = `${fileNameWithoutExt}.${fileExtension}`;
			const imageFilePath = `${imagePath}/${imageName}`;

			// Convert image file to base64
			const imageBuffer = await imageFile.arrayBuffer();
			const imageBase64 = Buffer.from(imageBuffer).toString("base64");

			// Upload image to repository (no need to check if exists since it's a new branch)
			await octokit.repos.createOrUpdateFileContents({
				owner: repoOwner,
				repo: repoName,
				path: imageFilePath,
				message: `Add event image: ${imageName}`,
				content: imageBase64,
				branch: branchName,
			});

			// Return the relative path format for the markdown
			return `${imagePath}/${imageName}`;
		} catch (err) {
			console.error("Error uploading image:", err);

			// Handle specific GitHub API errors
			if (err.status === 422) {
				throw new Error(
					`Failed to upload image: Invalid content or path. ${err.message}`
				);
			} else if (err.status === 409) {
				throw new Error(
					`Failed to upload image: Conflict - file already exists. ${err.message}`
				);
			} else if (err.status === 403) {
				throw new Error(
					`Failed to upload image: Permission denied. Check your token permissions.`
				);
			} else {
				throw new Error(`Failed to upload image: ${err.message}`);
			}
		}
	};

	const handleSave = async (fileName, content, originalEvent, imageFile) => {
		setLoading(true);
		setError("");

		try {
			// Sanitize filename - replace spaces and special chars with dashes
			const sanitizedFileName = fileName
				.replace(/\s+/g, "-")
				.replace(/[^a-zA-Z0-9\-_.]/g, "")
				.toLowerCase();

			// Get the default branch
			const { data: repo } = await octokit.repos.get({
				owner: repoOwner,
				repo: repoName,
			});
			const defaultBranch = repo.default_branch;

			// Create a new branch for the PR - sanitize branch name
			const timestamp = Date.now();
			const fileNameWithoutExt = sanitizedFileName.replace(/\.(md|mdx)$/, "");
			const branchName = originalEvent
				? `update-${fileNameWithoutExt}-${timestamp}`
				: `add-${fileNameWithoutExt}-${timestamp}`;

			// Get the SHA of the default branch
			const { data: refData } = await octokit.git.getRef({
				owner: repoOwner,
				repo: repoName,
				ref: `heads/${defaultBranch}`,
			});

			// Create a new branch
			await octokit.git.createRef({
				owner: repoOwner,
				repo: repoName,
				ref: `refs/heads/${branchName}`,
				sha: refData.object.sha,
			});

			let finalContent = content;

			// Upload image if provided
			if (imageFile) {
				try {
					// Pass the sanitized filename to uploadImage function
					const imagePath = await uploadImage(
						imageFile,
						branchName,
						sanitizedFileName
					);

					// Update content to include image path in frontmatter
					if (
						finalContent.includes('image: ""') ||
						finalContent.includes("image: ")
					) {
						finalContent = finalContent.replace(
							/image: "?[^"\n]*"?/,
							`image: ${imagePath}`
						);
					} else {
						// Add image field to frontmatter if it doesn't exist
						finalContent = finalContent.replace(
							/---\n/,
							`---\nimage: ${imagePath}\n`
						);
					}
				} catch (imageErr) {
					setError(`Failed to upload image: ${imageErr.message}`);
					showToast(`Failed to upload image: ${imageErr.message}`, "error");
					return;
				}
			}

			const filePath = `${targetFolderPath}/${sanitizedFileName}`;

			// Create or update the file in the new branch
			if (originalEvent) {
				// Update existing file
				await octokit.repos.createOrUpdateFileContents({
					owner: repoOwner,
					repo: repoName,
					path: filePath,
					message: `Update ${sanitizedFileName}`,
					content: Buffer.from(finalContent).toString("base64"),
					branch: branchName,
					sha: originalEvent.sha,
				});
			} else {
				// Create new file
				await octokit.repos.createOrUpdateFileContents({
					owner: repoOwner,
					repo: repoName,
					path: filePath,
					message: `Add ${sanitizedFileName}`,
					content: Buffer.from(finalContent).toString("base64"),
					branch: branchName,
				});
			}

			// Create a pull request
			const { data: pr } = await octokit.pulls.create({
				owner: repoOwner,
				repo: repoName,
				title: originalEvent
					? `Update ${sanitizedFileName}`
					: `Add ${sanitizedFileName}`,
				head: branchName,
				base: defaultBranch,
				body: originalEvent
					? `This PR updates the event file: ${sanitizedFileName}${
							imageFile ? "\n\nIncludes image upload." : ""
					  }`
					: `This PR adds a new event file: ${sanitizedFileName}${
							imageFile ? "\n\nIncludes image upload." : ""
					  }`,
			});

			showToast(
				`Pull request #${pr.number} created successfully! 🎉`,
				"success"
			);
			setEditingEvent(null);
			setIsAdding(false);
			loadEvents();
		} catch (err) {
			let errorMsg = "Failed to create PR";

			if (err.message.includes("Reference already exists")) {
				errorMsg =
					"A PR with similar changes already exists. Please wait or use a different filename.";
			} else if (err.message.includes("Invalid request")) {
				errorMsg =
					"Invalid file name. Please use only letters, numbers, hyphens, and underscores.";
			} else if (err.message.includes("404")) {
				errorMsg =
					"Repository or file not found. Please check your configuration.";
			} else if (err.message.includes("403") || err.message.includes("401")) {
				errorMsg =
					"Permission denied. Check your PAT has write access to this repository.";
			} else {
				errorMsg = `Failed to create PR: ${err.message}`;
			}

			setError(errorMsg);
			showToast(errorMsg, "error");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setEditingEvent(null);
		setIsAdding(false);
	};

	useEffect(() => {
		if (isAuthenticated && octokit) {
			loadEvents();
		}
	}, [isAuthenticated, octokit]);

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
				{toast && (
					<Toast
						message={toast.message}
						type={toast.type}
						onClose={() => setToast(null)}
					/>
				)}

				<div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border-2 border-cyan-500 w-full max-w-lg">
					<div className="text-center mb-6">
						<h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
							GitHub Files Manager
						</h1>
						<p className="text-gray-400 text-sm mt-2">
							Manage your files with ease
						</p>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-2 text-gray-300">
							GitHub Personal Access Token
						</label>
						<input
							type="password"
							value={pat}
							onChange={(e) => setPat(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAuthenticate()}
							placeholder="ghp_xxxxxxxxxxxx"
							className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-2 text-gray-300">
							Base Repository Path
						</label>
						<input
							type="text"
							value={baseRepoPath}
							onChange={(e) => setBaseRepoPath(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAuthenticate()}
							placeholder="owner/repo or github.com/owner/repo"
							className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-2 text-gray-300">
							Target Folder Path
						</label>
						<input
							type="text"
							value={targetFolderPath}
							onChange={(e) => setTargetFolderPath(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAuthenticate()}
							placeholder="events or docs/posts"
							className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-2 text-gray-300">
							Image Path
						</label>
						<input
							type="text"
							value={imagePath}
							onChange={(e) => setImagePath(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAuthenticate()}
							placeholder="assets/images or public/images"
							className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
						/>
					</div>

					<p className="text-xs text-gray-400 mb-4 leading-relaxed">
						Need a token? Create one at:{" "}
						<span className="text-cyan-400">
							GitHub Settings → Developer settings → Personal access tokens →
							Tokens (classic)
						</span>
						<br />
						Required scopes:{" "}
						<span className="text-cyan-300 font-semibold">repo</span>
					</p>

					{error && (
						<div className="mb-4 p-3 bg-cyan-500/10 border-2 border-cyan-500 text-cyan-200 rounded-xl text-sm">
							{error}
						</div>
					)}

					<button
						onClick={handleAuthenticate}
						className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-cyan-500/50 border-2 border-cyan-400">
						Authenticate
					</button>
				</div>
			</div>
		);
	}

	if (editingEvent || isAdding) {
		return (
			<EventEditor
				event={editingEvent}
				onSave={handleSave}
				onCancel={handleCancel}
				loading={loading}
				error={error}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}

			{confirmDialog && (
				<ConfirmDialog
					message={confirmDialog.message}
					onConfirm={confirmDialog.onConfirm}
					onCancel={() => setConfirmDialog(null)}
				/>
			)}

			<div className="max-w-7xl mx-auto">
				<div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-500 rounded-2xl shadow-2xl p-4 md:p-6 mb-6">
					<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
						<div>
							<h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
								Files Manager
							</h1>
							<p className="text-gray-400 mt-1 text-sm md:text-base">
								{repoOwner}/{repoName} <span className="text-cyan-400">→</span>{" "}
								{targetFolderPath}
							</p>
						</div>
					</div>
				</div>

				{error && (
					<div className="mb-4 p-4 bg-cyan-500/10 border-2 border-cyan-500 text-cyan-200 rounded-xl">
						{error}
					</div>
				)}

				<EventsTable
					events={events}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onAdd={handleAdd}
					loading={loading}
				/>
			</div>
		</div>
	);
}
