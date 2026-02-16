import * as React from 'react';
import {
  PageSection,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarFilter,
  ToolbarToggleGroup,
  ToolbarGroup,
  SearchInput,
  Select,
  SelectOption,
  Button,
  Label,
  Modal,
  ModalVariant,
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  Pagination,
  EmptyState,
  EmptyStateBody,
  Spinner,
  Alert,
  AlertActionCloseButton,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import {
  EllipsisVIcon,
  TagIcon,
  FilterIcon,
  TimesIcon,
  StarIcon,
} from '@patternfly/react-icons';
import { Dropdown, DropdownList, DropdownItem, MenuToggle, MenuToggleElement } from '@patternfly/react-core';

// Interfaces
interface Cluster {
  id: string;
  name: string;
  status: 'Ready' | 'Not Ready' | 'Error';
  type: string;
  createdDate: string;
  version: string;
  providerType: string;
  tags: string[];
}

interface ClustersTableState {
  clusters: Cluster[];
  filteredClusters: Cluster[];
  selectedClusters: Set<string>;
  searchText: string;
  clusterTypeFilter: string | null;
  sortBy: { column: string; direction: 'asc' | 'desc' } | null;
  page: number;
  perPage: number;
  isTagPopoverOpen: { [clusterId: string]: boolean };
  isEditTagModalOpen: { [clusterId: string]: boolean };
  editingTag: { clusterId: string; oldTag: string; newTag: string } | null;
  isRemovingTag: { [clusterId: string]: boolean };
}

// Sample data
const initialClusters: Cluster[] = [
  {
    id: '1',
    name: 'cluster-1',
    status: 'Ready',
    type: 'OCP',
    createdDate: '2024-01-15',
    version: '4.15.0',
    providerType: 'OVA',
    tags: ['Hub Cluster'],
  },
  {
    id: '2',
    name: 'cluster-2',
    status: 'Ready',
    type: 'OKE',
    createdDate: '2024-02-20',
    version: '1.28.0',
    providerType: 'vSphere',
    tags: [],
  },
  {
    id: '3',
    name: 'cluster-3',
    status: 'Error',
    type: 'EKS',
    createdDate: '2024-01-10',
    version: '1.27.0',
    providerType: 'OVA',
    tags: ['Hub Cluster'],
  },
  {
    id: '4',
    name: 'cluster-4',
    status: 'Not Ready',
    type: 'OCP',
    createdDate: '2024-03-05',
    version: '4.14.0',
    providerType: 'OpenShift Virtualization',
    tags: [],
  },
  {
    id: '5',
    name: 'cluster-5',
    status: 'Ready',
    type: 'OKE',
    createdDate: '2024-02-28',
    version: '1.28.0',
    providerType: 'vSphere',
    tags: [],
  },
];

// Tag Cell Component
const TagCell: React.FunctionComponent<{
  cluster: Cluster;
  onAddTag: (clusterId: string) => void;
  onEditTag: (clusterId: string, oldTag: string) => void;
  onRemoveTag: (clusterId: string, tag: string) => void;
  isPopoverOpen: boolean;
  onPopoverToggle: (isOpen: boolean) => void;
}> = ({ cluster, onAddTag, onEditTag, onRemoveTag, isPopoverOpen, onPopoverToggle }) => {
  const hasTag = cluster.tags.length > 0;
  const hubClusterTag = cluster.tags.find(tag => tag === 'Hub Cluster');

  if (!hasTag) {
    return (
      <Button
        variant="link"
        onClick={() => onAddTag(cluster.id)}
        icon={<TagIcon />}
        style={{ padding: 0 }}
      >
        Add tag
      </Button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {cluster.tags.map((tag) => (
        <Label
          key={tag}
          color="blue"
          icon={<TagIcon />}
          onClose={() => onRemoveTag(cluster.id, tag)}
          style={{ cursor: 'pointer' }}
        >
          {tag}
        </Label>
      ))}
      <Dropdown
        isOpen={isPopoverOpen}
        onSelect={() => onPopoverToggle(false)}
        onOpenChange={(isOpen: boolean) => onPopoverToggle(isOpen)}
        popperProps={{ appendTo: () => document.body }}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            variant="plain"
            aria-label={`Tag actions for ${cluster.name}`}
            onClick={() => onPopoverToggle(!isPopoverOpen)}
            isExpanded={isPopoverOpen}
          >
            <EllipsisVIcon />
          </MenuToggle>
        )}
      >
        <DropdownList>
          {hubClusterTag ? (
            <>
              <DropdownItem
                key="edit"
                onClick={() => {
                  onEditTag(cluster.id, hubClusterTag);
                  onPopoverToggle(false);
                }}
              >
                Edit tag
              </DropdownItem>
              <DropdownItem
                key="remove"
                onClick={() => {
                  onRemoveTag(cluster.id, hubClusterTag);
                  onPopoverToggle(false);
                }}
              >
                Remove tag
              </DropdownItem>
            </>
          ) : (
            <DropdownItem
              key="add"
              onClick={() => {
                onAddTag(cluster.id);
                onPopoverToggle(false);
              }}
            >
              Add Hub Cluster tag
            </DropdownItem>
          )}
        </DropdownList>
      </Dropdown>
    </div>
  );
};

// Actions Dropdown Component
const ActionsDropdown: React.FunctionComponent<{ clusterId: string }> = ({ clusterId }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={() => setIsOpen(false)}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      popperProps={{ appendTo: () => document.body }}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label={`Actions for cluster ${clusterId}`}
          variant="plain"
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem key="view">View Details</DropdownItem>
        <DropdownItem key="edit">Edit</DropdownItem>
        <DropdownItem key="delete">Delete</DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

// Main ClustersTable Component
const ClustersTable: React.FunctionComponent = () => {
  const [state, setState] = React.useState<ClustersTableState>({
    clusters: initialClusters,
    filteredClusters: initialClusters,
    selectedClusters: new Set<string>(),
    searchText: '',
    clusterTypeFilter: null,
    sortBy: null,
    page: 1,
    perPage: 10,
    isTagPopoverOpen: {},
    isEditTagModalOpen: {},
    editingTag: null,
    isRemovingTag: {},
  });

  const [isTypeSelectOpen, setIsTypeSelectOpen] = React.useState(false);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = React.useState(false);
  const [addingTagToCluster, setAddingTagToCluster] = React.useState<string | null>(null);
  const [alert, setAlert] = React.useState<{ variant: 'success' | 'danger'; title: string } | null>(null);

  // Filter and search logic
  React.useEffect(() => {
    let filtered = [...state.clusters];

    // Apply search filter
    if (state.searchText) {
      filtered = filtered.filter((cluster) =>
        cluster.name.toLowerCase().includes(state.searchText.toLowerCase())
      );
    }

    // Apply type filter
    if (state.clusterTypeFilter) {
      filtered = filtered.filter((cluster) => cluster.type === state.clusterTypeFilter);
    }

    // Apply sorting
    if (state.sortBy) {
      filtered.sort((a, b) => {
        const sortBy = state.sortBy!;
        const aValue = a[sortBy.column as keyof Cluster] as string;
        const bValue = b[sortBy.column as keyof Cluster] as string;
        if (sortBy.direction === 'asc') {
          return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
      });
    }

    setState((prev) => ({ ...prev, filteredClusters: filtered }));
  }, [state.clusters, state.searchText, state.clusterTypeFilter, state.sortBy]);

  // Handle search
  const handleSearchChange = (value: string) => {
    setState((prev) => ({ ...prev, searchText: value, page: 1 }));
  };

  // Handle type filter
  const handleTypeFilterChange = (value: string | undefined) => {
    setState((prev) => ({
      ...prev,
      clusterTypeFilter: value || null,
      page: 1,
    }));
    setIsTypeSelectOpen(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setState((prev) => ({
      ...prev,
      searchText: '',
      clusterTypeFilter: null,
      page: 1,
    }));
  };

  // Handle sorting
  const handleSort = (column: string) => {
    setState((prev) => ({
      ...prev,
      sortBy:
        prev.sortBy?.column === column
          ? {
              column,
              direction: prev.sortBy.direction === 'asc' ? 'desc' : 'asc',
            }
          : { column, direction: 'asc' },
    }));
  };

  // Handle selection
  const handleSelect = (clusterId: string, isSelected: boolean) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedClusters);
      if (isSelected) {
        newSelected.add(clusterId);
      } else {
        newSelected.delete(clusterId);
      }
      return { ...prev, selectedClusters: newSelected };
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    setState((prev) => ({
      ...prev,
      selectedClusters: isSelected
        ? new Set(prev.filteredClusters.map((c) => c.id))
        : new Set(),
    }));
  };

  // Tag operations
  const handleAddTag = (clusterId: string) => {
    setAddingTagToCluster(clusterId);
    setIsAddTagModalOpen(true);
  };

  const handleEditTag = (clusterId: string, oldTag: string) => {
    setState((prev) => ({
      ...prev,
      editingTag: { clusterId, oldTag, newTag: oldTag },
      isEditTagModalOpen: { ...prev.isEditTagModalOpen, [clusterId]: true },
    }));
  };

  const handleRemoveTag = (clusterId: string, tag: string) => {
    setState((prev) => ({
      ...prev,
      clusters: prev.clusters.map((cluster) =>
        cluster.id === clusterId
          ? { ...cluster, tags: cluster.tags.filter((t) => t !== tag) }
          : cluster
      ),
      isRemovingTag: { ...prev.isRemovingTag, [clusterId]: false },
    }));
    setAlert({ variant: 'success', title: `Tag "${tag}" removed from cluster` });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSaveTag = () => {
    if (!addingTagToCluster && !state.editingTag) return;

    if (addingTagToCluster) {
      // Add new tag
      setState((prev) => ({
        ...prev,
        clusters: prev.clusters.map((cluster) =>
          cluster.id === addingTagToCluster
            ? { ...cluster, tags: [...cluster.tags, 'Hub Cluster'] }
            : cluster
        ),
      }));
      setAlert({ variant: 'success', title: 'Hub Cluster tag added' });
      setIsAddTagModalOpen(false);
      setAddingTagToCluster(null);
    } else if (state.editingTag) {
      // Edit existing tag
      setState((prev) => ({
        ...prev,
        clusters: prev.clusters.map((cluster) =>
          cluster.id === state.editingTag!.clusterId
            ? {
                ...cluster,
                tags: cluster.tags.map((tag) =>
                  tag === state.editingTag!.oldTag
                    ? state.editingTag!.newTag
                    : tag
                ),
              }
            : cluster
        ),
        editingTag: null,
        isEditTagModalOpen: {},
      }));
      setAlert({ variant: 'success', title: 'Tag updated successfully' });
    }
    setTimeout(() => setAlert(null), 3000);
  };

  // Get unique cluster types for filter
  const clusterTypes = Array.from(new Set(state.clusters.map((c) => c.type)));

  // Pagination
  const startIdx = (state.page - 1) * state.perPage;
  const endIdx = startIdx + state.perPage;
  const paginatedClusters = state.filteredClusters.slice(startIdx, endIdx);

  const isAllSelected =
    state.filteredClusters.length > 0 &&
    state.selectedClusters.size === state.filteredClusters.length;
  const isPartiallySelected =
    state.selectedClusters.size > 0 &&
    state.selectedClusters.size < state.filteredClusters.length;

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'green';
      case 'Error':
        return 'red';
      case 'Not Ready':
        return 'orange';
      default:
        return 'grey';
    }
  };

  const activeFilters = [
    state.searchText && { key: 'cluster-name', label: `Cluster name: ${state.searchText}` },
    state.clusterTypeFilter && { key: 'cluster-type', label: `Type: ${state.clusterTypeFilter}` },
  ].filter(Boolean) as Array<{ key: string; label: string }>;

  const recommendedClusterType = 'OpenShift Dedicated';

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Clusters
      </Title>

      {/* Recommended Cluster Type Indicator */}
      <Card
        style={{
          marginTop: '16px',
          marginBottom: '24px',
          borderLeft: '4px solid var(--pf-v6-global--palette--blue-400)',
        }}
      >
        <CardHeader>
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem>
              <StarIcon style={{ color: 'var(--pf-v6-global--palette--blue-400)' }} />
            </FlexItem>
            <FlexItem>
              <CardTitle>
                <strong>Recommended Cluster Type:</strong> {recommendedClusterType}
              </CardTitle>
            </FlexItem>
          </Flex>
        </CardHeader>
        <CardBody>
          <div style={{ color: 'var(--pf-v6-global--Color--200)' }}>
            We recommend using <strong>{recommendedClusterType}</strong> for optimal performance and compatibility with your infrastructure.
          </div>
        </CardBody>
      </Card>

      {alert && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          actionClose={
            <AlertActionCloseButton onClose={() => setAlert(null)} />
          }
          style={{ marginTop: '16px', marginBottom: '16px' }}
        />
      )}

      <Toolbar
        clearAllFilters={handleClearFilters}
        clearFiltersButtonText="Clear all filters"
        collapseListedFiltersBreakpoint="xl"
      >
        <ToolbarContent>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
            <ToolbarFilter categoryName="Filters">
              <ToolbarItem>
                <SearchInput
                  placeholder="Search by cluster name"
                  value={state.searchText}
                  onChange={(_, value) => handleSearchChange(value)}
                  onClear={() => handleSearchChange('')}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Select
                  variant="default"
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsTypeSelectOpen(!isTypeSelectOpen)}
                      isExpanded={isTypeSelectOpen}
                    >
                      {state.clusterTypeFilter || 'Filter by type'}
                    </MenuToggle>
                  )}
                  onSelect={(_, value) => handleTypeFilterChange(value as string)}
                  isOpen={isTypeSelectOpen}
                >
                  <SelectOption value="">All types</SelectOption>
                  {clusterTypes.map((type) => (
                    <SelectOption key={type} value={type}>
                      {type}
                    </SelectOption>
                  ))}
                </Select>
              </ToolbarItem>
            </ToolbarFilter>
          </ToolbarToggleGroup>
        </ToolbarContent>
      </Toolbar>

      {state.filteredClusters.length === 0 ? (
        <EmptyState titleText="No clusters found">
          <EmptyStateBody>
            {state.searchText || state.clusterTypeFilter
              ? 'Try adjusting your search or filter criteria.'
              : 'No clusters are available.'}
          </EmptyStateBody>
        </EmptyState>
      ) : (
        <>
          <Table aria-label="Clusters table" isStickyHeader>
            <Thead>
              <Tr>
                <Th
                  select={{
                    onSelect: (_event, isSelected) => handleSelectAll(isSelected),
                    isSelected: isAllSelected,
                    isHeaderSelectDisabled: state.filteredClusters.length === 0,
                  }}
                />
                <Th
                  sort={
                    state.sortBy?.column === 'name'
                      ? {
                          sortBy: { index: 1, direction: state.sortBy.direction },
                          onSort: () => handleSort('name'),
                          columnIndex: 1,
                        }
                      : undefined
                  }
                >
                  Cluster Name
                </Th>
                <Th
                  sort={
                    state.sortBy?.column === 'status'
                      ? {
                          sortBy: { index: 2, direction: state.sortBy.direction },
                          onSort: () => handleSort('status'),
                          columnIndex: 2,
                        }
                      : undefined
                  }
                >
                  Status
                </Th>
                <Th
                  sort={
                    state.sortBy?.column === 'type'
                      ? {
                          sortBy: { index: 3, direction: state.sortBy.direction },
                          onSort: () => handleSort('type'),
                          columnIndex: 3,
                        }
                      : undefined
                  }
                >
                  Type
                </Th>
                <Th
                  sort={
                    state.sortBy?.column === 'createdDate'
                      ? {
                          sortBy: { index: 4, direction: state.sortBy.direction },
                          onSort: () => handleSort('createdDate'),
                          columnIndex: 4,
                        }
                      : undefined
                  }
                >
                  Created Date
                </Th>
                <Th
                  sort={
                    state.sortBy?.column === 'version'
                      ? {
                          sortBy: { index: 5, direction: state.sortBy.direction },
                          onSort: () => handleSort('version'),
                          columnIndex: 5,
                        }
                      : undefined
                  }
                >
                  Version
                </Th>
                <Th
                  sort={
                    state.sortBy?.column === 'providerType'
                      ? {
                          sortBy: { index: 6, direction: state.sortBy.direction },
                          onSort: () => handleSort('providerType'),
                          columnIndex: 6,
                        }
                      : undefined
                  }
                >
                  Provider Type
                </Th>
                <Th>Tags</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedClusters.map((cluster) => (
                <Tr key={cluster.id}>
                  <Td
                    select={{
                      rowIndex: paginatedClusters.indexOf(cluster),
                      onSelect: (event, isSelected) => handleSelect(cluster.id, isSelected),
                      isSelected: state.selectedClusters.has(cluster.id),
                    }}
                  />
                  <Td>{cluster.name}</Td>
                  <Td>
                    <Label color={getStatusColor(cluster.status) as any}>
                      {cluster.status}
                    </Label>
                  </Td>
                  <Td>{cluster.type}</Td>
                  <Td>{cluster.createdDate}</Td>
                  <Td>{cluster.version}</Td>
                  <Td>{cluster.providerType}</Td>
                  <Td>
                    <TagCell
                      cluster={cluster}
                      onAddTag={handleAddTag}
                      onEditTag={handleEditTag}
                      onRemoveTag={handleRemoveTag}
                      isPopoverOpen={state.isTagPopoverOpen[cluster.id] || false}
                      onPopoverToggle={(isOpen) =>
                        setState((prev) => ({
                          ...prev,
                          isTagPopoverOpen: {
                            ...prev.isTagPopoverOpen,
                            [cluster.id]: isOpen,
                          },
                        }))
                      }
                    />
                  </Td>
                  <Td>
                    <ActionsDropdown clusterId={cluster.id} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Pagination
            itemCount={state.filteredClusters.length}
            page={state.page}
            perPage={state.perPage}
            onSetPage={(_, page) => setState((prev) => ({ ...prev, page }))}
            onPerPageSelect={(_, perPage) =>
              setState((prev) => ({ ...prev, perPage, page: 1 }))
            }
            widgetId="clusters-pagination"
          />
        </>
      )}

      {/* Add Tag Modal */}
      <Modal
        variant={ModalVariant.small}
        title="Add Hub Cluster Tag"
        isOpen={isAddTagModalOpen}
        onClose={() => {
          setIsAddTagModalOpen(false);
          setAddingTagToCluster(null);
        }}
      >
        <Form>
          <FormGroup label="Cluster" fieldId="cluster-name">
            <TextInput
              id="cluster-name"
              value={
                addingTagToCluster
                  ? state.clusters.find((c) => c.id === addingTagToCluster)?.name || ''
                  : ''
              }
              readOnly
            />
          </FormGroup>
          <FormGroup label="Tag" fieldId="tag-name">
            <TextInput id="tag-name" value="Hub Cluster" readOnly />
          </FormGroup>
          <Alert variant="info" isInline title="Confirm">
            Add &quot;Hub Cluster&quot; tag to this cluster?
          </Alert>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              onClick={handleSaveTag}
            >
              Add Tag
            </Button>
            <Button
              variant="link"
              onClick={() => {
                setIsAddTagModalOpen(false);
                setAddingTagToCluster(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Tag Modal */}
      {state.editingTag && (
        <Modal
          variant={ModalVariant.small}
          title="Edit Tag"
          isOpen={
            state.isEditTagModalOpen[state.editingTag.clusterId] || false
          }
          onClose={() =>
            setState((prev) => ({
              ...prev,
              editingTag: null,
              isEditTagModalOpen: {},
            }))
          }
        >
          <Form>
            <FormGroup label="Cluster" fieldId="edit-cluster-name">
              <TextInput
                id="edit-cluster-name"
                value={
                  state.clusters.find((c) => c.id === state.editingTag!.clusterId)
                    ?.name || ''
                }
                readOnly
              />
            </FormGroup>
            <FormGroup
              label="Tag Name"
              fieldId="edit-tag-name"
              isRequired
            >
              <TextInput
                id="edit-tag-name"
                value={state.editingTag.newTag}
                onChange={(_, value) =>
                  setState((prev) => ({
                    ...prev,
                    editingTag: prev.editingTag
                      ? { ...prev.editingTag, newTag: value }
                      : null,
                  }))
                }
                placeholder="Enter tag name"
              />
            </FormGroup>
            <div style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button
                variant="primary"
                onClick={handleSaveTag}
                isDisabled={!state.editingTag?.newTag.trim()}
              >
                Save Changes
              </Button>
              <Button
                variant="link"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    editingTag: null,
                    isEditTagModalOpen: {},
                  }))
                }
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </PageSection>
  );
};

export { ClustersTable };

