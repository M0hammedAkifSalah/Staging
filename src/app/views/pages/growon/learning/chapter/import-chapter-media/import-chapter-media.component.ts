import { V } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { LoadingService } from 'src/app/views/pages/loader/loading/loading.service';
import Swal from 'sweetalert2';
import { CreateservicesService } from '../../../create/services/createservices.service';
import { LearningService } from '../../services/learning.service';

@Component({
  selector: 'kt-import-chapter-media',
  templateUrl: './import-chapter-media.component.html',
  styleUrls: ['./import-chapter-media.component.scss']
})
export class ImportChapterMediaComponent implements OnInit {

  schoolId:any;
  globalId:any;
  class:any=[];
  importObject = new ImportMediaClass();
  subjectFlag: boolean;
  chapterFlag: boolean=false;
  subjects: any[];
  chapters: any[];
  classes: any;
  validationFlag:boolean=false;
  chapterMedia:any;
  previewMediaFlag:boolean=true;
  isGlobal:boolean=false;

  constructor(private activeModal:NgbActiveModal,
    private apiService:LearningService, private cdr:ChangeDetectorRef,
    private loaderService:LoadingService,private createApiServices:CreateservicesService) { }

  ngOnInit(): void {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);




    if (user.user_info[0].school_id) {
      this.schoolId = user.user_info[0].school_id;
      this.isGlobal=false;
      this.getallinstitutes();

      // this.getallinstitutes();
    } else {
      this.globalId = user.user_info[0]._id;
      this.isGlobal=true;
      this.getClasses();
      this.getSubjects();
      // this.getClasses();
      // this.getSubjects();
    }

  }

  getClasses() {
    this.apiService.getGlobalClasses().subscribe((response: any) => {
      this.classes = _.sortBy(response.body.data,'name');
      this.cdr.detectChanges();
    });
  }


  getSubjects() {
    this.loaderService.show();
    this.apiService.getGlobalSubjects().subscribe((response: any) => {
      this.subjects = response.body.data;
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
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
      this.classes = _.sortBy(data.body.data[0].classList,'className');
      this.importObject.selectedClassId = this.classes[0].classId;
      this.getBoardIdAndSyllabusId(this.importObject.selectedClassId);
      this.cdr.detectChanges();

    })

  }
  getGlobalChapters(value?){
    this.importObject.selectedChapters='';
    this.loaderService.show();
    let obj ={
      "class_id": this.importObject.selectedClassId,
      "subject_id": this.importObject.selectedSubjectId,
      "repository.repository_type":"Global"
    }
    this.apiService.getChapterImprotQuestionFilter(obj).subscribe(
      (response:any)=>{
        if(response && response.body && response.body.data && response.body.data.length){
          this.chapters = response.body.data;
          this.cdr.detectChanges();
        }
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.chapterFlag=true;
    this.loaderService.hide();
  }

  getBoardIdAndSyllabusId(value) {
    this.loaderService.show();
    this.chapterFlag = false;
    this.subjectFlag = false;
    if (value) {
      // this.selectedClassId = value;
      this.subjects = [];
      this.importObject.selectedSubjectId='';
      this.importObject.selectedChapters='';
      // this.selectedBoardId = '';
      // this.selectedSyllabusId = '';
    }
    this.createApiServices.getBoardByClassId(this.importObject.selectedClassId).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.importObject.selectedBoardId = response.body.data[0]._id
          // if (flag) {
          //   this.filterSelectedQuestions[i].mapBoard = response.body.data[0]._id
          // }

          this.createApiServices.getSyllabusByClassId(this.importObject.selectedClassId,  this.importObject.selectedBoardId).subscribe(
            (response: any) => {
              if (response && response.body && response.body.data && response.body.data.length) {
                this.importObject.selectedSyllabusId = response.body.data[0]._id;
                // if (flag) {
                //   this.filterSelectedQuestions[i].mapSyllabus = response.body.data[0]._id;
                // }
                // this.selectedSyllabusName = response.body.data[0].name
                this.createApiServices.getSubjectsByClassId(this.importObject.selectedClassId, this.importObject.selectedBoardId,  this.importObject.selectedSyllabusId).subscribe(
                  (response: any) => {
                    if (response && response.body && response.body.data && response.body.data.length) {
                      this.subjects = response.body.data;
                      // this.getChapterAndSetSubject(this.importObject.selectedSubjectId = this.subjects[0]._id);
                    }
                  },
                  error => {
                    this.loaderService.hide();
                  }
                )
              }
            },
            error => {
              this.loaderService.hide();
            }
          )
        }
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.subjectFlag = true;
    this.cdr.detectChanges();
    this.loaderService.hide();
  }

  getChapterAndSetSubject(value?) {
    this.loaderService.show();
    this.chapters = [];
    if (value) {
      this.importObject.selectedSubjectId = value;
      this.importObject.selectedChapters='';
    }
    this.chapterFlag = false;
    // this.topicFlag = false;
    // this.learningOutcomeFlag = false;
    let obj = {
      "repository": {
        "id": this.schoolId ? this.schoolId : this.globalId
      },
      "class_id":  this.importObject.selectedClassId,
      "board_id":  this.importObject.selectedBoardId,
      "subject_id":  this.importObject.selectedSubjectId,
      "syllabus_id":  this.importObject.selectedSyllabusId
    }

    // "class_id": flag ? this.filterSelectedQuestions[i].mapClass : this.importObject.selectedClassId,
    // "board_id": flag ? this.filterSelectedQuestions[i].mapBoard : this.importObject.selectedBoardId,
    // "subject_id": flag ? this.filterSelectedQuestions[i].mapSubject : this.importObject.selectedSubjectId,
    // "syllabus_id": flag ? this.filterSelectedQuestions[i].mapSyllabus : this.importObject.selectedSyllabusId

    this.apiService.getChapterImprotQuestionFilter(obj).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.chapters = response.body.data;
          this.cdr.detectChanges();
        }
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.chapterFlag = true;
    this.cdr.detectChanges();
    this.loaderService.hide();
  }


  importMediaChapter(){
    this.activeModal.close( this.chapterMedia.filter(x=>x.isChecked===true));
  }

  fetchMedia(){
    this.chapterMedia=[]
    this.validationFlag=true;
    let validationCheckFlag:boolean=false
    if(!this.importObject.selectedClassId || !this.importObject.selectedSubjectId){
      validationCheckFlag=true;
      return true;
    }
    let obj={
      "repository.repository_type":this.schoolId?"Global":"School"
    }
    obj['class_id']=this.importObject.selectedClassId
    obj['subject_id']=this.importObject.selectedSubjectId
    if(this.importObject.selectedChapters){
      obj['_id']=this.importObject.selectedChapters;
    }

    if(!validationCheckFlag){
      this.apiService.importMediaChapter(obj).subscribe(
        (response:any)=>{
          if(response && response.body && response.body.data && response.body.data.length){
            this.chapterMedia=response.body.data;
            this.chapterMedia.map(v=>({...v,isChecked:false}));
            this.previewMediaFlag=true;
            this.cdr.detectChanges();
          }else{
            Swal.fire({ icon: 'error', title: 'Not Found', text: 'No media found for above filter' });
          }
        }
      )
    }
  }

  checkedMediaList(row,event,i,j){
    row.isChecked = event.currentTarget.checked ? true : false;
      this.chapterMedia.filter(x => {
        if (x._id === row._id) {
          x.isChecked = event.currentTarget.checked ? true : false;
        }
      })
  }

}

export class ImportMediaClass {

  selectedClassId: any;
  selectedBoardId: any;
  selectedSyllabusId: any;
  selectedSubjectId: any;
  selectedLanguage: any;
  selectedExamTypeId: any[];
  selectedStudentType: any[];
  selectedDifficultyLevel: any;
  selectedChapters: any;
  selectedTopics: any;
  selectedLearningOutcomes: any;
  selectedQuestionCategory: any;
}
