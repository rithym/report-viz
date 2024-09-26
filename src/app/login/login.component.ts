import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  hide = true;
  firstLogin!:boolean;
  step: any = 1;
  email: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    // private aclService : AclService
  ) {
    this.createForm();
  }

  ngOnInit() {
    localStorage.removeItem('token');
  }

  ngOnDestroy() {}

  //LOGIN FORM CREATION
  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
        ],
      ]
    });
  }

  //LOGIN FUNCTION AFTER CLICK ON SIGN IN
  login() {
    if (!this.loginForm.valid) {
      return;
    }
    else{      
      this.router.navigate(['/report'])
      console.log('this.loginForm.value: ', this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          // console.log('Response from server:', response);
          // console.log("Token from get method",this.authService.getToken())
        },
        (error) => {
          console.error('Error:', error);
          alert(error.error)
        }
      )
      
    }
    }
//Forgot Password
resetPassword(){
  if(this.loginForm.get('email')?.hasError('required') || this.loginForm.get('email')?.hasError('email') || this.loginForm.get('organization')?.hasError('required') || this.loginForm.get('organization')?.hasError('minlength') || this.loginForm.get('organization')?.hasError('maxlength')){
    return;
  } 
  else{
    
    console.log('email',this.loginForm.get('email')?.value,this.loginForm.get('organization')?.value);
  }
  }

linkSent(){
    this.step = 1;
}
    public hasError = (controlName: string, errorName: string) => {
      return this.loginForm.controls[controlName].hasError(errorName);
};
    keydown(event:any) { 
      console.log('event is',event);
      event.preventDefault()
      if(this.step == 1){
        this.login();
      }
      else if(this.step == 1){
        this.resetPassword();
      }
   } 
  }



