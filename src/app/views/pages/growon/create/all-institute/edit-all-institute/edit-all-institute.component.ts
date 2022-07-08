import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SchoolDetails } from '../../../model/schooldetails.model';
import { CreateservicesService } from '../../services/createservices.service';
import { SchoolAddRequest } from './../../../model/schooladdrequest.model';
import { BranchDetails } from './../../../model/branchdetails.model';

@Component({
  selector: 'kt-edit-all-institute',
  templateUrl: './edit-all-institute.component.html',
  styleUrls: ['./edit-all-institute.component.scss']
})
export class EditAllInstituteComponent implements OnInit {

  updateSchoolForm: FormGroup;
  @Input() school: SchoolDetails;
  users = [];
  schoolFlag:boolean=false
  profilePicture:any;
  //schools: any;
  isLoaded: boolean = false;
  schoolType: any[] = [];
  boards: any[] = [];
  cities: any[] = [];
  countries: any[] = [];
  states: any[] = [];
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
  listofSyllabus: any[] = [];
  schoolAddRequest: SchoolAddRequest = <SchoolAddRequest>{};
  filePreview:any

  constructor(public activeModal: NgbActiveModal, public apiService: CreateservicesService,
    private formBuilder: FormBuilder,) { }
  ngOnInit(): void {
    localStorage.getItem('schoolId')?this.schoolFlag=true:this.schoolFlag=false;

    this.getCountries();
    this.getStates();
    this.getCities();
    this.getSchoolType();
    this.getb1Countries();
    this.getb2Countries();
    this.getb3Countries();
    this.getb4Countries();
    this.getb5Countries();
    //this.getSyllabus();
    //this.getBoards();
    //this.getSyllabus();
    //this.getAllUsers();
    //this.getSchooldetail();
    //this.schools=this.school;
    this.createUpdateForm();
    this.autoFillUpdateForm();

  }

  // getSchooldetail() {
  //   this.apiService.getallinstitute(this.school.schoolId).subscribe((response: any) => {
  //     this.schools = response.body.data[0];
  //     console.log(response.body.data[0]);
  //     this.isLoaded=true;
  //   })
  // }

  createUpdateForm() {
    this.updateSchoolForm = this.formBuilder.group({
      schoolName: ['', [Validators.required, Validators.maxLength(50)]],
      //board: ['', Validators.required],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"), Validators.required]],
      contact_number: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(15), Validators.required]],
      sType: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(150)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      website: ['', Validators.maxLength(50)],
      //listOfClasses: [''],
      //listOfSubjects: [''],
      //syllabusList: [''],
      //noOfBranches: [''],
      branch: this.formBuilder.array([])
    });
    let branches = this.updateSchoolForm.controls.branch as FormArray;
    for (let index = 0; index < this.school.branch.length; index++) {
      branches.push(this.formBuilder.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        contact: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        pincode: ['', Validators.required],
      }))
    }
    this.isLoaded = true;
  }

  getSchoolType() {
    this.apiService.getSchoolType().subscribe((response: any) => {
      this.schoolType = response.data
    })
  }
   // onFileUpload
   onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
      const reader = new FileReader();
      reader.onload = e => this.filePreview = reader.result;
      reader.readAsDataURL(file);
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

  autoFillUpdateForm() {
    console.log(this.school)
    this.updateSchoolForm.controls.schoolName.setValue(this.school.schoolName);
    this.updateSchoolForm.controls.address.setValue(this.school.address);
    this.updateSchoolForm.controls.country.setValue(this.school.country);
    this.updateSchoolForm.controls.state.setValue(this.school.state);
    this.updateSchoolForm.controls.city.setValue(this.school.city);
    this.updateSchoolForm.controls.pinCode.setValue(this.school.pincode);
    this.updateSchoolForm.controls.email.setValue(this.school.email != undefined ? this.school.email : "");
    this.updateSchoolForm.controls.website.setValue(this.school.webSite);
    this.updateSchoolForm.controls.contact_number.setValue(this.school.contact_number);
    this.updateSchoolForm.controls.sType.setValue(this.school.sType);
    this.filePreview=this.school.schoolImage;
    this.profilePicture=this.school.schoolImage;
    let branches = this.updateSchoolForm.controls.branch as FormArray;
    for (let index = 0; index < this.school.branch.length; index++) {
      console.log(this.updateSchoolForm);
      let group = branches.controls[index] as FormGroup;
      group.controls.name.setValue(this.school.branch[index].name);
      group.controls.address.setValue(this.school.branch[index].address);
      group.controls.contact.setValue(this.school.branch[index].contact);
      group.controls.country.setValue(this.school.branch[index].country._id);
      this.countryChangeDropdown(group.controls.country.value, index);
      group.controls.state.setValue(this.school.branch[index].branchStateId);
      this.stateChangeDropdown(group.controls.state.value, index);
      group.controls.city.setValue(this.school.branch[index].branchCityId);
      group.controls.pincode.setValue(this.school.branch[index].branchPincode);
    }
  }

  getBoards() {
    this.apiService.getBoards().subscribe((response: any) => {
      this.boards = response.body.data;
      console.log(this.boards)
    })
  }

  getCities() {
    this.apiService.getCities().subscribe((response: any) => {
      // this.cities = response.body.data;
      this.cities = response.body.data.filter(usr => {
        return usr.state_id == this.updateSchoolForm.controls.state.value

      })
    })
  }

  countryChangeDropdown(value: string, i: number) {
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
    this.apiService.getCountries().subscribe((response: any) => {
      this.b1Countries = response.body.data;
    })
  }

  getb1States(value: string) {
    this.apiService.getStates().subscribe((response: any) => {
      this.b1States = response.body.data.filter((usr: any) => {
        return usr.country_id == value
      })
    })
  }

  getb1Cities(value: string) {
    this.apiService.getCities().subscribe((response: any) => {
      this.b1Cities = response.body.data.filter((usr: any) => {
        return usr.state_id == value
      })
    })
  }

  getb2Countries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.b2Countries = response.body.data;
    })
  }

  getb2States(value: string) {
    this.apiService.getStates().subscribe((response: any) => {
      this.b2States = response.body.data.filter((usr: any) => {
        return usr.country_id == value
      })
    })

  }

  getb2Cities(value: string) {
    this.apiService.getCities().subscribe((response: any) => {
      this.b2Cities = response.body.data.filter((usr: any) => {
        return usr.state_id == value
      })
    })
  }

  getb3Countries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.b3Countries = response.body.data;
    })
  }

  getb3States(value: string) {
    this.apiService.getStates().subscribe((response: any) => {
      this.b3States = response.body.data.filter((usr: any) => {
        return usr.country_id == value
      })
    })
  }

  getb3Cities(value: string) {
    this.apiService.getCities().subscribe((response: any) => {
      this.b3Cities = response.body.data.filter((usr: any) => {
        return usr.state_id == value
      })
    })
  }

  getb4Countries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.b4Countries = response.body.data;
    })
  }

  getb4States(value: string) {
    this.apiService.getStates().subscribe((response: any) => {
      this.b4States = response.body.data.filter(usr => {
        return usr.country_id == value
      })
    })
  }

  getb4Cities(value: string) {
    this.apiService.getCities().subscribe((response: any) => {
      this.b4Cities = response.body.data.filter((usr: any) => {
        return usr.state_id == value
      })
    })
  }

  getb5Countries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.b5Countries = response.body.data;
    })
  }

  getb5States(value: string) {
    this.apiService.getStates().subscribe((response: any) => {
      this.b5States = response.body.data.filter(usr => {
        return usr.country_id == value
      })
    })
  }

  getb5Cities(value: string) {
    this.apiService.getCities().subscribe((response: any) => {
      this.b5Cities = response.body.data.filter((usr: any) => {
        return usr.state_id == value
      })
    })
  }

  getSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.listofSyllabus = response.body.data;
    })
  }
  getCountries() {
    this.apiService.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
      console.log(response.body.data)
    })
  }
  getStates() {
    this.apiService.getStates().subscribe((response: any) => {
      // this.states = response.body.data;
      this.states = response.body.data.filter(usr => {
        return usr.country_id == this.updateSchoolForm.controls.country.value
      })
    })
  }

  // updateSchool() {
  //   this.apiService.updateSchool(this.updateSchoolForm.value).subscribe((response: any) => {
  //     Swal.fire('Success', 'Updated', 'success');
  //     let element = document.getElementById('reset') as HTMLElement;
  //     element.click();
  //     this.activeModal.close();
  //   }, (error) => {
  //     if (error.status == 400) {
  //       Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
  //       return;
  //     } else {
  //       Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
  //       return;
  //     }
  //   })
  // }

  updateSchoolNew() {
    if (this.updateSchoolForm.valid) {
      this.schoolAddRequest.schoolImage=this.profilePicture
      this.schoolAddRequest.schoolName = this.updateSchoolForm.controls.schoolName.value;
      this.schoolAddRequest.address = this.updateSchoolForm.controls.address.value;
      this.schoolAddRequest.country = this.updateSchoolForm.controls.country.value;
      this.schoolAddRequest.state = this.updateSchoolForm.controls.state.value;
      this.schoolAddRequest.city = this.updateSchoolForm.controls.city.value;
      this.schoolAddRequest.pincode = this.updateSchoolForm.controls.pinCode.value;
      this.schoolAddRequest.schoolEmail = this.updateSchoolForm.controls.email.value;
      this.schoolAddRequest.schoolWebsite = this.updateSchoolForm.controls.website.value;
      this.schoolAddRequest.SchoolContactNumber = this.updateSchoolForm.controls.contact_number.value;
      // this.schoolAddRequest.boardId = this.schoolForm.controls.board.value;
      this.schoolAddRequest.institutionTypeId = this.updateSchoolForm.controls.sType.value;
      //this.schoolAddRequest.syllabusId = this.schoolForm.controls.listofSyllabus.value;
      this.schoolAddRequest.Branch = [];
      let branches = this.updateSchoolForm.controls.branch as FormArray;
      for (let i = 0; i < this.school.branch.length; i++) {
        let group = branches.controls[i] as FormGroup;
        let branchDetails: BranchDetails = <BranchDetails>{};
        branchDetails.name = group.controls.name.value;
        branchDetails.address = group.controls.address.value;
        branchDetails.contact = group.controls.contact.value;
        branchDetails.branchCountryId = group.controls.country.value;
        branchDetails.branchStateId = group.controls.state.value;
        branchDetails.branchCityId = group.controls.city.value;
        branchDetails.branchPincode = group.controls.pincode.value;
        this.schoolAddRequest.Branch.push(branchDetails);
      }
      console.log(this.schoolAddRequest);
      this.apiService.updateSchool(this.schoolAddRequest, this.school._id).subscribe((response: any) => {
        if (response.body.data != undefined) {
          Swal.fire('Success', 'Updated', 'success');
          this.updateSchoolForm.reset();
          this.activeModal.close('success');
        }
      }, (error) => {
        if (error.status == 400) {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
          return;
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
          return;
        }
      })

      //Update Branch 

      //this.apiService.updateBranch()
    }
    else {
      this.updateSchoolForm.markAllAsTouched();
    }
  }


  // Get all roles
  // getAllUsers() {
  //   let userInfo = localStorage.getItem('info');
  //   let user = JSON.parse(userInfo);
  //   let id: any;
  //   let reqData;

  //   (user.user_info[0].school_id)
  //   id = user.user_info[0].school_id;


  //   let data = reqData;

  //   this.apiService.getAllUsers(data).subscribe((response: any) => {


  //     console.log(response.body.data.filter(row => row.profile_type.role_name == 'school_admin' && row.school_id == this.schoolId))

  //     this.users = response.body.data.filter(row => row.profile_type.role_name == 'school_admin' && row.school_id == this.schoolId)
  //     console.log(this.users[0].mobile, "assign role data")
  //     this.isLoaded = true;
  //   })
  // }

}
