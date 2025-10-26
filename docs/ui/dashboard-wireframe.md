# Dashboard Wireframe

![Dashboard wireframe concept](https://dummyimage.com/1200x800/cccccc/000000&text=Dashboard+Wireframe)

## Layout Structure

```
+--------------------------------------------------------------------------------+
| Header: Logo | Quick Add Button | Notifications | Profile Menu                  |
+--------------------------------------------------------------------------------+
| Sidebar (collapsible) |  Wardrobe Summary  | Upcoming Events | Outfit Planner |
| - Dashboard            |  ----------------  | --------------- | -------------- |
| - Wardrobe             |  Cards showing     | Calendar list    | CTA to start   |
| - Looks                |  total pieces,     | of upcoming      | building look  |
| - Calendar             |  clean/dirty, new  | events with      |                |
| - Settings             |  arrivals.         | quick actions.   |                |
+--------------------------------------------------------------------------------+
| Responsive grid of insights cards (2 cols desktop, 1 col mobile)               |
| - Recently Worn Outfits                                                        |
| - Weather-based Suggestions                                                    |
| - Laundry Alerts                                                               |
+--------------------------------------------------------------------------------+
```

## Responsive Behaviour
- **Desktop (≥ 1024px):** Sidebar pinned, three-column insight cards.
- **Tablet (768-1023px):** Sidebar collapses to icons, insights switch to two columns.
- **Mobile (< 768px):** Header condenses into hamburger menu, single-column cards, sticky action button for "Add Piece".

## Accessibility Notes
- Landmark roles for header (`banner`), navigation (`nav`), and main content (`main`).
- High-contrast color palette that meets WCAG AA for text and icons.
- Keyboard navigable notifications and profile menus using `Menu` component semantics.
- Dynamic content (e.g., weather suggestions) announced via polite ARIA live regions.
