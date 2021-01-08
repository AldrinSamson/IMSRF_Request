import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DispatchService } from '@shared';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss']
})
export class ViewRequestComponent implements OnInit {

  route$: Subscription;
  contactNumber: any;
  validationCode: any;
  patientDetailsForm: any;
  status: any;

  constructor(private readonly formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private readonly dispatchService: DispatchService) { }

  ngOnInit(): void {
    this.route$ = this.route.queryParams
    .subscribe(params => {
      this.contactNumber = params.number;
      this.validationCode = params.code;
      this.status = params.status;
    });

    this.getRequestData();

    this.patientDetailsForm = this.formBuilder.group({
      patientName: ['', Validators.required],
      hospitalName: ['', Validators.required],
      patientDiagnosis: ['', Validators.required],
      patientBloodType: ['', Validators.required],
      patientBloodComponent: ['', Validators.required],
      patientBloodUnits: ['', Validators.required],
      patientDiagnosisPhoto: [''],
      patientDiagnosisPhotoUrl: [''],
    })

  }

  getRequestData() {

    // query
    if ( this.status === 'Denied') {
      //show denied status
    }
    else if ( this.status === 'Validated' ) {
      // fill patient form
    }
    else if ( this.status === 'Active' || 'Delivered') {
      // show request
    }
    else if ( this.status === 'Order Created') {
      // query orders . show order
    }
  }

  submitUpdateRequest() {
    // if (this.patientDetailsForm.dirty && this.patientDetailsForm.valid) {
    //   // update request
    //
    // }
    this.router.navigate(['/landing']);
  }

  ngOnDestroy() {
    if (this.route$ != null) {
      this.route$.unsubscribe();
    }
  }

}
