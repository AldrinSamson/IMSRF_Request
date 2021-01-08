import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DispatchService } from '@shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'new-request-dialog',
  templateUrl: './dialog/new-request.html',
  styleUrls: ['./landing.component.scss'],
})

export class NewRequestDialogComponent {

  newRequestForm: any;

  constructor(
    public readonly activeModal: NgbActiveModal,
    private readonly formBuilder: FormBuilder,
    private router: Router) {
      this.newRequestForm = this.formBuilder.group({
        contactNumber: ['']
      })
  }

  submit() {
    if (this.newRequestForm.dirty && this.newRequestForm.valid) {
      this.router.navigate(['newRequest'], { queryParams: { number: this.newRequestForm.value.contactNumber } });
      this.activeModal.close();
    }
  }
}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'validated-request-dialog',
  templateUrl: './dialog/validated-request.html',
  styleUrls: ['./landing.component.scss'],
})

export class ViewRequestDialogComponent {

  validatedRequestForm: any;

  constructor(
    public readonly activeModal: NgbActiveModal,
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private readonly dispatchService: DispatchService) {
      this.validatedRequestForm = this.formBuilder.group({
        contactNumber: [''],
        validationCode: ['']
      })
  }

  submit() {
    // run validation
    if (this.validatedRequestForm.dirty && this.validatedRequestForm.valid) {
      this.router.navigate(['viewRequest'], { queryParams: { number: this.validatedRequestForm.value.contactNumber,
        code: this.validatedRequestForm.value.validationCode, status: 'validated'} });
      this.activeModal.close();
    }
  }
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {



  constructor(
    private readonly modalService: NgbModal,
  ) {
  }

  openNewRequest() {
    this.modalService.open(NewRequestDialogComponent,{centered: true, scrollable: true, backdrop: 'static'});
  }

  openValidatedRequest() {
    this.modalService.open(ViewRequestDialogComponent,{centered: true, scrollable: true, backdrop: 'static'});
  }


}
