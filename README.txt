PERSONAL PORTFOLIO WEBSITE

This version includes:
- Your uploaded photo displayed in TWO photo sections.
- Animated particles, glowing orbs, moving grid background, and floating effects.
- Animation controls and animation speed control.
- Light/dark mode.
- Responsive layout for desktop, tablet, and mobile.

FOLDER STRUCTURE
Personal_Portfolio/
  index.html
  style.css
  script.js
  README.txt
  images/
    profile-photo-1.png
    profile-photo-2.png

XAMPP
1. Copy the entire Personal_Portfolio folder into C:\xampp\htdocs\
2. Start Apache in XAMPP.
3. Open: http://localhost/Personal_Portfolio/

LAN
1. Run ipconfig and find the computer's IPv4 address.
2. From another device on the same network, open: http://YOUR-IP-ADDRESS/Personal_Portfolio/
3. Allow Apache through Windows Firewall if needed.

INFINITYFREE
Upload the files inside Personal_Portfolio to your site's web directory.

PHOTO CHANGES
Replace images/profile-photo-1.png and images/profile-photo-2.png with your own images while keeping the same filenames, or edit the image paths in index.html.


AI CHAT ASSISTANT ("Ask AI" button, bottom-left)
- Works out of the box with built-in answers about your skills, projects, education, and leadership.
- To make it a real AI that answers any question about you:
  1. Get an API key at console.anthropic.com.
  2. Open chat.php and paste the key where it says PASTE_YOUR_ANTHROPIC_API_KEY_HERE.
  3. Run the site through XAMPP (PHP enabled). 
  Note: some free hosts (including InfinityFree) block outgoing API calls; if so the chat keeps using the built-in answers.
- Keep the key ONLY in chat.php, never in script.js. API usage is billed to your account.


BOOK LAYOUT
- The site opens as a book: click "Open the book", then turn pages with the arrows, dots, keyboard (left/right), swipe, or the menu.
- Switch between Book and Scroll layouts in the Appearance panel (the paint button in the menu).
