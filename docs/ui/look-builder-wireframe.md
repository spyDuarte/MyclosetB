# Look Builder Wireframe

![Look builder wireframe concept](https://dummyimage.com/1200x800/cccccc/000000&text=Look+Builder+Wireframe)

## Layout Structure

```
+----------------------------------------------------------------------------------+
| Header with back button to Looks list, look title editable inline                |
+----------------------------------------------------------------------------------+
| Progress steps (1. Select items, 2. Arrange, 3. Review & Save)                   |
+----------------------------------------------------------------------------------+
| Main canvas: drag-and-drop outfit grid                                           |
| - Left panel: Filters (category, color, weather) and wardrobe item list          |
| - Center: Outfit stage showing selected items with layering order controls       |
| - Right panel: Notes, occasion selector, share toggles                           |
+----------------------------------------------------------------------------------+
| Footer toolbar: Save Draft, Publish Look, Duplicate, Accessibility toggles       |
+----------------------------------------------------------------------------------+
```

## Responsive Behaviour
- **Desktop:** Three-panel layout with drag-and-drop grid.
- **Tablet:** Filters collapse into accordion, stage remains centered.
- **Mobile:** Stepper converts to vertical wizard; stage uses carousel to adjust layering order.

## Accessibility Notes
- Drag-and-drop complemented with keyboard controls (move up/down, assign slot).
- Provide text alternatives for item thumbnails and describe layering order.
- Ensure focus outlines remain visible when interacting with stage controls.
