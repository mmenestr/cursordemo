import * as React from 'react';
import {
  PageSection,
  Title,
  Form,
  FormGroup,
  FormHelperText,
  Card,
  CardBody,
  Select,
  SelectOption,
  SelectList,
  SelectGroup,
  MenuToggle,
  MenuToggleElement,
  Divider,
  Flex,
  FlexItem,
  Button,
  ExpandableSection,
  TextInput,
  Stack,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';

/** Source datastore option */
interface SourceDatastoreOption {
  id: string;
  dataStoreName: string;
  vendor: string;
}

/** Target storage class option */
interface TargetStorageClassOption {
  id: string;
  name: string;
  vendor: string;
}

const SOURCE_DATASTORE_OPTIONS: SourceDatastoreOption[] = [
  { id: 'datastore-iscsi-1', dataStoreName: 'datastore-iscsi-1', vendor: 'Pure flasharray' },
  { id: 'datastore-iscsi-2', dataStoreName: 'datastore-iscsi-2', vendor: 'Dell powerstore' },
  { id: 'datastore-fc-1', dataStoreName: 'datastore-fc-1', vendor: 'Hitachi Vantara' },
];

const TARGET_STORAGECLASS_OPTIONS: TargetStorageClassOption[] = [
  { id: 'fa-direct', name: 'fa-direct', vendor: 'Pure flasharray' },
  { id: 'csm-powerstore', name: 'csm-powerstore', vendor: 'Dell Powerstore' },
  { id: 'vantara-block', name: 'vantara-block', vendor: 'Hitachi Vantara' },
];

function getSourceById(id: string | null): SourceDatastoreOption | null {
  if (!id) return null;
  return SOURCE_DATASTORE_OPTIONS.find((s) => s.id === id) ?? null;
}

function getTargetById(id: string | null): TargetStorageClassOption | null {
  if (!id) return null;
  return TARGET_STORAGECLASS_OPTIONS.find((s) => s.id === id) ?? null;
}

/** Build grouped target options: recommended (same vendor as source) and other */
function getTargetGroupedOptions(
  source: SourceDatastoreOption | null
): { recommended: TargetStorageClassOption[]; other: TargetStorageClassOption[] } {
  if (!source) return { recommended: [], other: TARGET_STORAGECLASS_OPTIONS };
  const sourceVendorLower = source.vendor.toLowerCase();
  const recommended = TARGET_STORAGECLASS_OPTIONS.filter(
    (t) => t.vendor.toLowerCase() === sourceVendorLower
  );
  const other = TARGET_STORAGECLASS_OPTIONS.filter(
    (t) => t.vendor.toLowerCase() !== sourceVendorLower
  );
  return { recommended, other };
}

/** Build grouped source options: recommended (same vendor as target) and other */
function getSourceGroupedOptions(
  target: TargetStorageClassOption | null
): { recommended: SourceDatastoreOption[]; other: SourceDatastoreOption[] } {
  if (!target) return { recommended: [], other: SOURCE_DATASTORE_OPTIONS };
  const targetVendorLower = target.vendor.toLowerCase();
  const recommended = SOURCE_DATASTORE_OPTIONS.filter(
    (s) => s.vendor.toLowerCase() === targetVendorLower
  );
  const other = SOURCE_DATASTORE_OPTIONS.filter(
    (s) => s.vendor.toLowerCase() !== targetVendorLower
  );
  return { recommended, other };
}

const OFFLOAD_PLUGIN_OPTIONS = [{ id: 'vsphere-xcopy', name: 'vSphere XCOPY' }];

/** Option with optional keywords; recommended when datastore name contains any keyword (case-insensitive) */
interface OptionWithKeywords {
  id: string;
  name: string;
  keywords: string[];
}

const STORAGE_PRODUCT_OPTIONS: OptionWithKeywords[] = [
  { id: 'pure-flasharray', name: 'Pure flasharray', keywords: ['Pure', 'flasharray'] },
  { id: 'dell-powerstore', name: 'Dell PowerStore', keywords: ['Dell', 'powerstore'] },
  { id: 'hitachi-vantara', name: 'Hitachi Vantara', keywords: ['Hitachi', 'Vantara'] },
  { id: 'netapp-ontap', name: 'NetApp ONTAP', keywords: ['NetApp', 'ontap'] },
];

/** Split options into recommended (datastore name contains any keyword) and other */
function getKeywordGroupedOptions(
  options: OptionWithKeywords[],
  datastoreName: string | null
): { recommended: OptionWithKeywords[]; other: OptionWithKeywords[] } {
  if (!datastoreName || datastoreName.length === 0) {
    return { recommended: [], other: options };
  }
  const lower = datastoreName.toLowerCase();
  const recommended = options.filter((opt) =>
    opt.keywords.some((kw) => lower.includes(kw.toLowerCase()))
  );
  const other = options.filter(
    (opt) => !opt.keywords.some((kw) => lower.includes(kw.toLowerCase()))
  );
  return { recommended, other };
}

const StorageMappings: React.FunctionComponent = () => {
  const [sourceId, setSourceId] = React.useState<string | null>(null);
  const [targetId, setTargetId] = React.useState<string | null>(null);
  const [sourceOpen, setSourceOpen] = React.useState(false);
  const [targetOpen, setTargetOpen] = React.useState(false);
  const [offloadSectionExpanded, setOffloadSectionExpanded] = React.useState(false);
  const [offloadPluginId, setOffloadPluginId] = React.useState<string | null>(null);
  const [storageSecret, setStorageSecret] = React.useState('');
  const [storageProductId, setStorageProductId] = React.useState<string | null>(null);
  const [storageProductOpen, setStorageProductOpen] = React.useState(false);
  const [offloadPluginOpen, setOffloadPluginOpen] = React.useState(false);

  const sourceStorage = getSourceById(sourceId);
  const targetStorage = getTargetById(targetId);

  const sourceGrouped = getSourceGroupedOptions(targetStorage);
  const targetGrouped = getTargetGroupedOptions(sourceStorage);

  /** Use source vendor + datastore name for storage product recommendation (keyword match) */
  const recommendationContext = sourceStorage
    ? `${sourceStorage.vendor} ${sourceStorage.dataStoreName}`
    : null;
  const storageProductGrouped = getKeywordGroupedOptions(
    STORAGE_PRODUCT_OPTIONS,
    recommendationContext
  );

  const sourceDisplay = sourceStorage ? sourceStorage.dataStoreName : 'Select source storage';
  const targetDisplay = targetStorage ? targetStorage.name : 'Select target storage';

  const handleClear = () => {
    setSourceId(null);
    setTargetId(null);
    setSourceOpen(false);
    setTargetOpen(false);
  };

  const handleClearOffload = () => {
    setOffloadPluginId(null);
    setStorageSecret('');
    setStorageProductId(null);
    setOffloadPluginOpen(false);
    setStorageProductOpen(false);
  };

  const hasOffloadSelection = offloadPluginId || storageSecret.trim() !== '' || storageProductId;

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Storage Mappings
      </Title>

      <Card className="pf-v6-u-mt-md" style={{ maxWidth: '900px' }}>
        <CardBody>
          <Form>
            <Flex direction={{ default: 'row' }} alignItems={{ default: 'alignItemsFlexStart' }} flexWrap={{ default: 'wrap' }} gap={{ default: 'gapMd' }}>
              <FlexItem flex={{ default: 'flex_1', md: 'flex_1' }} style={{ minWidth: '200px' }}>
                <FormGroup label="Source storage" fieldId="source-storage" isRequired>
                  <Select
                    id="source-storage"
                    isOpen={sourceOpen}
                    selected={sourceId ?? undefined}
                    onSelect={(_event, value) => {
                      setSourceId(value as string);
                      setSourceOpen(false);
                    }}
                    onOpenChange={setSourceOpen}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setSourceOpen(!sourceOpen)}
                        isExpanded={sourceOpen}
                        style={{ width: '100%' }}
                      >
                        {sourceDisplay}
                      </MenuToggle>
                    )}
                    shouldFocusToggleOnSelect
                  >
                    {targetStorage ? (
                      <>
                        {sourceGrouped.recommended.length > 0 && (
                          <SelectGroup label="Recommended (same vendor)">
                            <SelectList>
                              {sourceGrouped.recommended.map((s) => (
                                <SelectOption key={s.id} value={s.id} isSelected={sourceId === s.id}>
                                  {s.dataStoreName}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </SelectGroup>
                        )}
                        {sourceGrouped.recommended.length > 0 && sourceGrouped.other.length > 0 && <Divider />}
                        {sourceGrouped.other.length > 0 && (
                          <SelectGroup label="Other options">
                            <SelectList>
                              {sourceGrouped.other.map((s) => (
                                <SelectOption key={s.id} value={s.id} isSelected={sourceId === s.id}>
                                  {s.dataStoreName}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </SelectGroup>
                        )}
                      </>
                    ) : (
                      <SelectList>
                        {SOURCE_DATASTORE_OPTIONS.map((s) => (
                          <SelectOption key={s.id} value={s.id} isSelected={sourceId === s.id}>
                            {s.dataStoreName}
                          </SelectOption>
                        ))}
                      </SelectList>
                    )}
                  </Select>
                  {targetStorage && (
                    <FormHelperText>
                      Recommended options match the vendor of the selected target storage.
                    </FormHelperText>
                  )}
                </FormGroup>
              </FlexItem>

              <FlexItem flex={{ default: 'flex_1', md: 'flex_1' }} style={{ minWidth: '200px' }}>
                <FormGroup label="Target storage" fieldId="target-storage" isRequired>
                  <Select
                    id="target-storage"
                    isOpen={targetOpen}
                    selected={targetId ?? undefined}
                    onSelect={(_event, value) => {
                      setTargetId(value as string);
                      setTargetOpen(false);
                    }}
                    onOpenChange={setTargetOpen}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setTargetOpen(!targetOpen)}
                        isExpanded={targetOpen}
                        style={{ width: '100%' }}
                      >
                        {targetDisplay}
                      </MenuToggle>
                    )}
                    shouldFocusToggleOnSelect
                  >
                    {sourceStorage ? (
                      <>
                        {targetGrouped.recommended.length > 0 && (
                          <SelectGroup label="Recommended (same vendor)">
                            <SelectList>
                              {targetGrouped.recommended.map((s) => (
                                <SelectOption key={s.id} value={s.id} isSelected={targetId === s.id}>
                                  {s.name}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </SelectGroup>
                        )}
                        {targetGrouped.recommended.length > 0 && targetGrouped.other.length > 0 && <Divider />}
                        {targetGrouped.other.length > 0 && (
                          <SelectGroup label="Other options">
                            <SelectList>
                              {targetGrouped.other.map((s) => (
                                <SelectOption key={s.id} value={s.id} isSelected={targetId === s.id}>
                                  {s.name}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </SelectGroup>
                        )}
                      </>
                    ) : (
                      <SelectList>
                        {TARGET_STORAGECLASS_OPTIONS.map((s) => (
                          <SelectOption key={s.id} value={s.id} isSelected={targetId === s.id}>
                            {s.name}
                          </SelectOption>
                        ))}
                      </SelectList>
                    )}
                  </Select>
                  {sourceStorage && (
                    <FormHelperText>
                      Recommended options match the vendor of the selected source storage.
                    </FormHelperText>
                  )}
                </FormGroup>
              </FlexItem>

              <FlexItem>
                <Button
                  variant="plain"
                  icon={<MinusCircleIcon />}
                  onClick={handleClear}
                  isDisabled={!sourceId && !targetId}
                  aria-label="Clear source and target selections"
                />
              </FlexItem>
            </Flex>

            <div className="pf-v6-u-mt-lg">
              <ExpandableSection
                toggleContent={
                  <>
                    <span>Offload options (optional)</span>
                    <Button
                      variant="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearOffload();
                      }}
                      isDisabled={!hasOffloadSelection}
                      aria-label="Clear offload options"
                      className="pf-v6-u-ml-sm"
                    >
                      Clear
                    </Button>
                  </>
                }
                isExpanded={offloadSectionExpanded}
                onToggle={(_event, expanded) => setOffloadSectionExpanded(expanded)}
              >
                <Stack hasGutter className="pf-v6-u-mt-md">
                <FormGroup label="Offload plugin" fieldId="offload-plugin">
                  <Select
                    id="offload-plugin"
                    isOpen={offloadPluginOpen}
                    selected={offloadPluginId ?? undefined}
                    onSelect={(_event, value) => {
                      setOffloadPluginId(value as string);
                      setOffloadPluginOpen(false);
                    }}
                    onOpenChange={setOffloadPluginOpen}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setOffloadPluginOpen(!offloadPluginOpen)}
                        isExpanded={offloadPluginOpen}
                        style={{ width: '100%' }}
                      >
                        {offloadPluginId
                          ? OFFLOAD_PLUGIN_OPTIONS.find((o) => o.id === offloadPluginId)?.name ?? 'Select'
                          : 'Select offload plugin'}
                      </MenuToggle>
                    )}
                    shouldFocusToggleOnSelect
                  >
                    <SelectList>
                      {OFFLOAD_PLUGIN_OPTIONS.map((o) => (
                        <SelectOption key={o.id} value={o.id} isSelected={offloadPluginId === o.id}>
                          {o.name}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                </FormGroup>

                <FormGroup label="Storage secret" fieldId="storage-secret">
                  <TextInput
                    id="storage-secret"
                    type="text"
                    value={storageSecret}
                    onChange={(_event, value) => setStorageSecret(value ?? '')}
                    placeholder="Enter storage secret name"
                    aria-label="Storage secret"
                  />
                </FormGroup>

                <FormGroup label="Storage product" fieldId="storage-product">
                  <Select
                    id="storage-product"
                    isOpen={storageProductOpen}
                    selected={storageProductId ?? undefined}
                    onSelect={(_event, value) => {
                      setStorageProductId(value as string);
                      setStorageProductOpen(false);
                    }}
                    onOpenChange={setStorageProductOpen}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setStorageProductOpen(!storageProductOpen)}
                        isExpanded={storageProductOpen}
                        style={{ width: '100%' }}
                      >
                        {storageProductId
                          ? STORAGE_PRODUCT_OPTIONS.find((o) => o.id === storageProductId)?.name ?? 'Select'
                          : 'Select storage product'}
                      </MenuToggle>
                    )}
                    shouldFocusToggleOnSelect
                  >
                    {recommendationContext ? (
                      <>
                        {storageProductGrouped.recommended.length > 0 && (
                          <SelectGroup label="Recommended">
                            <SelectList>
                              {storageProductGrouped.recommended.map((o) => (
                                <SelectOption key={o.id} value={o.id} isSelected={storageProductId === o.id}>
                                  {o.name}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </SelectGroup>
                        )}
                        {storageProductGrouped.recommended.length > 0 && storageProductGrouped.other.length > 0 && <Divider />}
                        {storageProductGrouped.other.length > 0 && (
                          <SelectGroup label="Other options">
                            <SelectList>
                              {storageProductGrouped.other.map((o) => (
                                <SelectOption key={o.id} value={o.id} isSelected={storageProductId === o.id}>
                                  {o.name}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </SelectGroup>
                        )}
                      </>
                    ) : (
                      <SelectList>
                        {STORAGE_PRODUCT_OPTIONS.map((o) => (
                          <SelectOption key={o.id} value={o.id} isSelected={storageProductId === o.id}>
                            {o.name}
                          </SelectOption>
                        ))}
                      </SelectList>
                    )}
                  </Select>
                  <FormHelperText>
                    {recommendationContext
                      ? 'Recommended options are based on the selected source datastore vendor.'
                      : 'Select source datastore to see recommended storage products.'}
                  </FormHelperText>
                </FormGroup>
                </Stack>
              </ExpandableSection>
            </div>
          </Form>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { StorageMappings };
