export type DocumentCategory =
  | 'lab-report'
  | 'imaging-report'
  | 'prescription'
  | 'insurance'
  | 'certificate'
  | 'vaccination'
  | 'personal';

export type FileType = 'pdf' | 'jpg' | 'png' | 'doc' | 'dicom' | 'zip';

export type DocumentStatus =
  | 'reviewed'
  | 'active'
  | 'pending'
  | 'completed'
  | 'expired'
  | 'valid';

export interface DocumentTag {
  id: string;
  label: string;
  color: string;
}

export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  pages?: number;
  category: DocumentCategory;
  categoryLabel: string;
  categoryColor: string;
  date: string;
  issuedBy: string;
  orderedBy?: string;
  contains?: string;
  status: DocumentStatus;
  statusLabel: string;
  nabidh?: boolean;
  tags?: DocumentTag[];
  isNew?: boolean;
  daysAgo?: number;
  dhaRef?: string;
  validUntil?: string;
  daysRemaining?: number;
  refills?: number;
  privacyLevel?: 'standard' | 'sensitive';
  uploadedBy?: string;
  note?: string;
  language?: string;
}

export interface DocumentStats {
  totalDocuments: number;
  newThisMonth: number;
  needsAction: number;
  storageUsedMB: number;
  storageTotalMB: number;
  storagePercent: number;
}

export interface CategorySection {
  id: DocumentCategory;
  label: string;
  icon: string;
  color: string;
  count: number;
  documents: Document[];
  collapsed?: boolean;
}

export interface UploadFormData {
  file: File | null;
  name: string;
  category: DocumentCategory;
  date: string;
  issuedBy: string;
  orderedBy?: string;
  notes?: string;
  tags: string[];
  privacyLevel: 'standard' | 'sensitive';
}

export interface ShareOption {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}
