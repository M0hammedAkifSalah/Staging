import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { validators } from 'src/assets/plugins/formvalidation/src/js';
import { LearningService } from '../services/learning.service';

@Component({
  selector: 'kt-viewquestion',
  templateUrl: './viewquestion.component.html',
  styleUrls: ['./viewquestion.component.scss']
})
export class ViewquestionComponent implements OnInit {

  id: any;
  question: any;
  questionLoaded: boolean = false;
  questionaryForm: FormGroup;
  fibText = '{?}';
  submitted: boolean = false;
  audioThubmnail: any = '../../../../../../assets/media/growon/questionpaper/audiothumbnail.jpg';
  videoThubmnail: any = '../../../../../../assets/media/growon/questionpaper/videothumbnail.png';
  imageupload: any[] = ['../../../../../../assets/media/growon/questionpaper/image-upload.png'];
  boards: any[] = [];
  classes: any[] = [];
  syllabuses: any[] = [];
  subjects: any[] = [];
  chapters: any[] = [];
  allChapters: any[] = [];
  topics: any[] = [];
  allTopics: any[] = [];
  learningOutcomes: any[] = [];
  allLearningOutcomes: any[] = [];
  questionCategories: any[] = [];
  examTypes: any[] = [];
  formLoaded: boolean = false;
  praticTestQuestionArray: Array<object> = [
    { 'name': 'Pratice', 'value': 'pratice' },
    { 'name': 'Test', 'value': 'test' }
  ];
  questionTypes: Array<object> = [
    { 'name': 'Objectives', 'value': 'objectives' },
    { 'name': 'MCQs', 'value': 'mcq' },
    { 'name': 'Fill In The Blanks', 'value': 'fillInTheBlanks' },
    { 'name': '2 Column Match The Following', 'value': 'twoColMtf' },
    { 'name': '3 Column Match The Following', 'value': 'threeColMtf' },
    // { 'name': 'Sequencing Question', 'value': 'sequencingQuestion' },
    // { 'name': 'Sentence Sequencing', 'value': 'sentenceSequencing' },
    { 'name': 'True Or False', 'value': 'trueOrFalse' },
    { 'name': 'Numerical value Range', 'value': 'NumericalRange' },
    // { 'name': 'Sorting', 'value': 'sorting' },
    { 'name': 'Free Text', 'value': 'freeText' },
  ];
  studentTypeArray: Array<object> = [
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
  languages: Array<string> = ['English', 'Hindi', 'Urdu', 'Kannada'];
  objType: Array<object> = [
    { 'name': 'Text', 'value': 'text' },
    { 'name': 'Image', 'value': 'image' },
    { 'name': 'Audio', 'value': 'audio' },
    { 'name': 'Video', 'value': 'video' }
  ];
  trueOrFalse: Array<object> = [{ 'name': 'True', 'value': 'true' }, { 'name': 'False', 'value': 'false' }];



  constructor(private formBuilder: FormBuilder,
    private apiService: LearningService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getQuestionWithId();
    this.getBoards();
    this.getClasses();
    this.getSyllabus();
    this.getSubjects();
    this.getAllChapters();
    this.getAllTopics();
    this.getAllLarningOutcomes();
    this.getQuestionCategories();
    this.getExamType();
  }

  getQuestionWithId() {
    this.apiService.getQuestionWithId(this.id).subscribe((response: any) => {
      this.question = response.body.data;
      console.log('question', response);
      this.questionaryForm = this.getFormGroup();
      this.questionTypeUpdate(this.question.questionType[0] || this.question.questionType);
      let studenTypes = this.questionaryForm.controls['studentType'] as FormArray
      for (let index = 0; index < this.question.studentType.length; index++) {
        studenTypes.push(this.formBuilder.control(this.question.studentType[index]))


      }
      this.subjectChanged();
      this.chapterChanged();
      this.topicChanged();


      // this.questionType = response.body.data.questionType[0];
      // if(this.questionType == 'fillInTheBlanks'){
      //   // this.fibAnsLength = this.question.answer.length;
      //   for (let i = 0; i < this.question.answer.length; i++) {
      //     this.fibAnsLength.push(i);
      //   }
      // }
      // this.learningOutcome = response.body.data.learningOutcome;
      /* this.questionCategory = response.body.data.questionCategory;
      this.examType = response.body.data.examType;
      this.praticTest = response.body.data.practiceAndTestQuestion;
      this.studentType = response.body.data.studentType;
      this.questionDifficulty = response.body.data.difficultyLevel;
      this.class = response.body.data.class;
      this.board = response.body.data.board;
      this.syl = response.body.data.syllabus;
      this.subject = response.body.data.subject;
      this.chapter = response.body.data.chapter;
      this.topic = response.body.data.topic;
      this.questionTitle = response.body.data.questionTitle;
      this.htmlContent = response.body.data.question[0];
      this.totalMarks = response.body.data.totalMarks;
      this.negativeMarks = response.body.data.negativeMarks;
      this.negativeScore = response.body.data.negativeScore;
      this.language = response.body.data.language;
      this.duration = response.body.data.duration; */
      // this.questionsLoaded = true;
      this.cdr.detectChanges();
    });
  }

  getFormGroup() {
    return this.formBuilder.group({
      board: [this.question.board, Validators.required],
      class: [this.question.class, Validators.required],
      syllabus: [this.question.syllabus, Validators.required],
      subject: [this.question.subject, Validators.required],
      chapter: [this.question.chapter, Validators.required],
      topic: [this.question.topic, Validators.required],
      // learningOutcome: [this.question.learningOutcome, Validators.required],
      learningOutcome: [''],
      questionCategory: [this.question.questionCategory, Validators.required],
      examType: [this.question.examType, Validators.required],
      questionType: [this.question.questionType[0] || this.question.questionType, Validators.required],
      practiceAndTestQuestion: this.formBuilder.array([this.question.practiceAndTestQuestion]),
      studentType: this.formBuilder.array([]),
      difficultyLevel: [this.question.difficultyLevel, Validators.required],
      language: [this.question.language, Validators.required],
      negativeScore: [this.question.negativeScore, Validators.required],
      negativeMarks: [this.question.negativeMarks, Validators.required],
      totalMarks: [this.question.totalMarks, Validators.required],
      duration: [this.question.duration, Validators.required],
      questionTitle: [this.question.questionTitle, Validators.required],
      question: [this.question.question[0] || this.question.question, Validators.required]
    });
  }

  questionTypeUpdate(ev) {
    console.log(ev, this.questionaryForm)
    if (ev == 'objectives' || ev == 'mcq') {
      this.questionaryForm.addControl('optionsType', this.formBuilder.control(this.question.optionsType, Validators.required));
      this.questionaryForm.addControl('options', this.formBuilder.array([]))
      let options = this.questionaryForm.controls['options'] as FormArray
      for (let index = 0; index < this.question.options.length; index++) {
        options.push(this.formBuilder.group({
          type: [this.question.options[index].type, Validators.required],
          value: [this.question.options[index].value, Validators.required]
        }))

        this.imageupload.push(this.question.options[index].value)

        setTimeout(() => {
          this.submitted = true;
          this.questionLoaded = true;
          this.formLoaded = true;
        }, 10);
      }
      if (ev == 'objectives') {
        this.questionaryForm.addControl('answer', this.formBuilder.control(this.question.answer[0] || this.question.answer, Validators.required));
      } else {
        this.questionaryForm.addControl('answer', this.formBuilder.array([]));

        let answers = this.questionaryForm.controls['answer'] as FormArray
        for (let index = 0; index < this.question.answer.length; index++) {
          answers.push(this.formBuilder.control(this.question.answer[index]))
        }
      }
      console.log(this.questionaryForm)
      this.cdr.detectChanges();
    }
    else if (ev == 'fillInTheBlanks') {
      console.log("in fill")
      this.questionaryForm.addControl('answer', this.formBuilder.array([]))
      let answers = this.questionaryForm.controls['answer'] as FormArray
      for (let index = 0; index < this.question.answer.length; index++) {
        answers.push(this.formBuilder.group({
          type: [this.question.answer[index].type, Validators.required],
          value: [this.question.answer[index].value, Validators.required]
        }))
      }
      this.submitted = true;
      setTimeout(() => {
        this.questionLoaded = true;
        this.formLoaded = true;
      }, 10);
      this.cdr.detectChanges();
    }
    else if (ev == 'sequencingQuestion' || ev == 'sentenceSequencing') {
      this.questionaryForm.addControl('options', this.formBuilder.array([]))
      this.questionaryForm.addControl('answer', this.formBuilder.array([]))
      let options = this.questionaryForm.controls['options'] as FormArray;
      let answers = this.questionaryForm.controls['answer'] as FormArray
      for (let index = 0; index < this.question.options.length; index++) {
        options.push(this.formBuilder.group({
          type: [this.question.options[index].type, Validators.required],
          value: [this.question.options[index].value, Validators.required]
        }))
        answers.push(this.formBuilder.group({
          type: [this.question.answer[index].type, Validators.required],
          value: [this.question.answer[index].value, Validators.required]
        }))
      }
      this.submitted = true;
      setTimeout(() => {
        console.log("loaded")
        this.questionLoaded = true;
        this.formLoaded = true;
        this.cdr.detectChanges();
      }, 10);

    }
    else if (ev == 'trueOrFalse') {
      this.questionaryForm.addControl('answer', this.formBuilder.control(this.question.answer[0] || this.question.answer, Validators.required));
      setTimeout(() => {
        console.log("loaded")
        this.questionLoaded = true;
        this.formLoaded = true;
        this.cdr.detectChanges();
      }, 10);
    }
    else if (ev == 'NumericalRange') {
      this.questionaryForm.addControl('options', this.formBuilder.array([
        this.formBuilder.group({
          minValue: [this.question.options[0].minValue, Validators.required],
          maxValue: [this.question.options[0].maxValue, Validators.required]
        })
      ]))
      this.questionaryForm.addControl('answer', this.formBuilder.array([]));
      let answer = this.questionaryForm.controls['answer'] as FormArray
      answer.push((this.formBuilder.control(this.question.answer[0])));
      this.submitted = true;
      setTimeout(() => {
        console.log("loaded")
        this.questionLoaded = true;
        this.formLoaded = true;
        this.cdr.detectChanges();
      }, 10);
    }
    else if (ev == 'sorting') {
      this.questionaryForm.addControl('options', this.formBuilder.group({
        sortingOption: this.formBuilder.array([]),
        groups: this.formBuilder.array([])
      }))

      this.questionaryForm.addControl('answer', this.formBuilder.array([]));
      let options = this.questionaryForm.get('options').get('sortingOption') as FormArray
      let groups = this.questionaryForm.get('options').get('groups') as FormArray
      let answers = this.questionaryForm.get('answer') as FormArray

      if (Array.isArray(this.question.options)) {
        for (let index = 0; index < this.question.options.length; index++) {
          if (this.question.options[index].type.includes("sortingOption")) {
            options.push(this.formBuilder.group({
              type: [this.question.options[index].type, Validators.required],
              value: [this.question.options[index].value, Validators.required]
            }))

          } else {
            groups.push(this.formBuilder.group({
              type: [this.question.options[index].type, Validators.required],
              value: [this.question.options[index].value, Validators.required]
            }))
          }

        }
      } else {
        for (let index = 0; index < this.question.options.sortingOption.length; index++) {
          options.push(this.formBuilder.group({
            type: [this.question.options.sortingOption[index].type, Validators.required],
            value: [this.question.options.sortingOption[index].value, Validators.required]
          }))
        }
        for (let index = 0; index < this.question.options.groups.length; index++) {
          groups.push(this.formBuilder.group({
            type: [this.question.options.groups[index].type, Validators.required],
            value: [this.question.options.groups[index].value, Validators.required]
          }))

        }

      }
      for (let index = 0; index < this.question.answer.length; index++) {
        answers.push(this.formBuilder.group({
          type: [this.question.answer[index].type, Validators.required],
          value: [this.question.answer[index].value, Validators.required]
        }))
      }

      setTimeout(() => {
        console.log("loaded")
        this.questionLoaded = true;
        this.formLoaded = true;
        this.submitted = true;
        this.cdr.detectChanges();
      }, 10);

    }
    else if (ev == 'freeText') {
      this.questionaryForm.addControl('answer', this.formBuilder.control(this.question.answer[0] || this.question.answer, Validators.required));
      setTimeout(() => {
        console.log("loaded")
        this.questionLoaded = true;
        this.cdr.detectChanges();
      }, 10);
    }
    else if (ev == 'twoColMtf' || ev == 'threeColMtf') {
      this.questionaryForm.addControl('options', this.formBuilder.array([]))
      this.questionaryForm.addControl('answer', this.formBuilder.control('', Validators.required));
      if (ev == 'twoColMtf') {
        this.questionaryForm.addControl('matchOptions', this.formBuilder.group({
          column1: this.formBuilder.array([]),
          column2: this.formBuilder.array([])
        }))
      } else {
        this.questionaryForm.addControl('matchOptions', this.formBuilder.group({
          column1: this.formBuilder.array([]),
          column2: this.formBuilder.array([]),
          column3: this.formBuilder.array([])
        }))
      }



    }

  }
  subjectChanged() {
    console.log(this.questionaryForm.get('class').value, this.allChapters)

    this.chapters = this.allChapters.filter(chapter => {
      return chapter.subject_id.name == this.questionaryForm.get('subject').value && chapter.class_id.name == this.questionaryForm.get('class').value && chapter.board_id.name == this.questionaryForm.get('board').value && chapter.syllabus_id.name == this.questionaryForm.get('syllabus').value
    })
    console.log(this.chapters)
    this.questionaryForm.get('chapter').setValue('');
    this.questionaryForm.get('topic').setValue('');
    this.questionaryForm.get('learningOutcome').setValue('');
    this.cdr.detectChanges();
  }

  chapterChanged() {
    this.topics = this.allTopics.filter(topic => {
      return topic.chapter_id.name == this.questionaryForm.get('chapter').value
    })
    this.questionaryForm.get('topic').setValue('');
    this.questionaryForm.get('learningOutcome').setValue('');
    this.cdr.detectChanges();

  }

  topicChanged() {
    console.log(this.allLearningOutcomes)
    this.learningOutcomes = this.allLearningOutcomes.filter(learningOutcome => {
      return learningOutcome.topic_id.name == this.questionaryForm.get('topic').value
    })
    this.questionaryForm.get('learningOutcome').setValue('');
    this.cdr.detectChanges();

  }

  onChange(event) {
    const praticTests = <FormArray>this.questionaryForm.get('practiceAndTestQuestion') as FormArray;

    if (event.checked) {
      praticTests.push(new FormControl(event.source.value))
    } else {
      const i = praticTests.controls.findIndex(x => x.value === event.source.value);
      praticTests.removeAt(i);
    }
  }

  onOptionChange(event) {
    const answers = <FormArray>this.questionaryForm.get('answer') as FormArray;

    if (event.checked) {
      answers.push(new FormControl(event.source.value))
    } else {
      const i = answers.controls.findIndex(x => x.value === event.source.value);
      answers.removeAt(i);
    }
  }


  ispracticeAndTestQuestion(id: any): boolean {

    const praticTests = <FormArray>this.questionaryForm.get('practiceAndTestQuestion') as FormArray;

    return praticTests.value.some(elt => elt === id);

  }

  isStudentType(id: any) {
    const studentTypes = <FormArray>this.questionaryForm.get('studentType') as FormArray;
    return studentTypes.value.some(elt => elt === id);


  }

  onStudentTypeChange(event) {
    const studentTypes = <FormArray>this.questionaryForm.get('studentType') as FormArray;

    if (event.checked) {
      studentTypes.push(new FormControl(event.source.value))
    } else {
      const i = studentTypes.controls.findIndex(x => x.value === event.source.value);
      studentTypes.removeAt(i);
    }
  }

  getBoards() {
    this.apiService.getBoards().subscribe((response: any) => {
      this.boards = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
      this.cdr.detectChanges();
    });
  }
  getSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.syllabuses = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getSubjects() {
    this.apiService.getSubjects().subscribe((response: any) => {
      this.subjects = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getAllChapters() {
    this.apiService.getChapters().subscribe((response: any) => {
      console.log("chapters", response)
      this.allChapters = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getAllTopics() {
    this.apiService.getTopics().subscribe((response: any) => {
      this.allTopics = response.body.data;
      this.cdr.detectChanges();
    })
  }

  getAllLarningOutcomes() {
    this.apiService.getAllLarningOutcomes().subscribe((response: any) => {
      this.allLearningOutcomes = response.body.data;
    })
  }
  getQuestionCategories() {
    this.apiService.getQuestionCategory().subscribe((response: any) => {
      console.log(response.body.data)
      this.questionCategories = response.body.data;
    })
  }
  getExamType() {
    this.apiService.getExamType().subscribe((response: any) => {
      this.examTypes = response.body.data;
      this.cdr.detectChanges();
    })
  }

  valuechanged(ev) {
    this.questionaryForm.get('question').setValue(ev);
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 10);
  }

  freeAnswerchanged(ev) {
    this.questionaryForm.get('answer').setValue(ev);
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 10);
  }

  optionchanged(ev, i) {
    let options = this.questionaryForm.controls['options'] as FormArray
    options.controls[i].get('value').setValue(ev)
  }

  sortingOptionchanged(ev, i) {
    let options = this.questionaryForm.get('options').get('sortingOption') as FormArray
    options.controls[i].get('value').setValue(ev)
  }

  column1Optionchanged(ev, i, col) {
    let options = this.questionaryForm.get('matchOptions').get(col) as FormArray
    options.controls[i].get('value').setValue(ev)
  }

  sortingGroupOptionchanged(ev, i) {
    let options = this.questionaryForm.get('options').get('groups') as FormArray
    options.controls[i].get('value').setValue(ev)
  }

  answerchanged(ev, i) {
    let options = this.questionaryForm.controls['answer'] as FormArray
    options.controls[i].get('value').setValue(ev)
  }

  questionTypeChange(ev) {
    console.log(ev)
    ev = this.questionaryForm.get('questionType').value
    this.formLoaded = false;
    this.submitted = false;
    this.questionaryForm.removeControl('optionsType');
    this.questionaryForm.removeControl('options');
    this.questionaryForm.removeControl('answer');
    this.questionaryForm.removeControl('matchOptions');
    setTimeout(() => {

      if (ev == 'objectives' || ev == 'mcq') {
        this.questionaryForm.addControl('optionsType', this.formBuilder.control('', Validators.required));
        this.questionaryForm.addControl('options', this.formBuilder.array([]))
        if (ev == 'objectives') {
          this.questionaryForm.addControl('answer', this.formBuilder.control('', Validators.required));
        } else {
          this.questionaryForm.addControl('answer', this.formBuilder.array([]))
        }
        console.log(this.questionaryForm)
        this.formLoaded = true;
        this.cdr.detectChanges();
      }
      else if (ev == 'fillInTheBlanks') {
        this.questionaryForm.addControl('answer', this.formBuilder.array([]))
        this.formLoaded = true;
        this.cdr.detectChanges();

      }
      else if (ev == 'sequencingQuestion' || ev == 'sentenceSequencing') {
        this.questionaryForm.addControl('options', this.formBuilder.array([]))
        this.questionaryForm.addControl('answer', this.formBuilder.array([]))
        this.formLoaded = true;
        this.cdr.detectChanges();

      }
      else if (ev == 'trueOrFalse') {
        this.questionaryForm.addControl('answer', this.formBuilder.control('', Validators.required));
        this.formLoaded = true;
        this.cdr.detectChanges();

      }
      else if (ev == 'NumericalRange') {
        this.questionaryForm.addControl('options', this.formBuilder.array([
          this.formBuilder.group({
            minValue: ['', Validators.required],
            maxValue: ['', Validators.required]
          })
        ]))
        this.questionaryForm.addControl('answer', this.formBuilder.array([]));
        let answer = this.questionaryForm.controls['answer'] as FormArray
        answer.push((this.formBuilder.control('')));
        this.formLoaded = true;

        this.cdr.detectChanges();
      }
      else if (ev == 'sorting') {
        this.questionaryForm.addControl('options', this.formBuilder.group({
          sortingOption: this.formBuilder.array([]),
          groups: this.formBuilder.array([])
        }))
        this.questionaryForm.addControl('answer', this.formBuilder.array([]));
        this.formLoaded = true;
        this.cdr.detectChanges();
        console.log(this.questionaryForm.get('options').get('sortingOption'))
      }
      else if (ev == 'freeText') {
        this.questionaryForm.addControl('answer', this.formBuilder.control('', Validators.required));
        this.formLoaded = true;
        this.cdr.detectChanges();

      }
      else if (ev == 'twoColMtf' || ev == 'threeColMtf') {
        this.questionaryForm.addControl('options', this.formBuilder.array([]))
        this.questionaryForm.addControl('answer', this.formBuilder.control('', Validators.required));
        if (ev == 'twoColMtf') {
          this.questionaryForm.addControl('matchOptions', this.formBuilder.group({
            column1: this.formBuilder.array([]),
            column2: this.formBuilder.array([])
          }))
        } else {
          this.questionaryForm.addControl('matchOptions', this.formBuilder.group({
            column1: this.formBuilder.array([]),
            column2: this.formBuilder.array([]),
            column3: this.formBuilder.array([])
          }))
        }
        this.formLoaded = true;
        this.cdr.detectChanges();

      }

    }, 10);
  }



  // onFileChanged
  onFileChanged(event: any, i: any) {
    console.log(event.target.files[0])
    let options = this.questionaryForm.controls['options'] as FormArray
    options.controls[i].get('value').setValue(event.target.files[0])
    this.getImage(event.target.files[0], i)
    this.cdr.detectChanges();
  }

  //image show
  getImage(image, i): any {

    if (image) {
      var reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (_event) => {
        let fileExe = image.type;
        let fileType = fileExe.split('/');
        // console.log('fileType',fileType);
        if (fileType[0] === "image") {
          this.imageupload[i] = reader.result;
          this.cdr.detectChanges();
        } else if (fileType[0] === "audio") {
          this.imageupload[i] = this.audioThubmnail;
          this.cdr.detectChanges();
        } else if (fileType[0] === "video") {
          this.imageupload[i] = this.videoThubmnail;
          this.cdr.detectChanges();
        } else {
          alert('please select valid file type');
          return;
        }

      }
    }

  }

  addObj() {
    let options = this.questionaryForm.controls['options'] as FormArray
    options.push(this.formBuilder.group({
      type: ['', Validators.required],
      value: ['', Validators.required]
    }))
    this.imageupload[options.length - 1] = '../../../../../../assets/media/growon/questionpaper/image-upload.png';
  }

  addSortingOption() {
    let options = this.questionaryForm.get('options').get('sortingOption') as FormArray
    options.push(this.formBuilder.group({
      type: ['', Validators.required],
      value: ['', Validators.required]
    }))
  }

  addGroupOption() {
    let options = this.questionaryForm.get('options').get('groups') as FormArray
    options.push(this.formBuilder.group({
      type: ['', Validators.required],
      value: ['', Validators.required]
    }))
  }

  addColumnOption(col) {
    let options = this.questionaryForm.get('matchOptions').get(col) as FormArray
    options.push(this.formBuilder.group({
      type: ['', Validators.required],
      value: ['', Validators.required]
    }))
  }


  removelast() {
    let options = this.questionaryForm.controls['options'] as FormArray
    options.removeAt(options.length - 1)
    this.imageupload.pop();
  }



  removeSortingOption() {
    let options = this.questionaryForm.get('options').get('groups') as FormArray
    options.removeAt(options.length - 1)
  }

  removeGroupOption() {
    let options = this.questionaryForm.get('options').get('groups') as FormArray
    options.removeAt(options.length - 1)
  }

  removeColumnOption(col) {
    let options = this.questionaryForm.get('matchOptions').get(col) as FormArray
    options.removeAt(options.length - 1)
  }

  removeAll() {
    let options = this.questionaryForm.controls['options'] as FormArray
    while (options.length !== 0) {
      options.removeAt(0)
    }

    this.imageupload = ['../../../../../../assets/media/growon/questionpaper/image-upload.png']
    this.cdr.detectChanges();
  }

  removeSortingOptionAll() {
    let options = this.questionaryForm.get('options').get('sortingOption') as FormArray
    while (options.length !== 0) {
      options.removeAt(0)
    }
    this.cdr.detectChanges();
  }

  removeGroupOptionAll() {
    let options = this.questionaryForm.get('options').get('groups') as FormArray
    while (options.length !== 0) {
      options.removeAt(0)
    }
    this.cdr.detectChanges();
  }

  removeColumnOptionAll(col) {
    let options = this.questionaryForm.get('matchOptions').get(col) as FormArray
    while (options.length !== 0) {
      options.removeAt(0)
    }
    this.cdr.detectChanges();
  }


  submitoptions() {
    let options = this.questionaryForm.controls['options'] as FormArray
    for (let index = 1; index <= options.length; index++) {
      if (this.questionaryForm.get('optionsType').value == 'text') {
        (options.at(index - 1) as FormGroup).get('type').patchValue('option' + index)
      } else {
        const formData = new FormData();
        formData.append('file', (options.at(index - 1) as FormGroup).get('value').value);
        this.apiService.uploadFile(formData).subscribe((response: any) => {
          options.at(index).patchValue({
            type: 'option' + index,
            value: response.body.message
          })
        });
      }
    }
    // this.submitted = true;
  }

  getfillInBlanks() {
    return (this.questionaryForm.get('question').value.match(/{?}/g) || []).length;
  }

  submitques() {
    let len = (this.questionaryForm.get('question').value.match(/{?}/g) || []).length;
    let answers = this.questionaryForm.controls['answer'] as FormArray
    for (let index = 0; index < len; index++) {
      answers.push(this.formBuilder.group({
        type: ['fibAnswer' + index + 1, Validators.required],
        value: ['', Validators.required]
      }))

    }
    this.submitted = true
  }

  submitsequesnceoptions() {
    let options = this.questionaryForm.controls['options'] as FormArray
    let answers = this.questionaryForm.controls['answer'] as FormArray
    for (let index = 1; index <= options.length; index++) {
      (options.at(index - 1) as FormGroup).get('type').patchValue('"sequencingQuestionOption' + index)
      answers.push(this.formBuilder.group({
        type: ['sequence' + index, Validators.required],
        value: ['', Validators.required]
      }))
    }
    this.submitted = true;
  }

  submitNumericOption() {
    this.submitted = true;
  }



  submitSortingOption() {

    let options = this.questionaryForm.get('options').get('sortingOption') as FormArray
    let groups = this.questionaryForm.get('options').get('groups') as FormArray
    let answers = this.questionaryForm.get('answer') as FormArray;
    for (let index = 1; index <= options.length; index++) {
      (options.at(index - 1) as FormGroup).get('type').patchValue('sortingOption' + index)
    }
    for (let index = 1; index <= groups.length; index++) {
      (groups.at(index - 1) as FormGroup).get('type').patchValue('sortingGroup' + index)
      answers.push(this.formBuilder.group({
        type: ['group' + index, Validators.required],
        value: ['', Validators.required]
      }))
    }
    this.submitted = true;
  }

  submitMatch() {
    let column1s = this.questionaryForm.get('matchOptions').get('column1') as FormArray
    let column2s = this.questionaryForm.get('matchOptions').get('column2') as FormArray
    let options = this.questionaryForm.get('options') as FormArray;
    for (let index = 1; index <= column1s.length; index++) {
      (column1s.at(index - 1) as FormGroup).get('type').patchValue('column1Option' + index)
    }
    for (let index = 1; index <= column2s.length; index++) {
      (column2s.at(index - 1) as FormGroup).get('type').patchValue('column2sOption' + index)
    }

    for (let index = 1; index <= options.length; index++) {
      (options.at(index - 1) as FormGroup).get('type').patchValue('option' + index)
    }
    if (this.questionaryForm.get('questionType').value == 'threeColMtf') {
      let column3s = this.questionaryForm.get('matchOptions').get('column3') as FormArray
      for (let index = 1; index <= column3s.length; index++) {
        (column3s.at(index - 1) as FormGroup).get('type').patchValue('column3sOption' + index)
      }
    }
    this.submitted = true;

  }


  submitAnswer() {
    console.log(this.questionaryForm.value)
  }




}
