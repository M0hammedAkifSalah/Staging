import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forEach } from 'lodash';
import { AddBoardComponent } from '../../../auth/add-board/add-board.component';
import { AddSubjectsComponent } from '../../../auth/add-subjects/add-subjects.component';
import { AddSyllabusComponent } from '../../../auth/add-syllabus/add-syllabus.component';
import { StepFormComponent } from '../../../auth/step-form/step-form.component';
import { LoadingService } from '../../../loader/loading/loading.service';
import { ImportFromGlobalComponent } from '../../learning/import-from-global/import-from-global.component';
import { CreateservicesService } from '../services/createservices.service';

@Component({
  selector: 'kt-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {

  boardForm: FormGroup;
  classes = [];
  removeSubject = [];
  newAddedSubject = [];
  mappingDataName = [];
  mappingDataId = [];
  mappingDataNameObj = { classs: null, board: null, syllabus: null, subject: [] }
  mappingDataIdObj = {
    classId: null, boardId: null, syllabusId: null, oldBoardId: null, oldSyllabusId: null, subjectId: [], removeSubject: [],
    newAddedSubject: []
  }
  boardFlag: boolean = false
  syllabusFlag: boolean = false;
  subjectFlag: boolean = false;
  subjectButtonDisable: boolean = true;
  syllabusButtonDisable: boolean = true
  mapButtonDisable: boolean = true
  boardBySchool: any = [];
  syllabusBySchool: any;
  subjectBySchool: any;
  addMappingFlag: boolean = true;
  constructor(private _formBuilder: FormBuilder, public apiService: CreateservicesService,
    private modalService: NgbModal, private cdr: ChangeDetectorRef, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.boardForm = this._formBuilder.group({
      classMap: this._formBuilder.array([])
    })
    this.getClasses()
    this.getBoardBySchool()
    this.getSyllabusBySchool()
    this.getSubjectBySchool()
    this.loadingService.hide();
    // const modalRef = this.modalService.open(StepFormComponent, { size: 'xl', backdrop: 'static' })
  }

  getClasses() {
    // this.apiService.getClasses().subscribe((response: any) => {
    //   this.classes = response.body.data;
    //   this.dataSource.data = this.classes;
    //   console.log(this.classes)
    // })
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getallinstitute(id).subscribe((data: any) => {
      this.classes = data.body.data[0].classList
      console.log(this.classes)
      this.cdr.detectChanges();
      this.mapClass()
      this.existedMapping()
    })

  }

  async existedMapping() {
    this.apiService.getMappedData().subscribe((response: any) => {
      if (response && response.body && response.body.data && response.body) {
        let alreadyMapedData = response.body.data
        if (alreadyMapedData && alreadyMapedData.length) {
          this.addMappingFlag = false
          console.log("data", alreadyMapedData)
          for (let i = 0; i < this.mappingDataId.length; i++) {
            let classData = alreadyMapedData.filter((f) => f.classId === this.mappingDataId[i].classId)
            if (classData && classData.length) {
              this.mappingDataId[i].boardId = classData[0].boardId
              this.mappingDataId[i].oldBoardId = classData[0].boardId
              this.mappingDataName[i].board = classData[0].boardName
              this.mappingDataId[i].syllabusId = classData[0].syllabusId
              this.mappingDataId[i].oldSyllabusId = classData[0].syllabusId
              this.mappingDataName[i].syllabus = classData[0].syllabusName
              this.mappingDataId[i].subjectId = [];
              this.mappingDataName[i].subject = [];
              for (const subj of classData[0].subjectList) {
                this.mappingDataId[i].subjectId.push(subj.subjectId)
                this.mappingDataName[i].subject.push(subj.subjectName)
              }
            }
          }
          this.boardFlag = true
          this.syllabusFlag = true;
          this.subjectFlag = true;
          this.subjectButtonDisable = false;
          this.syllabusButtonDisable = false
          this.mapButtonDisable = false
          this.cdr.detectChanges()
        }
      }
    })
    console.log("from mapped data id", this.mappingDataId)
    console.log("from mapped data name", this.mappingDataName)
  }

  getBoardBySchool() {
    this.apiService.getBoards().subscribe((response: any) => {
      this.boardBySchool = response.body.data;
      console.log(this.boardBySchool)
    })
  }

  getSyllabusBySchool() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.syllabusBySchool = response.body.data;
    })
  }

  getSubjectBySchool() {
    this.apiService.getSubjects().subscribe((response: any) => {
      this.subjectBySchool = response.body.data
    })
  }

  //import class
  importClass() {
    const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    modalRef.componentInstance.type = "class";
    // window.location.reload()
    this.getClasses()
    this.mapClass()
    this.cdr.detectChanges()
  }

  //import Board
  importBoard() {
    const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    modalRef.componentInstance.type = "board";
  }

  //import syllabus
  importSyllabus() {
    const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    modalRef.componentInstance.type = "syllabus";
  }

  //import subject
  importSubject() {
    const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    modalRef.componentInstance.type = "subject";
  }

  //map class
  mapClass() {
    if (this.classes) {
      this.classes.forEach((element, index) => {
        this.mappingDataName.push({ ...this.mappingDataNameObj })
        this.mappingDataId.push({ ...this.mappingDataIdObj })
        this.mappingDataName[index]['classs'] = element.className
        this.mappingDataId[index]['classId'] = element.classId
      });
    }
    this.cdr.detectChanges()
    console.log(this.mappingDataName)
    console.log(this.mappingDataId)
  }

  openBoardModal() {
    const modalRef = this.modalService.open(AddBoardComponent, { size: 'lg' })
    modalRef.componentInstance.classList = this.classes;
    modalRef.componentInstance.mapedValue = this.mappingDataName
    modalRef.result.then(result => {
      console.log("board result", result)
      console.log(this.mappingDataName)
      result.boardMap.forEach((element, index) => {
        console.log(element)
        if (element.classes == this.mappingDataName[index].classs) {
          this.mappingDataName[index].board = element.board
        }
      });
      console.log(this.mappingDataName)
      console.log(this.mappingDataId)
      this.boardFlag = true;
      this.syllabusButtonDisable = false;
      this.cdr.detectChanges()
    })
  }

  openSyllabusModal() {
    const modalRef = this.modalService.open(AddSyllabusComponent, { size: 'lg' })
    modalRef.componentInstance.classList = this.classes;
    modalRef.componentInstance.mapedValue = this.mappingDataName
    modalRef.result.then(result => {
      console.log("Syllabus result", result)
      console.log(this.mappingDataName)
      result.syllabusMap.forEach((element, index) => {
        console.log(element)
        if (element.classes == this.mappingDataName[index].classs) {
          this.mappingDataName[index].syllabus = element.syllabus
        }
      });
      console.log(this.mappingDataName)
      console.log(this.mappingDataId)
      this.syllabusFlag = true
      this.subjectButtonDisable = false
      this.cdr.detectChanges()
    })
  }

  openSubjectModal() {
    const modalRef = this.modalService.open(AddSubjectsComponent, { size: 'xl' })
    modalRef.componentInstance.classList = this.classes;
    modalRef.componentInstance.mapedValue = this.mappingDataName
    modalRef.componentInstance.addMappingFlag = this.addMappingFlag;
    modalRef.result.then(result => {

      //set value in remove subject array
      if (result.removeList) {
        for (let item of Object.keys(result.removeList)) {
          for (let i = 0; i < this.mappingDataName.length; i++) {
            if (this.mappingDataName[i].classs == item) {
              this.mappingDataId[i].removeSubject = []
              for (let j = 0; j < result.removeList[item].length; j++) {
                let subject = this.subjectBySchool.filter((f) => f.name === result.removeList[item][j])
                if (subject && subject.length) {
                  this.mappingDataId[i].removeSubject[j] = subject[0]._id
                }
              }
            }
          }
        }
      }
      //set value in new added subject array
      if (result.newAdded) {
        for (let item of Object.keys(result.newAdded)) {
          for (let i = 0; i < this.mappingDataName.length; i++) {
            if (this.mappingDataName[i].classs == item) {
              this.mappingDataId[i].newAddedSubject = []
              for (let j = 0; j < result.newAdded[item].length; j++) {
                let subject = this.subjectBySchool.filter((f) => f.name === result.newAdded[item][j])
                if (subject && subject.length) {
                  this.mappingDataId[i].newAddedSubject[j] = subject[0]._id
                }
              }
            }
          }
        }
      }
      if (result.subjectData) {
        for (let item of Object.keys(result.subjectData)) {
          for (let i = 0; i < this.mappingDataName.length; i++) {
            if (this.mappingDataName[i].classs == item) {
              this.mappingDataName[i].subject = result.subjectData[item]
              this.mappingDataId[i].subjectId = []
              for (let j = 0; j < this.mappingDataName[i].subject.length; j++) {
                let subject = this.subjectBySchool.filter((f) => f.name === this.mappingDataName[i].subject[j])
                if (subject && subject.length) {
                  this.mappingDataId[i].subjectId[j] = subject[0]._id
                }
              }
              if (this.addMappingFlag) {
                this.mappingDataId[i].newAddedSubject = this.mappingDataId[i].subjectId;
              }
            }
          }
          // this.mappingDataName.forEach((element, i) => {
          //   if (element.classs = item) {
          //     element.subject = result.subjectData[item]
          //     element.subjectId = []
          //     this.mappingDataName[i].subject.forEach((element1, j) => {
          //       let subject = this.subjectBySchool.filter((f) => f.name === element1)
          //       if (subject && subject.length) {
          //         this.mappingDataId[i].subjectId[j] = subject[0]._id;
          //         if (this.addMappingFlag) {
          //           this.mappingDataId[i].newAddedSubject[j] = subject[0]._id;
          //         }
          //       }
          //     });
          //   }
          // });
        }
      }
      //set id of subject in mapped value
      console.log("remove subject List", this.removeSubject);
      console.log("new added subject", this.newAddedSubject);
      console.log("Mapping Data Name", this.mappingDataName)
      console.log("Mapping Data Id", this.mappingDataId)
      this.subjectFlag = true
      this.mapButtonDisable = false
      this.cdr.detectChanges()
    })
  }

  mapData() {


    // this.loadingService.show();
    for (let i = 0; i < this.mappingDataName.length; i++) {
      let classes = this.classes.filter((f) => f.className === this.mappingDataName[i].classs);
      if (classes && classes.length) {
        this.mappingDataId[i].classId = classes[0].classId
      }
      let board = this.boardBySchool.filter((f) => f.name === this.mappingDataName[i].board)
      if (board && board.length) {
        this.mappingDataId[i].boardId = board[0]._id
      }
      let syllabus = this.syllabusBySchool.filter((f) => f.name === this.mappingDataName[i].syllabus);
      if (syllabus && syllabus.length) {
        this.mappingDataId[i].syllabusId = syllabus[0]._id
      }
    }
    console.log(this.mappingDataName)
    console.log(this.mappingDataId)

    // let updateBoardObj = { mapDetails: [], boardId: '' }
    // let updateSubjectObj = { mapDetails: [], subjectId: '' }
    // let updateSyllabusObj = { mapDetails: [], syllabusId: '' }

    for (let i = 0; i < this.mappingDataId.length; i++) {

      let updateBoardObj = { mapDetails: [], boardId: '', removeBoardId: '', removeClassId: '' }
      let updateSubjectObj = { classId: '', boardId: '', syllabuseId: '', removeSubjectId: [], newAddedSubjectId: [] }
      let updateSyllabusObj = { mapDetails: [], syllabusId: '', removeBoardId: '', removeClassId: '', removeSyllabusId: '' }

      // let updateBoardObj = { mapDetails: [], boardId: '' }
      // let updateSubjectObj = { mapDetails: [], subjectId: '' }
      // let updateSyllabusObj = { mapDetails: [], syllabusId: '' }

      //To Update Board
      updateBoardObj.mapDetails.push({ "classId": this.mappingDataId[i].classId });
      updateBoardObj.boardId = this.mappingDataId[i].boardId;
      updateBoardObj.removeBoardId = this.mappingDataId[i].oldBoardId;
      updateBoardObj.removeClassId = this.mappingDataId[i].classId

      //update Board
      this.apiService.updateBoard(updateBoardObj).subscribe(
        data => {
          updateBoardObj = { mapDetails: [], boardId: '', removeBoardId: '', removeClassId: '' };
          // updateBoardObj = { mapDetails: [], boardId: '' };
        }
      )

      //To Update Syllabus
      updateSyllabusObj.mapDetails.push({ "classId": this.mappingDataId[i].classId, "boardId": this.mappingDataId[i].boardId })
      updateSyllabusObj.syllabusId = this.mappingDataId[i].syllabusId;
      updateSyllabusObj.removeBoardId = this.mappingDataId[i].oldBoardId;
      updateSyllabusObj.removeClassId = this.mappingDataId[i].classId;
      updateSyllabusObj.removeSyllabusId = this.mappingDataId[i].oldSyllabusId;
      //update Syllabus
      this.apiService.updateSyllabus(updateSyllabusObj).subscribe(
        data => {
          updateSyllabusObj = { mapDetails: [], syllabusId: '', removeBoardId: '', removeClassId: '', removeSyllabusId: '' }
          // updateSyllabusObj = { mapDetails: [], syllabusId: '' }
        }

      )

      //To Update Subject

      updateSubjectObj.classId = this.mappingDataId[i].classId;
      updateSubjectObj.boardId = this.mappingDataId[i].boardId;
      updateSubjectObj.syllabuseId = this.mappingDataId[i].syllabusId;
      updateSubjectObj.removeSubjectId = this.mappingDataId[i].removeSubject;
      updateSubjectObj.newAddedSubjectId = this.mappingDataId[i].newAddedSubject
      //update Subject
      this.apiService.updateSubject(updateSubjectObj).subscribe(
        data => {
          updateSubjectObj = { classId: '', boardId: '', syllabuseId: '', removeSubjectId: [], newAddedSubjectId: [] }
          // updateSubjectObj = { mapDetails: [], subjectId: '' }
        }
      )

    }
    this.mappingDataId = [];
    this.mappingDataName = [];
    this.getClasses();
    // this.loadingService.hide();
  }

}
