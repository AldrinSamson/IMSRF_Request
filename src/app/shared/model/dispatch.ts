export class RequestDispatch {
  static modelName = 'requestBlood'
  static collectionName = 'requestBlood';
  static prefix = 'RQT';

  requestID: string; // Auto Gen

  requesterID: string;
  contactNumber: string;

  // requests details
  validationCode: string;

  patientName: string;
  hospitalName: string;
  patientDiagnosis: string;
  patientBloodType: string;
  patientBloodComponent: string;
  patientBloodUnits: number;
  patientDiagnosisPhotoUrl: string;

  dateRequested: Date;
  status: string; // Unvalidated, Requested, Order Created

  isValidated: boolean;
  isOrdered: boolean;
  isArchived: boolean;
  num: number;

  dateCreated: Date;
  dateLastModified: Date;
  createdBy: string;
  lastModifiedBy: string;
}
