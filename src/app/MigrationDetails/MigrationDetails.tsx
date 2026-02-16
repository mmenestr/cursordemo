import * as React from 'react';
import {
  PageSection,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListDescription,
  DescriptionListGroup,
  Progress,
  Label,
  Flex,
  FlexItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  Alert,
  AlertGroup,
  Badge,
  Divider
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { EllipsisVIcon, CheckCircleIcon, ExclamationTriangleIcon, InProgressIcon, PendingIcon, BellIcon } from '@patternfly/react-icons';

interface VM {
  id: string;
  name: string;
  sourceHost: string;
  targetHost: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime?: string;
  estimatedCompletion?: string;
  alerts?: Alert[];
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  blocking: boolean;
  category: 'resource' | 'network' | 'storage' | 'configuration' | 'security';
  vmId?: string;
  vmName?: string;
  timestamp: string;
}

const MigrationDetails: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  // Sample migration plan data
  const migrationPlan = {
    name: 'Production VM Migration - Q1 2024',
    description: 'Migration of production VMs from legacy infrastructure to new cloud environment',
    createdBy: 'John Smith',
    createdDate: '2024-01-15',
    sourceInfrastructure: 'VMware vSphere 7.0',
    targetInfrastructure: 'Red Hat OpenShift Virtualization',
    status: 'in-progress',
    totalVMs: 12,
    completedVMs: 7,
    failedVMs: 1,
    pendingVMs: 4
  };

  // Sample alert data
  const [alerts] = React.useState<Alert[]>([
    // Plan-level alerts
    { id: 'alert-1', type: 'error', title: 'Insufficient Target Storage', description: 'Target infrastructure has only 2TB available storage, but migration requires 3.5TB.', blocking: true, category: 'storage', timestamp: '2024-01-16 08:30' },
    { id: 'alert-2', type: 'warning', title: 'Network Latency High', description: 'Network latency between source and target is >100ms. Migration may be slower than expected.', blocking: false, category: 'network', timestamp: '2024-01-16 09:15' },
    { id: 'alert-3', type: 'error', title: 'Security Policy Conflict', description: 'Target security groups do not allow required ports for VM communication.', blocking: true, category: 'security', timestamp: '2024-01-16 07:45' },
    
    // VM-specific alerts
    { id: 'alert-4', type: 'error', title: 'Incompatible VM Tools', description: 'VM tools version is incompatible with target platform.', blocking: true, category: 'configuration', vmId: '6', vmName: 'web-server-02', timestamp: '2024-01-16 10:20' },
    { id: 'alert-5', type: 'error', title: 'Insufficient Memory', description: 'Target host does not have enough memory to accommodate this VM.', blocking: true, category: 'resource', vmId: '7', vmName: 'monitoring-server', timestamp: '2024-01-16 11:00' },
    { id: 'alert-6', type: 'warning', title: 'Deprecated OS Version', description: 'VM is running a deprecated OS version that may have compatibility issues.', blocking: false, category: 'configuration', vmId: '8', vmName: 'log-server-01', timestamp: '2024-01-16 09:30' },
    { id: 'alert-7', type: 'error', title: 'Disk Space Critical', description: 'VM disk usage is at 95%. Migration may fail due to insufficient free space.', blocking: true, category: 'storage', vmId: '5', vmName: 'backup-server-01', timestamp: '2024-01-16 10:45' },
  ]);

  // Sample VM data with alert references
  const [vms] = React.useState<VM[]>([
    { id: '1', name: 'web-server-01', sourceHost: 'esxi-host-01', targetHost: 'worker-node-01', status: 'completed', progress: 100, startTime: '2024-01-16 09:00', estimatedCompletion: '2024-01-16 10:30' },
    { id: '2', name: 'db-server-01', sourceHost: 'esxi-host-02', targetHost: 'worker-node-02', status: 'completed', progress: 100, startTime: '2024-01-16 10:00', estimatedCompletion: '2024-01-16 12:00' },
    { id: '3', name: 'app-server-01', sourceHost: 'esxi-host-01', targetHost: 'worker-node-03', status: 'running', progress: 65, startTime: '2024-01-16 14:00', estimatedCompletion: '2024-01-16 16:30' },
    { id: '4', name: 'cache-server-01', sourceHost: 'esxi-host-03', targetHost: 'worker-node-01', status: 'running', progress: 30, startTime: '2024-01-16 15:00', estimatedCompletion: '2024-01-16 17:00' },
    { id: '5', name: 'backup-server-01', sourceHost: 'esxi-host-02', targetHost: 'worker-node-02', status: 'failed', progress: 45, startTime: '2024-01-16 11:00', estimatedCompletion: '2024-01-16 13:00' },
    { id: '6', name: 'web-server-02', sourceHost: 'esxi-host-01', targetHost: 'worker-node-03', status: 'pending', progress: 0 },
    { id: '7', name: 'monitoring-server', sourceHost: 'esxi-host-03', targetHost: 'worker-node-01', status: 'pending', progress: 0 },
    { id: '8', name: 'log-server-01', sourceHost: 'esxi-host-02', targetHost: 'worker-node-02', status: 'pending', progress: 0 }
  ]);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />;
      case 'running':
        return <InProgressIcon color="var(--pf-t--global--icon--color--status--info--default)" />;
      case 'failed':
        return <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--danger--default)" />;
      case 'pending':
        return <PendingIcon color="var(--pf-t--global--icon--color--status--warning--default)" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusConfig = {
      completed: { color: 'green' as const, text: 'Completed' },
      running: { color: 'blue' as const, text: 'Running' },
      failed: { color: 'red' as const, text: 'Failed' },
      pending: { color: 'orange' as const, text: 'Pending' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Label color={config.color}>{config.text}</Label>;
  };

  const overallProgress = Math.round((migrationPlan.completedVMs / migrationPlan.totalVMs) * 100);

  // Alert categorization
  const planAlerts = alerts.filter(alert => !alert.vmId);
  const vmAlerts = alerts.filter(alert => alert.vmId);
  const blockingAlerts = alerts.filter(alert => alert.blocking);
  const nonBlockingAlerts = alerts.filter(alert => !alert.blocking);

  // Helper function to get VM alerts by ID
  const getVMAlerts = (vmId: string) => alerts.filter(alert => alert.vmId === vmId);

  // Helper function to check if VM has blocking alerts
  const hasBlockingAlerts = (vmId: string) => alerts.some(alert => alert.vmId === vmId && alert.blocking);

  const detailsTab = (
    <PageSection>
      <Grid hasGutter>
        <GridItem span={8}>
          <Card>
            <CardTitle>Migration Plan Details</CardTitle>
            <CardBody>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Plan Name</DescriptionListTerm>
                  <DescriptionListDescription>{migrationPlan.name}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Description</DescriptionListTerm>
                  <DescriptionListDescription>{migrationPlan.description}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Created By</DescriptionListTerm>
                  <DescriptionListDescription>{migrationPlan.createdBy}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Created Date</DescriptionListTerm>
                  <DescriptionListDescription>{migrationPlan.createdDate}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Source Infrastructure</DescriptionListTerm>
                  <DescriptionListDescription>{migrationPlan.sourceInfrastructure}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Target Infrastructure</DescriptionListTerm>
                  <DescriptionListDescription>{migrationPlan.targetInfrastructure}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={4}>
          <Card>
            <CardTitle>Migration Progress</CardTitle>
            <CardBody>
              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
                <FlexItem>
                  <Progress 
                    value={overallProgress} 
                    title="Overall Progress"
                    size="lg"
                  />
                </FlexItem>
                <FlexItem>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Total VMs</DescriptionListTerm>
                      <DescriptionListDescription>{migrationPlan.totalVMs}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Completed</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Flex alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>
                            <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />
                          </FlexItem>
                          <FlexItem>{migrationPlan.completedVMs}</FlexItem>
                        </Flex>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Failed</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Flex alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>
                            <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--danger--default)" />
                          </FlexItem>
                          <FlexItem>{migrationPlan.failedVMs}</FlexItem>
                        </Flex>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Pending</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Flex alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>
                            <PendingIcon color="var(--pf-t--global--icon--color--status--warning--default)" />
                          </FlexItem>
                          <FlexItem>{migrationPlan.pendingVMs}</FlexItem>
                        </Flex>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );

  const vmTab = (
    <PageSection>
      <Card>
        <CardTitle>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>Virtual Machines ({vms.length})</FlexItem>
            <FlexItem>
              <Button 
                variant="primary" 
                isDisabled={blockingAlerts.length > 0}
                {...(blockingAlerts.length > 0 && { 
                  tooltip: `Cannot start migration: ${blockingAlerts.length} blocking alert${blockingAlerts.length > 1 ? 's' : ''} must be resolved first` 
                })}
              >
                Start Migration
              </Button>
            </FlexItem>
          </Flex>
        </CardTitle>
        <CardBody>
          <Table aria-label="VM Migration Status">
            <Thead>
              <Tr>
                <Th>VM Name</Th>
                <Th>Source Host</Th>
                <Th>Target Host</Th>
                <Th>Status</Th>
                <Th>Progress</Th>
                <Th>Start Time</Th>
                <Th>Est. Completion</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {vms.map((vm) => (
                <Tr key={vm.id}>
                  <Td>{vm.name}</Td>
                  <Td>{vm.sourceHost}</Td>
                  <Td>{vm.targetHost}</Td>
                  <Td>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>{getStatusIcon(vm.status)}</FlexItem>
                      <FlexItem>{getStatusLabel(vm.status)}</FlexItem>
                      {hasBlockingAlerts(vm.id) && (
                        <FlexItem>
                          <Badge>
                            <ExclamationTriangleIcon /> Blocked
                          </Badge>
                        </FlexItem>
                      )}
                    </Flex>
                  </Td>
                  <Td>
                    {vm.status === 'pending' ? (
                      'Not started'
                    ) : (
                      <Progress value={vm.progress} title={`${vm.progress}%`} size="sm" />
                    )}
                  </Td>
                  <Td>{vm.startTime || '-'}</Td>
                  <Td>{vm.estimatedCompletion || '-'}</Td>
                  <Td>
                    <VMActionsDropdown vm={vm} hasBlockingAlerts={hasBlockingAlerts(vm.id)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </PageSection>
  );

    const alertsTab = (
    <PageSection>
      <Card>
        <CardTitle>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h2" size="lg">Migration Alerts ({alerts.length})</Title>
            </FlexItem>
            <FlexItem>
              <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                <FlexItem>
                  <Badge isRead={blockingAlerts.length === 0}>
                    <ExclamationTriangleIcon /> {blockingAlerts.length} Critical
                  </Badge>
                </FlexItem>
                <FlexItem>
                  <Badge isRead={nonBlockingAlerts.length === 0}>
                    <BellIcon /> {nonBlockingAlerts.length} Warnings
                  </Badge>
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
        </CardTitle>
        <CardBody>
          {blockingAlerts.length > 0 && (
            <Alert 
              variant="danger" 
              title={`${blockingAlerts.length} critical issue${blockingAlerts.length > 1 ? 's' : ''} blocking migration`}
              style={{ marginBottom: '1rem' }}
            >
              Migration cannot proceed until these critical issues are resolved.
            </Alert>
          )}
          
          <Table aria-label="Migration Alerts Table">
            <Thead>
              <Tr>
                <Th width={10}>Severity</Th>
                <Th width={15}>Category</Th>
                <Th width={20}>Title</Th>
                <Th width={30}>Description</Th>
                <Th width={15}>Affected Resource</Th>
                <Th width={10}>Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {alerts.length === 0 ? (
                <Tr>
                  <Td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsLg' }}>
                      <FlexItem>
                        <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />
                      </FlexItem>
                      <FlexItem>
                        <Title headingLevel="h3" size="lg">No alerts detected</Title>
                      </FlexItem>
                      <FlexItem>
                        All systems are ready for migration
                      </FlexItem>
                    </Flex>
                  </Td>
                </Tr>
              ) : (
                alerts
                  .sort((a, b) => {
                    // Sort by blocking status first, then by type severity
                    if (a.blocking !== b.blocking) return a.blocking ? -1 : 1;
                    if (a.type !== b.type) {
                      const severityOrder = { error: 0, warning: 1, info: 2 };
                      return severityOrder[a.type] - severityOrder[b.type];
                    }
                    return a.timestamp.localeCompare(b.timestamp);
                  })
                  .map((alert) => (
                    <Tr key={alert.id}>
                      <Td>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            {alert.type === 'error' ? (
                              <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--danger--default)" />
                            ) : alert.type === 'warning' ? (
                              <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--warning--default)" />
                            ) : (
                              <BellIcon color="var(--pf-t--global--icon--color--status--info--default)" />
                            )}
                          </FlexItem>
                          <FlexItem>
                            <Label color={alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'orange' : 'blue'}>
                              {alert.blocking ? 'Critical' : alert.type === 'warning' ? 'Warning' : 'Info'}
                            </Label>
                          </FlexItem>
                        </Flex>
                      </Td>
                      <Td>
                        <Badge>{alert.category}</Badge>
                      </Td>
                      <Td>
                        <strong>{alert.title}</strong>
                      </Td>
                      <Td>
                        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                          {alert.description}
                        </div>
                      </Td>
                      <Td>
                        {alert.vmName ? (
                          <Flex direction={{ default: 'column' }}>
                            <FlexItem>
                              <Badge>VM</Badge>
                            </FlexItem>
                            <FlexItem>
                              <strong>{alert.vmName}</strong>
                            </FlexItem>
                          </Flex>
                        ) : (
                          <Badge>Migration Plan</Badge>
                        )}
                      </Td>
                      <Td>
                        <small>{alert.timestamp}</small>
                      </Td>
                    </Tr>
                  ))
              )}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </PageSection>
  );

  return (
    <React.Fragment>
      <PageSection>
        <Title headingLevel="h1" size="lg">
          Migration Plan: {migrationPlan.name}
        </Title>
      </PageSection>
      <PageSection type="tabs">
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label="Migration details tabs"
        >
          <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>} aria-label="Migration plan details">
            {detailsTab}
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Virtual Machines</TabTitleText>} aria-label="VM migration status">
            {vmTab}
          </Tab>
          <Tab 
            eventKey={2} 
            title={
              <TabTitleText>
                Alerts {alerts.length > 0 && <Badge isRead={blockingAlerts.length === 0}>{alerts.length}</Badge>}
              </TabTitleText>
            } 
            aria-label="Migration alerts"
          >
            {alertsTab}
          </Tab>
        </Tabs>
      </PageSection>
    </React.Fragment>
  );
};

// VM Actions dropdown component
const VMActionsDropdown: React.FunctionComponent<{ vm: VM; hasBlockingAlerts: boolean }> = ({ vm, hasBlockingAlerts }) => {
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
          aria-label={`Actions for ${vm.name}`}
          variant="plain"
          onClick={onToggleClick}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem key="view-details">
          View Details
        </DropdownItem>
        <DropdownItem key="view-logs">
          View Logs
        </DropdownItem>
        {vm.status === 'failed' && (
          <DropdownItem key="retry">
            Retry Migration
          </DropdownItem>
        )}
        {vm.status === 'running' && (
          <DropdownItem key="cancel">
            Cancel Migration
          </DropdownItem>
        )}
        {vm.status === 'pending' && (
          <DropdownItem 
            key="start" 
            isDisabled={hasBlockingAlerts}
            {...(hasBlockingAlerts && { 
              tooltip: 'Cannot start: VM has blocking alerts' 
            })}
          >
            Start Migration
          </DropdownItem>
        )}
      </DropdownList>
    </Dropdown>
  );
};

export { MigrationDetails }; 