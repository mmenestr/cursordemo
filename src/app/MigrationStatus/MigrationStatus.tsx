import React from 'react';
import {
  PageSection,
  Title,
  Card,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Button,
  MenuToggle,
  MenuToggleElement,
  Dropdown,
  DropdownList,
  DropdownItem,
  Label,
  Progress,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Alert,
  AlertGroup,
  Badge,
  Divider,
  ExpandableSection,
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Tab,
  Tabs,
  TabTitleText,
  CodeBlock,
  CodeBlockCode,
  EmptyState,
  EmptyStateBody
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InProgressIcon,
  PendingIcon,
  EllipsisVIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@patternfly/react-icons';

// Interfaces
interface MigrationPlan {
  name: string;
  description: string;
  createdBy: string;
  createdDate: string;
  sourceInfrastructure: string;
  targetInfrastructure: string;
  totalVMs: number;
  completedVMs: number;
  failedVMs: number;
  pendingVMs: number;
}

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

const MigrationStatus: React.FunctionComponent = () => {
  // Tab state
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = React.useState(false);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  // Sample migration plan data (pre-migration state)
  const migrationPlan: MigrationPlan = {
    name: 'Production VM Migration',
    description: 'Migration of production virtual machines from VMware vSphere to Red Hat Virtualization',
    createdBy: 'John Smith',
    createdDate: '2024-01-15',
    sourceInfrastructure: 'VMware vSphere 7.0',
    targetInfrastructure: 'Red Hat Virtualization 4.5',
    totalVMs: 8,
    completedVMs: 0,
    failedVMs: 0,
    pendingVMs: 8
  };

  // Sample VM data (pre-migration state)
  const vms: VM[] = [
    { id: '1', name: 'web-server-01', sourceHost: 'esxi-host-01.example.com', targetHost: 'rhv-host-01.example.com', status: 'pending', progress: 0 },
    { id: '2', name: 'db-server-01', sourceHost: 'esxi-host-02.example.com', targetHost: 'rhv-host-02.example.com', status: 'pending', progress: 0 },
    { id: '3', name: 'app-server-01', sourceHost: 'esxi-host-01.example.com', targetHost: 'rhv-host-01.example.com', status: 'pending', progress: 0 },
    { id: '4', name: 'cache-server-01', sourceHost: 'esxi-host-03.example.com', targetHost: 'rhv-host-03.example.com', status: 'pending', progress: 0 },
    { id: '5', name: 'backup-server-01', sourceHost: 'esxi-host-02.example.com', targetHost: 'rhv-host-02.example.com', status: 'pending', progress: 0 },
    { id: '6', name: 'monitoring-server-01', sourceHost: 'esxi-host-01.example.com', targetHost: 'rhv-host-01.example.com', status: 'pending', progress: 0 },
    { id: '7', name: 'file-server-01', sourceHost: 'esxi-host-03.example.com', targetHost: 'rhv-host-03.example.com', status: 'pending', progress: 0 },
    { id: '8', name: 'dev-server-01', sourceHost: 'esxi-host-02.example.com', targetHost: 'rhv-host-02.example.com', status: 'pending', progress: 0 }
  ];

  // Sample alerts data
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'error',
      title: 'Insufficient Storage Space',
      description: 'Target storage domain has less than 500GB free space required for migration',
      blocking: true,
      category: 'resource',
      timestamp: '2024-01-20 08:30'
    },
    {
      id: '2',
      type: 'error',
      title: 'VM Tools Incompatibility',
      description: 'VMware Tools version on backup-server-01 is not compatible with target environment',
      blocking: true,
      category: 'configuration',
      vmId: '5',
      vmName: 'backup-server-01',
      timestamp: '2024-01-20 09:15'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Network Latency Detected',
      description: 'High network latency between source and target infrastructure may impact migration performance',
      blocking: false,
      category: 'network',
      timestamp: '2024-01-20 10:00'
    },
    {
      id: '4',
      type: 'error',
      title: 'Security Policy Conflict',
      description: 'Source VM security policies conflict with target environment requirements',
      blocking: true,
      category: 'security',
      vmId: '6',
      vmName: 'monitoring-server-01',
      timestamp: '2024-01-20 11:45'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Deprecated OS Version',
      description: 'file-server-01 is running a deprecated operating system version',
      blocking: false,
      category: 'configuration',
      vmId: '7',
      vmName: 'file-server-01',
      timestamp: '2024-01-20 12:30'
    }
  ];

  const blockingAlerts = alerts.filter(alert => alert.blocking);
  const nonBlockingAlerts = alerts.filter(alert => !alert.blocking);

  const getVMAlerts = (vmId: string) => alerts.filter(alert => alert.vmId === vmId);
  const hasBlockingAlerts = (vmId: string) => alerts.some(alert => alert.vmId === vmId && alert.blocking);

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
    switch (status) {
      case 'completed':
        return <Label color="green">Completed</Label>;
      case 'running':
        return <Label color="blue">Running</Label>;
      case 'failed':
        return <Label color="red">Failed</Label>;
      case 'pending':
        return <Label color="grey">Pending</Label>;
      default:
        return status;
    }
  };

  const overallProgress = Math.round((migrationPlan.completedVMs / migrationPlan.totalVMs) * 100);

  // Alerts drawer content
  const alertsDrawerContent = (
    <DrawerPanelContent isResizable defaultSize="500px" minSize="400px">
      <DrawerHead>
        <Title headingLevel="h2" size="lg">
          Migration Alerts ({alerts.length})
        </Title>
        <Flex spaceItems={{ default: 'spaceItemsLg' }} style={{ marginTop: '0.5rem' }}>
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
        <DrawerActions>
          <DrawerCloseButton onClick={() => setIsAlertsDrawerOpen(false)} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody style={{ padding: '1rem' }}>
        {blockingAlerts.length > 0 && (
          <Alert 
            variant="danger" 
            title={`${blockingAlerts.length} critical issue${blockingAlerts.length > 1 ? 's' : ''} blocking migration`}
            style={{ marginBottom: '1rem' }}
          >
            Migration cannot proceed until these critical issues are resolved.
          </Alert>
        )}
        
        <Table aria-label="Migration Alerts Table" variant="compact">
          <Thead>
            <Tr>
              <Th>Severity</Th>
              <Th>Title</Th>
              <Th>Resource</Th>
              <Th>Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {alerts.length === 0 ? (
              <Tr>
                <Td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                  <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsLg' }}>
                    <FlexItem>
                      <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h3" size="md">No alerts detected</Title>
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
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
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
                        </FlexItem>
                        <FlexItem>
                          <Badge>{alert.category}</Badge>
                        </FlexItem>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <strong>{alert.title}</strong>
                        </FlexItem>
                        <FlexItem>
                          <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                            {alert.description}
                          </div>
                        </FlexItem>
                      </Flex>
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
      </DrawerContentBody>
    </DrawerPanelContent>
  );

  return (
    <Drawer isExpanded={isAlertsDrawerOpen} onExpand={() => setIsAlertsDrawerOpen(true)}>
      <DrawerContent panelContent={alertsDrawerContent}>
        <PageSection>
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
            <FlexItem>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  <Title headingLevel="h1" size="lg">
                    Migration Status: {migrationPlan.name}
                  </Title>
                  <p style={{ marginTop: '0.5rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Track the progress of your virtual machine migration
                  </p>
                </FlexItem>
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                    <FlexItem>
                      <Button 
                        variant="secondary"
                        onClick={() => setIsAlertsDrawerOpen(true)}
                      >
                        <BellIcon style={{ marginRight: '0.5rem' }} />
                        View Alerts 
                        {alerts.length > 0 && (
                          <Badge isRead={blockingAlerts.length === 0} style={{ marginLeft: '0.5rem' }}>
                            {alerts.length}
                          </Badge>
                        )}
                      </Button>
                    </FlexItem>
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
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
        </PageSection>

        <PageSection>
          <Tabs
            activeKey={activeTabKey}
            onSelect={handleTabClick}
            aria-label="Migration status tabs"
          >
            <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>} aria-label="Plan Details Tab">
              <div style={{ paddingTop: '1.5rem' }}>
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
              </div>
            </Tab>

            <Tab eventKey={1} title={<TabTitleText>YAML</TabTitleText>} aria-label="YAML Tab">
              <div style={{ paddingTop: '1.5rem' }}>
                <Card>
                  <CardTitle>Migration Plan YAML</CardTitle>
                  <CardBody>
                    <CodeBlock>
                      <CodeBlockCode>{`apiVersion: forklift.konveyor.io/v1beta1
kind: Plan
metadata:
  name: production-vm-migration
  namespace: openshift-mtv
spec:
  description: "Migration of production virtual machines from VMware vSphere to Red Hat Virtualization"
  provider:
    source:
      name: vmware-source
      namespace: openshift-mtv
    destination:
      name: rhv-destination
      namespace: openshift-mtv
  targetNamespace: production-vms
  vms:
    - id: vm-001
      name: web-server-01
    - id: vm-002
      name: db-server-01
    - id: vm-003
      name: app-server-01
    - id: vm-004
      name: cache-server-01
    - id: vm-005
      name: backup-server-01
    - id: vm-006
      name: monitoring-server-01
    - id: vm-007
      name: file-server-01
    - id: vm-008
      name: dev-server-01
status:
  phase: Running
  conditions:
    - type: Ready
      status: "True"
      lastTransitionTime: "2024-01-20T08:00:00Z"`}</CodeBlockCode>
                    </CodeBlock>
                  </CardBody>
                </Card>
              </div>
            </Tab>
            
                        <Tab eventKey={2} title={<TabTitleText>Virtual Machines ({vms.length})</TabTitleText>} aria-label="Virtual Machines Tab">
              <div style={{ paddingTop: '1.5rem' }}>
                <Card>
                  <CardTitle>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>Virtual Machines ({vms.length})</FlexItem>
                      <FlexItem>
                        <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                          <FlexItem>
                            <Badge isRead={blockingAlerts.length === 0}>
                              {vms.filter(vm => !hasBlockingAlerts(vm.id)).length} Ready
                            </Badge>
                          </FlexItem>
                          <FlexItem>
                            <Badge isRead={blockingAlerts.length === 0}>
                              {vms.filter(vm => hasBlockingAlerts(vm.id)).length} Blocked
                            </Badge>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody>
                    <Table aria-label="VM Readiness Status">
                      <Thead>
                        <Tr>
                          <Th>VM Name</Th>
                          <Th>Source Host</Th>
                          <Th>Target Host</Th>
                          <Th>Readiness Status</Th>
                          <Th>Alerts</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {vms.map((vm) => {
                          const vmAlerts = getVMAlerts(vm.id);
                          const isReady = !hasBlockingAlerts(vm.id);
                          return (
                            <Tr key={vm.id}>
                              <Td>
                                <strong>{vm.name}</strong>
                              </Td>
                              <Td>{vm.sourceHost}</Td>
                              <Td>{vm.targetHost}</Td>
                              <Td>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                  <FlexItem>
                                    {isReady ? (
                                      <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />
                                    ) : (
                                      <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--danger--default)" />
                                    )}
                                  </FlexItem>
                                  <FlexItem>
                                    <Label color={isReady ? 'green' : 'red'}>
                                      {isReady ? 'Ready' : 'Blocked'}
                                    </Label>
                                  </FlexItem>
                                </Flex>
                              </Td>
                              <Td>
                                {vmAlerts.length > 0 ? (
                                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                    {vmAlerts.map((alert) => (
                                      <FlexItem key={alert.id}>
                                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                          <FlexItem>
                                            {alert.type === 'error' ? (
                                              <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--danger--default)" />
                                            ) : (
                                              <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--warning--default)" />
                                            )}
                                          </FlexItem>
                                          <FlexItem>
                                            <div>
                                              <strong>{alert.title}</strong>
                                              <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                                {alert.description}
                                              </div>
                                            </div>
                                          </FlexItem>
                                        </Flex>
                                      </FlexItem>
                                    ))}
                                  </Flex>
                                ) : (
                                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                    <FlexItem>
                                      <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />
                                    </FlexItem>
                                    <FlexItem>
                                      <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                                        No issues detected
                                      </span>
                                    </FlexItem>
                                  </Flex>
                                )}
                              </Td>
                              <Td>
                                <VMActionsDropdown vm={vm} hasBlockingAlerts={hasBlockingAlerts(vm.id)} />
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </div>
            </Tab>

              <Tab eventKey={3} title={<TabTitleText>Resources</TabTitleText>} aria-label="Resources Tab">
                <div style={{ paddingTop: '1.5rem' }}>
                  <Card>
                    <CardTitle>Migration Resources</CardTitle>
                    <CardBody>
                      <EmptyState>
                        <EmptyStateBody>
                          <Title headingLevel="h3" size="lg">
                            No custom resources defined
                          </Title>
                          <p>Migration will use default resource allocations for all virtual machines.</p>
                        </EmptyStateBody>
                      </EmptyState>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab eventKey={4} title={<TabTitleText>Mappings</TabTitleText>} aria-label="Mappings Tab">
                <div style={{ paddingTop: '1.5rem' }}>
                  <Grid hasGutter>
                    <GridItem span={6}>
                      <Card>
                        <CardTitle>Network Mappings</CardTitle>
                        <CardBody>
                          <Table aria-label="Network Mappings" variant="compact">
                            <Thead>
                              <Tr>
                                <Th>Source Network</Th>
                                <Th>Target Network</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              <Tr>
                                <Td>VM Network</Td>
                                <Td>ovirtmgmt</Td>
                              </Tr>
                              <Tr>
                                <Td>Production Network</Td>
                                <Td>production</Td>
                              </Tr>
                              <Tr>
                                <Td>DMZ Network</Td>
                                <Td>dmz</Td>
                              </Tr>
                            </Tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </GridItem>
                    <GridItem span={6}>
                      <Card>
                        <CardTitle>Storage Mappings</CardTitle>
                        <CardBody>
                          <Table aria-label="Storage Mappings" variant="compact">
                            <Thead>
                              <Tr>
                                <Th>Source Datastore</Th>
                                <Th>Target Storage Domain</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              <Tr>
                                <Td>datastore1</Td>
                                <Td>data</Td>
                              </Tr>
                              <Tr>
                                <Td>datastore2</Td>
                                <Td>data</Td>
                              </Tr>
                              <Tr>
                                <Td>ssd-datastore</Td>
                                <Td>ssd-storage</Td>
                              </Tr>
                            </Tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </GridItem>
                  </Grid>
                </div>
              </Tab>

              <Tab eventKey={5} title={<TabTitleText>Hooks</TabTitleText>} aria-label="Hooks Tab">
                <div style={{ paddingTop: '1.5rem' }}>
                  <Card>
                    <CardTitle>Migration Hooks</CardTitle>
                    <CardBody>
                      <EmptyState>
                        <EmptyStateBody>
                          <Title headingLevel="h3" size="lg">
                            No hooks configured
                          </Title>
                          <p>No pre-migration or post-migration hooks have been configured for this plan.</p>
                        </EmptyStateBody>
                      </EmptyState>
                    </CardBody>
                  </Card>
                </div>
              </Tab>
            </Tabs>
          </PageSection>
      </DrawerContent>
    </Drawer>
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
        View VM Details
      </DropdownItem>
      <DropdownItem key="edit-config">
        Edit Configuration
      </DropdownItem>
      {hasBlockingAlerts && (
        <DropdownItem key="resolve-alerts">
          Resolve Alerts
        </DropdownItem>
      )}
      <DropdownItem key="remove">
        Remove from Plan
      </DropdownItem>
    </DropdownList>
    </Dropdown>
  );
};

export { MigrationStatus }; 