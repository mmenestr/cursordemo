import * as React from 'react';
import {
  PageSection,
  Title,
  Content,
  Alert,
  AlertActionCloseButton,
  Form,
  FormGroup,
  Radio,
  FileUpload,
  Button,
  ActionGroup,
  Card,
  CardBody,
  TextInput,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Icon,
} from '@patternfly/react-core';
import { InfoCircleIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

const VDDKSetup: React.FunctionComponent = () => {
  const [selectedOption, setSelectedOption] = React.useState('upload');
  const [file, setFile] = React.useState<File | null>(null);
  const [filename, setFilename] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(true);

  const handleFileInputChange = (
    _event: any,
    file: File
  ) => {
    setFile(file);
    setFilename(file.name);
  };

  const handleClear = () => {
    setFile(null);
    setFilename('');
  };

  const handleUpload = () => {
    setIsLoading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsLoading(false);
      // Handle upload completion
    }, 2000);
  };

  const onOptionChange = (event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setSelectedOption(event.currentTarget.value);
    }
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <PageSection className="pf-v6-u-pb-lg">
        <div className="pf-v6-u-display-flex pf-v6-u-align-items-center pf-v6-u-mb-md">
          <Title headingLevel="h1" size="2xl" className="pf-v6-u-mr-sm">
            VDDK set up
          </Title>
          <Icon size="sm" className="pf-v6-u-color-200">
            <InfoCircleIcon />
          </Icon>
        </div>
        <Content component="p" className="pf-v6-u-color-200">
          Configure VDDK for warm migrations.
        </Content>
      </PageSection>

      <PageSection>
        {showAlert && (
          <Alert
            variant="warning"
            isInline
            title="It is strongly recommended to use a VDDK image. Not using a VDDK image could result in significantly lower migration speeds or a plan failing."
            actionClose={<AlertActionCloseButton onClose={() => setShowAlert(false)} />}
            className="pf-v6-u-mb-lg"
          >
            For more information, see{' '}
            <Button variant="link" isInline icon={<ExternalLinkAltIcon />}>
              Creating a VDDK image
            </Button>
            .
          </Alert>
        )}

        <Form className="pf-v6-u-max-width-lg">
          <FormGroup>
            <Radio
              id="upload-option"
              name="vddk-option"
              value="upload"
              label="Upload a VDDK archive and have us build image for you"
              isChecked={selectedOption === 'upload'}
              onChange={onOptionChange}
              className="pf-v6-u-mb-lg"
            />

            {selectedOption === 'upload' && (
              <Card className="pf-v6-u-ml-lg pf-v6-u-mt-md">
                <CardBody>
                  <FormGroup>
                    <div className="pf-v6-u-display-flex pf-v6-u-align-items-center pf-v6-u-mb-sm">
                      <span className="pf-v6-u-mr-xs">VDDK init image archive</span>
                      <Icon size="sm" className="pf-v6-u-color-200">
                        <InfoCircleIcon />
                      </Icon>
                    </div>
                    <FileUpload
                      id="vddk-file-upload"
                      type="dataURL"
                      value={file || undefined}
                      filename={filename}
                      filenamePlaceholder="Drag and drop a file or upload"
                      onFileInputChange={handleFileInputChange}
                      onClearClick={handleClear}
                      browseButtonText="Browse..."
                      clearButtonText="Clear"
                      isLoading={isLoading}
                      allowEditingUploadedText={false}
                      className="pf-v6-u-mb-md"
                    />
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem>
                          Upload a VDDK archive and build a VDDK init image from it.
                        </HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                    <ActionGroup className="pf-v6-u-mt-md">
                      <Button 
                        variant="primary" 
                        onClick={handleUpload}
                        isDisabled={!file}
                        isLoading={isLoading}
                      >
                        Upload
                      </Button>
                    </ActionGroup>
                  </FormGroup>
                </CardBody>
              </Card>
            )}

            <Radio
              id="url-option"
              name="vddk-option"
              value="url"
              label="Specify image URL (on your own)"
              isChecked={selectedOption === 'url'}
              onChange={onOptionChange}
              className="pf-v6-u-mt-lg"
            />

            {selectedOption === 'url' && (
              <Card className="pf-v6-u-ml-lg pf-v6-u-mt-md">
                <CardBody>
                  <FormGroup label="VDDK image URL">
                    <TextInput
                      id="vddk-image-url"
                      value={imageUrl}
                      onChange={(_event, value) => setImageUrl(value)}
                      placeholder="Enter VDDK image URL"
                    />
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem>
                          Specify the URL of your pre-built VDDK image.
                        </HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  </FormGroup>
                </CardBody>
              </Card>
            )}
          </FormGroup>
        </Form>
      </PageSection>
    </PageSection>
  );
};

export { VDDKSetup }; 