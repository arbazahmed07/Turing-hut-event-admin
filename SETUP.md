# Quick Setup Guide

## 1. Generate GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `Events Admin`
4. Scopes: Check `repo` (Full control of private repositories)
5. Click "Generate token" at the bottom
6. **IMPORTANT**: Copy the token immediately (you won't see it again!)

## 2. Run the Application

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 3. Configure the Application

### On First Load:

1. **Enter your PAT** in the input field
2. Click "Authenticate"

### Configure Repository:

1. **Repository Owner**: Your GitHub username or org (e.g., `arbazahmed07`)
2. **Repository Name**: The repo name (e.g., `my-events-repo`)
3. **Events Directory Path**: Path to events folder (e.g., `events` or `content/events`)
4. Click "Continue"

## 4. Usage Examples

### Example Repository Structure:

```
my-events-repo/
└── events/
    ├── event-1.md
    ├── event-2.md
    └── newsletter-jan-2025.md
```

### Example Configuration:

- Repository Owner: `arbazahmed07`
- Repository Name: `my-events-repo`
- Events Directory Path: `events`

### Example Event File Format:

```markdown
---
title: "Tech Meetup 2025"
date: "2025-03-15"
location: "San Francisco, CA"
---

# Tech Meetup 2025

Join us for an exciting tech meetup...

## Agenda

- 5:00 PM - Registration
- 5:30 PM - Keynote
- 6:30 PM - Networking
```

## 5. Common Operations

### Add New Event:

1. Click "Add New Event"
2. Enter filename: `new-event.md` (or just `new-event`)
3. Edit content using the editor
4. Preview in real-time on the right
5. Click "Create (Create PR)"
6. A PR will be created in your repository

### Edit Event:

1. Click "Edit" next to any event
2. Modify content
3. Preview changes
4. Click "Update (Create PR)"
5. A PR with your changes will be created

### Delete Event:

1. Click "Delete" next to any event
2. Confirm deletion
3. File is deleted immediately (no PR)

## 6. Important Notes

- ✅ Your PAT is only stored in browser memory
- ✅ All edits/additions go through Pull Requests
- ✅ You can review PRs before merging on GitHub
- ✅ Delete operations are immediate (use carefully!)
- ✅ Works with both `.md` and `.mdx` files

## 7. Troubleshooting

**Can't authenticate?**

- Make sure your PAT has the `repo` scope
- Check that the token hasn't expired

**Can't see events?**

- Verify repository owner, name, and path are correct
- Make sure the events directory exists in your repo
- Check that your PAT has access to the repository

**PR creation failed?**

- Ensure you have write access to the repository
- Check if there's already a branch with the same name

## 8. Security Best Practices

1. **Never share your PAT** - Treat it like a password
2. **Use fine-grained tokens** if possible with minimal permissions
3. **Regenerate tokens periodically** for security
4. **Revoke unused tokens** at https://github.com/settings/tokens

## 9. Next Steps

After creating a PR:

1. Go to your GitHub repository
2. Navigate to "Pull Requests"
3. Review the changes
4. Merge the PR when ready

Enjoy managing your events! 🎉
