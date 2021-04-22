import { Router, NavigationEnd, NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { Component, OnInit, Input,  OnDestroy,  ViewChild, ElementRef} from '@angular/core';
import { DispatchService, AlertService, RequesterService, StorageService, UtilService, Sexes, AuthService, Requester } from '@shared';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Observable, Subscription, Subject, merge, EMPTY } from 'rxjs';
import {debounceTime, distinctUntilChanged, map, filter, catchError, takeUntil} from 'rxjs/operators';
import { NgbActiveModal, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { MEDIA_STORAGE_PATH_IMG , DEFAULT_PROFILE_PIC } from '../../storage.config';
import { FixedScaleAxis } from 'chartist';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'new-request-dialog',
  templateUrl: './dialog/new-request.html',
  styleUrls: ['./main.component.scss'],
})
export class NewRequestComponent implements OnInit, OnDestroy{
  addForm: any;

  destroy$: Subject<null> = new Subject();
  fileToUpload1: File;
  patientDiagnosisPhoto: string | ArrayBuffer;
  submitted = false;
  uploadProgress1$: Observable<number>;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly activeModal: NgbActiveModal,
    private readonly dispatchService: DispatchService,
    private readonly storageService: StorageService,
    private readonly utilService: UtilService,
    private readonly alertService: AlertService) {
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      patientName: ['', Validators.required],
      hospitalName: ['', Validators.required],
      patientDiagnosis: ['', Validators.required],
      patientBloodType: ['', Validators.required],
      patientBloodComponent: ['', Validators.required],
      patientBloodUnits: ['', Validators.required],
      patientDiagnosisPhoto: ['', [ this.image.bind(this)]],
      patientDiagnosisPhotoUrl: [''],
    });

    this.addForm
      .get('patientDiagnosisPhoto')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((newValue) => {
        const {reader , img} = this.handleFileChange(newValue.files)
        this.fileToUpload1 = img;
        reader.onload = (loadEvent) => (this.patientDiagnosisPhoto = loadEvent.target.result);
      });
  }

  async asyncUpload (downloadUrl$) {
    return new Promise(
      (resolve, reject) => {
        downloadUrl$
        .pipe(
          takeUntil(this.destroy$),
          catchError((error) => {
            this.alertService.showToaster(`${error.message}` , { classname: 'bg-warning text-light', delay: 10000 });
            return EMPTY;
          }),
        )
        .subscribe(async (downloadUrl) => {
          this.submitted = false;
          resolve(downloadUrl)
        });
      });
  }

  addRequest() {
    this.submitted = true;
    const mediaFolderPath = `${MEDIA_STORAGE_PATH_IMG}`;
    const { downloadUrl$: downloadUrl1$, uploadProgress$: uploadProgress1$ } = this.storageService.uploadFileAndGetMetadata(
      mediaFolderPath, this.fileToUpload1);
    this.uploadProgress1$ = uploadProgress1$;
    this.asyncUpload(downloadUrl1$).then( res => {
      this.addForm.controls.patientDiagnosisPhotoUrl.setValue(res);
      this.submitted = true;
      this.dispatchService.createRequest(this.addForm.value);
      this.activeModal.close();
    })
  }

  handleFileChange([img]) {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    return {reader , img}
  }

  ngOnDestroy() {
    this.destroy$.next(null);
  }

  // Move to Validators
  private image(photoControl: AbstractControl): { [key: string]: boolean } | null {
    if (photoControl.value) {
      const [img] = photoControl.value.files;
      return this.utilService.validateFile(img)
        ? null
        : {
            image: true,
          };
    }
    return;
  }

}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'view-request-dialog',
  templateUrl: './dialog/view-request.html',
  styleUrls: ['./main.component.scss'],
})
export class ViewRequestComponent implements OnInit{
  editForm: any;
  @Input() value;
  isDisabled = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly activeModal: NgbActiveModal,
    private readonly dispatchService: DispatchService) {
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      requestID:[this.value.requestID],
      patientName: [this.value.patientName, Validators.required],
      hospitalName: [this.value.hospitalName, Validators.required],
      patientDiagnosis: [this.value.patientDiagnosis, Validators.required],
      patientBloodType: [this.value.patientBloodType, Validators.required],
      patientBloodComponent: [this.value.patientBloodComponent, Validators.required],
      patientBloodUnits:[this.value.patientBloodUnits, Validators.required],
    });
    if (this.value.status !== 'For Approval') {
      this.editForm.disable();
    }
  }

  editRequest() {
    this.dispatchService.updateRequest(this.value.id,this.editForm.value)
    this.activeModal.close();
  }

  deleteRequest() {
   this.dispatchService.archiveRequest(this.value.id);
   this.activeModal.close();
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'view-dispatch-dialog',
  templateUrl: './dialog/view-dispatch.html',
  styleUrls: ['./main.component.scss'],
})
export class ViewDispatchComponent implements OnInit{
  p;
  editForm: any;
  @Input() value;
  @ViewChild('orderData') htmlData:ElementRef;
  inventory$: Observable<any>;
  loadInventory = true;
  orderQuantity;
  orderItems = [];
  isHidden = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly activeModal: NgbActiveModal,
    private readonly modalService: NgbModal,
    ) {
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      dispatchID: [this.value.dispatchID],
      requestID:[this.value.requestID],
      partnerID: [],
      institutionName: [],
      orderItems: [],
    });
    this.orderItems = this.value.orderItems
  }

  openNewFeedback() {
    const modalRef = this.modalService.open(FeedbackComponent,{centered: true, scrollable: true, backdrop: 'static'});
    modalRef.componentInstance.value = this.value;
    modalRef.result.then((data) => {
      this.activeModal.close();
    }, (reason) => {
      // on dismiss
    });
  }

  public openPDF():void {
    let DATA = document.getElementById('orderData');
      
    html2canvas(DATA).then(canvas => {
        
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        
        const FILEURI = canvas.toDataURL('image/png')
        let PDF = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: 'a4',
        });
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
        
        PDF.save(this.value.dispatchID+'.pdf');
    });     
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'feedback-dispatch-dialog',
  templateUrl: './dialog/feedback-dispatch.html',
  styleUrls: ['./main.component.scss'],
})
export class FeedbackComponent implements OnInit{
  p;
  feedbackForm: any;
  @Input() value;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly activeModal: NgbActiveModal,
    private readonly dispatchService: DispatchService,
    ) {
  }

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      requestID:[this.value.requestID],
      feedback: [],
    });
  }

  feedbackDispatch(){
    this.dispatchService.updateFeedback(this.value.id , this.feedbackForm.value)
    this.activeModal.close();
  }

}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  showSidebar: boolean = true;
  showNavbar: boolean = true;
  showFooter: boolean = true;
  isLoading: boolean;
  p1;
  p2;
  searchtext1;
  searchtext2;

  request$: Observable<any>;
  dispatch$: Observable<any>;
  userDetails = JSON.parse(sessionStorage.getItem('session-user-details'));


  constructor(private router: Router,
    private readonly modalService: NgbModal,
    private readonly dispatchService: DispatchService,) {
    // Spinner for lazyload modules
    router.events.forEach((event) => {
      if (event instanceof RouteConfigLoadStart) {
          this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.isLoading = false;
      }
    });
  }

  ngOnInit() {
    // Scroll to top after route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    this.getData();
  }


  getData(){
    this.request$ = this.dispatchService.getAllRequestofRequester();
    this.dispatch$ = this.dispatchService.getAllDispatchofRequester();
  }

  trackByFn(index) {
    return index;
  }

  openNewRequest() {
    const modalRef = this.modalService.open(NewRequestComponent,{centered: true, scrollable: true, backdrop: 'static'});
  }

  openViewRequest(value) {
    const modalRef = this.modalService.open(ViewRequestComponent,{centered: true, scrollable: true, backdrop: 'static'});
    modalRef.componentInstance.value = value;
  }

  openViewOrder(value){
    const modalRef = this.modalService.open(ViewDispatchComponent,{centered: true, scrollable: true, backdrop: 'static'});
    modalRef.componentInstance.value = value;
  }
}
