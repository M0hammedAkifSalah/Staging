// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, NgModel, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// import { validators } from 'src/assets/plugins/formvalidation/src/js';
declare var angular: any;
import { DOCUMENT } from '@angular/common';
import { CreateservicesService } from '../services/createservices.service';
import Swal from 'sweetalert2';
import { defaultRoles } from '../../roles-permission/default-roles';
import { SchoolAddRequest } from '../../model/schooladdrequest.model';
import { BranchDetails } from '../../model/branchdetails.model';
import { LoadingService } from '../../../loader/loading/loading.service';
@Component({
	selector: 'kt-school',
	templateUrl: './school.component.html',
	styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {
	// Public params
	schoolForm: FormGroup;
  filePreview: any;
  profilePicture: any;
	cities: any[] = [];
	states: any[] = [];
	countries: any[] = [];
	b1Countries: any[] = [];
	b1Cities: any[] = [];
	b1States: any[] = [];
	b2Countries: any[] = [];
	b2Cities: any[] = [];
	b2States: any[] = [];
	b3Countries: any[] = [];
	b3Cities: any[] = [];
	b3States: any[] = [];
	b4Countries: any[] = [];
	b4Cities: any[] = [];
	b4States: any[] = [];
	b5Countries: any[] = [];
	b5Cities: any[] = [];
	b5States: any[] = [];
	boards: any[] = [];
	schoolType: any[] = [];
	gender: any[] = ['Male', 'Female'];
	listofSyllabus: any[] = [];
	branchContainer: Array<any> = [1];
	// branchName:any = {};
	branchDetails: any[] = [{ branchName: "", branchAdd: "", branchContact: "", branchCountry: "", branchState: "", branchCity: "", branchPincode: "" }];
	randomPass: any = Math.random().toString(36).slice(-12);
	schoolAddRequest: SchoolAddRequest = <SchoolAddRequest>{};
	@ViewChild('update') branchForm: NgForm;
	formSubmitted: boolean = false;
	userExistFlag: boolean = false;

	constructor(
		private _formBuilder: FormBuilder,
		private cdr: ChangeDetectorRef,
		public apiService: CreateservicesService,
		private loadingService: LoadingService,
    private loaderService:LoadingService
	) { }

	ngOnInit(): void {
		this.branchDetails[0]
		this.initializeForm();
		this.getCountries();
		this.getSchoolType();
		this.getStates();
		this.getCities();
		this.getb1Countries();
		this.getb2Countries();
		this.getb3Countries();
		this.getb4Countries();
		this.getb5Countries();
		//this.getSyllabus();
		//this.getBoards();
	}

	initializeForm() {
		this.schoolForm = this._formBuilder.group({
			schoolName: ['', [Validators.required, Validators.maxLength(50)]],
			address: ['', [Validators.required, Validators.maxLength(150)]],
			country: ['', Validators.required],
			state: ['', Validators.required],
			city: ['', Validators.required],
			pinCode: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
			email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"), Validators.required]],
			website: ['', Validators.maxLength(50)],
			contact: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(15), Validators.required]],
			//board: ['', Validators.required],
			schoolType: ['', Validators.required],
			//listofSyllabus: ['', Validators.required],

			adminName: ['', [Validators.required, Validators.maxLength(50)]],
			password: [this.randomPass, [Validators.required, Validators.maxLength(50)]],
			adminContact: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(15)]],
			adminEmail: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"), Validators.required]],
			dob: [''],
			gender: [''],
			qualification: ['', Validators.maxLength(50)],
			designation: ['', Validators.maxLength(50)],
			noOfBranches: [1, Validators.required],
			branchName: [''],
		});
	}

	checkUserExist(value) {
		this.loadingService.show()
		this.userExistFlag = false
		if (value) {
			let obj = {
				school_id: "",
				mobile: value,
				type: "school_admin"
			}
			this.apiService.checkUserExist(obj).subscribe(
				(response: any) => {
					if (response && response.body) {
						if (response.body.flag) {
							this.userExistFlag = true;
							this.loadingService.hide();
						}
						else {
							this.userExistFlag = false;
							this.loadingService.hide();
						}
					}
				}
			)
		}
		this.loadingService.hide();

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
          this.cdr.detectChanges();
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

	getCountries() {
    this.loaderService.show();
		this.apiService.getCountries().subscribe((response: any) => {
			this.countries = response.body.data;
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getStates() {
    this.loaderService.show();
		this.schoolForm.get('country').valueChanges.subscribe(val => {
			this.apiService.getStates().subscribe((response: any) => {
				this.states = response.body.data.filter(usr => {
					return usr.country_id == this.schoolForm.controls.country.value
				})
        this.loaderService.hide();
			},error=>{
        this.loaderService.hide();
      })
		})
	}

	getCities() {
    this.loaderService.show();
			this.apiService.getCities().subscribe((response: any) => {
				this.cities = response.body.data.filter(usr => {
					return usr.state_id == this.schoolForm.controls.state.value
				})
        this.loaderService.hide();
			},error=>{
        this.loaderService.hide();
      })

	}

	countryChangeDropdown(value: string, i: number) {
		this.branchDetails[i].branchCountry = value;
		if (i == 0) {
			this.getb1States(value);
		}
		else if (i == 1) {
			this.getb2States(value)
		}
		else if (i == 2) {
			this.getb3States(value)
		}
		else if (i == 3) {
			this.getb4States(value)
		}
		else if (i == 4) {
			this.getb5States(value)
		}
	}

	stateChangeDropdown(value: string, i: number) {
		this.branchDetails[i].branchState = value;
		if (i == 0) {
			this.getb1Cities(value);
		}
		else if (i == 1) {
			this.getb2Cities(value)
		}
		else if (i == 2) {
			this.getb3Cities(value)
		}
		else if (i == 3) {
			this.getb4Cities(value)
		}
		else if (i == 4) {
			this.getb5Cities(value)
		}
	}

	getb1Countries() {
    this.loaderService.show();
		this.apiService.getCountries().subscribe((response: any) => {
			this.b1Countries = response.body.data;
      this.loaderService.hide();
		},
    error=>{
      this.loaderService.hide();
    })
	}

	getb1States(value: string) {
    this.loaderService.show();
		this.apiService.getStates().subscribe((response: any) => {
			this.b1States = response.body.data.filter((usr: any) => {
				return usr.country_id == value
			})
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getb1Cities(value: string) {
    this.loaderService.show();
		this.apiService.getCities().subscribe((response: any) => {
			this.b1Cities = response.body.data.filter((usr: any) => {
				return usr.state_id == value
			})
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getb2Countries() {
    this.loaderService.show();
		this.apiService.getCountries().subscribe((response: any) => {
			this.b2Countries = response.body.data;
      this.loaderService.hide();
		},
    error=>{this.loaderService.hide();}
    )
	}

	getb2States(value: string) {
    this.loaderService.show();
		this.apiService.getStates().subscribe((response: any) => {
			this.b2States = response.body.data.filter((usr: any) => {
				return usr.country_id == value
			})
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })

	}

	getb2Cities(value: string) {
    this.loaderService.show();
		this.apiService.getCities().subscribe((response: any) => {
			this.b2Cities = response.body.data.filter((usr: any) => {
				return usr.state_id == value
			})
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getb3Countries() {
    this.loaderService.show();
		this.apiService.getCountries().subscribe((response: any) => {
			this.b3Countries = response.body.data;
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })

	}

	getb3States(value: string) {
    this.loaderService.show();
		this.apiService.getStates().subscribe((response: any) => {
			this.b3States = response.body.data.filter((usr: any) => {
				return usr.country_id == value
			})
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getb3Cities(value: string) {
    this.loaderService.show();
		this.apiService.getCities().subscribe((response: any) => {
			this.b3Cities = response.body.data.filter((usr: any) => {
				return usr.state_id == value
			})
      this.loaderService.hide();
		},
    error=>{
      this.loaderService.hide();
    })
	}

	getb4Countries() {
    this.loaderService.show();
		this.apiService.getCountries().subscribe((response: any) => {
			this.b4Countries = response.body.data;
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getb4States(value: string) {
    this.loaderService.show();
		this.apiService.getStates().subscribe((response: any) => {
			this.b4States = response.body.data.filter(usr => {
				return usr.country_id == value
			})
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getb4Cities(value: string) {
    this.loaderService.show();
		this.apiService.getCities().subscribe((response: any) => {
			this.b4Cities = response.body.data.filter((usr: any) => {
				return usr.state_id == value
			})
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getb5Countries() {
    this.loaderService.show();
		this.apiService.getCountries().subscribe((response: any) => {
			this.b5Countries = response.body.data;
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getb5States(value: string) {
    this.loaderService.show();
		this.apiService.getStates().subscribe((response: any) => {
			this.b5States = response.body.data.filter(usr => {
				return usr.country_id == value
			})
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getb5Cities(value: string) {
    this.loaderService.show();
		this.apiService.getCities().subscribe((response: any) => {
			this.b5Cities = response.body.data.filter((usr: any) => {
				return usr.state_id == value
			})
      this.loaderService.hide();
		},error=>{
      this.loaderService.hide();
    })
	}

	getSchoolType() {
    this.loaderService.show();
		this.apiService.getSchoolType().subscribe((response: any) => {
			this.schoolType = response.data
      this.loaderService.hide();
		},
    error=>{
      this.loaderService.hide();
    })
	}

	// getBoards() {
	// 	this.apiService.getBoards().subscribe((response: any) => {
	// 		this.boards = response.body.data;
	// 		this.cdr.detectChanges();
	// 	})
	// }

	// getSyllabus() {
	// 	this.apiService.getSyllabus().subscribe((response: any) => {
	// 		this.listofSyllabus = response.body.data;
	// 	})
	// }

	addBranchContainer() {
		if (isNaN(this.schoolForm.controls.noOfBranches.value)) {
			Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter a number' });
			return
		} else {
			this.branchContainer = [];
			for (let i = 0; i < this.schoolForm.controls.noOfBranches.value; i++) {
				let branch = { branchName: "", branchAdd: "", branchContact: "", branchCountry: "", branchState: "", branchCity: "", branchPincode: "" };
				this.branchDetails[i] = branch;
				this.branchContainer.push(i);
			}
		}
	}

	// updateStartup(data: any) {
	// 	const schoolData = {
	// 		"schoolName": this.schoolForm.controls.schoolName.value,
	// 		"schoolImage": "",
	// 		"branchNumer": this.schoolForm.controls.noOfBranches.value,
	// 		"board": this.schoolForm.controls.board.value,
	// 		"email": this.schoolForm.controls.email.value,
	// 		"website": this.schoolForm.controls.website.value,
	// 		"contact_number": this.schoolForm.controls.contact.value,
	// 		"sType": this.schoolForm.controls.schoolType.value,
	// 		"classList": "",
	// 		"address": this.schoolForm.controls.address.value,
	// 		"city": this.schoolForm.controls.city.value,

	// 		"state": this.schoolForm.controls.state.value,
	// 		"country": this.schoolForm.controls.country.value,
	// 		"pinCode": this.schoolForm.controls.pinCode.value,
	// 		"syllabusList": this.schoolForm.controls.listofSyllabus.value,
	// 		"branch": {},



	// 	}
	// 	const branches = []
	// 	for (let i = 0; i < this.schoolForm.controls.noOfBranches.value; i++) {
	// 		var branchData = {


	// 			"name": data['name' + i],
	// 			"address": data['address' + i],
	// 			"city": data['city' + i],
	// 			"state": data['state' + i],
	// 			"contact": data['contact' + i],
	// 			"pincode": data['pincode' + i],
	// 			"country": data['country' + i]

	// 		}
	// 		branches.push(branchData);

	// 	}
	// 	schoolData.branch = branches;
	// 	// Admin details

	// 	const adminData = {
	// 		'profile_type': defaultRoles.find(role => { return role.role_name == 'school_admin' }).id,

	// 		'school_id': localStorage.getItem('schoolId'),

	// 		'name': this.schoolForm.controls.adminName.value,
	// 		'mobile': this.schoolForm.controls.adminContact.value,
	// 		'gender': this.schoolForm.controls.gender.value,
	// 		// 'username': this.schoolForm.controls.username.value,
	// 		'password': this.schoolForm.controls.password.value,
	// 		'designation': this.schoolForm.controls.designation.value,
	// 		'qualification': this.schoolForm.controls.qualification.value,
	// 		'dob': new Date(this.schoolForm.controls.dob.value).toLocaleDateString(),
	// 		'email': this.schoolForm.controls.adminEmail.value,
	// 		'address': '',
	// 		'aadhar_card': '',
	// 		'blood_gr': '',
	// 		'religion': '',
	// 		'caste': '',
	// 		'mother_tounge': '',
	// 		'marital_status': '',
	// 		'experiance': '',
	// 		'level': '',
	// 		'leaderShip_Exp': '',
	// 		'cv': '',
	// 		'ten_details': {
	// 			'school': '',
	// 			'Board': '',
	// 			'percentage': '',
	// 			'year_of_passing': '',
	// 			'Attach_doc': ''
	// 		},
	// 		'twelve_details': {
	// 			'school': '',
	// 			'Board': '',
	// 			'percentage': '',
	// 			'year_of_passing': '',
	// 			'Attach_doc': ''
	// 		},
	// 		'graduation_details': {
	// 			'school': '',
	// 			'Board': '',
	// 			'percentage': '',
	// 			'year_of_passing': '',
	// 			'Attach_doc': ''
	// 		},
	// 		'masters_details': {
	// 			'school': '',
	// 			'Board': '',
	// 			'percentage': '',
	// 			'year_of_passing': '',
	// 			'Attach_doc': ''
	// 		},
	// 		'other_degrees': [{
	// 			'other1': ''
	// 		}],
	// 		'certifications': [{
	// 			'ca1': ''
	// 		}],
	// 		'extra_achievement': [{
	// 			'extra_achievement': ''
	// 		}]
	// 	}

	// 	this.apiService.registerSchool(schoolData).subscribe((response: any) => {
	// 		console.log('school response', response);
	// 		if (response.status == 201 || response.status == 200) {
	// 			adminData.school_id = response.body.data.class._id;

	// 			this.apiService.signUp(adminData).subscribe((response: any) => {
	// 				console.log('response', response);
	// 				if (response.status == 201 || response.status == 200) {
	// 					Swal.fire('Account Created', 'Account Created', 'success')
	// 				} else {
	// 					Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
	// 					return;
	// 				}
	// 			},
	// 				(error) => {
	// 					if (error.status == 400) {
	// 						console.log('error => ', error)
	// 						Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
	// 						return;
	// 					} else {
	// 						Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
	// 						return;
	// 					}
	// 				});
	// 		} else {
	// 			Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
	// 			return;
	// 		}
	// 	}, (error) => {
	// 		if (error.status == 400) {
	// 			console.log('error => ', error)
	// 			Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
	// 			return;
	// 		} else {
	// 			Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
	// 			return;
	// 		}
	// 	})

	// }


	addSchool(data: any) {
		this.formSubmitted = true;
		// let valid:boolean=false;
		// for (let i in this.branchDetails) {
		// 	if (this.branchDetails[i].branchAdd == null || this.branchDetails[i].branchCity == null || this.branchDetails[i].branchContact == null
		// 		|| this.branchDetails[i].branchCountry == null || this.branchDetails[i].branchName == null || this.branchDetails[i].branchPincode == null
		// 		|| this.branchDetails[i].branchState==null) {
		// 			valid=true;
		// 		return this.schoolForm.markAllAsTouched();
		// 	}
		// }
		console.log(this.branchDetails)
		if (this.schoolForm.valid ) {
      this.schoolAddRequest.schoolImage=this.profilePicture
			this.schoolAddRequest.schoolName = this.schoolForm.controls.schoolName.value;
			this.schoolAddRequest.address = this.schoolForm.controls.address.value;
			this.schoolAddRequest.country = this.schoolForm.controls.country.value;
			this.schoolAddRequest.state = this.schoolForm.controls.state.value;
			this.schoolAddRequest.city = this.schoolForm.controls.city.value;
			this.schoolAddRequest.pincode = this.schoolForm.controls.pinCode.value;
			this.schoolAddRequest.schoolEmail = this.schoolForm.controls.email.value;
			this.schoolAddRequest.schoolWebsite = this.schoolForm.controls.website.value;
			this.schoolAddRequest.SchoolContactNumber = this.schoolForm.controls.contact.value;
			this.schoolAddRequest.institutionTypeId = this.schoolForm.controls.schoolType.value;
			this.schoolAddRequest.Branch = [];
			for (let i = 0; i < this.schoolForm.controls.noOfBranches.value; i++) {
				let branchDetails: BranchDetails = <BranchDetails>{};
				console.log(this.branchDetails);
				branchDetails.name = this.branchDetails[i].branchName
				branchDetails.address = this.branchDetails[i].branchAdd
				branchDetails.contact = this.branchDetails[i].branchContact
				branchDetails.branchCountryId = this.branchDetails[i].branchCountry
				branchDetails.branchStateId = this.branchDetails[i].branchState
				branchDetails.branchCityId = this.branchDetails[i].branchCity
				branchDetails.branchPincode = this.branchDetails[i].branchPincode
				this.schoolAddRequest.Branch.push(branchDetails);
			}
			console.log(this.schoolAddRequest);
			this.apiService.addSchoolNew(this.schoolAddRequest).subscribe(x => {
				if (x.body.data != undefined) {
					let admindata = this.getAdminDetails();
					admindata.school_id = x.body.data.schoolId;
					this.addSchoolAdmin(admindata);
				}
			}, (err: any) => {
				alert(err.error_description);
			})
		}
		else {
			this.schoolForm.markAllAsTouched();
		}
	}

	addSchoolAdmin(adminData: any) {
		this.apiService.signUp(adminData).subscribe((response: any) => {
			console.log('response', response);
			if (response.status == 201 || response.status == 200) {
				Swal.fire('Account Created', 'Institution added successfully', 'success')
        this.branchDetails=[];
        this.branchDetails = [{ branchName: "", branchAdd: "", branchContact: "", branchCountry: "", branchState: "", branchCity: "", branchPincode: "" }];
        this.profilePicture=null;
        this.branchDetails[0];
        this.branchForm.resetForm();
				this.schoolForm.reset();


			} else {
				Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
				return;
			}
		},
			(error) => {
				if (error.status == 400) {
					console.log('error => ', error)
					Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
					return;
				} else {
					Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
					return;
				}
			});
	}

	getAdminDetails() {
		const adminData = {
			'profile_type': defaultRoles.find(role => { return role.role_name == 'school_admin' }).id,
			'school_id': localStorage.getItem('schoolId'),
			'name': this.schoolForm.controls.adminName.value,
			'mobile': this.schoolForm.controls.adminContact.value,
			'gender': this.schoolForm.controls.gender.value,
			'password': this.schoolForm.controls.password.value,
			'designation': this.schoolForm.controls.designation.value,
			'qualification': this.schoolForm.controls.qualification.value,
			'dob': (this.schoolForm.controls.dob.value),
			'email': this.schoolForm.controls.adminEmail.value,
			'address': '',
			'aadhar_card': '',
			'blood_gr': '',
			'religion': '',
			'caste': '',
			'mother_tounge': '',
			'marital_status': '',
			'experiance': '',
			'level': '',
			'leaderShip_Exp': '',
			'cv': '',
			'ten_details': {
				'school': '',
				'Board': '',
				'percentage': '',
				'year_of_passing': '',
				'Attach_doc': ''
			},
			'twelve_details': {
				'school': '',
				'Board': '',
				'percentage': '',
				'year_of_passing': '',
				'Attach_doc': ''
			},
			'graduation_details': {
				'school': '',
				'Board': '',
				'percentage': '',
				'year_of_passing': '',
				'Attach_doc': ''
			},
			'masters_details': {
				'school': '',
				'Board': '',
				'percentage': '',
				'year_of_passing': '',
				'Attach_doc': ''
			},
			'other_degrees': [{
				'other1': ''
			}],
			'certifications': [{
				'ca1': ''
			}],
			'extra_achievement': [{
				'extra_achievement': ''
			}]
		}
		return adminData;
	}

}
