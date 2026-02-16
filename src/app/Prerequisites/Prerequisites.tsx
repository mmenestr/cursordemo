import * as React from 'react';
import {
  PageSection,
  Title,
  Content,
  Card,
  CardTitle,
  CardBody,
  List,
  ListItem,
  Icon,
  Button,
  Alert,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';

interface PrerequisiteItemProps {
  title: string;
  description: string;
  status: 'complete' | 'incomplete' | 'info';
  action?: {
    text: string;
    onClick: () => void;
  };
}

const PrerequisiteItem: React.FunctionComponent<PrerequisiteItemProps> = ({
  title,
  description,
  status,
  action,
}) => {
  const getIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircleIcon className="pf-v6-u-color-status-success" />;
      case 'incomplete':
        return <ExclamationCircleIcon className="pf-v6-u-color-status-warning" />;
      case 'info':
        return <InfoCircleIcon className="pf-v6-u-color-200" />;
      default:
        return <InfoCircleIcon />;
    }
  };

  return (
    <Card className="pf-v6-u-mb-md">
      <CardBody>
        <Flex alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Icon size="lg" className="pf-v6-u-mr-sm">
              {getIcon()}
            </Icon>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <Title headingLevel="h3" size="md" className="pf-v6-u-mb-xs">
              {title}
            </Title>
            <Content component="p" className="pf-v6-u-color-200">
              {description}
            </Content>
          </FlexItem>
          {action && (
            <FlexItem>
              <Button variant="secondary" onClick={action.onClick}>
                {action.text}
              </Button>
            </FlexItem>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

const Prerequisites: React.FunctionComponent = () => {
  const [registryConnected, setRegistryConnected] = React.useState(false);

  const prerequisites = [
    {
      title: 'Internal Container Registry Connection',
      description: 'An internal container registry must be connected to store and manage VDDK images during migration.',
      status: registryConnected ? 'complete' : 'incomplete',
      action: !registryConnected ? {
        text: 'Connect Registry',
        onClick: () => {
          // Simulate connecting registry
          setTimeout(() => setRegistryConnected(true), 1000);
        }
      } : undefined,
    },
    {
      title: 'VMware vCenter Access',
      description: 'Ensure you have administrative access to the source VMware vCenter environment.',
      status: 'info',
    },
    {
      title: 'Network Connectivity',
      description: 'Verify network connectivity between the migration toolkit and both source and target environments.',
      status: 'info',
    },
    {
      title: 'Storage Requirements',
      description: 'Sufficient storage space must be available in the target environment for virtual machine data.',
      status: 'info',
    },
    {
      title: 'VDDK License',
      description: 'A valid VMware Virtual Disk Development Kit (VDDK) license and installation package.',
      status: 'info',
    },
  ];

  const allPrerequisitesMet = prerequisites.every(p => p.status === 'complete' || p.status === 'info');

  return (
    <PageSection hasBodyWrapper={false}>
      <PageSection className="pf-v6-u-pb-lg">
        <Title headingLevel="h1" size="2xl" className="pf-v6-u-mb-md">
          Migration Prerequisites
        </Title>
        <Content component="p" className="pf-v6-u-color-200">
          Before setting up VDDK for warm migrations, ensure the following prerequisites are met.
        </Content>
      </PageSection>

      <PageSection>
        <Alert
          variant="info"
          isInline
          title="Required Setup"
          className="pf-v6-u-mb-lg"
        >
          Complete all prerequisites before proceeding with VDDK configuration. Some features may be unavailable until requirements are satisfied.
        </Alert>

        <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-lg">
          System Requirements
        </Title>

        {prerequisites.map((prereq, index) => (
          <PrerequisiteItem
            key={index}
            title={prereq.title}
            description={prereq.description}
            status={prereq.status as 'complete' | 'incomplete' | 'info'}
            action={prereq.action}
          />
        ))}

        <Card className="pf-v6-u-mt-lg">
          <CardTitle>Additional Resources</CardTitle>
          <CardBody>
            <List>
              <ListItem>
                <Button variant="link" isInline icon={<ExternalLinkAltIcon />}>
                  VMware VDDK Documentation
                </Button>
              </ListItem>
              <ListItem>
                <Button variant="link" isInline icon={<ExternalLinkAltIcon />}>
                  Migration Planning Guide
                </Button>
              </ListItem>
              <ListItem>
                <Button variant="link" isInline icon={<ExternalLinkAltIcon />}>
                  Container Registry Setup Guide
                </Button>
              </ListItem>
              <ListItem>
                <Button variant="link" isInline icon={<ExternalLinkAltIcon />}>
                  Troubleshooting Common Issues
                </Button>
              </ListItem>
            </List>
          </CardBody>
        </Card>

        <Alert
          variant={registryConnected ? 'success' : 'warning'}
          isInline
          title={registryConnected ? 'Prerequisites Complete' : 'Prerequisites Required'}
          className="pf-v6-u-mt-lg"
        >
          {registryConnected 
            ? 'All required prerequisites have been satisfied. You can now proceed with VDDK setup.'
            : 'Please complete the internal registry connection before proceeding with VDDK configuration.'
          }
        </Alert>
      </PageSection>
    </PageSection>
  );
};

export { Prerequisites }; 