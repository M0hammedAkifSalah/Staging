import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
import { ImportLearningOutcomeComponent } from '../import-learning-outcome/import-learning-outcome.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreateservicesService } from '../../create/services/createservices.service';
import { LoadingService } from '../../../loader/loading/loading.service';
@Component({
  selector: 'kt-learning-outcome',
  templateUrl: './learning-outcome.component.html',
  styleUrls: ['./learning-outcome.component.scss']
})
export class LearningOutcomeComponent implements OnInit {
  @Input() isDialogBoxOpen
  selectedClassId: any;
  selectedBoardId: any;
  selectedSyllabusId: any;
  subjectFlag: boolean = false;
  chapterFlag: boolean = false;
  topicFlag: boolean = false
  selectedSubjectId: any;

  constructor(public apiService: LearningService, private cdr: ChangeDetectorRef,
    private createApiServices: CreateservicesService, public modalService: NgbModal,
    private loaderService: LoadingService, private activeModal: NgbActiveModal) { }
  showModel: boolean = false;
  isOwner: boolean;
  imagePreviews: Array<any> = [];
  allFiles: Array<any> = [];
  classes: Array<any>;
  classmap: Array<any>;
  boards: Array<any>;
  syllabus: Array<any>;
  subjects: Array<any>;
  class: any;
  board: any;
  SchoolBoards: any;
  subject: any;
  syl: any;
  chapter: any;
  topic: any;
  description: any;
  chapterTitle: any;
  imageUrl: any;
  classesLoaded: boolean = false;
  showChapters: boolean = false;
  chapters: Array<any>;
  topics: any;
  learningOutcomes: any;
  idToEdit: any;
  editingLearningOutcome: boolean = false;
  title: string = 'Add Learning Outcome';
  aboutFile: any;
  fileName: any;
  s3Url = environment.s3BucketUrl;
  disabledButton: boolean = false
  displayedColumns: string[] = ['name', 'subject_id', 'syllabus_id', 'class_id', 'chapter_id', 'topic_id', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  noOfFile: any = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];
  allUploadedFiles: Array<any> = [];
  selectedFile: any;
  selectedFileTitle: any;
  resultLength: any;
  pageSize: any = 5;
  pageIndex: any = 1;
  pageEvent: PageEvent;
  schoolId: any;
  filterValue: any = '';
  filterData = {
    searchValue: this.filterValue,
    filterKeysArray: ['name', 'class_id.name', 'subject_id.name', 'syllabus_id.name', 'topic_id.name', 'chapter_id.name'],
  }
  ngOnInit(): void {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      this.schoolId = localStorage.getItem('schoolId');
      this.isOwner = true;
    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.schoolId = user.user_info[0].repository[0].id
      } else {
        this.schoolId = user.user_info[0]._id;
      }
      this.isOwner = false;
      // this.schoolId = user.user_info[0]._id;
    }

    this.filterData['repository.id'] = this.schoolId;

    this.getClasses();
    this.getBoards();
    this.getSyllabus();
    this.getSubjects();
    this.getAllChapters();
    this.getAllTopics();
    this.getAdmin();
    this.getSchoolBoards();
    this.getallinstitutes();
    this.loaderService.hide();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;


    // defaultRoles.find(role => { return role.role_name == 'admin' })
    if (user.user_info[0].profile_type.role_name == 'school_admin' ||
      user.user_info[0].profile_type.role_name == 'teacher'
      || user.user_info[0].profile_type.role_name == 'management'
      || user.user_info[0].profile_type.role_name == 'principal') {

      this.schoolId = user.user_info[0].school_id;
      this.isOwner = true
      console.log(this.isOwner)
    } else if (localStorage.getItem('schoolId')) {
      this.isOwner = true;
    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.schoolId = user.user_info[0].repository[0].id
        // repo=user.user_info[0].repository[0].repository_type;
      } else {
        this.schoolId = user.user_info[0]._id
        // repo='Global'
      }

      // this.schoolId = user.user_info[0]._id
      this.isOwner = false
    }
  }
  getallinstitutes() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.createApiServices.getallinstitute(id).subscribe((data: any) => {
      this.classmap = data.body.data[0].classList;


      console.log(this.classmap, "this.class")

      this.cdr.detectChanges();

    })

  }


  getClasses() {
    console.log('test');
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
    });
  }
  getBoards() {
    this.apiService.getBoards().subscribe((response: any) => {
      this.boards = response.body.data;
    })
  }
  getSchoolBoards() {
    this.apiService.getSchoolBoards().subscribe((response: any) => {


      this.classesLoaded = true;
      this.SchoolBoards = response.body.data;

      // this.boards = response.body.data.board;
      this.cdr.detectChanges();
    })
  }
  getSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.syllabus = response.body.data;
    })
  }
  getSubjects() {
    this.apiService.getSubjects().subscribe((response: any) => {
      this.subjects = response.body.data;
    })
  }
  showChaptersFun(action: boolean) {
    if (!action) {
      this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];
    }
    this.showChapters = action;
    this.getAllLarningOutcomes();
  }
  onPageFired(event) {
    this.loaderService.show();
    this.apiService.getLearnOutComeByPagination(this.schoolId, (event.pageIndex + 1), event.pageSize, this.filterData).subscribe((response: any) => {
      if (response && response.body && response.body.data && response.body.data.length) {
        this.dataSource = response.body.data;
        this.loaderService.hide();
      }
      this.loaderService.hide()
    })
  }
  getAllLarningOutcomes() {
    this.loaderService.show();
    this.apiService.getAllLearningOutcomeCount(this.filterData).subscribe((response: any) => {
      if (response && response.body) {
        this.resultLength = response.body.result;
        this.apiService.getLearnOutComeByPagination(this.schoolId, this.pageIndex, this.pageSize, this.filterData).subscribe((response: any) => {
          // then you can assign data to your dataSource like so
          if (response && response.body && response.body.data && response.body.data.length) {
            this.dataSource = response.body.data;
          }
          this.loaderService.hide();
        })
      }
      // this.learningOutcomes = response.body.data;
      // this.dataSource.data = this.learningOutcomes;
    })
  }
  getAllChapters() {
    this.apiService.getChapters().subscribe((response: any) => {
      this.chapters = response.body.data;
    })
  }
  getAllTopics() {
    this.apiService.getTopics().subscribe((response: any) => {
      this.topics = response.body.data;
    })
  }
  getBoardIdAndSyllabusId(value) {
    this.loaderService.show();
    this.subject = '';
    this.chapter = '';
    this.topic = '';
    this.chapterFlag = false;
    this.topicFlag = false;
    this.selectedClassId = value;
    this.createApiServices.getBoardByClassId(value).subscribe(
      (response: any) => {
        this.selectedBoardId = response.body.data[0]._id
        this.createApiServices.getSyllabusByClassId(value, this.selectedBoardId).subscribe(
          (response: any) => {
            this.selectedSyllabusId = response.body.data[0]._id
            this.createApiServices.getSubjectsByClassId(value, this.selectedBoardId, this.selectedSyllabusId).subscribe(
              (response: any) => {
                this.subjects = response.body.data
              }
            )
          }
        )
      }
    )
    this.subjectFlag = true;
    this.loaderService.hide();
    console.log("School Subject", this.subjects)
    console.log("school boardId", this.selectedBoardId)
    console.log("school SyllabusId", this.selectedSyllabusId)
  }
  setBoardId(value) {
    this.selectedBoardId = value
  }
  setSyllabusId(value) {
    this.selectedSyllabusId = value;
  }
  getChapterAndSetSubject(value) {
    this.loaderService.show();
    this.selectedSubjectId = value;
    this.apiService.getChaptersBySubject(this.selectedClassId, this.selectedBoardId, this.selectedSyllabusId, value).subscribe(
      (response: any) => {
        this.chapters = response.body.data;
        this.chapterFlag = true;
      }
    )
    this.loaderService.hide();
  }
  getTopicsAndSetChapter(value) {
    this.loaderService.show();
    this.apiService.getTopicByChapters(this.selectedClassId, this.selectedBoardId, this.selectedSyllabusId, this.selectedSubjectId, value).subscribe(
      (response: any) => {
        this.topics = response.body.data
        this.topicFlag = true
      }
    )
    this.loaderService.hide();
  }
  getChapterAndSubject() {
    this.loaderService.show()
    this.chapterFlag = false
    let obj = {
      class_id: this.class,
      board_id: this.board,
      syllabus_id: this.syl,
      subject_id: this.subject,
      "repository.id": this.schoolId,
    }
    this.apiService.getChaptersBySubjectGlobalFilter(obj).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.chapters = response.body.data
          this.loaderService.hide();
          this.cdr.detectChanges();
        }
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.chapterFlag = true;
    this.cdr.detectChanges();
  }
  getTopicAndChapter() {
    let obj = {
      class_id: this.class,
      board_id: this.board,
      syllabus_id: this.syl,
      subject_id: this.subject,
      chapter_id: this.chapter,
      "repository.id": this.schoolId,
    }
    this.apiService.getTopicsByChapterGlobalFilter(obj).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.topics = response.body.data;
          this.loaderService.hide();
        }
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.topicFlag = true;
    this.loaderService.hide();
  }

  // openModel
  openModel(action: boolean) {
    if (!action) {
      this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];
    }
    this.showModel = action;
  }
  // incrementUpload
  incrementUpload() {
    this.noOfFile.push(1);
  }
  addLearningOutcome(data, valid) {
    if (valid) {
      this.loaderService.show();
      this.disabledButton = true
      let userInfo = localStorage.getItem('info');
      let user = JSON.parse(userInfo);
      let id: any;
      let repo: any;
      if (user.user_info[0].school_id) {
        id = user.user_info[0].school_id;
        repo = 'School';
      }
      // else {
      //   id = user.user_info[0].id;
      //   // id = user.user_info[0].repository[0].id;
      //   repo = 'Global';
      // }
      // else if (user.user_info[0]._id) {
      //   id = user.user_info[0]._id;

      //   repo = 'Global';
      // }
      else {
        if (user.user_info[0].repository && user.user_info[0].repository.length) {
          id = user.user_info[0].repository[0].id
        } else {
          id = user.user_info[0]._id;
        }
        repo = 'Global';
        // id = user.user_info[0].repository[0].id;
        // repo = user.user_info[0].repository[0].repository_type;
      }
      let sortArr = [];
      this.allUploadedFiles.forEach((el) => {
        if (el.file_name) {
          sortArr.push(el);
        }
      });
      this.allUploadedFiles = sortArr;
      const topicData = {
        "name": this.chapterTitle,
        "class_id": data.class,
        "board_id": this.selectedBoardId,
        "subject_id": data.subject,
        "syllabus_id": this.selectedSyllabusId,
        "chapter_id": data.chapter,
        "topic_id": data.topic,
        "description": data.description,
        'files_upload': this.allUploadedFiles,
        'repository': [{ 'id': id, 'branch_name': '', 'repository_type': repo }],
        "created_by": localStorage.getItem('UserName'),
        "updated_by": localStorage.getItem('UserName'),
      }
      if (this.editingLearningOutcome) {
        if (this.idToEdit) {
          this.apiService.updateLearnOutcome(this.idToEdit, topicData, id, topicData.name).subscribe((response: any) => {
            if (response.status == 200) {
              Swal.fire('Added', 'Learning Outcome Updated', 'success').then(() => {
                this.chapterTitle = '';
                // this.class = '';
                // this.board = '';
                // this.syl = '';
                // this.subject = '';
                // this.chapter = '';
                // this.topic = '';
                this.idToEdit = '';
                this.description = '';
                this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];
                this.disabledButton = false
                this.cdr.detectChanges();
                if (this.isDialogBoxOpen) {
                  this.activeModal.close();
                }
                this.loaderService.hide();
              });
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
              this.disabledButton = false
              this.loaderService.hide();
              return;
            }
          }, (error) => {
            if (error.status == 400) {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
              this.disabledButton = false
              this.loaderService.hide();
              return;
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
              this.disabledButton = false
              this.loaderService.hide();
              return;
            }
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please reload the page try again' });
          this.loaderService.hide();
          this.disabledButton = false
          return;
        }
      } else {
        this.apiService.addLearningOutcome(topicData, id, data.name).subscribe((response: any) => {
          if (response.status == 201) {
            Swal.fire('Added', 'Learning Outcome added', 'success').then(() => {
              this.chapterTitle = '';
              // this.class = '';
              // this.board = '';
              // this.syl = '';
              // this.subject = '';
              // this.chapter = '';
              // this.topic = '';
              this.idToEdit = '';
              this.description = '';
              this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];
              this.disabledButton = false
              this.cdr.detectChanges();
              //    window.location.reload()
            });
            if (this.isDialogBoxOpen) {
              this.activeModal.close();
            }
            this.loaderService.hide();

          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
            this.loaderService.hide();
            this.disabledButton = false
            return;
          }
        }, (error) => {
          if (error.status == 400) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            this.disabledButton = false;
            this.loaderService.hide();
            return;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your fie please try again' });
            this.disabledButton = false;
            this.loaderService.hide();
            return;
          }
        });
      }
      this.loaderService.hide();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'All fields are required' });
      this.disabledButton = false
      return;
    }
    this.ngOnInit();
  }
  // editLearningoutcome
  async editLearningoutcome(data) {
    console.log('data', data);
    this.editingLearningOutcome = true;
    this.title = 'Update Learning Outcome';
    this.chapterTitle = data.name;
    this.description = data.description;
    this.class = data.class_id._id;
    this.board = data.board_id._id;
    this.syl = data.syllabus_id._id;
    this.subject = data.subject_id._id;
    this.chapter = data.chapter_id._id;
    this.topic = data.topic_id._id;
    this.idToEdit = data._id;
    this.allUploadedFiles = data.files_upload;
    this.allUploadedFiles.push({ file: 'Upload a file', file_name: '', file_btn: 'Upload' });
    this.noOfFile = data.files_upload;
    this.showChapters = false;
    this.selectedBoardId = data.board_id._id;
    this.selectedSyllabusId = data.syllabus_id._id;
    this.selectedSubjectId = data.subject_id._id;

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let repo: any;
    let id: any;

    if (user.user_info[0].school_id) {
      await this.getBoardIdAndSyllabusId(data.class_id._id);
      await this.getChapterAndSetSubject(data.subject_id._id);
      await this.getTopicsAndSetChapter(data.chapter_id._id);
    }
    else {
      await this.getChapterAndSubject();
      await this.getTopicAndChapter();
    }
    this.subject = data.subject_id._id;
    this.chapter = data.chapter_id._id;
    this.topic = data.topic_id._id;
  }

  deleteLearningoutcome(row) {
    this.classesLoaded = false;
    let data = {
      learningOutcomeId: row._id,
      repositoryId: this.schoolId
    }
    this.apiService.deleteLearningOutCome(data).subscribe((res) => {
      this.getAllLarningOutcomes();
    }, err => {
      this.classesLoaded = true;
      Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
    })
  }

  resetButton() {
    this.chapterTitle = '';
    this.description = '';
    this.class = '';
    this.board = '';
    this.syl = '';
    this.subject = '';
    this.chapter = '';
    this.topic = '';
    this.allUploadedFiles = [];
  }
  // cancelEdit
  cancelEdit() {
    this.editingLearningOutcome = false;
    this.title = 'Add Learning Outcome';
    this.chapterTitle = '';
    this.description = '';
    this.class = '';
    this.board = '';
    this.syl = '';
    this.subject = '';
    this.chapter = '';
    this.topic = '';
    this.idToEdit = '';
    this.allUploadedFiles = [];
    // this.noOfFile.splice(-1,1);
  }

  import() {
    const modalRef = this.modalService.open(ImportLearningOutcomeComponent, { size: 'xl' });
  }
  getFileTitle(value) {
    this.selectedFileTitle = value;
  }
  // onFileUpload
  onFileUpload(event: any, index) {
    if (event) {
      event.preventDefault();
      this.selectedFile = event.target.files[0];
      this.noOfFile[index].file = this.selectedFile.name;
    }
  }
  // getExtension
  getExtension(filename: any) {
    let extension = filename.split('.').pop();
    if (extension == 'Upload a file') {
      return extension;
    }
    return `.${extension}`;
  }
  // uploadSelectedFile
  uploadSelectedFile(index, action) {
    this.loaderService.show();
    this.disabledButton = true
    if (action == 'Upload') {

      if (this.selectedFileTitle && this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        this.apiService.uploadFile(formData).subscribe((response: any) => {
          if (response.status === 201) {
            this.allUploadedFiles.push({ 'file': response.body.message, 'file_name': this.selectedFileTitle });
            this.noOfFile[index].file_btn = 'Remove';
            this.noOfFile.push({ file: 'Upload a file', file_name: '', file_btn: 'Upload' });
            this.selectedFileTitle = '';
            this.selectedFile = '';
            this.disabledButton = false;
            this.loaderService.hide();
            this.cdr.detectChanges();
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
            this.disabledButton = false
            this.loaderService.hide();
            return;
          }
        }, (error) => {
          if (error.status == 400) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            this.disabledButton = false;
            this.loaderService.hide();
            return;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
            this.disabledButton = false;
            this.loaderService.hide();
            return;
          }
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Please select image and add title' });
        this.disabledButton = false;
        this.loaderService.hide();
        return;
      }
    } else {
      let value = this.noOfFile[index];
      let val2 = this.allUploadedFiles[index];
      console.log('uploaded before remove', this.allUploadedFiles);
      this.noOfFile = this.noOfFile.filter(item => item !== value);
      this.allUploadedFiles = this.allUploadedFiles.filter(item => item !== val2);
      this.disabledButton = false;
      this.loaderService.hide();
      this.cdr.detectChanges();
      console.log('uploaded after remove', this.allUploadedFiles);
    }
    this.loaderService.hide();
  }
  applyFilter(event: Event) {
    this.loaderService.show();
    const filterValuee = (event.target as HTMLInputElement).value;
    this.filterData['repository.id'] = this.schoolId;
    this.filterData['searchValue'] = filterValuee
    this.apiService.getAllLearningOutcomeCount(this.filterData).subscribe((response: any) => {
      if (response && response.body) {
        this.resultLength = response.body.result;
        this.apiService.getLearnOutComeByPagination(this.schoolId, this.pageIndex, this.pageSize, this.filterData).subscribe((response: any) => {
          // then you can assign data to your dataSource like so
          if (response && response.body && response.body.data && response.body.data.length) {
            this.dataSource = response.body.data;
            this.loaderService.hide();
          }
          this.loaderService.hide();
        }, error => {
          this.loaderService.hide();
        })
      }
      // this.learningOutcomes = response.body.data;
      // this.dataSource.data = this.learningOutcomes;
    },
      error => {
        this.loaderService.hide();
      })
    this.dataSource.filter = filterValuee.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
