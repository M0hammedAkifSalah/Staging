import { LoadingService } from './../../../../loader/loading/loading.service';
import { LearningService } from './../../services/learning.service';
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import * as Papa from 'papaparse';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-bulk-upload-questions',
  templateUrl: './bulk-upload-questions.component.html',
  styleUrls: ['./bulk-upload-questions.component.scss']
})
export class BulkUploadQuestionsComponent implements OnInit {
  csvQuestion: any = []
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'School  List :',
    useBom: true,
    noDownload: false,
    headers: ["Class", "Board", "Syllabus", "Subject", "Chapter", ""]
  };
  constructor(private apiService: LearningService,
    private loaderService: LoadingService) { }

  ngOnInit(): void {
  }

  downloadCSV() {

    new AngularCsv(this.csvQuestion, "questionList", this.csvOptions);
  }
  getColumnData(columnData, answer?, learning?) {
    let value = [];
    let splitColumn = (columnData).split(",")
    splitColumn.forEach(element => {
      if (answer) {
        value.push({
          "value": element,
          "file_text": ""
        })
      } else if (learning) {
        value.push(element)
      } else {
        value.push({
          "type": '',
          "value": element,
          "file_text": ""
        })
      }
    });
    return value;
  }
  bulkUploadStudent(files: File[]) {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id = ""
    let repository_type = ''
    let createdBy = user.user_info[0].name ? user.user_info[0].name : ''
    if (user.user_info[0].repository && user.user_info[0].repository.length) {
      id = user.user_info[0].repository[0].id,
        repository_type = 'Global'
    } else {
      id = user.user_info[0]._id,
        repository_type = 'Global'
    }
    let counter = 0;
    let resultLengthData;
    if (files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {


          resultLengthData = result.data.length;
          for (let i = 0; i < result.data.length; i++) {
            let column1 = [];
            let column2 = [];
            let column3 = [];
            let answers = [];
            let options = [];
            let boards = [];
            let syllabus = [];
            let subject = [];
            let chapters = [];
            let topics = [];
            let learningOutcome = [];
            let optionHeader = ['option1', 'option2', 'option3', 'option4', 'option5',
              'option6', 'option7', 'option8', 'option9', 'option10']

            if (result.data[i].Answer) {
              answers = this.getColumnData(result.data[i].Answer, 'answer')
            }
            if (result.data[i].column1) {
              column1 = this.getColumnData(result.data[i].column1)
            }
            if (result.data[i].column2) {
              column2 = this.getColumnData(result.data[i].column2)
            }
            if (result.data[i].column3) {
              column3 = this.getColumnData(result.data[i].column3)
              answers.forEach(element => {
                delete element.file_text
              });
            }

            if (result.data[i].Board) {
              boards = this.getColumnData(result.data[i].Board, '', 'learning')
            }
            if (result.data[i].Syllabus) {
              syllabus = this.getColumnData(result.data[i].Syllabus, '', 'learning')
            } subject = this.getColumnData(result.data[i].Subject, '', 'learning')

            if (result.data[i].Chapter) {
              chapters = this.getColumnData(result.data[i].Chapter, '', 'learning')
            }
            if (result.data[i].Topics) {
              topics = this.getColumnData(result.data[i].Topics, '', 'learning')
            }
            if (result.data[i].LearningOutcome) {
              learningOutcome = this.getColumnData(result.data[i].LearningOutcome, '', 'learning')
            }
            optionHeader.forEach(element => {
              if (result.data[i].element) {
                options.push({
                  'value': result.data[i].element,
                  "file_text": ''
                })
              }
            })
            const questionData = {
              "board": boards,
              "class": result.data[i].Class,
              "syllabus": syllabus,
              "subject": result.data[i].Subject,
              "chapter": chapters,
              "topic": topics,
              "learningOutcome": learningOutcome,
              "questionCategory": result.data[i].questionCategory,
              "examType": result.data[i].ExamType,
              "questionType": result.data[i].QuestionType,
              "practiceAndTestQuestion": result.data[i].PracticeTestQuestion,
              "studentType": result.data[i].StudentType,
              "difficultyLevel": result.data[i].DifficultyLevel,
              "language": result.data[i].Language,
              "negativeScore": (String(result.data[i].NegativeScore)).toUpperCase(),
              "negativeMarks": result.data[i].Negativemark,
              "totalMarks": result.data[i].TotalMarks,
              "duration": result.data[i].Duration,
              "questionTitle": result.data[i].QuestionID,
              "reason": result.data[i].Reason,
              "question": result.data[i].Question,
              "matchOptions": {
                "column1": column1,
                "column2": column2,
                "column3": column3
              },
              "optionsType": result.data[i].OptionType,
              "options": options,
              "answer": answers,
              "repository": [
                {
                  "id": id,
                  "repository_type": repository_type
                }
              ],
              "createdBy": createdBy
            }
            this.loaderService.show();
            this.apiService.addQuestionGlobally(questionData).subscribe((response: any) => {
              if (response.status == 201) {
                Swal.fire('Added', 'Question Added', 'success').then(function () {
                });
                this.loaderService.hide();
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
          }
        }
      });
    }

  }

}
