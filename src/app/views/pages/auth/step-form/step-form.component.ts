import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnyMxRecord } from 'dns';
import { forEach, result } from 'lodash';
import Swal from 'sweetalert2';
import { CreateservicesService } from '../../growon/create/services/createservices.service';
import { AddSubjectsComponent } from '../add-subjects/add-subjects.component';
import { AddSyllabusComponent } from '../add-syllabus/add-syllabus.component';

@Component({
  selector: 'kt-step-form',
  templateUrl: './step-form.component.html',
  styleUrls: ['./step-form.component.scss']
})
export class StepFormComponent implements OnInit {
  subjectButton: boolean;
  options: any = []
  options2: any = []
  maps = new FormArray([]);
  selectedClassList: Array<any> = [];
  schoolForm: FormGroup;
  branchContainer: Array<any> = [1];
  cities: Array<any> = ['Bangalore'];
  states: Array<any> = ['karnataka'];
  countries: Array<any> = ['India', 'USA', 'Japan'];
  // boards: Array<any> = ['CBSE', 'ICSE', 'IB', 'State'];
  boards: any[] = ['CBSE', 'ICSE', 'IB', 'State'];
  sylabus: Array<any> = ['Syllabus 1', 'Syllabus 2'];
  subjects: Array<any>;
  schoolType: Array<string> = ['Government', 'Private', 'Aided'];
  displayedColumns: string[] = ['select', 'name',];
  displayedColumns2: string[] = ['class', 'board'];
  classes: Array<any> = ['Get from DB', 'Get from DB'];
  selected = -1;
  isClassSelected: boolean = false;
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  boardForm: FormGroup;
  isSyllabusFlag: boolean = false;
  isSubjectFlag: boolean = false;
  syllabus: any;
  classesLoaded: boolean = false;
  index: number = 2;
  subjectButtonDisable: boolean = true;
  stepFormValidationFlag: boolean = true;

  constructor(private _formBuilder: FormBuilder, public apiService: CreateservicesService,
    private modalService: NgbModal, private cdr: ChangeDetectorRef, private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.schoolForm = this._formBuilder.group({
      institution: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pinCode: ['', Validators.required],
      email: ['', Validators.required],
      contact: ['', Validators.required],
      board: ['', Validators.required],
      schoolType: ['', Validators.required],
      website: ['', Validators.required],
      noOfBranches: ['', Validators.required],
      branch: this._formBuilder.array([
        (this._formBuilder.group({
          branchName: this._formBuilder.control('', Validators.required),
          branchContact: this._formBuilder.control('', Validators.required),
          branchAddress: this._formBuilder.control('', Validators.required),
        }))


      ])

    });
    this.boardForm = this._formBuilder.group({
      classMap: this._formBuilder.array([])
    })
    this.getCountries();
    this.getStates();
    this.getCities();
    this.getClasses();
    this.getSyllabus();
    this.getSubjects();
    this.getBoard();
    this.getInstitutionType();
  }

  addBranchContainer() {
    if (isNaN(this.schoolForm.controls.noOfBranches.value)) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter a number' });
      return
    } else {
      this.branchContainer = [];
      (<FormArray>this.schoolForm.get("branch")).clear();
      let branch = this.schoolForm.get("branch") as FormArray
      for (let i = 0; i < this.schoolForm.controls.noOfBranches.value; i++) {
        this.branchContainer.push(i);
        branch.push(this._formBuilder.group({
          branchName: this._formBuilder.control('', Validators.required),
          branchContact: this._formBuilder.control('', Validators.required),
          branchAddress: this._formBuilder.control('', Validators.required),
        }))
        this.cdr.detectChanges();
      }
    }


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

  getClasses() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getallinstitute(id).subscribe((data: any) => {
      this.classes = data.body.data[0].classList
      this.dataSource.data = data.body.data[0].classList;
      this.cdr.detectChanges();

    })
  }

  getInstitutionType() {
    this.apiService.getInstitutionType().subscribe(
      (response: any) => {
        this.schoolType = response.body.data;
        this.cdr.detectChanges();
      }
    )
  }

  getBoard() {
    this.apiService.getBoards().subscribe(
      (response: any) => {
        this.boards = response.body.data;
        this.cdr.detectChanges();
      }
    )
  }


  setCheckbox(event: any, index: number) {
    console.log(event)
    if (!this.options.includes(event)) {
      this.options = [...this.options, event];
      this.saveOptions()

    } else {
      this.options = this.options.filter((item) => item !== event);
      this.saveOptions()
    }
    this.getBoard()
    this.cdr.detectChanges();
  }

  mapBoardWithClass(index, value) {
    (<FormArray>this.boardForm.get("classMap")).value[index].board = value
  }

  saveSchoolForm() {
    if (this.schoolForm.valid) {
      console.log(this.schoolForm, "schoolForm")
    } else {
      return
    }

  }
  saveOptions() {
    (<FormArray>this.boardForm.get("classMap")).clear();
    this.dataSource2.data = this.options;
    this.selectedClassList = [];
    for (let i = 0; i < this.options.length; i++) {
      this.isClassSelected = true;
      this.selectedClassList.push(this.options[i].className);
      (<FormArray>this.boardForm.get("classMap")).push(this._formBuilder.group({
        class: this._formBuilder.control(this.options[i].className),
        board: this._formBuilder.control('', Validators.required),
        sylabus: this._formBuilder.control('', Validators.required),
        subject: this._formBuilder.control('', Validators.required),
      }))
    }
  }

  saveOptions2() {
    console.log(this.boardForm);
  }
  openEditSubject() {
    const modalRef = this.modalService.open(AddSubjectsComponent, { size: 'lg' })
    modalRef.componentInstance.classList = this.selectedClassList
    modalRef.componentInstance.mapedValue = this.boardForm.value.classMap
    modalRef.result.then(result => {
      if (result) {
        for (let item of Object.keys(result)) {
          for (let j = 0; j < (<FormArray>this.boardForm.get("classMap")).length; j++) {
            if (item == (<FormArray>this.boardForm.get("classMap")).value[j].class) {
              (<FormArray>this.boardForm.get("classMap")).value[j].subject = result[item]
              this.isSubjectFlag = true
              this.stepFormValidationFlag = false
            }
          }
        }
      }
    })
  }
  openEditSylabus() {
    this.isSyllabusFlag = false
    const modalRef = this.modalService.open(AddSyllabusComponent, { size: 'lg' })
    modalRef.componentInstance.classList = this.selectedClassList
    modalRef.componentInstance.mapedValue = this.boardForm.value.classMap
    modalRef.result.then(result => {
      if (result) {
        for (let i = 0; i < result.syllabusMap.length; i++) {
          for (let j = 0; j < (<FormArray>this.boardForm.get("classMap")).length; j++) {
            if (result.syllabusMap[i].classes == (<FormArray>this.boardForm.get("classMap")).value[j].class) {
              (<FormArray>this.boardForm.get("classMap")).value[j].sylabus = result.syllabusMap[i].syllabus
              this.isSyllabusFlag = true
              this.subjectButtonDisable = false
            }
          }
        }
      }
    })
  }


  getSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.sylabus = response.body.data;
    })
  }
  getSubjects() {
    this.apiService.getSubjects().subscribe((response: any) => {
      this.subjects = response.body.data
    })
  }

  addStepForm() {
    let classMapArray = (<FormArray>this.boardForm.get("classMap"))
    //set id value 
    for (let i = 0; i < classMapArray.length; i++) {
      for (let j = 0; j < this.classes.length; j++) {
        if (classMapArray.value[i].class === this.classes[j].className) {
          classMapArray.value[i].class = this.classes[j].classId
        }
      }
      for (let j = 0; j < this.boards.length; j++) {
        if (classMapArray.value[i].board === this.boards[j].name) {
          classMapArray.value[i].board = this.boards[j]._id
        }
      }
      for (let j = 0; j < this.sylabus.length; j++) {
        if (classMapArray.value[i].sylabus === this.sylabus[j].name) {
          classMapArray.value[i].sylabus = this.sylabus[j]._id
        }
      }
      for (let j = 0; j < this.subjects.length; j++) {
        for (let k = 0; k < classMapArray.value[i].subject.length; k++) {
          if (classMapArray.value[i].subject[k] === this.subjects[j].name) {
            classMapArray.value[i].subject[k] = this.subjects[j]._id
          }
        }
      }
    }
    let updateBoardObj = { mapDetail: [], boardId: '' }
    let updateSubjectObj = { mapDetail: [], subjectId: '' }
    let updateSyllabusObj = { mapDetail: [], syllabusId: '' }

    for (let i = 0; i < classMapArray.length; i++) {

      //To Update Board
      updateBoardObj.mapDetail.push({ "classId": classMapArray.value[i].class })
      updateBoardObj.boardId = classMapArray.value[i].board
      //update Board 
      this.apiService.updateBoard(updateBoardObj).subscribe(
        data => {
        }
      )

      //To Update Syllabus
      updateSyllabusObj.mapDetail.push({ "classId": classMapArray.value[i].class, "boardId": classMapArray.value[i].board })
      updateSyllabusObj.syllabusId = classMapArray.value[i].sylabus
      //update Syllabus
      this.apiService.updateSyllabus(updateSyllabusObj).subscribe(
        data => {

        }
      )

      //To Update Subject
      for (let j = 0; j < classMapArray.value[i].subject.length; j++) {
        updateSubjectObj.mapDetail.push({ classId: classMapArray.value[i].class, boardId: classMapArray.value[i].board, syllabusId: classMapArray.value[i].sylabus })
        updateSubjectObj.subjectId = classMapArray.value[i].subject[j]
        //update Subject
        this.apiService.updateSubject(updateSubjectObj).subscribe(
          data => {

          }
        )
      }
    }

    // update status of Step Form
    let status = {
      isSubmitForm: false
    }
    this.apiService.updateStepForm(status, JSON.parse(localStorage.getItem('info')).user_info[0]._id).subscribe(
      data => {

      }
    )

    //update School Data
    let schoolData = {
      schoolName: this.schoolForm.get('institution'),
      address: this.schoolForm.get('address'),
      country: this.schoolForm.get('country'),
      state: this.schoolForm.get('state'),
      city: this.schoolForm.get('city'),
      email: this.schoolForm.get('email'),
      pincode: this.schoolForm.get('pinCode'),
      webSite: this.schoolForm.get('website'),
      contact_number: this.schoolForm.get('contact'),
      sType: this.schoolForm.get('schoolType'),
      branch: this.schoolForm.get('branch')
    }
    this.apiService.updateSchool(schoolData, JSON.parse(localStorage.getItem('info')).user_info[0].school_id).subscribe(
      data => {
      }
    )
    this.activeModal.close()
  }
}
