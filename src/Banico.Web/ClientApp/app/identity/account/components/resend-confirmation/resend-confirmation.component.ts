import {finalize} from 'rxjs/operators';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AccountService } from '../../main/account.service';
 
@Component({
  selector: 'app-resend-confirmation',
  templateUrl: './resend-confirmation.component.html',
  styleUrls: []
})
export class ResendConfirmationComponent {
  public isRequesting: boolean = false;
  public isSuccessful: boolean = false;
  public errors: string;  

  public resendConfirmationForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
  });

  constructor(
    private accountService: AccountService,
    private router: Router,
    private fb: FormBuilder
  ) { }
  
  public resendConfirmation() {
    this.isRequesting = true;
    this.accountService.resendConfirmation(
      this.resendConfirmationForm.value['email']
    ).pipe(
    finalize(() => this.isRequesting = false))
    .subscribe(
      result  => {
        if (result) {
          this.isSuccessful = true;                         
        }
      },
      errors =>  {
        this.errors = errors;
      });
  }
}