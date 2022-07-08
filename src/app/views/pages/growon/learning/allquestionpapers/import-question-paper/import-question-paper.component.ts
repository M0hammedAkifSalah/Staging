import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { LoadingService } from "src/app/views/pages/loader/loading/loading.service";
import { CreateservicesService } from "../../../create/services/createservices.service";
import { LearningService } from "../../services/learning.service";



@Component({
  selector: "kt-import-question-paper",
  templateUrl: "./import-question-paper.component.html",
  styleUrls: ["./import-question-paper.component.scss"],
})
export class ImportQuestionPaperComponent implements OnInit {
  // questionPaperFilterFlag:boolean=true;
  public qpestionPaperPreviewFlag: boolean = true;
  public schoolId: any;
  public globalId: any;
  public importQPaperObject: ImportQuestionPaperModal;
  public questionPaperList:any=[];
  public actualQuestionPaperList:any=[];

  public examTypes: any[] = [];

  public languages: any[] = ["English", "Hindi", "Urdu", "Kannada"];
  public studentTypeArray: any[] = [
    { name: "Special Needs", value: "specialNeeds" },
    { name: "General", value: "general" },
    { name: "Gifted", value: "gifted" },
  ];
  public difficultyLevelArray: Array<object> = [
    { name: "Very Easy", value: "veryEasy" },
    { name: "Easy", value: "easy" },
    { name: "Intermediate", value: "intermediate" },
    { name: "Hard", value: "hard" },
    { name: "Very Hard", value: "veryHard" },
  ];
  public filterSelectedQuestions: Array<any> = []
  public boardList: Array<any> = [];
  public classList: Array<any> = [];
  public syllabusList: Array<any> = [];
  public subjectList: Array<any> = [];

  public searchQP: string = '';

  constructor(
    private apiService: LearningService,
    private cdr: ChangeDetectorRef,
    private loaderService: LoadingService,
    private createApiServices: CreateservicesService,
  ) {
    this.importQPaperObject = new ImportQuestionPaperModal();
  }

  ngOnInit(): void {
    let userInfo = localStorage.getItem("info");
    let user = JSON.parse(userInfo);

    if (user.user_info[0].school_id) {
      this.schoolId = user.user_info[0].school_id;
      this.getallinstitutes();
    } else {
      this.globalId = user.user_info[0]._id;
      this.getBoards();
      this.getClasses();
      this.getSyllabus();
      this.getSubjects();
    }
    this.getExamType();
  }

  getBoards() {
    this.apiService.getBoards().subscribe((response: any) => {
      this.boardList = response.body.data;
    });
  }
  getClasses() {
    this.apiService.getGlobalClasses().subscribe((response: any) => {
      this.classList = response.body.data;
      this.cdr.detectChanges();
    });
  }

  getSyllabus() {
    this.apiService.getGlobalSyllabuses().subscribe((response: any) => {
      this.syllabusList = response.body.data;
    });
  }

  getSubjects() {
    this.loaderService.show();
    this.apiService.getGlobalSubjects().subscribe(
      (response: any) => {
        this.subjectList = response.body.data;
        this.loaderService.hide();
      },
      (error) => {
        this.loaderService.hide();
      }
    );
  }

  getExamType() {
    this.apiService.getExamType().subscribe((response: any) => {
      this.examTypes = response.body.data;
    });
  }

  getallinstitutes() {
    this.loaderService.show();
    let userInfo = localStorage.getItem("info");
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
    }
    this.apiService.getallinstitute(id).subscribe((data: any) => {
      if (data && data.body && data.body.data[0]) {
        this.classList = data.body.data[0].classList;
        this.loaderService.hide();
      }
      this.loaderService.hide();
    },error=>{
      this.loaderService.hide();
    });
  }

  getBoardIdAndSyllabusId(value, i?, flag?) {
    this.loaderService.show();
    if (value) {
      this.subjectList = [];
      this.importQPaperObject.selectedBoardName = "";
      this.importQPaperObject.selectedSyllabusName = "";
      this.importQPaperObject.selectedSubjectId='';
    }
    this.createApiServices
      .getBoardByClassId(flag ? value : this.importQPaperObject.selectedClassId)
      .subscribe(
        (response: any) => {
          if (
            response &&
            response.body &&
            response.body.data &&
            response.body.data.length
          ) {
            this.importQPaperObject.selectedBoardId = response.body.data[0]._id;
            if (flag) {
              this.filterSelectedQuestions[i].mapBoard =
                response.body.data[0]._id;
            }
            this.importQPaperObject.selectedBoardName = response.body.data[0].name;
            this.createApiServices
              .getSyllabusByClassId(
                this.importQPaperObject.selectedClassId,
                this.importQPaperObject.selectedBoardId
              )
              .subscribe(
                (response: any) => {
                  if (
                    response &&
                    response.body &&
                    response.body.data &&
                    response.body.data.length
                  ) {
                    this.importQPaperObject.selectedSyllabusId =
                      response.body.data[0]._id;
                    if (flag) {
                      this.filterSelectedQuestions[i].mapSyllabus =
                        response.body.data[0]._id;
                    }
                    this.importQPaperObject.selectedSyllabusName = response.body.data[0].name;
                    this.createApiServices
                      .getSubjectsByClassId(
                        flag ? value : this.importQPaperObject.selectedClassId,
                        flag
                          ? this.filterSelectedQuestions[i].mapBoard
                          : this.importQPaperObject.selectedBoardId,
                        flag
                          ? this.filterSelectedQuestions[i].mapSyllabus
                          : this.importQPaperObject.selectedSyllabusId
                      )
                      .subscribe(
                        (response: any) => {
                          if (
                            response &&
                            response.body &&
                            response.body.data &&
                            response.body.data.length
                          ) {
                            this.subjectList = response.body.data;
                          }
                        },
                        (error) => {
                          this.loaderService.hide();
                        }
                      );
                  }
                },
                (error) => {
                  this.loaderService.hide();
                }
              );
          }
        },
        (error) => {
          this.loaderService.hide();
        }
      );
    this.cdr.detectChanges();
    this.loaderService.hide();
  }

  getQuestionPapers(){
    let isAllEmpty:boolean=false;
    if(this.importQPaperObject.selectedClassId){
      let obj={};
      if(this.importQPaperObject.selectedClassId){
        obj['detail_question_paper.class']=this.importQPaperObject.selectedClassId;
        
      }
      // if(this.importQPaperObject.selectedBoardId){
      //   obj['detail_question_paper.board']=this.importQPaperObject.selectedBoardId
        
      // }
      // if(this.importQPaperObject.selectedSyllabusId){
      //   obj['detail_question_paper.syllabus']=this.importQPaperObject.selectedSyllabusId
        
      // }
      if(this.importQPaperObject.selectedSubjectId){
        obj['detail_question_paper.subject']=this.importQPaperObject.selectedSubjectId
     
      }
      if(this.importQPaperObject.selectedLanguage){
        obj['detail_question_paper.language']=this.importQPaperObject.selectedLanguage
   
      }
      if(this.importQPaperObject.selectedExamTypeId && this.importQPaperObject.selectedExamTypeId.length){
        obj['detail_question_paper.examType']=this.importQPaperObject.selectedExamTypeId
     
      }
      if(this.importQPaperObject.selectedStudentType && this.importQPaperObject.selectedStudentType.length){
        obj['detail_question_paper.studentType']=this.importQPaperObject.selectedStudentType
   
      }
      if(this.importQPaperObject.selectedDifficultyLevel){
        obj['detail_question_paper.difficultyLevel']=this.importQPaperObject.selectedDifficultyLevel
     
      }
      
      console.log(obj)
      this.loaderService.show();
      this.apiService.getQuestionPapersForImport(obj).subscribe(
        (response:any)=>{
          if(response && response.body && response.body.data && response.body.data.length){
            this.questionPaperList=response.body.data;
            this.actualQuestionPaperList=response.body.data;
            console.log("Question Paper List",this.questionPaperList)
          }
          this.qpestionPaperPreviewFlag = true;
          this.loaderService.hide();
        },err=>{
          this.loaderService.hide();
        }
      )
    }
  }

  searchQpIdFilter(){
    this.loaderService.show();
    let filterSearch=[]
    filterSearch=this.questionPaperList.filter(x=>x.question_id===this.searchQP);
    (filterSearch && filterSearch.length)?this.questionPaperList=filterSearch: this.questionPaperList=this.actualQuestionPaperList;
    this.cdr.detectChanges();
    console.log(this.questionPaperList)
    this.loaderService.hide();
  }

}
export class ImportQuestionPaperModal {
  selectedClassId: any;
  selectedBoardId: any;
  selectedBoardName: string;
  selectedSyllabusId: any;
  selectedSyllabusName: string;
  selectedSubjectId: any;
  selectedLanguage: any;
  selectedExamTypeId: any[];
  selectedStudentType: any[];
  selectedDifficultyLevel: any;
  selectedChapters: any[];
  selectedTopics: any[];
  selectedLearningOutcomes: any[];
  selectedQuestionCategory: any[];
}