#!/usr/bin/env python3
"""
Update all HTML files to use the component loader system
"""

import os
import re

# List of HTML files to update (excluding component files)
HTML_FILES = [
    "library.html",
    "about.html",
    "contact.html",
    "video-player.html",
    "note-viewer.html",
    "404.html",
]


def add_components_css(html_content):
    """Add components.css link after style.css"""
    return re.sub(
        r'(<link rel="stylesheet" href="assets/CSS/style\.css" />\n)',
        r'\1  <link rel="stylesheet" href="assets/CSS/components.css" />\n',
        html_content,
    )


def remove_header_and_mobile_panel(html_content):
    """Remove the header element and mobile panel from HTML"""
    # Remove header element
    html_content = re.sub(
        r'  <header class="site-header">.*?</header>\n\n',
        "",
        html_content,
        flags=re.DOTALL,
    )

    # Remove mobile panel
    html_content = re.sub(
        r'  <div class="mobile-panel" data-mobile-panel>.*?</div>\n\n',
        "",
        html_content,
        flags=re.DOTALL,
    )

    return html_content


def remove_footer(html_content):
    """Remove the footer element from HTML"""
    return re.sub(
        r'  <footer class="site-footer">.*?</footer>\n\n',
        "",
        html_content,
        flags=re.DOTALL,
    )


def update_scripts(html_content):
    """Update the script tags at the end of body"""
    # Replace the closing body block with new script tags
    return re.sub(
        r'  <script src="assets/JS/main\.js"></script>\n</body>',
        '  <script src="assets/JS/component-loader.js"></script>\n  <script src="assets/JS/main.js"></script>\n</body>',
        html_content,
    )


def update_html_file(filepath):
    """Update a single HTML file"""
    print(f"Processing {filepath}...")

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Apply all transformations
        content = add_components_css(content)
        content = remove_header_and_mobile_panel(content)
        content = remove_footer(content)
        content = update_scripts(content)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

        print(f"✓ Updated {filepath}")
        return True
    except Exception as e:
        print(f"✗ Error updating {filepath}: {e}")
        return False


def main():
    """Update all HTML files"""
    print("Updating HTML files to use component loader system...\n")

    updated = 0
    failed = 0

    for filename in HTML_FILES:
        filepath = filename
        if os.path.exists(filepath):
            if update_html_file(filepath):
                updated += 1
            else:
                failed += 1
        else:
            print(f"⚠ File not found: {filepath}")

    print(f"\n{'='*50}")
    print(f"Summary: {updated} files updated, {failed} files failed")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
