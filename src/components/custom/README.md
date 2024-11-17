# This is the Components file for the project

## Overview

Components folder is pretty straight forward, it contains all the components of the project. Each component is a separate file and is imported in the pages to create the view for the users.

## Usage

### 1. **Common**

If the component is usable anywhere, this is the place to put the component.

#### Example Usage 1

```tsx
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

#### Example Usage 2

```tsx
import TableSkeleton from '@/components/custom/common/table-skeleton'

export default function Loading() {
    return (
        <TableSkeleton columns={6} rows={8} />
    )
}
```

### 2. Theme

This componsed of two buttons, one with the dropdown and then the toggle.

```tsx
//  use this to toggle easily
<ThemeChange />
// or this to see dropdown option
<ThemeMenu />
```
