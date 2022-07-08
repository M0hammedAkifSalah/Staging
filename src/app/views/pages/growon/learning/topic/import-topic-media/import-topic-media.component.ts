import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from 'src/app/views/pages/loader/loading/loading.service';
import Swal from 'sweetalert2';
import { CreateservicesService } from '../../../create/services/createservices.service';
import { LearningService } from '../../services/learning.service';

@Component({
  selector: 'kt-import-topic-media',
  templateUrl: './import-topic-media.component.html',
  styleUrls: ['./import-topic-media.component.scss']
})
export class ImportTopicMediaComponent implements OnInit {

  schoolId:any;
  globalId:any;
  class:any=[];
  importObject = new ImportQuestionClass();
  subjectFlag: boolean;
  chapterFlag: boolean=false;
  subjects: any=[];
  chapters: any=[];
  classes: any=[];
  topics: any=[];
  topicFlag: boolean;
  validationFlag: boolean=false;
  topicMedia:any=[];

  constructor(private activeModal:NgbActiveModal,
    private apiService:LearningService, private cdr:ChangeDetectorRef,
    private loaderService:LoadingService,private createApiServices:CreateservicesService) { }

  ngOnInit(): void {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);

    this.getClasses();
      this.getSubjects();
    if (user.user_info[0].school_id) {
      this.schoolId = user.user_info[0].school_id;
      // this.getallinstitutes();
    } else {
      this.globalId = user.user_info[0]._id;
      // this.getClasses();
      // this.getSubjects();
    }
  
  }

  getClasses() {
    this.apiService.getGlobalClasses().subscribe((response: any) => {
      this.classes = response.body.data;
      this.cdr.detectChanges();
      console.log(this.classes)
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
      this.class = data.body.data[0].classList;
      console.log(this.class)
      this.cdr.detectChanges();

    })

  }
  getGlobalChapters(value?){
    this.loaderService.show();
    this.importObject.selectedChapters='';
    let obj ={
      "class_id": this.importObject.selectedClassId,
      "subject_id": this.importObject.selectedSubjectId
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

  // getBoardIdAndSyllabusId(value) {
  //   this.loaderService.show();
  //   this.chapterFlag = false;
  //   this.subjectFlag = false;
  //   this.topicFlag=false;
  //   if (value) {
  //     // this.selectedClassId = value;
  //     this.subjects = [];
  //     this.importObject.selectedSubjectId='';
  //     this.importObject.selectedChapters='';
  //     this.importObject.selectedTopics='';
  //     // this.selectedBoardId = '';
  //     // this.selectedSyllabusId = '';
  //   }
  //   this.createApiServices.getBoardByClassId(this.importObject.selectedClassId).subscribe(
  //     (response: any) => {
  //       if (response && response.body && response.body.data && response.body.data.length) {
  //         this.importObject.selectedBoardId = response.body.data[0]._id
  //         // if (flag) {
  //         //   this.filterSelectedQuestions[i].mapBoard = response.body.data[0]._id
  //         // }
          
  //         this.createApiServices.getSyllabusByClassId(this.importObject.selectedClassId,  this.importObject.selectedBoardId).subscribe(
  //           (response: any) => {
  //             if (response && response.body && response.body.data && response.body.data.length) {
  //               this.importObject.selectedSyllabusId = response.body.data[0]._id;
  //               // if (flag) {
  //               //   this.filterSelectedQuestions[i].mapSyllabus = response.body.data[0]._id;
  //               // }
  //               // this.selectedSyllabusName = response.body.data[0].name
  //               this.createApiServices.getSubjectsByClassId(this.importObject.selectedClassId, this.importObject.selectedBoardId,  this.importObject.selectedSyllabusId).subscribe(
  //                 (response: any) => {
  //                   if (response && response.body && response.body.data && response.body.data.length) {
  //                     this.subjects = response.body.data;
  //                     // this.getChapterAndSetSubject(this.importObject.selectedSubjectId = this.subjects[0]._id);
  //                   }
  //                 },
  //                 error => {
  //                   this.loaderService.hide();
  //                 }
  //               )
  //             }
  //           },
  //           error => {
  //             this.loaderService.hide();
  //           }
  //         )
  //       }
  //     },
  //     error => {
  //       this.loaderService.hide();
  //     }
  //   )
  //   this.subjectFlag = true;
  //   this.cdr.detectChanges();
  //   this.loaderService.hide();
  // }

  // getChapterAndSetSubject(value?) {
  //   this.loaderService.show();
  //   this.chapters = [];
  //   if (value) {
  //     this.importObject.selectedSubjectId = value;
  //     this.importObject.selectedChapters='';
  //     this.importObject.selectedTopics='';
  //   }
  //   this.chapterFlag = false;
  //   this.topicFlag = false;
  //   // this.learningOutcomeFlag = false;
  //   let obj = {
  //     "repository": {
  //       "id": this.schoolId ? this.schoolId : this.globalId
  //     },
  //     "class_id":  this.importObject.selectedClassId,
  //     "board_id":  this.importObject.selectedBoardId,
  //     "subject_id":  this.importObject.selectedSubjectId,
  //     "syllabus_id":  this.importObject.selectedSyllabusId
  //   }

  //   // "class_id": flag ? this.filterSelectedQuestions[i].mapClass : this.importObject.selectedClassId,
  //   // "board_id": flag ? this.filterSelectedQuestions[i].mapBoard : this.importObject.selectedBoardId,
  //   // "subject_id": flag ? this.filterSelectedQuestions[i].mapSubject : this.importObject.selectedSubjectId,
  //   // "syllabus_id": flag ? this.filterSelectedQuestions[i].mapSyllabus : this.importObject.selectedSyllabusId

  //   this.apiService.getChapterImprotQuestionFilter(obj).subscribe(
  //     (response: any) => {
  //       if (response && response.body && response.body.data && response.body.data.length) {
  //         this.chapters = response.body.data;
  //         this.cdr.detectChanges();
  //       }
  //     },
  //     error => {
  //       this.loaderService.hide();
  //     }
  //   )
  //   this.chapterFlag = true;
  //   this.loaderService.hide();
  // }

  // getTopicsAndSetChapter(value?, i?, flag?) {
  //   this.loaderService.show();
  //   this.topics = [];
  //   if (value) {
  //     this.importObject.selectedChapters = value;
  //     this.importObject.selectedTopics='';
  //   }
  //   this.topicFlag = false;
  //   let obj = {
  //     "repository": {
  //       "id": this.schoolId ? this.schoolId : this.globalId
  //     },
  //     "class_id":  this.importObject.selectedClassId,
  //     "board_id":  this.importObject.selectedBoardId,
  //     "subject_id":  this.importObject.selectedSubjectId,
  //     "syllabus_id":  this.importObject.selectedSyllabusId,
  //     "chapter_id":  this.importObject.selectedChapters
  //   }
  //   this.apiService.getTopicImprotQuestionFilter(obj).subscribe(
  //     (response: any) => {
  //       if (response && response.body && response.body.data && response.body.data.length) {
  //         this.topics = response.body.data;
  //         this.cdr.detectChanges();
  //       }
  //     },
  //     error => {
  //       this.loaderService.hide();
  //     }
  //   )
  //   this.topicFlag = true;
  //   this.loaderService.hide();
  // }
  
  getTopicGlobally(){
    this.loaderService.show();
    this.topicFlag=false;
    this.importObject.selectedTopics='';
    let obj={
      "class_id": this.importObject.selectedClassId,
      "subject_id": this.importObject.selectedSubjectId,
      "chapter_id":  this.importObject.selectedChapters
    }
    this.apiService.getTopicImprotQuestionFilter(obj).subscribe(
      (response:any)=>{
        if(response && response.body && response.body.data && response.body.data.length){
          this.topics = response.body.data;
          this.cdr.detectChanges();
        }
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.topicFlag=true;
    this.cdr.detectChanges();
    this.loaderService.hide();
  }


  importMediaChapter(){
    this.activeModal.close();
  }

  fetchMedia(){
    this.topicMedia=[];
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
      obj['chapter_id']=this.importObject.selectedChapters;
    }
    if(this.importObject.selectedTopics){
      obj['_id']=this.importObject.selectedTopics
    }

    if(!validationCheckFlag){
      this.apiService.importMediaTopic(obj).subscribe(
        (response:any)=>{
          if(response && response.body && response.body.data && response.body.data.length){
            this.topicMedia=response.body.data;
            this.topicMedia.map(v=>({...v,isChecked:false}));
            console.log(this.topicMedia)
            // this.previewMediaFlag=true;
            this.cdr.detectChanges();
          }
          else{
            Swal.fire({ icon: 'error', title: 'Not Found', text: 'No media found for above filter' });
          }
        }
      )
    }
  }

  checkedMediaList(row,event,i,j){
    console.log(event.currentTarget.checked);
    row.isChecked = event.currentTarget.checked ? true : false;
      this.topicMedia.filter(x => {
        if (x._id === row._id) {
          x.isChecked = event.currentTarget.checked ? true : false;
        }
      })
  }

  importMediaTopic(){
    this.activeModal.close( this.topicMedia.filter(x=>x.isChecked===true));
  }

}

export class ImportQuestionClass {

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
  selectedLearningOutcomes: any[];
  selectedQuestionCategory: any[];
}

