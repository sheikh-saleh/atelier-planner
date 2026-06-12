# Sepia Theme Design Specification

## Overview

Add a new "Sepia" theme to the Atelier planner app as a third option alongside Light and Dark themes. The Sepia theme provides a warm, paper-like aesthetic with subtle cream tones and a dusty blue accent color.

## Requirements

- Add Sepia as third theme option (Light, Dark, Sepia)
- Subtle intensity - slightly warmer than default light theme
- Dusty Blue accent color
- CSS Class-based implementation (consistent with existing pattern)
- Full accessibility support

## Color Palette

### Background Colors
```css
--bg: #F5F0E6;           /* Warm cream - main background */
--bg-soft: #EDE7D8;      /* Slightly darker - secondary bg */
--bg-card: #FAF7F0;      /* Paper white - card surfaces */
```

### Text Colors
```css
--fg: #3D3830;           /* Dark brown - primary text */
--fg-soft: #706858;      /* Medium brown - secondary text */
--fg-muted: #A89E8C;     /* Light brown - muted text */
```

### Border Colors
```css
--border: #D8D0C2;       /* Warm gray - main borders */
--border-soft: #E8E0D4;  /* Subtle warm - soft borders */
```

### Accent Colors (Dusty Blue)
```css
--accent: #5A7794;       /* Muted blue - primary accent */
--accent-soft: #D6DFE8;  /* Light blue tint - accent bg */
```

### Scale Variables

**Sepia Scale (new):**
```css
--sepia-50: #FAF7F0;
--sepia-100: #F5F0E6;
--sepia-200: #EDE7D8;
--sepia-300: #D8D0C2;
--sepia-400: #A89E8C;
--sepia-500: #706858;
```

**Existing scales (reused):**
- Cream scale: #FCFAF6 → #D9D0BD
- Ink scale: #F5F4F2 → #171612
- Blue-dusty scale: #EEF2F6 → #3E5876

## Implementation Approach

**CSS Class-based (Approach 1):**
- Add `.sepia` class alongside `.dark`
- Define CSS variables in globals.css
- Extend ThemeProvider to handle 3 states
- Minimal changes to existing components

## File Changes

### 1. globals.css

Add new `.sepia` class with CSS variables:
```css
.sepia {
  --bg: #F5F0E6;
  --bg-soft: #EDE7D8;
  --bg-card: #FAF7F0;
  --fg: #3D3830;
  --fg-soft: #706858;
  --fg-muted: #A89E8C;
  --border: #D8D0C2;
  --border-soft: #E8E0D4;
  --accent: #5A7794;
  --accent-soft: #D6DFE8;

  /* Sepia scale */
  --sepia-50: #FAF7F0;
  --sepia-100: #F5F0E6;
  --sepia-200: #EDE7D8;
  --sepia-300: #D8D0C2;
  --sepia-400: #A89E8C;
  --sepia-500: #706858;

  /* Reuse existing scales with sepia overrides */
  --cream-50: #FCFAF6;
  --cream-100: #FAF7F0;
  --cream-200: #F5F0E6;
  --cream-300: #EDE7D8;
  --cream-400: #D8D0C2;

  --ink-50: #FAF7F0;
  --ink-100: #E8E0D4;
  --ink-200: #A89E8C;
  --ink-300: #706858;
  --ink-400: #3D3830;
  --ink-500: #2A2520;
  --ink-600: #1F1A16;
  --ink-700: #151210;

  --shadow: 61, 56, 48;
}
```

### 2. ThemeProvider.tsx

Update type and logic:
```typescript
type Theme = "light" | "dark" | "sepia";

// In ThemeProvider component:
useEffect(() => {
  if (!hydrated) return;
  const root = document.documentElement;
  root.classList.remove("dark", "sepia");
  if (theme === "dark") root.classList.add("dark");
  else if (theme === "sepia") root.classList.add("sepia");
}, [theme, hydrated]);

const toggleTheme = useCallback(() => {
  const next = theme === "light" ? "dark" : theme === "dark" ? "sepia" : "light";
  setSettings({ theme: next });
}, [theme, setSettings]);
```

### 3. SettingsPanel.tsx

Update theme toggle to show 3 options:
```typescript
{(["light", "dark", "sepia"] as const).map((t) => (
  <button
    key={t}
    onClick={() => setTheme(t)}
    className={`px-3 h-8 text-xs font-medium rounded capitalize ${
      theme === t ? "bg-[var(--accent)] text-cream-50" : "text-[var(--fg-soft)]"
    }`}
  >
    {t}
  </button>
))}
```

### 4. layout.tsx

Update theme script to handle sepia:
```javascript
var theme = 'light';
if (raw) {
  var parsed = JSON.parse(raw);
  if (parsed && parsed.settings) {
    theme = parsed.settings.theme || 'light';
  }
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  theme = 'dark';
}
document.documentElement.classList.remove('dark', 'sepia');
if (theme === 'dark') document.documentElement.classList.add('dark');
else if (theme === 'sepia') document.documentElement.classList.add('sepia');
```

### 5. tailwind.config.ts

Add sepia color scale to theme.extend.colors:
```typescript
sepia: {
  50: "#FAF7F0",
  100: "#F5F0E6",
  200: "#EDE7D8",
  300: "#D8D0C2",
  400: "#A89E8C",
  500: "#706858",
},
```

## Data Model Changes

Update Settings type in lib/types.ts:
```typescript
export interface Settings {
  theme: "light" | "dark" | "sepia";
  // ... other settings
}
```

## Accessibility

- All text colors maintain WCAG AA contrast ratios against backgrounds
- Focus indicators work with dusty blue accent
- Screen readers announce theme changes properly
- Keyboard navigation supports theme toggle

## Testing

- Verify theme persists across page reloads
- Test system preference detection (no sepia default)
- Verify all components render correctly in sepia
- Test theme switching performance

## Migration

- Existing users: No migration needed, defaults to light
- New users: Can select sepia during onboarding
- Data compatibility: Theme preference stored in localStorage

## Success Criteria

1. Sepia theme appears as third option in settings
2. Theme persists across sessions
3. All UI components render correctly
4. No performance regression
5. Accessibility requirements met
