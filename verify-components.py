#!/usr/bin/env python3
"""
Verify component system implementation
"""

import os
import re


def check_file_exists(path):
    """Check if a file exists"""
    return os.path.exists(path)


def check_content(filepath, pattern, description):
    """Check if a file contains a specific pattern"""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        if re.search(pattern, content):
            print(f"✓ {description}")
            return True
        else:
            print(f"✗ {description}")
            return False
    except Exception as e:
        print(f"✗ Error reading {filepath}: {e}")
        return False


def main():
    print("=" * 60)
    print("Component System Verification Report")
    print("=" * 60)

    checks = {
        "Component Files": [
            ("assets/components/header.html", "Header component exists"),
            ("assets/components/footer.html", "Footer component exists"),
        ],
        "CSS Files": [
            ("assets/CSS/style.css", "Main CSS exists"),
            ("assets/CSS/components.css", "Components CSS exists"),
        ],
        "JavaScript Files": [
            ("assets/JS/component-loader.js", "Component loader script exists"),
            ("assets/JS/main.js", "Main script exists"),
        ],
        "Documentation": [
            ("COMPONENTS.md", "Documentation exists"),
        ],
    }

    passed = 0
    total = 0

    for category, files in checks.items():
        print(f"\n{category}:")
        print("-" * 40)
        for filepath, description in files:
            total += 1
            if check_file_exists(filepath):
                print(f"✓ {description}")
                passed += 1
            else:
                print(f"✗ {filepath} not found")

    # Check HTML files have components CSS
    print("\n\nHTML Files Configuration:")
    print("-" * 40)
    html_files = [
        "index.html",
        "library.html",
        "about.html",
        "contact.html",
        "video-player.html",
        "note-viewer.html",
        "404.html",
    ]

    for html_file in html_files:
        if check_file_exists(html_file):
            total += 1
            # Check for components CSS
            if check_content(
                html_file, r"components\.css", f"{html_file} includes components.css"
            ):
                passed += 1

            # Check for component loader script
            total += 1
            if check_content(
                html_file,
                r"component-loader\.js",
                f"{html_file} includes component-loader.js",
            ):
                passed += 1

            # Check that header is removed (or minimal header exists)
            total += 1
            if not check_content(
                html_file,
                r'<header class="site-header">.*?<div class="brand-mark">',
                f"{html_file} has no inline header",
            ):
                passed += 1

    # Check component loader functionality
    print("\n\nComponent Loader Features:")
    print("-" * 40)

    features = [
        (r"async loadComponent\(", "Asynchronous component loading"),
        (r"loadLayout\(\)", "Layout initialization"),
        (r"setActiveNavLink\(\)", "Active navigation link marking"),
        (r"setCurrentYear\(\)", "Current year setting"),
        (r"initMobileMenu\(\)", "Mobile menu initialization"),
    ]

    for pattern, description in features:
        total += 1
        if check_content(
            "assets/JS/component-loader.js",
            pattern,
            f"Component loader has {description}",
        ):
            passed += 1

    # Summary
    print("\n" + "=" * 60)
    print(f"Results: {passed}/{total} checks passed")
    print("=" * 60)

    if passed == total:
        print("\n✓ All component system checks passed!")
        print("\nYou can now:")
        print("  1. Update header/footer in assets/components/ files")
        print("  2. Changes will automatically appear on all pages")
        print("  3. Refer to COMPONENTS.md for detailed documentation")
    else:
        print(f"\n⚠ {total - passed} checks failed. Please review the above.")


if __name__ == "__main__":
    main()
