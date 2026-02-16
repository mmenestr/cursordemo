# Clusters Table with Tagging Mechanism - Design Document

## Overview

This document outlines the design for a clusters table with a comprehensive tagging mechanism that allows users to tag clusters as "hub clusters" with full CRUD capabilities (Create, Read, Update, Delete).

## Table Structure

### Columns

| Column | Description | Width | Sortable | Filterable |
|--------|-------------|-------|----------|------------|
| **Cluster Name** | Name of the cluster | 20% | ✅ Yes | ✅ Yes (Toolbar search) |
| **Status** | Current status (e.g., Ready, Not Ready, Error) | 15% | ✅ Yes | ❌ No |
| **Type** | Cluster type (e.g., OCP, OKE, EKS) | 12% | ✅ Yes | ✅ Yes (Toolbar search) |
| **Created Date** | Date when cluster was created | 15% | ✅ Yes | ❌ No |
| **Version** | Cluster version | 12% | ✅ Yes | ❌ No |
| **Provider Type** | Provider type (e.g., OVA, OpenShift Virtualization) | 12% | ✅ Yes | ❌ No |
| **Tags** | Hub cluster tags | 10% | ❌ No | ❌ No |
| **Actions** | Row actions menu | 4% | ❌ No | ❌ No |

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Clusters                                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Toolbar with Search and Filters]                                          │
│ ┌───────────────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Search by cluster name...  [Filter: Cluster Type ▼]  [Clear all] │ │
│ └───────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────────────────┐ │
│ │ ☐ │ Cluster Name │ Status │ Type │ Created │ Version │ Provider │ Tags │ Actions │
│ ├───┼──────────────┼─────────┼──────┼─────────┼─────────┼──────────┼──────┼─────────┤
│ │ ☐ │ cluster-1    │ Ready   │ OCP  │ 2024-01 │ 4.15.0  │ OVA      │ 🏷️  │ ⋮      │
│ │ ☐ │ cluster-2    │ Ready   │ OKE  │ 2024-02 │ 1.28.0  │ vSphere │     │ ⋮      │
│ │ ☐ │ cluster-3    │ Error   │ EKS  │ 2024-01 │ 1.27.0  │ OVA      │ 🏷️  │ ⋮      │
│ └───────────────────────────────────────────────────────────────────────┘ │
│ [Pagination: 1-10 of 25]                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Tagging Mechanism Design

### 1. Tag Display in Table

**Visual Representation:**
- Tags appear in the "Tags" column as **Label components** (PatternFly Badge/Label)
- Hub cluster tag displays as: `🏷️ Hub Cluster` (with icon and text)
- Color coding: **Blue** for hub cluster tags
- Clickable tags that open edit/remove options

**Empty State:**
- Shows a "+" button or "Add tag" link when no tags exist
- Clicking opens the tag management interface

### 2. Tag Management Interface

#### Option A: Inline Tag Management (Recommended)
- Click on tag or "+" button in the Tags column
- Opens a **Popover** or **Menu** with tag options:
  - "Add Hub Cluster tag"
  - "Edit tag" (if tag exists)
  - "Remove tag" (if tag exists)

#### Option B: Actions Menu Integration
- Tags column shows existing tags
- Actions dropdown (⋮) includes:
  - "Manage Tags"
  - "Add Hub Cluster Tag"
  - "Remove Hub Cluster Tag"

### 3. Add Tag Flow

```
User clicks "+" or "Add tag" 
  ↓
Popover/Menu opens with:
  - "Add Hub Cluster tag" option
  ↓
User selects "Add Hub Cluster tag"
  ↓
Confirmation dialog (optional):
  "Add 'Hub Cluster' tag to cluster-1?"
  [Cancel] [Add Tag]
  ↓
Tag is added and displayed in table
```

### 4. Edit Tag Flow

```
User clicks on existing tag
  ↓
Popover/Menu opens with:
  - Current tag: "Hub Cluster"
  - "Edit tag" option
  ↓
User selects "Edit tag"
  ↓
Modal/Form opens:
  - Tag name input (pre-filled: "Hub Cluster")
  - [Cancel] [Save Changes]
  ↓
Tag is updated in table
```

### 5. Remove Tag Flow

```
User clicks on existing tag
  ↓
Popover/Menu opens with:
  - "Remove tag" option
  ↓
User selects "Remove tag"
  ↓
Confirmation dialog:
  "Remove 'Hub Cluster' tag from cluster-1?"
  [Cancel] [Remove]
  ↓
Tag is removed from table
```

## Component Structure

### Main Components

1. **ClustersTable Component**
   - Main table container
   - Manages cluster data and tag state
   - Handles filtering and sorting

2. **ClustersToolbar Component**
   - Search input for cluster name
   - Filter dropdown for cluster type
   - Clear filters button

3. **TagCell Component**
   - Displays tags in table cell
   - Handles tag interactions
   - Shows add/edit/remove options

4. **TagManagementPopover Component**
   - Popover for tag actions
   - Add/Edit/Remove tag options
   - Confirmation dialogs

5. **EditTagModal Component** (Optional)
   - Modal for editing tag name
   - Form validation
   - Save/Cancel actions

## Technical Implementation

### State Management

```typescript
interface Cluster {
  id: string;
  name: string;
  status: string;
  type: string;
  createdDate: string;
  version: string;
  providerType: string;
  tags: string[]; // Array of tag names, e.g., ["Hub Cluster"]
}

interface ClustersTableState {
  clusters: Cluster[];
  filteredClusters: Cluster[];
  selectedClusters: Set<string>;
  searchText: string;
  clusterTypeFilter: string | null;
  sortBy: { column: string; direction: 'asc' | 'desc' };
  isTagPopoverOpen: { [clusterId: string]: boolean };
}
```

### Tag Operations

```typescript
// Add tag
const addTag = (clusterId: string, tagName: string) => {
  // Update cluster tags
  // Persist to backend
  // Update UI
};

// Edit tag
const editTag = (clusterId: string, oldTagName: string, newTagName: string) => {
  // Update cluster tags
  // Persist to backend
  // Update UI
};

// Remove tag
const removeTag = (clusterId: string, tagName: string) => {
  // Remove tag from cluster
  // Persist to backend
  // Update UI
};
```

## UI Components (PatternFly)

### Tag Display
- **Label Component**: For displaying tags
  ```jsx
  <Label color="blue" icon={<TagIcon />}>
    Hub Cluster
  </Label>
  ```

### Tag Management
- **Popover Component**: For tag actions menu
- **Menu Component**: For action options
- **Modal Component**: For editing tag name (if needed)
- **Button Component**: For add tag button

### Table Integration
- **Table Component**: Main table structure
- **Toolbar Component**: Search and filters
- **Pagination Component**: For large datasets

## Accessibility Considerations

1. **Keyboard Navigation**
   - Tags should be keyboard accessible
   - Tab order: Table → Tag → Actions menu
   - Enter/Space to activate tag actions

2. **Screen Reader Support**
   - ARIA labels for all interactive elements
   - Announce tag additions/removals
   - Clear descriptions for tag actions

3. **Focus Management**
   - Focus returns to tag after action completion
   - Focus trap in modals

## Responsive Design

### Desktop (> 1200px)
- Full table with all columns visible
- Tags column visible
- Inline tag management

### Tablet (768px - 1200px)
- Tags column may be hidden
- Tag management via actions menu
- Stack toolbar filters

### Mobile (< 768px)
- Table becomes card view
- Tags shown in card footer
- Tag management via actions menu

## User Experience Enhancements

1. **Visual Feedback**
   - Loading state when adding/removing tags
   - Success toast notification
   - Error handling with clear messages

2. **Bulk Operations** (Future Enhancement)
   - Select multiple clusters
   - Bulk add/remove tags
   - Bulk tag management

3. **Tag Filtering** (Future Enhancement)
   - Filter table by tags
   - Show only hub clusters
   - Tag-based search

## Implementation Priority

### Phase 1: Core Functionality
- ✅ Table with all columns
- ✅ Toolbar with search (cluster name, type)
- ✅ Tag display in table
- ✅ Add tag functionality
- ✅ Remove tag functionality

### Phase 2: Enhanced Features
- ✅ Edit tag functionality
- ✅ Tag management popover
- ✅ Confirmation dialogs
- ✅ Loading states

### Phase 3: Advanced Features
- ⏳ Bulk tag operations
- ⏳ Tag filtering
- ⏳ Tag-based sorting
- ⏳ Tag analytics

## Design Mockups

### Tag Display States

**State 1: No Tags**
```
Tags
┌─────────────┐
│ + Add tag   │
└─────────────┘
```

**State 2: With Tag**
```
Tags
┌──────────────────────┐
│ 🏷️ Hub Cluster  [×] │
└──────────────────────┘
```

**State 3: Tag with Actions Menu**
```
Tags
┌──────────────────────┐
│ 🏷️ Hub Cluster  [⋮] │
└──────────────────────┘
         ↓
    ┌─────────────┐
    │ Edit tag    │
    │ Remove tag  │
    └─────────────┘
```

## Code Examples

### Tag Cell Component Structure

```jsx
<Td>
  {cluster.tags.length > 0 ? (
    <TagCell
      clusterId={cluster.id}
      tags={cluster.tags}
      onAddTag={handleAddTag}
      onEditTag={handleEditTag}
      onRemoveTag={handleRemoveTag}
    />
  ) : (
    <Button
      variant="link"
      onClick={() => handleAddTag(cluster.id)}
    >
      + Add tag
    </Button>
  )}
</Td>
```

### Tag Management Popover

```jsx
<Popover
  isVisible={isTagPopoverOpen[clusterId]}
  shouldClose={() => setIsTagPopoverOpen({ ...isTagPopoverOpen, [clusterId]: false })}
  bodyContent={
    <Menu>
      <MenuList>
        {cluster.tags.includes('Hub Cluster') ? (
          <>
            <MenuItem onClick={() => handleEditTag(cluster.id)}>
              Edit tag
            </MenuItem>
            <MenuItem onClick={() => handleRemoveTag(cluster.id)}>
              Remove tag
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={() => handleAddTag(cluster.id)}>
            Add Hub Cluster tag
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  }
>
  <Button variant="plain" aria-label="Tag actions">
    <EllipsisVIcon />
  </Button>
</Popover>
```

## Conclusion

This design provides a comprehensive tagging mechanism that:
- ✅ Integrates seamlessly with the clusters table
- ✅ Follows PatternFly design patterns
- ✅ Provides intuitive user experience
- ✅ Supports full CRUD operations on tags
- ✅ Maintains accessibility standards
- ✅ Is responsive across devices

The implementation should follow the phased approach, starting with core functionality and gradually adding enhanced features.


