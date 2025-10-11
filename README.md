TURING HUT # GitHub Events/Newsletters Admin

A Next.js-based admin interface for managing events and newsletters stored in GitHub repositories. This application allows you to create, edit, and delete markdown files directly from a web interface, with all changes submitted via Pull Requests.

## Turing Hut Website Configuration

For the Turing Hut website, use these configuration values:

- **Base Repository Path**: `linustribevnr/turing-hut-website`

### Events Configuration:

- **Target Folder Path**: `src/assets/events`
- **Image Path**: `src/assets/images/events`

### Newsletters Configuration:

- **Target Folder Path**: `src/assets/newsletters`
- **Image Path**: `src/assets/images/newsletters`

## Features

- 🔐 **GitHub PAT Authentication** - Secure authentication using Personal Access Tokens
- 📝 **CRUD Operations** - Create, Read, Update, and Delete files
- 👁️ **Live Preview** - Real-time markdown preview while editing
- 🔄 **Pull Request Workflow** - All changes are submitted via PRs for review
- 📊 **Table View** - Clean table interface to view all files
- 🎯 **Configurable Paths** - Support for custom repository and folder paths
- 🎯 **No Environment Variables** - Each user provides their own PAT and paths on page load

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A GitHub account with repository access
- A GitHub Personal Access Token with `repo` scope

### Installation

1. Clone this repository:

```bash
git clone <your-repo-url>
cd Turing-hut-event-admin
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Step 1: Create a GitHub Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Events Admin")
4. Select the `repo` scope (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't be able to see it again!)

### Step 2: Authenticate and Configure

1. On the application homepage, you'll see form fields for:

   - **GitHub Personal Access Token**: Paste your PAT here
   - **Base Repository Path**: Enter the repository path (e.g., `owner/repo`)
   - **Target Folder Path**: Path where markdown files will be stored
   - **Image Path**: Path where uploaded images will be stored

2. For Turing Hut website, use the configuration values listed above

3. Click "Authenticate"

### Step 3: Manage Files

#### View Files

- All files are displayed in a table format
- You can see the filename, path, and a preview of the content

#### Add New File

1. Click "Add File" button
2. Enter a filename (`.md` extension will be added automatically if not provided)
3. Edit the markdown content in the editor
4. Optionally upload an image
5. Use the live preview to see how it will look
6. Click "Create (Create PR)" to submit a pull request

#### Edit File

1. Click "Edit" button next to any file
2. Modify the content in the editor
3. Optionally change or upload a new image
4. Use the live preview to verify changes
5. Click "Update (Create PR)" to submit a pull request

#### Delete File

1. Click "Delete" button next to any file
2. Confirm the deletion
3. The file will be deleted directly (no PR created for deletions)

## Project Structure

```
app/
├── components/
│   ├── EventsTable.jsx      # Table component for listing files
│   ├── EventEditor.jsx      # Editor component with live preview
│   ├── Toast.jsx           # Toast notification component
│   └── ConfirmDialog.jsx   # Confirmation dialog component
├── globals.css              # Global styles including markdown prose
├── layout.jsx              # Root layout
└── page.jsx                # Main page with authentication and routing
```

## How It Works

1. **Authentication**: Uses Octokit to authenticate with GitHub using the provided PAT
2. **Configuration**: User provides repository path, target folder, and image folder paths
3. **Read Files**: Fetches markdown files from the specified directory using GitHub API
4. **Edit/Add**: Creates a new branch, commits changes, uploads images, and opens a PR
5. **Delete**: Directly deletes the file from the repository
6. **Live Preview**: Uses react-markdown to render markdown content in real-time
7. **Image Upload**: Supports uploading images which are automatically linked in markdown

## Technologies Used

- **Next.js 15** - React framework with App Router
- **Octokit** - GitHub REST API client
- **React Markdown** - Markdown rendering for live preview
- **Tailwind CSS** - Utility-first CSS framework
- **Gray Matter** - Parse markdown frontmatter (available if needed)

## Security Notes

- PATs are stored only in browser memory and never sent to any server except GitHub
- Each user must provide their own PAT
- All changes are made through PRs, allowing for review before merging
- Recommend using fine-grained PATs with minimal necessary permissions

## Customization

### Changing the Default Template

Edit the default template in `app/components/EventEditor.jsx`:

```javascript
setContent(`---
title: "Your Custom Title"
// ... your custom frontmatter
---

# Your Custom Content
`);
```

### Styling the Markdown Preview

Modify the prose styles in `app/globals.css` to customize how the markdown renders.

## Troubleshooting

### "Authentication failed"

- Verify your PAT is correct and has the `repo` scope
- Check if the token has expired

### "Failed to load files"

- Verify the repository owner, name, and path are correct
- Ensure your PAT has access to the repository
- Check that the target directory exists

### "Failed to create PR"

- Ensure you have write access to the repository
- Check if there are no conflicting branch names
- Verify the repository allows PR creation

### Image upload fails

- Check that the image path is correct
- Ensure your PAT has write permissions
- Verify image file size is reasonable (GitHub has limits)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
