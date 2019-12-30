import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  public constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required]],
    });
  }

  public submit(): void {
    console.log(this.loginForm.value);
  }
}
