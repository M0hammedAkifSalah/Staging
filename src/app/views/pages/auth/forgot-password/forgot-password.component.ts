// Angular
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthService } from "../auth.service";
// Swal
import Swal from "sweetalert2";

@Component({
  selector: "kt-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  // Public params
  forgotPasswordForm: FormGroup;
  userName = "";
  loading = false;
  formSubmitted = false;
  isForgotPassPage = true;
  errors: any = [];
  otp = "";
  password = "";
  retypePass = "";
  schoolId = 0;

  private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(private route: Router, private auth: AuthService, private cdr:ChangeDetectorRef) {
    this.unsubscribe = new Subject();
    this.userName = localStorage.getItem("user");
    this.schoolId = Number(localStorage.getItem("schoolCode"));
  }

  ngOnInit() {
    if (this.route.url && this.route.url.includes("forgot-password")) {
      this.isForgotPassPage = true;
    } else if (this.route.url && this.route.url.includes("reset-password")) {
      this.isForgotPassPage = false;
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
    if (!this.isForgotPassPage) {
      localStorage.removeItem("otp-validated");
      localStorage.removeItem("forgot-pass");
      localStorage.removeItem("user");
    }
  }

  resendOTP() {
    this.loading = true;
    this.auth
      .getOrValidateOTP({
        mobile: Number(this.userName),
        username: this.userName,
        profile_type: "teacher",
        type: "send",
      })
      .subscribe(
        (res) => {
          if (res.body["message"]["message"]) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: res.body["message"]["message"],
            });
            this.route.navigate(["/auth/forgot-password"]);
          }
          this.loading = false;
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error sending OTP",
          });
          this.loading = false;
        }
      );
  }

  forgotPassSubmit() {
    this.formSubmitted = true;
    if (this.otp) {
      //call api to validate otp
      this.loading = true;
      this.auth
        .getOrValidateOTP({
          mobile: this.userName,
          type: "verify",
          otp: this.otp,
        })
        .subscribe(
          (res) => {
            if (res.body && res.body["verification"]) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: res.body["verification"],
              });
              //if Success
              localStorage.setItem("otp-validated", "true");
              this.route.navigate(["/auth/reset-password"]);
            } else if (res.body && res.body["error"]) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res.body["error"],
              });
            }
            this.loading = false;
          },
          (err) => {
            this.loading = false;
          }
        );
    }
  }

  resetPasswordSubmit() {
   
    if (this.password === this.retypePass) {
      let obj = {
        password: this.password,
        username: this.userName,
      };
      if (this.schoolId) {
        obj["school_code"] = this.schoolId;
      }
      this.auth.resetPassword(obj).subscribe(
        (response: any) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: response.body["status"],
          });
          localStorage.removeItem("otp-validated");
          this.route.navigate(['/auth/login']);
        }
      )
    } else {
      this.formSubmitted = true;
      return;
    }
  }
}
