import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoadingService } from "src/app/views/pages/loader/loading/loading.service";
import Swal from "sweetalert2";
import { AnswerExplainComponent } from "../../answer-explain/answer-explain.component";

@Component({
  selector: "kt-select-question",
  templateUrl: "./select-question.component.html",
  styleUrls: ["./select-question.component.scss"],
})
export class SelectQuestionComponent implements OnInit {
  @Input() questionList;
  @Input() questionCount;
  @Input() questionType;
  @Input() totalQuestion;

  filteredQuestion: any = [];
  selectedQuestionList: any = [];
  selectedQuestionType: any;
  selectAll: boolean = false;
  totalMarks: number = 0;
  totalCount: number = 0;

  constructor(
    private loaderService: LoadingService,
    private activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.selectedQuestionType = this.questionType;
    // this.questionList = this.questionList.map(v => ({ ...v, isChecked: false }))
    this.FilterQuestionType(this.questionType);
    this.setQuestionType();
    console.log(this.selectedQuestionType);
    console.log(this.questionType);
    console.log(this.questionList);

    this.getSelectAllStatus();
  }

  setQuestionType(){
    if(this.questionType == 'comprehension'){
      this.questionList.filter((f, i) =>
      {
        f.questionType == "comprehension" && f.questions.map((m, idx1) => this.setType(m, i, idx1))
      }
      );
    }
  }

  setType(item, index, idx1){
    switch(item.questionType[0]){
      case 'objectives':
        this.questionList[index].questions[idx1]['questionTypeValue']="Objective";
        break;

        case 'mcq':
        this.questionList[index].questions[idx1]['questionTypeValue']="MCQs";
        break;

        case 'fillInTheBlanks':
        this.questionList[index].questions[idx1]['questionTypeValue']="Fill In The Blanks";
        break;

        case 'twoColMtf':
        this.questionList[index].questions[idx1]['questionTypeValue']="2 Column Match The Following";
        break;

        case 'threeColMtf':
        this.questionList[index].questions[idx1]['questionTypeValue']="3 Column Match The Following";
        break;

        case '3colOptionLevelScoring':
        this.questionList[index].questions[idx1]['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
        break;

        case 'optionLevelScoring':
        this.questionList[index].questions[idx1]['questionTypeValue']="Option Level Scoring";
        break;

        case 'trueOrFalse':
        this.questionList[index].questions[idx1]['questionTypeValue']="True Or False";
        break;

        case 'NumericalRange':
        this.questionList[index].questions[idx1]['questionTypeValue']="Numerical value Range";
        break;

        case 'freeText':
        this.questionList[index].questions[idx1]['questionTypeValue']="Free Text";
        break;
    }
    return true;
  }

  getSelectAllStatus() {
    let flag = true;
    this.totalCount = 0;
    this.questionList.filter((x) => {
      if(x.isChecked){
        this.totalCount += 1;
      }
      if (
        x.questionType[0] == this.selectedQuestionType &&
        x.isChecked == false
      ) {
        flag = false;
      }
    });
    this.selectAll = flag;

    let elements = document.getElementsByClassName("check-select-all") as any;
    if (elements && elements.length) {
      for (let e of elements) {
        e.checked = flag;
      }
    }

    this.totalMarks = this.questionList.map((m) => m.isChecked && m.totalMarks)
        .reduce((a, b) => +a + +b, 0)

    this.cdr.detectChanges();
  }

  answerExplain(question) {
    const modalRef = this.modalService.open(AnswerExplainComponent, {
      size: "xl",
    });
    modalRef.componentInstance.updateAnswer = question.reason;
    modalRef.componentInstance.readyOnly = true;
    // modalRef.componentInstance.updateFlag = this.id ? true : false;
    modalRef.result.then((result) => {
      question.reason = result;
    });
  }

  FilterQuestionType(value) {
    this.filteredQuestion = [];
    this.getSelectAllStatus();
    console.log(value);
    if (this.questionList && this.questionList.length) {
      this.filteredQuestion = this.questionList.filter(
        (x: any) => x.questionType[0] === value
      );
    }
    console.log(this.filteredQuestion);
  }

  checkedQuestionList(row, event, i) {
    console.log(row);
    console.log(event.currentTarget.checked);
    // event.currentTarget.checked ? this.selectedQuestionList.push(row) : this.selectedQuestionList = this.selectedQuestionList.filter((x: any) => x._id !== row._id);
    row.isChecked = event.currentTarget.checked ? true : false;
    this.questionList.filter((x) => {
      if (x._id === row._id) {
        x.isChecked = event.currentTarget.checked ? true : false;
      }
    });
    console.log(row);
    this.cdr.detectChanges();

    this.getSelectAllStatus();
    // console.log(this.selectedQuestionList)
  }

  submitQuestionList() {
    this.questionList = this.questionList.filter((x) => x.isChecked === true);
    this.activeModal.close(this.questionList);
  }

  isChecked(id, i) {
    return this.selectedQuestionList.filter((x: any) => x._id === id).length;
  }

  selectAllQuestions(event) {
    this.questionList.filter((x) => {
      if (x.questionType[0] == this.selectedQuestionType) {
        x.isChecked = event.currentTarget.checked;
      }
    });

    let elements = document.getElementsByClassName("check-select-all") as any;
    if (elements && elements.length) {
      for (let e of elements) {
        e.checked = event.currentTarget.checked;
      }
    }

    this.getSelectAllStatus();
    this.cdr.detectChanges();
  }
}
