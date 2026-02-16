import * as React from 'react';
import {
  PageSection,
  Title,
  Content,
  Form,
  FormGroup,
  MenuToggle,
  Select,
  SelectOption,
  SelectList,
  Radio,
  Card,
  CardBody,
  Grid,
  GridItem,
  Button,
  ActionGroup,
  Icon,
} from '@patternfly/react-core';
import {
  OpenshiftIcon,
  CloudIcon,
  VirtualMachineIcon,
  RedhatIcon,
  ServiceIcon,
} from '@patternfly/react-icons';

const CreateProvider: React.FunctionComponent = () => {
  const [isProjectOpen, setIsProjectOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState('default');
  const [selectedProvider, setSelectedProvider] = React.useState('');

  const projectOptions = [
    { value: 'default', label: 'default' },
    { value: 'development', label: 'development' },
    { value: 'production', label: 'production' },
  ];

  const providerTypes = [
    {
      id: 'openshift-virtualization',
      name: 'OpenShift Virtualization',
      description: 'Red Hat OpenShift Virtualization runs and manages virtual machines in Red Hat OpenShift.',
      icon: <OpenshiftIcon />,
    },
    {
      id: 'openstack',
      name: 'OpenStack',
      description: 'OpenStack is a cloud computing platform that controls large pools of compute, storage, and networking resources.',
      icon: <CloudIcon />,
    },
    {
      id: 'open-virtual-appliance',
      name: 'Open Virtual Appliance',
      description: 'An OVA file is a virtual appliance used by virtualization applications.',
      icon: <VirtualMachineIcon />,
    },
    {
      id: 'red-hat-virtualization',
      name: 'Red Hat Virtualization',
      description: 'Red Hat Virtualization (RHV) is a virtualization platform from Red Hat.',
      icon: <RedhatIcon />,
    },
    {
      id: 'vmware',
      name: 'VMware',
      description: 'VMware vSphere is VMware\'s cloud computing virtualization platform.',
      icon: <ServiceIcon />,
    },
  ];

  const onProjectSelect = (event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelectedProject(value as string);
    setIsProjectOpen(false);
  };

  const onProviderChange = (event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setSelectedProvider(event.currentTarget.value);
    }
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <PageSection className="pf-v6-u-pb-lg">
        <Title headingLevel="h1" size="2xl" className="pf-v6-u-mb-md">
          Create Provider
        </Title>
        <Content component="p" className="pf-v6-u-color-200">
          Create Providers by using the form below. Providers CRs store attributes that enable MTV to connect to and interact with the source and target providers.
        </Content>
      </PageSection>

      <PageSection>
        <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-lg">
          Provider details
        </Title>

        <Form className="pf-v6-u-max-width-lg">
          <FormGroup label="Project" isRequired>
            <Select
              id="project-select"
              isOpen={isProjectOpen}
              selected={selectedProject}
              onSelect={onProjectSelect}
              onOpenChange={(isOpen) => setIsProjectOpen(isOpen)}
              toggle={(toggleRef) => (
                <MenuToggle ref={toggleRef} onClick={() => setIsProjectOpen(!isProjectOpen)} isExpanded={isProjectOpen}>
                  {selectedProject}
                </MenuToggle>
              )}
              shouldFocusToggleOnSelect
            >
              <SelectList>
                {projectOptions.map((option) => (
                  <SelectOption key={option.value} value={option.value}>
                    {option.label}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </FormGroup>

          <FormGroup label="Provider type" isRequired className="pf-v6-u-mt-lg">
            <Grid hasGutter>
              {providerTypes.map((provider) => (
                <GridItem key={provider.id} span={6}>
                  <Card isSelectable isSelected={selectedProvider === provider.id}>
                    <CardBody>
                      <Radio
                        id={provider.id}
                        name="provider-type"
                        value={provider.id}
                        label={
                          <div className="pf-v6-u-display-flex pf-v6-u-align-items-center pf-v6-u-mb-sm">
                            <Icon className="pf-v6-u-mr-sm" size="lg">
                              {provider.icon}
                            </Icon>
                            <span className="pf-v6-u-font-weight-bold">{provider.name}</span>
                          </div>
                        }
                        description={
                          <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mt-sm">
                            {provider.description}
                          </Content>
                        }
                        isChecked={selectedProvider === provider.id}
                        onChange={onProviderChange}
                        className="pf-v6-u-mb-0"
                      />
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          </FormGroup>

          <ActionGroup className="pf-v6-u-mt-xl">
            <Button variant="primary" isDisabled={!selectedProvider}>
              Create provider
            </Button>
            <Button variant="link">Cancel</Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </PageSection>
  );
};

export { CreateProvider }; 