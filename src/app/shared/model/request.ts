export class Request {
  static modelName = 'request'
  static collectionName = 'request';
  static prefix = 'RQT';

  requestID: string; // Auto Gen

  // requester details
  requesterID: string;
  fullName: string;

  // requests details
  patientName: string;
  hospitalName: string;
  patientDiagnosis: string;
  patientBloodType: string;
  patientBloodComponent: string;
  patientBloodUnits: number;
  patientDiagnosisPhotoUrl: string;

  dateRequested: Date;
  status: string; // Dispatch Created, Approved, Denied, For Approval

  isOrdered: boolean;
  isApproved: boolean;
  isArchived: boolean;
  num: number;

  dateCreated: Date;
  dateLastModified: Date;
  createdBy: string;
  lastModifiedBy: string;
}
