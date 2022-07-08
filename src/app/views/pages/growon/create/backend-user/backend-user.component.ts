import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { CreateservicesService } from '../services/createservices.service';
import Swal from 'sweetalert2';
import { defaultRoles } from '../../roles-permission/default-roles';

@Component({
  selector: 'kt-backend-user',
  templateUrl: './backend-user.component.html',
  styleUrls: ['./backend-user.component.scss']
})
export class BackendUserComponent implements OnInit {
  managementForm: FormGroup;
  gender: Array<string> = ['Male', 'Female'];
  teachingLevels: Array<string> = ['Pre-primary school', 'primary school', 'middle school', 'high school', 'college', 'graduation', 'masters'];
  maritalStatus: Array<string> = ['Married', 'Unmarried', 'Divorce', 'Widow', 'Widower'];
  yearOfPassing: Array<any> = [];
  randomPass: any = Math.random().toString(36).slice(-12);
  cities: Array<any> = ['Bangalore'];
  states: Array<any> = ['karnataka'];
  branches: Array<any> = [];
  countries: Array<any>;
  profilePicture: any;
  filePreview: any;
  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private apiService: CreateservicesService) { }

  ngOnInit(): void {
    this.managementForm = this._formBuilder.group({
      name: ['', Validators.required],
      contact: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      password: [this.randomPass, Validators.required],

      branch: ['', Validators.required],
      email: [''],
      address: [''],
      aadhaarNo: [''],
      bloodGroup: [''],
      religion: [''],
      cast: [''],
      motherTongue: [''],
      maritalStatus: [''],
      city: [''],
      state: [''],
      country: [''],
      pinCode: [''],
    })
    for (let i = 2000; i < 2021; i++) {
      this.yearOfPassing.push(i);
    }
    this.getCountries();
    this.getStates();
    this.getCities();
    this.getBranches();
  }
  getCountries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
    })
  }
  getStates() {
    this.apiService.getStates().subscribe((response: any) => {
      this.states = response.body.data;
    })
  }
  getCities() {
    this.apiService.getCities().subscribe((response: any) => {
      this.cities = response.body.data;
    })
  }
  getBranches() {
    this.apiService.getBranch(localStorage.getItem('schoolId')).subscribe((response: any) => {
      this.branches = response.body.data[0].branch;
    })
  }
  // onFileUpload
  onFileUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.filePreview = reader.result;
    reader.readAsDataURL(file);
    this.cdr.detectChanges();
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    this.apiService.uploadFile(formData).subscribe((response: any) => {
      if (response.status === 201) {
        this.profilePicture = response.body.message;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
        return;
      }
    });
  }
  createManagement() {
    const data = {
      'passport_image': this.profilePicture,
      'profile_type': defaultRoles.find(role => { return role.role_name == 'management' }).id,
      'school_id': localStorage.getItem('schoolId'),
      'branch_id': this.managementForm.controls.branch.value,
      'name': this.managementForm.controls.name.value,
      'mobile': this.managementForm.controls.contact.value,
      'gender': this.managementForm.controls.gender.value,
      'password': this.managementForm.controls.password.value,
      'qualification': '',
      'dob': new Date(this.managementForm.controls.dob.value).toLocaleDateString(),
      'email': this.managementForm.controls.email.value,
      'address': this.managementForm.controls.address.value,
      'aadhar_card': this.managementForm.controls.aadhaarNo.value,
      'blood_gr': this.managementForm.controls.bloodGroup.value,
      'religion': this.managementForm.controls.religion.value,
      'caste': this.managementForm.controls.cast.value,
      'mother_tounge': this.managementForm.controls.motherTongue.value,
      'marital_status': this.managementForm.controls.maritalStatus.value
    }
    this.apiService.signUp(data).subscribe((response: any) => {
      if (response.status == 201) {
        Swal.fire('Account Created', 'Account Created', 'success')
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    })
  }
}
