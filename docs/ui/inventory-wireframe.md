# Wardrobe Item Registration Wireframe

![Inventory wireframe concept](https://dummyimage.com/1200x800/cccccc/000000&text=Inventory+Wireframe)

## Layout Structure

```
+------------------------------------------------------------------------------+
| Header with breadcrumb: Dashboard / Wardrobe / Add Piece                     |
+------------------------------------------------------------------------------+
| Two-column form (stacks on mobile)                                           |
| - Left column: Basic Info                                                    |
|   * Photo upload dropzone                                                    |
|   * Name input                                                               |
|   * Category select                                                          |
|   * Subcategory select (filters by category)                                 |
| - Right column: Details                                                      |
|   * Size, Color, Seasonality pills                                           |
|   * Purchase date + price                                                    |
|   * Care instructions textarea                                               |
|                                                                              |
| Bottom section:                                                              |
| - Tags multi-select                                                          |
| - Save & Add Another / Save & View buttons                                   |
| - Status indicator (clean / needs laundry)                                   |
+------------------------------------------------------------------------------+
```

## Responsive Behaviour
- **Desktop:** Two-column layout with preview panel.
- **Tablet:** Collapsible sections for Details and Care instructions.
- **Mobile:** Single column, sticky footer with primary actions.

## Accessibility Notes
- Inputs labelled using `FormControl` with `aria-describedby` linking to helper text.
- Drag-and-drop zone supports keyboard activation and file dialog fallback.
- Validation errors announced via `aria-live` region and inline error messages.
