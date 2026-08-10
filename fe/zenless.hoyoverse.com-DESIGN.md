# Design System Inspired by Zenless Zone Zero

> [!IMPORTANT]
> The implementation profile below supersedes any conflicting palette, typography,
> radius, or layout guidance in the original visual study that follows. The older
> notes are retained as source-analysis history only.

## 0. Bonkey StreamV2 Implementation Profile (2026)

### Visual references

- [Zenless Zone Zero — Main Site](https://zenless.hoyoverse.com/id-id/main)
- [Zenless Zone Zero — Video Gallery](https://zenless.hoyoverse.com/id-id/video)
- Additional approved references: the desktop screenshots supplied with this project.

### Theme model

- Discovery, library, detail, search, and error pages use an off-white
  editorial canvas (`#f1f1ef`) with charcoal ink (`#1a1a1a`).
- Acid lime (`#d8ff00`) is the single dominant signal color for active states,
  labels, progress, and primary actions.
- The Watch route is intentionally dark so the media remains the visual focus.
  Route metadata controls the theme at document level, including browser
  `theme-color` and `color-scheme`.
- Black diagonal-stripe panels, film-strip perforations, clipped corners, numbered
  labels, and asymmetric composition provide the ZZZ-inspired visual language.
- Components are mostly flat and outlined. Avoid generic floating cards, excessive
  rounding, soft shadows, gradients, and decorative glass effects.

### Typography

- Primary family: `Helvetica Neue`, loaded from
  `https://fonts.cdnfonts.com/css/helvetica-neue-55`.
- Fallback: Helvetica, Arial, system sans-serif.
- Display headings use tight tracking, heavy weight, compact line-height, and
  responsive sizing. Metadata and controls remain compact but never below a
  readable 10px equivalent.

### Responsive and interaction rules

- Desktop compositions may be asymmetric; mobile preserves the hierarchy by
  stacking content rather than shrinking it into miniature desktop layouts.
- Navigation becomes a keyboard-contained modal drawer on small screens, with
  focus restoration, Escape dismissal, background inertness, and scroll lock.
- Motion is restrained to direct feedback and short transitions. Operating-system
  reduced-motion preferences always win.
- Pagination exposes bounded page numbers when a total is known. When it is not,
  the UI shows the current page with previous/next controls only.

### Product constraints

- Existing API, streaming resolver, downloads, local favorites, and local viewing
  history behavior must remain unchanged by visual refactors.
- Download options render only when valid links are supplied by the API.
- Stream playback uses the Bonkey StreamV2 `/api/resolve` endpoint.

## 1. Visual Theme & Atmosphere

The Zenless Zone Zero design system embodies a dark, immersive cyberpunk aesthetic infused with mysterious urban exploration. The visual language is defined by high contrast between deep charcoal backgrounds and selective accent colors that evoke danger, energy, and technological sophistication. The atmosphere is moody yet purposeful—evoking the tension of navigating the Hollows while maintaining clarity and navigational intent. This is a design system for a mature, action-oriented game world where every element serves both aesthetic and functional purposes, balancing minimalist restraint with vivid accent moments.

**Key Characteristics**
- Deep, near-black backgrounds with subtle mid-tone variations
- Vibrant accent colors (electric cyan, warning gold, coral red) used sparingly for emphasis
- Geometric precision with clean, modern sans-serif typography
- High contrast text rendering optimized for readability on dark surfaces
- Cinematic depth created through layered elevations and shadow play
- Futuristic yet grounded aesthetic reflecting urban dystopian themes

## 2. Color Palette & Roles

### Primary
- **Dark Surface Base** (`#3C3F44`): Primary background color for main content areas and card surfaces; establishes visual hierarchy through subtle tonal variation from pure black
- **Darker Surface** (`#323339`): Secondary background used for nested containers and secondary surface elements; creates visual layering
- **Deepest Background** (`#2D2E33`): Tertiary dark surface for specialized contexts and tertiary UI planes

### Accent Colors
- **Gold Accent** (`#D3BC8E`): Warm metallic accent for premium, luxe, or heritage-related content; communicates value and rarity
- **Electric Cyan** (`#29D4FF`): High-energy, neon accent for technology, activation states, and futuristic UI elements; draws immediate attention
- **Coral Red** (`#FF5E41`): Urgent, energetic accent for action calls-to-action and high-impact moments; signals intensity
- **Royal Blue** (`#556AD0`): Secondary accent color for information hierarchy and secondary action states

### Interactive
- **Link Gray** (`#787878`): Default text color for interactive elements and navigation; maintains readable contrast while indicating interactivity
- **Muted Interactive** (`#919191`): Hover or secondary interactive states; lighter than default for visual feedback
- **Neutral Interactive** (`#898989`): Alternative interactive color for specific contexts requiring distinction

### Neutral Scale
- **Pure Black** (`#000000`): Text, icons, and maximum contrast elements; primary text color for all content
- **Pure White** (`#FFFFFF`): Secondary text and light accent elements on dark backgrounds; highest contrast option
- **Light Gray** (`#CCD0D2`): Subtle text, disabled states, and low-emphasis content
- **Medium Gray** (`#61636B`): Mid-tone text and secondary content hierarchy
- **Dark Gray** (`#222122`): Subtle backgrounds and borders requiring minimal visual weight

### Surface & Borders
- **Border Gray** (`#787878`): Default border color for cards, inputs, and component boundaries; provides definition without heaviness
- **Subtle Border** (`#919191`): Secondary borders and dividers; minimal visual weight

### Semantic / Status
- **Warning Lime Primary** (`#D8FA00`): Primary warning and alert states; high visibility for critical information
- **Warning Lime Secondary** (`#C6E800`): Secondary warning emphasis; slightly muted variant
- **Warning Amber** (`#DB9A45`): Tertiary warning indicator; warm tone for cautionary states

## 3. Typography Rules

### Font Family
- **Primary:** "en inpin", sans-serif; a custom font that provides the signature geometric, slightly futuristic aesthetic unique to the Zenless Zone Zero brand
- **Secondary / UI:** "meSubFont", sans-serif; specialized secondary typeface for labels, metadata, and compact information
- **Fallback System:** system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|-----------------|-------|
| Display / Hero | en inpin | 56px | 400 | 56px | 0px | Large-scale brand presence and primary page headlines |
| Heading 1 | en inpin | 40px | 400 | 44px | 0px | Primary section headings and major content divisions |
| Heading 2 | en inpin | 32px | 400 | 36px | 0px | Secondary section headers and subsection titles |
| Heading 3 | en inpin | 24px | 400 | 28px | 0px | Tertiary headings and card titles |
| Body / Paragraph | en inpin | 16px | 400 | 20px | 0px | Main content text and narrative copy |
| Body Small | en inpin | 14px | 400 | 18px | 0px | Secondary body text and descriptions |
| Button / CTA | system-ui | 16px | 400 | 48px | 0px | Interactive button labels; line-height accommodates touch target |
| Label / Navigation | meSubFont | 11px | 700 | 11px | 0.5px | Navigation items, labels, and metadata text |
| Caption / Meta | meSubFont | 10px | 700 | 12px | 0px | Captions, timestamps, and supplementary information |
| Code / Monospace | system-ui | 12px | 400 | 16px | 0px | Developer-focused or technical content display |

### Principles
- **Geometric Precision:** Typography uses the custom "en inpin" font to establish brand identity; every size is intentional and tied to the modular spacing system
- **Contrast-First:** All text achieves WCAG AA minimum contrast ratios against background colors; pure black text on light backgrounds, white/light gray on dark
- **Readability in Context:** Body text at 16px minimum ensures comfort for reading; navigation remains compact at 11px because labels are brief and supplementary
- **Hierarchical Clarity:** Font weight remains consistent (400 regular as default); semantic hierarchy established through size rather than weight to maintain elegance
- **Scale Consistency:** Typography sizes follow an 8px base unit pattern: 10, 11, 14, 16, 24, 32, 40, 56px

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: `#556AD0`
- Text Color: `#FFFFFF`
- Font: system-ui, 16px, weight 400
- Padding: `12px 32px`
- Height: `48px`
- Border Radius: `24px`
- Border: `1px solid #556AD0`
- Hover: Background `#6B7DD8`, shadow `0px 8px 24px rgba(85, 106, 208, 0.32)`
- Active: Background `#4A5AB8`, shadow `0px 4px 12px rgba(85, 106, 208, 0.24)`
- Disabled: Background `#3C3F44`, Text `#787878`, shadow `none`

**Secondary Button**
- Background: `transparent`
- Text Color: `#787878`
- Font: system-ui, 16px, weight 400
- Padding: `12px 32px`
- Height: `48px`
- Border Radius: `24px`
- Border: `1px solid #787878`
- Hover: Border `#919191`, Text `#919191`
- Active: Border `#CCD0D2`, Text `#CCD0D2`
- Disabled: Border `#61636B`, Text `#61636B`

**Ghost Button (Transparent)**
- Background: `transparent`
- Text Color: `#787878`
- Font: system-ui, 16px, weight 400
- Padding: `12px 32px`
- Height: `48px`
- Border Radius: `24px`
- Border: `none`
- Hover: Background `rgba(120, 120, 120, 0.1)`, Text `#919191`
- Active: Background `rgba(120, 120, 120, 0.2)`, Text `#CCD0D2`
- Disabled: Text `#61636B`

**Accent Button (Cyan/Action)**
- Background: `#29D4FF`
- Text Color: `#000000`
- Font: system-ui, 16px, weight 400
- Padding: `12px 32px`
- Height: `48px`
- Border Radius: `24px`
- Border: `1px solid #29D4FF`
- Hover: Background `#4CDFFF`, shadow `0px 8px 24px rgba(41, 212, 255, 0.32)`
- Active: Background `#0BBEF0`, shadow `0px 4px 12px rgba(41, 212, 255, 0.24)`
- Disabled: Background `#3C3F44`, Text `#787878`

**Icon Button**
- Background: `transparent`
- Icon Color: `#787878`
- Width: `48px`
- Height: `48px`
- Padding: `0px`
- Border Radius: `8px`
- Border: `none`
- Hover: Background `rgba(120, 120, 120, 0.1)`, Icon `#919191`
- Active: Background `rgba(120, 120, 120, 0.2)`, Icon `#CCD0D2`

### Cards & Containers

**Standard Card**
- Background: `#3C3F44`
- Border: `1px solid #61636B`
- Border Radius: `8px`
- Padding: `24px`
- Box Shadow: `0px 4px 16px rgba(0, 0, 0, 0.24)`
- Text Color: `#FFFFFF`

**Elevated Card**
- Background: `#3C3F44`
- Border: `1px solid #61636B`
- Border Radius: `8px`
- Padding: `24px`
- Box Shadow: `0px 12px 32px rgba(0, 0, 0, 0.48)`
- Text Color: `#FFFFFF`

**Flat Card (Minimal)**
- Background: `#323339`
- Border: `none`
- Border Radius: `4px`
- Padding: `16px`
- Box Shadow: `none`
- Text Color: `#CCD0D2`

**Featured / Highlighted Card**
- Background: `#3C3F44`
- Border: `2px solid #29D4FF`
- Border Radius: `8px`
- Padding: `24px`
- Box Shadow: `0px 8px 24px rgba(41, 212, 255, 0.16)`
- Text Color: `#FFFFFF`

### Inputs & Forms

**Text Input (Default)**
- Background: `rgba(0, 0, 0, 0.4)`
- Border: `1px solid #61636B`
- Border Radius: `4px`
- Padding: `12px 16px`
- Height: `44px`
- Font: system-ui, 16px, weight 400
- Text Color: `#CCD0D2`
- Placeholder Color: `#787878`
- Focus: Border `#29D4FF`, Box Shadow `0px 0px 0px 3px rgba(41, 212, 255, 0.1)`

**Text Input (Active/Focused)**
- Border: `1px solid #29D4FF`
- Box Shadow: `0px 0px 0px 3px rgba(41, 212, 255, 0.1)`
- Text Color: `#FFFFFF`

**Text Input (Disabled)**
- Background: `rgba(0, 0, 0, 0.2)`
- Border: `1px solid #61636B`
- Text Color: `#61636B`
- Opacity: `0.6`

**Text Input (Error)**
- Border: `1px solid #FF5E41`
- Box Shadow: `0px 0px 0px 3px rgba(255, 94, 65, 0.1)`

**Textarea**
- Background: `rgba(0, 0, 0, 0.4)`
- Border: `1px solid #61636B`
- Border Radius: `4px`
- Padding: `12px 16px`
- Font: system-ui, 14px, weight 400
- Min Height: `96px`
- Text Color: `#CCD0D2`
- Placeholder Color: `#787878`
- Focus: Border `#29D4FF`, Box Shadow `0px 0px 0px 3px rgba(41, 212, 255, 0.1)`

**Checkbox / Radio**
- Default: Border `1px solid #787878`, Background `transparent`, Size `20px`
- Checked: Background `#556AD0`, Border `1px solid #556AD0`
- Focus: Box Shadow `0px 0px 0px 2px rgba(85, 106, 208, 0.2)`
- Disabled: Background `#61636B`, Opacity `0.5`

### Navigation

**Primary Navigation Item**
- Font: meSubFont, 11px, weight 700
- Color: `#787878`
- Padding: `16px 12px`
- Height: `56px`
- Hover: Color `#919191`
- Active: Color `#29D4FF`, Border Bottom `2px solid #29D4FF`
- Disabled: Color `#61636B`

**Secondary Navigation / Breadcrumb**
- Font: meSubFont, 10px, weight 700
- Color: `#787878`
- Separator: ` / ` in `#61636B`
- Hover: Color `#919191`
- Active: Color `#CCD0D2`

**Dropdown Menu**
- Background: `#323339`
- Border: `1px solid #61636B`
- Border Radius: `4px`
- Box Shadow: `0px 8px 24px rgba(0, 0, 0, 0.48)`
- Item Height: `44px`
- Item Padding: `12px 16px`
- Item Color: `#CCD0D2`
- Item Hover: Background `#3C3F44`, Color `#FFFFFF`
- Item Active: Background `#556AD0`, Color `#FFFFFF`

### Links

**Default Link**
- Color: `#29D4FF`
- Text Decoration: `none`
- Font: system-ui or inherit, weight 400
- Font Size: `inherit`
- Hover: Text Decoration `underline`, Color `#4CDFFF`
- Active: Color `#0BBEF0`
- Visited: Color `#7B7F8A`

**Text Link (In Paragraph)**
- Color: `#787878`
- Border Bottom: `1px solid #787878`
- Hover: Color `#919191`, Border Bottom `1px solid #919191`
- Active: Color `#CCD0D2`, Border Bottom `1px solid #CCD0D2`

### Badges & Tags

**Badge (Default)**
- Background: `#556AD0`
- Text Color: `#FFFFFF`
- Font: meSubFont, 10px, weight 700
- Padding: `4px 12px`
- Border Radius: `12px`
- Height: `20px`

**Badge (Accent)**
- Background: `#29D4FF`
- Text Color: `#000000`
- Font: meSubFont, 10px, weight 700
- Padding: `4px 12px`
- Border Radius: `12px`
- Height: `20px`

**Badge (Warning)**
- Background: `#D8FA00`
- Text Color: `#000000`
- Font: meSubFont, 10px, weight 700
- Padding: `4px 12px`
- Border Radius: `12px`
- Height: `20px`

**Badge (Alert)**
- Background: `#FF5E41`
- Text Color: `#FFFFFF`
- Font: meSubFont, 10px, weight 700
- Padding: `4px 12px`
- Border Radius: `12px`
- Height: `20px`

## 5. Layout Principles

### Spacing System
- **Base Unit:** 4px
- **Scale:** 4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, 36px, 40px, 44px, 56px, 64px, 80px, 96px, 120px
- **Usage Context:**
  - **4px–8px:** Micro spacing between inline elements, icon-to-text gaps
  - **12px–16px:** Component padding, tight spacing between related elements
  - **20px–24px:** Section padding, spacing between components
  - **28px–32px:** Major section spacing, card margins
  - **36px–44px:** Large compositional spacing between major sections
  - **56px+:** Page-level spacing, full-width section separation

### Grid & Container
- **Max Width:** 1440px (desktop), 100% on tablet and mobile
- **Container Padding (Desktop):** 40px left/right
- **Container Padding (Tablet):** 32px left/right
- **Container Padding (Mobile):** 16px left/right
- **Column Strategy:** 12-column grid on desktop; 8-column on tablet; 4-column on mobile
- **Gutter Width:** 24px between columns on all screen sizes
- **Section Pattern:** Full-width hero sections alternate with constrained content sections; hero sections bleed to viewport edges

### Whitespace Philosophy
The Zenless Zone Zero design embraces generous whitespace as a narrative tool. Negative space is treated as an active design element rather than wasted real estate. Dense layouts are avoided in favor of breathing room that directs user focus to key interactive moments and content. This reflects the game's aesthetic of exploring vast, sometimes empty Hollows—silence and space amplify the impact of focused visual elements.

### Border Radius Scale
- **0px:** Sharp, angular edges for minimal, precise UI elements
- **4px:** Subtle rounding for inputs, small cards, and utilitarian components
- **8px:** Standard rounding for cards, containers, and primary components
- **12px:** Rounded corners for badges, chips, and secondary components
- **16px:** Rounded corners for large containers and spacious modals
- **24px:** Fully rounded corners for buttons and rounded button groups
- **50%:** Circular elements for avatars and icon buttons (48px minimum diameter)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (No Shadow) | `box-shadow: none;` | Text, icons, flat surfaces, disabled states |
| Raised (1) | `box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);` | Subtle elevation for interactive components like buttons on hover |
| Raised (2) | `box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);` | Standard card elevation; primary component depth |
| Elevated (3) | `box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.32);` | Hover states for elevated cards; secondary modals |
| High Elevation (4) | `box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.48);` | Primary modal elevation; maximum component prominence |
| Accent Glow (Cyan) | `box-shadow: 0px 0px 16px rgba(41, 212, 255, 0.32);` | Special attention states; neon-like emphasis |
| Accent Glow (Blue) | `box-shadow: 0px 0px 16px rgba(85, 106, 208, 0.24);` | Interactive feedback; secondary accent elevation |

**Shadow Philosophy:** The elevation system uses layered, diffused shadows to create perceived depth without harsh contrast. Shadows are always dark and semi-transparent, maintaining the dark theme's cohesion. Accent-colored glows are reserved for high-focus interactive moments (hover states on CTAs, focus states on inputs). This creates a cinematic, immersive quality where depth serves narrative and focus, not mere decoration.

## 7. Do's and Don'ts

### Do
- **Use the dark backgrounds strategically:** `#3C3F44` for primary surfaces, `#323339` for secondary containment. Layer them to create visual hierarchy.
- **Reserve accent colors for high-focus moments:** Use `#29D4FF` sparingly for primary CTAs, important states, and calls to action. Use `#FF5E41` for urgent or alert states. Use `#D3BC8E` for premium or heritage-related content.
- **Maintain minimum 4.5:1 contrast ratios:** All text must be readable against its background. Prioritize `#FFFFFF` or `#CCD0D2` text on dark surfaces.
- **Follow the spacing system exactly:** Use multiples of 4px. Never ad-hoc space elements. Consistency creates rhythm.
- **Apply shadow only to interactive elements:** Buttons, cards on hover, modals. Flat text and icons remain shadowless.
- **Use the custom "en inpin" font for brand presence:** Large headlines and hero text should leverage this typeface. Reserve system-ui for body and buttons.
- **Round button corners to 24px minimum:** This is a signature design element. No square buttons.
- **Test focus states on all interactive elements:** Every button, link, and input must have a visible `:focus` state using `0px 0px 0px 3px rgba(41, 212, 255, 0.1)` or similar.

### Don't
- **Don't use pure black text on pure black backgrounds:** Minimum `#FFFFFF` or `#CCD0D2` for legibility.
- **Don't overuse cyan (`#29D4FF`):** This is a high-energy accent. Too much overwhelms the dark aesthetic. Reserve it for 3–5% of interface elements.
- **Don't create buttons with weight 700 or heavier:** Buttons should feel confident but not heavy. Stick to weight 400.
- **Don't skip hover/active states:** Every interactive element must have clear visual feedback. Users need to know what's clickable.
- **Don't ignore the border radius system:** No custom radii. Stick to 0px, 4px, 8px, 12px, 16px, 24px, or 50% (circular).
- **Don't apply multiple shadows stacked:** One shadow per element. Layering shadows creates visual noise.
- **Don't use green or red as primary status colors:** The game uses cyan/gold/coral as accent palette. Green/red should be used only in game-specific contexts (health/damage in battle UI).
- **Don't mix font families in a single line of text:** Use "en inpin" for headers, meSubFont for labels, system-ui for body. Don't blend them.
- **Don't add transparency to already dark backgrounds:** Low-opacity overlays on `#3C3F44` can become unreadable. Use solid colors instead.
- **Don't forget disabled state styling:** Disabled elements must have distinct, desaturated appearance. Default to `#61636B` text and `#3C3F44` background.

## 8. Responsive Behavior

### Breakpoints

| Breakpoint Name | Width | Key Changes |
|---|---|---|
| Mobile (Extra Small) | 320px–479px | Single column, 16px padding, large touch targets (56px minimum), stacked navigation, full-width inputs |
| Mobile (Small) | 480px–767px | Single column, 20px padding, 2-column grid optional, begin introducing horizontal scrollers for content cards |
| Tablet (Medium) | 768px–1023px | 2–3 column grid, 32px padding, 8-column grid system, simplified navigation drawer, 48px touch targets |
| Tablet (Large) | 1024px–1199px | 3–4 column grid, 32px padding, 8-column grid system, horizontal navigation begins, 48px touch targets |
| Desktop (Small) | 1200px–1439px | 4–6 column grid, 40px padding, 12-column grid system, full horizontal navigation, 44px touch targets acceptable |
| Desktop (Large) | 1440px+ | Full 12-column grid, 40px padding, max-width container at 1440px, all features visible |

### Touch Targets
- **Minimum Touch Target Size:** 44px × 44px for all interactive elements on mobile and tablet
- **Desktop Touch Target:** 40px × 40px acceptable for desktop-only interfaces; 44px × 44px preferred
- **Spacing Between Targets:** Minimum 8px separation to prevent accidental selection
- **Icon-Only Buttons:** 48px × 48px on mobile/tablet, 40px × 40px on desktop, with 8px padding inside
- **Text Links:** Clickable area must extend to 44px height on mobile (padding top/bottom)

### Collapsing Strategy
- **Hero Sections:** Full viewport height on desktop; reduce to 240px–320px on mobile. Maintain aspect ratio for video/image content.
- **Multi-Column Layouts:** Stack to single column at tablet breakpoint. 2-column cards become 1 column. 3-column galleries become 2 on tablet, 1 on mobile.
- **Navigation:** Horizontal navigation collapses to hamburger menu icon (icon button, 48px × 48px) on mobile. Dropdown menus open in full-height drawer.
- **Padding:** Reduce from 40px desktop to 32px tablet, then 16px mobile. Maintain 4px base unit consistency.
- **Font Sizes:** Body text remains 16px minimum on mobile for readability. Headings reduce by 1–2 steps (e.g., 40px → 28px for H1 on mobile).
- **Spacing:** Section spacing reduces from 56px desktop to 40px tablet, then 24px mobile. Maintain proportional visual rhythm.
- **Cards & Containers:** Width becomes 100% on mobile within guttered container (16px padding). Max-width on desktop (e.g., 400px cards in a 1440px layout).
- **Modals:** Full viewport on mobile with 16px padding on sides. Max-width 520px on desktop, centered on screen.

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA / Action Button:** Electric Cyan (`#29D4FF`)
- **Secondary CTA / Info Button:** Royal Blue (`#556AD0`)
- **Dangerous / Alert Button:** Coral Red (`#FF5E41`)
- **Accent / Premium Content:** Gold (`#D3BC8E`)
- **Main Background / Primary Surface:** Dark Surface Base (`#3C3F44`)
- **Secondary Background / Nested Containers:** Darker Surface (`#323339`)
- **Primary Text / Headlines:** Pure Black (`#000000`)
- **Body Text / Interactive:** Light Gray (`#CCD0D2`)
- **Navigation / Secondary Text:** Medium Gray (`#787878`)
- **Borders / Dividers:** Medium Gray (`#787878`)
- **Warning / Critical Alert:** Warning Lime (`#D8FA00`)
- **Disabled / Inactive:** Dark Gray (`#61636B`)

### Iteration Guide

1. **Start with dark backgrounds:** Every surface should be `#3C3F44` or darker. Light backgrounds are not part of this system. Maintain contrast: WCAG AA minimum (4.5:1) for all text.

2. **Apply the spacing system religiously:** All spacing is 4px increments. Common values: 8px (micro), 16px (padding), 24px (section margin), 32px (major section), 40px (container padding). Never custom-space elements.

3. **Use accent colors sparingly:** Cyan (`#29D4FF`) is the hero accent—max 3–5% of interface. Gold (`#D3BC8E`) for luxury/rarity. Coral (`#FF5E41`) for danger/urgency. Gray (`#787878`) is the default for interactive elements.

4. **Button radius is 24px:** All buttons, rounded buttons, and high-emphasis CTAs use `border-radius: 24px`. No square buttons. Input fields use `border-radius: 4px`. Cards use `border-radius: 8px`.

5. **Typography hierarchy uses size, not weight:** "en inpin" at 56px (display), 40px (H1), 32px (H2), 24px (H3), 16px (body). All weight 400. "meSubFont" at 11px (nav/labels) weight 700. system-ui at 16px (buttons) weight 400. This consistency is intentional.

6. **Shadows communicate depth:** Raised components (buttons, cards on hover) get `box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24)`. Modals get `0px 12px 32px rgba(0, 0, 0, 0.48)`. Accent glows (cyan focus states) use `box-shadow: 0px 0px 16px rgba(41, 212, 255, 0.32)`. Flat text has no shadow.

7. **Every interactive element needs focus/hover/active states:** Buttons, links, inputs, nav items all require visible feedback. Use cyan glow `rgba(41, 212, 255, 0.1)` for focus rings on inputs. Darken or lighten interactive elements on hover. Never leave a component without state styling.

8. **Responsive scaling is predictable:** Desktop containers: 40px padding, 1440px max-width. Tablet: 32px padding, full width. Mobile: 16px padding. Touch targets: 44px minimum. Font sizes don't shrink below 16px for body text.

9. **Disabled and error states use distinct color signaling:** Disabled = `#61636B` text on `#3C3F44` background. Errors = `#FF5E41` border with subtle glow. Warnings = `#D8FA00` background or text. Never use ambiguous states; clarity is critical.

10. **The dark aesthetic is intentional—maintain it throughout:** This is a mature, cyberpunk game interface. No light themes, no pastels, no soft rounded containers everywhere. Precision, contrast, and selective color create elegance. Every element earns its visual weight.

## 10. Visual References

Use these official Zenless Zone Zero pages as visual-direction references. Draw from their atmosphere, hierarchy, motion language, and media presentation without reproducing their content or layout pixel-for-pixel.

- [Zenless Zone Zero — Main Site](https://zenless.hoyoverse.com/id-id/main)
- [Zenless Zone Zero — Video Gallery](https://zenless.hoyoverse.com/id-id/video)
