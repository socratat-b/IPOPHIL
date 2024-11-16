# Dashboard Page Documentation

## Overview

The `Dashboard` page is a central hub for users to view and manage their documents. It provides an overview of document statistics, recent documents, and allows users to create, receive, or release documents. This documentation aims to guide developers on how to use and understand the components and structure of the `Dashboard` page.

## Components

### 1. **DashboardHeader**

#### Description

The `DashboardHeader` component displays the user's name, current date and time, and provides navigation options. It also includes a sidebar trigger and theme change functionality.

#### Props

- **`userName`**: (Optional) The name of the user to be displayed in the header.
- **`breadcrumbs`**: (Optional) An array of breadcrumb items to be displayed in the header.

#### Usage

```jsx
<DashboardHeader userName="John Doe" />
```

### 2. **AddDocumentButton**

#### AddDocumentButton Description

The `AddDocumentButton` component is a reusable button that triggers a dialog for creating, receiving, or releasing documents.

#### AddDocumentButton Props

- **`title`**: The text displayed on the button.
- **`actionType`**: The type of action (`Create`, `Receive`, `Release`).
- **`variant`**: The style variant of the button (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`).
- **`className`**: Additional CSS classes to apply to the button.

#### AddDocumentButton Usage

```jsx
<AddDocumentButton title="Receive" actionType="Receive" variant="destructive" />
```

### 3. **StatCard**

#### StatCard Description

The `StatCard` component displays a statistic with a title, icon, count, percentage change, and a sparkline chart.

#### StatCardProps

- **`title`**: The title of the statistic.
- **`icon`**: The icon to be displayed in the card.
- **`count`**: The current count of the statistic.
- **`change`**: The percentage change from the previous month.
- **`data`**: The data for the sparkline chart.

#### StatCard Usage

```jsx
<StatCard
    title="Total Incoming"
    icon={Icons.incoming}
    count={stats.current.incoming}
    change={stats.percentageChanges.incoming}
    data={chartData.incoming}
/>
```

### 4. **Overview**

#### OverviewDescription

The `Overview` component displays a chart that visualizes the status of documents. It supports pie, bar, and line charts, and allows users to switch between them.

#### OverviewProps

- **`documents`**: An array of documents to be visualized.

#### Overview Usage

```jsx
<Overview documents={docs} />
```

### 5. **RecentDocuments**

#### RecentDocuments Description

The `RecentDocuments` component displays a list of recent documents. Each document is shown in a card format with details such as title, code, status, origin office, and date created.

#### RecentDocumentsProps

- **`documents`**: An array of recent documents to be displayed.

#### RecentDocumentsUsage

```jsx
<RecentDocuments documents={recentDocs} />
```

### 6. **SparklineChart**

#### SparklineChart Description

The `SparklineChart` component displays a small line chart (sparkline) that represents a trend over time.

#### Description Props

- **`data`**: The data for the sparkline chart.

#### Description Usage

```jsx
<SparklineChart data={data} />
```

### 7. **UserHeaderNav**

#### User Header Nav Description

The `UserHeaderNav` component displays the user's avatar and provides a dropdown menu for account settings, notifications, and other user-related actions.

#### User Header Nav Usage

```jsx
<UserHeaderNav />
```

## Good Practices

### 1. **Component Reusability**

- Each component is designed to be highly reusable. For example, the `AddDocumentButton` can be used in multiple places with different props to trigger different actions.

### 2. **Separation of Concerns**

- The codebase is structured to separate concerns effectively. Each component is responsible for a specific task, making the code easier to maintain and debug.

### 3. **State Management**

- The components use React's `useState` and `useEffect` hooks to manage state and side effects. This ensures that the components are stateful and responsive to user interactions.

### 4. **Styling and Theming**

- The components leverage the `@/components/ui` library for styling, ensuring a consistent look and feel across the application. The `variant` and `className` props allow for easy customization of the appearance.

### 5. **Validation and Error Handling**

- The components use `zod` for validation and `react-hook-form` for form management. This ensures that user inputs are validated before submission, and appropriate error messages are displayed.

### 6. **Responsive Design**

- The components are designed to be responsive, ensuring a good user experience across different screen sizes.
