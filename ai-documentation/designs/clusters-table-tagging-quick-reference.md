# Clusters Table Tagging - Quick Reference Guide

## Visual Design Summary

### Table Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Clusters                                                          [Refresh]  │
├──────────────────────────────────────────────────────────────────────────────┤
│ Toolbar:                                                                     │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ 🔍 [Search by cluster name...]  [Type: All ▼]  [Clear all filters] │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│ Table:                                                                       │
│ ┌─────┬──────────────┬────────┬──────┬──────────┬─────────┬──────────┬─────┬─────────┐ │
│ │ ☐   │ Cluster Name │ Status │ Type │ Created  │ Version │ Provider │Tags│ Actions │ │
│ ├─────┼──────────────┼────────┼──────┼──────────┼─────────┼──────────┼─────┼─────────┤ │
│ │ ☐   │ cluster-1    │ Ready  │ OCP  │ 2024-01  │ 4.15.0  │ OVA      │ 🏷️ │    ⋮    │ │
│ │ ☐   │ cluster-2    │ Ready  │ OKE  │ 2024-02  │ 1.28.0  │ vSphere │ +  │    ⋮    │ │
│ │ ☐   │ cluster-3    │ Error  │ EKS  │ 2024-01  │ 1.27.0  │ OVA      │ 🏷️ │    ⋮    │ │
│ └─────┴──────────────┴────────┴──────┴──────────┴─────────┴──────────┴─────┴─────────┘ │
│                                                                              │
│ [Pagination: 1-10 of 25]                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Tag States

### 1. No Tag State
```
┌─────────────┐
│ + Add tag   │  ← Clickable link/button
└─────────────┘
```

### 2. Tagged State
```
┌──────────────────────────┐
│ 🏷️ Hub Cluster      [×] │  ← Clickable tag with remove button
└──────────────────────────┘
```

### 3. Tag with Menu
```
┌──────────────────────────┐
│ 🏷️ Hub Cluster      [⋮] │  ← Click menu icon
└──────────────────────────┘
         ↓
    ┌─────────────┐
    │ Edit tag    │
    │ Remove tag  │
    └─────────────┘
```

## User Flows

### Flow 1: Add Tag
```
1. User clicks "+ Add tag" in Tags column
   ↓
2. Popover/Menu appears with "Add Hub Cluster tag" option
   ↓
3. User clicks "Add Hub Cluster tag"
   ↓
4. Tag appears: 🏷️ Hub Cluster
```

### Flow 2: Edit Tag
```
1. User clicks on existing tag or menu icon
   ↓
2. Menu appears with "Edit tag" option
   ↓
3. User clicks "Edit tag"
   ↓
4. Modal/Form opens with tag name input
   ↓
5. User edits tag name and clicks "Save"
   ↓
6. Tag updates in table
```

### Flow 3: Remove Tag
```
1. User clicks on existing tag or menu icon
   ↓
2. Menu appears with "Remove tag" option
   ↓
3. User clicks "Remove tag"
   ↓
4. Confirmation dialog: "Remove 'Hub Cluster' tag?"
   ↓
5. User confirms
   ↓
6. Tag removed, "+ Add tag" appears
```

## Component Hierarchy

```
ClustersTable
├── ClustersToolbar
│   ├── SearchInput (cluster name)
│   ├── Select (cluster type filter)
│   └── Button (clear filters)
├── Table
│   ├── Thead
│   │   └── Tr (column headers)
│   └── Tbody
│       └── Tr (rows)
│           ├── Td (cluster name)
│           ├── Td (status)
│           ├── Td (type)
│           ├── Td (created date)
│           ├── Td (version)
│           ├── Td (provider type)
│           ├── Td (tags) ← TagCell component
│           │   └── TagManagementPopover
│           └── Td (actions) ← ActionsDropdown
└── Pagination
```

## Key Interactions

| Action | Trigger | Result |
|--------|---------|--------|
| **Add Tag** | Click "+ Add tag" | Popover opens → Select "Add Hub Cluster tag" → Tag appears |
| **Edit Tag** | Click tag or menu icon | Menu opens → Select "Edit tag" → Modal opens → Save changes |
| **Remove Tag** | Click tag or menu icon | Menu opens → Select "Remove tag" → Confirm → Tag removed |
| **View Tag** | Hover over tag | Tooltip shows tag details |

## PatternFly Components Used

| Component | Usage | Location |
|-----------|-------|----------|
| **Table** | Main table structure | Table container |
| **Toolbar** | Search and filters | Above table |
| **Label** | Tag display | Tags column |
| **Popover** | Tag actions menu | Tag cell |
| **Menu** | Action options | Inside popover |
| **Modal** | Edit tag form | Overlay |
| **Button** | Add tag button | Tag cell (empty state) |
| **Dropdown** | Actions menu | Actions column |

## Color Coding

- **Tag Color**: Blue (`color="blue"` in PatternFly Label)
- **Tag Icon**: Tag icon (🏷️) from PatternFly Icons
- **Status Colors**: 
  - Ready: Green
  - Error: Red
  - Not Ready: Yellow/Orange

## Responsive Behavior

| Screen Size | Tags Column | Tag Management |
|-------------|-------------|----------------|
| **Desktop** (>1200px) | Visible | Inline popover |
| **Tablet** (768-1200px) | Visible | Actions menu |
| **Mobile** (<768px) | Hidden | Actions menu in card view |

## Accessibility Features

- ✅ Keyboard navigation for all tag actions
- ✅ ARIA labels on all interactive elements
- ✅ Screen reader announcements for tag changes
- ✅ Focus management in modals
- ✅ Tooltips for tag information

## Implementation Checklist

- [ ] Create ClustersTable component
- [ ] Implement toolbar with search and filters
- [ ] Add TagCell component
- [ ] Implement TagManagementPopover
- [ ] Add tag state management
- [ ] Implement add tag functionality
- [ ] Implement edit tag functionality
- [ ] Implement remove tag functionality
- [ ] Add confirmation dialogs
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add accessibility features
- [ ] Test responsive behavior
- [ ] Add unit tests


