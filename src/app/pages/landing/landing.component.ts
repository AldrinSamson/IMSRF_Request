import { Component, OnInit, Input,OnDestroy} from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService, ValidationService, Sexes,
  RequesterService, AlertService, StorageService, UtilService, } from '@shared';
  import { Observable,Subject, EMPTY } from 'rxjs';
import {catchError, takeUntil} from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { MEDIA_STORAGE_PATH_IMG } from '../../storage.config';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'new-requester-dialog',
  templateUrl: './dialog/new-requester.html',
  styleUrls: ['./landing.component.scss']
})
export class NewRequesterComponent implements OnInit, OnDestroy{
  addForm: any;
  sexes = Sexes.sexes;

  dateObject: NgbDateStruct;
  date: {year: number, month: number};

  destroy$: Subject<null> = new Subject();
  fileToUpload1: File;
  requesterPhoto: string | ArrayBuffer;
  submitted = false;
  uploadProgress1$: Observable<number>;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly activeModal: NgbActiveModal,
    private readonly requesterService: RequesterService,
    private readonly storageService: StorageService,
    private readonly utilService: UtilService,
    private readonly alertService: AlertService) {
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fullName: [],
      mailingAddress: ['', Validators.required],
      email: ['', Validators.required],
      contactNumber: ['', Validators.required],
      password: ['', [Validators.required,ValidationService.passwordValidator]],
      birthday: [this.dateObject],
      sex: ['', Validators.required],
      requesterPhoto: ['', [ this.image.bind(this)]],
      requesterPhotoUrl: [],
    });

    this.addForm
      .get('requesterPhoto')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((newValue) => {
        const {reader , img} = this.handleFileChange(newValue.files)
        this.fileToUpload1 = img;
        reader.onload = (loadEvent) => (this.requesterPhoto = loadEvent.target.result);
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

  addRequester() {
    this.addForm.controls.fullName.setValue(this.addForm.value.firstName + ' ' + this.addForm.value.lastName)
    this.addForm.controls.birthday.setValue(new Date(this.addForm.value.birthday.year,
      this.addForm.value.birthday.month - 1, this.addForm.value.birthday.day));

    this.submitted = true;
    const mediaFolderPath = `${MEDIA_STORAGE_PATH_IMG}`;
    const { downloadUrl$: downloadUrl1$, uploadProgress$: uploadProgress1$ } = this.storageService.uploadFileAndGetMetadata(
      mediaFolderPath, this.fileToUpload1);
    this.uploadProgress1$ = uploadProgress1$;
    this.asyncUpload(downloadUrl1$).then( res => {
      this.addForm.controls.requesterPhotoUrl.setValue(res);
      this.submitted = true;
      this.requesterService.addOne(this.addForm.value);
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
  // tslint:disable-next-line:component-selector
  selector : 'forgot-password',
  templateUrl : './dialog/forgot-password.html',
  styleUrls: ['./landing.component.scss'],
})

export class PasswordResetDialogComponent implements OnInit{

  @Input() value;
  email = '';

  constructor(
    public readonly activeModal: NgbActiveModal,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.email = this.value
  }

  sendResetEmail() {
    this.authService.sendUserPasswordResetEmailForgot(this.email);
    this.activeModal.close();
  }
}
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  loginForm: any;

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private readonly modalService: NgbModal,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required,ValidationService.passwordValidator]]
    });
  }

  login() {
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).then(() => {
      });
    }
  }

  openNewRequester() {
    this.modalService.open(NewRequesterComponent,{centered: true, scrollable: true, backdrop: 'static'});
  }

  openForgotPassword() {
    const modalRef = this.modalService.open(PasswordResetDialogComponent,{centered: true, scrollable: true, backdrop: 'static'});
    modalRef.componentInstance.value = this.loginForm.value.email;
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

}
