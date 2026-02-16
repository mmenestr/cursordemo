import * as React from 'react';
import {
  PageSection,
  Title,
  Wizard,
  WizardStep,
  Form,
  FormGroup,
  TextInput,
  Select,
  SelectOption,
  Switch,
  TextArea,
  Button,
  FileUpload,
  Alert,
  Popover,
  Divider,
  Stack,
  StackItem,
  AlertActionCloseButton,
} from '@patternfly/react-core';
import { useWizardContext, useWizardFooter } from '@patternfly/react-core';
import { useState, useCallback } from 'react';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

// Types for form data
interface ProviderFormData {
  project: string;
  providerType: string;
  providerName: string;
  url: string;
  bearerToken: string;
  skipCertValidation: boolean;
  caCertificate: string;
  ovaFile: File | null;
}

// Step 1: Provider Details Component
const ProviderDetailsStep: React.FunctionComponent<{
  formData: ProviderFormData;
  setFormData: (data: ProviderFormData) => void;
  errors: Record<string, string>;
}> = ({ formData, setFormData, errors }) => {

  const projectOptions = [
    { value: 'openshift-mtv', label: 'openshift-mtv' },
    { value: 'default', label: 'default' },
    { value: 'kube-system', label: 'kube-system' },
  ];

  const providerTypes = [
    {
      id: 'ova',
      name: 'OVA',
      description: 'Open Virtual Appliance provider for VM migration',
    },
    {
      id: 'openshift-virtualization',
      name: 'OpenShift Virtualization',
      description: 'OpenShift Virtualization provider for VM migration',
    },
    {
      id: 'vmware-vsphere',
      name: 'VMware vSphere',
      description: 'VMware vSphere provider for VM migration',
    },
    {
      id: 'redhat-virtualization',
      name: 'Red Hat Virtualization',
      description: 'Red Hat Virtualization provider for VM migration',
    },
  ];

  const handleInputChange = useCallback(
    (field: keyof ProviderFormData, value: string | boolean) => {
      setFormData({ ...formData, [field]: value });
    },
    [formData, setFormData]
  );

  const handleProviderTypeSelect = useCallback(
    (providerId: string) => {
      setFormData({ ...formData, providerType: providerId });
    },
    [formData, setFormData]
  );

  return (
    <Form>
      <Stack hasGutter>
        <StackItem>
          <FormGroup
            label="Project"
            fieldId="project"
            isRequired
          >
            <select
              value={formData.project}
              onChange={(e) => handleInputChange('project', e.target.value)}
              className="pf-c-form-control"
            >
              {projectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.project && (
              <div className="pf-c-form__helper-text pf-m-error">{errors.project}</div>
            )}
          </FormGroup>
        </StackItem>

        <StackItem>
          <FormGroup
            label="Provider type"
            fieldId="provider-type"
            isRequired
          >
            <div className="pf-c-form__helper-text">
              Select the type of provider you want to create
            </div>
            <select
              value={formData.providerType}
              onChange={(e) => handleProviderTypeSelect(e.target.value)}
              className="pf-c-form-control"
            >
              <option value="">Select a provider type</option>
              {providerTypes.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} - {provider.description}
                </option>
              ))}
            </select>
            {errors.providerType && (
              <div className="pf-c-form__helper-text pf-m-error">{errors.providerType}</div>
            )}
          </FormGroup>
        </StackItem>

        <StackItem>
          <FormGroup
            label="Provider resource name"
            fieldId="provider-name"
            isRequired
          >
            <TextInput
              id="provider-name"
              name="provider-name"
              value={formData.providerName}
              onChange={(_, value) => handleInputChange('providerName', value)}
              placeholder="Enter provider name"
            />
            {errors.providerName && (
              <div className="pf-c-form__helper-text pf-m-error">{errors.providerName}</div>
            )}
          </FormGroup>
        </StackItem>

        <StackItem>
          <FormGroup
            label="URL"
            fieldId="url"
          >
            <TextInput
              id="url"
              name="url"
              value={formData.url}
              onChange={(_, value) => handleInputChange('url', value)}
              placeholder="https://example.com:6443"
            />
            <div className="pf-c-form__helper-text">
              The URL of the {formData.providerType === 'openshift-virtualization' ? 'OpenShift Virtualization' : 'Provider'} API endpoint, for example: https://example.com:6443
            </div>
          </FormGroup>
        </StackItem>
      </Stack>
    </Form>
  );
};

// Step 2: Provider Credentials Component
const ProviderCredentialsStep: React.FunctionComponent<{
  formData: ProviderFormData;
  setFormData: (data: ProviderFormData) => void;
  errors: Record<string, string>;
}> = ({ formData, setFormData, errors }) => {
  const [showToken, setShowToken] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof ProviderFormData, value: string | boolean) => {
      setFormData({ ...formData, [field]: value });
    },
    [formData, setFormData]
  );

  return (
    <Form>
      <Stack hasGutter>
        <StackItem>
          <FormGroup
            label="Service account bearer token"
            fieldId="bearer-token"
            isRequired
          >
            <TextInput
              id="bearer-token"
              name="bearer-token"
              type={showToken ? 'text' : 'password'}
              value={formData.bearerToken}
              onChange={(_, value) => handleInputChange('bearerToken', value)}
              placeholder="Enter bearer token"
            />
            <Button
              variant="link"
              onClick={() => setShowToken(!showToken)}
              style={{ marginTop: '8px' }}
            >
              {showToken ? 'Hide' : 'Show'} token
            </Button>
            <div className="pf-c-form__helper-text">
              A service account token, optional, used for authenticating the connection to the API server.
            </div>
            {errors.bearerToken && (
              <div className="pf-c-form__helper-text pf-m-error">{errors.bearerToken}</div>
            )}
          </FormGroup>
        </StackItem>

        <StackItem>
          <FormGroup
            label="Skip certificate validation"
            fieldId="skip-cert"
          >
            <Switch
              id="skip-cert"
              label="Skip certificate validation"
              isChecked={formData.skipCertValidation}
              onChange={(_, checked) => handleInputChange('skipCertValidation', checked)}
            />
          </FormGroup>
        </StackItem>

        <StackItem>
          <FormGroup
            label="CA certificate"
            fieldId="ca-cert"
          >
            <div className="pf-c-form__group-control">
              <div className="pf-c-form__group-control-group">
                <Button
                  variant="secondary"
                  onClick={() => {
                    // Handle file upload for CA certificate
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.crt,.pem,.cer';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          handleInputChange('caCertificate', event.target?.result as string);
                        };
                        reader.readAsText(file);
                      }
                    };
                    input.click();
                  }}
                >
                  Upload
                </Button>
                <Button
                  variant="link"
                  onClick={() => handleInputChange('caCertificate', '')}
                  isDisabled={!formData.caCertificate}
                >
                  Clear
                </Button>
              </div>
            </div>
            <TextArea
              id="ca-cert"
              name="ca-cert"
              value={formData.caCertificate}
              onChange={(_, value) => handleInputChange('caCertificate', value)}
              placeholder="Paste CA certificate content here or use Upload button"
              rows={6}
            />
            <div className="pf-c-form__helper-text">
              The Manager CA certificate unless it was replaced by a third-party certificate, in which case, enter the Manager Apache CA certificate.
            </div>
          </FormGroup>
        </StackItem>
      </Stack>
    </Form>
  );
};

// Step 3: Additional Settings Component
const AdditionalSettingsStep: React.FunctionComponent<{
  formData: ProviderFormData;
  setFormData: (data: ProviderFormData) => void;
  errors: Record<string, string>;
}> = ({ formData, setFormData, errors }) => {
  const [isFileUploading, setIsFileUploading] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof ProviderFormData, value: string | boolean | File | null) => {
      setFormData({ ...formData, [field]: value });
    },
    [formData, setFormData]
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setIsFileUploading(true);
        // Simulate file processing
        setTimeout(() => {
          handleInputChange('ovaFile', file);
          setIsFileUploading(false);
        }, 1000);
      }
    },
    [handleInputChange]
  );

  return (
    <Form>
      <Stack hasGutter>
        <StackItem>
          <Alert
            variant="info"
            isInline
            title="OVA File Upload"
            actionClose={
              <AlertActionCloseButton
                onClose={() => {
                  // Handle alert close if needed
                }}
              />
            }
          >
            Upload an OVA (Open Virtual Appliance) file to configure additional settings for your provider.
          </Alert>
        </StackItem>

        <StackItem>
          <FormGroup
            label="OVA File"
            fieldId="ova-file"
          >
            <FileUpload
              id="ova-file"
              type="text"
              value={formData.ovaFile?.name || ''}
              filename={formData.ovaFile?.name || ''}
              onChange={handleFileUpload}
              isLoading={isFileUploading}
              dropzoneProps={{
                accept: { 'application/octet-stream': ['.ova'] },
                onDropRejected: (fileRejections) => {
                  console.log('File rejected:', fileRejections);
                },
              }}
              browseButtonText="Browse"
              clearButtonText="Clear"
            />
            <div className="pf-c-form__helper-text">
              Select an OVA file to upload. This file will be used to configure additional provider settings.
            </div>
            {errors.ovaFile && (
              <div className="pf-c-form__helper-text pf-m-error">{errors.ovaFile}</div>
            )}
          </FormGroup>
        </StackItem>

        {formData.ovaFile && (
          <StackItem>
            <Alert
              variant="success"
              isInline
              title="OVA File Ready"
            >
              OVA file "{formData.ovaFile.name}" has been selected and is ready for processing.
            </Alert>
          </StackItem>
        )}

        <StackItem>
          <Divider />
        </StackItem>

        <StackItem>
          <FormGroup
            label="Additional Configuration"
            fieldId="additional-config"
          >
            <TextArea
              id="additional-config"
              name="additional-config"
              placeholder="Enter any additional configuration notes or settings..."
              rows={4}
            />
            <div className="pf-c-form__helper-text">
              Optional: Add any additional configuration notes or settings for this provider.
            </div>
          </FormGroup>
        </StackItem>
      </Stack>
    </Form>
  );
};

// Main Wizard Component
const CreateProviderWizard: React.FunctionComponent = () => {
  const [formData, setFormData] = useState<ProviderFormData>({
    project: 'openshift-mtv',
    providerType: 'ova',
    providerName: '',
    url: '',
    bearerToken: '',
    skipCertValidation: false,
    caCertificate: '',
    ovaFile: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateStep = useCallback((stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepIndex) {
      case 0: // Provider Details
        if (!formData.project) newErrors.project = 'Project is required';
        if (!formData.providerType) newErrors.providerType = 'Provider type is required';
        if (!formData.providerName) newErrors.providerName = 'Provider name is required';
        break;
      case 1: // Provider Credentials
        if (!formData.bearerToken) newErrors.bearerToken = 'Bearer token is required';
        break;
      case 2: // Additional Settings
        // OVA file is optional, so no validation needed
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle wizard submission
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Provider created:', formData);
      // Handle success (e.g., redirect, show success message)
    } catch (error) {
      console.error('Error creating provider:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  // Custom footer for the wizard
  const WizardFooter = () => {
    const { activeStep, goToNextStep, goToPrevStep, close } = useWizardContext();
    const isLastStep = activeStep.index === 2;
    const isFirstStep = activeStep.index === 0;

    const handleNext = () => {
      if (validateStep(activeStep.index)) {
        goToNextStep();
      }
    };

    const handleBack = () => {
      goToPrevStep();
    };

    const handleFinish = () => {
      if (validateStep(activeStep.index)) {
        handleSubmit();
      }
    };

    return (
      <div className="pf-c-wizard__footer">
        <Button
          variant="primary"
          onClick={isLastStep ? handleFinish : handleNext}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          {isLastStep ? 'Create Provider' : 'Next'}
        </Button>
        {!isFirstStep && (
          <Button variant="secondary" onClick={handleBack} isDisabled={isSubmitting}>
            Back
          </Button>
        )}
        <Button variant="link" onClick={close} isDisabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    );
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Create Provider Wizard
      </Title>
      <div className="pf-c-content">
        <p>
          Create Providers by using the wizard below. Providers CRs store attributes that enable MTV to connect to and interact with the source and target providers.
        </p>
      </div>

      <Wizard
        title="Create Provider"
        height={600}
        footer={<WizardFooter />}
      >
        <WizardStep
          name="Provider Details"
          id="provider-details"
        >
          <ProviderDetailsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </WizardStep>

        <WizardStep
          name="Provider Credentials"
          id="provider-credentials"
        >
          <ProviderCredentialsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </WizardStep>

        <WizardStep
          name="Additional Settings"
          id="additional-settings"
        >
          <AdditionalSettingsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </WizardStep>
      </Wizard>
    </PageSection>
  );
};

export { CreateProviderWizard };

