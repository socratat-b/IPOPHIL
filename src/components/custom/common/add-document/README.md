# Add Document Component Documentation

## Overview

The `AddDocument` component is a versatile tool designed to facilitate the creation, receiving, and releasing of documents within your application. It leverages a dialog-based interface to guide users through the process, whether they are creating a new document or scanning an existing one.

## Usage

### 1. **Adding a Document**

To add a document, you can use the `AddDocumentButton` component. This button triggers a dialog that allows users to either create a new document or scan an existing one.

#### Example Usage

```jsx
import { AddDocumentButton } from '@/components/custom/common/add-document/add-document-button'

const MyComponent = () => {
    return (
        <div>
            <AddDocumentButton actionType="Create" title="Create Document" />
            <AddDocumentButton actionType="Receive" title="Receive Document" />
            <AddDocumentButton actionType="Release" title="Release Document" />
        </div>
    )
}
```

### 2. **Dialog Actions**

The dialog provides two main actions:

- **Create Document**: Allows users to input details for a new document.
- **Scan Document**: Allows users to scan a document's QR code or manually enter its code to receive or release it.

### 3. **Customization**

The `AddDocumentButton` component can be customized with the following props:

- **`title`**: The text displayed on the button. Defaults to "Add".
- **`onAdd`**: A callback function that is triggered when the button is clicked.
- **`actionType`**: Specifies the type of action (`Create`, `Receive`, `Release`).
- **`variant`**: The style variant of the button (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`).
- **`className`**: Additional CSS classes to apply to the button.

#### Example For Dialog Actions

```jsx
<AddDocumentButton
    title="Create New Document"
    actionType="Create"
    variant="secondary"
    className="custom-class"
/>
```

## Good Practices

### 1. **Component Reusability**

The `AddDocument` component is designed to be highly reusable. You can easily integrate it into different parts of your application by simply importing and using the `AddDocumentButton`.

### 2. **Separation of Concerns**

The codebase is structured to separate concerns effectively:

- **`add-document-dialog.tsx`**: Handles the main dialog logic and rendering.
- **`create-document-form.tsx`**: Manages the form for creating a new document.
- **`scan-document-form.tsx`**: Manages the form for scanning and processing an existing document.
- **`add-document-button.tsx`**: Provides a button to trigger the dialog.

### 3. **Validation and Error Handling**

The forms use `zod` for validation and `react-hook-form` for form management. This ensures that user inputs are validated before submission, and appropriate error messages are displayed.

### 4. **State Management**

The component uses React's `useState` hook to manage the dialog's open/close state and the document details. This keeps the component stateful and responsive to user interactions.

### 5. **Styling and Theming**

The component leverages the `@/components/ui` library for styling, ensuring a consistent look and feel across your application. You can easily customize the appearance by modifying the `variant` and `className` props.
