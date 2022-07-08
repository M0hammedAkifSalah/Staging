import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from 'src/app/views/pages/loader/loading/loading.service';
import Swal from 'sweetalert2';
import { CreateservicesService } from '../../../create/services/createservices.service';
import { LearningService } from '../../services/learning.service';
import { ImportConfirmationComponent } from '../import-confirmation/import-confirmation.component';

@Component({
  selector: 'kt-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss']
})
export class ImportModalComponent implements OnInit {

  boards: any[] = [];
  SchoolBoards: any[] = [];
  classes: any[] = [];
  class: any[] = [];
  syllabuses: any[] = [];
  subjects: any[] = [];
  allChapters: any[] = [];
  chapters: any[] = [];
  allTopics: any[] = [];
  topics: any[] = [];
  allLearningOutcomes: any[] = [];
  learningOutcomes: any[] = [];
  questionCategories: any[] = []
  examTypes: any[] = [];
  questionTypes: Array<object> = [
    { 'name': 'Objectives', 'value': 'objectives' },
    { 'name': 'MCQs', 'value': 'mcq' },
    { 'name': 'Fill In The Blanks', 'value': 'fillInTheBlanks' },
    { 'name': '2 Column Match The Following', 'value': 'twoColMtf' },
    { 'name': '3 Column Match The Following', 'value': 'threeColMtf' },
    { 'name': 'Sequencing Question', 'value': 'sequencingQuestion' },
    // { 'name': 'Sentence Sequencing', 'value': 'sentenceSequencing' },
    { 'name': 'True Or False', 'value': 'trueOrFalse' },
    // { 'name': 'Numerical value Range', 'value': 'NumericalRange' },
    // { 'name': 'Sorting', 'value': 'sorting' },
    { 'name': 'Comprehension', 'value': 'comprehension' },
  ];
  praticTestQuestionArray: any[] = [
    { 'name': 'Practice', 'value': 'practice' },
    { 'name': 'Test', 'value': 'test' }
  ];
  studentTypeArray: any[] = [
    { 'name': 'Special Needs', 'value': 'specialNeeds' },
    { 'name': 'General', 'value': 'general' },
    { 'name': 'Gifted', 'value': 'gifted' }
  ];
  difficultyLevelArray: Array<object> = [
    { 'name': 'Very Easy', 'value': 'veryEasy' },
    { 'name': 'Easy', 'value': 'easy' },
    { 'name': 'Intermediate', 'value': 'intermediate' },
    { 'name': 'Hard', 'value': 'hard' },
    { 'name': 'Very Hard', 'value': 'veryHard' }
  ];
  languages: any[] = ['English', 'Hindi', 'Urdu', 'Kannada'];
  objType: Array<object> = [
    { 'name': 'Text', 'value': 'text' },
    { 'name': 'Image', 'value': 'image' },
    { 'name': 'Audio', 'value': 'audio' },
    // { 'name': 'Video', 'value': 'video' }
  ];
  audioThubmnail: any = '../../../../../../assets/media/growon/questionpaper/audiothumbnail.jpg';
  videoThubmnail: any = '../../../../../../assets/media/growon/questionpaper/videothumbnail.png';
  imageupload: any = '../../../../../../assets/media/growon/questionpaper/image-upload.png';
  images: any[] = [];
  submitted: boolean = false;
  s3BucketUrl: any;
  fibText = '{?}';
  trueOrFalse: any[] = [{ 'name': 'True', 'value': 'true' }, { 'name': 'False', 'value': 'false' }];
  matchSubmitted: boolean = false;
  isLoader: boolean = false;
  groupImages: any[] = [];
  optionImages: any[] = [];
  column1Images: any[] = [];
  column2Images: any[] = [];
  column3Images: any[] = [];
  id: any;
  question: any;
  formLoaded: boolean = false;
  chapterFlag: boolean = false;
  topicFlag: boolean = false;
  selectedBoardId: any;
  selectedSyllabusId: any;
  subjectFlag: boolean = false;
  selectedSubjectId: any;
  selectedClassId: any;
  selectedChapterId: any;
  selectedTopicId: any;
  learningOutcomeFlag: boolean = false;
  selectedBoardName: any;
  selectedSyllabusName: any;
  importObject = new ImportQuestionClass();
  schoolId: any;
  globalId: any;
  questionList: any = []
  selectedQuestionList: any;
  questionCount: any[];
  filterSelectedQuestions: any = []
  filteredQuestion: any[];
  mapQuestions: any[];
  filterQuestionFlag: boolean = true;
  fetchQuestionFlag: boolean = false;
  mappingQuestionFlag: boolean = false;
  importQuestionFlag: boolean = false;
  validationFlag: boolean = false;

  constructor(
    private apiService: LearningService,
    private cdr: ChangeDetectorRef,
    private loaderService: LoadingService,
    private createApiServices: CreateservicesService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);


    if (user.user_info[0].school_id) {
      this.schoolId = user.user_info[0].school_id;

    } else {
      this.globalId = user.user_info[0]._id
    }
    if (this.globalId) {
      this.getClasses();
      this.getBoards();
      this.getSyllabus();
      this.getSubjects();
    }
    this.getExamType();
    this.getQuestionCategories();
    if (this.schoolId) {
      this.getallinstitutes();
    }

  }
  getBoards() {
    this.apiService.getBoards().subscribe((response: any) => {
      this.boards = response.body.data;
    })
  }
  getClasses() {
    this.apiService.getGlobalClasses().subscribe((response: any) => {
      this.classes = response.body.data;
      this.cdr.detectChanges();
      console.log(this.classes)
    });
  }

  getSyllabus() {
    this.apiService.getGlobalSyllabuses().subscribe((response: any) => {
      this.syllabuses = response.body.data;
    })
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

  getExamType() {
    this.apiService.getExamType().subscribe((response: any) => {
      this.examTypes = response.body.data;
    })
  }

  getQuestionCategories() {
    this.apiService.getQuestionCategory().subscribe((response: any) => {
      this.questionCategories = response.body.data;
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
      // this.importObject.selectedClassId = this.class[0].classId;
      // this.getBoardIdAndSyllabusId(this.importObject.selectedClassId);
      this.cdr.detectChanges();

    })

  }
  getBoardIdAndSyllabusId(value, i?, flag?) {
    this.loaderService.show();
    this.chapterFlag = false;
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    this.subjectFlag = false;
    if (value) {
      // this.selectedClassId = value;
      this.subjects = [];
      // this.selectedBoardId = '';
      // this.selectedSyllabusId = '';
      this.selectedBoardName = '';
      this.selectedSyllabusName = '';
      this.importObject.selectedChapters='';
      this.importObject.selectedTopics='';
      this.importObject.selectedLearningOutcomes='';
      this.importObject.selectedSubjectId=''
    }
    this.createApiServices.getBoardByClassId(flag ? value : this.importObject.selectedClassId).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.importObject.selectedBoardId = response.body.data[0]._id
          if (flag) {
            this.filterSelectedQuestions[i].mapBoard = response.body.data[0]._id
          }
          this.selectedBoardName = response.body.data[0].name;
          this.createApiServices.getSyllabusByClassId(flag ? value : this.importObject.selectedClassId, flag ? this.filterSelectedQuestions[i].mapBoard : this.importObject.selectedBoardId).subscribe(
            (response: any) => {
              if (response && response.body && response.body.data && response.body.data.length) {
                this.importObject.selectedSyllabusId = response.body.data[0]._id;
                if (flag) {
                  this.filterSelectedQuestions[i].mapSyllabus = response.body.data[0]._id;
                }
                this.selectedSyllabusName = response.body.data[0].name
                this.createApiServices.getSubjectsByClassId(flag ? value : this.importObject.selectedClassId, flag ? this.filterSelectedQuestions[i].mapBoard : this.importObject.selectedBoardId, flag ? this.filterSelectedQuestions[i].mapSyllabus : this.importObject.selectedSyllabusId).subscribe(
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

  getChapterAndSetSubject(value?, i?, flag?) {
    this.loaderService.show();
    this.chapters = [];
    if (value) {
      this.importObject.selectedChapters='';
      this.importObject.selectedTopics='';
      this.importObject.selectedLearningOutcomes='';
      this.importObject.selectedSubjectId = value;
    }
    this.chapterFlag = false;
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    let obj = {
      "repository": {
        "id": this.schoolId ? this.schoolId : this.globalId
      },
      "class_id": flag ? this.filterSelectedQuestions[i].mapClass : this.importObject.selectedClassId,
      "board_id": flag ? this.filterSelectedQuestions[i].mapBoard : this.importObject.selectedBoardId,
      "subject_id": flag ? this.filterSelectedQuestions[i].mapSubject : this.importObject.selectedSubjectId,
      "syllabus_id": flag ? this.filterSelectedQuestions[i].mapSyllabus : this.importObject.selectedSyllabusId
    }

    this.apiService.getChapterImprotQuestionFilter(obj).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.chapters = response.body.data;
          console.log(this.chapters)
          this.cdr.detectChanges();
        }
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.chapterFlag = true;
    this.loaderService.hide();
  }


  getTopicsAndSetChapter(value?, i?, flag?) {
    this.loaderService.show();
    this.topics = [];
    if (value) {
      this.importObject.selectedTopics='';
      this.importObject.selectedLearningOutcomes='';
      this.importObject.selectedChapters = value;
    }
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    let obj = {
      "repository": {
        "id": this.schoolId ? this.schoolId : this.globalId
      },
      "class_id": flag ? this.filterSelectedQuestions[i].mapClass : this.importObject.selectedClassId,
      "board_id": flag ? this.filterSelectedQuestions[i].mapBoard : this.importObject.selectedBoardId,
      "subject_id": flag ? this.filterSelectedQuestions[i].mapSubject : this.importObject.selectedSubjectId,
      "syllabus_id": flag ? this.filterSelectedQuestions[i].mapSyllabus : this.importObject.selectedSyllabusId,
      "chapter_id": flag ? this.filterSelectedQuestions[i].mapChapter : this.importObject.selectedChapters
    }
    this.apiService.getTopicImprotQuestionFilter(obj).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.topics = response.body.data;
          this.cdr.detectChanges();
        }
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.topicFlag = true;
    this.loaderService.hide();
  }


  getLearnOutcomeAndSetTopic(value?, i?, flag?) {
    this.loaderService.show();
    this.learningOutcomes = [];
    if (value) {
      this.importObject.selectedLearningOutcomes='';
      this.importObject.selectedTopics = value;
    }
    this.learningOutcomeFlag = false;
    let obj = {
      "repository": {
        "id": this.schoolId ? this.schoolId : this.globalId
      },
      "class_id": flag ? this.filterSelectedQuestions[i].mapClass : this.importObject.selectedClassId,
      "board_id": flag ? this.filterSelectedQuestions[i].mapBoard : this.importObject.selectedBoardId,
      "subject_id": flag ? this.filterSelectedQuestions[i].mapSubject : this.importObject.selectedSubjectId,
      "syllabus_id": flag ? this.filterSelectedQuestions[i].mapSyllabus : this.importObject.selectedSyllabusId,
      "chapter_id": flag ? this.filterSelectedQuestions[i].mapChapter : this.importObject.selectedChapters,
      "topic_id": flag ? this.filterSelectedQuestions[i].mapTopic : this.importObject.selectedTopics
    }
    this.loaderService.show();
    this.apiService.getLearningOutcomeImprotQuestionFilter(obj).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.learningOutcomes = response.body.data;
          this.cdr.detectChanges();
        }
      },
      error => {
        this.loaderService.hide();
      }
    )

    this.learningOutcomeFlag = true;
    this.loaderService.hide();
  }

  compareFn(x, y): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  findQuestion() {
    this.loaderService.show();
    let filterObj = {
      school_id:this.schoolId?this.schoolId:this.globalId
    }
    if (this.importObject.selectedClassId) {
      if (this.importObject && this.importObject.selectedClassId) {
        filterObj['class'] = this.importObject.selectedClassId;
      }
      if (this.importObject && this.importObject.selectedBoardId) {
        filterObj['board'] = this.importObject.selectedBoardId;
      }
      if (this.importObject && this.importObject.selectedSyllabusId) {
        filterObj['syllabus'] = this.importObject.selectedSyllabusId;
      }
      if (this.importObject && this.importObject.selectedChapters) {
        filterObj['chapter'] = this.importObject.selectedChapters;
      }
      if (this.importObject && this.importObject.selectedTopics) {
        filterObj['topic'] = this.importObject.selectedTopics;
      }
      if (this.importObject && this.importObject.selectedLearningOutcomes) {
        filterObj['learningOutcome'] = this.importObject.selectedLearningOutcomes;
      }
      if (this.importObject && this.importObject.selectedSubjectId) {
        filterObj['subject'] = this.importObject.selectedSubjectId;
      }
      if (this.importObject && this.importObject.selectedDifficultyLevel) {
        // let difficultyLevelArray = []
        // for (let [key, value] of Object.entries(this.questionPaper.difficultyLevel)) {
        //   if (value > 0) {
        //     difficultyLevelArray.push(key);
        //   }
        // }
        // if (difficultyLevelArray.length) {
        filterObj['difficultyLevel'] = this.importObject.selectedDifficultyLevel;
        // }
      }
      // if (this.questionPaper && this.questionPaper.attemptType) {
      //   let attamptArray = []
      //   for (let [key, value] of Object.entries(this.questionPaper.attemptType)) {
      //     if (value > 0) {
      //       attamptArray.push(key);
      //     }
      //   }
      //   if (attamptArray.length) {
      //     filterObj['practiceAndTestQuestion'] = attamptArray;
      //   }
      // }
      if (this.importObject && this.importObject.selectedStudentType && this.importObject.selectedStudentType.length) {
        filterObj['studentType'] = this.importObject.selectedStudentType;
      }
      // if (this.schoolId) {
      //   filterObj['repository.id'] = this.schoolId;
      // }
      if (this.importObject && this.importObject.selectedLanguage) {
        filterObj['language'] = this.importObject.selectedLanguage;
      }
      if (this.importObject && this.importObject.selectedQuestionCategory) {
        filterObj['questionCategory'] = this.importObject.selectedQuestionCategory;
      }
    }

    this.apiService.questionsBasedOnFilterForImport(filterObj).subscribe(
      (response: any) => {
        this.fetchQuestionFlag = true;
        if (response && response.body && response.body.data && response.body.data.length) {
          this.questionList = response.body.data;
          this.questionList = this.questionList.map(v => ({ ...v, isChecked: false }))
          this.questionList = this.questionList.map(v => ({ ...v, mapClass: '' }))
          this.questionList = this.questionList.map(v => ({ ...v, mapBoard: '' }))
          this.questionList = this.questionList.map(v => ({ ...v, mapSyllabus: '' }))
          this.questionList = this.questionList.map(v => ({ ...v, mapSubject: '' }))
          this.questionList = this.questionList.map(v => ({ ...v, mapChapter: [] }))
          this.questionList = this.questionList.map(v => ({ ...v, mapTopic: [] }))
          this.questionList = this.questionList.map(v => ({ ...v, mapLearning: [] }))
          this.questionList = this.questionList.map(v => ({ ...v, mapStudentType: [] }))
          this.questionList = this.questionList.map(v => ({ ...v, mapQuestionCategory: '' }))
          this.questionList = this.questionList.map(v => ({ ...v, mapExamType: [] }))
          this.questionList = this.questionList.map(v => ({ ...v, mapLanguage: '' }))
          this.questionList = this.questionList.map(v => ({ ...v, mapDifficultyLevel: '' }))
          console.log("questions", this.questionList)
          // this.questionList.forEach(element => {
          //   this.selectedQuestionList.filter(x => {
          //     if (x._id === element._id) {
          //       element.isChecked = x.isChecked;
          //       // element.instruction = x.instruction;
          //       // element.sectionInstruction = x.sectionInstruction;
          //     }
          //   })
          // });
          this.questionCount = [];
          if (response && response.body && response.body.count) {
            for (let [key, value] of Object.entries(response.body.count)) {
              this.questionCount.push({ questionType: key, count: value, selectCount: 0 })
            }
            this.questionCount.forEach(element => {
              switch(element.questionType){
                case 'objectives':
                  element['questionTypeValue']="Objective";
                  break;

                  case 'mcq':
                  element['questionTypeValue']="MCQs";
                  break;

                  case 'fillInTheBlanks':
                  element['questionTypeValue']="Fill In The Blanks";
                  break;

                  case 'twoColMtf':
                  element['questionTypeValue']="2 Column Match The Following";
                  break;

                  case 'threeColMtf':
                  element['questionTypeValue']="3 Column Match The Following";
                  break;

                  case '3colOptionLevelScoring':
                  element['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
                  break;

                  case 'optionLevelScoring':
                  element['questionTypeValue']="Option Level Scoring";
                  break;

                  case 'trueOrFalse':
                  element['questionTypeValue']="True Or False";
                  break;

                  case 'NumericalRange':
                  element['questionTypeValue']="Numerical value Range";
                  break;

                  case 'freeText':
                  element['questionTypeValue']="Free Text";
                  break;

                  case 'comprehension':
                  element['questionTypeValue']="Comprehension";
                  break;
              }
            })

          }
          this.FilterQuestionType('all');
          console.log(this.questionCount)
        }
        this.loaderService.hide();
      }, error =>{
        this.fetchQuestionFlag = true;
        this.loaderService.hide();
      }
    )
    this.cdr.detectChanges();

  }

  FilterQuestionType(value) {
    this.filteredQuestion = [];
    console.log(value);
    if (value === 'all') {
      this.filteredQuestion = this.questionList;
      this.resizeImage(this.filteredQuestion);
    } else {
      this.filteredQuestion = this.questionList.filter((x: any) => x.questionType[0] === value);
      this.resizeImage(this.filteredQuestion);
    }
    this.filteredQuestion.forEach(que => {
      if(que.questionType == 'comprehension'){
        que.questions.forEach(element => {
          switch(element.questionType[0]){
            case 'objectives':
              element['questionTypeValue']="Objective";
              break;

              case 'mcq':
              element['questionTypeValue']="MCQs";
              break;

              case 'fillInTheBlanks':
              element['questionTypeValue']="Fill In The Blanks";
              break;

              case 'twoColMtf':
              element['questionTypeValue']="2 Column Match The Following";
              break;

              case 'threeColMtf':
              element['questionTypeValue']="3 Column Match The Following";
              break;

              case '3colOptionLevelScoring':
              element['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
              break;

              case 'optionLevelScoring':
              element['questionTypeValue']="Option Level Scoring";
              break;

              case 'trueOrFalse':
              element['questionTypeValue']="True Or False";
              break;

              case 'NumericalRange':
              element['questionTypeValue']="Numerical value Range";
              break;

              case 'freeText':
              element['questionTypeValue']="Free Text";
              break;

              case 'comprehension':
              element['questionTypeValue']="Comprehension";
              break;
          }
        });
      }
    })
    console.log(this.filteredQuestion)
  }

  resizeImage(questions: any[]) {
    questions.forEach(que => {
      if (que.optionsType != 'text') {
        que.options.forEach(opt => {
          const aa = opt.value
          if(aa){
          const splitArray = aa.split('/')
          console.log(splitArray)
          const ab = [];
          ab.push("https://d39zpvaaimtclj.cloudfront.net")
          ab.push("/100x100/")
          ab.push(splitArray[splitArray.length - 1])
          opt.value = ab.join("");
          }
        });
        que.answer.forEach(ans => {
          const aa = ans.value
          if(aa){
          const splitArray = aa.split('/')
          console.log(splitArray)
          const ab = [];
          ab.push("https://d39zpvaaimtclj.cloudfront.net")
          ab.push("/100x100/")
          ab.push(splitArray[splitArray.length - 1])
          ans.value = ab.join("");
          }
        });
      }
      console.log(que.options)
    });
  }

  checkedQuestionList(row, event, i) {
    console.log(row);
    console.log(event.currentTarget.checked);
    // event.currentTarget.checked ? this.selectedQuestionList.push(row) : this.selectedQuestionList = this.selectedQuestionList.filter((x: any) => x._id !== row._id);
    row.isChecked = event.currentTarget.checked ? true : false;
    this.questionList.filter(x => {
      if (x._id === row._id) {
        x.isChecked = event.currentTarget.checked ? true : false;
      }
    })
    console.log(row)
    console.log("selected question List")
    this.cdr.detectChanges();
    // console.log(this.selectedQuestionList)
  }

  selectedQuestionToImport() {
    this.selectedQuestionList = this.questionList.filter(x => x.isChecked === true);
    this.questionCount.forEach(element => {
      element.selectCount = 0;
    });
    this.selectedQuestionList.forEach(element => {
      this.questionCount.filter(x => {
        if (x.questionType === element.questionType[0]) {
          x.selectCount++;
        }
      })
    });
    this.questionCount.forEach(element => {
      switch(element.questionType){
        case 'objectives':
          element['questionTypeValue']="Objective";
          break;

          case 'mcq':
          element['questionTypeValue']="MCQs";
          break;

          case 'fillInTheBlanks':
          element['questionTypeValue']="Fill In The Blanks";
          break;

          case 'twoColMtf':
          element['questionTypeValue']="2 Column Match The Following";
          break;

          case 'threeColMtf':
          element['questionTypeValue']="3 Column Match The Following";
          break;

          case '3colOptionLevelScoring':
          element['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
          break;

          case 'optionLevelScoring':
          element['questionTypeValue']="Option Level Scoring";
          break;

          case 'trueOrFalse':
          element['questionTypeValue']="True Or False";
          break;

          case 'NumericalRange':
          element['questionTypeValue']="Numerical value Range";
          break;

          case 'freeText':
          element['questionTypeValue']="Free Text";
          break;

          case 'comprehension':
          element['questionTypeValue']="Comprehension";
          break;
      }
    })
    if (this.schoolId) {
      this.getallinstitutes();
    } else {
      this.getClasses();
      this.getSubjects();
    }
    this.cdr.detectChanges();
    console.log(this.selectedQuestionList);
    console.log(this.questionCount)
    this.filterQuestionFlag = false;
    this.fetchQuestionFlag = false;
    this.mappingQuestionFlag = true;
    //Added to Enable Multiple Question Import At Once
    this.getSelectedQuestion();
  }

  getSelectedQuestion(type?, i?) {
    console.log(this.selectedQuestionList);
    // this.filterSelectedQuestions = this.selectedQuestionList.filter((x: any) => x.questionType[0] === type);
    this.filterSelectedQuestions = this.selectedQuestionList;
    console.log(this.filterSelectedQuestions)
    let element = document.getElementById(i)
    let spann=document.getElementById('s'+i)
    // element.classList.add('btn-count-selected')
    // spann.classList.add('btn-count-text-selected')
    // element.classList.add('');
  }

  backToSelectQuestion() {
    this.filterQuestionFlag = true;
    this.fetchQuestionFlag = true;
    this.mappingQuestionFlag = false;
  }

  confirmToImport() {
    this.validationFlag = true;
    console.log(this.filterSelectedQuestions)
    let nullFlag: boolean = false
    this.filterSelectedQuestions.forEach(element => {
      if (!element.mapClass || !element.mapSubject  || !element.mapChapter.length) {
        nullFlag = true;
        return true;
      }
    });
    if (!nullFlag) {
      const modalRef = this.modalService.open(ImportConfirmationComponent, { size: 'xl' });
      modalRef.componentInstance.questionCount = this.questionCount;
      modalRef.result.then(result => {
        this.loaderService.show();
        if (result === "back") {
          this.filterQuestionFlag = false;
          this.fetchQuestionFlag = false;
          this.mappingQuestionFlag = true;
          this.loaderService.hide();
        } else if (result === "confirm") {
          console.log(this.filterSelectedQuestions)
          this.filterSelectedQuestions.forEach(element => {
            console.log(element)
            console.log(element.question)
            const createQuestion = {
              "board": element.mapBoard,
              "syllabus": element.mapSyllabus,
              "examType": (element.mapExamType && element.mapExamType.length) ? element.mapExamType : '',
              "questionType": element.questionType,
              "practiceAndTestQuestion": element.practiceAndTestQuestion,
              "studentType": element.mapStudentType,
              "question": element.question[0],
              "options": this.questionList.filter(x => x._id === element._id).map(x => x.options)[0],
              "answer": this.questionList.filter(x => x._id === element._id).map(x => x.answer)[0],
              "totalMarks": element.totalMarks,
              "negativeMarks": element.negativeMarks,
              "repository": [
                {
                  "id": this.schoolId,
                  "repository_type": "School"
                }
              ],
              "globalId":element._id,
              "attempt_count": element.attempt_count,
              "wrong_count": element.wrong_count,
              "createdAt": element.createdAt ? element.createdAt : '',
              "updatedAt": element.updatedAt ? element.updatedAt : '',
              "class": element.mapClass ? element.mapClass : '',
              "subject": element.mapSubject ? element.mapSubject : '',
              "chapter": (element.mapChapter && element.mapChapter.length) ? element.mapChapter : '',
              "topic": (element.mapTopic && element.mapTopic.length) ? [element.mapTopic] : [],
              "language": element.mapLanguage ? element.mapLanguage : '',
              "learningOutcome": (element.mapLearning && element.mapLearning.length) ? element.mapLearning : [],
              "questionCategory": element.questionCategory ? element.questionCategory : [],
              "difficultyLevel": element.difficultyLevel ? element.difficultyLevel : '',
              "questionTitle": element.questionTitle ? element.questionTitle : '',
              "optionsType": element.optionsType ? element.optionsType : '',
              "matchOptions": element.matchOptions,
              "questions":element.questions,
              "negativeScore": element.negativeScore ? element.negativeScore : '',
              "duration": element.duration ? element.duration : '',
              "createdBy": element.createdBy ? element.createdBy : '',
              "question_count": element.question_count ? element.question_count : '',
              "updatedBy": null
            }
            console.log(createQuestion)

            this.apiService.addQuestion(createQuestion).subscribe((response: any) => {
              if (response.status == 201) {
                Swal.fire('Added', 'Question Added', 'success').then(function () {
                });
                this.filterQuestionFlag = true;
                this.mappingQuestionFlag = false;
                this.loaderService.hide();
                this.cdr.detectChanges();
              } else {
                Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
                this.loaderService.hide();
                return;
              }
            }, (error) => {
              if (error.status == 400) {
                console.log('error => ', error)
                Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
                this.loaderService.hide();
              } else {
                Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
                this.loaderService.hide();
              }
            })



          });


        }
      })
    }
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
  selectedLearningOutcomes: any;
  selectedQuestionCategory: any[];
}
