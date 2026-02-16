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
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

/** Storage type: provisioner for grouping; dataStoreName + vendor for source dropdown display */
interface StorageType {
  id: string;
  name: string;
  provisioner: string;
  /** Data store name shown in source storage dropdown */
  dataStoreName: string;
  /** Storage vendor shown as description in source storage dropdown */
  vendor: string;
}

const STORAGE_OPTIONS: StorageType[] = [
  { id: 'vsphere-csi-1', name: 'vSphere CSI (VMFS)', provisioner: 'csi.vsphere.vmware.com', dataStoreName: 'VMFS-SSD-01', vendor: 'VMware vSphere' },
  { id: 'vsphere-csi-2', name: 'vSphere CSI (vSAN)', provisioner: 'csi.vsphere.vmware.com', dataStoreName: 'vSAN-Datastore', vendor: 'VMware vSphere' },
  { id: 'vsphere-csi-3', name: 'vSphere CSI (NFS)', provisioner: 'csi.vsphere.vmware.com', dataStoreName: 'NFS-Export-01', vendor: 'VMware vSphere' },
  { id: 'ceph-rbd-1', name: 'Ceph RBD', provisioner: 'openshift-storage.rbd.csi.ceph.com', dataStoreName: 'ceph-rbd-pool-1', vendor: 'Red Hat Ceph Storage' },
  { id: 'ceph-rbd-2', name: 'Ceph RBD (replicated)', provisioner: 'openshift-storage.rbd.csi.ceph.com', dataStoreName: 'ceph-rbd-replicated', vendor: 'Red Hat Ceph Storage' },
  { id: 'ceph-fs-1', name: 'Ceph FS', provisioner: 'openshift-storage.cephfs.csi.ceph.com', dataStoreName: 'cephfs-volume-1', vendor: 'Red Hat Ceph Storage' },
  { id: 'odf-1', name: 'OpenShift Data Foundation (RBD)', provisioner: 'openshift-storage.rbd.csi.ceph.com', dataStoreName: 'odf-rbd-default', vendor: 'Red Hat OpenShift Data Foundation' },
  { id: 'odf-2', name: 'OpenShift Data Foundation (CephFS)', provisioner: 'openshift-storage.cephfs.csi.ceph.com', dataStoreName: 'odf-cephfs-default', vendor: 'Red Hat OpenShift Data Foundation' },
  { id: 'nfs-1', name: 'NFS (nfs-provisioner)', provisioner: 'openshift.org/nfs', dataStoreName: 'nfs-share-01', vendor: 'NFS' },
  { id: 'nfs-2', name: 'NFS (external)', provisioner: 'openshift.org/nfs', dataStoreName: 'external-nfs-storage', vendor: 'NFS' },
  { id: 'aws-ebs-1', name: 'AWS EBS', provisioner: 'ebs.csi.aws.com', dataStoreName: 'ebs-gp3-volume', vendor: 'Amazon Web Services' },
  { id: 'aws-ebs-2', name: 'AWS EBS (gp3)', provisioner: 'ebs.csi.aws.com', dataStoreName: 'ebs-gp3-fast', vendor: 'Amazon Web Services' },
];

function getStorageById(id: string | null): StorageType | null {
  if (!id) return null;
  return STORAGE_OPTIONS.find((s) => s.id === id) ?? null;
}

/** Build grouped options for a dropdown: recommended (same provisioner as the other selection) and other */
function getGroupedOptions(
  options: StorageType[],
  otherSelection: StorageType | null,
  selectedId: string | null
): { recommended: StorageType[]; other: StorageType[] } {
  if (!otherSelection) {
    return { recommended: [], other: options };
  }
  const recommended = options.filter((s) => s.provisioner === otherSelection.provisioner);
  const other = options.filter((s) => s.provisioner !== otherSelection.provisioner);
  return { recommended, other };
}

const StorageMappings: React.FunctionComponent = () => {
  const [sourceId, setSourceId] = React.useState<string | null>(null);
  const [targetId, setTargetId] = React.useState<string | null>(null);
  const [sourceOpen, setSourceOpen] = React.useState(false);
  const [targetOpen, setTargetOpen] = React.useState(false);

  const sourceStorage = getStorageById(sourceId);
  const targetStorage = getStorageById(targetId);

  const sourceGrouped = getGroupedOptions(STORAGE_OPTIONS, targetStorage, sourceId);
  const targetGrouped = getGroupedOptions(STORAGE_OPTIONS, sourceStorage, targetId);

  const sourceDisplay = sourceStorage ? sourceStorage.dataStoreName : 'Select source storage';
  const targetDisplay = targetStorage ? targetStorage.name : 'Select target storage';

  const handleClear = () => {
    setSourceId(null);
    setTargetId(null);
    setSourceOpen(false);
    setTargetOpen(false);
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Storage Mappings
      </Title>

      <Card className="pf-v6-u-mt-md" style={{ maxWidth: '900px' }}>
        <CardBody>
          <Form>
            <Flex direction={{ default: 'row' }} alignItems={{ default: 'alignItemsFlexEnd' }} flexWrap={{ default: 'wrap' }} gap={{ default: 'gapMd' }}>
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
                          <SelectGroup label="Recommended (same provisioner)">
                            <SelectList>
                              {sourceGrouped.recommended.map((s) => (
                                <SelectOption key={s.id} value={s.id} isSelected={sourceId === s.id} description={s.vendor}>
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
                                <SelectOption key={s.id} value={s.id} isSelected={sourceId === s.id} description={s.vendor}>
                                  {s.dataStoreName}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </SelectGroup>
                        )}
                      </>
                    ) : (
                      <SelectList>
                        {STORAGE_OPTIONS.map((s) => (
                          <SelectOption key={s.id} value={s.id} isSelected={sourceId === s.id} description={s.vendor}>
                            {s.dataStoreName}
                          </SelectOption>
                        ))}
                      </SelectList>
                    )}
                  </Select>
                  <FormHelperText>
                    {targetStorage
                      ? `Recommended options match the provisioner of the selected target: ${targetStorage.provisioner}`
                      : 'Select target storage first to see recommended source options, or choose any source.'}
                  </FormHelperText>
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
                          <SelectGroup label="Recommended (same provisioner)">
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
                        {STORAGE_OPTIONS.map((s) => (
                          <SelectOption key={s.id} value={s.id} isSelected={targetId === s.id}>
                            {s.name}
                          </SelectOption>
                        ))}
                      </SelectList>
                    )}
                  </Select>
                  <FormHelperText>
                    {sourceStorage
                      ? `Recommended options match the provisioner of the selected source: ${sourceStorage.provisioner}`
                      : 'Select source storage first to see recommended target options, or choose any target.'}
                  </FormHelperText>
                </FormGroup>
              </FlexItem>

              <FlexItem>
                <Button
                  variant="secondary"
                  icon={<TimesIcon />}
                  onClick={handleClear}
                  isDisabled={!sourceId && !targetId}
                  aria-label="Clear selections"
                >
                  Clear
                </Button>
              </FlexItem>
            </Flex>
          </Form>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { StorageMappings };
