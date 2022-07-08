import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rolesReducer } from 'src/app/core/auth';
import Swal from 'sweetalert2';
import { CreateservicesService } from '../../create/services/createservices.service';
import { RolesService } from '../../roles-permission/services/roles.service';

@Component({
  selector: 'kt-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit {

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
  rolename: any;
  gender: Array<string> = ['Male', 'Female'];
  maritalStatuses: Array<string> = ['Married', 'Unmarried', 'Divorce', 'Widow', 'Widower'];
  @ViewChild('firstname') nameInput: MatInput;
  readonly:boolean=true;
  constructor(
    // public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public _formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    public createApiServices: CreateservicesService,
    public apiService: RolesService) { 
     
    }

 /* async */ ngOnInit() {
   if(localStorage.getItem('userToken')){
     console.log('Token',localStorage.getItem('userToken'))
     this.getAllUsers();
   }

  
  /*   await  */

    // this.getallinstitutes();
    // if (this.user[0].repository[0].repository_type == 'School') {

    // }
    // this.getRoles();

    setTimeout(() => {
     
      this.cdr.detectChanges();
    }, 1000);
  }

  ngAfterViewInit() {
    // this.nameInput.focus();
    this.cdr.detectChanges();
  }
  getBranches() {
    this.createApiServices.getBranch(localStorage.getItem('schoolId')).subscribe((response: any) => {
      console.log(response.body)
      this.branches = response.body.data[0].branch;

    })
  }
  // getAllUsers() {
  //   let userInfo = localStorage.getItem('info');
  //   let user = JSON.parse(userInfo);
  //   console.log(user, "user")
  //   let id: any;
  //   let reqData;

  //   (user.user_info[0].school_id)
  //   id = user.user_info[0].school_id;


  //   let data = reqData;

  //   // this.apiService.getAllUsers(data).subscribe((response: any) => {
  //   // this.user = response.body.data.filter(row => {
  //   //   return row._id == user.user_info[0]._id
  //   // })

  //   this.user == user.user_info[0]


  //   console.log(this.user, "profile")

  //   // })
  //   this.createFormGroup();
  //   this.isLoaded = true;
  // }

  getAllUsers() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    this.apiService.getAllUsers(user.user_info[0]._id).subscribe((response: any) => {
      this.user = response.data;

      console.log(this.user, "profile")
      this.createFormGroup();
      this.isLoaded = true;
      this.rolename = this.user[0].profile_type.display_name;
      if(this.rolename=='school Admin'){
        this.readonly=false;
      }
      console.log("role Name",this.rolename)

      this.getBranches();
      this.getCountries();
      this.getStates();
      this.getCities();
    })
  }
  // getallinstitutes() {

  //   let userInfo = localStorage.getItem('info');
  //   let user = JSON.parse(userInfo);
  //   let id: any;

  //   if (user.user_info[0].school_id) {
  //     id = user.user_info[0].school_id;

  //   }
  //   this.createApiServices.getallinstitute(id).subscribe((data: any) => {
  //     this.schools = data.body.data;




  //     this.cdr.detectChanges();

  //   })

  // }

  createFormGroup() {
    console.log(this.user)
    this.userForm = new FormGroup({
      address: new FormControl(this.user[0].address, [Validators.maxLength(150)]),
      aadhar_card: new FormControl(this.user[0].aadhar_card, [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]),
      blood_gr: new FormControl(this.user[0].blood_gr),
      branch_id: new FormControl(this.user[0].branch_id,),
      caste: new FormControl(this.user[0].caste),
      certifications: new FormControl(this.user[0].certifications),
      createdAt: new FormControl(this.user[0].createdAt),
      cv: new FormControl(this.user[0].cv),
      // dob: new FormControl(this.user[0].dob,),
      dob: new FormControl(this.user[0].dob != "" ? new Date(this.user[0].dob) : ""),
      // dob: new FormControl(new Date(this.user[0].dob,)),
      email: new FormControl(this.user[0].email, [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      extra_achievement: new FormControl(this.user[0].extra_achievement),
      gender: new FormControl(this.user[0].gender, Validators.required),
      graduation_details: new FormControl(this.user[0].graduation_details),
      leaderShip_Exp: new FormControl(this.user[0].leaderShip_Exp,),
      level: new FormControl(this.user[0].level,),
      marital_status: new FormControl(this.user[0].marital_status),
      masters_details: new FormControl(this.user[0].masters_details),
      mobile: new FormControl(this.user[0].mobile, [Validators.required]),
      mother_tounge: new FormControl(this.user[0].mother_tounge),
      name: new FormControl(this.user[0].name, [Validators.required, Validators.maxLength(50)]),
      other_degrees: new FormControl(this.user[0].other_degrees,),
      password: new FormControl(this.user[0].password, Validators.required),
      pin: new FormControl(this.user[0].pin,),
      primary_class: new FormControl(this.user[0].primary_class,),
      primary_section: new FormControl(this.user[0].primary_section),
      profile_type: new FormControl(this.user[0].profile_type,),
      qualification: new FormControl(this.user[0].qualification,),
      religion: new FormControl(this.user[0].religion),
      repository: new FormControl(this.user[0].repository),
      school_id: new FormControl(this.user[0].school_id,),
      secondary_class: new FormControl(this.user[0].secondary_class,),
      secondary_profile_type: new FormControl(this.user[0].secondary_profile_type,),
      subject: new FormControl(this.user[0].subject,),
      ten_details: new FormControl(this.user[0].ten_details),
      twelve_details: new FormControl(this.user[0].twelve_details),
      updatedAt: new FormControl(this.user[0].updatedAt),
      _id: new FormControl(this.user[0]._id,),
      city: new FormControl(this.user[0].city),
      state: new FormControl(this.user[0].state),
      country: new FormControl(this.user[0].country),
      pincode: new FormControl(this.user[0].pincode, [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
      // role_name: new FormControl(this.user[0].profile_type[0].role_name,),
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
        return usr.country_id == this.userForm.get('country').value || !usr.country_id
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


  // getRoles() {
  //   this.apiService.getRoles().then(data => {
  //     this.roles = <any[]>data
  //     this.cdr.detectChanges();
  //   })
  // }

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
        Swal.fire('Account Updated', ' account Updated successfully', 'success');
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error?.error?.data })
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: error?.error?.data })
      }
    })
  }


}

