TURING HUT # GitHub Events/Newsletters Admin

A Next.js-based admin interface for managing events and newsletters stored in GitHub repositories. This application allows you to create, edit, and delete markdown files directly from a web interface, with all changes submitted via Pull Requests.

## Features

- 🔐 **GitHub PAT Authentication** - Secure authentication using Personal Access Tokens
- 📝 **CRUD Operations** - Create, Read, Update, and Delete event files
- 👁️ **Live Preview** - Real-time markdown preview while editing
- 🔄 **Pull Request Workflow** - All changes are submitted via PRs for review
- 📊 **Table View** - Clean table interface to view all events
- 🎯 **No Environment Variables** - Each user provides their own PAT on page load

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

### Step 2: Authenticate

1. On the application homepage, you'll see a PAT input field
2. Paste your GitHub Personal Access Token
3. Click "Authenticate"

### Step 3: Configure Repository

After authentication, you'll need to configure:

- **Repository Owner**: The GitHub username or organization (e.g., `arbazahmed07`)
- **Repository Name**: The name of the repository (e.g., `my-events-repo`)
- **Events Directory Path**: The path to the directory containing event files (e.g., `events` or `content/events`)

### Step 4: Manage Events

#### View Events

- All events are displayed in a table format
- You can see the filename, path, and a preview of the content

#### Add New Event

1. Click "Add New Event" button
2. Enter a filename (`.md` extension will be added automatically if not provided)
3. Edit the markdown content in the editor
4. Use the live preview to see how it will look
5. Click "Create (Create PR)" to submit a pull request

#### Edit Event

1. Click "Edit" button next to any event
2. Modify the content in the editor
3. Use the live preview to verify changes
4. Click "Update (Create PR)" to submit a pull request

#### Delete Event

1. Click "Delete" button next to any event
2. Confirm the deletion
3. The file will be deleted directly (no PR created for deletions)

## Project Structure

```
app/
├── components/
│   ├── EventsTable.jsx      # Table component for listing events
│   └── EventEditor.jsx      # Editor component with live preview
├── globals.css              # Global styles including markdown prose
├── layout.jsx              # Root layout
└── page.jsx                # Main page with authentication and routing
```

## How It Works

1. **Authentication**: Uses Octokit to authenticate with GitHub using the provided PAT
2. **Read Files**: Fetches markdown files from the specified directory using GitHub API
3. **Edit/Add**: Creates a new branch, commits changes, and opens a PR
4. **Delete**: Directly deletes the file from the repository
5. **Live Preview**: Uses react-markdown to render markdown content in real-time

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

### "Failed to load events"

- Verify the repository owner, name, and path are correct
- Ensure your PAT has access to the repository
- Check that the events directory exists

### "Failed to create PR"

- Ensure you have write access to the repository
- Check if there are no conflicting branch names
- Verify the repository allows PR creation

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
