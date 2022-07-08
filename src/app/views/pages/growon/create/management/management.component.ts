// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { CreateservicesService } from '../services/createservices.service';
import Swal from 'sweetalert2';
import { defaultRoles } from '../../roles-permission/default-roles';
import { LoadingService } from '../../../loader/loading/loading.service';

@Component({
  selector: 'kt-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {
  managementForm: FormGroup;
  authorized: string[] = ['Yes', 'No'];
  isAuthorized:any=false;
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
  c: Array<any>;
  userExistFlag: boolean = false;
  schoolId: any;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private apiService: CreateservicesService,
    private loaderService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.managementForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      contact: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(15), Validators.required]],
      gender: ['', Validators.required],
      authorized : [],
      dob: [''],
      password: [this.randomPass, Validators.required],
      branch: [null, Validators.required],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      address: ['', [Validators.maxLength(150)]],
      aadhaarNo: ['', [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
      bloodGroup: [''],
      religion: [''],
      caste: [''],
      motherTongue: [''],
      maritalStatus: [''],
      city: [null],
      state: [null],
      country: [null],
      pinCode: ['', [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
    })
    for (let i = 2000; i < 2021; i++) {
      this.yearOfPassing.push(i);
    }
    this.getCountries();
    this.getStates();
    this.getCities();
    this.getBranches();
    this.getAdmin();
    console.log(this.managementForm, "form")
  }

  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;
    if (user.user_info[0].profile_type.role_name == 'school_admin' || user.user_info[0].profile_type.role_name == 'teacher'
      || user.user_info[0].profile_type.role_name == 'principal' || user.user_info[0].profile_type.role_name == 'management') {

      this.schoolId = user.user_info[0].school_id;
    }
    else if (localStorage.getItem('schoolId')) {
      this.schoolId = user.user_info[0].school_id;
    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {

        this.schoolId = user.user_info[0].repository[0].id
      } else {

        this.schoolId = user.user_info[0]._id
      }
      // this.schoolId = user.user_info[0].id
    }
  }

  checkAlreadyExist(value) {
    this.loaderService.show();
    this.userExistFlag = false;
    if (value) {
      let obj = {
        school_id: this.schoolId,
        mobile: value,
        type: 'principal'
      }
      this.apiService.checkUserExist(obj).subscribe(
        (response: any) => {
          if (response && response.body) {
            if (response.body.flag) {
              this.userExistFlag = true;
              this.loaderService.hide();
            }
            else {
              this.userExistFlag = false;
              this.loaderService.hide();
            }
          }
        }
      )
    }
    this.loaderService.hide();
  }

  getCountries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
      console.log(this.countries, "this.countries")
      this.cdr.detectChanges();
    })
  }

  getStates() {
    this.managementForm.get('country').valueChanges.subscribe(val => {
      this.apiService.getStates().subscribe((response: any) => {
        this.states = response.body.data.filter(usr => {
          return usr.country_id == this.managementForm.controls.country.value
        })
        console.log(this.states, "this.states")
      })
    })
  }

  getCities() {
    this.managementForm.get('state').valueChanges.subscribe(val => {
      this.apiService.getCities().subscribe((response: any) => {
        // this.cities = response.body.data
        this.cities = response.body.data.filter(usr => {
          return usr.state_id == this.managementForm.controls.state.value
        })
        console.log(this.cities, "this.cities")
      })
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
    if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
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
    else {
      alert("Please upload png or jpg file");
    }
  }

  createManagement() {
    // const managementRole = {
    //   "repository": [
    //     {
    //       "id": this.schoolId,
    //       "repository_type": "School"
    //     }
    //   ],
    //   "role_name": "management",
    //   "display_name": this.managementForm.controls.name.value,
    //   "description": "",
    //   "type": "custom",
    //   "privilege": {
    //     "add_section": false,
    //     "add_mapping": false,
    //     "add_class": false,
    //     "add_board": false,
    //     "create_question": true,
    //     "create_question_paper": true,
    //     "view_question_paper": true,
    //     "add_syllubus": false,
    //     "add_subject": false,
    //     "add_chapter": true,
    //     "add_topic": true,
    //     "add_learning_outcome": true,
    //     "add_question_category": true,
    //     "add_exam_types": true,
    //     "add_qa": true,
    //     "add_assessment": true,
    //     "create_school": false,
    //     "create_student": false,
    //     "create_teacher": false,
    //     "create_principle": false,
    //     "create_management": false,
    //     "create_role": false,
    //     "assign_role": false,
    //     "view_school": true,
    //     "view_student": true,
    //     "view_teacher": true,
    //     "view_principle": true,
    //     "view_management": false,
    //     "view_question": true
    //   }
    // }

    // const data = {
    //   'passport_image': this.profilePicture,//
    //   'profile_type': defaultRoles.find(role => { return role.role_name == 'management' }).id,
    //   'school_id': localStorage.getItem('schoolId'),
    //   'branch_id': this.managementForm.controls.branch.value,//
    //   'name': this.managementForm.controls.name.value,//
    //   'mobile': this.managementForm.controls.contact.value,//
    //   'gender': this.managementForm.controls.gender.value,//
    //   'password': this.managementForm.controls.password.value,//
    //   'country': this.managementForm.controls.country.value,//
    //   'city': this.managementForm.controls.city.value,//
    //   'state': this.managementForm.controls.state.value,//
    //   'pincode': this.managementForm.controls.pinCode.value,//
    //   'dob': this.managementForm.controls.dob.value != "" ? new Date(this.managementForm.controls.dob.value).toLocaleDateString() : "",//
    //   'email': this.managementForm.controls.email.value,//
    //   'address': this.managementForm.controls.address.value,//
    //   'aadhar_card': this.managementForm.controls.aadhaarNo.value,//
    //   'blood_gr': this.managementForm.controls.bloodGroup.value,//
    //   'religion': this.managementForm.controls.religion.value,//
    //   'caste': this.managementForm.controls.caste.value,//
    //   'mother_tounge': this.managementForm.controls.motherTongue.value,//
    //   'marital_status': this.managementForm.controls.maritalStatus.value//
    // }

    const data = {
      'profile_image': this.profilePicture,//
      'profile_type': defaultRoles.find(role => { return role.role_name == 'management' }).id,
      'school_id': localStorage.getItem('schoolId'),
      'branch_id': this.managementForm.controls.branch.value,//
      'name': this.managementForm.controls.name.value,//
      'mobile': this.managementForm.controls.contact.value,//
      'gender': this.managementForm.controls.gender.value,//
      'authorized' : this.managementForm.controls.authorized.value,
      'password': this.managementForm.controls.password.value,//
      'country': this.managementForm.controls.country.value,//
      'city': this.managementForm.controls.city.value,//
      'state': this.managementForm.controls.state.value,//
      'pincode': this.managementForm.controls.pinCode.value,//
      'dob': this.managementForm.controls.dob.value != "" ? new Date(this.managementForm.controls.dob.value).toLocaleDateString() : "",//
      'email': this.managementForm.controls.email.value,//
      'address': this.managementForm.controls.address.value,//
      'aadhar_card': this.managementForm.controls.aadhaarNo.value,//
      'blood_gr': this.managementForm.controls.bloodGroup.value,//
      'religion': this.managementForm.controls.religion.value,//
      'caste': this.managementForm.controls.caste.value,//
      'mother_tounge': this.managementForm.controls.motherTongue.value,//
      'marital_status': this.managementForm.controls.maritalStatus.value//
    }

    this.apiService.signUp(data).subscribe((response: any) => {
      console.log(response)
      if (response.status == 201) {
        Swal.fire('Management', response.body.data, 'success');
        this.managementForm.reset();
        this.profilePicture = "";
        this.filePreview = "";
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
        return;
      }
    }, (error) => {
      console.log(error)
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
        return;
      }
    })


  }
}
