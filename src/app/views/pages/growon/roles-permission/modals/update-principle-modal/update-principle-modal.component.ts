import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CreateservicesService } from '../../../create/services/createservices.service';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'kt-update-principle-modal',
  templateUrl: './update-principle-modal.component.html',
  styleUrls: ['./update-principle-modal.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdatePrincipleModalComponent implements OnInit {

  @Input() user: any;
  principleForm: FormGroup;
  branches = [];
  genders: Array<string> = ['Male', 'Female'];
  countries = [];
  states = [];
  cities = [];
  sections: Array<any>;
  maritalStatuses: Array<string> = ['Married', 'Unmarried', 'Divorce', 'Widow', 'Widower'];
  teachingLevels: Array<string> = ['Pre-primary school', 'primary school', 'middle school', 'high school', 'college', 'graduation', 'masters'];
  yearOfPassing: Array<any> = [];
  roles = [];
  class: Array<any> = [];
  @ViewChild('firstname') nameInput: MatInput;
  secondarySection1: Array<any>;
  secondarySection2: Array<any>;
  secondarySection3: Array<any>;
  secondarySection4: Array<any>;
  secondarySection5: Array<any>;
  secondaryClasses: any = [];
  cvDoc: any;
  tenthDoc: any;
  twelveDoc: any;
  gradDoc: any;
  masterDoc: any;
  otherDegrees: Array<any> = [];
  certifications: Array<any> = [];
  extraCurricularAchievements: Array<any> = [];

  constructor(private _formBuilder: FormBuilder,
    private createApiServices: CreateservicesService,
    private cdr: ChangeDetectorRef,
    private apiService: RolesService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.user)
    this.createFormGroup();
    this.getCountries();
    this.getStates();
    this.getCities();
    this.getBranches();
    this.getAllYears();
    this.getRoles();
    //this.getSections();
    this.getallinstitutes();
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 10);
    this.getSections(this.user.primary_class);
    this.fillSecondaryClass();
  }

  ngAfterViewInit() {
    this.nameInput.focus();
    this.cdr.detectChanges();
  }

  createFormGroup() {
    this.principleForm = this._formBuilder.group({
      school_id: [this.user.school_id._id],
      name: [this.user.name, [Validators.required, Validators.maxLength(50)]],
      mobile: [this.user.mobile, [Validators.required]],
      gender: [this.user.gender, Validators.required],
      branch_id: [this.user.branch_id, Validators.required],
      password: [this.user.password, Validators.required],
      primary_class: [this.user.primary_class],
      primary_section: [this.user.primary_section],
      secondaryClass: this._formBuilder.array([]),
      dob: [this.user.dob != "" ? new Date(this.user.dob) : ""],
      qualification: [this.user.qualification],
      email: [this.user.email, [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      address: [this.user.address, Validators.maxLength(150)],
      aadhar_card: [this.user.aadhar_card, [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
      blood_gr: [this.user.blood_gr],
      religion: [this.user.religion],
      caste: [this.user.caste],
      city: [this.user.city],
      state: [this.user.state],
      country: [this.user.country],
      pincode: [this.user.pincode, [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      mother_tounge: [this.user.mother_tounge],
      marital_status: [this.user.marital_status],
      experience: [this.user.experiance],
      leaderShip_Exp: [this.user.leaderShip_Exp],
      level: [this.user.level],
      //cv: [this.user.cv != undefined ? this.user.cv : ''],
      ten_details: this._formBuilder.group({
        Board: [this.user.ten_details.Board],
        percentage: [this.user.ten_details.percentage],
        school: [this.user.ten_details.school],
        year_of_passing: [this.user.ten_details.year_of_passing],
        //doc: [this.user.ten_details.Attach_doc != undefined ? this.user.ten_details.Attach_doc : '']
      }),
      twelve_details: this._formBuilder.group({
        Board: [this.user.twelve_details.Board],
        percentage: [this.user.twelve_details.percentage],
        school: [this.user.twelve_details.school],
        year_of_passing: [this.user.twelve_details.year_of_passing],
        //doc: [this.user.twelve_details.Attach_doc != undefined ? this.user.twelve_details.Attach_doc : '']
      }),
      graduation_details: this._formBuilder.group({
        Board: [this.user.graduation_details.Board],
        percentage: [this.user.graduation_details.percentage],
        school: [this.user.graduation_details.school],
        year_of_passing: [this.user.graduation_details.year_of_passing],
        //doc: [this.user.graduation_details.Attach_doc != undefined ? this.user.graduation_details.Attach_doc : '']
      }),
      masters_details: this._formBuilder.group({
        Board: [this.user.masters_details.Board],
        percentage: [this.user.masters_details.percentage],
        school: [this.user.masters_details.school],
        year_of_passing: [this.user.masters_details.year_of_passing],
        //doc: [this.user.masters_details.Attach_doc != undefined ? this.user.masters_details.Attach_doc : '']
      }),
      //certifications: this._formBuilder.array([this.user.certifications]),
      //extra_achievement: this._formBuilder.array([this.user.extra_achievement]),
      //other_degrees: this._formBuilder.array([this.user.other_degrees]),
      profile_type: this.user.profile_type,
      repository: this._formBuilder.array([{
        id: [this.user.repository[0] ? this.user.repository[0].id : ''],
        repository_type: [this.user.repository[0] ? this.user.repository[0].repository_type : '']
      }]),
      secondary_profile_type: [this.user.secondary_profile_type],
      _id: [this.user._id]
    });
    let sc = this.principleForm.controls.secondaryClass as FormArray;
    for (let index = 0; index < this.user.secondary_class.length; index++) {
      sc.push(this._formBuilder.group({
        secondClasses: [''],
        section: ['']
      }))
    }
  }

  fillSecondaryClass() {
    for (let index = 0; index < this.user.secondary_class.length; index++) {
      let secondaryClass = this.principleForm.get('secondaryClass')['controls'] as FormArray;
      console.log(secondaryClass);
      this.callSecondarySection(index, this.user.secondary_class[index].classId);
      secondaryClass[index].controls.secondClasses.setValue(this.user.secondary_class[index].classId);
      if (this.user.secondary_class[index].sectionId != undefined && this.user.secondary_class[index].sectionId != null) {
        secondaryClass[index].controls.section.setValue(this.user.secondary_class[index].sectionId);
      }
      else {
        secondaryClass[index].controls.section.setValue("");
      }
      this.cdr.detectChanges();
    }
  }

  callSecondarySection(i: any, classId: string) {
    if (i == 0) {
      this.getSecondarySections1(classId);
    }
    else if (i == 1) {
      this.getSecondarySections2(classId);
    }
    else if (i == 2) {
      this.getSecondarySections3(classId);
    }
    else if (i == 3) {
      this.getSecondarySections4(classId);
    }
    else if (i == 4) {
      this.getSecondarySections5(classId);
    }
  }

  getSecondarySections1(classId: string) {
    this.createApiServices.getSections(classId).subscribe((response: any) => {
      this.secondarySection1 = response.body.data;
    })
  }
  getSecondarySections2(classId: string) {
    this.createApiServices.getSections(classId).subscribe((response: any) => {
      this.secondarySection2 = response.body.data;
    })
  }
  getSecondarySections3(classId: string) {
    this.createApiServices.getSections(classId).subscribe((response: any) => {
      this.secondarySection3 = response.body.data;
    })
  }
  getSecondarySections4(classId: string) {
    this.createApiServices.getSections(classId).subscribe((response: any) => {
      this.secondarySection4 = response.body.data;
    })
  }
  getSecondarySections5(classId: string) {
    this.createApiServices.getSections(classId).subscribe((response: any) => {
      this.secondarySection5 = response.body.data;
    })
  }

  addSecondaryClassFormGroup(): FormGroup {
    return this._formBuilder.group({
      secondClasses: [''],
      section: ['']
    })
  }

  addSecondaryClass(): void {
    (<FormArray>this.principleForm.get('secondaryClass')).push(this.addSecondaryClassFormGroup());
  }
  removeSecodaryClass(index: any) {
    (<FormArray>this.principleForm.get('secondaryClass')).removeAt(index);
  }

  getCountries() {
    this.createApiServices.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
      this.cdr.detectChanges();
    })
  }

  getBranches() {
    this.createApiServices.getBranch(localStorage.getItem('schoolId')).subscribe((response: any) => {
      this.branches = response.body.data[0].branch;
      this.cdr.detectChanges();
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
      this.class = data.body.data[0].classList;
      console.log(this.class, "this.class")
      this.cdr.detectChanges();
    })

  }

  getStates() {
    this.createApiServices.getStates().subscribe((response: any) => {
      this.states = response.body.data;
      this.cdr.detectChanges();
    })
  }

  getCities() {
    this.createApiServices.getCities().subscribe((response: any) => {
      this.cities = response.body.data;
      this.cdr.detectChanges();
    })
  }

  getAllYears() {
    for (let i = 2000; i < 2021; i++) {
      this.yearOfPassing.push(i);
      this.cdr.detectChanges();
    }
  }

  // Get all roles
  getRoles() {
    this.apiService.getRoles().then(data => {
      this.roles = <any[]>data
      this.cdr.detectChanges();
    })
  }

  getSections(classId: string) {
    this.createApiServices.getSections(classId).subscribe((response: any) => {
      this.sections = response.body.data;
    })
  }

  primaryClassChange(event: any) {
    if (event.value == "") {
      this.principleForm.controls.primary_section.setValue("");
    }
    else {
      this.getSections(event.value);
      this.principleForm.controls.primary_section.setValue("");
    }
  }

  secondaryClassChange(event: any, i: any) {

    let secondaryClass = this.principleForm.controls.secondaryClass as FormArray;
    if (event.value == "") {
      let formGrp = secondaryClass.controls[i] as FormGroup;
      formGrp.controls.section.setValue("");
    }
    else {
      if (i == 0) {
        this.getSecondarySections1(event.value)
      }
      else if (i == 1) {
        this.getSecondarySections2(event.value)
      }
      else if (i == 2) {
        this.getSecondarySections3(event.value)
      }
      else if (i == 3) {
        this.getSecondarySections4(event.value)
      }
      else {
        this.getSecondarySections5(event.value)
      }
      let formGrp = secondaryClass.controls[i] as FormGroup;
      formGrp.controls.section.setValue("");
    }
  }

  // onFileInput
  onFileInput(event, type) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.createApiServices.uploadFile(formData).subscribe((response: any) => {
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
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
        return;
      }
    });
  }

  updatePrinciple() {
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
    let ten_details_formGroup = this.principleForm.controls['ten_details'] as FormGroup;
    let twelve_details_formGroup = this.principleForm.controls['twelve_details'] as FormGroup;
    let graduation_details_formGroup = this.principleForm.controls['graduation_details'] as FormGroup;
    let master_details_formGroup = this.principleForm.controls['masters_details'] as FormGroup;
    const teacherData = {
      '_id': this.user._id,
      'profile_type': this.user.profile_type,
      'school_id': this.user.school_id._id,
      'branch_id': this.principleForm.controls.branch_id.value,
      'primary_class': this.principleForm.controls.primary_class.value,
      'primary_section': this.principleForm.controls.primary_section.value,
      'secondaryClass': this.secondaryClasses,
      'name': this.principleForm.controls.name.value,
      'mobile': this.principleForm.controls.mobile.value,
      'gender': this.principleForm.controls.gender.value,
      'password': this.principleForm.controls.password.value,
      'qualification': this.principleForm.controls.qualification.value,
      'dob': this.principleForm.controls.dob.value != "" ? new Date(this.principleForm.controls.dob.value).toLocaleDateString() : "",
      'email': this.principleForm.controls.email.value,
      'address': this.principleForm.controls.address.value,
      'aadhar_card': this.principleForm.controls.aadhar_card.value,
      'blood_gr': this.principleForm.controls.blood_gr.value,
      'religion': this.principleForm.controls.religion.value,
      'caste': this.principleForm.controls.caste.value,
      'mother_tounge': this.principleForm.controls.mother_tounge.value,
      'marital_status': this.principleForm.controls.marital_status.value,
      'experience': this.principleForm.controls.experience.value,
      'level': this.principleForm.controls.level.value,
      'city': this.principleForm.controls.city.value,
      'state': this.principleForm.controls.state.value,
      'country': this.principleForm.controls.country.value,
      'pincode': this.principleForm.controls.pincode.value,
      'leaderShip_Exp': this.principleForm.controls.leaderShip_Exp.value,
      'cv': this.cvDoc,
      'ten_details': {
        'school': ten_details_formGroup.controls.school.value,
        'Board': ten_details_formGroup.controls.Board.value,
        'percentage': ten_details_formGroup.controls.percentage.value,
        'year_of_passing': ten_details_formGroup.controls.year_of_passing.value,
        'Attach_doc': this.tenthDoc
      },
      'twelve_details': {
        'school': twelve_details_formGroup.controls.school.value,
        'Board': twelve_details_formGroup.controls.Board.value,
        'percentage': twelve_details_formGroup.controls.percentage.value,
        'year_of_passing': twelve_details_formGroup.controls.year_of_passing.value,
        'Attach_doc': this.twelveDoc
      },
      'graduation_details': {
        'school': graduation_details_formGroup.controls.school.value,
        'Board': graduation_details_formGroup.controls.Board.value,
        'percentage': graduation_details_formGroup.controls.percentage.value,
        'year_of_passing': graduation_details_formGroup.controls.year_of_passing.value,
        'Attach_doc': this.gradDoc
      },
      'masters_details': {
        'school': master_details_formGroup.controls.school.value,
        'Board': master_details_formGroup.controls.Board.value,
        'percentage': master_details_formGroup.controls.percentage.value,
        'year_of_passing': master_details_formGroup.controls.year_of_passing.value,
        'Attach_doc': this.masterDoc
      },
      'other_degrees': this.otherDegrees,
      'certifications': this.certifications,
      'extra_achievement': this.extraCurricularAchievements
    }
    this.apiService.updateUser(teacherData).subscribe((response: any) => {
      console.log(response)
      if (response.status == 201 || response.status == 204) {
        Swal.fire('Account Updated', 'Principle account Updated successfully', 'success');
        this.activeModal.close('success');
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
      }
    })
  }

  secondaryClassformArray() {
    return <FormArray>this.principleForm.get('secondaryClass');
  }

}
