import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { environment } from './../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { OKResponseI } from 'src/app/interfaces/responses';
import { IUserRespond } from 'src/app/interfaces/user';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
})
export class AddFormComponent implements OnInit {
  delay: number = 1
  milliseconds: number = 1000
  userForm = this.fb.group({
    name: this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(40)]],
      lastName: ['', [Validators.required, Validators.maxLength(40)]],
    }),
    age: [null, [Validators.required, Validators.maxLength(3)]],
    gender: ['', Validators.required],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(60)],
    ],
    username: ['', Validators.maxLength(30)],
    isWorkNow: [false],
    company: this.fb.group({
      name: ['', Validators.maxLength(18)],
      years: [null , Validators.maxLength(40)],
    }),
  });

  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  stringify(value: IUserRespond): string {
    return JSON.stringify(value);
  }

  ngOnInit(): void {}

  onSubmit() {
    const url = `${environment.URL_BASE}${environment.URL_ENDPOINT}`;
    const formState: IUserRespond = this.userForm.value
    this.http.post(url, this.stringify(formState)).subscribe(
      (data: OKResponseI) => {
        const { result, message } = data
        this.toastr.success(message, result)
      },
      (err: OKResponseI) => {
        const { result, message } = err
        this.toastr.error(message, result)
      },
      () => {
        this.userForm.reset()
        setTimeout(() => {
          window.location.reload()
        }, this.delay * this.milliseconds)
      }
    );
  }
}
