import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DispatchService } from '@shared';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit, OnDestroy{

  route$: Subscription;
  contactNumber: any;
  newRequestForm: any;

  constructor(private readonly formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private readonly dispatchService: DispatchService) { }

  ngOnInit(): void {
    this.route$ = this.route.queryParams
    .subscribe(params => {
      this.contactNumber = params.number;
    });

    // check number , if then auto fill

    this.newRequestForm = this.formBuilder.group({
      contactNumber: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fullName: [],
      mailingAddress: ['', Validators.required],
      email: ['', Validators.required],
      birthday: [''],
      sex: ['', Validators.required],
      requesterPhoto: [''],
      requesterPhotoUrl: [],
    })

    this.newRequestForm.controls.contactNumber.setValue(this.contactNumber)

  }

  submitNewRequest() {
    // if (this.newRequestForm.dirty && this.newRequestForm.valid) {
    //   // if new make new requester and request else request only
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
