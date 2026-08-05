# AADMI Portfolio — Content Guide

This guide explains how to add, edit, or remove content from your portfolio website.
**No coding knowledge required** — you only need to edit two JSON files.

---

## Quick Start

Your website content lives in two files inside the `data/` folder:

| File | What it controls |
|---|---|
| `data/projects.json` | All projects (posters, descriptions, categories, video links, credits) |
| `data/people.json` | All team members (name, role, bio, photo, social links) |

---

## How to Edit Content

1. Open the file in **Notepad** (right-click → Open with → Notepad)
2. Find the entry you want to change
3. Edit the text between the `"quotation marks"`
4. **Save** the file (Ctrl + S)
5. Upload the changed file to Hostinger (see Deployment section below)

---

## Adding a New Project

Open `data/projects.json` and add a new entry inside the `[ ]` brackets. Copy this template:

```json
{
  "id": "my-new-project",
  "title": "My New Project Title",
  "year": 2025,
  "categories": ["short-films", "direction"],
  "description": "A brief description of the project...",
  "poster": "assets/posters/my-new-project.jpg",
  "videoUrl": "https://www.youtube.com/embed/VIDEO_ID_HERE",
  "duration": "5:30",
  "featured": false,
  "credits": [
    { "personId": "arjun-mehta", "role": "Director" },
    { "personId": "karan-desai", "role": "DI Colorist" }
  ]
}
```

**Important rules:**
- Put a comma `,` after the `}` of the previous entry
- The `id` must be unique, lowercase, with hyphens instead of spaces
- `categories` must use these exact slugs:
  - `animation`
  - `music-videos`
  - `short-films`
  - `di-color-grade`
  - `full-projects`
  - `documentaries`
  - `direction`
  - `production`
  - `ads`
- For `videoUrl`, use the YouTube **embed** URL format: `https://www.youtube.com/embed/VIDEO_ID`
- `featured: true` shows the project on the home page
- `personId` in credits must match the `id` of a person in `people.json`

---

## Adding a New Team Member

Open `data/people.json` and add a new entry:

```json
{
  "id": "new-person-name",
  "name": "Full Name",
  "title": "Their Role / Title",
  "bio": "A short bio about this person...",
  "photo": "assets/team/new-person-name.jpg",
  "socialLinks": {
    "imdb": "https://www.imdb.com/name/...",
    "instagram": "https://www.instagram.com/..."
  }
}
```

**Don't forget to:**
- Add their photo to the `assets/team/` folder
- Use the same `id` when adding them to project credits

---

## Adding Images

### Project Posters
1. Save your poster image as a `.jpg` file
2. Name it to match the project `id` (e.g., `my-new-project.jpg`)
3. Place it in the `assets/posters/` folder

### Team Photos
1. Save the photo as a `.jpg` file
2. Name it to match the person `id` (e.g., `new-person-name.jpg`)
3. Place it in the `assets/team/` folder

**Tip:** Square photos work best for team members. Portrait (2:3 ratio) works best for posters.

---

## Removing Content

To remove a project or person, simply delete their entire entry from the JSON file (from `{` to `}`), including the comma before or after it.

---

## Shareable Category Links

You can send clients direct links to filtered views:

| Link | Shows |
|---|---|
| `aadmi.online/#/work` | All projects |
| `aadmi.online/#/work/animation` | Animation projects only |
| `aadmi.online/#/work/music-videos` | Music videos only |
| `aadmi.online/#/work/short-films` | Short films only |
| `aadmi.online/#/work/di-color-grade` | DI / Color grade work |
| `aadmi.online/#/work/full-projects` | Full feature projects |
| `aadmi.online/#/work/documentaries` | Documentaries |
| `aadmi.online/#/work/direction` | Direction work |
| `aadmi.online/#/work/production` | Production work |

---

## Deploying Changes to Hostinger

1. Log in to your Hostinger account at `hpanel.hostinger.com`
2. Go to **File Manager**
3. Navigate to `public_html`
4. Upload the changed files (you only need to upload the files you changed)
5. Your changes are live immediately!

### First-time deployment:
1. Zip the entire `Aadmi Portfolio` folder
2. Upload the zip to `public_html`
3. Extract (unzip) it in File Manager
4. Done — your site is live at `aadmi.online`

---

## Troubleshooting

**Website shows "Failed to load data"**
- Check that `data/projects.json` and `data/people.json` are valid JSON
- Use [jsonlint.com](https://jsonlint.com) to validate your JSON

**Images not showing**
- Check the file name matches exactly (case-sensitive)
- Make sure the image is in the correct folder (`assets/posters/` or `assets/team/`)

**Project not appearing**
- Make sure you added a comma between entries in the JSON array
- Check that the `id` is unique
