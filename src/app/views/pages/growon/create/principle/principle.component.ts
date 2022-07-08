// Angular
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { CreateservicesService } from '../services/createservices.service';
import Swal from 'sweetalert2';
import { defaultRoles } from '../../roles-permission/default-roles';
import { X } from '@angular/cdk/keycodes';
import { LoadingService } from '../../../loader/loading/loading.service';
import { RolesService } from '../../roles-permission/services/roles.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kt-principle',
  templateUrl: './principle.component.html',
  styleUrls: ['./principle.component.scss']
})
export class PrincipleComponent implements OnInit {
  @Input() updateFlag;
  @Input() user;
  authorized: string[] = ['Yes', 'No'];
  isAuthorized:any=false;
  principleForm: FormGroup;
  gender: Array<string> = ['Male', 'Female'];
  teachingLevels: Array<string> = ['Pre-primary school', 'primary school', 'middle school', 'high school', 'college', 'graduation', 'masters'];
  maritalStatus: Array<string> = ['Married', 'Unmarried', 'Divorce', 'Widow', 'Widower'];
  yearOfPassing: Array<any> = [];
  randomPass: any = Math.random().toString(36).slice(-12);
  cities: Array<any> = ['Bangalore'];
  states: Array<any> = ['karnataka'];
  branches: Array<any> = [];
  countries: Array<any>;
  cvDoc: any;
  tenthDoc: any;
  twelveDoc: any;
  gradDoc: any;
  masterDoc: any;
  otherDegrees: Array<any> = [];
  certifications: Array<any> = [];
  extraCurricularAchievements: Array<any> = [];
  profilePicture: any;
  filePreview: any;
  classes: Array<any>;
  class: Array<any>;
  primarysections: Array<any>
  secondarySection1: Array<any>;
  secondarySection2: Array<any>;
  secondarySection3: Array<any>;
  secondarySection4: Array<any>;
  secondarySection5: Array<any>;
  secondaryClasses: any = [];
  userExistFlag: boolean = false;
  schoolId: any;
  pipeRefreshCounter = 0;
  classLength: number = 0;
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private apiService: CreateservicesService,
    private loaderService: LoadingService,
    private roleService: RolesService,
    @Optional() private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    console.log(this.user)
    this.principleForm = this._formBuilder.group({
      name: [, [Validators.required, Validators.maxLength(50)]],
      contact: [, [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(15), Validators.required]],
      password: [this.randomPass, Validators.required],
      gender: ['', Validators.required],
      authorized : [],
      dob: [''],

      primaryClass: [null],
      section: [null],
      secondaryClass: this._formBuilder.array([
        this.addSecondaryClassFormGroup()
      ]),
      branch: [null,/*  Validators.required */],
      qualification: ['',],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      address: ['', [Validators.maxLength(150)]],
      aadhaarNo: ['', [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
      bloodGroup: [''],
      religion: [''],
      city: [null],
      state: [null],
      country: [null],
      pinCode: ['', [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      caste: [''],
      motherTongue: [''],
      maritalStatus: [''],
      teachingExperience: [''],
      teachingLevels: [''],
      cv: [''],
      leadershipExperience: [''],
      /* city : [''],
      state : [''],
      country : [''],
      pinCode : [''], */
      // 10th Details
      tenthSchool: [],
      tenthBoard: [],
      tenthPercentage: [],
      tenthPassedYear: [],
      // tenthDoc : ['',Validators.required],
      // twelve Details
      twelveSchool: [],
      twelveBoard: [],
      twelvePercentage: [],
      twelvePassedYear: [],
      // twelveDoc : ['',Validators.required],
      // Graduation Details
      gradSchool: [],
      gradBoard: [],
      gradPercentage: [],
      gradPassedYear: [],
      // gradDoc : ['',Validators.required],
      // Masters Details
      masterSchool: [],
      masterBoard: [],
      masterPercentage: [],
      masterPassedYear: [],
      // masterDoc : [''],
      // otherDegrees
      // otherDegrees: [''],
      // certifications: [''],
      // extraCurricularAchievements: ['']
    });
    for (let i = 2000; i < 2021; i++) {
      this.yearOfPassing.push(i);
    }
    this.getCountries();
    this.getStates();
    this.getCities();
    this.getBranches();
    this.getClasses();
    //this.getSections();
    this.getallinstitutes();
    this.getAdmin();
    if (this.updateFlag) {
      this.getUpdatePrinciple();
    }
  }

  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;
    if (user.user_info[0].profile_type.role_name == 'school_admin' || user.user_info[0].profile_type.role_name == 'teacher'
      || user.user_info[0].profile_type.role_name == 'principal' || user.user_info[0].profile_type.role_name == 'management') {

      this.schoolId = localStorage.getItem('schoolId');
    } else if (localStorage.getItem('schoolId')) {
      this.schoolId = localStorage.getItem('schoolId');
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
    if (value && (!this.updateFlag || this.user.mobile != value)) {
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
            this.loaderService.hide();
          }
          this.loaderService.hide();
        },
        error => {
          this.loaderService.hide();
        }
      )

    } else {
      this.loaderService.hide();
    }

  }

  getallinstitutes() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = localStorage.getItem('schoolId');

    }
    this.apiService.getallinstitute(id).subscribe((data: any) => {
      this.class = data.body.data[0].classList;
      this.classLength = this.class.length;

      console.log(this.class, "this.class")

      this.cdr.detectChanges();

    })


  }

  addSecondaryClassFormGroup(): FormGroup {
    return this._formBuilder.group({
      secondClasses: [,],
      section: [,],
      tempSection: ['',],
    })
  }

  getCountries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
    })
  }

  getStates() {
    this.loaderService.show();
    // this.principleForm.get('country').valueChanges.subscribe(val => {
    this.apiService.getStates().subscribe((response: any) => {
      this.states = response.body.data.filter(usr => {
        return usr.country_id == this.principleForm.controls.country.value
      })
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
    // })
  }

  getCities() {
    this.loaderService.show();
    // this.principleForm.get('state').valueChanges.subscribe(val => {
    this.apiService.getCities().subscribe((response: any) => {
      // this.cities = response.body.data
      this.cities = response.body.data.filter(usr => {
        return usr.state_id == this.principleForm.controls.state.value

      })
      this.loaderService.hide();
    },
      error => {
        this.loaderService.hide();
      })
    // })
  }

  getBranches() {
    this.apiService.getBranch(localStorage.getItem('schoolId')).subscribe((response: any) => {
      this.branches = response.body.data[0].branch;

    })
  }

  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
    });
  }

  getPrimarySections(classId: string) {
    this.apiService.getSections(classId).subscribe((response: any) => {
      this.primarysections = response.body.data;
    })
  }

  async getUpdatePrinciple() {
    this.isAuthorized = this.user.authorized;
    this.principleForm = this._formBuilder.group({
      name: [this.user.name, [Validators.required, Validators.maxLength(50)]],
      contact: [this.user.mobile, [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(15), Validators.required]],
      password: [this.user.password, Validators.required],
      gender: [this.user.gender, Validators.required],
      authorized:[this.user.authorized,Validators.required],
      dob: [this.user.dob != "" ? new Date(this.user.dob) : ""],
      primaryClass: [this.user.primary_class],
      section: [this.user.primary_section],
      secondaryClass: this._formBuilder.array([]),
      branch: [this.user.branch_id ? this.user.branch_id.name : '', /* Validators.required */],
      qualification: [this.user.qualification,],
      email: [this.user.email, [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      address: [this.user.address, [Validators.maxLength(150)]],
      aadhaarNo: [this.user.aadhar_card, [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
      bloodGroup: [this.user.blood_gr],
      religion: [this.user.religion],
      city: [this.user.city],
      state: [this.user.state],
      country: [this.user.country],
      pinCode: [this.user.pincode, [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      caste: [this.user.caste],
      motherTongue: [this.user.mother_tounge],
      maritalStatus: [this.user.marital_status],
      teachingExperience: [this.user.experiance],
      teachingLevels: [this.user.level],
      cv: [''],
      leadershipExperience: [this.user.leaderShip_Exp],
      tenthBoard: [this.user.ten_details ? this.user.ten_details.Board : ''],
      tenthPercentage: [this.user.ten_details ? this.user.ten_details.percentage : ''],
      tenthSchool: [this.user.ten_details ? this.user.ten_details.school : ''],
      tenthPassedYear: [this.user.ten_details ? this.user.ten_details.year_of_passing : ''],
      twelveBoard: [this.user.twelve_details ? this.user.twelve_details.Board : ''],
      twelvePercentage: [this.user.twelve_details ? this.user.twelve_details.percentage : ''],
      twelveSchool: [this.user.twelve_details ? this.user.twelve_details.school : ''],
      twelvePassedYear: [this.user.twelve_details ? this.user.twelve_details.year_of_passing : ''],
      gradBoard: [this.user.graduation_details ? this.user.graduation_details.Board : ''],
      gradPercentage: [this.user.graduation_details ? this.user.graduation_details.percentage : ''],
      gradSchool: [this.user.graduation_details ? this.user.graduation_details.school : ''],
      gradPassedYear: [this.user.graduation_details ? this.user.graduation_details.year_of_passing : ''],
      masterSchool: [this.user.masters_details ? this.user.masters_details.school : ''],
      masterBoard: [this.user.masters_details ? this.user.masters_details.Board : ''],
      masterPercentage: [this.user.masters_details ? this.user.masters_details.percentage : ''],
      masterPassedYear: [this.user.masters_details ? this.user.masters_details.year_of_passing : ''],
    });

    if (this.principleForm.get('primaryClass').value) {
      this.getPrimarySections(this.principleForm.get('primaryClass').value);
    }
    this.profilePicture = this.user.profile_image;
    this.filePreview = this.user.profile_image;

    for (let i = 0; i < this.user.secondary_class.length; i++) {
      await this.apiService.getSections(this.user.secondary_class[i].secondClasses).subscribe((response: any) => {
        (<FormArray>this.principleForm.get('secondaryClass')).push(
          this._formBuilder.group({
            secondClasses: [this.user.secondary_class[i].secondClasses,],
            section: [this.user.secondary_class[i].section,],
            tempSection: [response.body.data,],
          }));
        console.log(this.principleForm.value);
        this.cdr.detectChanges();
      })
    }

    console.log(this.principleForm.value)
    this.cdr.detectChanges();
  }

  // onFileInput
  onFileInput(event, type) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.apiService.uploadFile(formData).subscribe((response: any) => {
      if (response.status == 201) {
        switch (type) {
          case 'cv':
            this.cvDoc = response.body.message;
            break;
          case '10th':
            this.tenthDoc = response.body.message;
            break;
          case '12th':
            this.twelveDoc = response.body.message;
            break;
          case 'grad':
            this.gradDoc = response.body.message;
            break;
          case 'master':
            this.masterDoc = response.body.message;
            break;
          case 'otherDeg':
            this.otherDegrees = response.body.message;
            break;
          case 'certi':
            this.certifications = response.body.message;
            break;
          case 'extraCur':
            this.extraCurricularAchievements = response.body.message;
            break;
        }
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your fie please try again' });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your fie please try again' });
        return;
      }
    });
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

  primaryClassChange(event: any) {
    if (event == "") {
      this.principleForm.controls.section.setValue("");
    }
    else {
      this.getPrimarySections(event);
      this.principleForm.controls.section.setValue("");
    }
  }

  secondaryClassChange(event: any, i: any) {

    this.pipeRefreshCounter++;

    let secondaryClass = this.principleForm.controls.secondaryClass as FormArray;
    if (event == "") {
      let formGrp = secondaryClass.controls[i] as FormGroup;
      formGrp.controls.section.setValue("");
    }
    else {
      this.apiService.getSections(event).subscribe((response: any) => {
        formGrp.controls.tempSection.setValue(response.body.data);
        //console.log(secondaryClass.value)
      })
      let formGrp = secondaryClass.controls[i] as FormGroup;
      formGrp.controls.section.setValue("");
    }
  }

  createPrinciple() {
    this.secondaryClasses = [];

    this.principleForm.controls.secondaryClass.value.forEach((x: any, index: any) => {
      let data = { secondClasses: "", section: "" };
      if (x.secondClasses == null || x.secondClasses == undefined) {
        this.principleForm.controls.secondaryClass.value[index].secondClasses = "";
        this.principleForm.controls.secondaryClass.value[index].section = "";
      }
      else if (x.section == null || x.section == undefined) {
        this.principleForm.controls.secondaryClass.value[index].section = "";
        data.secondClasses = this.principleForm.controls.secondaryClass.value[index].secondClasses;
        data.section = this.principleForm.controls.secondaryClass.value[index].section;
      }
      else {
        data.secondClasses = this.principleForm.controls.secondaryClass.value[index].secondClasses;
        data.section = this.principleForm.controls.secondaryClass.value[index].section;
      }
      if (data.secondClasses != "") {
        this.secondaryClasses.push(data);
      }
    })

    for (let i = 0; i < this.principleForm.get('secondaryClass').value.length; i++) {
      delete this.principleForm.controls.secondaryClass.value[i].tempSection;
    }

    if (this.updateFlag) {
      const principalData = {
        'profile_image': this.profilePicture,
        '_id': this.user._id,
        'profile_type': this.user.profile_type,
        'school_id': this.user.school_id._id,
        'branch_id': this.user.branch_id ? this.user.branch_id._id : this.principleForm.controls.branch.value ,
        'primary_class': this.principleForm.controls.primaryClass.value ? this.principleForm.controls.primaryClass.value : null,
        'primary_section': this.principleForm.controls.section.value ? this.principleForm.controls.section.value : null ,
        'secondary_class': this.secondaryClasses,
        'name': this.principleForm.controls.name.value,
        'mobile': this.principleForm.controls.contact.value,
        'gender': this.principleForm.controls.gender.value,
        'authorized' : this.principleForm.controls.authorized.value,
        'password': this.principleForm.controls.password.value,
        'qualification': this.principleForm.controls.qualification.value,
        'dob': (this.principleForm.controls.dob.value != "" && this.principleForm.controls.dob.value != null) ? new Date(this.principleForm.controls.dob.value).toLocaleDateString() : "",
        'email': this.principleForm.controls.email.value,
        'username': this.principleForm.controls.email.value,
        'address': this.principleForm.controls.address.value,
        'aadhar_card': this.principleForm.controls.aadhaarNo.value,
        'blood_gr': this.principleForm.controls.bloodGroup.value,
        'religion': this.principleForm.controls.religion.value,
        'caste': this.principleForm.controls.caste.value,
        'mother_tounge': this.principleForm.controls.motherTongue.value,
        'marital_status': this.principleForm.controls.maritalStatus.value,
        'experience': this.principleForm.controls.teachingExperience.value,
        'level': this.principleForm.controls.teachingLevels.value,
        'city': this.principleForm.controls.city.value,
        'state': this.principleForm.controls.state.value,
        'country': this.principleForm.controls.country.value,
        'pincode': this.principleForm.controls.pinCode.value,
        'leaderShip_Exp': this.principleForm.controls.leadershipExperience.value,
        'cv': this.cvDoc,
        'ten_details': {
          'school': this.principleForm.controls.tenthSchool.value,
          'Board': this.principleForm.controls.tenthBoard.value,
          'percentage': this.principleForm.controls.tenthPercentage.value,
          'year_of_passing': this.principleForm.controls.tenthPassedYear.value,
          'Attach_doc': this.tenthDoc
        },
        'twelve_details': {
          'school': this.principleForm.controls.twelveSchool.value,
          'Board': this.principleForm.controls.twelveBoard.value,
          'percentage': this.principleForm.controls.twelvePercentage.value,
          'year_of_passing': this.principleForm.controls.twelvePassedYear.value,
          'Attach_doc': this.twelveDoc
        },
        'graduation_details': {
          'school': this.principleForm.controls.gradSchool.value,
          'Board': this.principleForm.controls.gradBoard.value,
          'percentage': this.principleForm.controls.gradPercentage.value,
          'year_of_passing': this.principleForm.controls.gradPassedYear.value,
          'Attach_doc': this.gradDoc
        },
        'masters_details': {
          'school': this.principleForm.controls.masterSchool.value,
          'Board': this.principleForm.controls.masterBoard.value,
          'percentage': this.principleForm.controls.masterPercentage.value,
          'year_of_passing': this.principleForm.controls.masterPassedYear.value,
          'Attach_doc': this.masterDoc
        },
        'other_degrees': this.otherDegrees,
        'certifications': this.certifications,
        'extra_achievement': this.extraCurricularAchievements
      }
      this.roleService.updateUser(principalData).subscribe((response: any) => {
        console.log(response)
        if (response.status == 201 || response.status == 204) {
          Swal.fire('Account Updated', 'Principle account Updated successfully', 'success');
          this.principleForm.reset();
          this.activeModal.close('success');
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
          return;
        }
      }, (error) => {
        if (error.status == 400) {
          console.log('error => ', error)
          Swal.fire({ icon: 'error', title: 'Error', text: error ? error.error.data : '' })
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: error ? error.error.data : '' })
        }
      })
    } else {
      const principleData = {
        'profile_image': this.profilePicture,
        'profile_type': defaultRoles.find(role => { return role.role_name == 'principal' }).id,
        'school_id': localStorage.getItem('schoolId'),
        'branch_id': this.principleForm.controls.branch.value,
        'primary_class': this.principleForm.controls.primaryClass.value ? this.principleForm.controls.primaryClass.value : null,
        'primary_section': this.principleForm.controls.section.value ? this.principleForm.controls.section.value : null,
        'secondary_class': this.secondaryClasses,
        'name': this.principleForm.controls.name.value,
        'mobile': this.principleForm.controls.contact.value,
        'gender': this.principleForm.controls.gender.value,
        'authorized' : this.principleForm.controls.authorized.value,
        'password': this.principleForm.controls.password.value,
        'qualification': this.principleForm.controls.qualification.value,
        'dob': (this.principleForm.controls.dob.value != "" && this.principleForm.controls.dob.value != null) ? new Date(this.principleForm.controls.dob.value).toLocaleDateString() : "",
        'email': this.principleForm.controls.email.value,
        'username': this.principleForm.controls.email.value,
        'address': this.principleForm.controls.address.value,
        'aadhar_card': this.principleForm.controls.aadhaarNo.value,
        'blood_gr': this.principleForm.controls.bloodGroup.value,
        'religion': this.principleForm.controls.religion.value,
        'caste': this.principleForm.controls.caste.value,
        'mother_tounge': this.principleForm.controls.motherTongue.value,
        'marital_status': this.principleForm.controls.maritalStatus.value,
        'experience': this.principleForm.controls.teachingExperience.value,
        'level': this.principleForm.controls.teachingLevels.value,
        'city': this.principleForm.controls.city.value,
        'state': this.principleForm.controls.state.value,
        'country': this.principleForm.controls.country.value,
        'pincode': this.principleForm.controls.pinCode.value,
        'leaderShip_Exp': this.principleForm.controls.leadershipExperience.value,
        'cv': this.cvDoc,
        'ten_details': {
          'school': this.principleForm.controls.tenthSchool.value,
          'Board': this.principleForm.controls.tenthBoard.value,
          'percentage': this.principleForm.controls.tenthPercentage.value,
          'year_of_passing': this.principleForm.controls.tenthPassedYear.value,
          'Attach_doc': this.tenthDoc
        },
        'twelve_details': {
          'school': this.principleForm.controls.twelveSchool.value,
          'Board': this.principleForm.controls.twelveBoard.value,
          'percentage': this.principleForm.controls.twelvePercentage.value,
          'year_of_passing': this.principleForm.controls.twelvePassedYear.value,
          'Attach_doc': this.twelveDoc
        },
        'graduation_details': {
          'school': this.principleForm.controls.gradSchool.value,
          'Board': this.principleForm.controls.gradBoard.value,
          'percentage': this.principleForm.controls.gradPercentage.value,
          'year_of_passing': this.principleForm.controls.gradPassedYear.value,
          'Attach_doc': this.gradDoc
        },
        'masters_details': {
          'school': this.principleForm.controls.masterSchool.value,
          'Board': this.principleForm.controls.masterBoard.value,
          'percentage': this.principleForm.controls.masterPercentage.value,
          'year_of_passing': this.principleForm.controls.masterPassedYear.value,
          'Attach_doc': this.masterDoc
        },
        'other_degrees': this.otherDegrees,
        'certifications': this.certifications,
        'extra_achievement': this.extraCurricularAchievements
      }
      this.apiService.signUp(principleData).subscribe((response: any) => {
        console.log('principle reg Data', response);
        if (response.status == 201) {
          if (response.status == 201) {
            Swal.fire('Principal', response.body.data, 'success');
            this.principleForm.reset();
            this.profilePicture = "";
            this.filePreview = "";
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: response.body.data })
            return;
          }
        } else {
          Swal.fire({ icon: 'error', title: 'Error, please try again', text: response.body.data });
          return;
        }
      }, (error) => {
        console.log('principle error Data', error);
        if (error.status == 400) {
          console.log('error => ', error)
          Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
        }
      })
    }


  }

  removeControls() {
    this.principleForm.controls.secondaryClass.value.forEach((element: any, i: any) => {
      if (element.secondClasses == "") {
        this.removeSecodaryClass(i);
      }
    });
  }

  addSecondaryClass(): void {
    (<FormArray>this.principleForm.get('secondaryClass')).push(this.addSecondaryClassFormGroup());
  }

  removeSecodaryClass(index) {
    (<FormArray>this.principleForm.get('secondaryClass')).removeAt(index);
  }

  secondaryClassformArray() {
    return <FormArray>this.principleForm.get('secondaryClass');
  }

}
