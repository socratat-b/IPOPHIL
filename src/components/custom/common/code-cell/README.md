# Document Code Cell Component Documentation

This documentation provides developers with an overview of the `DocumentCodeCell` and its related components. It includes usage, functionality, and guidance for maintenance.

---

## Overview

The `DocumentCodeCell` component is a reusable React component for displaying QR codes and barcodes, with optional preview functionality. It integrates with other UI elements like `CodeDisplay` and `CodePreviewDialog` to enhance user experience.

---

## Component Structure

### 1. **`DocumentCodeCell`**

- **Path**: `src\components\custom\code-cell\document-code-cell.tsx`
- Displays QR code and/or barcode with click-to-preview functionality.
- Dynamically handles rendering based on the `type` prop (`QR`, `Barcode`, or both).

### 2. **`CodeDisplay`**

- **Path**: `src\components\custom\common\code-cell\code-display.tsx`
- Responsible for rendering either a QR code or a barcode.
- Utilizes:
  - `qrcode.react` for QR codes.
  - `react-barcode` for barcodes.
- Configuration is controlled by the `CODE_CONFIG`.

### 3. **`CodePreviewDialog`**

- **Path**: `src\components\custom\common\code-cell\code-preview-dialog.tsx`
- Provides a preview of QR codes and barcodes in a modal dialog.
- Includes functionality for printing the displayed code.

---

## Installation

### Dependencies

Ensure the following dependencies are installed:

```bash
npm install qrcode.react react-barcode
```

### Environment Setup

Ensure your project structure includes the following:

- **`src\lib\types`**: Define common types like `CodeType`, `CodeConfig`, and `CodeDisplayProps`.
- **`src\lib\controls\code`**: Contains configuration for QR code and barcode rendering.

---

## Usage

### Basic Example

To render both QR code and barcode with preview functionality:

```tsx
import { DocumentCodeCell } from '@/components/custom/code-cell/document-code-cell'

<DocumentCodeCell code="1234567890" />
```

### Render Specific Type

To render only QR codes or barcodes:

```tsx
// Render QR Code only
<DocumentCodeCell code="1234567890" type="QR" />

// Render Barcode only
<DocumentCodeCell code="1234567890" type="Barcode" />
```

---

## Props

### `DocumentCodeCell`

| Prop      | Type               | Default   | Description                                                                   |
|-----------|--------------------|-----------|-------------------------------------------------------------------------------|
| `code`    | `string`           | Required  | The code to be displayed as a QR code or barcode.                             |
| `type`    | `'QR' or 'Barcode'` | `undefined` | Specifies the type of code to display. If `undefined`, both are displayed. |

### `CodeDisplay`

| Prop       | Type                 | Default | Description                                          |
|------------|----------------------|---------|------------------------------------------------------|
| `code`     | `string`             | Required| The code to render.                                  |
| `type`     | `'QR' or 'Barcode'`  | Required| Specifies whether to render a QR code or barcode.    |
| `size`     | `{ width, height }`  | Optional| Defines the dimensions of the code display.          |
| `showValue`| `boolean`            | `false` | Whether to show the code value beneath the barcode.  |

### `CodePreviewDialog`

| Prop      | Type                | Default   | Description                                         |
|-----------|---------------------|-----------|-----------------------------------------------------|
| `code`    | `string`            | Required  | The code to preview.                                |
| `type`    | `'QR' or 'Barcode'` | Required  | Specifies the type of code to preview.              |
| `isOpen`  | `boolean`           | `false`   | Controls whether the dialog is open.                |
| `onClose` | `() => void`        | Required  | Function called when the dialog is closed.          |

---

## Configuration

### QR Code Configuration

File: `src\lib\controls\code.ts`

```typescript
export const CODE_CONFIG = {
    cell: {
        QR: {
            size: 256,
            level: 'M', 
            marginSize: 4,
        },
        Barcode: {
            width: 2,
            height: 100,
            fontSize: 12,
            margin: 0,
        },
    },
}
```

Modify the configuration to customize the appearance and behavior of QR codes and barcodes.

---

## Styling

### Default Styling

- **QR Code and Barcode Containers**: Use `flex` utilities for alignment.
- **Hover Effect**: Applied with `hover:opacity-80 transition-opacity`.
- **Dialog Styling**: Controlled using ShadCN's `Dialog` components (`DialogContent`, `DialogHeader`, etc.).

### Print Styles

Define `print-container` styles for printing:

```css
@media print {
    .print-hidden {
        display: none !important;
    }

    .print-container {
        display: block !important;
    }
}
```

---

## Maintenance

### Adding a New Code Type

1. Update the `CodeType` definition in `src\lib\types` to include the new type.
2. Extend the `CODE_CONFIG` object with settings for the new type.
3. Add the corresponding rendering logic in `CodeDisplay`.

### Error Handling

- Ensure `code` and `type` are validated before rendering.
- Use fallback UI if required props are missing.

---

## Contributors

- **Developer 1**: Initial implementation.
- **Developer 2**: Added print functionality and styling.

---

## Notes

- Use the `CodePreviewDialog` for consistent code previews across the app.
- Extend `CODE_CONFIG` for global updates to QR code and barcode styles.

---

For questions or suggestions, contact the project maintainer. Happy coding! 🚀
