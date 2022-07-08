import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatInput } from '@angular/material/input';
import { CreateservicesService } from '../../services/createservices.service';
import { StudentDetails } from '../../../model/studentdetails.model';
import { StudentUpdateRequest } from '../../../model/studentupdate.model';
import { LanguageList } from '../../../model/languagelist.model';
import { LanguageDetails } from '../../../model/languagedetails.model';
import { LoadingService } from 'src/app/views/pages/loader/loading/loading.service';
import { E } from '@angular/cdk/keycodes';
@Component({
  selector: 'kt-edit-all-student',
  templateUrl: './edit-all-student.component.html',
  styleUrls: ['./edit-all-student.component.scss']
})
export class EditAllStudentComponent implements OnInit {
  updateStudentForm: FormGroup;
  @Input() students: any;
  isLoaded: boolean = false;
  @ViewChild('firstname') nameInput: MatInput;
  countries = [];
  states = [];
  cities = [];
  classes = [];
  class = [];
  subjects = [];
  genders: Array<string> = ['Male', 'Female'];
  branches: Array<any> = [];
  transportationMode: Array<string> = ['Parent', 'Private Auto', 'Private Bus', 'By Walk', 'By Cycle'];
  medicalConditions: Array<string> = ['None', 'Asthma', 'Allergies', 'Diabetes', 'Epilepsy', 'Heart Disease', 'Ophthalmic Defect', 'Auditory defect', 'hearing loss', 'Differently Able'];
  boolean: Array<string> = ['Yes', 'No'];
  primaryParent: Array<object> = [{ 'name': 'Father', 'value': 'father' }, { 'name': 'Mother', 'value': 'mother' }, { 'name': 'Guardian', 'value': 'guardian' }];
  parentQualification: Array<string> = ['10th', '12th', 'degree', 'masters degree', 'others'];
  countOfFour: Array<any> = [1, 2, 3, 4];
  sections: Array<string>;
  randomPass: any = Math.random().toString(36).slice(-12);
  settings: any;
  profilePicture: any;
  filePreview: any;
  studentUpdateRequest: StudentUpdateRequest = <StudentUpdateRequest>{};
  // @ViewChild('firstname') nameInput: MatInput;
  parentNumberExist: any = [false, false, false];

  constructor(public activeModal: NgbActiveModal, public apiService: CreateservicesService,
    public _formBuilder: FormBuilder, private cdr: ChangeDetectorRef,
    private loaderService:LoadingService) { }

  ngOnInit(): void {
    console.log(this.students)
    //this.getSections();
    this.createUpdateForm();
    this.getCountries();
    this.getStates();
    this.getCities();
    this.getBranches();
    this.getClasses();
    this.getSubjects();
    this.getallinstitutes();
    this.fillUpdateForm();
    console.log(this.updateStudentForm)
    //this.getStudentdetail();
  }

  ngAfterViewInit() {
    this.nameInput.focus();
    this.cdr.detectChanges();
  }

  getCountries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
    })
  }

  getStates() {
    this.apiService.getStates().subscribe((response: any) => {
      this.states = response.body.data.filter(usr => {
        return usr.country_id == this.updateStudentForm.controls.country.value
      })
      // this.states = response.body.data;
    })
  }

  getCities() {
    this.apiService.getCities().subscribe((response: any) => {
      // this.cities = response.body.data;
      this.cities = response.body.data.filter(usr => {
        return usr.state_id == this.updateStudentForm.controls.state.value

      })
    })
  }

  getallinstitutes() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
    }
    this.apiService.getallinstitute(id).subscribe((data: any) => {
      this.class = data.body.data[0].classList;
      console.log(this.class, "this.class")
      this.cdr.detectChanges();
    })
  }

  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
    });
  }

  primaryClassChange(event: any) {
    if (event.value == "") {
      this.updateStudentForm.controls.section.setValue("");
    }
    else {
      this.getSections(event.value);
      this.updateStudentForm.controls.section.setValue("");
    }
  }

  getSections(classId: string) {
    this.apiService.getSections(classId).subscribe((response: any) => {
      this.sections = response.body.data;
    })
  }

  getBranches() {
    this.apiService.getBranch(localStorage.getItem('schoolId')).subscribe((response: any) => {
      this.branches = response.body.data[0].branch;
    })
  }

  getSubjects() {
    this.apiService.getSubjects().subscribe((response: any) => {
      this.subjects = response.body.data;
    })
  }

  checkParentValidation(type) {
		this.loaderService.show();
		let contactNumber;
		switch (type) {
			case 'father':
				contactNumber = this.updateStudentForm.controls.f_contact_number.value;
				break;

			case 'mother':
				contactNumber = this.updateStudentForm.controls.motherContact.value;
				break;

			case 'guardian':
				contactNumber = this.updateStudentForm.controls.guardianContact.value;
				break;
		}
    if(contactNumber){
		let obj = {
			mobile: contactNumber,
			guardian: type,
		}
		console.log(obj);
		this.apiService.parentNumberValidation(obj).subscribe(
			(response: any) => {
				if (response && response.body) {
					if (response.status === 200) {
						switch (type) {
							case 'father':
								this.parentNumberExist[0] = false;
								break;

							case 'mother':
								this.parentNumberExist[1] = false;
								break;

							case 'guardian':
								this.parentNumberExist[2] = false;
								break;
						}
					} else {
						switch (type) {
							case 'father':
								this.parentNumberExist[0] = true;
								break;

							case 'mother':
								this.parentNumberExist[1] = true;
								break;

							case 'guardian':
								this.parentNumberExist[2] = true;
								break;
						}
					}
				}
				this.cdr.detectChanges();
				console.log(response)
				this.loaderService.hide();
			}, error => {
				this.loaderService.hide();
			}
		)
    }else{
      this.loaderService.hide();
      return;
    }

	}

  // getStudentdetail() {

  //   let userInfo = localStorage.getItem('info');
  //   let user = JSON.parse(userInfo);
  //   let id: any;

  //   if (user.user_info[0].school_id) {
  //     id = user.user_info[0].school_id;

  //   }
  //   this.apiService.getallstudent(this.students).subscribe((response: any) => {
  //     this.students = response.body.data[0];
  //     console.log(response.body.data[0])

  //     this.createUpdateForm();
  //     this.isLoaded = true;

  //   })
  // }

  createUpdateForm() {
    this.updateStudentForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      username: ['', Validators.required],
      gender: ['', Validators.required],
      class: ['', Validators.required],
      section: [''],
      branch_id: ['', Validators.required],
      address: ['', [ Validators.maxLength(150)]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pinCode: ['', [ Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      aadhaarNo: ['', [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
      STSNo: [''],
      RTEStudent: [''],
      religion: [''],
      caste: [''],
      motherTongue: [''],
      bloodGroup: [''],
      transportation: [''],
      medicalConditions: [''],
      glasses: [''],
      email: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      dob: [''],
      profile_image:[null],
      // Father
      father_name: ['', Validators.maxLength(50)],
      f_contact_number: ['',],
      f_email: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      f_qualification: [''],
      f_aadhar_no: ['', [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],

      motherName: ['', Validators.maxLength(50)],
      motherContact: ['',],
      motherEmail: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      motherQualification: [''],
      motheraadhaarNo: ['', [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],

      guardianName: ['', Validators.maxLength(50)],
      guardianContact: ['',],
      guardianEmail: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      guardianQualification: [''],
      guardianaadhaarNo: ['', [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],

      primaryParent: ['', Validators.required],

      motherLanguage1: [''],
      motherLanguageRead1: [''],
      motherLanguageWrite1: [''],
      motherLanguageSpeak1: [''],
      motherLanguage2: [''],
      motherLanguageRead2: [''],
      motherLanguageWrite2: [''],
      motherLanguageSpeak2: [''],
      motherLanguage3: [''],
      motherLanguageRead3: [''],
      motherLanguageWrite3: [''],
      motherLanguageSpeak3: [''],
      motherLanguage4: [''],
      motherLanguageRead4: [''],
      motherLanguageWrite4: [''],
      motherLanguageSpeak4: [''],


      // Father
      fatherLanguage1: [''],
      fatherLanguageRead1: [''],
      fatherLanguageWrite1: [''],
      fatherLanguageSpeak1: [''],
      fatherLanguage2: [''],
      fatherLanguageRead2: [''],
      fatherLanguageWrite2: [''],
      fatherLanguageSpeak2: [''],
      fatherLanguage3: [''],
      fatherLanguageRead3: [''],
      fatherLanguageWrite3: [''],
      fatherLanguageSpeak3: [''],
      fatherLanguage4: [''],
      fatherLanguageRead4: [''],
      fatherLanguageWrite4: [''],
      fatherLanguageSpeak4: [''],

      // guardian
      guardianLanguage1: [''],
      guardianLanguageRead1: [''],
      guardianLanguageWrite1: [''],
      guardianLanguageSpeak1: [''],
      guardianLanguage2: [''],
      guardianLanguageRead2: [''],
      guardianLanguageWrite2: [''],
      guardianLanguageSpeak2: [''],
      guardianLanguage3: [''],
      guardianLanguageRead3: [''],
      guardianLanguageWrite3: [''],
      guardianLanguageSpeak3: [''],
      guardianLanguage4: [''],
      guardianLanguageRead4: [''],
      guardianLanguageWrite4: [''],
      guardianLanguageSpeak4: [''],
    });
  }

  fillUpdateForm() {
    console.log('Fill',this.students)
    // let subject = this.students.subject.map((x: any) => x.subjectId);
    this.updateStudentForm.controls.name.setValue(this.students.name);
    this.updateStudentForm.controls.username.setValue(this.students.parent_id.username);
    this.updateStudentForm.controls.gender.setValue(this.students.gender);
    this.updateStudentForm.controls.class.setValue(this.students.class.name);
    this.getSections(this.students.class._id);
    this.updateStudentForm.controls.section.setValue(this.students.section.name);
    this.updateStudentForm.controls.branch_id.setValue(this.students.school_id.branch[0]._id);
    this.updateStudentForm.controls.address.setValue(this.students.address);
    this.updateStudentForm.controls.country.setValue(this.students.country_id ? this.students.country_id.country_name : '');
    this.updateStudentForm.controls.state.setValue(this.students.state_id ? this.students.state_id.state_name : '' );
    this.updateStudentForm.controls.city.setValue(this.students.city_id ? this.students.city_id.city_name : '');
    this.updateStudentForm.controls.pinCode.setValue(this.students.pincode);
    this.updateStudentForm.controls.aadhaarNo.setValue(this.students.aadhar);
    this.updateStudentForm.controls.STSNo.setValue(this.students.sts_no);
    this.updateStudentForm.controls.RTEStudent.setValue(this.students.rte_student);
    this.updateStudentForm.controls.religion.setValue(this.students.religion);
    this.updateStudentForm.controls.caste.setValue(this.students.caste);
    this.updateStudentForm.controls.motherTongue.setValue(this.students.mother_tongue);
    this.updateStudentForm.controls.bloodGroup.setValue(this.students.blood_gr);
    this.updateStudentForm.controls.transportation.setValue(this.students.mode_of_transp);
    this.updateStudentForm.controls.medicalConditions.setValue(this.students.medical_cond);
    this.updateStudentForm.controls.glasses.setValue(this.students.wear_glasses);
    this.updateStudentForm.controls.email.setValue(this.students.email);
    this.updateStudentForm.controls['dob'].markAsUntouched();
    if (this.students.dob && this.students.dob != ""  ) {
      this.updateStudentForm.controls.dob.setValue(new Date(this.students.dob));
    }
    else {
      this.updateStudentForm.controls.dob.setValue(new Date(0))
     
    } 
    console.log( this.updateStudentForm.controls.dob)
    this.updateStudentForm.controls.primaryParent.setValue(this.students.parent_id.guardian);
    this.updateStudentForm.controls.father_name.setValue(this.students.parent_id.father_name);
    this.updateStudentForm.controls.f_contact_number.setValue(this.students.parent_id.f_contact_number);
    this.updateStudentForm.controls.f_email.setValue(this.students.parent_id.f_email);
    this.updateStudentForm.controls.f_qualification.setValue(this.students.parent_id.f_qualification);
    this.updateStudentForm.controls.f_aadhar_no.setValue(this.students.parent_id.f_aadhar_no);
    if (this.students.parent_id.language_proficiency ? this.students.parent_id.language_proficiency.length > 0 : '') {
      this.updateStudentForm.controls.fatherLanguage1.setValue(this.students.parent_id.language_proficiency[0].languageOne.languageName);
      this.updateStudentForm.controls.fatherLanguageRead1.setValue(this.students.parent_id.language_proficiency[0].languageOne.read);
      this.updateStudentForm.controls.fatherLanguageWrite1.setValue(this.students.parent_id.language_proficiency[0].languageOne.write);
      this.updateStudentForm.controls.fatherLanguageSpeak1.setValue(this.students.parent_id.language_proficiency[0].languageOne.speak);
      this.updateStudentForm.controls.fatherLanguage2.setValue(this.students.parent_id.language_proficiency[0].languageTwo.languageName);
      this.updateStudentForm.controls.fatherLanguageRead2.setValue(this.students.parent_id.language_proficiency[0].languageTwo.read);
      this.updateStudentForm.controls.fatherLanguageWrite2.setValue(this.students.parent_id.language_proficiency[0].languageTwo.write);
      this.updateStudentForm.controls.fatherLanguageSpeak2.setValue(this.students.parent_id.language_proficiency[0].languageTwo.speak);
      this.updateStudentForm.controls.fatherLanguage3.setValue(this.students.parent_id.language_proficiency[0].languageThree.languageName);
      this.updateStudentForm.controls.fatherLanguageRead3.setValue(this.students.parent_id.language_proficiency[0].languageThree.read);
      this.updateStudentForm.controls.fatherLanguageWrite3.setValue(this.students.parent_id.language_proficiency[0].languageThree.write);
      this.updateStudentForm.controls.fatherLanguageSpeak3.setValue(this.students.parent_id.language_proficiency[0].languageThree.speak);
      this.updateStudentForm.controls.fatherLanguage4.setValue(this.students.parent_id.language_proficiency[0].languageFour.languageName);
      this.updateStudentForm.controls.fatherLanguageRead4.setValue(this.students.parent_id.language_proficiency[0].languageFour.read);
      this.updateStudentForm.controls.fatherLanguageWrite4.setValue(this.students.parent_id.language_proficiency[0].languageFour.write);
      this.updateStudentForm.controls.fatherLanguageSpeak4.setValue(this.students.parent_id.language_proficiency[0].languageFour.speak);
    }
    this.updateStudentForm.controls.motherName.setValue(this.students.parent_id.mother_name);
    this.updateStudentForm.controls.motherContact.setValue(this.students.parent_id.m_contact_number);
    this.updateStudentForm.controls.motherEmail.setValue(this.students.parent_id.m_email);
    this.updateStudentForm.controls.motherQualification.setValue(this.students.parent_id.m_qualification);
    this.updateStudentForm.controls.motheraadhaarNo.setValue(this.students.parent_id.m_aadhar_no);
    if (this.students.parent_id.m_language_proficiency ? this.students.parent_id.m_language_proficiency.length > 0 : '') {
      this.updateStudentForm.controls.motherLanguage1.setValue(this.students.parent_id.m_language_proficiency[0].languageOne.languageName);
      this.updateStudentForm.controls.motherLanguageRead1.setValue(this.students.parent_id.m_language_proficiency[0].languageOne.read);
      this.updateStudentForm.controls.motherLanguageWrite1.setValue(this.students.parent_id.m_language_proficiency[0].languageOne.write);
      this.updateStudentForm.controls.motherLanguageSpeak1.setValue(this.students.parent_id.m_language_proficiency[0].languageOne.speak);
      this.updateStudentForm.controls.motherLanguage2.setValue(this.students.parent_id.m_language_proficiency[0].languageTwo.languageName);
      this.updateStudentForm.controls.motherLanguageRead2.setValue(this.students.parent_id.m_language_proficiency[0].languageTwo.read);
      this.updateStudentForm.controls.motherLanguageWrite2.setValue(this.students.parent_id.m_language_proficiency[0].languageTwo.write);
      this.updateStudentForm.controls.motherLanguageSpeak2.setValue(this.students.parent_id.m_language_proficiency[0].languageTwo.speak);
      this.updateStudentForm.controls.motherLanguage3.setValue(this.students.parent_id.m_language_proficiency[0].languageThree.languageName);
      this.updateStudentForm.controls.motherLanguageRead3.setValue(this.students.parent_id.m_language_proficiency[0].languageThree.read);
      this.updateStudentForm.controls.motherLanguageWrite3.setValue(this.students.parent_id.m_language_proficiency[0].languageThree.write);
      this.updateStudentForm.controls.motherLanguageSpeak3.setValue(this.students.parent_id.m_language_proficiency[0].languageThree.speak);
      this.updateStudentForm.controls.motherLanguage4.setValue(this.students.parent_id.m_language_proficiency[0].languageFour.languageName);
      this.updateStudentForm.controls.motherLanguageRead4.setValue(this.students.parent_id.m_language_proficiency[0].languageFour.read);
      this.updateStudentForm.controls.motherLanguageWrite4.setValue(this.students.parent_id.m_language_proficiency[0].languageFour.write);
      this.updateStudentForm.controls.motherLanguageSpeak4.setValue(this.students.parent_id.m_language_proficiency[0].languageFour.speak);
    }
    this.updateStudentForm.controls.guardianName.setValue(this.students.parent_id.guardian_name);
    this.updateStudentForm.controls.guardianContact.setValue(this.students.parent_id.guardian_mobile);
    this.updateStudentForm.controls.guardianEmail.setValue(this.students.parent_id.g_email);
    this.updateStudentForm.controls.guardianQualification.setValue(this.students.parent_id.g_qualification);
    this.updateStudentForm.controls.guardianaadhaarNo.setValue(this.students.parent_id.g_aadhar);
    if (this.students.parent_id.g_language_proficiency ? this.students.parent_id.g_language_proficiency.length > 0 : '') {
      this.updateStudentForm.controls.guardianLanguage1.setValue(this.students.parent_id.g_language_proficiency[0].languageOne.languageName);
      this.updateStudentForm.controls.guardianLanguageRead1.setValue(this.students.parent_id.g_language_proficiency[0].languageOne.read);
      this.updateStudentForm.controls.guardianLanguageWrite1.setValue(this.students.parent_id.g_language_proficiency[0].languageOne.write);
      this.updateStudentForm.controls.guardianLanguageSpeak1.setValue(this.students.parent_id.g_language_proficiency[0].languageOne.speak);
      this.updateStudentForm.controls.guardianLanguage2.setValue(this.students.parent_id.g_language_proficiency[0].languageTwo.languageName);
      this.updateStudentForm.controls.guardianLanguageRead2.setValue(this.students.parent_id.g_language_proficiency[0].languageTwo.read);
      this.updateStudentForm.controls.guardianLanguageWrite2.setValue(this.students.parent_id.g_language_proficiency[0].languageTwo.write);
      this.updateStudentForm.controls.guardianLanguageSpeak2.setValue(this.students.parent_id.g_language_proficiency[0].languageTwo.speak);
      this.updateStudentForm.controls.guardianLanguage3.setValue(this.students.parent_id.g_language_proficiency[0].languageThree.languageName);
      this.updateStudentForm.controls.guardianLanguageRead3.setValue(this.students.parent_id.g_language_proficiency[0].languageThree.read);
      this.updateStudentForm.controls.guardianLanguageWrite3.setValue(this.students.parent_id.g_language_proficiency[0].languageThree.write);
      this.updateStudentForm.controls.guardianLanguageSpeak3.setValue(this.students.parent_id.g_language_proficiency[0].languageThree.speak);
      this.updateStudentForm.controls.guardianLanguage4.setValue(this.students.parent_id.g_language_proficiency[0].languageFour.languageName);
      this.updateStudentForm.controls.guardianLanguageRead4.setValue(this.students.parent_id.g_language_proficiency[0].languageFour.read);
      this.updateStudentForm.controls.guardianLanguageWrite4.setValue(this.students.parent_id.g_language_proficiency[0].languageFour.write);
      this.updateStudentForm.controls.guardianLanguageSpeak4.setValue(this.students.parent_id.g_language_proficiency[0].languageFour.speak);
    }
    this.updateStudentForm.controls.profile_image.setValue(this.students.profile_image);
    this.filePreview=this.students.profile_image;

    console.log('Form',this.updateStudentForm)
  
  }

  onFileUpload(event){
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
          this.updateStudentForm.controls['profile_image'].setValue(response.body.message)
          this.students.profile_image = response.body.message;
          console.log('Profile Picture',response.body.message)
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

  updateStudent() {
    // const studentData = {
    //   'student_id': [this.students._id],
    //   'parent_id': [this.students.parent_id],
    //   'gender': this.updateStudentForm.controls.gender.value,
    //   'passport_image': this.profilePicture,
    //   'school_id': localStorage.getItem('schoolId'), // Make the value dynamic
    //   'branch_id': this.updateStudentForm.controls.branch_id.value, // Make the value dynamic
    //   'name': this.updateStudentForm.controls.name.value,
    //   'username': '',
    //   'password': '',
    //   'p_username': '',
    //   'p_password': this.randomPass,
    //   'guardian': this.updateStudentForm.controls.primaryParent.value,
    //   'contact_number': '',
    //   'dob': new Date(this.updateStudentForm.controls.dob.value).toLocaleDateString(),
    //   'email': this.updateStudentForm.controls.email.value,
    //   'subject': this.updateStudentForm.controls.subject.value,
    //   'address': this.updateStudentForm.controls.address.value,
    //   'aadhar': this.updateStudentForm.controls.aadhaarNo.value,
    //   'sts_no': this.updateStudentForm.controls.STSNo.value,
    //   'rte_student': this.updateStudentForm.controls.RTEStudent.value,
    //   'caste': this.updateStudentForm.controls.caste.value,
    //   'city': this.updateStudentForm.controls.city.value,
    //   'state': this.updateStudentForm.controls.state.value,
    //   'country': this.updateStudentForm.controls.country.value,
    //   'pincode': this.updateStudentForm.controls.pinCode.value,
    //   'mother_tongue': this.updateStudentForm.controls.motherTongue.value,
    //   'blood_gr': this.updateStudentForm.controls.bloodGroup.value,
    //   'mode_of_transp': this.updateStudentForm.controls.transportation.value,
    //   'medical_cond': this.updateStudentForm.controls.medicalConditions.value,
    //   'wear_glasses': this.updateStudentForm.controls.glasses.value,
    //   'class': this.updateStudentForm.controls.class.value,

    //   // 'section': this.studentForm.controls.section.value,
    //   'religion': this.updateStudentForm.controls.religion.value,
    //   'primaryParent': this.updateStudentForm.controls.primaryParent.value,
    //   'father_name': this.updateStudentForm.controls.father_name.value,
    //   'f_contact_number': this.updateStudentForm.controls.f_contact_number.value,
    //   'mobile_to_reg_student': this.updateStudentForm.controls.f_contact_number.value,
    //   'f_email': this.updateStudentForm.controls.f_email.value,
    //   'f_qualification': this.updateStudentForm.controls.f_qualification.value,
    //   'f_aadhar_no': this.updateStudentForm.controls.f_aadhar_no.value,
    //   'language_proficiency': [{
    //     'languageOne': {
    //       'languageName': this.updateStudentForm.controls.fatherLanguage1.value,
    //       'read': this.updateStudentForm.controls.fatherLanguageRead1.value,
    //       'write': this.updateStudentForm.controls.fatherLanguageWrite1.value,
    //       'speak': this.updateStudentForm.controls.fatherLanguageSpeak1.value,
    //     },
    //     'languageTwo': {
    //       'languageName': this.updateStudentForm.controls.fatherLanguage2.value,
    //       'read': this.updateStudentForm.controls.fatherLanguageRead2.value,
    //       'write': this.updateStudentForm.controls.fatherLanguageWrite2.value,
    //       'speak': this.updateStudentForm.controls.fatherLanguageSpeak2.value,
    //     },
    //     'languageThree': {
    //       'languageName': this.updateStudentForm.controls.fatherLanguage3.value,
    //       'read': this.updateStudentForm.controls.fatherLanguageRead3.value,
    //       'write': this.updateStudentForm.controls.fatherLanguageWrite3.value,
    //       'speak': this.updateStudentForm.controls.fatherLanguageSpeak3.value,
    //     },
    //     'languageFour': {
    //       'languageName': this.updateStudentForm.controls.fatherLanguage4.value,
    //       'read': this.updateStudentForm.controls.fatherLanguageRead4.value,
    //       'write': this.updateStudentForm.controls.fatherLanguageWrite4.value,
    //       'speak': this.updateStudentForm.controls.fatherLanguageSpeak4.value,
    //     },
    //   }],
    //   'mother_name': this.updateStudentForm.controls.motherName.value,
    //   'm_contact_number': this.updateStudentForm.controls.motherContact.value,
    //   'm_mobile_to_reg_student': this.updateStudentForm.controls.motherContact.value,
    //   'm_email': this.updateStudentForm.controls.motherEmail.value,
    //   'm_qualification': this.updateStudentForm.controls.motherQualification.value,
    //   'm_aadhar_no': this.updateStudentForm.controls.motheraadhaarNo.value,
    //   'm_language_proficiency': [{
    //     'languageOne': {
    //       'languageName': this.updateStudentForm.controls.motherLanguage1.value,
    //       'read': this.updateStudentForm.controls.motherLanguageRead1.value,
    //       'write': this.updateStudentForm.controls.motherLanguageWrite1.value,
    //       'speak': this.updateStudentForm.controls.motherLanguageSpeak1.value,
    //     },
    //     'languageTwo': {
    //       'languageName': this.updateStudentForm.controls.motherLanguage2.value,
    //       'read': this.updateStudentForm.controls.motherLanguageRead2.value,
    //       'write': this.updateStudentForm.controls.motherLanguageWrite2.value,
    //       'speak': this.updateStudentForm.controls.motherLanguageSpeak2.value,
    //     },
    //     'languageThree': {
    //       'languageName': this.updateStudentForm.controls.motherLanguage3.value,
    //       'read': this.updateStudentForm.controls.motherLanguageRead3.value,
    //       'write': this.updateStudentForm.controls.motherLanguageWrite3.value,
    //       'speak': this.updateStudentForm.controls.motherLanguageSpeak3.value,
    //     },
    //     'languageFour': {
    //       'languageName': this.updateStudentForm.controls.motherLanguage4.value,
    //       'read': this.updateStudentForm.controls.motherLanguageRead4.value,
    //       'write': this.updateStudentForm.controls.motherLanguageWrite4.value,
    //       'speak': this.updateStudentForm.controls.motherLanguageSpeak4.value,
    //     },
    //   }],
    //   'guardian_name': this.updateStudentForm.controls.guardianName.value,
    //   'guardian_mobile': this.updateStudentForm.controls.guardianContact.value,
    //   'guardian_mobile_to_reg_student': this.updateStudentForm.controls.guardianContact.value,
    //   'g_email': this.updateStudentForm.controls.guardianEmail.value,
    //   'g_qualificaton': this.updateStudentForm.controls.guardianQualification.value,
    //   'g_aadhar': this.updateStudentForm.controls.guardianaadhaarNo.value,
    //   // 'g_language_proficiency' : '',
    //   'g_language_proficiency': [{
    //     'languageOne': {
    //       'languageName': this.updateStudentForm.controls.guardianLanguage1.value,
    //       'read': this.updateStudentForm.controls.guardianLanguageRead1.value,
    //       'write': this.updateStudentForm.controls.guardianLanguageWrite1.value,
    //       'speak': this.updateStudentForm.controls.guardianLanguageSpeak1.value,
    //     },
    //     'languageTwo': {
    //       'languageName': this.updateStudentForm.controls.guardianLanguage2.value,
    //       'read': this.updateStudentForm.controls.guardianLanguageRead2.value,
    //       'write': this.updateStudentForm.controls.guardianLanguageWrite2.value,
    //       'speak': this.updateStudentForm.controls.guardianLanguageSpeak2.value,
    //     },
    //     'languageThree': {
    //       'languageName': this.updateStudentForm.controls.guardianLanguage3.value,
    //       'read': this.updateStudentForm.controls.guardianLanguageRead3.value,
    //       'write': this.updateStudentForm.controls.guardianLanguageWrite3.value,
    //       'speak': this.updateStudentForm.controls.guardianLanguageSpeak3.value,
    //     },
    //     'languageFour': {
    //       'languageName': this.updateStudentForm.controls.guardianLanguage4.value,
    //       'read': this.updateStudentForm.controls.guardianLanguageRead4.value,
    //       'write': this.updateStudentForm.controls.guardianLanguageWrite4.value,
    //       'speak': this.updateStudentForm.controls.guardianLanguageSpeak4.value,
    //     },
    //   }]
    // }
    this.studentUpdateRequest.student_id = this.students._id;
    this.studentUpdateRequest.parent_id = this.students.parent_id._id;
    this.studentUpdateRequest.school_id = this.students.school_id;
    this.studentUpdateRequest.profile_image = this.students.profile_image;
    console.log('Profile',this.studentUpdateRequest.profile_image)
    this.studentUpdateRequest.name = this.updateStudentForm.controls.name.value;
    this.studentUpdateRequest.gender = this.updateStudentForm.controls.gender.value;
    this.studentUpdateRequest.class = 
    
     this.updateStudentForm.controls.class.value.length > 23 ? this.updateStudentForm.controls.class.value : this.students.class._id ;
    
    this.studentUpdateRequest.section = this.updateStudentForm.controls.section.value.length > 23 ? this.updateStudentForm.controls.section.value : this.students.section._id ;
    this.studentUpdateRequest.branch_id = this.updateStudentForm.controls.branch_id.value;
    this.studentUpdateRequest.address = this.updateStudentForm.controls.address.value;
    this.studentUpdateRequest.country =  this.updateStudentForm.controls.country.value.length > 23 ? this.updateStudentForm.controls.country.value  : this.students.country_id ;
    this.studentUpdateRequest.state = this.updateStudentForm.controls.state.value.length > 23   ? this.updateStudentForm.controls.state.value : this.students.state_id ;
    this.studentUpdateRequest.city =  this.updateStudentForm.controls.city.value.length > 23 ? this.updateStudentForm.controls.city.value : this.students.city_id ;
    this.studentUpdateRequest.pincode = this.updateStudentForm.controls.pinCode.value;
    this.studentUpdateRequest.aadhar = this.updateStudentForm.controls.aadhaarNo.value;
    this.studentUpdateRequest.sts_no = this.updateStudentForm.controls.STSNo.value;
    this.studentUpdateRequest.rte_student = this.updateStudentForm.controls.RTEStudent.value;
    this.studentUpdateRequest.religion = this.updateStudentForm.controls.religion.value;
    this.studentUpdateRequest.caste = this.updateStudentForm.controls.caste.value;
    this.studentUpdateRequest.mother_tongue = this.updateStudentForm.controls.motherTongue.value;
    this.studentUpdateRequest.blood_gr = this.updateStudentForm.controls.bloodGroup.value;
    this.studentUpdateRequest.mode_of_transp = this.updateStudentForm.controls.transportation.value;
    this.studentUpdateRequest.medical_cond = this.updateStudentForm.controls.medicalConditions.value;
    this.studentUpdateRequest.wear_glasses = this.updateStudentForm.controls.glasses.value;
    this.studentUpdateRequest.email = this.updateStudentForm.controls.email.value;
    this.studentUpdateRequest.dob = this.updateStudentForm.controls.dob.value != "" ? new Date(this.updateStudentForm.controls.dob.value).toLocaleDateString() : new Date().toLocaleDateString();
    // this.studentUpdateRequest.dob = new Date(this.updateStudentForm.controls.dob.value).toLocaleDateString();
    this.studentUpdateRequest.guardian = this.updateStudentForm.controls.primaryParent.value;
    this.studentUpdateRequest.primaryParent = this.updateStudentForm.controls.primaryParent.value;
    //if(this.students.parent_id.guardian!='father')
    //{
    this.studentUpdateRequest.f_contact_number = this.updateStudentForm.controls.f_contact_number.value;
    //}
    this.studentUpdateRequest.father_name = this.updateStudentForm.controls.father_name.value;
    this.studentUpdateRequest.f_email = this.updateStudentForm.controls.f_email.value;
    this.studentUpdateRequest.f_qualification = this.updateStudentForm.controls.f_qualification.value;
    this.studentUpdateRequest.mobile_to_reg_student = this.updateStudentForm.controls.f_contact_number.value 
    ? this.updateStudentForm.controls.f_contact_number.value : this.updateStudentForm.controls.motherContact.value ? this.updateStudentForm.controls.motherContact.value : this.updateStudentForm.controls.guardianContact.value ;
    this.studentUpdateRequest.f_aadhar_no = this.updateStudentForm.controls.f_aadhar_no.value;
    this.studentUpdateRequest.language_proficiency = [];
    let languagedetails: LanguageList = <LanguageList>{};
    languagedetails.languageOne = <LanguageDetails>{};
    languagedetails.languageOne.languageName = this.updateStudentForm.controls.fatherLanguage1.value;
    languagedetails.languageOne.read = this.updateStudentForm.controls.fatherLanguageRead1.value;
    languagedetails.languageOne.write = this.updateStudentForm.controls.fatherLanguageWrite1.value;
    languagedetails.languageOne.speak = this.updateStudentForm.controls.fatherLanguageSpeak1.value;
    languagedetails.languageTwo = <LanguageDetails>{};
    languagedetails.languageTwo.languageName = this.updateStudentForm.controls.fatherLanguage2.value;
    languagedetails.languageTwo.read = this.updateStudentForm.controls.fatherLanguageRead2.value;
    languagedetails.languageTwo.write = this.updateStudentForm.controls.fatherLanguageWrite2.value;
    languagedetails.languageTwo.speak = this.updateStudentForm.controls.fatherLanguageSpeak2.value;
    languagedetails.languageThree = <LanguageDetails>{};
    languagedetails.languageThree.languageName = this.updateStudentForm.controls.fatherLanguage3.value;
    languagedetails.languageThree.read = this.updateStudentForm.controls.fatherLanguageRead3.value;
    languagedetails.languageThree.write = this.updateStudentForm.controls.fatherLanguageWrite3.value;
    languagedetails.languageThree.speak = this.updateStudentForm.controls.fatherLanguageSpeak3.value;
    languagedetails.languageFour = <LanguageDetails>{};
    languagedetails.languageFour.languageName = this.updateStudentForm.controls.fatherLanguage4.value;
    languagedetails.languageFour.read = this.updateStudentForm.controls.fatherLanguageRead4.value;
    languagedetails.languageFour.write = this.updateStudentForm.controls.fatherLanguageWrite4.value;
    languagedetails.languageFour.speak = this.updateStudentForm.controls.fatherLanguageSpeak4.value;
    this.studentUpdateRequest.language_proficiency.push(languagedetails);
    this.studentUpdateRequest.mother_name = this.updateStudentForm.controls.motherName.value;
    //if(this.students.parent_id.guardian!='mother')
    //{
    this.studentUpdateRequest.m_contact_number = this.updateStudentForm.controls.motherContact.value;
    //}
    this.studentUpdateRequest.m_email = this.updateStudentForm.controls.motherEmail.value;
    this.studentUpdateRequest.m_qualification = this.updateStudentForm.controls.motherQualification.value;
    this.studentUpdateRequest.m_aadhar_no = this.updateStudentForm.controls.motheraadhaarNo.value;
    this.studentUpdateRequest.m_mobile_to_reg_student = this.updateStudentForm.controls.motherContact.value;

    this.studentUpdateRequest.m_language_proficiency = [];
    let m_languagedetails: LanguageList = <LanguageList>{};
    m_languagedetails.languageOne = <LanguageDetails>{};
    m_languagedetails.languageOne.languageName = this.updateStudentForm.controls.motherLanguage1.value;
    m_languagedetails.languageOne.read = this.updateStudentForm.controls.motherLanguageRead1.value;
    m_languagedetails.languageOne.write = this.updateStudentForm.controls.motherLanguageWrite1.value;
    m_languagedetails.languageOne.speak = this.updateStudentForm.controls.motherLanguageSpeak1.value;
    m_languagedetails.languageTwo = <LanguageDetails>{};
    m_languagedetails.languageTwo.languageName = this.updateStudentForm.controls.motherLanguage2.value;
    m_languagedetails.languageTwo.read = this.updateStudentForm.controls.motherLanguageRead2.value;
    m_languagedetails.languageTwo.write = this.updateStudentForm.controls.motherLanguageWrite2.value;
    m_languagedetails.languageTwo.speak = this.updateStudentForm.controls.motherLanguageSpeak2.value;
    m_languagedetails.languageThree = <LanguageDetails>{};
    m_languagedetails.languageThree.languageName = this.updateStudentForm.controls.motherLanguage3.value;
    m_languagedetails.languageThree.read = this.updateStudentForm.controls.motherLanguageRead3.value;
    m_languagedetails.languageThree.write = this.updateStudentForm.controls.motherLanguageWrite3.value;
    m_languagedetails.languageThree.speak = this.updateStudentForm.controls.motherLanguageSpeak3.value;
    m_languagedetails.languageFour = <LanguageDetails>{};
    m_languagedetails.languageFour.languageName = this.updateStudentForm.controls.motherLanguage4.value;
    m_languagedetails.languageFour.read = this.updateStudentForm.controls.motherLanguageRead4.value;
    m_languagedetails.languageFour.write = this.updateStudentForm.controls.motherLanguageWrite4.value;
    m_languagedetails.languageFour.speak = this.updateStudentForm.controls.motherLanguageSpeak4.value;
    this.studentUpdateRequest.m_language_proficiency.push(m_languagedetails);
    this.studentUpdateRequest.guardian_name = this.updateStudentForm.controls.guardianName.value;
    //if(this.students.parent_id.guardian!='guardian')
    //{
    this.studentUpdateRequest.guardian_mobile = this.updateStudentForm.controls.guardianContact.value;
    //}
    this.studentUpdateRequest.g_email = this.updateStudentForm.controls.guardianEmail.value;
    this.studentUpdateRequest.g_qualificaton = this.updateStudentForm.controls.guardianQualification.value;
    this.studentUpdateRequest.g_aadhar = this.updateStudentForm.controls.guardianaadhaarNo.value;
    this.studentUpdateRequest.guardian_mobile_to_reg_student = this.updateStudentForm.controls.guardianContact.value;
    this.studentUpdateRequest.g_language_proficiency = [];
    let g_language_proficiency: LanguageList = <LanguageList>{};
    g_language_proficiency.languageOne = <LanguageDetails>{};
    g_language_proficiency.languageOne.languageName = this.updateStudentForm.controls.guardianLanguage1.value;
    g_language_proficiency.languageOne.read = this.updateStudentForm.controls.guardianLanguageRead1.value;
    g_language_proficiency.languageOne.write = this.updateStudentForm.controls.guardianLanguageWrite1.value;
    g_language_proficiency.languageOne.speak = this.updateStudentForm.controls.guardianLanguageSpeak1.value;
    g_language_proficiency.languageTwo = <LanguageDetails>{};
    g_language_proficiency.languageTwo.languageName = this.updateStudentForm.controls.guardianLanguage2.value;
    g_language_proficiency.languageTwo.read = this.updateStudentForm.controls.guardianLanguageRead2.value;
    g_language_proficiency.languageTwo.write = this.updateStudentForm.controls.guardianLanguageWrite2.value;
    g_language_proficiency.languageTwo.speak = this.updateStudentForm.controls.guardianLanguageSpeak2.value;
    g_language_proficiency.languageThree = <LanguageDetails>{};
    g_language_proficiency.languageThree.languageName = this.updateStudentForm.controls.guardianLanguage3.value;
    g_language_proficiency.languageThree.read = this.updateStudentForm.controls.guardianLanguageRead3.value;
    g_language_proficiency.languageThree.write = this.updateStudentForm.controls.guardianLanguageWrite3.value;
    g_language_proficiency.languageThree.speak = this.updateStudentForm.controls.guardianLanguageSpeak3.value;
    g_language_proficiency.languageFour = <LanguageDetails>{};
    g_language_proficiency.languageFour.languageName = this.updateStudentForm.controls.guardianLanguage4.value;
    g_language_proficiency.languageFour.read = this.updateStudentForm.controls.guardianLanguageRead4.value;
    g_language_proficiency.languageFour.write = this.updateStudentForm.controls.guardianLanguageWrite4.value;
    g_language_proficiency.languageFour.speak = this.updateStudentForm.controls.guardianLanguageSpeak4.value;
    this.studentUpdateRequest.g_language_proficiency.push(g_language_proficiency);

    if (this.updateStudentForm.controls.primaryParent.value == 'father') {
      if (this.updateStudentForm.controls.father_name.value && this.updateStudentForm.controls.f_contact_number.value) {
        this.updateStudentForm.controls['username'] = this.updateStudentForm.controls.f_contact_number.value;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'please enter Father name and mobile number' });
        return;
      }
    }
    if (this.updateStudentForm.controls.primaryParent.value == 'mother') {
      if (this.updateStudentForm.controls.motherName.value && this.updateStudentForm.controls.motherContact.value) {
        this.updateStudentForm.controls['username']= this.updateStudentForm.controls.motherContact.value
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'please enter Mother name and mobile number' });
        return;
      }
    }
    if (this.updateStudentForm.controls.primaryParent.value == 'guardian') {
      if (this.updateStudentForm.controls.guardianName.value && this.updateStudentForm.controls.guardianContact.value) {
        this.updateStudentForm.controls['username'] = this.updateStudentForm.controls.guardianContact.value
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'please enter Guardian name and mobile number' });
        return;
      }
    }
    console.log('Profile',this.studentUpdateRequest)
    this.apiService.updateStudent(this.studentUpdateRequest).subscribe((response: any) => {
      console.log(response)
      Swal.fire('Success', 'Updated', 'success');
      let element = document.getElementById('reset') as HTMLElement;
      element.click();
      this.activeModal.close('success');
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
        return;
      }
    })
  }

}

