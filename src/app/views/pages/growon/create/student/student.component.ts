// Angular
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
// Service
import { CreateservicesService } from '../services/createservices.service';
import Swal from 'sweetalert2';
import { StudentAddRequest } from '../../model/studentsaddrequest.model';
import { LanguageList } from '../../model/languagelist.model';
import { LanguageDetails } from '../../model/languagedetails.model';
import { LoadingService } from '../../../loader/loading/loading.service';

@Component({
	selector: 'kt-student',
	templateUrl: './student.component.html',
	styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
	// Public params
	studentForm: FormGroup;
	cities: any[] = [];
	states: any[] = [];
	countries: any[] = [];
	gender: string[] = ['Male', 'Female'];
	transportationMode: string[] = ['Parent', 'Private Auto', 'Private Bus', 'By Walk', 'By Cycle'];
	medicalConditions: string[] = ['None', 'Asthma', 'Allergies', 'Diabetes', 'Epilepsy', 'Heart Disease', 'Ophthalmic Defect', 'Auditory defect', 'hearing loss', 'Differently Able'];
	boolean: string[] = ['Yes', 'No'];
	classes: Array<string> = ['Get from DB', 'Get from DB'];
	class: string[] = [];
	primaryParent: any[] = [{ 'name': 'Father', 'value': 'father' }, { 'name': 'Mother', 'value': 'mother' }, { 'name': 'Guardian', 'value': 'guardian' }];
	sections: Array<string>;
	parentQualification: string[] = ['10th', '12th', 'degree', 'masters degree', 'others'];
	subjects: any;
	countOfFour: Array<any> = [1, 2, 3, 4];
	branches: Array<any> = [];
	randomPassStudent: any = Math.random().toString(36).slice(-12);
	randomPassParent: any = Math.random().toString(36).slice(-12);
	//settings: any;
	profilePicture: any;
	filePreview: any;
	studentAddRequest: StudentAddRequest = <StudentAddRequest>{};
	addSectionName: any
	classRequiredFlag: boolean = false
	parentNumberExist: any = [false, false, false];

	constructor(private _formBuilder: FormBuilder, private cdr: ChangeDetectorRef,
		private apiService: CreateservicesService, private loaderService: LoadingService) { }

	ngOnInit(): void {
		this.initializeForm();
		this.getCountries();
		this.getStates();
		this.getCities();
		this.getBranches();
		this.getClasses();
		this.getSubjects();
		this.getallinstitutes();
		//this.getSections();
	}

	initializeForm() {
		this.studentForm = this._formBuilder.group({
			name: ['', [Validators.required, Validators.maxLength(50)]],
			dob: ['',],
			gender: ['', Validators.required],
			address: ['', [Validators.maxLength(150)]],
			branch: ['', Validators.required],
			username: [''],
			email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],

			// Father
			fatherName: [, Validators.maxLength(50)],
			fatherContact: [, [Validators.required]],
			fatherEmail: [, [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
			fatherQualification: [],
			fatheraadhaarNo: [, [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
			// Mother
			motherName: [, Validators.maxLength(50)],
			motherContact: [, [Validators.required]],
			motherEmail: [, [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
			motherQualification: [],
			motheraadhaarNo: [, [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
			// Guardian
			guardianName: ['', Validators.maxLength(50)],
			guardianContact: ['', [Validators.required]],
			guardianEmail: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
			guardianQualification: [''],
			guardianaadhaarNo: ['', [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],

			primaryParent: ['', Validators.required],
			aadhaarNo: ['', [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
			city: ['',Validators.required],
			state: ['',Validators.required ],
			country: ['',Validators.required],
			pinCode: ['', [ Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
			STSNo: ['',],
			RTEStudent: ['',],
			religion: ['',],
			caste: ['',],
			motherTongue: ['',],
			bloodGroup: ['',],
			transportation: ['',],
			medicalConditions: [''],
			glasses: [''],
			class: ['', Validators.required],
			section: [null],
			// Language proficiency
			// Mother
			motherLanguage1: [],
			motherLanguageRead1: [],
			motherLanguageWrite1: [],
			motherLanguageSpeak1: [],
			motherLanguage2: [],
			motherLanguageRead2: [],
			motherLanguageWrite2: [],
			motherLanguageSpeak2: [],
			motherLanguage3: [],
			motherLanguageRead3: [],
			motherLanguageWrite3: [],
			motherLanguageSpeak3: [],
			motherLanguage4: [],
			motherLanguageRead4: [],
			motherLanguageWrite4: [],
			motherLanguageSpeak4: [],
			// Father
			fatherLanguage1: [],
			fatherLanguageRead1: [],
			fatherLanguageWrite1: [],
			fatherLanguageSpeak1: [],
			fatherLanguage2: [],
			fatherLanguageRead2: [],
			fatherLanguageWrite2: [],
			fatherLanguageSpeak2: [],
			fatherLanguage3: [],
			fatherLanguageRead3: [],
			fatherLanguageWrite3: [],
			fatherLanguageSpeak3: [],
			fatherLanguage4: [],
			fatherLanguageRead4: [],
			fatherLanguageWrite4: [],
			fatherLanguageSpeak4: [],
			// guardian
			guardianLanguage1: [],
			guardianLanguageRead1: [],
			guardianLanguageWrite1: [],
			guardianLanguageSpeak1: [],
			guardianLanguage2: [],
			guardianLanguageRead2: [],
			guardianLanguageWrite2: [],
			guardianLanguageSpeak2: [],
			guardianLanguage3: [],
			guardianLanguageRead3: [],
			guardianLanguageWrite3: [],
			guardianLanguageSpeak3: [],
			guardianLanguage4: [],
			guardianLanguageRead4: [],
			guardianLanguageWrite4: [],
			guardianLanguageSpeak4: [],
		});

		this.studentForm.get('primaryParent').valueChanges.subscribe(val => {
			if (this.studentForm.controls.primaryParent.value == 'father') { // for setting validations
				this.studentForm.get('fatherName').setValidators(Validators.required);
				this.studentForm.get('fatherContact').setValidators(Validators.required);


			}
			if (this.studentForm.controls.primaryParent.value == 'mother' ||
				this.studentForm.controls.primaryParent.value == 'guardian') {// for clearing validations

				this.studentForm.get('fatherName').clearValidators();
				this.studentForm.get('fatherContact').clearValidators();
			}
			this.studentForm.get('fatherName').updateValueAndValidity();
			this.studentForm.get('fatherContact').updateValueAndValidity();
		});

		this.studentForm.get('primaryParent').valueChanges.subscribe(val => {
			if (this.studentForm.controls.primaryParent.value == 'mother') { // for setting validations
				this.studentForm.get('motherName').setValidators(Validators.required);
				this.studentForm.get('motherContact').setValidators(Validators.required);


			}
			if (this.studentForm.controls.primaryParent.value == 'father' ||
				this.studentForm.controls.primaryParent.value == 'guardian') { // for clearing validations
				this.studentForm.get('motherName').clearValidators();
				this.studentForm.get('motherContact').clearValidators();
			}
			this.studentForm.get('motherName').updateValueAndValidity();
			this.studentForm.get('motherContact').updateValueAndValidity();
		});

		this.studentForm.get('primaryParent').valueChanges.subscribe(val => {
			if (this.studentForm.controls.primaryParent.value == 'guardian') { // for setting validations
				this.studentForm.get('guardianName').setValidators(Validators.required);
				this.studentForm.get('guardianContact').setValidators(Validators.required);


			}
			if (this.studentForm.controls.primaryParent.value == 'father' ||
				this.studentForm.controls.primaryParent.value == 'mother') { // for clearing validations
				this.studentForm.get('guardianName').clearValidators();
				this.studentForm.get('guardianContact').clearValidators();
			}
			this.studentForm.get('guardianName').updateValueAndValidity();
			this.studentForm.get('guardianContact').updateValueAndValidity();
		});
	}

	getCountries() {
		this.apiService.getCountries().subscribe((response: any) => {
			this.countries = response.body.data;
		})
	}

	getStates() {
		this.studentForm.get('country').valueChanges.subscribe(val => {
			this.apiService.getStates().subscribe((response: any) => {
				this.states = response.body.data.filter(usr => {
					return usr.country_id == this.studentForm.controls.country.value
				})
			})
		})
	}

	getCities() {
		this.studentForm.get('state').valueChanges.subscribe(val => {
			this.apiService.getCities().subscribe((response: any) => {
				this.cities = response.body.data.filter(usr => {
					return usr.state_id == this.studentForm.controls.state.value
				})
			})
		})
	}

	getClasses() {
		this.apiService.getClasses().subscribe((response: any) => {
			this.classes = response.body.data;
			console.log(this.classes, "this.classes")
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

	primaryClassChange(event: any) {
		if (event == "") {
			this.studentForm.controls.section.setValue("");
		}
		else {
			this.getSections(event);
			this.studentForm.controls.section.setValue("");
		}
	}

	getSections(classId: string) {
		this.apiService.getSections(classId).subscribe((response: any) => {
			this.sections = response.body.data;
		})
	}

	checkParentValidation(type) {
		this.loaderService.show();
		let contactNumber;
		switch (type) {
			case 'father':
				contactNumber = this.studentForm.controls.fatherContact.value;
				break;

			case 'mother':
				contactNumber = this.studentForm.controls.motherContact.value;
				break;

			case 'guardian':
				contactNumber = this.studentForm.controls.guardianContact.value;
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
					console.log(response.status)
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
			console.log('formData', formData);
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
	// createStudent
	createStudent() {
		console.log(this.parentNumberExist.every(v => v === false))
		if (this.parentNumberExist.every(v => v === false)) {
			this.studentAddRequest.school_id = localStorage.getItem('schoolId');
			this.studentAddRequest.profile_image = this.profilePicture;
			this.studentAddRequest.name = this.studentForm.controls.name.value;
			this.studentAddRequest.gender = this.studentForm.controls.gender.value;
			this.studentAddRequest.class = this.studentForm.controls.class.value;
			this.studentAddRequest.branch_id = this.studentForm.controls.branch.value;
			this.studentAddRequest.address = this.studentForm.controls.address.value;
			this.studentAddRequest.country = this.studentForm.controls.country.value;
			this.studentAddRequest.state = this.studentForm.controls.state.value;
			this.studentAddRequest.city = this.studentForm.controls.city.value;
			this.studentAddRequest.pincode = this.studentForm.controls.pinCode.value;
			this.studentAddRequest.aadhar = this.studentForm.controls.aadhaarNo.value;
			this.studentAddRequest.sts_no = this.studentForm.controls.STSNo.value;
			this.studentAddRequest.rte_student = this.studentForm.controls.RTEStudent.value;
			this.studentAddRequest.religion = this.studentForm.controls.religion.value;
			this.studentAddRequest.section = this.studentForm.controls.section.value?this.studentForm.controls.section.value:'A';
			this.studentAddRequest.caste = this.studentForm.controls.caste.value;
			this.studentAddRequest.mother_tongue = this.studentForm.controls.motherTongue.value;
			this.studentAddRequest.blood_gr = this.studentForm.controls.bloodGroup.value;
			this.studentAddRequest.mode_of_transp = this.studentForm.controls.transportation.value;
			this.studentAddRequest.medical_cond = this.studentForm.controls.medicalConditions.value;
			this.studentAddRequest.wear_glasses = this.studentForm.controls.glasses.value;
			this.studentAddRequest.email = this.studentForm.controls.email.value;
			this.studentAddRequest.dob = this.studentForm.controls.dob.value != "" ? new Date(this.studentForm.controls.dob.value).toLocaleDateString() : "";

			this.studentAddRequest.guardian = this.studentForm.controls.primaryParent.value;
			this.studentAddRequest.primaryParent = this.studentForm.controls.primaryParent.value;

			this.studentAddRequest.father_name = this.studentForm.controls.fatherName.value;
			this.studentAddRequest.f_contact_number = this.studentForm.controls.fatherContact.value;
			this.studentAddRequest.f_email = this.studentForm.controls.fatherEmail.value;
			this.studentAddRequest.mobile_to_reg_student = this.studentForm.controls.fatherContact.value ? this.studentForm.controls.fatherContact.value : this.studentForm.controls.motherContact.value ;//revert from deep
			this.studentAddRequest.f_qualification = this.studentForm.controls.fatherQualification.value;
			this.studentAddRequest.f_aadhar_no = this.studentForm.controls.fatheraadhaarNo.value;
			this.studentAddRequest.language_proficiency = [];
			let language_proficiency: LanguageList = <LanguageList>{};
			language_proficiency.languageOne = <LanguageDetails>{};
			language_proficiency.languageOne.languageName = this.studentForm.controls.fatherLanguage1.value;
			language_proficiency.languageOne.read = this.studentForm.controls.fatherLanguageRead1.value;
			language_proficiency.languageOne.write = this.studentForm.controls.fatherLanguageWrite1.value;
			language_proficiency.languageOne.speak = this.studentForm.controls.fatherLanguageSpeak1.value;
			language_proficiency.languageTwo = <LanguageDetails>{};
			language_proficiency.languageTwo.languageName = this.studentForm.controls.fatherLanguage2.value;
			language_proficiency.languageTwo.read = this.studentForm.controls.fatherLanguageRead2.value;
			language_proficiency.languageTwo.write = this.studentForm.controls.fatherLanguageWrite2.value;
			language_proficiency.languageTwo.speak = this.studentForm.controls.fatherLanguageSpeak2.value;
			language_proficiency.languageThree = <LanguageDetails>{};
			language_proficiency.languageThree.languageName = this.studentForm.controls.fatherLanguage3.value;
			language_proficiency.languageThree.read = this.studentForm.controls.fatherLanguageRead3.value;
			language_proficiency.languageThree.write = this.studentForm.controls.fatherLanguageWrite3.value;
			language_proficiency.languageThree.speak = this.studentForm.controls.fatherLanguageSpeak3.value;
			language_proficiency.languageFour = <LanguageDetails>{};
			language_proficiency.languageFour.languageName = this.studentForm.controls.fatherLanguage4.value;
			language_proficiency.languageFour.read = this.studentForm.controls.fatherLanguageRead4.value;
			language_proficiency.languageFour.write = this.studentForm.controls.fatherLanguageWrite4.value;
			language_proficiency.languageFour.speak = this.studentForm.controls.fatherLanguageSpeak4.value;
			this.studentAddRequest.language_proficiency.push(language_proficiency);
			this.studentAddRequest.guardian_name = this.studentForm.controls.guardianName.value;
			this.studentAddRequest.guardian_mobile = this.studentForm.controls.guardianContact.value;
			this.studentAddRequest.guardian_mobile_to_reg_student = this.studentForm.controls.guardianContact.value;//revert from deep
			this.studentAddRequest.g_email = this.studentForm.controls.guardianEmail.value;
			this.studentAddRequest.g_qualificaton = this.studentForm.controls.guardianQualification.value;
			this.studentAddRequest.g_aadhar = this.studentForm.controls.guardianaadhaarNo.value;
			this.studentAddRequest.g_language_proficiency = [];
			let g_language_proficiency: LanguageList = <LanguageList>{};
			g_language_proficiency.languageOne = <LanguageDetails>{};
			g_language_proficiency.languageOne.languageName = this.studentForm.controls.guardianLanguage1.value;
			g_language_proficiency.languageOne.read = this.studentForm.controls.guardianLanguageRead1.value;
			g_language_proficiency.languageOne.write = this.studentForm.controls.guardianLanguageWrite1.value;
			g_language_proficiency.languageOne.speak = this.studentForm.controls.guardianLanguageSpeak1.value;
			g_language_proficiency.languageTwo = <LanguageDetails>{};
			g_language_proficiency.languageTwo.languageName = this.studentForm.controls.guardianLanguage2.value;
			g_language_proficiency.languageTwo.read = this.studentForm.controls.guardianLanguageRead2.value;
			g_language_proficiency.languageTwo.write = this.studentForm.controls.guardianLanguageWrite2.value;
			g_language_proficiency.languageTwo.speak = this.studentForm.controls.guardianLanguageSpeak2.value
			g_language_proficiency.languageThree = <LanguageDetails>{};
			g_language_proficiency.languageThree.languageName = this.studentForm.controls.guardianLanguage3.value;
			g_language_proficiency.languageThree.read = this.studentForm.controls.guardianLanguageRead3.value;
			g_language_proficiency.languageThree.write = this.studentForm.controls.guardianLanguageWrite3.value;
			g_language_proficiency.languageThree.speak = this.studentForm.controls.guardianLanguageSpeak3.value;
			g_language_proficiency.languageFour = <LanguageDetails>{};
			g_language_proficiency.languageFour.languageName = this.studentForm.controls.guardianLanguage4.value;
			g_language_proficiency.languageFour.read = this.studentForm.controls.guardianLanguageRead4.value;
			g_language_proficiency.languageFour.write = this.studentForm.controls.guardianLanguageWrite4.value;
			g_language_proficiency.languageFour.speak = this.studentForm.controls.guardianLanguageSpeak4.value;
			this.studentAddRequest.g_language_proficiency.push(g_language_proficiency);
			this.studentAddRequest.mother_name = this.studentForm.controls.motherName.value;
			this.studentAddRequest.m_contact_number = this.studentForm.controls.motherContact.value;
			this.studentAddRequest.m_mobile_to_reg_student = this.studentForm.controls.motherContact.value;//revert from deep
			this.studentAddRequest.m_email = this.studentForm.controls.motherEmail.value;
			this.studentAddRequest.m_qualification = this.studentForm.controls.motherQualification.value;
			this.studentAddRequest.m_aadhar_no = this.studentForm.controls.motheraadhaarNo.value;
			this.studentAddRequest.m_language_proficiency = [];
			let m_language_proficiency: LanguageList = <LanguageList>{};
			m_language_proficiency.languageOne = <LanguageDetails>{};
			m_language_proficiency.languageOne.languageName = this.studentForm.controls.motherLanguage1.value;
			m_language_proficiency.languageOne.read = this.studentForm.controls.motherLanguageRead1.value;
			m_language_proficiency.languageOne.write = this.studentForm.controls.motherLanguageWrite1.value;
			m_language_proficiency.languageOne.speak = this.studentForm.controls.motherLanguageSpeak1.value;
			m_language_proficiency.languageTwo = <LanguageDetails>{};
			m_language_proficiency.languageTwo.languageName = this.studentForm.controls.motherLanguage2.value;
			m_language_proficiency.languageTwo.read = this.studentForm.controls.motherLanguageRead2.value;
			m_language_proficiency.languageTwo.write = this.studentForm.controls.motherLanguageWrite2.value;
			m_language_proficiency.languageTwo.speak = this.studentForm.controls.motherLanguageSpeak2.value
			m_language_proficiency.languageThree = <LanguageDetails>{};
			m_language_proficiency.languageThree.languageName = this.studentForm.controls.motherLanguage3.value;
			m_language_proficiency.languageThree.read = this.studentForm.controls.motherLanguageRead3.value;
			m_language_proficiency.languageThree.write = this.studentForm.controls.motherLanguageWrite3.value;
			m_language_proficiency.languageThree.speak = this.studentForm.controls.motherLanguageSpeak3.value;
			m_language_proficiency.languageFour = <LanguageDetails>{};
			m_language_proficiency.languageFour.languageName = this.studentForm.controls.motherLanguage4.value;
			m_language_proficiency.languageFour.read = this.studentForm.controls.motherLanguageRead4.value;
			m_language_proficiency.languageFour.write = this.studentForm.controls.motherLanguageWrite4.value;
			m_language_proficiency.languageFour.speak = this.studentForm.controls.motherLanguageSpeak4.value;
			this.studentAddRequest.m_language_proficiency.push(m_language_proficiency);
			if (this.studentForm.controls.primaryParent.value == 'father') {
				if (this.studentForm.controls.fatherName.value && this.studentForm.controls.fatherContact.value) {
					this.studentAddRequest.username = this.studentForm.controls.fatherContact.value;
					this.studentAddRequest.p_username = this.studentForm.controls.fatherContact.value;
				} else {
					Swal.fire({ icon: 'error', title: 'Error', text: 'please enter Father name and mobile number' });
					return;
				}
			}
			if (this.studentForm.controls.primaryParent.value == 'mother') {
				if (this.studentForm.controls.motherName.value && this.studentForm.controls.motherContact.value) {
					this.studentAddRequest.username = this.studentForm.controls.motherContact.value;
					this.studentAddRequest.p_username = this.studentForm.controls.motherContact.value;
				} else {
					Swal.fire({ icon: 'error', title: 'Error', text: 'please enter Mother name and mobile number' });
					return;
				}
			}
			if (this.studentForm.controls.primaryParent.value == 'guardian') {
				if (this.studentForm.controls.guardianName.value && this.studentForm.controls.guardianContact.value) {
					this.studentAddRequest.username = this.studentForm.controls.guardianContact.value;
					this.studentAddRequest.p_username = this.studentForm.controls.guardianContact.value;
				} else {
					Swal.fire({ icon: 'error', title: 'Error', text: 'please enter Guardian name and mobile number' });
					return;
				}
			}
			console.log(this.studentAddRequest);

			// const studentData = {
			// 	'gender': this.studentForm.controls.gender.value,
			// 	'passport_image': this.profilePicture,//notfound in collection
			// 	'school_id': localStorage.getItem('schoolId'), // Make the value dynamic
			// 	'branch_id': this.studentForm.controls.branch.value, // Make the value dynamic
			// 	'name': this.studentForm.controls.name.value,
			// 	'username': '',
			// 	'password': '',//dont know what to send in collection
			// 	'p_username': '',//dont know what to send in collection
			// 	'p_password': this.randomPassParent,
			// 	'guardian': this.studentForm.controls.primaryParent.value,
			// 	'contact_number': '',//dont know what to send in collection
			// 	'dob': new Date(this.studentForm.controls.dob.value).toLocaleDateString(),//notfound in collection
			// 	'email': this.studentForm.controls.email.value,
			// 	'subjects': this.studentForm.controls.subjects.value,
			// 	'address': this.studentForm.controls.address.value,
			// 	'aadhar': this.studentForm.controls.aadhaarNo.value,
			// 	'sts_no': this.studentForm.controls.STSNo.value,
			// 	'rte_student': this.studentForm.controls.RTEStudent.value,
			// 	'caste': this.studentForm.controls.caste.value,
			// 	'city': this.studentForm.controls.city.value,
			// 	'state': this.studentForm.controls.state.value,
			// 	'country': this.studentForm.controls.country.value,
			// 	'pincode': this.studentForm.controls.pinCode.value,
			// 	'mother_tongue': this.studentForm.controls.motherTongue.value,
			// 	'blood_gr': this.studentForm.controls.bloodGroup.value,
			// 	'mode_of_transp': this.studentForm.controls.transportation.value,
			// 	'medical_cond': this.studentForm.controls.medicalConditions.value,
			// 	'wear_glasses': this.studentForm.controls.glasses.value,//notfound in collection
			// 	'class': this.studentForm.controls.class.value,
			// 	'religion': this.studentForm.controls.religion.value,
			// 	'primaryParent': this.studentForm.controls.primaryParent.value,
			// 	'father_name': this.studentForm.controls.fatherName.value,
			// 	'f_contact_number': this.studentForm.controls.fatherContact.value,
			// 	'mobile_to_reg_student': this.studentForm.controls.fatherContact.value,
			// 	'f_email': this.studentForm.controls.fatherEmail.value,
			// 	'f_qualification': this.studentForm.controls.fatherQualification.value,
			// 	'f_aadhar_no': this.studentForm.controls.fatheraadhaarNo.value,
			// 	'language_proficiency': [{
			// 		'languageOne': {
			// 			'languageName': this.studentForm.controls.fatherLanguage1.value,
			// 			'read': this.studentForm.controls.fatherLanguageRead1.value,
			// 			'write': this.studentForm.controls.fatherLanguageWrite1.value,
			// 			'speak': this.studentForm.controls.fatherLanguageSpeak1.value,
			// 		},
			// 		'languageTwo': {
			// 			'languageName': this.studentForm.controls.fatherLanguage2.value,
			// 			'read': this.studentForm.controls.fatherLanguageRead2.value,
			// 			'write': this.studentForm.controls.fatherLanguageWrite2.value,
			// 			'speak': this.studentForm.controls.fatherLanguageSpeak2.value,
			// 		},
			// 		'languageThree': {
			// 			'languageName': this.studentForm.controls.fatherLanguage3.value,
			// 			'read': this.studentForm.controls.fatherLanguageRead3.value,
			// 			'write': this.studentForm.controls.fatherLanguageWrite3.value,
			// 			'speak': this.studentForm.controls.fatherLanguageSpeak3.value,
			// 		},
			// 		'languageFour': {
			// 			'languageName': this.studentForm.controls.fatherLanguage4.value,
			// 			'read': this.studentForm.controls.fatherLanguageRead4.value,
			// 			'write': this.studentForm.controls.fatherLanguageWrite4.value,
			// 			'speak': this.studentForm.controls.fatherLanguageSpeak4.value,
			// 		},
			// 	}],
			// 	'mother_name': this.studentForm.controls.motherName.value,
			// 	'm_contact_number': this.studentForm.controls.motherContact.value,
			// 	'm_mobile_to_reg_student': this.studentForm.controls.motherContact.value,
			// 	'm_email': this.studentForm.controls.motherEmail.value,
			// 	'm_qualification': this.studentForm.controls.motherQualification.value,
			// 	'm_aadhar_no': this.studentForm.controls.motheraadhaarNo.value,
			// 	'm_language_proficiency': [{
			// 		'languageOne': {
			// 			'languageName': this.studentForm.controls.motherLanguage1.value,
			// 			'read': this.studentForm.controls.motherLanguageRead1.value,
			// 			'write': this.studentForm.controls.motherLanguageWrite1.value,
			// 			'speak': this.studentForm.controls.motherLanguageSpeak1.value,
			// 		},
			// 		'languageTwo': {
			// 			'languageName': this.studentForm.controls.motherLanguage2.value,
			// 			'read': this.studentForm.controls.motherLanguageRead2.value,
			// 			'write': this.studentForm.controls.motherLanguageWrite2.value,
			// 			'speak': this.studentForm.controls.motherLanguageSpeak2.value,
			// 		},
			// 		'languageThree': {
			// 			'languageName': this.studentForm.controls.motherLanguage3.value,
			// 			'read': this.studentForm.controls.motherLanguageRead3.value,
			// 			'write': this.studentForm.controls.motherLanguageWrite3.value,
			// 			'speak': this.studentForm.controls.motherLanguageSpeak3.value,
			// 		},
			// 		'languageFour': {
			// 			'languageName': this.studentForm.controls.motherLanguage4.value,
			// 			'read': this.studentForm.controls.motherLanguageRead4.value,
			// 			'write': this.studentForm.controls.motherLanguageWrite4.value,
			// 			'speak': this.studentForm.controls.motherLanguageSpeak4.value,
			// 		},
			// 	}],
			// 	'guardian_name': this.studentForm.controls.guardianName.value,
			// 	'guardian_mobile': this.studentForm.controls.guardianContact.value,
			// 	'guardian_mobile_to_reg_student': this.studentForm.controls.guardianContact.value,
			// 	'g_email': this.studentForm.controls.guardianEmail.value,
			// 	'g_qualificaton': this.studentForm.controls.guardianQualification.value,
			// 	'g_aadhar': this.studentForm.controls.guardianaadhaarNo.value,
			// 	// 'g_language_proficiency' : '',
			// 	'g_language_proficiency': [{
			// 		'languageOne': {
			// 			'languageName': this.studentForm.controls.guardianLanguage1.value,
			// 			'read': this.studentForm.controls.guardianLanguageRead1.value,
			// 			'write': this.studentForm.controls.guardianLanguageWrite1.value,
			// 			'speak': this.studentForm.controls.guardianLanguageSpeak1.value,
			// 		},
			// 		'languageTwo': {
			// 			'languageName': this.studentForm.controls.guardianLanguage2.value,
			// 			'read': this.studentForm.controls.guardianLanguageRead2.value,
			// 			'write': this.studentForm.controls.guardianLanguageWrite2.value,
			// 			'speak': this.studentForm.controls.guardianLanguageSpeak2.value,
			// 		},
			// 		'languageThree': {
			// 			'languageName': this.studentForm.controls.guardianLanguage3.value,
			// 			'read': this.studentForm.controls.guardianLanguageRead3.value,
			// 			'write': this.studentForm.controls.guardianLanguageWrite3.value,
			// 			'speak': this.studentForm.controls.guardianLanguageSpeak3.value,
			// 		},
			// 		'languageFour': {
			// 			'languageName': this.studentForm.controls.guardianLanguage4.value,
			// 			'read': this.studentForm.controls.guardianLanguageRead4.value,
			// 			'write': this.studentForm.controls.guardianLanguageWrite4.value,
			// 			'speak': this.studentForm.controls.guardianLanguageSpeak4.value,
			// 		},
			// 	}]
			// }
			// if (this.studentForm.controls.primaryParent.value == 'father') {
			// 	if (this.studentForm.controls.fatherName.value && this.studentForm.controls.fatherContact.value) {
			// 		studentData.username = this.studentForm.controls.fatherContact.value;
			// 	} else {
			// 		Swal.fire({ icon: 'error', title: 'Error', text: 'please enter Father name and mobile number' });
			// 		return;
			// 	}
			// }
			// if (this.studentForm.controls.primaryParent.value == 'mother') {
			// 	if (this.studentForm.controls.motherName.value && this.studentForm.controls.motherContact.value) {
			// 		studentData.username = this.studentForm.controls.motherContact.value
			// 	} else {
			// 		Swal.fire({ icon: 'error', title: 'Error', text: 'please enter Mother name and mobile number' });
			// 		return;
			// 	}
			// }
			// if (this.studentForm.controls.primaryParent.value == 'guardian') {
			// 	if (this.studentForm.controls.guardianName.value && this.studentForm.controls.guardianContact.value) {
			// 		studentData.username = this.studentForm.controls.guardianContact.value
			// 	} else {
			// 		Swal.fire({ icon: 'error', title: 'Error', text: 'please enter Guardian name and mobile number' });
			// 		return;
			// 	}
			// }

			// registerStudent
			//console.log(studentData)


			this.apiService.registerStudent(this.studentAddRequest).subscribe((response: any) => {
				console.log(response)
				if (response.status == 201) {
					Swal.fire('Account Created', response.body.data, 'success');
					this.studentForm.reset();
					this.profilePicture='';
					this.filePreview='';
          this.profilePicture="";
            this.filePreview="";
				} else {
					Swal.fire({ icon: 'error', title: 'Error please try again', text: response.body.data });
					return;
				}
			}, (error) => {
				console.log(error)
				if (error.status == 400) {
					Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
					return;
				} else {
					Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
					return;
				}
			})
		} else {
			return;
		}
	}

	//addSection
	addSection(sectionName) {
		this.classRequiredFlag = false
		if (this.studentForm.controls.class.value) {
			const sectionData = {
				name: this.addSectionName,
				description: this.addSectionName,
				class_id: this.studentForm.controls.class.value,
				repository: [
					{
						id: localStorage.getItem('schoolId'),
					}
				]
			}
			this.apiService.addSection(sectionData).subscribe((response: any) => {
				if (response.status != 802) {
					this.getSections(this.studentForm.controls.class.value)
					//to reset Form  controls
					Object.keys(sectionName.controls).forEach((field) => {
						sectionName.controls[field].reset();
					});
				}
				else {
					alert(response.body.error);
				}

			}
			)

		} else {
			this.classRequiredFlag = true
			return
		}
	}
}
