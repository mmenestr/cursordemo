import * as React from 'react';
import { PageSection, Title, Dropdown, DropdownItem, DropdownList, MenuToggle, MenuToggleElement } from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { EllipsisVIcon } from '@patternfly/react-icons';

const Tables: React.FunctionComponent = () => {
  // Sample data to populate the table
  const [data] = React.useState<Array<{ id: string; name: string; email: string; status: string }>>([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', status: 'Inactive' },
    { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com', status: 'Pending' },
    { id: '4', name: 'Alice Brown', email: 'alice.brown@example.com', status: 'Active' },
    { id: '5', name: 'Charlie Wilson', email: 'charlie.wilson@example.com', status: 'Active' },
  ]);

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Tables Page
      </Title>
      <br />
      
      <Table aria-label="Sample table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.length === 0 ? (
            <Tr>
              <Td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                No data available
              </Td>
            </Tr>
          ) : (
            data.map((item) => (
              <Tr key={item.id}>
                <Td>{item.name}</Td>
                <Td>{item.email}</Td>
                <Td>{item.status}</Td>
                <Td>
                  <ActionsDropdown itemId={item.id} />
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </PageSection>
  );
};

// Actions dropdown component
const ActionsDropdown: React.FunctionComponent<{ itemId: string }> = ({ itemId }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      popperProps={{ appendTo: () => document.body }}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label={`Actions for item ${itemId}`}
          variant="plain"
          onClick={onToggleClick}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem key="edit">
          Edit
        </DropdownItem>
        <DropdownItem key="delete">
          Delete
        </DropdownItem>
        <DropdownItem key="view">
          View Details
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

export { Tables }; 