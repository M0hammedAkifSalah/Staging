import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { rolesReducer } from 'src/app/core/auth';
import Swal from 'sweetalert2';
import { CreateservicesService } from '../../../create/services/createservices.service';
import { RolesService } from '../../../roles-permission/services/roles.service';

@Component({
  selector: 'kt-edit-school-admin',
  templateUrl: './edit-school-admin.component.html',
  styleUrls: ['./edit-school-admin.component.scss']
})
export class EditSchoolAdminComponent implements OnInit {
  userForm: FormGroup;
  isLoaded: boolean = false;
  // user: any[] = [];
  @Input() user;
  schools: any[] = [];
  branches = [];
  countries = [];
  states = [];
  cities = [];
  roles = [];

  genders: Array<string> = ['Male', 'Female'];
  maritalStatus: Array<string> = ['Married', 'Unmarried', 'Divorce', 'Widow', 'Widower'];
  @ViewChild('firstname') nameInput: MatInput;
  constructor(
    // public activeModal: NgbActiveModal,
    public _formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    public createApiServices: CreateservicesService,
    public apiService: RolesService) { }

  ngOnInit(): void {
    // this.createFormGroup();

    this.getCountries();
    this.getStates();
    this.getCities();
    this.getAllUsers();
    this.getallinstitutes();
    // if (this.user[0].repository[0].repository_type == 'School') {
    this.getBranches();
    // }
    this.getRoles();

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 10);
  }

  ngAfterViewInit() {
    this.nameInput.focus();
    this.cdr.detectChanges();
  }
  getBranches() {
    this.createApiServices.getBranch(localStorage.getItem('schoolId')).subscribe((response: any) => {
      this.branches = response.body.data[0].branch;

    })
  }
  getAllUsers() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let reqData;

    (user.user_info[0].school_id)
    id = user.user_info[0].school_id;


    let data = reqData;

    this.apiService.getAllUsers(data).subscribe((response: any) => {


      console.log(response.body.data.filter(row => row.profile_type.role_name == 'school_admin' && row.school_id == this.schools[0]._id))

      this.user = response.body.data.filter(row => {
        return row.profile_type.role_name == 'school_admin' && row.school_id == this.schools[0]._id
      })
      console.log(response.body.data.filter(row => row.profile_type._id == '5fd2f1e59cc6537951f0b35d'))
      console.log(this.user[0].mobile, "assign role data")
      console.log(this.user, "assign role data")
      this.createFormGroup();
      this.isLoaded = true;
    })
  }


  getallinstitutes() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.createApiServices.getallinstitute(id).subscribe((data: any) => {
      this.schools = data.body.data;


      console.log(this.schools, data)

      this.cdr.detectChanges();

    })

  }
  createFormGroup() {
    this.userForm = new FormGroup({
      // return this._formBuilder.group({
      // username: new FormControl(''),
      // password: new FormControl('', Validators.required),
      // adminName: new FormControl(''),
      // adminContact: new FormControl(''),
      // adminEmail: new FormControl(''),
      // dob: new FormControl(''),

      // gender: new FormControl(''),
      // qualification: new FormControl(''),
      // designation: new FormControl(''),

      name: new FormControl(this.user[0].name, Validators.required),

      mobile: new FormControl(this.user[0].mobile, Validators.required),
      gender: new FormControl(this.user[0].gender,),
      branch_id: new FormControl(this.user[0].branch_id,),
      school_id: new FormControl(this.user[0].school_id, Validators.required),
      dob: new FormControl(this.user[0].dob,),
      email: new FormControl(this.user[0].email),
      address: new FormControl(this.user[0].address),
      aadhar_card: new FormControl(this.user[0].aadhar_card),
      blood_gr: new FormControl(this.user[0].blood_gr),
      religion: new FormControl(this.user[0].religion),
      caste: new FormControl(this.user[0].caste),
      city: new FormControl(this.user[0].city),
      state: new FormControl(this.user[0].state),
      country: new FormControl(this.user[0].country),
      pincode: new FormControl(this.user[0].pincode),
      mother_tounge: new FormControl(this.user[0].mother_tounge),
      marital_status: new FormControl(this.user[0].marital_status),
      password: new FormControl(this.user[0].password, Validators.required),
      // profile_type: this.user[0].profile_type,
      role_name: new FormControl(this.user[0].profile_type.role_name,),
      // repository: this._formBuilder.array([{
      //   id: this.user.school_id,
      //   repository_type: 'school'
      // }]),

      secondary_profile_type: new FormControl(this.user[0].secondary_profile_type),
      _id: new FormControl(this.user[0]._id)



      // name: [this.user.name, Validators.required],
      //   mobile: [this.user.mobile, Validators.required],
      //   gender: [this.user.gender,],
      //   branch_id: [this.user.branch_id,],
      //   school_id: [this.user.repository ? this.user.repository[0].id : '', Validators.required],
      //   dob: [this.user.dob,],
      //   email: [this.user.email],
      //   address: [this.user.address],
      //   aadhar_card: [this.user.aadhar_card],
      //   blood_gr: [this.user.blood_gr],
      //   religion: [this.user.religion],
      //   caste: [this.user.caste],
      //   city: [this.user.city],
      //   state: [this.user.state],
      //   country: [this.user.country],
      //   pincode: [this.user.pincode],
      //   mother_tounge: [this.user.mother_tounge],
      //   marital_status: [this.user.marital_status],
      //   password: [this.user.password, Validators.required],
      //   profile_type: this.user.profile_type,
      //   role_name: this.user.profile_type.role_name,
      //   repository: this._formBuilder.array([{
      //     id: [this.user.repository[0] ? this.user.repository[0].id : ''],
      //     repository_type: [this.user.repository[0] ? this.user.repository[0].repository_type : '']
      //   }]),

      //   // secondary_profile_type: [this.user[0].secondary_profile_type],
      //   _id: [this.user[0]._id]

    });
  }


  getCountries() {
    this.createApiServices.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getStates() {
    this.createApiServices.getStates().subscribe((response: any) => {
      // this.states = response.body.data;
      this.states = response.body.data.filter(usr => {
        return usr.country_id == this.userForm.controls.country.value
      })
      this.cdr.detectChanges();
    })
  }
  getCities() {
    this.createApiServices.getCities().subscribe((response: any) => {
      // this.cities = response.body.data;
      this.cities = response.body.data.filter(usr => {
        return usr.state_id == this.userForm.controls.state.value

      })
      this.cdr.detectChanges();
    })
  }


  getRoles() {
    this.apiService.getRoles().then(data => {
      this.roles = <any[]>data
      this.cdr.detectChanges();
    })
  }

  // getBranches() {
  //   this.createApiServices.getBranch(this.user.repository[0].id).subscribe((response: any) => {
  //     console.log(response)
  //     this.branches = response.body.data.getSchool.branch;
  //     this.cdr.detectChanges();
  //     console.log(this.branches)
  //   })
  // }
  updateUser() {
    this.apiService.updateUser(this.userForm.value).subscribe((response: any) => {
      console.log(response)
      if (response.status == 201 || response.status == 204) {
        Swal.fire('Account Updated', ' account created successfully', 'success');
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message })
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' })
      }
    })
  }



}
