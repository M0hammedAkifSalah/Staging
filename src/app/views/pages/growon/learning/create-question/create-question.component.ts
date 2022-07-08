import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import Swal from "sweetalert2";
import tinymce from "tinymce";
import { environment } from "../../../../../../environments/environment";
import { LoadingService } from "../../../loader/loading/loading.service";
import { CreateservicesService } from "../../create/services/createservices.service";
import {
  ComprehensionArrayModel,
  OptionsModel,
  MatchOptionsModel,
} from "../../model/comprehension.model";
import { AnswerExplainComponent } from "../answer-explain/answer-explain.component";
import { ChapterComponent } from "../chapter/chapter.component";
import { LearningOutcomeComponent } from "../learning-outcome/learning-outcome.component";
import { LearningService } from "../services/learning.service";
import { TopicComponent } from "../topic/topic.component";
import * as data from './Enable-Disable/Enable-Disable.json';
import { WirisPlugin } from '@wiris/mathtype-generic';
import { filter } from 'rxjs/operators'
import { async } from "@angular/core/testing";

@Component({
  selector: "kt-create-question",
  templateUrl: "./create-question.component.html",
  styleUrls: ["./create-question.component.scss"],
})
export class CreateQuestionComponent implements OnInit, OnDestroy {

  ED: any = (data as any).default;
  isOwner: boolean;
  questionaryForm: FormGroup;
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
  questionCategories: any[] = [];
  examTypes: any[] = [];
  dropdownSettings: any = {};
  Totalmarks: any;
  questionTypes: Array<object> = [

    this.ED[0].Objectives ? { 'name': 'Objectives', 'value': 'objectives' } : {},
    this.ED[1].MCQs ? { 'name': 'MCQs', 'value': 'mcq' } : {},
    this.ED[2].Fill_in_The_Blanks ? { 'name': 'Fill In The Blanks', 'value': 'fillInTheBlanks' } : {},
    this.ED[3].Two_Column_Match_The_Following ? { 'name': '2 Column Match The Following', 'value': 'twoColMtf' } : {},
    this.ED[4].Three_Column_Match_The_Following ? { 'name': '3 Column Match The Following', 'value': 'threeColMtf' } : {},
    this.ED[5].Option_Level_Scoring_three_Column_Match_The_Following ? { 'name': 'Option Level Scoring - 3 Column Match The Following', 'value': '3colOptionLevelScoring' } : {},
    // { 'name': 'Sequencing Question', 'value': 'sequencingQuestion' },
    this.ED[6].Option_Level_Scoring ? { 'name': 'Option Level Scoring', 'value': 'optionLevelScoring' } : {},
    // { 'name': 'Sentence Sequencing', 'value': 'sentenceSequencing' },{},
    this.ED[7].True_Or_False ? { 'name': 'True Or False', 'value': 'trueOrFalse' } : {},
    this.ED[8].Numerical_value_Range ? { 'name': 'Numerical value Range', 'value': 'NumericalRange' } : {},
    // { 'name': 'Sorting', 'value': 'sorting' },{},
    this.ED[9].Free_Text ? { 'name': 'Free Text', 'value': 'freeText' } : {},
    this.ED[10].Comprehensive ? { 'name': 'Comprehension', 'value': 'comprehension' } : {},
  ];
  praticTestQuestionArray: any[] = [
    { name: "Practice", value: "practice" },
    { name: "Test", value: "test" },
  ];
  studentTypeArray: any[] = [
    { name: "Special Needs", value: "specialNeeds" },
    { name: "General", value: "general" },
    { name: "Gifted", value: "gifted" },
  ];
  difficultyLevelArray: Array<object> = [
    { name: "Very Easy", value: "veryEasy", checked: "false" },
    { name: "Easy", value: "easy", checked: "false" },
    { name: "Intermediate", value: "intermediate", checked: "true" },
    { name: "Hard", value: "hard", checked: "false" },
    { name: "Very Hard", value: "veryHard", checked: "false" },
  ];
  languages: any[] = ["English", "Hindi", "Urdu", "Kannada"];
  objType: Array<object> = [
    { name: "Text", value: "text" },
    { name: "Image", value: "image" },
    { name: "Audio", value: "audio" },
    // { 'name': 'Video', 'value': 'video' }
  ];
  audioThubmnail: any =
    "../../../../../../assets/media/growon/questionpaper/audiothumbnail.jpg";
  videoThubmnail: any =
    "../../../../../../assets/media/growon/questionpaper/videothumbnail.png";
  imageupload: any =
    "../../../../../../assets/media/growon/questionpaper/image-upload.png";
  images: any[] = [];
  submitted: boolean = false;
  s3BucketUrl: any;
  fibText = "{?}";
  trueOrFalse: any[] = [
    { name: "True", value: "true" },
    { name: "False", value: "false" },
  ];
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
  updateFlag: boolean = false;
  globalId: any;
  pipeRefreshCount: number = 0;
  comprehensionValidatePipeInterval;
  addOptionTextEditor: string;

  tinymceConfig: any;
  subscription:any;
  comprehensionQuestionArray: ComprehensionArrayModel[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private apiService: LearningService,
    private cdr: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private loaderService: LoadingService,
    private createApiServices: CreateservicesService,
    private router: Router,
    private _elementRef: ElementRef
  ) {
    this.subscription = router.events.subscribe(async(event) => {
      if (event instanceof NavigationStart) {
        const browserRefresh = !router.navigated;
        await setTimeout(()=>{
          console.log('Alert')
        },4000)
      }
    });
    /* let svg;
    svg = this._elementRef.nativeElement.querySelector('#tinymce > p');
    console.log(svg)
    this.s3BucketUrl = environment.s3BucketUrl; */


    //tinymce.PluginManager.load('formular', '../../../../../../../node_modules/tinymce-formula/plugin.min.js');
    // var that = this;
    // this.tinymceConfig = {
    //   plugins: 'image code',
    //   content_css: '/app/assets/tinymce-content.min.css',
    //   image_title: true,
    //   entity_encoding: "raw",
    //   skin: false,
    //   automatic_uploads: true,
    //   file_picker_types: 'image',
    //   file_picker_callback: function (cb, value, meta) {
    //     var input = document.createElement('input');
    //     input.setAttribute('type', 'file');
    //     input.setAttribute('accept', 'image/*');

    //     input.onchange = function () {
    //       var file = input.files[0];

    //       const formData = new FormData();
    //           formData.append("file", file);
    //           that.apiService
    //             .uploadFile(formData)
    //             .subscribe((response: any) => {

    //             });

    //       // var reader = new FileReader();
    //       // reader.onload = function () {
    //       //   // var id = "blobid" + new Date().getTime();
    //       //   // var blobCache = tinymce.activeEditor.editorUpload.blobCache;
    //       //   // var base64 = reader.result.toString().split(',')[1];
    //       //   // var blobInfo = blobCache.create(id, file, base64);
    //       //   // blobCache.add(blobInfo);

    //       //   // /* call the callback and populate the Title field with the file name */
    //       //   // cb(blobInfo.blobUri(), { title: file.name });

    //       // };
    //       // reader.readAsDataURL(file);
    //     };

    //     input.click();
    //   },
    //   content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    // }

  }

  ngOnDestroy(): void {
    clearInterval(this.comprehensionValidatePipeInterval);
  }

  

  async ngOnInit() {
    
   /*  window.addEventListener("beforeunload", async function (e) {
      var confirmationMessage = "\o/";
      console.log("cond");
      
      await setTimeout(()=>{
       
        return confirmationMessage; 
      },4000)  // Gecko, Trident, Chrome 34+
     
     
                 // Gecko, WebKit, Chrome <34
  }); */

    this.loaderService.show();
    await this.getAdmin();
    this.getExamType();
    this.id = this.activatedRoute.snapshot.params.id;
    if (this.id) {
      this.updateFlag = true;
      this.getQuestionWithId();
    } else {
      this.questionaryForm = this.getFormGroup();
      this.formLoaded = true;
    }
    console.log(this.id);
    if (!localStorage.getItem("schoolId")) {
      this.getBoards();
      this.getClasses();
      this.getSyllabus();
      this.getSubjects();
    }

    this.getallinstitutes();
    // this.getAllChapters();
    // this.getAllTopics();
    this.getSchoolBoards();
    // this.getAllLarningOutcomes();
    this.getQuestionCategories();
    // this.dropdownSettings:IDropdownSettings = {
    //   singleSelection: false,
    //   idField: 'item_id',
    //   textField: 'item_text',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };
    this.loaderService.hide();

    this.comprehensionValidatePipeInterval = setInterval(() => {
      if (this.questionFormControl?.questionType.value == "comprehension") {
        this.pipeRefreshCount += 1;
        if (this.pipeRefreshCount > 100) {
          this.pipeRefreshCount = 0;
        }

      }
    }, 1000);
  }

  selectAll(type) {
    switch (type) {
      case "board":
        this.questionFormControl.board.setValue([]);
        this.boards.forEach((element, i) => {
          this.questionFormControl.board.value.push(element._id);
        });
        break;
    }
  }

  unselectAll(type) {
    switch (type) {
      case "board":
        this.questionFormControl.board.setValue([]);
        break;
    }
  }

  getQuestionWithId() {
    this.loaderService.show();
    if (!this.isOwner) {
      this.apiService.getQuestionByIdGlobally(this.id).subscribe(
        (response: any) => {

          this.question = response.body.data[0];
          if (
            this.question.optionsType === "image" ||
            this.question.optionsType === "audio"
          ) {
            this.question.options.forEach((options, i) => {
              this.images[i] = [];
              this.images[i].push(options.value);
            });
          }
          console.log(this.images);
          this.questionaryForm = this.getUpdateFormGroup();
          if (
            this.questionaryForm.value &&
            this.questionaryForm.value.difficultyLevel
          ) {
            this.difficultyLevelArray = this.difficultyLevelArray.filter(
              (m: any) => {
                if (this.questionaryForm.value.difficultyLevel == m.value) {
                  m.checked = true;
                } else {
                  m.checked = false;
                }
                return true;
              }
            );
          }
          this.getChpterAndSetSubjectGlobal("updateCall");
          this.getTopicAndSetChapterGlobal("updateCall");
          this.getLearningAndSetTopicGlobal("updateCall");
          setTimeout(() => {
            this.questionUpdateChange();
            // this.subjectChanged();
            // this.questionFormControl.chapter.setValue(this.question.chapter.map((x)=>x.chapterId))
            // this.chapterChanged();
            // this.questionFormControl.topic.setValue(this.question.topic.map((x)=>x.topicId))
            // this.topicChanged();
            // this.questionFormControl.learningOutcome.setValue(this.question.learningOutcome.map((x)=>x.learningOutcomeId))

            this.formLoaded = true;
            this.cdr.detectChanges();
          }, 0);
          // this.questionTypeUpdate(this.question.questionType[0] || this.question.questionType);

          let studenTypes = this.questionaryForm.controls[
            "studentType"
          ] as FormArray;
          for (
            let index = 0;
            index < this.question.studentType.length;
            index++
          ) {
            studenTypes.push(
              this.formBuilder.control(this.question.studentType[index])
            );
          }
          let practiceAndTestQuestion = this.questionaryForm.controls[
            "practiceAndTestQuestion"
          ] as FormArray;
          for (
            let index = 0;
            index < this.question.practiceAndTestQuestion.length;
            index++
          ) {
            practiceAndTestQuestion.push(
              this.formBuilder.control(
                this.question.practiceAndTestQuestion[index]
              )
            );
          }

          if (
            response.body.data[0].questions &&
            response.body.data[0].questions.length &&
            response.body.data[0].questionType == "comprehension"
          ) {
            this.comprehensionQuestionArray = [
              ...response.body.data[0].questions,
            ];
            for (let ques of this.comprehensionQuestionArray) {
              ques.colAdded = true;
              ques.optionsAdded = true;
              ques.setAns = true;
              ques.question = ques.question ? ques.question[0] : ques.question;
              console.log('ques.question', ques.question)
              ques.questionType = ques.questionType
                ? ques.questionType[0]
                : ques.questionType;
            }
          }
          this.loaderService.hide();
          this.cdr.detectChanges();
        },
        (error) => {
          this.loaderService.hide();
        }
      );
    } else {
      this.apiService.getQuestionWithId(this.id).subscribe(
        (response: any) => {
          this.question = response.body.data;
          if (
            response.body.data.questions &&
            response.body.data.questions.length &&
            response.body.data.questionType == "comprehension"
          ) {
            this.comprehensionQuestionArray = [
              ...response.body.data.questions,
            ];
            for (let ques of this.comprehensionQuestionArray) {
              ques.colAdded = true;
              ques.optionsAdded = true;
              ques.setAns = true;
              ques.question = ques.question ? ques.question[0] : ques.question;
              console.log('ques.question', ques.question)
              ques.questionType = ques.questionType
                ? ques.questionType[0]
                : ques.questionType;
            }
          }
          this.questionaryForm = this.getUpdateFormGroup();
          this.getBoardIdAndSyllabusId();
          this.getChapterAndSetSubject();
          this.getTopicsAndSetChapter();
          this.getLearnOutcomeAndSetTopic();
          setTimeout(() => {
            this.questionUpdateChange();
            this.subjectChanged();
            this.questionFormControl.chapter.setValue(this.question.chapter[0]._id);
            this.questionFormControl.questionSvg = this.question.questionSvg;
            this.chapterChanged();
            this.question.topic ? this.questionFormControl.topic.setValue(this.question.topic[0] ? this.question.topic[0]._id : []) : '';
            this.topicChanged();

            this.questionFormControl.learningOutcome.setValue(
              this.question.learningOutcome
            );
            this.formLoaded = true;
            this.cdr.detectChanges();
          }, 0);
          // this.questionTypeUpdate(this.question.questionType[0] || this.question.questionType);

          let studenTypes = this.questionaryForm.controls[
            "studentType"
          ] as FormArray;
          for (
            let index = 0;
            index < this.question.studentType.length;
            index++
          ) {
            studenTypes.push(
              this.formBuilder.control(this.question.studentType[index])
            );
          }
          let practiceAndTestQuestion = this.questionaryForm.controls[
            "practiceAndTestQuestion"
          ] as FormArray;
          for (
            let index = 0;
            index < this.question.practiceAndTestQuestion.length;
            index++
          ) {
            practiceAndTestQuestion.push(
              this.formBuilder.control(
                this.question.practiceAndTestQuestion[index]
              )
            );
          }
          console.log('thisForm', this.questionaryForm);
          this.cdr.detectChanges();
          this.loaderService.hide();
        },
        (error) => {
          this.loaderService.hide();
        }
      );
    }

    const invalidItemsthis = this.findInvalidControls();
    console.log('invalidItemsthis', invalidItemsthis);
  }

  getFormGroup(flag?) {
    if (flag) {
      return this.formBuilder.group({
        board: [
          this.questionaryForm.controls["board"].value,
          Validators.required,
        ],
        class: [
          this.questionaryForm.controls["class"].value,
          Validators.required,
        ],
        syllabus: [
          this.questionaryForm.controls["syllabus"].value,
          Validators.required,
        ],
        subject: [
          this.questionaryForm.controls["subject"].value,
          Validators.required,
        ],
        chapter: [
          this.questionaryForm.controls["chapter"].value,
          Validators.required,
        ],
        topic: [this.questionaryForm.controls["topic"].value],
        learningOutcome: [
          this.questionaryForm.controls["learningOutcome"].value,
        ],
        questionCategory: [
          this.questionaryForm.controls["questionCategory"].value,
        ],
        examType: [this.questionaryForm.controls["examType"].value],
        questionType: [null, Validators.required],
        practiceAndTestQuestion: this.formBuilder.array([]),
        studentType: this.formBuilder.array([]),
        difficultyLevel: [null],
        language: [null],
        negativeScore: ["NO", Validators.required],
        negativeMarks: [{ value: null, disabled: true }, Validators.required],
        totalMarks: [null, Validators.required],
        duration: [null],
        questionTitle: [null],
        reason: [null],
        question: [null, Validators.required],
        matchOptions: this.formBuilder.group({
          column1: this.formBuilder.array([]),
          column2: this.formBuilder.array([]),
          column3: this.formBuilder.array([]),
        }),
        optionsType: ["text"],
        options: this.formBuilder.array([]),
        answer: this.formBuilder.array([], Validators.required),
        repository: this.formBuilder.array([
          {
            id: [null],
            repository_type: [null],
          },
        ]),
        createdBy: [null],
      });
    } else {
      return this.formBuilder.group({
        board: [null, Validators.required],
        class: [null, Validators.required],
        syllabus: [null, Validators.required],
        subject: [null, Validators.required],
        chapter: [{ value: null, disabled: true }, Validators.required],
        topic: [{ value: [], disabled: true }],
        learningOutcome: [{ value: [], disabled: true }],
        questionCategory: [[]],
        examType: [[]],
        questionType: [null, Validators.required],
        practiceAndTestQuestion: this.formBuilder.array([]),
        studentType: this.formBuilder.array([]),
        difficultyLevel: ["intermediate"],
        language: [null],
        negativeScore: ["NO", Validators.required],
        negativeMarks: [{ value: null, disabled: true }, Validators.required],
        totalMarks: [null, Validators.required],
        duration: [null],
        questionTitle: [null],
        reason: [null],
        question: ["", Validators.required],
        matchOptions: this.formBuilder.group({
          column1: this.formBuilder.array([]),
          column2: this.formBuilder.array([]),
          column3: this.formBuilder.array([]),
        }),
        optionsType: ["text"],
        options: this.formBuilder.array([]),
        answer: this.formBuilder.array([], Validators.required),
        repository: this.formBuilder.array([
          {
            id: [null],
            repository_type: [null],
          },
        ]),
        createdBy: [null],
      });
    }
  }

  getUpdateFormGroup() {
    this.subjectFlag = true;
    this.chapterFlag = true;
    this.topicFlag = true;
    this.learningOutcomeFlag = true;
    this.selectedClassId = this.question.class._id;
    this.selectedBoardName = this.question.board[0].name;
    this.selectedSyllabusName = this.question.syllabus[0].name;
    this.selectedBoardId = this.question.board[0]._id;
    this.selectedSyllabusId = this.question.syllabus[0]._id;
    this.selectedSubjectId = this.question.subject._id;

    this.selectedChapterId = this.question.chapter && this.question.chapter[0] ? this.question.chapter[0]._id : null;
    this.selectedTopicId = this.question.topic && this.question.topic[0] ? this.question.topic[0]._id : [];
    console.log('Question', this.question)
    if (!this.isOwner) {
      return this.formBuilder.group({
        board: [this.question.board.map((x) => x._id), Validators.required],
        class: [this.question.class._id, Validators.required],
        syllabus: [
          this.question.syllabus.map((x) => x._id),
          Validators.required,
        ],
        subject: [this.question.subject._id, Validators.required],
        chapter: [
          this.question.chapter.map((x) => x._id),
          Validators.required,
        ],
        topic: [this.question.topic.map((x) => x._id)],
        learningOutcome: [
          this.question.learningOutcome
            ? this.question.learningOutcome.map((x) => x._id)
            : [],
        ],
        // learningOutcome: [''],
        reason: [this.question.reason],
        questionCategory: [this.question.questionCategory],
        examType: [
          this.question.examType
            ? this.question.examType.map((x) => x._id)
            : [],
        ],
        questionType: [this.question.questionType[0], Validators.required],
        practiceAndTestQuestion: this.formBuilder.array([]),
        studentType: this.formBuilder.array([]),
        difficultyLevel: [this.question.difficultyLevel],
        language: [this.question.language],
        negativeScore: [this.question.negativeScore, Validators.required],
        negativeMarks: [
          {
            value: this.question.negativeMarks,
            disabled: this.question.negativeScore == "NO" ? true : false,
          },
          Validators.required,
        ],
        totalMarks: [this.question.totalMarks, Validators.required],
        duration: [this.question.duration],
        questionTitle: [this.question.questionTitle],
        question: [this.question.question, Validators.required],
        matchOptions: this.formBuilder.group({
          column1: this.formBuilder.array([]),
          column2: this.formBuilder.array([]),
          column3: this.formBuilder.array([]),
        }),
        optionsType: [this.question.optionsType],
        options: this.formBuilder.array([]),
        answer: this.formBuilder.array([], Validators.required),

        repository: this.formBuilder.array([
          {
            id: [this.question.repository[0].id],
            repository_type: [this.question.repository[0].repository_type],
          },
        ]),
        createdBy: [this.question.createdBy],
      });

    } else {
      return this.formBuilder.group({
        board: [
          this.question.board.map((x) => x._id)[0],
          Validators.required,
        ],
        class: [this.question.class._id, Validators.required],
        syllabus: [
          this.question.syllabus.map((x) => x._id)[0],
          Validators.required,
        ],
        subject: [this.question.subject._id, Validators.required],
        chapter: [
          this.question.chapter.map((x) => x._id)[0],
          Validators.required,
        ],
        // chapter: [this.question.chapter, Validators.required],
        topic: [
          this.question.topic ? this.question.topic.map((x) => x._id)[0] : [],

        ],
        // topic: [{ value: this.question.topic, disabled: false }],
        learningOutcome: [
          this.question.learningOutcome ? this.question.learningOutcome.map((x) => x._id)[0] : '',
        ],
        // learningOutcome: [
        //   { value: this.question.learningOutcome, disabled: false },
        // ],
        // learningOutcome: [''],
        reason: [this.question.reason],
        questionCategory: [this.question.questionCategory],
        examType: [
          this.question.examType
            ? this.question.examType.map((x) => x._id)
            : null,
        ],
        questionType: [this.question.questionType[0], Validators.required],
        practiceAndTestQuestion: this.formBuilder.array([]),
        studentType: this.formBuilder.array([]),
        difficultyLevel: [this.question.difficultyLevel],
        language: [this.question.language],
        negativeScore: [this.question.negativeScore, Validators.required],
        negativeMarks: [
          {
            value: this.question.negativeMarks,
            disabled: this.question.negativeScore == "NO" ? true : false,
          },
          Validators.required,
        ],
        totalMarks: [this.question.totalMarks, Validators.required],
        duration: [this.question.duration],
        questionTitle: [this.question.questionTitle],
        question: [this.question.question, Validators.required],
        matchOptions: this.formBuilder.group({
          column1: this.formBuilder.array([]),
          column2: this.formBuilder.array([]),
          column3: this.formBuilder.array([]),
        }),
        optionsType: [this.question.optionsType],
        options: this.formBuilder.array([]),
        answer: this.formBuilder.array(
          [],
          this.question.questionType[0] != "freeText" ? Validators.required : []
        ),

        repository: this.formBuilder.array([
          {
            id: [this.question.repository[0].id],
            repository_type: [this.question.repository[0].repository_type],
          },
        ]),
        createdBy: [this.question.createdBy],
      });
    }
  }

  questionUpdateChange() {
    this.loaderService.show();
    this.questionFormControl.question.setValue(
      this.questionFormControl.question.value[0]
    );
    //this.questionFormControl.questionSvg = this.question.questionSvg;
    if (
      this.question.questionType == "objectives" ||
      this.questionFormControl.questionType.value == "fillInTheBlanks" ||
      this.question.questionType == "sequencingQuestion"
    ) {
      this.questionFormControl.options.setValidators([
        Validators.required,
        this.questionFormControl.questionType.value == "fillInTheBlanks"
          ? Validators.maxLength(1)
          : Validators.minLength(2),
      ]);
      this.answerFormArray.push(
        this.formBuilder.group(this.question.answer[0])
      );
      this.submitted = true;
      console.log(this.answerFormArray);
      this.cdr.detectChanges();
      for (let i = 0; i < this.question.options.length; i++) {
        this.optionFormArray.push(
          this.formBuilder.group({
            value: [this.question.options[i].value, Validators.required],
            file_text: [
              this.question.options[i].file_text,
              this.question.optionsType !== "text" ? Validators.required : "",
            ],
          })
        );

        setTimeout(() => {
          var el = document.getElementById("mathOptId" + i);
          console.log("el", el);
          if (el) {
            el.innerHTML = this.optionFormArray.controls[i].get("value").value;
            // MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
          }
        }, 100);
      }

      this.cdr.detectChanges();
    }
    // this.question.questionType == 'optionLevelScoring'
    else if (
      this.question.questionType == "mcq" ||
      this.question.questionType == "sentenceSequencing"
    ) {
      this.questionFormControl.options.setValidators([
        Validators.required,
        Validators.minLength(2),
      ]);
      this.submitted = true;
      for (let i = 0; i < this.question.options.length; i++) {
        this.optionFormArray.push(
          this.formBuilder.group({
            value: [this.question.options[i].value, Validators.required],
            file_text: [
              this.question.options[i].file_text,
              this.question.optionsType !== "text" ? Validators.required : "",
            ],
          })
        );
        setTimeout(() => {
          var el = document.getElementById("mathOptId" + i);
          console.log("el", el);
          if (el) {
            el.innerHTML = this.optionFormArray.controls[i].get("value").value;
            //  MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
          }
        }, 100);
      }
      for (let i = 0; i < this.question.answer.length; i++) {
        this.answerFormArray.push(
          this.formBuilder.group({
            value: [this.question.answer[i].value, Validators.required],
            file_text: [
              this.question.answer[i].file_text,
              this.question.optionsType !== "text" ? Validators.required : "",
            ],
          })
        );
      }
      console.log(this.answerFormArray);
      console.log(this.optionFormArray, this.answerFormArray);
      this.cdr.detectChanges();
    } else if (this.question.questionType == "optionLevelScoring") {
      console.log('this.question.answer', this.question.answer)
      this.questionFormControl.options.setValidators([
        Validators.required,
        Validators.minLength(2),
      ]);
      this.submitted = true;
      for (let i = 0; i < this.question.options.length; i++) {
        this.optionFormArray.push(
          this.formBuilder.group({
            value: [this.question.options[i].value, Validators.required],
            file_text: [
              this.question.options[i].file_text,
              this.question.optionsType !== "text" ? Validators.required : "",
            ],
            isDisable: [
              this.question.options[i].isDisable
                ? this.question.options[i].isDisable
                : false,
            ],
            score: [
              this.question.options[i].score
                ? this.question.options[i].score
                : 0,
            ],
          })
        );
        setTimeout(() => {
          var el = document.getElementById("mathOptId" + i);
          console.log("el", el);
          if (el) {
            el.innerHTML = this.optionFormArray.controls[i].get("value").value;
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
          }
        }, 100);
      }
      for (let i = 0; i < this.question.answer.length; i++) {

        this.answerFormArray.push(
          this.formBuilder.group({
            value: [this.question.answer[i].value, Validators.required],
            file_text: [
              this.question.answer[i].file_text,
              this.question.optionsType !== "text" ? Validators.required : "",
            ],
            score: [this.question.answer[i].score, Validators.required],
          })
        );
      }
      console.log(this.answerFormArray);
      console.log(this.optionFormArray, this.answerFormArray);
      this.cdr.detectChanges();
    } else if (this.questionFormControl.questionType.value == "sorting") {
      this.optionFormArray.push(
        this.formBuilder.group({
          sortingOption: this.formBuilder.array([]),
          groups: this.formBuilder.array([]),
        })
      );
      this.submitted = true;
      for (let i = 0; i < this.question.options[0].sortingOption.length; i++) {
        this.sortingOptionArray.push(
          this.formBuilder.group({
            value: [
              this.question.options[0].sortingOption[i].value,
              Validators.required,
            ],
            file_text: [
              this.question.options[0].sortingOption[i].file_text,
              this.question.optionsType !== "text" ? Validators.required : "",
            ],
          })
        );
      }
      for (let i = 0; i < this.question.options[0].groups.length; i++) {
        this.groupsArray.push(
          this.formBuilder.group({
            value: [
              this.question.options[0].groups[i].value,
              Validators.required,
            ],
            file_text: [
              this.question.options[0].groups[i].file_text,
              this.question.optionsType !== "text" ? Validators.required : "",
            ],
          })
        );
        this.answerFormArray.push(
          this.formBuilder.group({
            value: [this.question.answer[i].value, Validators.required],
            file_text: [
              this.question.answer[i].file_text,
              this.question.optionsType !== "text" ? Validators.required : "",
            ],
          })
        );
      }
      this.cdr.detectChanges();
      this.questionFormControl.optionsType.setValue("text");
      this.questionFormControl.optionsType.setValidators(Validators.required);
    } else if (
      this.questionFormControl.questionType.value == "twoColMtf" ||
      this.questionFormControl.questionType.value == "threeColMtf" ||
      this.questionFormControl.questionType.value == "3colOptionLevelScoring"
    ) {
      this.questionFormControl.optionsType.setValue(this.question.optionsType);
      this.questionFormControl.optionsType.setValidators(Validators.required);
      for (let i = 0; i < this.question.matchOptions.column1.length; i++) {
        this.column1Array.push(
          this.formBuilder.group({
            value: [
              this.question.matchOptions.column1[i].value,
              this.question.matchOptions.column1[i].file_text
                ? ""
                : Validators.required,
            ],
            type: [this.question.matchOptions.column1[i].type],
            file_text: [
              this.question.matchOptions.column1[i].file_text,
              this.question.optionsType !== "text" &&
                this.question.matchOptions.column1[i].value
                ? Validators.required
                : "",
            ],
          })
        );
      }
      for (let i = 0; i < this.question.matchOptions.column2.length; i++) {
        this.column2Array.push(
          this.formBuilder.group({
            value: [
              this.question.matchOptions.column2[i].value,
              this.question.matchOptions.column2[i].file_text
                ? ""
                : Validators.required,
            ],
            type: [this.question.matchOptions.column2[i].type],
            file_text: [
              this.question.matchOptions.column2[i].file_text,
              this.question.optionsType !== "text" &&
                this.question.matchOptions.column2[i].value
                ? Validators.required
                : "",
            ],
          })
        );
      }
      if (
        this.questionFormControl.questionType.value == "threeColMtf" ||
        this.questionFormControl.questionType.value == "3colOptionLevelScoring"
      ) {
        for (let i = 0; i < this.question.matchOptions.column3.length; i++) {
          this.column3Array.push(
            this.formBuilder.group({
              value: [
                this.question.matchOptions.column3[i].value,
                this.question.matchOptions.column3[i].value
                  ? ""
                  : Validators.required,
              ],
              type: [this.question.matchOptions.column3[i].type],
              file_text: [
                this.question.matchOptions.column3[i].file_text,
                this.question.optionsType !== "text" &&
                  this.question.matchOptions.column3[i].value
                  ? Validators.required
                  : "",
              ],
            })
          );
        }
      }
      for (let i = 0; i < this.question.options.length; i++) {
        this.optionFormArray.push(
          this.formBuilder.group({
            value: [this.question.options[i].value, Validators.required],
            isDisable: [
              this.question.options[i].isDisable
                ? this.question.options[i].isDisable
                : false,
            ],
            score: [
              this.question.options[i].score
                ? this.question.options[i].score
                : 0,
            ],
          })
        );
        setTimeout(() => {
          var el = document.getElementById("mathOptId" + i);
          console.log("el", el);
          if (el) {
            el.innerHTML = this.optionFormArray.controls[i].get("value").value;
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
          }
        }, 100);
      }
      this.answerFormArray.push(
        this.formBuilder.group(this.question.answer[0])
      );
      // this.answerFormArray.push(this.formBuilder.control([this.question.answer[0], Validators.required]))
      console.log(this.answerFormArray.value);
      this.matchSubmitted = true;
      this.submitted = true;
      console.log(this.optionFormArray);
    }
    // else if (this.questionFormControl.questionType.value == 'fillInTheBlanks') {
    //   for (let index = 0; index < this.question.answer.length; index++) {
    //     this.answerFormArray.push(this.formBuilder.group({
    //       value: [this.question.answer[index].value, Validators.required]
    //     }))
    //   }
    //   this.submitted = true;
    // }
    else if (this.questionFormControl.questionType.value == "trueOrFalse") {
      this.answerFormArray.push(
        this.formBuilder.control(this.question.answer[0], Validators.required)
      );
    } else if (
      this.questionFormControl.questionType.value == "NumericalRange"
    ) {
      // this.optionFormArray.push(
      //   this.formBuilder.group({
      //     minValue: [this.question.options[0].minValue, Validators.required],
      //     maxValue: [this.question.options[0].maxValue, Validators.required]
      //   })
      // )
      this.submitted = true;
      this.answerFormArray.push(
        this.formBuilder.group({
          minValue: [this.question.answer[0].minValue, Validators.required],
          maxValue: [this.question.answer[0].maxValue, Validators.required],
          value: [
            this.question.answer[0].value ? this.question.answer[0].value : "",
          ],
        })
      );
      // this.answerFormArray.push(this.formBuilder.control(this.question.answer[0], [Validators.required]));
    }
    this.loaderService.hide();
  }

  ispracticeAndTestQuestion(id: any): boolean {
    const praticTests = (<FormArray>(
      this.questionaryForm.get("practiceAndTestQuestion")
    )) as FormArray;
    return praticTests.value.some((elt) => elt === id);
  }

  isStudentType(id: any) {
    const studentTypes = (<FormArray>(
      this.questionaryForm.get("studentType")
    )) as FormArray;
    return studentTypes.value.some((elt) => elt === id);
  }

  get questionFormControl() {
    if (this.questionaryForm) {
      return this.questionaryForm.controls;
    }

  }

  get optionFormArray() {
    return this.questionFormControl.options as FormArray;
  }

  get answerFormArray() {
    return this.questionFormControl.answer as FormArray;
  }

  get sortingOptionArray() {
    return this.optionFormArray.controls[0].get("sortingOption") as FormArray;
  }

  get groupsArray() {
    return this.optionFormArray.controls[0].get("groups") as FormArray;
  }

  get column1Array() {
    console.log(this.questionFormControl.matchOptions);
    return this.questionFormControl.matchOptions.get("column1") as FormArray;
  }

  get column2Array() {
    return this.questionFormControl.matchOptions.get("column2") as FormArray;
  }

  get column3Array() {
    return this.questionFormControl.matchOptions.get("column3") as FormArray;
  }

  getBoards() {
    this.loaderService.show();
    this.apiService.getBoards().subscribe(
      (response: any) => {
        this.boards = response.body.data;
        this.loaderService.hide();
      },
      (error) => {
        this.loaderService.hide();
      }
    );
  }
  getClasses() {
    this.loaderService.show();
    this.apiService.getGlobalClasses().subscribe(
      (response: any) => {
        this.classes = response.body.data;
        this.cdr.detectChanges();
        this.loaderService.hide();
        console.log(this.classes);
      },
      (error) => {
        this.loaderService.hide();
      }
    );
  }
  getallinstitutes() {
    this.loaderService.show();
    let userInfo = localStorage.getItem("info");
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
    }
    this.apiService.getallinstitute(id).subscribe(
      (data: any) => {
        this.class = data.body.data[0].classList;

        console.log(this.class, "this.class");

        this.cdr.detectChanges();
        this.loaderService.hide();
      },
      (error) => {
        this.loaderService.hide();
      }
    );
  }
  getSyllabus() {
    this.apiService.getGlobalSyllabuses().subscribe((response: any) => {
      this.syllabuses = response.body.data;
    });
  }

  getSubjects() {
    this.loaderService.show();
    this.apiService.getGlobalSubjects().subscribe(
      (response: any) => {
        this.subjects = response.body.data;
        this.cdr.detectChanges();
        this.loaderService.hide();
      },
      (error) => {
        this.loaderService.hide();
      }
    );
  }
  getAllChapters() {
    this.apiService.getChapters().subscribe((response: any) => {
      this.allChapters = response.body.data;
    });
  }
  getAllTopics() {
    this.apiService.getTopics().subscribe((response: any) => {
      this.allTopics = response.body.data;
    });
  }

  getAllLarningOutcomes() {
    this.apiService.getAllLarningOutcomes().subscribe((response: any) => {
      this.allLearningOutcomes = response.body.data;
    });
  }
  getQuestionCategories() {
    this.apiService.getQuestionCategory().subscribe((response: any) => {
      this.questionCategories = response.body.data;
    });
  }
  getExamType() {
    this.apiService.getExamType().subscribe((response: any) => {
      this.examTypes = response.body.data;
    });
  }
  getBoardIdAndSyllabusId(value?) {
    this.loaderService.show();
    this.chapterFlag = false;
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    this.subjectFlag = false;
    if (value) {
      this.selectedClassId = value;
      this.subjects = [];
      this.selectedBoardId = "";
      this.selectedSyllabusId = "";
      this.selectedBoardName = "";
      this.selectedSyllabusName = "";
    }
    this.questionFormControl.subject.setValue("");
    this.questionFormControl.chapter.setValue("");
    this.questionFormControl.topic.setValue([]);
    this.questionFormControl.learningOutcome.setValue("");
    this.createApiServices.getBoardByClassId(this.selectedClassId).subscribe(
      (response: any) => {
        if (
          response &&
          response.body &&
          response.body.data &&
          response.body.data.length
        ) {
          this.questionFormControl.board.setValue(response.body.data[0]._id);
          this.selectedBoardId = response.body.data[0]._id;
          this.selectedBoardName = response.body.data[0].name;
          this.createApiServices
            .getSyllabusByClassId(this.selectedClassId, this.selectedBoardId)
            .subscribe(
              (response: any) => {
                if (
                  response &&
                  response.body &&
                  response.body.data &&
                  response.body.data.length
                ) {
                  this.questionFormControl.syllabus.setValue(
                    response.body.data[0]._id
                  );
                  this.selectedSyllabusId = response.body.data[0]._id;
                  this.selectedSyllabusName = response.body.data[0].name;
                  this.createApiServices
                    .getSubjectsByClassId(
                      this.selectedClassId,
                      this.selectedBoardId,
                      this.selectedSyllabusId
                    )
                    .subscribe(
                      (response: any) => {
                        if (
                          response &&
                          response.body &&
                          response.body.data &&
                          response.body.data.length
                        ) {
                          this.subjects = response.body.data;
                          this.loaderService.hide();
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
    this.subjectFlag = true;
    this.cdr.detectChanges();
  }
  getChapterAndSetSubject(value?) {
    this.loaderService.show();
    this.chapters = [];
    if (value) {
      this.selectedSubjectId = value;
    }
    this.chapterFlag = false;
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    this.questionFormControl.subject.setValue(this.selectedSubjectId);
    this.questionFormControl.chapter.setValue("");
    this.questionFormControl.topic.setValue([]);
    this.questionFormControl.learningOutcome.setValue([]);

    this.apiService
      .getChaptersBySubject(
        this.selectedClassId,
        this.selectedBoardId,
        this.selectedSyllabusId,
        this.selectedSubjectId
      )
      .subscribe(
        (response: any) => {
          if (
            response &&
            response.body &&
            response.body.data &&
            response.body.data.length
          ) {
            this.chapters = response.body.data;
            this.cdr.detectChanges();
          }
        },
        (error) => {
          this.loaderService.hide();
        }
      );
    this.chapterFlag = true;
    this.subjectChanged();
    this.loaderService.hide();
  }
  getTopicsAndSetChapter(value?) {
    this.loaderService.show();
    this.topics = [];
    if (value) {
      this.selectedChapterId = value;
    }
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    this.questionFormControl.chapter.setValue(this.selectedChapterId);
    this.questionFormControl.topic.setValue([]);
    this.questionFormControl.learningOutcome.setValue([]);
    this.apiService
      .getTopicByChapters(
        this.selectedClassId,
        this.selectedBoardId,
        this.selectedSyllabusId,
        this.selectedSubjectId,
        this.selectedChapterId
      )
      .subscribe(
        (response: any) => {
          if (
            response &&
            response.body &&
            response.body.data &&
            response.body.data.length
          ) {
            console.log('Topic', response.body.data)
            this.topics = response.body.data;
            this.cdr.detectChanges();
          }
        },
        (error) => {
          this.loaderService.hide();
        }
      );
    this.topicFlag = true;
    this.chapterChanged();
    this.loaderService.hide();
  }

  getLearnOutcomeAndSetTopic(value?) {
    this.learningOutcomes = [];
    if (value) {
      this.selectedTopicId = value;
    }
    this.learningOutcomeFlag = false;
    this.loaderService.show();
    this.questionFormControl.topic.setValue(this.selectedTopicId);
    this.questionFormControl.learningOutcome.setValue([]);
    this.apiService
      .getLearningOutcomeByTopic(
        this.selectedClassId,
        this.selectedBoardId,
        this.selectedSyllabusId,
        this.selectedSubjectId,
        this.selectedChapterId,
        this.selectedTopicId
      )
      .subscribe(
        (response: any) => {
          if (
            response &&
            response.body &&
            response.body.data &&
            response.body.data.length
          ) {
            this.learningOutcomes = response.body.data;
            this.cdr.detectChanges();
          }
        },
        (error) => {
          this.loaderService.hide();
        }
      );

    this.learningOutcomeFlag = true;
    this.topicChanged();
    this.loaderService.hide();
  }

  getChpterAndSetSubjectGlobal(value?) {
    this.loaderService.show();
    this.chapters = [];
    if (!value) {
      this.chapterFlag = false;
      this.topicFlag = false;
      this.learningOutcomeFlag = false;
      this.questionFormControl.chapter.setValue("");
      this.questionFormControl.topic.setValue([]);
      this.questionFormControl.learningOutcome.setValue([]);
      this.subjectChanged();
    }
    let obj = {
      class_id: this.questionFormControl.class.value,
      board_id: this.questionFormControl.board.value,
      syllabus_id: this.questionFormControl.syllabus.value,
      subject_id: this.questionFormControl.subject.value,
      "repository.id": this.globalId,
    };
    this.apiService.getChaptersBySubjectGlobalFilter(obj).subscribe(
      (response: any) => {
        if (
          response &&
          response.body &&
          response.body.data &&
          response.body.data.length
        ) {
          this.chapters = response.body.data;
          this.cdr.detectChanges();
        }
      },
      (error) => {
        this.loaderService.hide();
      }
    );
    this.chapterFlag = true;
    this.loaderService.hide();
  }
  getTopicAndSetChapterGlobal(event?) {
    this.loaderService.show();
    this.topics = [];
    if (!event) {
      this.topicFlag = false;
      this.learningOutcomeFlag = false;
      this.questionFormControl.topic.setValue([]);
      this.questionFormControl.learningOutcome.setValue([]);
      this.chapterChanged();
    }
    let obj = {
      class_id: this.questionFormControl.class.value,
      board_id: this.questionFormControl.board.value,
      syllabus_id: this.questionFormControl.syllabus.value,
      subject_id: this.questionFormControl.subject.value,
      chapter_id: this.questionFormControl.chapter.value,
      "repository.id": this.globalId,
    };
    this.apiService.getTopicsByChapterGlobalFilter(obj).subscribe(
      (response: any) => {
        if (
          response &&
          response.body &&
          response.body.data &&
          response.body.data.length
        ) {
          this.topics = response.body.data;
          console.log('Topic', this.topics)
          this.cdr.detectChanges();
        }
      },
      (error) => {
        this.loaderService.hide();
      }
    );
    this.topicFlag = true;
    this.loaderService.hide();
  }
  getLearningAndSetTopicGlobal(event?) {
    this.loaderService.show();
    this.learningOutcomes = [];
    if (!event) {
      this.learningOutcomeFlag = false;
      this.questionFormControl.learningOutcome.setValue([]);
      this.topicChanged();
    }
    let obj = {
      class_id: this.questionFormControl.class.value,
      board_id: this.questionFormControl.board.value,
      syllabus_id: this.questionFormControl.syllabus.value,
      subject_id: this.questionFormControl.subject.value,
      chapter_id: this.questionFormControl.chapter.value,
      topic_id: this.questionFormControl.topic.value,
      "repository.id": this.globalId,
    };
    this.apiService.getLearningOutcomeByGlobalFilter(obj).subscribe(
      (response: any) => {
        if (
          response &&
          response.body &&
          response.body.data &&
          response.body.data.length
        ) {
          this.learningOutcomes = response.body.data;
          this.cdr.detectChanges();
        }
      },
      (error) => {
        this.loaderService.hide();
      }
    );
    this.learningOutcomeFlag = true;
    this.loaderService.hide();
  }

  // compareFn(c11: any, c22: any): boolean {
  //   return c11 && c22 ? c11.id === c22.id : c11 === c22;
  // }
  // compareFn(item, selected) {
  //   // any logic to compare the objects and return true or false
  //       return item.schoolId === selected.schoolId
  //     }
  compareFn(x, y): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  subjectChanged() {
    if (this.chapters && this.chapters.length) {
      this.chapters = this.allChapters.filter((chapter) => {
        return (
          (chapter.subject_id._id == this.questionFormControl.subject.value &&
            chapter.class_id._id == this.questionFormControl.class.value) ||
          chapter.board_id._id == this.questionFormControl.board.value ||
          chapter.syllabus_id._id == this.questionFormControl.syllabus.value
        );
      });
    }
    this.questionFormControl.chapter.setValue("");
    this.questionFormControl.topic.setValue([]);
    this.questionFormControl.learningOutcome.setValue([]);
    if (
      !this.questionFormControl.subject.value ||
      !this.questionFormControl.subject.value ||
      !this.questionFormControl.subject.value ||
      !this.questionFormControl.subject.value
    ) {
      this.questionFormControl.chapter.disable();
      this.questionFormControl.topic.disable();
      this.questionFormControl.learningOutcome.disable();
    } else {
      this.questionFormControl.chapter.enable();
      if (!this.questionFormControl.chapter.value) {
        this.questionFormControl.topic.disable();
        this.questionFormControl.learningOutcome.disable();
      } else {
        this.questionFormControl.topic.enable();
        if (!this.questionFormControl.topic.value) {
          this.questionFormControl.learningOutcome.disable();
        } else {
          this.questionFormControl.learningOutcome.enable();
        }
      }
    }
  }

  chapterChanged() {
    this.topics = this.allTopics.filter((topic) => {
      return topic.chapter_id._id == this.questionFormControl.chapter.value;
    });
    this.questionFormControl.topic.setValue([]);
    this.questionFormControl.learningOutcome.setValue([]);
    if (!this.questionFormControl.chapter.value) {
      this.questionFormControl.topic.disable();
      this.questionFormControl.learningOutcome.disable();
    } else {
      this.questionFormControl.topic.enable();
      if (!this.questionFormControl.topic.value) {
        this.questionFormControl.learningOutcome.disable();
      } else {
        this.questionFormControl.learningOutcome.enable();
      }
    }
  }

  topicChanged() {
    this.learningOutcomes = this.allLearningOutcomes.filter(
      (learningOutcome) => {
        return (
          learningOutcome.topic_id._id == this.questionFormControl.topic.value
        );
      }
    );
    this.questionFormControl.learningOutcome.setValue([]);
    if (!this.questionFormControl.topic.value) {
      this.questionFormControl.learningOutcome.disable();
    } else {
      this.questionFormControl.learningOutcome.enable();
    }
  }

  onChange(event) {
    const praticTests = this.questionFormControl
      .practiceAndTestQuestion as FormArray;
    if (event.checked) {
      praticTests.push(new FormControl(event.source.value));
    } else {
      const i = praticTests.controls.findIndex(
        (x) => x.value === event.source.value
      );
      praticTests.removeAt(i);
    }
  }

  onStudentTypeChange(event) {
    const studentTypes = this.questionFormControl.studentType as FormArray;
    if (event.checked) {
      studentTypes.push(new FormControl(event.source.value));
    } else {
      const i = studentTypes.controls.findIndex(
        (x) => x.value === event.source.value
      );
      studentTypes.removeAt(i);
    }
  }

  negativeScoreChange() {
    if (this.questionFormControl.negativeScore.value == "YES") {
      this.questionFormControl.negativeMarks.enable();
      this.questionFormControl.negativeMarks.setValidators(Validators.required);
    } else {
      this.questionFormControl.negativeMarks.disable();
      this.questionFormControl.negativeMarks.setValue("");
      this.questionFormControl.negativeMarks.clearValidators();
      this.questionFormControl.negativeMarks.updateValueAndValidity();
    }
  }

  valuechanged(event) {
    console.log('Event T1', event)
    this.questionFormControl.question.setValue(event);
    //this.questionFormControl.questionSvg.setValue(this.question.questionSvg);
    console.log('this.questionFormControl', this.questionFormControl);
    this.questionFormControl.question.markAsTouched();
    if (
      this.questionFormControl.questionType.value == "freeText" &&
      this.answerFormArray.controls[0]
    ) {
      console.log("this.AnswerFormArray",this.answerFormArray);
      this.answerFormArray.clearValidators();
      this.answerFormArray.updateValueAndValidity();
      this.answerFormArray.controls = [];
      //this.answerFormArray.reset();
      //this.answerFormArray.setErrors({ 'invalid': false })
      this.answerFormArray.clearValidators();
      //this.answerFormArray.clearAsyncValidators();
      this.answerFormArray.updateValueAndValidity();
      //this.questionaryForm.controls.answer.clearValidators();
      //this.questionFormControl.answer.updateValueAndValidity();
      // this.questionFormControl.answer.setValue('null');
      // this.questionFormControl.answer.controls[0].updateValueAndValidity();
      // this.questionFormControl.answer.clearValidators();
      // this.questionFormControl.answer.updateValueAndValidity();
     // this.questionFormControl.answer.setErrors({ 'status': "VALID" });
    }
    if (this.questionFormControl.questionType.value == "fillInTheBlanks") {
      // this.submitted = false
      // this.answerFormArray.clear();
    }
  }

  questionTypeChange() {
    this.optionFormArray.clear();
    this.answerFormArray.clear();
    this.column1Array.clear();
    this.column2Array.clear();
    this.column3Array.clear();
    this.questionFormControl.matchOptions.reset();
    this.questionFormControl.matchOptions.reset();
    this.questionFormControl.matchOptions.clearValidators();
    this.questionFormControl.options.clearValidators();
    this.optionFormArray.reset();
    // this.questionFormControl.totalMarks.enable();
    this.submitted = false;
    this.matchSubmitted = false;
    this.isLoader = false;
    this.images = [];
    this.groupImages = [];
    this.optionImages = [];
    this.column1Images = [];
    this.column2Images = [];
    this.column3Images = [];
    if (
      this.questionFormControl.questionType.value == "objectives" ||
      this.questionFormControl.questionType.value == "mcq" ||
      this.questionFormControl.questionType.value == "sequencingQuestion" ||
      this.questionFormControl.questionType.value == "sentenceSequencing" ||
      this.questionFormControl.questionType.value == "optionLevelScoring" ||
      this.questionFormControl.questionType.value == "fillInTheBlanks"
    ) {
      this.questionFormControl.optionsType.setValue("text");
      this.questionFormControl.optionsType.setValidators(Validators.required);
      this.questionFormControl.options.setValidators([
        Validators.required,
        this.questionFormControl.questionType.value == "fillInTheBlanks"
          ? Validators.maxLength(1)
          : Validators.minLength(2),
      ]);
      if (this.questionFormControl.questionType.value == "optionLevelScoring") {
        this.questionFormControl.totalMarks.setValue(4);
        this.addOptionOptionalScoring('optionLevelScoring');
        // this.questionFormControl.totalMarks.disable();
      } else {
        this.addOption();
      }
    } else if (
      this.questionFormControl.questionType.value == "trueOrFalse" ||
      this.questionFormControl.questionType.value == "freeText"
    ) {
      this.answerFormArray.push(
        this.formBuilder.control([], Validators.required)
      );
    } else if (
      this.questionFormControl.questionType.value == "NumericalRange"
    ) {
      // this.optionFormArray.push(
      //   this.formBuilder.group({
      //     minValue: ['', Validators.required],
      //     maxValue: ['', Validators.required]
      //   })
      // )
      // this.answerFormArray.push(this.formBuilder.control('', [Validators.required]));
      this.answerFormArray.push(
        this.formBuilder.group({
          minValue: ["", Validators.required],
          maxValue: ["", Validators.required],
          value: [""],
        })
      );
    } else if (this.questionFormControl.questionType.value == "sorting") {
      this.questionFormControl.optionsType.setValue("text");
      this.questionFormControl.optionsType.setValidators(Validators.required);
      this.optionFormArray.push(
        this.formBuilder.group({
          sortingOption: this.formBuilder.array([]),
          groups: this.formBuilder.array([]),
        })
      );
      this.addSortingOption();
      this.addGroupOption();
    } else if (
      this.questionFormControl.questionType.value == "twoColMtf" ||
      this.questionFormControl.questionType.value == "threeColMtf" ||
      this.questionFormControl.questionType.value == "3colOptionLevelScoring"
    ) {
      if (
        this.questionFormControl.questionType.value == "3colOptionLevelScoring"
      ) {
        this.questionFormControl.totalMarks.setValue(4);
      }
      this.questionFormControl.optionsType.setValue("text");
      this.questionFormControl.optionsType.setValidators(Validators.required);
      this.addColumn1Option();
      this.addColumn2Option();
      if (
        this.questionFormControl.questionType.value == "threeColMtf" ||
        this.questionFormControl.questionType.value == "3colOptionLevelScoring"
      ) {
        this.addColumn3Option();
      }

      if (
        this.questionFormControl.questionType.value ==
        "3colOptionLevelScoring" ||
        this.questionFormControl.questionType.value == "optionLevelScoring"
      ) {

        this.questionFormControl.totalMarks.disable();
      }
      console.log(this.optionFormArray);
    }

    if (this.questionFormControl.questionType.value == "comprehension") {

      this.comprehensionQuestionArray = [];
      this.comprehensionQuestionArray.push(new ComprehensionArrayModel());
      this.cdr.detectChanges();
    }
  }

  optionChange() {
    this.submitted = false;
    if (
      this.questionFormControl.questionType.value == "objectives" ||
      this.questionFormControl.questionType.value == "mcq" ||
      this.questionFormControl.questionType.value == "optionLevelScoring" ||
      this.questionFormControl.questionType.value == "sequencingQuestion" ||
      this.questionFormControl.questionType.value == "sentenceSequencing"
    ) {
      this.removeAllOption();
      this.answerFormArray.clear();
      if (this.questionFormControl.optionsType.value == "text") {
        this.optionFormArray.controls[0].get("file_text").clearValidators();
        this.optionFormArray.controls[0]
          .get("file_text")
          .updateValueAndValidity();
      } else {
        this.optionFormArray.controls[0]
          .get("file_text")
          .setValidators([Validators.required]);
      }
    } else if (this.questionFormControl.questionType.value == "sorting") {
      this.answerFormArray.clear();
      this.removeGroupAllOption();
      this.removeSortingAllOption();
    } else if (
      this.questionFormControl.questionType.value == "twoColMtf" ||
      this.questionFormControl.questionType.value == "threeColMtf" ||
      this.questionFormControl.questionType.value == "3colOptionLevelScoring"
    ) {
      this.answerFormArray.clear();
      this.optionFormArray.clear();
      this.removeColumn1AllOption();
      this.removeColumn2AllOption();
      if (
        this.questionFormControl.questionType.value == "threeColMtf" ||
        this.questionFormControl.questionType.value == "3colOptionLevelScoring"
      ) {
        this.removeColumn3AllOption();
      }
    }
  }

  comprehensionNumericalChange(ques: ComprehensionArrayModel) {
    if (
      ques.questionType == "NumericalRange" &&
      ques.answer &&
      ques.answer[0]
    ) {
      ques.answer[0].value =
        ques.answer[0].minValue + "-" + ques.answer[0].maxValue;
    }

    ques.options = [...ques.answer];
  }

  comprehensionQuestionTypeChanged(
    event: any,
    ques: ComprehensionArrayModel,
    index: number
  ) {
    ques.optionsType = "text";
    if (
      event == "objectives" ||
      event == "mcq" ||
      event == "fillInTheBlanks" ||
      event == "optionLevelScoring"
    ) {
      ques.optionsType = "text";
      ques.options = [];
      ques.options.push(new OptionsModel());
    }

    if (event == "fillInTheBlanks") {
      ques.answer = [];
      ques.answer.push(new OptionsModel());
    }

    if (event == "NumericalRange") {
      ques.answer = [];
      ques.answer[0] = {
        minValue: 0,
        maxValue: 0,
        value: "",
      };
    }

    if (
      event == "twoColMtf" ||
      event == "threeColMtf" ||
      ques.questionType == "3colOptionLevelScoring"
    ) {
      ques.optionsType = "text";
      ques.answer = [];
      ques.options = [];
      ques.matchOptions.column1 = [];
      ques.matchOptions.column1.push(new OptionsModel());
      ques.matchOptions.column1[0].type = 1;

      ques.matchOptions.column2 = [];
      ques.matchOptions.column2.push(new OptionsModel());
      ques.matchOptions.column2[0].type = "A";

      if (
        event == "threeColMtf" ||
        ques.questionType == "3colOptionLevelScoring"
      ) {
        ques.matchOptions.column3 = [];
        ques.matchOptions.column3.push(new OptionsModel());
        ques.matchOptions.column3[0].type = "i";
      } else {
        ques.matchOptions.column3 = null;
      }
    }

    ques.optionsAdded = false;
    ques.colAdded = false;
    ques.setAns = false;

    if (
      ques.questionType == "optionLevelScoring" ||
      ques.questionType == "3colOptionLevelScoring"
    ) {
      ques.totalMarks = 4;
      this.comprehensionTotalMarksChange();
    }
    this.cdr.detectChanges();
  }

  comprehensionOptionChange(ques: ComprehensionArrayModel) {
    if (
      ques.questionType == "objectives" ||
      ques.questionType == "mcq" ||
      ques.questionType == "optionLevelScoring" ||
      ques.questionType == "twoColMtf" ||
      ques.questionType == "threeColMtf" ||
      ques.questionType == "3colOptionLevelScoring"
    ) {
      ques.options = [];
      ques.options.push(new OptionsModel());

      if (
        ques.questionType == "twoColMtf" ||
        ques.questionType == "threeColMtf" ||
        ques.questionType == "3colOptionLevelScoring"
      ) {
        ques.matchOptions = new MatchOptionsModel();
        ques.colAdded = false;
        ques.setAns = false;

        ques.matchOptions.column1 = [];
        ques.matchOptions.column2 = [];
        ques.matchOptions.column1.push(new OptionsModel());
        ques.matchOptions.column2.push(new OptionsModel());
        ques.matchOptions.column1[0].type = 1;
        ques.matchOptions.column2[0].type = "A";

        if (
          ques.questionType == "threeColMtf" ||
          ques.questionType == "3colOptionLevelScoring"
        ) {
          ques.matchOptions.column3 = [];
          ques.matchOptions.column3.push(new OptionsModel());
          ques.matchOptions.column3[0].type = "i";
        }
      } else {
        ques.matchOptions.column1 = [];
        ques.matchOptions.column2 = [];
        ques.matchOptions.column3 = [];
      }

      ques.answer = [];
      ques.answer.push(new OptionsModel());
    }
    ques.optionsAdded = false;
    ques.colAdded = false;
    ques.setAns = false;

    if (
      ques.optionsType == "optionLevelScoring" ||
      ques.optionsType == "3ColOptionLevelScoring"
    ) {
      ques.totalMarks = 4;
    }
    this.cdr.detectChanges();
  }

  comprehensionAddOption(
    ques: ComprehensionArrayModel,
    idx: number,
    col?: string
  ) {
    if (
      ques.questionType == "objectives" ||
      ques.questionType == "mcq" ||
      ques.questionType == "optionLevelScoring" ||
      (!col &&
        (ques.questionType == "twoColMtf" ||
          ques.questionType == "3colOptionLevelScoring" ||
          ques.questionType == "threeColMtf"))
    ) {
      ques.options.push(new OptionsModel());
    }

    if (col) {
      switch (col) {
        case "col1":
          if (!ques.matchOptions.column1) {
            ques.matchOptions.column1 = [];
          }
          ques.matchOptions.column1.push(new OptionsModel());
          let len = ques.matchOptions.column1.length;
          ques.matchOptions.column1[len - 1].type = len;
          break;

        case "col2":
          if (!ques.matchOptions.column2) {
            ques.matchOptions.column2 = [];
          }
          ques.matchOptions.column2.push(new OptionsModel());
          let len1 = ques.matchOptions.column2.length - 1;
          ques.matchOptions.column2[len1].type =
            this.getNextLetter(len1).toUpperCase();
          break;

        case "col3":
          if (!ques.matchOptions.column3) {
            ques.matchOptions.column3 = [];
          }
          ques.matchOptions.column3.push(new OptionsModel());
          let len2 = ques.matchOptions.column3.length;
          ques.matchOptions.column3[len2 - 1].type =
            this.integer_to_roman(len2);
          break;
      }
    }
    if (
      !(
        !col &&
        (ques.questionType == "twoColMtf" ||
          ques.questionType == "threeColMtf" ||
          ques.questionType == "3colOptionLevelScoring")
      )
    ) {
      this.comprehensionNextClicked(true, ques, idx);
    }

    if (ques.setAns) {
      ques.setAns = false;
    }

    this.pipeRefreshCount += 1;
  }

  comprehensionRemoveLastOption(
    ques: ComprehensionArrayModel,
    idx: number,
    col?: string
  ) {
    if (
      ques.questionType == "objectives" ||
      ques.questionType == "mcq" ||
      ques.questionType == "optionLevelScoring" ||
      (!col &&
        (ques.questionType == "twoColMtf" ||
          ques.questionType == "threeColMtf" ||
          ques.questionType == "3colOptionLevelScoring"))
    ) {
      let removed = ques.options.splice(-1);

      if (!ques.options?.length) {
        ques.options = [];
        ques.options.push(new OptionsModel());
      }
    }

    if (col) {
      switch (col) {
        case "col1":
          let removed = ques.matchOptions.column1.splice(-1);
          if (!ques.matchOptions.column1?.length) {
            ques.matchOptions.column1 = [];
            ques.matchOptions.column1.push(new OptionsModel());
            let len = ques.matchOptions.column1.length;
            ques.matchOptions.column1[len - 1].type = len;
          }
          break;

        case "col2":
          let removed1 = ques.matchOptions.column2.splice(-1);
          if (!ques.matchOptions.column2?.length) {
            ques.matchOptions.column2 = [];
            ques.matchOptions.column2.push(new OptionsModel());
            let len1 = ques.matchOptions.column2.length - 1;
            ques.matchOptions.column2[len1].type =
              this.getNextLetter(len1).toUpperCase();
          }
          break;

        case "col3":
          let removed2 = ques.matchOptions.column3.splice(-1);
          if (!ques.matchOptions.column3?.length) {
            ques.matchOptions.column3 = [];
            ques.matchOptions.column3.push(new OptionsModel());
            let len2 = ques.matchOptions.column3.length;
            ques.matchOptions.column3[len2 - 1].type =
              this.integer_to_roman(len2);
          }
          break;
      }
    }

    this.comprehensionNextClicked(true, ques, idx);

    this.pipeRefreshCount += 1;
  }

  comprehensionRemoveAllOption(
    ques: ComprehensionArrayModel,
    idx: number,
    col?: string
  ) {
    if (
      ques.questionType == "objectives" ||
      ques.questionType == "mcq" ||
      ques.questionType == "optionLevelScoring" ||
      (!col &&
        (ques.questionType == "twoColMtf" ||
          ques.questionType == "threeColMtf" ||
          ques.questionType == "3colOptionLevelScoring"))
    ) {
      ques.options = [];
      ques.options.push(new OptionsModel());
    }

    if (col) {
      switch (col) {
        case "col1":
          ques.matchOptions.column1 = [];
          ques.matchOptions.column1.push(new OptionsModel());
          let len = ques.matchOptions.column1.length;
          ques.matchOptions.column1[len - 1].type = len;
          break;

        case "col2":
          ques.matchOptions.column2 = [];
          ques.matchOptions.column2.push(new OptionsModel());
          let len1 = ques.matchOptions.column2.length - 1;
          ques.matchOptions.column2[len1].type =
            this.getNextLetter(len1).toUpperCase();
          break;

        case "col3":
          ques.matchOptions.column3 = [];
          ques.matchOptions.column3.push(new OptionsModel());
          let len2 = ques.matchOptions.column3.length;
          ques.matchOptions.column3[len2 - 1].type =
            this.integer_to_roman(len2);
          break;
      }
    }

    this.comprehensionNextClicked(true, ques, idx);

    this.pipeRefreshCount += 1;
  }

  comprehensionTotalMarksChange() {
    this.questionFormControl.totalMarks.setValue(
      this.comprehensionQuestionArray
        .map((m) => m.totalMarks)
        .reduce((a, b) => +a + +b, 0)
    );
  }

  compOptionChange(
    event: any,
    ques: ComprehensionArrayModel,
    idx: number,
    col?: string
  ) {
    if (!col) {
      ques.options[idx].value = event;
    } else {
      switch (col) {
        case "col1":
          ques.matchOptions.column1[idx].value = event;
          break;

        case "col2":
          ques.matchOptions.column2[idx].value = event;
          break;

        case "col3":
          ques.matchOptions.column3[idx].value = event;
          break;
      }
    }
  }

  comprehensionFillInTheBlank(
    event: any,
    ques: ComprehensionArrayModel,
    srno: number
  ) {
    ques.options[0].value = event;
    ques.answer = [];
    ques.answer.push(new OptionsModel());
    ques.answer[0].value = ques.options[0].value;

    // ques.options = [];
    // ques.options.push(new OptionsModel());
    // ques.options[0].value = ques.options[0].value;
  }

  comprehensionScoreKeyup(ques, srno) {
    let i = ques.answer.findIndex((f) => f.index == srno);
    if (i > -1) {
      console.log('ques', ques.options[srno].score);
      ques.answer[i]["score"] = ques.options[srno].score;
    }

    // ques.totalMarks =
    // ques.answer
    //     .map((m) => m.value.score)
    //     .reduce((a, b) => +a + +b, 0)
    this.pipeRefreshCount += 1;
  }

  enableComprehensionNextBtn(
    ques: ComprehensionArrayModel,
    idx: number,
    col?: boolean
  ): boolean {
    if (
      ques.questionType == "objectives" ||
      ques.questionType == "mcq" ||
      ques.questionType == "optionLevelScoring"
    ) {
      if (!ques.options || ques.options.length < 2) {
        return false;
      }
      if (ques.optionsType == "text") {
        for (let item of ques.options) {
          if (!item.value?.trim()) {
            return false;
          }
        }
        return true;
      } else {
        for (let item of ques.options) {
          if (!item.value || !item.file_text) {
            return false;
          }
        }
        return true;
      }
    } else if (
      (ques.questionType == "twoColMtf" ||
        ques.questionType == "threeColMtf" ||
        ques.questionType == "3colOptionLevelScoring") &&
      col &&
      ques.matchOptions.column1 &&
      ques.matchOptions.column2
    ) {
      for (let item of ques.matchOptions.column1) {
        if (ques.optionsType == "text") {
          if (!item.value?.trim()) {
            return false;
          }
        } else {
          if (!item.value || !item.file_text) {
            return false;
          }
        }
      }

      for (let item of ques.matchOptions.column2) {
        if (ques.optionsType == "text") {
          if (!item.value?.trim()) {
            return false;
          }
        } else {
          if (!item.value || !item.file_text) {
            return false;
          }
        }
      }

      if (
        (ques.questionType == "threeColMtf" ||
          ques.questionType == "3colOptionLevelScoring") &&
        ques.matchOptions.column3
      ) {
        for (let item of ques.matchOptions.column3) {
          if (ques.optionsType == "text") {
            if (!item.value?.trim()) {
              return false;
            }
          } else {
            if (!item.value || !item.file_text) {
              return false;
            }
          }
        }
      }

      return true;
    } else if (
      (ques.questionType == "twoColMtf" ||
        ques.questionType == "threeColMtf" ||
        ques.questionType == "3colOptionLevelScoring") &&
      !col
    ) {
      if (!ques.options || !ques.options.length) {
        return false;
      }
      for (let item of ques.options) {
        if (!item.value) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  comprehensionNextClicked(
    addOpt: boolean,
    ques: ComprehensionArrayModel,
    idx: number,
    col?: boolean
  ) {
    if (
      ques.questionType == "objectives" ||
      ques.questionType == "mcq" ||
      ques.questionType == "optionLevelScoring"
    ) {
      if (ques.optionsType !== "text" && !addOpt) {
        this.isLoader = true;
        let increment = 0;
        // for (let data of ques.options) {
        //   const formData = new FormData();
        //   formData.append("file", data.value);
        //   if (typeof data.value == "object") {
        //     this.apiService.uploadFile(formData).subscribe((response: any) => {
        //       ques.images[increment - 1]
        //         ? (ques.images[increment - 1] = response.body.message)
        //         : null;
        //       increment++;
        //       data.value = response.body.message;
        //       if (increment == ques.options.length) {
        //         this.submitted = true;
        //         this.isLoader = false;

        //         // ques.images = [];
        //       }
        //       this.cdr.detectChanges();
        //     });
        //   } else {
        //     increment++;
        //     if (increment == ques.options.length) {
        //       this.submitted = true;
        //       this.isLoader = false;

        //       // ques.images = [];
        //     }
        //   }
        // }
      }
    }

    if (col) {
      ques.optionsAdded = this.enableComprehensionNextBtn(ques, idx, true);
    } else {
      ques.optionsAdded = this.enableComprehensionNextBtn(ques, idx);
    }
    if (
      (ques.questionType == "twoColMtf" ||
        ques.questionType == "threeColMtf" ||
        ques.questionType == "3colOptionLevelScoring") &&
      col
    ) {
      ques.colAdded = true;
      ques.options = [];
      ques.options.push(new OptionsModel());

      this.isLoader = true;
      let increment = 0;
      // if (ques.colImages.column1 && ques.colImages.column1.length) {
      //   for (let data of ques.colImages.column1) {
      //     if (typeof data.value == "object") {
      //       const formData = new FormData();
      //       formData.append("file", data.value);
      //       this.apiService.uploadFile(formData).subscribe((response: any) => {
      //         ques.colImages.column1[increment - 1]
      //           ? (ques.colImages.column1[increment - 1] =
      //               response.body.message)
      //           : null;
      //         increment++;
      //         data.value = response.body.message;
      //         if (increment == ques.options.length) {
      //           this.submitted = true;
      //           this.isLoader = false;

      //           // ques.colImages.column1 = [];
      //         }
      //         this.cdr.detectChanges();
      //       });
      //     } else {
      //       increment++;
      //       if (increment == ques.colImages.column1.length) {
      //         this.submitted = true;
      //         this.isLoader = false;

      //         // ques.colImages.column1 = [];
      //       }
      //     }
      //   }
      // }

      this.isLoader = true;
      increment = 0;
      // if (ques.colImages.column2 && ques.colImages.column2.length) {
      //   for (let data of ques.colImages.column2) {
      //     if (typeof data.value == "object") {
      //       const formData = new FormData();
      //       formData.append("file", data.value);
      //       this.apiService.uploadFile(formData).subscribe((response: any) => {
      //         ques.colImages.column2[increment - 1]
      //           ? (ques.colImages.column2[increment - 1] =
      //               response.body.message)
      //           : null;
      //         increment++;
      //         data.value = response.body.message;
      //         if (increment == ques.options.length) {
      //           this.submitted = true;
      //           this.isLoader = false;

      //           // ques.colImages.column2 = [];
      //         }
      //         this.cdr.detectChanges();
      //       });
      //     } else {
      //       increment++;
      //       if (increment == ques.colImages.column2.length) {
      //         this.submitted = true;
      //         this.isLoader = false;

      //         // ques.colImages.column2 = [];
      //       }
      //     }
      //   }
      // }

      this.isLoader = true;
      increment = 0;
      // if (ques.colImages.column3 && ques.colImages.column3.length) {
      //   for (let data of ques.colImages.column3) {
      //     if (typeof data.value == "object") {
      //       const formData = new FormData();
      //       formData.append("file", data.value);
      //       this.apiService.uploadFile(formData).subscribe((response: any) => {
      //         ques.colImages.column3[increment - 1]
      //           ? (ques.colImages.column3[increment - 1] =
      //               response.body.message)
      //           : null;
      //         increment++;
      //         data.value = response.body.message;
      //         if (increment == ques.options.length) {
      //           this.submitted = true;
      //           this.isLoader = false;

      //           // ques.colImages.column3 = [];
      //         }
      //         this.cdr.detectChanges();
      //       });
      //     } else {
      //       increment++;
      //       if (increment == ques.colImages.column3.length) {
      //         this.submitted = true;
      //         this.isLoader = false;

      //         // ques.colImages.column3 = [];
      //       }
      //     }
      //   }
      // }
    } else {
      // ques.colAdded = false;
    }

    if (
      (ques.questionType == "twoColMtf" ||
        ques.questionType == "threeColMtf" ||
        ques.questionType == "3colOptionLevelScoring") &&
      !col
    ) {
      ques.setAns = true;
    }
  }

  isComprehensionCheckbox(ques, item) {
    return ques.answer.findIndex((f) => f.value == item.value) > -1;
  }

  addCompQuestion() {
    this.comprehensionQuestionArray.push(new ComprehensionArrayModel());
  }

  removeComprehensionElement(idx) {
    this.comprehensionQuestionArray.splice(idx, 1);
    if (
      !this.comprehensionQuestionArray ||
      !this.comprehensionQuestionArray.length
    ) {
      this.comprehensionQuestionArray.push(new ComprehensionArrayModel());
    }
  }

  comprehensionAnsSelected(
    value: string,
    ques: ComprehensionArrayModel,
    idx: number,
    event?
  ) {
    if (ques.questionType == "trueOrFalse") {
      ques.answer = [];
      ques.answer[0] = value;
    } else if (
      ques.questionType == "optionLevelScoring" ||
      (ques.questionType == "3colOptionLevelScoring" && event)
    ) {
      ques.options[idx].disabled = !event.target.checked;
      if (ques.options[idx].disabled) {
        ques.options[idx].score = null;
      }

      if (event.target.checked) {
        let idx1 = ques.answer.findIndex((f) => f.index == idx);
        if (idx1 == -1) {
          ques.answer.push({ ...ques.options[idx] });
          ques.answer[ques.answer.length - 1]["index"] = idx;
        } else {
          ques.answer[idx1].value = value;
        }
      } else {
        ques.answer = ques.answer.filter((f) => f.index != idx);

        this.pipeRefreshCount += 1;
      }
    } else if (ques.questionType == "mcq") {
      const idx1 = ques.answer.findIndex((f) => f.value == value);
      if (idx1 > -1) {
        ques.answer[idx1].value = value;
      } else {
        ques.answer.push(new OptionsModel());
        ques.answer[ques.answer.length - 1].value = value;
      }
    } else {
      ques.answer = [];
      ques.answer.push(new OptionsModel());
      ques.answer[0].value = value;
    }
  }

  optionValueChanged(ev, i) {
    this.optionFormArray.controls[i].get("value").setValue(ev);
    this.optionFormArray.controls[i].get("value").markAsTouched();
    this.images = [];
    this.submitted = false;
    this.answerFormArray.clear();
  }
  getSchoolBoards() {
    this.apiService.getSchoolBoards().subscribe((response: any) => {
      this.SchoolBoards = response.body.data;

      // this.boards = response.body.data.board;
      this.cdr.detectChanges();
    });
  }
  // onFileChanged
  onFileChanged(event: any, i: any) {
    this.optionFormArray.controls[i]
      .get("value")
      .setValue(event.target.files[0]);
    this.submitted = false;
    this.getImage(i);
    this.answerFormArray.clear();
  }

  onComprehensionFileChanged(event, ques, srno, col?: string) {
    if (col) {
      switch (col) {
        case "col1":
          ques.matchOptions.column1[srno].value = event.target.files[0];

          const formData = new FormData();
          formData.append("file", ques.matchOptions.column1[srno].value);
          this.apiService
            .uploadFile(formData)
            .subscribe((response: any) => {
              ques.matchOptions.column1[srno].value = response.body.message;
              this.cdr.detectChanges();
            });
          // var reader = new FileReader();
          // reader.readAsDataURL(ques.matchOptions.column1[srno].value);
          // reader.onload = (_event) => {
          //   if (!ques.colImages.column1) {
          //     ques.colImages.column1 = [];
          //   }
          //   ques.colImages.column1[srno] =
          //     this.domSanitizer.bypassSecurityTrustUrl(<any>reader.result);
          //   this.cdr.detectChanges();
          // };
          break;

        case "col2":
          ques.matchOptions.column2[srno].value = event.target.files[0];

          const formData1 = new FormData();
          formData1.append("file", ques.matchOptions.column2[srno].value);
          this.apiService
            .uploadFile(formData1)
            .subscribe((response: any) => {
              ques.matchOptions.column2[srno].value = response.body.message;
              this.cdr.detectChanges();
            });
          // var reader = new FileReader();
          // reader.readAsDataURL(ques.matchOptions.column2[srno].value);
          // reader.onload = (_event) => {
          //   if (!ques.colImages.column2) {
          //     ques.colImages.column2 = [];
          //   }
          //   ques.colImages.column2[srno] =
          //     this.domSanitizer.bypassSecurityTrustUrl(<any>reader.result);
          //   this.cdr.detectChanges();
          // };
          break;

        case "col3":
          ques.matchOptions.column3[srno].value = event.target.files[0];

          const formData2 = new FormData();
          formData2.append("file", ques.matchOptions.column3[srno].value);
          this.apiService
            .uploadFile(formData2)
            .subscribe((response: any) => {
              ques.matchOptions.column3[srno].value = response.body.message;
              this.cdr.detectChanges();
            });
          // var reader = new FileReader();
          // reader.readAsDataURL(ques.matchOptions.column3[srno].value);
          // reader.onload = (_event) => {
          //   if (!ques.colImages.column3) {
          //     ques.colImages.column3 = [];
          //   }
          //   ques.colImages.column3[srno] =
          //     this.domSanitizer.bypassSecurityTrustUrl(<any>reader.result);
          //   this.cdr.detectChanges();
          // };
          break;
      }
    } else {
      ques.options[srno].value = event.target.files[0];

      const formData1 = new FormData();
      formData1.append("file", ques.options[srno].value);
      this.apiService
        .uploadFile(formData1)
        .subscribe((response: any) => {
          ques.options[srno].value = response.body.message;
          this.cdr.detectChanges();
        });
      // var reader = new FileReader();
      // reader.readAsDataURL(ques.options[srno].value);
      // reader.onload = (_event) => {
      //   if (!ques.images) {
      //     ques.images = [];
      //   }
      //   ques.images[srno] = this.domSanitizer.bypassSecurityTrustUrl(
      //     <any>reader.result
      //   );
      //   this.cdr.detectChanges();
      //   // console.log(this.images);
      // };
    }
  }

  getImage(i) {
    var reader = new FileReader();
    reader.readAsDataURL(this.optionFormArray.controls[i].get("value").value);
    reader.onload = (_event) => {
      this.images[i] = this.domSanitizer.bypassSecurityTrustUrl(
        <any>reader.result
      );
      this.cdr.detectChanges();
      console.log(this.images);
    };
  }

  addOption() {
    if (this.questionFormControl.questionType.value == "optionLevelScoring") {
      this.addOptionOptionalScoring('optionLevelScoring');
    } else {
      this.optionFormArray.push(
        this.formBuilder.group({
          value: ["", Validators.required],
          file_text: [
            "",
            this.questionFormControl.optionsType.value !== "text"
              ? Validators.required
              : "",
          ],
        })
      );
    }
    this.submitted = false;
    this.answerFormArray.clear();
  }

  addOptionOptionalScoring(flag?) {
    /* if(flag === "optionLevelScoring"){
      this.optionFormArray.push(
        this.formBuilder.group({
          value: ["", Validators.required],
          file_text: [
            "",
            this.questionFormControl.optionsType.value !== "text"
              ? Validators.required
              : "",
          ],
          isDisable: [true],
          score: this.Totalmarks ? this.Totalmarks : 0,
        })
      );
    }else{
      this.optionFormArray.push(
        this.formBuilder.group({
          value: ["", Validators.required],
          file_text: [
            "",
            this.questionFormControl.optionsType.value !== "text"
              ? Validators.required
              : "",
          ],
          isDisable: [true],
          score: [0],
        })
      );
    }
     */

    // Need to Take Option Level & 3 Column Option Level scores
    // and add those values to score
    this.optionFormArray.push(
      this.formBuilder.group({
        value: ["", Validators.required],
        file_text: [
          "",
          this.questionFormControl.optionsType.value !== "text"
            ? Validators.required
            : "",
        ],
        isDisable: [true],
        score: [0],
      })
    );

    // this.optionFormArray.controls[this.optionFormArray.length -1].get('score').setValidators([Validators.required,Validators.minLength(2)])
    console.log("this.optionFormArray", this.optionFormArray.invalid);
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeLastOption() {
    this.optionFormArray.removeAt(this.optionFormArray.length - 1);
    if (this.questionFormControl.optionsType.value !== "text") {
      this.images.pop();
    }
    if (this.optionFormArray.length <= 0) {
      this.addOption();
    }
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeAllOption() {
    this.optionFormArray.clear();
    this.addOption();
    this.submitted = false;
    this.answerFormArray.clear();
  }

  submitFillBlanksQuestion(event, i) {
    if (this.questionFormControl.questionType.value == "fillInTheBlanks") {
      this.optionFormArray.controls[i].get("value").setValue(event);
      this.answerFormArray.controls = [];
      this.answerFormArray.push(
        this.formBuilder.control({
          value: event,
          file_text: "",
        })
      );
    }
  }

  submitoptions() {
    this.loaderService.show();
    let increment = 0;
    this.isLoader = true;
    if (this.questionFormControl.questionType.value == "objectives") {
      this.answerFormArray.controls = [];
      this.answerFormArray.push(
        this.formBuilder.control({
          value: "",
          file_text: "",
        })
      );
    } else if (
      this.questionFormControl.questionType.value == "sequencingQuestion" ||
      this.questionFormControl.questionType.value == "sentenceSequencing"
    ) {
      // for (let index = 0; index < this.optionFormArray.length; index++) {
      //   this.answerFormArray.push(this.formBuilder.control({
      //     value: '',
      //     file_text: ''
      //   }))
      // }
      this.answerFormArray.controls = [];
      this.answerFormArray.push(
        this.formBuilder.control({
          value: "",
          file_text: "",
        })
      );
    } else if (
      this.questionFormControl.questionType.value == "optionLevelScoring"
    ) {
      // this.answerFormArray.push(this.formBuilder.control({
      //   value: '',
      //   file_text: '',
      //   score: '',
      // }))
    }
    for (let index = 0; index < this.optionFormArray.length; index++) {
      if (this.questionaryForm.get("optionsType").value != "text") {
        const formData = new FormData();
        formData.append(
          "file",
          this.optionFormArray.controls[index].get("value").value
        );
        this.apiService.uploadFile(formData).subscribe((response: any) => {
          console.log(response.body.message);
          increment++;
          this.optionFormArray.controls[index]
            .get("value")
            .setValue(response.body.message);
          if (increment == this.optionFormArray.length) {
            this.submitted = true;
            this.isLoader = false;
          }
          if (
            this.questionFormControl.questionType.value == "objectives" ||
            this.questionFormControl.questionType.value ==
            "sentenceSequencing" ||
            this.questionFormControl.questionType.value == "sequencingQuestion"
          ) {
            this.questionaryForm.setErrors({ status: "INVALID" });
          }
          this.cdr.detectChanges();
        });
        console.log(this.optionFormArray.value);
      } else {
        this.submitted = true;
        setTimeout(() => {
          if (
            this.questionFormControl.questionType.value == "objectives" ||
            this.questionFormControl.questionType.value ==
            "sentenceSequencing" ||
            this.questionFormControl.questionType.value == "sequencingQuestion"
          ) {
            this.questionaryForm.setErrors({ status: "INVALID" });
          }
          var el = document.getElementById("mathOptId" + index);
          if (el) {
            el.innerHTML =
              this.optionFormArray.controls[index].get("value").value;
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
          }
          increment++;
          console.log("in loader");
          if (increment == this.optionFormArray.length) {
            console.log("in loader");
            this.isLoader = false;
          }
        }, 10);
      }
    }
    this.loaderService.hide();
  }

  objectiveAnswerChange(option) {
    this.answerFormArray.at(0).patchValue(option.value);
    if (
      this.questionFormControl.questionType.value == "objectives" ||
      this.questionFormControl.questionType.value == "fillInTheBlanks"
    ) {
      this.questionaryForm.setErrors({ status: "VALID" });
    }
    this.submitted = true;
  }

  onAnswerChange(event, j) {
    if (event.checked) {
      this.answerFormArray.push(new FormControl(event.source.value));
      this.optionFormArray.controls.forEach((e) => {
        console.log('Options', e.value.value)
      })

      console.log('Answer', event.source._uniqueId)
      if (
        this.questionFormControl.questionType.value == "optionLevelScoring" ||
        this.questionFormControl.questionType.value == "3colOptionLevelScoring"
      ) {
        this.optionFormArray.controls[j].get("isDisable").setValue(false);
        this.optionFormArray.controls[j]
          .get("score")
          .setValidators(Validators.required);
        console.log('Answer Changed Event', event.source.value["score"])
        if (!event.source.value["score"]) {
          this.optionFormArray.controls[j].get("score").setValue("");
        }
        this.optionFormArray.controls[j].get("score").updateValueAndValidity();
      }
    } else if (event.checked == undefined) {
      if (
        this.questionFormControl.questionType.value == "optionLevelScoring" ||
        this.questionFormControl.questionType.value == "3colOptionLevelScoring"
      ) {
        const i = this.answerFormArray.controls.findIndex(
          (x) => x.value === event?.source?.value
        );
        if (i > -1) {
          this.answerFormArray[i]["score"] = event.target.value;
        }
      }
    } else {
      if (
        this.questionFormControl.questionType.value == "optionLevelScoring" ||
        this.questionFormControl.questionType.value == "3colOptionLevelScoring"
      ) {
        if (event?.source?.value) {
          event.source.value["isDisable"] = true;
        }
        this.optionFormArray.controls[j].get("score").clearValidators();
        this.optionFormArray.controls[j].get("isDisable").setValue(true);
        this.optionFormArray.controls[j].get("score").setValue("");
        this.optionFormArray.controls[j].get("score").updateValueAndValidity();
        this.cdr.detectChanges();
      }
      const i = this.answerFormArray.controls.findIndex(
        (x) => x.value === event?.source?.value
      );
      this.answerFormArray.removeAt(i);
    }
  }

  optionInputChanged($event, j) {

    console.log('levent', $event)
    console.log('OptionsForm', this.optionFormArray)
    console.log('AnswerForm', this.answerFormArray)





    console.log('Ae Form', this.questionaryForm.value)

    console.log("Option", $event.path[4].id)
    if ($event?.target?.value) {
      if ($event.target.value != "0") {
        this.optionFormArray.controls[j]
          .get("score")
          .setValue($event.target.value);
        this.answerFormArray.value.forEach((ele: any) => {
          if (ele.value == this.optionFormArray.controls[j]
            .value.value) {
            ele.score = parseInt($event.target.value);
            console.log('tyu', ele.score)
          }
        })

      } else {
        if (!this.optionFormArray.controls[j].get("isDisable").value) {
          this.optionFormArray.controls[j]
            .get("score")
            .setValidators(Validators.required);
          this.optionFormArray.controls[j]
            .get("score")
            .updateValueAndValidity();
        }
        this.optionFormArray.controls[j].get("score").setValue("");
      }
    } else if (!$event?.target?.value) {
      if (!this.optionFormArray.controls[j].get("isDisable").value) {
        this.optionFormArray.controls[j]
          .get("score")
          .setValidators(Validators.required);
        this.optionFormArray.controls[j].get("score").updateValueAndValidity();
      }
      this.optionFormArray.controls[j].get("score").setValue("");
    }

    let total = 0;
    this.optionFormArray.controls.forEach((e) => {
      let val = e.get("score")?.value;
      if (val && !e.get("isDisable")?.value) {
        total += typeof val == "string" ? Number(val) : val;
      }
    });


    this.Totalmarks = total;
    console.log("Total marks:", total);
    console.log("Total marks 3:", this.Totalmarks);

  }

  getfillInBlanks() {
    return (
      (this.questionFormControl.question.value &&
        this.questionFormControl.question.value.match(/{?}/g)) ||
      []
    ).length;
  }

  getBlankAnswers() {
    let len = (this.questionFormControl.question.value.match(/{?}/g) || [])
      .length;
    for (let index = 0; index < len; index++) {
      this.answerFormArray.push(
        this.formBuilder.group({
          value: ["", Validators.required],
        })
      );
    }
    this.submitted = true;
  }

  fillAnswerChanged(ev, i) {
    this.answerFormArray.controls[i].get("value").setValue(ev);
  }

  sequenceAnswerChanged(i, val) {
    console.log(this.answerFormArray.controls[i].value);
    setTimeout(() => {
      var el = document.getElementById("mathAnsId" + i);
      el.innerHTML = val;
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
    }, 0);
  }

  submitNumericOption() {
    this.submitted = true;
  }

  sortingOptionchanged(ev, i) {
    this.sortingOptionArray.controls[i].get("value").setValue(ev);
    this.cdr.detectChanges();
  }

  onFileSortingChanged(event: any, i: any) {
    this.sortingOptionArray.controls[i]
      .get("value")
      .setValue(event.target.files[0]);
    this.submitted = false;
    this.getSortingImage(i);
    this.answerFormArray.clear();
  }

  getSortingImage(i) {
    var reader = new FileReader();
    reader.readAsDataURL(
      this.sortingOptionArray.controls[i].get("value").value
    );
    reader.onload = (_event) => {
      this.optionImages[i] = this.domSanitizer.bypassSecurityTrustUrl(
        <any>reader.result
      );
      this.cdr.detectChanges();
      console.log(this.images);
    };
  }
  addSortingOption() {
    this.sortingOptionArray.push(
      this.formBuilder.group({
        value: ["", Validators.required],
        file_text: [
          "",
          this.questionFormControl.optionsType.value !== "text"
            ? Validators.required
            : "",
        ],
      })
    );
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeSortingLastOption() {
    this.sortingOptionArray.removeAt(this.sortingOptionArray.length - 1);
    if (this.questionFormControl.optionsType.value !== "text") {
      this.images.pop();
    }
    if (this.sortingOptionArray.length <= 0) {
      this.addSortingOption();
    }
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeSortingAllOption() {
    this.sortingOptionArray.clear();
    this.addSortingOption();
    this.submitted = false;
    this.answerFormArray.clear();
  }

  sortingGroupOptionchanged(ev, i) {
    this.groupsArray.controls[i].get("value").setValue(ev);
  }

  onFileSortingGroupChanged(event: any, i: any) {
    this.groupsArray.controls[i].get("value").setValue(event.target.files[0]);
    this.submitted = false;
    this.getGroupImage(i);
    this.answerFormArray.clear();
  }

  getGroupImage(i) {
    var reader = new FileReader();
    reader.readAsDataURL(this.groupsArray.controls[i].get("value").value);
    reader.onload = (_event) => {
      this.groupImages[i] = this.domSanitizer.bypassSecurityTrustUrl(
        <any>reader.result
      );
      this.cdr.detectChanges();
      console.log(this.images);
    };
  }

  addGroupOption() {
    this.groupsArray.push(
      this.formBuilder.group({
        value: ["", Validators.required],
        file_text: [
          "",
          this.questionFormControl.optionsType.value !== "text"
            ? Validators.required
            : "",
        ],
      })
    );
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeGroupLastOption() {
    this.groupsArray.removeAt(this.groupsArray.length - 1);
    if (this.questionFormControl.optionsType.value !== "text") {
      this.images.pop();
    }
    if (this.groupsArray.length <= 0) {
      this.addGroupOption();
    }
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeGroupAllOption() {
    this.groupsArray.clear();
    this.addGroupOption();
    this.submitted = false;
    this.answerFormArray.clear();
  }

  submitSortingOption() {
    this.answerFormArray.clear();
    let increment = 0;

    this.isLoader = true;
    for (let index = 0; index < this.groupsArray.length; index++) {
      this.answerFormArray.push(
        this.formBuilder.control("", Validators.required)
      );
      if (this.questionaryForm.get("optionsType").value != "text") {
        const formData = new FormData();
        formData.append(
          "file",
          this.groupsArray.controls[index].get("value").value
        );
        this.apiService.uploadFile(formData).subscribe((response: any) => {
          console.log(response.body.message);
          increment++;
          console.log("loader ");

          this.groupsArray.controls[index]
            .get("value")
            .setValue(response.body.message);
          if (
            increment ==
            this.groupsArray.length + this.sortingOptionArray.length
          ) {
            console.log("loader true");
            this.isLoader = false;
            this.submitted = true;
          }
        });
      } else {
        increment++;
        console.log("loader ");

        if (
          increment ==
          this.groupsArray.length + this.sortingOptionArray.length
        ) {
          console.log("loader true");

          this.isLoader = false;
          this.submitted = true;
        }
      }
    }
    for (let index = 0; index < this.sortingOptionArray.length; index++) {
      if (this.questionaryForm.get("optionsType").value != "text") {
        const formData = new FormData();
        formData.append(
          "file",
          this.sortingOptionArray.controls[index].get("value").value
        );
        this.apiService.uploadFile(formData).subscribe((response: any) => {
          console.log(response.body.message);
          increment++;
          this.sortingOptionArray.controls[index]
            .get("value")
            .setValue(response.body.message);
          console.log("loader ");

          if (
            increment ==
            this.groupsArray.length + this.sortingOptionArray.length
          ) {
            console.log("loader true");

            this.isLoader = false;
            this.submitted = true;
          }
        });
      } else {
        increment++;
        console.log("loader ");

        if (
          increment ==
          this.groupsArray.length + this.sortingOptionArray.length
        ) {
          console.log("loader true");

          this.isLoader = false;
          this.submitted = true;
        }
      }
    }
  }

/*   freeAnswerchanged(ev) {
    console.log(ev);
    this.answerFormArray.controls[0].setValue(ev);
  }
 */
  checkColumnValidation(option, i, value) {
    switch (value) {
      case "col1":
        if (this.column1Array.controls[i].get("file_text")) {
          this.column1Array.controls[i].get("value").clearValidators();
          this.column1Array.controls[i].get("value").updateValueAndValidity();
        } else {
          this.column1Array.controls[i]
            .get("value")
            .setValidators([Validators.required]);
          this.column1Array.controls[i].get("value").updateValueAndValidity();
        }
        break;

      case "col2":
        if (this.column2Array.controls[i].get("file_text")) {
          this.column2Array.controls[i].get("value").clearValidators();
          this.column2Array.controls[i].get("value").updateValueAndValidity();
        } else {
          this.column2Array.controls[i]
            .get("value")
            .setValidators([Validators.required]);
          this.column2Array.controls[i].get("value").updateValueAndValidity();
        }
        break;

      case "col3":
        if (this.column3Array.controls[i].get("file_text")) {
          this.column3Array.controls[i].get("value").clearValidators();
          this.column3Array.controls[i].get("value").updateValueAndValidity();
        } else {
          this.column3Array.controls[i]
            .get("value")
            .setValidators([Validators.required]);
          this.column3Array.controls[i].get("value").updateValueAndValidity();
        }
        break;
    }
  }

  column1Optionchanged(ev, i) {
    this.column1Array.controls[i].get("value").setValue(ev);
    this.column1Images = [];
    this.matchSubmitted = false;
    this.submitted = false;
    this.answerFormArray.clear();
    this.optionFormArray.clear();
  }

  onFileColumn1Changed(event: any, i: any) {
    this.column1Array.controls[i].get("value").setValue(event.target.files[0]);
    this.submitted = false;
    this.matchSubmitted = false;
    this.getColumn1Image(i);
    if (this.column1Array.controls[i].get("value")) {
      this.column1Array.controls[i].get("file_text").clearValidators();
      this.column1Array.controls[i].get("file_text").updateValueAndValidity();
    }
    this.optionFormArray.clear();
    this.answerFormArray.clear();
  }

  getColumn1Image(i) {
    var reader = new FileReader();
    reader.readAsDataURL(this.column1Array.controls[i].get("value").value);
    reader.onload = (_event) => {
      this.column1Images[i] = this.domSanitizer.bypassSecurityTrustUrl(
        <any>reader.result
      );
      this.cdr.detectChanges();
      console.log(this.images);
    };
  }

  addColumn1Option() {
    this.column1Array.push(
      this.formBuilder.group({
        type: [""],
        value: ["", Validators.required],
        file_text: [
          "",
          this.questionFormControl.optionsType.value !== "text"
            ? Validators.required
            : "",
        ],
      })
    );
    this.matchSubmitted = false;
    this.submitted = false;
    // console.log("column 1 array",this.column1Array.value)
    // console.log("col form control",this.questionaryForm.controls['matchOptions'].get('column1').value)
    // console.log("col form control file text",this.questionaryForm.controls['matchOptions'].get('column1').get('file_text').value)
    // console.log("col form control valueeee",this.questionaryForm.controls['matchOptions'].get('column1').get('value').value)
    this.answerFormArray.clear();
  }

  removeColumn1LastOption() {
    this.column1Array.removeAt(this.column1Array.length - 1);
    if (this.questionFormControl.optionsType.value !== "text") {
      this.images.pop();
    }
    if (this.column1Array.length <= 0) {
      this.addColumn1Option();
    }
    this.matchSubmitted = false;
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeColumn1AllOption() {
    this.column1Array.clear();
    this.addColumn1Option();
    this.submitted = false;
    this.matchSubmitted = false;
    this.answerFormArray.clear();
  }

  column2Optionchanged(ev, i) {
    this.column2Array.controls[i].get("value").setValue(ev);
    this.column2Images = [];
    this.matchSubmitted = false;
    this.submitted = false;
    this.answerFormArray.clear();
    this.optionFormArray.clear();
  }

  onFileColumn2Changed(event: any, i: any) {
    this.column2Array.controls[i].get("value").setValue(event.target.files[0]);
    this.submitted = false;
    this.matchSubmitted = false;
    this.getColumn2Image(i);
    if (this.column2Array.controls[i].get("value")) {
      this.column2Array.controls[i].get("file_text").clearValidators();
      this.column2Array.controls[i].get("file_text").updateValueAndValidity();
    }
    this.answerFormArray.clear();
    this.optionFormArray.clear();
  }

  getColumn2Image(i) {
    var reader = new FileReader();
    reader.readAsDataURL(this.column2Array.controls[i].get("value").value);
    reader.onload = (_event) => {
      this.column2Images[i] = this.domSanitizer.bypassSecurityTrustUrl(
        <any>reader.result
      );
      this.cdr.detectChanges();
      console.log(this.images);
    };
  }

  addColumn2Option() {
    this.column2Array.push(
      this.formBuilder.group({
        type: [""],
        value: ["", Validators.required],
        file_text: [
          "",
          this.questionFormControl.optionsType.value !== "text"
            ? Validators.required
            : "",
        ],
      })
    );
    this.matchSubmitted = false;
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeColumn2LastOption() {
    this.column2Array.removeAt(this.column2Array.length - 1);
    if (this.questionFormControl.optionsType.value !== "text") {
      this.images.pop();
    }
    if (this.column2Array.length <= 0) {
      this.addColumn2Option();
    }
    this.matchSubmitted = false;
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeColumn2AllOption() {
    this.loaderService.show();
    this.column2Array.clear();
    this.addColumn2Option();
    this.submitted = false;
    this.matchSubmitted = false;
    this.answerFormArray.clear();
    this.loaderService.hide();
  }

  column3Optionchanged(ev, i) {
    this.loaderService.show();
    this.column3Array.controls[i].get("value").setValue(ev);
    this.column2Images = [];
    this.matchSubmitted = false;
    this.submitted = false;
    this.answerFormArray.clear();
    this.optionFormArray.clear();
    this.loaderService.hide();
  }

  onFileColumn3Changed(event: any, i: any) {
    this.loaderService.show();
    this.column3Array.controls[i].get("value").setValue(event.target.files[0]);
    this.submitted = false;
    this.matchSubmitted = false;
    this.getColumn3Image(i);
    if (this.column3Array.controls[i].get("value")) {
      this.column3Array.controls[i].get("file_text").clearValidators();
      this.column3Array.controls[i].get("file_text").updateValueAndValidity();
    }
    this.answerFormArray.clear();
    this.optionFormArray.clear();
    this.loaderService.hide();
  }

  getColumn3Image(i) {
    this.loaderService.show();
    var reader = new FileReader();
    reader.readAsDataURL(this.column3Array.controls[i].get("value").value);
    reader.onload = (_event) => {
      this.column3Images[i] = this.domSanitizer.bypassSecurityTrustUrl(
        <any>reader.result
      );
      this.cdr.detectChanges();
      console.log(this.images);
    };
    this.loaderService.hide();
  }

  addColumn3Option() {
    this.loaderService.show();
    this.column3Array.push(
      this.formBuilder.group({
        type: [""],
        value: ["", Validators.required],
        file_text: [
          "",
          this.questionFormControl.optionsType.value !== "text"
            ? Validators.required
            : "",
        ],
      })
    );
    this.matchSubmitted = false;
    this.submitted = false;
    this.answerFormArray.clear();
    this.loaderService.hide();
  }

  removeColumn3LastOption() {
    this.loaderService.show();
    this.column3Array.removeAt(this.column3Array.length - 1);
    if (this.questionFormControl.optionsType.value !== "text") {
      this.images.pop();
    }
    if (this.column3Array.length <= 0) {
      this.addColumn3Option();
    }
    this.matchSubmitted = false;
    this.submitted = false;
    this.answerFormArray.clear();
    this.loaderService.hide();
  }

  removeColumn3AllOption() {
    this.loaderService.show();
    this.column3Array.clear();
    this.addColumn3Option();
    this.submitted = false;
    this.matchSubmitted = false;
    this.answerFormArray.clear();
    this.loaderService.hide();
  }

  submitMatchOptions() {
    this.answerFormArray.clear();
    this.optionFormArray.clear();
    let increment = 0;
    this.isLoader = true;
    for (let index = 0; index < this.column1Array.length; index++) {
      this.column1Array.controls[index].get("type").setValue(index + 1);
      if (this.questionaryForm.get("optionsType").value != "text") {
        const formData = new FormData();
        if (this.column1Array.controls[index].get("value").value) {
          formData.append(
            "file",
            this.column1Array.controls[index].get("value").value
          );
          this.apiService.uploadFile(formData).subscribe((response: any) => {
            console.log(response.body.message);
            increment++;
            console.log("loader ");

            this.column1Array.controls[index]
              .get("value")
              .setValue(response.body.message);
            if (
              increment ==
              this.column1Array.length +
              this.column2Array.length +
              this.column3Array.length
            ) {
              console.log("loader true");
              this.isLoader = false;
              this.matchSubmitted = true;
            }
          });
        }
        this.isLoader = false;
        this.matchSubmitted = true;
      } else {
        increment++;
        console.log("loader ");
        if (
          increment ==
          this.column1Array.length +
          this.column2Array.length +
          this.column3Array.length
        ) {
          console.log("loader true");
          this.isLoader = false;
          this.matchSubmitted = true;
        }
      }
    }
    for (let index = 0; index < this.column2Array.length; index++) {
      this.column2Array.controls[index]
        .get("type")
        .setValue(this.getNextLetter(index).toUpperCase());
      if (this.questionaryForm.get("optionsType").value != "text") {
        if (this.column2Array.controls[index].get("value").value) {
          const formData = new FormData();
          formData.append(
            "file",
            this.column2Array.controls[index].get("value").value
          );
          this.apiService.uploadFile(formData).subscribe((response: any) => {
            console.log(response.body.message);
            increment++;
            console.log("loader ");

            this.column2Array.controls[index]
              .get("value")
              .setValue(response.body.message);
            if (
              increment ==
              this.column1Array.length +
              this.column2Array.length +
              this.column3Array.length
            ) {
              console.log("loader true");
              this.isLoader = false;
              this.matchSubmitted = true;
            }
          });
        }
      } else {
        increment++;
        console.log("loader ");
        if (
          increment ==
          this.column1Array.length +
          this.column2Array.length +
          this.column3Array.length
        ) {
          console.log("loader true");
          this.isLoader = false;
          this.matchSubmitted = true;
        }
      }
    }
    for (let index = 0; index < this.column3Array.length; index++) {
      this.column3Array.controls[index]
        .get("type")
        .setValue(this.integer_to_roman(index + 1).toLowerCase());
      if (this.questionaryForm.get("optionsType").value != "text") {
        if (this.column3Array.controls[index].get("value").value) {
          const formData = new FormData();
          formData.append(
            "file",
            this.column3Array.controls[index].get("value").value
          );
          this.apiService.uploadFile(formData).subscribe((response: any) => {
            console.log(response.body.message);
            increment++;
            console.log("loader ");

            this.column3Array.controls[index]
              .get("value")
              .setValue(response.body.message);
            if (
              increment ==
              this.column1Array.length +
              this.column2Array.length +
              this.column3Array.length
            ) {
              console.log("loader true");
              this.isLoader = false;
              this.matchSubmitted = true;
            }
          });
        }
        this.isLoader = false;
        this.matchSubmitted = true;
      } else {
        increment++;
        console.log("loader ");
        if (
          increment ==
          this.column1Array.length +
          this.column2Array.length +
          this.column3Array.length
        ) {
          console.log("loader true");
          this.isLoader = false;
          this.matchSubmitted = true;
        }
      }
    }

    this.addColumnOption();
  }

  getNextLetter(num): String {
    var code: number = "abcdefghijklmnopqrstuvwxyz".charCodeAt(num);
    return String.fromCharCode(code);
  }

  integer_to_roman(num): string {
    if (typeof num !== "number") return "";

    var digits = String(+num).split(""),
      key = [
        "",
        "c",
        "cc",
        "ccc",
        "cd",
        "d",
        "dc",
        "dcc",
        "dccc",
        "cm",
        "",
        "x",
        "xx",
        "xxx",
        "xl",
        "l",
        "lx",
        "lxx",
        "lxxx",
        "xc",
        "",
        "i",
        "ii",
        "iii",
        "iv",
        "v",
        "vi",
        "vii",
        "viii",
        "ix",
      ],
      roman_num = "",
      i = 3;
    while (i--) roman_num = (key[+digits.pop() + i * 10] || "") + roman_num;
    return Array(+digits.join("") + 1).join("M") + roman_num;
  }

  addColumnOption() {
    if (
      this.questionFormControl.questionType.value == "3colOptionLevelScoring"
    ) {
      this.addOptionOptionalScoring();
      // this.questionFormControl.totalMarks.disable();
    } else {
      this.optionFormArray.push(
        this.formBuilder.group({
          value: ["", Validators.required],
        })
      );
    }
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeColumnLastOption() {
    this.optionFormArray.removeAt(this.optionFormArray.length - 1);
    if (this.optionFormArray.length <= 0) {
      this.addColumnOption();
    }
    this.submitted = false;
    this.answerFormArray.clear();
  }

  removeColumnAllOption() {
    this.optionFormArray.clear();
    this.addColumnOption();
    this.submitted = false;
    this.answerFormArray.clear();
  }

  submitMatchOption() {
    this.submitted = true;
    if (this.questionFormControl.questionType.value == "twoColMtf") {
      this.answerFormArray.controls = [];
      this.answerFormArray.push(
        this.formBuilder.control("", Validators.required)
      );
    }
  }

  numberRangeValidator() {
    let num = this.answerFormArray.controls[0].value;
    let minvalue = this.optionFormArray.controls[0].get("minValue").value;
    let maxValue = this.optionFormArray.controls[0].get("maxValue").value;
    if (num < minvalue || num > maxValue) {
      true;
    } else {
      return false;
    }
  }

  setAnswerForMcq(value) {
    for (let ans of this.question.answer) {
      if (ans.value == value) {
        return true;
      }
    }
    return false;
  }

  submitAnswer(event:any) {
    this.loaderService.show();
    let userInfo = localStorage.getItem("info");
    let user = JSON.parse(userInfo);

    if (this.questionaryForm.get("questionType").value == "comprehension") {
      this.questionaryForm.addControl(
        "questions",
        new FormControl(this.comprehensionQuestionArray)
      );
      for (let ques of this.questionaryForm.controls["questions"].value) {
        if (ques.optionType == "text") {
          delete ques.images;
        }

        if (ques.optionType == "text" && ques.colImages) {
          delete ques.colImages;
        }
      }
    }

    if (user.user_info[0].school_id) {
      this.questionaryForm.controls["repository"].patchValue([
        {
          id: user.user_info[0].school_id,
          repository_type: "School",
        },
      ]);
    } else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        // id= user.user_info[0].repository[0].id
        // repo=user.user_info[0].repository[0].repository_type;
        this.questionaryForm.controls["repository"].patchValue([
          {
            id: user.user_info[0].repository[0].id,
            repository_type: "Global",
          },
        ]);
      } else {
        // id= user.user_info[0]._id
        // repo='Global'
        this.questionaryForm.controls["repository"].patchValue([
          {
            id: user.user_info[0]._id,
            repository_type: "Global",
          },
        ]);
      }
    }
    this.questionaryForm.controls["createdBy"].setValue(
      localStorage.getItem("UserName")
    );
    console.log(this.questionaryForm.value);
    if (!this.isOwner) {
      if (this.id) {

        if (
          this.questionaryForm.controls["questionType"].value ==
          "NumericalRange"
        ) {
          this.questionaryForm.controls["answer"].value[0].value = String(
            this.questionaryForm.controls["answer"].value[0].minValue +
            "-" +
            this.questionaryForm.controls["answer"].value[0].maxValue
          );
          this.optionFormArray.setValue([]);
          this.optionFormArray.push(
            this.formBuilder.group({
              minValue: [
                this.questionaryForm.controls["answer"].value[0].minValue,
                Validators.required,
              ],
              maxValue: [
                this.questionaryForm.controls["answer"].value[0].maxValue,
                Validators.required,
              ],
              value: [
                this.questionaryForm.controls["answer"].value[0].value,
                Validators.required,
              ],
            })
          );
          this.questionaryForm.patchValue({
            options: this.optionFormArray.value,
          });
          // this.questionaryForm.controls["options"].setValue(this.questionaryForm.controls["answer"].value);
        }
        this.apiService
          .updateQuestionGlobally(this.id, this.questionaryForm.value)
          .subscribe(
             (response: any) => {
              if (response.status == 201) {
                Swal.fire("Updated", "Question Updated", "success").then(
                  async function  () {
                    await setTimeout(()=>{
                      console.log('Updated')
                    },3000)
                  }
                );
                 
               
                // this.answerFormArray.clear();
                // this.optionFormArray.clear();
                // this.column1Array.clear();
                // this.column2Array.clear()
                // this.column3Array.clear();
                // this.questionaryForm.reset();
                // this.questionFormControl.matchOptions.reset();
                // this.submitted = false;
                // this.matchSubmitted = false;
                // this.questionTypeChange();
                // this.updateFlag = false;
                // this.selectedBoardName = '';
                // this.selectedSyllabusName = '';
                // this.chapterFlag = false;
                // this.topicFlag = false;
                // this.learningOutcomeFlag = false;
                // this.subjectFlag = false;
                // this.loaderService.hide();
                // this.questionaryForm.controls[''].reset();
                // this.ngOnInit();
                //this.router.navigate(["view/questions"]);
                //this.cdr.detectChanges();
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: response.body.data,
                });
                this.loaderService.hide();
                return;
              }
            },
            (error) => {
              if (error.status == 400) {
                console.log("error => ", error);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: error.error.data,
                });
                this.loaderService.hide();
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: error.error.data,
                });
                this.loaderService.hide();
              }
            }
          );
      } else {
        if (
          this.questionaryForm.controls["questionType"].value ==
          "NumericalRange"
        ) {
          this.questionaryForm.controls["answer"].value[0].value = String(
            this.questionaryForm.controls["answer"].value[0].minValue +
            "-" +
            this.questionaryForm.controls["answer"].value[0].maxValue
          );
          this.optionFormArray.setValue([]);
          this.optionFormArray.push(
            this.formBuilder.group({
              minValue: [
                this.questionaryForm.controls["answer"].value[0].minValue,
                Validators.required,
              ],
              maxValue: [
                this.questionaryForm.controls["answer"].value[0].maxValue,
                Validators.required,
              ],
              value: [
                this.questionaryForm.controls["answer"].value[0].value,
                Validators.required,
              ],
            })
          );
          this.questionaryForm.patchValue({
            options: this.optionFormArray.value,
          });
        }
        this.apiService
          .addQuestionGlobally(this.questionaryForm.value)
          .subscribe(
            (response: any) => {
              if (response.status == 201) {
                Swal.fire("Added", "Question Added", "success").then(
                  function () { }
                );
                this.answerFormArray.clear();
                this.optionFormArray.clear();
                this.column1Array.clear();
                this.column2Array.clear();
                this.column3Array.clear();
                // this.questionaryForm.reset();
                this.questionFormControl.matchOptions.reset();
                this.submitted = false;
                this.matchSubmitted = false;
                this.questionTypeChange();
                this.questionaryForm = this.getFormGroup("flag");
                // this.selectedBoardName = '';
                // this.selectedSyllabusName = '';
                // this.chapterFlag = false;
                // this.topicFlag = false;
                // this.learningOutcomeFlag = false;
                this.loaderService.hide();
                // this.ngOnInit();
                //this.cdr.detectChanges();
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: response.body.data,
                });
                this.loaderService.hide();
                return;
              }
            },
            (error) => {
              if (error.status == 400) {
                console.log("error => ", error);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: error.error.data,
                });
                this.loaderService.hide();
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: error.error.data,
                });
                this.loaderService.hide();
              }
            }
          );
      }
    } else {
      if (this.id) {
        if (
          this.questionaryForm.controls["questionType"].value ==
          "NumericalRange"
        ) {
          this.questionaryForm.controls["answer"].value[0].value = String(
            this.questionaryForm.controls["answer"].value[0].minValue +
            "-" +
            this.questionaryForm.controls["answer"].value[0].maxValue
          );
          this.optionFormArray.setValue([]);
          this.optionFormArray.push(
            this.formBuilder.group({
              minValue: [
                this.questionaryForm.controls["answer"].value[0].minValue,
                Validators.required,
              ],
              maxValue: [
                this.questionaryForm.controls["answer"].value[0].maxValue,
                Validators.required,
              ],
              value: [
                this.questionaryForm.controls["answer"].value[0].value,
                Validators.required,
              ],
            })
          );
          this.questionaryForm.patchValue({
            options: this.optionFormArray.value,
          });
        }
        this.apiService
          .updateQuestion(this.id, this.questionaryForm.value)
          .subscribe(
            (response: any) => {
              if (response.status == 201) {
                Swal.fire("Updated", "Question Updated", "success").then(
                  async function  () {
                    await setTimeout(()=>{
                      console.log('Updated')
                    },3000)
                  }
                );
                
             /*    Swal.fire("Updated", "Question Updated", "success").then(
                  function () {}
                ); */
                // this.answerFormArray.clear();
                // this.optionFormArray.clear();
                // this.column1Array.clear();
                // this.column2Array.clear()
                // this.column3Array.clear();
                // this.questionaryForm.reset();
                // this.questionFormControl.matchOptions.reset();
                // this.submitted = false;
                // this.matchSubmitted = false;
                // this.questionTypeChange();
                // this.updateFlag = false;
                // this.selectedBoardName = '';
                // this.selectedSyllabusName = '';
                // this.chapterFlag = false;
                // this.topicFlag = false;
                // this.learningOutcomeFlag = false;
                // this.subjectFlag = false;
                // this.loaderService.hide();
                // this.questionaryForm.controls[''].reset();
                // this.ngOnInit();
                this.router.navigate(["view/questions"]);
                this.cdr.detectChanges();
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: response.body.data,
                });
                this.loaderService.hide();
                return;
              }
            },
            (error) => {
              if (error.status == 400) {
                console.log("error => ", error);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: error.error.data,
                });
                this.loaderService.hide();
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: error.error.data,
                });
                this.loaderService.hide();
              }
            }
          );
      } else {
        if (
          this.questionaryForm.controls["questionType"].value ==
          "NumericalRange"
        ) {
          this.questionaryForm.controls["answer"].value[0].value = String(
            this.questionaryForm.controls["answer"].value[0].minValue +
            "-" +
            this.questionaryForm.controls["answer"].value[0].maxValue
          );
          this.optionFormArray.setValue([]);
          this.optionFormArray.push(
            this.formBuilder.group({
              minValue: [
                this.questionaryForm.controls["answer"].value[0].minValue,
                Validators.required,
              ],
              maxValue: [
                this.questionaryForm.controls["answer"].value[0].maxValue,
                Validators.required,
              ],
              value: [
                this.questionaryForm.controls["answer"].value[0].value,
                Validators.required,
              ],
            })
          );
          this.questionaryForm.patchValue({
            options: this.optionFormArray.value,
          });
        }
        /* if( this.questionaryForm.controls["questionType"].value ==
        "3colOptionLevelScoring"){
          this.questionaryForm.controls["totalMarks"].patchValue(4);
          console.log("3colOptionLevelScoring",this.questionaryForm);
          this.questionaryForm.patchValue({
            totalMarks: 4,
          });
        } */
        /*  console.log('this.questionaryForm',this.questionaryForm.value)
         let parsed = WirisPlugin.Parser.initParse(this.questionaryForm.value.question);
         console.log('parsed',parsed); */
        this.apiService.addQuestion(this.questionaryForm.value).subscribe(
          (response: any) => {
            if (response.status == 201) {
              Swal.fire("Added", "Question Added", "success").then(
                function () { }
              );
              this.answerFormArray.clear();
              this.optionFormArray.clear();
              this.column1Array.clear();
              this.column2Array.clear();
              this.column3Array.clear();
              // this.questionaryForm.reset();
              this.questionFormControl.matchOptions.reset();
              this.submitted = false;
              this.matchSubmitted = false;
              this.questionTypeChange();
              this.questionaryForm = this.getFormGroup("flag");
              // this.formLoaded = true
              // this.selectedBoardName = '';
              // this.selectedSyllabusName = '';
              // this.chapterFlag = false;
              // this.topicFlag = false;
              // this.learningOutcomeFlag = false;
              // this.subjectFlag = false;
              this.loaderService.hide();
              // this.ngOnInit();

              // this.getBoards();
              // this.getClasses();
              // this.getSyllabus();
              // this.getSubjects();
              // this.getAdmin();
              // this.getallinstitutes();
              // this.getSchoolBoards();
               this.getQuestionCategories();
              this.cdr.detectChanges();
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: response.body.data,
              });
              this.loaderService.hide();
              return;
            }
          },
          (error) => {
            if (error.status == 400) {
              console.log("error => ", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: error.error.data,
              });
              this.loaderService.hide();
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: error.error.data,
              });
              this.loaderService.hide();
            }
          }
        );
      }
    }

  }

  resetButton() {
    this.answerFormArray.clear();
    this.optionFormArray.clear();
    this.column1Array.clear();
    this.column2Array.clear();
    this.column3Array.clear();
    // this.questionaryForm.reset();
    this.questionFormControl.matchOptions.reset();
    this.submitted = false;
    this.matchSubmitted = false;
    this.questionTypeChange();
    this.questionaryForm = this.getFormGroup();
    this.formLoaded = true;
    this.selectedBoardName = "";
    this.selectedSyllabusName = "";
    this.chapterFlag = false;
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    this.subjectFlag = false;
  }

  valueChanged1() {
    console.log(this.questionaryForm);
  }

  groupAnswerChanged() {
    console.log(this.questionaryForm);
  }
  getAdmin() {
    let userInfo = localStorage.getItem("info");
    let user = JSON.parse(userInfo);
    console.log(user);
    let id: any;

    if (
      user.user_info[0].profile_type.role_name == "school_admin" ||
      user.user_info[0].profile_type.role_name == "teacher" ||
      user.user_info[0].profile_type.role_name == "principal" ||
      user.user_info[0].profile_type.role_name == "management"
    ) {
      this.isOwner = true;
      console.log(this.isOwner);
    } else if (localStorage.getItem("schoolId")) {
      this.isOwner = true;
    } else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        id = user.user_info[0].repository[0].id;
        this.globalId = user.user_info[0].repository[0].id;
      } else {
        id = user.user_info[0]._id;
        this.globalId = user.user_info[0]._id;
      }
      // this.globalId = user.user_info[0]._id
      this.isOwner = false;
    }
  }
  addChapter() {
    const modalRef = this.modalService.open(ChapterComponent, { size: "xl" });
    modalRef.componentInstance.isDialogBoxOpen = true;
    this.chapterFlag = false;
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    this.questionFormControl.subject.setValue("");
    this.questionFormControl.chapter.setValue("");
    this.questionFormControl.topic.setValue([]);
    this.questionFormControl.learningOutcome.setValue([]);
    this.getAllChapters();
  }
  addTopic() {
    const modalRef = this.modalService.open(TopicComponent, { size: "xl" });
    modalRef.componentInstance.isDialogBoxOpen = true;
    this.questionFormControl.chapter.setValue("");
    this.questionFormControl.topic.setValue([]);
    this.questionFormControl.learningOutcome.setValue([]);
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    this.getAllTopics();
  }
  addLearningOutcome() {
    const modalRef = this.modalService.open(LearningOutcomeComponent, {
      size: "xl",
    });
    modalRef.componentInstance.isDialogBoxOpen = true;
    this.questionFormControl.topic.setValue([]);
    this.questionFormControl.learningOutcome.setValue([]);
    this.learningOutcomeFlag = false;
    this.getAllLarningOutcomes();
  }
  answerExplain() {
    const modalRef = this.modalService.open(AnswerExplainComponent, {
      size: "xl",
    });
    modalRef.componentInstance.updateAnswer =
      this.questionFormControl.reason.value;
    // this.id
    //   ? this.question.reason
    //   : "";
    modalRef.componentInstance.updateFlag = this.id ? true : false;
    modalRef.result.then((result) => {
      this.questionFormControl.reason.setValue(result);
    });
  }

  addOptionFromEditor(content, data) {
    const modalRef = this.modalService.open(content, {
      size: "xl",
    });
    this.addOptionTextEditor = data.value;
    modalRef.result.then((result) => {
      if (result) {
        data.setValue(this.addOptionTextEditor);
      }
      this.addOptionTextEditor = "";
    });
  }

  addOption23ColFromEditor(content, data) {
    const modalRef = this.modalService.open(content, {
      size: "xl",
    });
    this.addOptionTextEditor = data.value;
    modalRef.result.then((result) => {
      if (result) {
        data.value = this.addOptionTextEditor;
      }
      this.addOptionTextEditor = "";
    });
  }

  difficultyRadioChanged(event) {
    console.log(event);
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.questionaryForm;
    /*  for (const name in controls) {
         if (controls[name].invalid) {
             invalid.push(name);
         }
     } */

    return controls;
  }
}
