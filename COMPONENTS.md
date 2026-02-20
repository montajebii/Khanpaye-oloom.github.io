# Component System Documentation

## Overview

This project uses a dynamic component loading system that separates shared UI elements (header and footer) from individual page HTML files. This approach enables:

- **Single source of truth**: Update header/footer once, reflect changes everywhere
- **Dynamic sizing**: Components automatically adjust to content changes
- **Cleaner HTML**: Page files contain only unique content
- **Easy maintenance**: Centralized component management

## File Structure

```
assets/
├── components/
│   ├── header.html      # Shared header component
│   └── footer.html      # Shared footer component
├── CSS/
│   ├── style.css        # Main styles
│   └── components.css   # Dynamic sizing styles
└── JS/
    ├── component-loader.js  # Component loading system
    └── main.js             # Page-specific scripts
```

## How It Works

### 1. Static Components

- `assets/components/header.html` - Contains the header HTML
- `assets/components/footer.html` - Contains the footer HTML

These are plain HTML files without any styling beyond semantic structure.

### 2. Component Loader

The `assets/JS/component-loader.js` file:

1. **Loads components**: Fetches header.html and footer.html from the asset folder
2. **Inserts into DOM**: Places header before main content and footer after
3. **Sets active links**: Marks current page's navigation link as active
4. **Initializes interactivity**: Sets up mobile menu toggle functionality

```javascript
// Auto-runs on page load
const loader = new ComponentLoader();
loader.loadLayout();
```

### 3. Dynamic Sizing Styles

File: `assets/CSS/components.css`

Uses CSS functions for flexibility:

- **clamp()**: Responsive sizing between min and max sizes
- **Flexbox/Grid**: Automatic layout adjustments
- **gap**: Flexible spacing that scales with viewport

Example:

```css
.brand-mark {
  width: clamp(36px, 8vw, 52px);  /* Min 36px, Preferred 8% viewport, Max 52px */
  height: clamp(36px, 8vw, 52px);
}
```

## Usage

### On Every Page

1. **Include CSS**:

```html
<link rel="stylesheet" href="assets/CSS/style.css" />
<link rel="stylesheet" href="assets/CSS/components.css" />
```

1. **Include component loader**:

```html
<script src="assets/JS/component-loader.js"></script>
<script src="assets/JS/main.js"></script>
```

1. **Page HTML structure**:

```html
<body>
  <a class="skip-link" href="#content">رفتن به محتوا</a>
  
  <!-- Header and footer auto-loaded here -->
  
  <main id="content">
    <!-- Your page-specific content -->
  </main>
</body>
```

### Updating Components

To update the header or footer:

1. Edit `assets/components/header.html` or `assets/components/footer.html`
2. Changes automatically appear on all pages next time they load
3. **No need to update individual page files**

## Features

### Responsive Header

- **Desktop**: Full navigation bar with action buttons
- **Tablet**: Condensed layout with wrapping
- **Mobile**: Hidden navigation, mobile toggle menu

### Responsive Footer

- **Desktop**: 3-column grid
- **Tablet**: 2-column grid
- **Mobile**: Single column layout

### Dynamic Navigation

The component loader:

- Automatically detects current page
- Sets `.active` class on matching navigation link
- Updates mobile panel links identically

### Mobile Menu

- Toggle button appears on screens < 768px
- Menu slides in from the right
- Closes on link click or outside click
- Smooth animations (respects `prefers-reduced-motion`)

## CSS Properties Used

### clamp() Function

```css
/* clamp(minimum, preferred, maximum) */
.element {
  font-size: clamp(12px, 2vw, 18px);
  /* At least 12px, ideally 2% of viewport width, maximum 18px */
}
```

### Flexbox/Grid Layout

```css
.container {
  display: flex;
  gap: clamp(8px, 2vw, 16px);  /* Dynamic gap */
  flex-wrap: wrap;              /* Wraps on small screens */
}
```

### Media Queries

Responsive breakpoints:

- **768px and down**: Mobile layout
- **480px and down**: Extra small screens

## Accessibility

The component system maintains accessibility:

- Skip links for screen readers
- ARIA labels on navigation
- Semantic HTML structure
- Focus indicators
- Mobile toggle button for keyboard users
- Respects `prefers-reduced-motion` setting

## Performance

- **Lightweight**: Only ~3KB for component-loader.js
- **Cached**: Components cached after first fetch
- **No dependencies**: Pure vanilla JavaScript
- **Fast loading**: Fetch API for efficiency
- **Progressive enhancement**: Works without JavaScript (though auto-loading won't happen)

## Troubleshooting

### Components not loading?

1. Check browser console for errors
2. Verify paths are correct (relative to page location)
3. Check CORS if serving from different domain
4. Ensure HTML files exist at specified paths

### Styling issues?

1. Ensure `components.css` is loaded
2. Check z-index issues (header is z-index: 200)
3. Verify viewport meta tag is present

### Mobile menu not working?

1. Check `data-mobile-toggle` and `data-mobile-panel` attributes
2. Verify JavaScript is enabled
3. Check for conflicting styles/scripts

## Future Enhancements

Possible improvements:

- Add sidebar component
- Create reusable button component library
- Add theme switching
- Create form components
- Add animation components

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES6 support (fetch API, const/let)
- Graceful degradation for older browsers possible with polyfills
