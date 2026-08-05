# Hostinger Deployment Guide for AADMI Portfolio

This guide will walk you through deploying your static portfolio site to Hostinger. The site is a pure static HTML/CSS/JS site, meaning no server configuration (Node.js, PHP, database, etc.) is required.

## Step 1: Get the ZIP file
A file named `aadmi_website.zip` has been created in your `Aadmi Portfolio` folder. This contains everything your website needs.

## Step 2: Log into Hostinger
1. Go to [hostinger.com](https://www.hostinger.com/) and log in to your account.
2. Navigate to your **hPanel** (Hosting Dashboard).
3. Find your domain (`aadmi.online`) and click **Manage**.

## Step 3: Open File Manager
1. In the sidebar on the left (or in the main dashboard area), look for the **Files** section.
2. Click on **File Manager**.

## Step 4: Upload the Website
1. In the File Manager, open the `public_html` directory. **This is where your live website files must go.**
2. If there are any default Hostinger files in there (like `default.php` or `index.php`), **delete them**. The folder should either be empty or only contain files you want to overwrite.
3. Click the **Upload** icon (usually an arrow pointing up at the top right).
4. Select **File** and upload the `aadmi_website.zip` from your computer.

## Step 5: Extract the ZIP
1. Once uploaded, right-click the `aadmi_website.zip` file in the File Manager.
2. Select **Extract**.
3. It will ask for a folder name to extract to. **Make sure you extract directly into `public_html`**. If it creates a sub-folder (like `public_html/aadmi_website`), you will need to move all the files out of that sub-folder and directly into `public_html`.
   *(Your `index.html` file should sit exactly at `/public_html/index.html`)*
4. After extraction, you can safely delete the `aadmi_website.zip` file from the server to save space.

## Step 6: Verify
1. Open a new browser tab.
2. Go to `https://aadmi.online`.
3. Your portfolio site should be live!

---

## Future Content Updates
When you want to add new projects or team members:
1. Open `data/projects.json` or `data/people.json` on your computer (see `CONTENT_GUIDE.md` for simple instructions).
2. Go to your Hostinger File Manager.
3. Navigate to `public_html/data/`.
4. Upload and overwrite the updated `projects.json` or `people.json` file.
5. The site will immediately reflect the changes!
