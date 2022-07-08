import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
import { CreateservicesService } from '../../create/services/createservices.service';
import { ImportTopicComponent } from '../import-topic/import-topic.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LoadingService } from '../../../loader/loading/loading.service';
import { ImportTopicMediaComponent } from './import-topic-media/import-topic-media.component';
@Component({
  selector: 'kt-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  @Input() isDialogBoxOpen;
  subjectFlag: boolean = false;
  selectedBoardId: any;
  selectedSyllabusId: any;
  selectedClassId: any;
  selectedSubjectId: any;
  chapterFlag: boolean = false
  globalId: any;

  constructor(
    public apiService: LearningService,
    private cdr: ChangeDetectorRef,
    private createApiServices: CreateservicesService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private loaderService: LoadingService,
    private activeModal: NgbActiveModal
  ) { }
  fileForm: FormGroup;
  showModel: boolean = false;
  classes: Array<any> = [];
  classmap: Array<any>;
  boards: Array<any> = [];
  syllabus: Array<any> = [];
  subjects: Array<any> = [];
  class: any;
  board: any;
  subject: any;
  syl: any;
  description: any;
  chapterTitle: any;
  imageUrl: any;
  SchoolBoards: any;
  classesLoaded: boolean = false;
  showChapters: boolean = false;
  editingTopic: boolean = false;
  isSuperAdmin: boolean = false;
  chapters: Array<any> = [];
  topics: any;
  chapter: any;
  showImage: any;
  title: string = 'Add Topic';
  idToEdit: any;
  file: any;
  fileName: any;
  s3Url = environment.s3BucketUrl;
  allUploadedFiles: Array<any> = [];
  noOfFile: any = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];
  allFiles: Array<any> = [];
  imagePreviews: Array<any> = [];
  displayedColumns: string[] = ['name', 'subject_id','board_id', 'syllabus_id', 'class_id', 'chapter_id', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isOwner: boolean;
  selectedFile: any;
  selectedFileTitle: any;
  resultLength: any;
  pageSize: any = 5;
  pageIndex: any = 1;
  pageEvent: PageEvent;
  schoolId: any
  filterValue: any = '';
  chapterFetched: boolean = false;

  filterOptins = {
    class_id: null,
    syllabus_id: null,
    subject_id: null,
    chapter_id: null,
    board_id: null,
  }

  filterData = {
    searchValue: this.filterValue,
    filterKeysArray: ['name', 'subject_id.name', 'syllabus_id.name', 'class_id.name', 'chapter_id.name'],
  }
  ngOnInit(): void {
    this.fileForm = this.formBuilder.group({
      filepath: '',
      fileName: ''
    })
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

    this.getSchoolBoards()
    this.getClasses();
    this.getBoards();
    this.getSyllabus();
    this.getSubjects();
    // this.getAllChapters();
    this.getAdmin();
    this.getallinstitutes();
    this.loaderService.hide();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getSchoolBoards() {
    this.SchoolBoards = [];
    this.apiService.getSchoolBoards().subscribe((response: any) => {


      this.classesLoaded = true;
      this.SchoolBoards = response.body.data;

      // this.boards = response.body.data.board;
      this.cdr.detectChanges();
    })
  }
  getallinstitutes() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      this.schoolId = user.user_info[0].school_id;

    }

    this.createApiServices.getallinstitute(id).subscribe((data: any) => {
      this.classmap = data.body.data[0].classList;
      if(this.isOwner){
        this.classes = [...this.classmap.map(m => ({_id: m.classId, name: m.className})),];
      }

      console.log(this.classmap, "this.class")

      this.cdr.detectChanges();

    })

  }
  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;


    this.isSuperAdmin = user.user_info[0].profile_type.role_name == 'admin'? true : false;
    // defaultRoles.find(role => { return role.role_name == 'admin' })
    if (user.user_info[0].profile_type.role_name == 'school_admin' ||
      user.user_info[0].profile_type.role_name == 'teacher'
      || user.user_info[0].profile_type.role_name == 'management'
      || user.user_info[0].profile_type.role_name == 'principal') {


      this.isOwner = true
      console.log(this.isOwner)
    }
    else if (localStorage.getItem('schoolId')) {
      this.isOwner = true;
    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.globalId = user.user_info[0].repository[0].id
        // repo=user.user_info[0].repository[0].repository_type;
      } else {
        this.globalId = user.user_info[0]._id
        // repo='Global'
      }

      // this.globalId=user.user_info[0]._id
      this.isOwner = false
    }
  }
  getClasses() {
    this.classes = [];
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
    });
  }
  getBoards() {
    this.boards = []
    this.apiService.getBoards().subscribe((response: any) => {
      this.boards = response.body.data;
    })
  }
  getSyllabus() {
    this.syllabus = [];
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.syllabus = response.body.data;
    })
  }
  getSubjects() {
    this.subjects = [];
    this.apiService.getSubjects().subscribe((response: any) => {
      this.subjects = response.body.data
    })
  }

  getBoardIdAndSyllabusIdFilter() {
    if(this.filterOptins.class_id){
    this.loaderService.show();
    this.createApiServices.getBoardByClassId(this.filterOptins.class_id).subscribe(
      (response: any) => {
        this.loaderService.show();
        if (response && response.body && response.body.data && response.body.data.length) {
          this.filterOptins.board_id = response.body.data[0]._id
          this.boards = response.body.data;
          this.createApiServices.getSyllabusByClassId(this.filterOptins.class_id, this.filterOptins.board_id).subscribe(
            (response: any) => {
              this.loaderService.show();
              if (response && response.body && response.body.data && response.body.data.length) {
                this.filterOptins.syllabus_id = response.body.data[0]._id
                this.syllabus = [...response.body.data,];
                this.filterChanged();
                this.createApiServices.getSubjectsByClassId(this.filterOptins.class_id, this.filterOptins.board_id, this.filterOptins.syllabus_id).subscribe(
                  (response: any) => {
                    this.loaderService.show();
                    if (response && response.body && response.body.data && response.body.data.length) {
                      this.subjects = response.body.data;
                      this.loaderService.hide();
                    }
                    this.loaderService.hide();
                  },
                  error => {
                    this.loaderService.hide();
                  }
                )
              }
              this.loaderService.hide();
            },
            error => {
              this.loaderService.hide();
            }
          )
        }
        this.loaderService.hide();
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.subjectFlag = true;
    }else{
      this.syllabus = [];
      this.subjects = [];
    }
    this.cdr.detectChanges();
  }

  getChpterAndSetSubjectGlobal(value?) {
    this.loaderService.show();
    this.chapters = [];
    let obj = {}
    if (this.isOwner) {
      obj = {
        class_id: this.filterOptins.class_id,
        board_id: this.filterOptins.board_id,
        syllabus_id: this.filterOptins.syllabus_id,
        subject_id: this.filterOptins.subject_id,
        "repository.id": this.schoolId
      }
    } else {
      let boardListArray = [];
      let syllabusListArray = [];
      boardListArray[0] = this.filterOptins.board_id;
      syllabusListArray[0] = this.filterOptins.syllabus_id;
      obj = {
        class_id: this.filterOptins.class_id,
        board_id: this.filterOptins.board_id,
        syllabus_id: this.filterOptins.syllabus_id,
        subject_id: this.filterOptins.subject_id,
        "repository.id": this.globalId
      }
    }
    this.chapterFetched = false;
    this.apiService.getChaptersBySubjectGlobalFilter(obj).subscribe(
      (response: any) => {
        this.chapterFetched = true;
        if (
          response &&
          response.body &&
          response.body.data &&
          response.body.data.length
        ) {
          this.chapters = response.body.data;
          this.cdr.detectChanges();
        }
        this.loaderService.hide();
      },
      (error) => {
        this.chapterFetched = true;
        this.loaderService.hide();
      }
    );
    this.chapterFlag = true;
    this.loaderService.hide();

  }

  compareFn(c11: any, c22: any): boolean {
    return c11 && c22 ? c11.id === c22.id : c11 === c22;
  }

  getBoardIdAndSyllabusId(value) {
    this.loaderService.show();
    this.subject = '';
    this.chapter = '';
    this.chapterFlag = false;
    this.selectedClassId = value;
    this.createApiServices.getBoardByClassId(value).subscribe(
      (response: any) => {
        this.selectedBoardId = response.body.data[0]._id;
        this.cdr.detectChanges();
        this.createApiServices.getSyllabusByClassId(value, this.selectedBoardId).subscribe(
          (response: any) => {
            this.selectedSyllabusId = response.body.data[0]._id
            this.cdr.detectChanges();
            this.subjects = [];
            this.createApiServices.getSubjectsByClassId(value, this.selectedBoardId, this.selectedSyllabusId).subscribe(
              (response: any) => {
                this.subjects = response.body.data;
                this.cdr.detectChanges();
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
    this.selectedBoardId = this.board
  }
  setSyllabusId(value) {
    this.selectedSyllabusId = this.syl;
  }
  getChapterAndSetSubject(value) {
    this.loaderService.show();
    this.chapterFetched = false;
    this.chapters = [];
    this.apiService.getChaptersBySubject(this.selectedClassId, this.selectedBoardId, this.selectedSyllabusId, value).subscribe(
      (response: any) => {
        this.chapters = response.body.data;
        this.chapterFlag = true;
        this.chapterFetched = true;
        this.cdr.detectChanges();
      }, error =>{
        this.chapterFetched = true;
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
      "repository.id": this.globalId,
    }

    console.log(obj)
    this.chapterFetched = false;
    this.chapters = [];
    this.apiService.getChaptersBySubjectGlobalFilter(obj).subscribe(
      (response: any) => {
        this.chapterFetched = true;
        if (response && response.body && response.body.data && response.body.data.length) {
          this.chapters = response.body.data
          this.cdr.detectChanges();
        }
        this.loaderService.hide();
      },
      error => {
        this.chapterFetched = true;
        this.loaderService.hide();
      }
    )
    this.chapterFlag = true;
    this.cdr.detectChanges();
  }

  // classChange
  // getBoardWithId(classId) {
  //   this.apiService.getBoardWithId(classId.target.value).subscribe((response: any) => {
  //     this.boards = response.body.data;
  //   })

  // }
  showChaptersFun(action: boolean) {
    if(this.isOwner){
      this.chapters = [];
      this.boards = [];
      this.subjects = [];
      this.syllabus = [];
    }
    this.filterOptins = {
      class_id: null,
      syllabus_id: null,
      subject_id: null,
      chapter_id: null,
      board_id: null,
    }
    if (!action) {
      this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];
    }
    this.showChapters = action;
    this.getAllTopics();
  }
  onPageFired(event) {
    this.loaderService.show();
    this.apiService.getTopicByPagination(this.schoolId, (event.pageIndex + 1), event.pageSize, this.filterData).subscribe((response: any) => {
      if (response && response.body && response.body.data && response.body.data.length) {
        this.dataSource = response.body.data;
        this.loaderService.hide();
      }
      this.loaderService.hide()
    })
  }
  // getAllChapters() {
  //   this.chapterFetched = false;
  //   this.chapters = [];
  //   this.apiService.getChapters().subscribe((response: any) => {
  //     this.chapters = response.body.data;
  //     this.chapterFetched = true;
  //   }, error =>{
  //     this.chapterFetched = true;
  //   })
  // }

  importMediaTopic() {
    const modalRef = this.modalService.open(ImportTopicMediaComponent, { size: 'xl' });
    modalRef.result.then(result => {
      result.forEach(element => {
        let type = element.file_type.split("/");
        this.allUploadedFiles.push({
          'file': element.file, 'file_name': element.file_name, 'file_size': element.file_size,
          'file_type': type[0]
        });
        this.noOfFile.push({ file: element.file, file_name: element.file_name, file_btn: 'remove' });
      });
      this.cdr.detectChanges();
    })
  }
  getAllTopics() {
    this.loaderService.show();
    this.apiService.getTopicCount(this.filterData).subscribe((response: any) => {
      if (response && response.body) {
        this.resultLength = response.body.result;
        this.apiService.getTopicByPagination(this.schoolId, this.pageIndex, this.pageSize, this.filterData).subscribe((response: any) => {
          // then you can assign data to your dataSource like so
          if (response && response.body && response.body.data && response.body.data.length) {
            this.dataSource = response.body.data;
          }
          this.loaderService.hide();
        })
      }
      // console.log('topic response',response);
      // this.topics = response.body.data;
      this.cdr.detectChanges();
      /* let topics = [];
      for (let i = 2; i < response.body.data.length; i++) { //looping it from 1 because 1st element of the array doesn't contain data'
        topics.push(response.body.data[i])
      }
      this.topics = topics; */
      // this.dataSource.data = this.topics;
    })
  }
  uploadImage(event) {
    this.loaderService.show();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.showImage = reader.result;
      this.cdr.detectChanges();
    }
    this.apiService.uploadFile(formData).subscribe((response: any) => {
      if (response.status == 201) {
        this.imageUrl = response.body.message;
        this.loaderService.hide();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
        this.loaderService.hide();
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
        this.loaderService.hide();
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
        this.loaderService.hide();
        return;
      }
    });
  }
  // uploadFiles
  uploadFiles(data, valid) {
    this.loaderService.show();
    console.log('data', data);
    // if (valid) {
    let dataArr = Object.keys(data).map(key => ({ type: key, value: data[key] }));
    let arr = []
    dataArr.forEach((element) => {
      if (element.type.includes('file')) {
        if (element.value) {
          arr.push(element.value);
        }
      }
    });
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] && this.allFiles[i]) {
        this.allFiles[i].file_name = arr[i];
      }
    }
    console.log('before file uploads', this.allFiles);
    console.log('allUploadedFiles', this.allUploadedFiles);
    // return;
    // Upload all files
    for (let i = 0; i < this.allFiles.length; i++) {
      if (this.allFiles[i]) {
        const formData = new FormData();
        formData.append('file', this.allFiles[i].file);
        this.apiService.uploadFile(formData).subscribe((response: any) => {
          if (response.status === 201) {
            this.allFiles[i].file = response.body.message;
            console.log('this.allFiles after api', this.allFiles);
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
            return;
          }
        }, (error) => {
          if (error.status == 400) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            return;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
            return;
          }
        });
      }

    }
    this.openModel(false);
    /* } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select image and enter the title' });
      return;
    } */
    this.loaderService.hide();
  }
  addTopic(data, valid) {
    if (valid) {
      this.loaderService.show();
      let userInfo = localStorage.getItem('info');
      let user = JSON.parse(userInfo);
      let repo: any;
      let id: any;

      if (user.user_info[0].school_id) {
        id = user.user_info[0].school_id;
        repo = 'School';
      }
      //  else {
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
          repo = user.user_info[0].repository[0].repository_type;
        } else {
          id = user.user_info[0]._id
          repo = 'Global'
        }

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
        "topic_image": this.imageUrl,
        "description": this.description,
        'files_upload': this.allUploadedFiles,
        // 'about_file' : this.aboutFile,
        'repository': [{ 'id': id, 'branch_name': '', 'repository_type': repo }],
        "created_by": localStorage.getItem('UserName'),
      }
      if (this.editingTopic) {
        if (this.idToEdit) {
          this.apiService.updateTopic(this.idToEdit, topicData, id, topicData.name).subscribe((response: any) => {
            if (response.status == 200) {
              Swal.fire('Added', 'Topic Updated', 'success').then(() => {
                this.chapterTitle = '';
                this.showImage = '';
                this.description = '';
                // this.class = '';
                // this.board = '';
                // this.syl = '';
                // this.subject = '';
                this.idToEdit = '';
                // this.chapter = '';
                this.allUploadedFiles = [];
                this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];

                this.cdr.detectChanges();
                if (this.isDialogBoxOpen) {
                  this.activeModal.close();
                }
              });
              // let element = document.getElementById('reset') as HTMLElement;
              // element.click();
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
              return;
            }
          }, (error) => {
            if (error.status == 400) {
              console.log('error => ', error)
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
              return;
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
              return;
            }
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please reload the page and try again' }).then(() => window.location.reload());
          return;
        }
      } else {
        this.apiService.addTopic(topicData, id, topicData.name).subscribe((response: any) => {
          if (response.status == 201) {
            Swal.fire('Added', 'Topic Added', 'success').then(() => {
              this.chapterTitle = '';
              this.showImage = '';
              this.description = '';
              // this.class = '';
              // this.board = '';
              // this.syl = '';
              // this.subject = '';
              this.idToEdit = '';
              // this.chapter = '';
              this.allUploadedFiles = [];
              this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];

              this.cdr.detectChanges();
              if (this.isDialogBoxOpen) {
                this.activeModal.close();
              }
            });
            // let element = document.getElementById('reset') as HTMLElement;
            // element.click();
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
            return;
          }
        }, (error) => {
          if (error.status == 400) {
            console.log('error => ', error)
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            return;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
            return;
          }
        });
      }
      this.loaderService.hide();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all the fields' });
      return;
    }
    this.ngOnInit();
  }
  // editTopic
  async editTopic(data) {

    console.log('data', data);
    this.editingTopic = true;
    this.title = 'Edit Topic';
    this.chapterTitle = data.name;
    this.description = data.description;
    this.class = data.class_id._id;
    this.board = [data.board_id._id];
    this.chapter = data.chapter_id ? data.chapter_id._id : '';
    this.syl = [data.syllabus_id._id];
    this.subject = data.subject_id._id;
    this.idToEdit = data._id;
    this.showImage = data.topic_image;
    this.imageUrl = data.topic_image;
    // this.aboutFile = 'show data from api';
    this.allUploadedFiles = data.files_upload;
    this.allUploadedFiles.push({ file: 'Upload a file', file_name: '', file_btn: 'Upload' });
    // if(!this.funCheck){}
    this.noOfFile = data.files_upload;
    this.showChapters = false;

    this.chapterFlag = true;
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
    }
    else {
      await this.getChapterAndSubject();
    }
    this.subject = data.subject_id._id;
    this.chapter = data.chapter_id ? data.chapter_id._id : '';

    // this.setBoardId(this.selectedBoardId);
    // this.setSyllabusId(this.selectedSyllabusId);

  }

  deleteTopic(row) {
    this.loaderService.show();
    let data = {
      topicId: row._id,
      repositoryId: this.schoolId
    }
    this.apiService.deleteTopic(data).subscribe((res) => {
      this.getAllTopics();
    }, err => {
      this.loaderService.hide();
      Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
    })
  }

  // check if exist
  funCheck() {
    if (this.allUploadedFiles.some(file => file.file_name === '')) {
      return true;
    } else {
      return false;
    }
  }
  resetButton() {
    // this.chapterTitle = '';
    this.chapter = '';
    this.description = '';
    this.class = '';
    this.board = '';
    this.syl = '';
    this.subject = '';
    this.idToEdit = '';
    this.showImage = '';
    this.imageUrl = '';
    this.allUploadedFiles = [];
  }
  // cancelEdit
  cancelEdit() {
    this.editingTopic = false;
    this.showChapters = false;
    this.title = 'Add Chapter';
    this.chapterTitle = '';
    this.chapter = '';
    this.description = '';
    this.class = '';
    this.board = '';
    this.syl = '';
    this.subject = '';
    this.idToEdit = '';
    this.showImage = '';
    this.imageUrl = '';
    this.allUploadedFiles = [];
    this.showChapters = true;
    // this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];
    // this.noOfFile.splice(-1,1);
  }

  import() {
    const modalRef = this.modalService.open(ImportTopicComponent, { size: 'xl' });
  }
  // openModel
  openModel(action: boolean) {
    // this.modalService.open({ size: 'xl' });
    console.log('action', action);
    this.showModel = action;
  }
  // showFileLogo
  showFileLogo(fileName) {
    let fileLogo: string;
    if (fileName.split('.').pop() == 'pdf') {
      fileLogo = '/assets/media/growon/logos/pdflogo.png';
    } else if ((fileName.split('.').pop() == 'pptx') || (fileName.split('.').pop() == 'ppt')) {
      fileLogo = '/assets/media/growon/logos/ppt.jpg';
    } else if ((fileName.split('.').pop() == 'docx') || (fileName.split('.').pop() == 'doc')) {
      fileLogo = '/assets/media/growon/logos/docxlogo.png';
    } else if ((fileName.split('.').pop() == 'txt') || (fileName.split('.').pop() == 'text')) {
      fileLogo = '/assets/media/growon/logos/txt.jpg';
    } else if (fileName.split('.').pop() == 'xlxs') {
      fileLogo = '/assets/media/growon/logos/excellogo.jpg';
    } else if (fileName.split('.').pop() == 'csv') {
      fileLogo = '/assets/media/growon/logos/csv.webp';
    } else {
      fileLogo = '/assets/media/growon/logos/image.png';
    }
    return fileLogo;
  }

  applyFilter(event: Event) {
    this.loaderService.show();
    const filterValuee = (event.target as HTMLInputElement).value;
    this.filterData['searchValue'] = filterValuee
    this.apiService.getTopicCount(this.filterData).subscribe((response: any) => {
      if (response && response.body) {
        this.resultLength = response.body.result;
        this.apiService.getTopicByPagination(this.schoolId, 1, 5, this.filterData).subscribe((response: any) => {
          // then you can assign data to your dataSource like so
          this.dataSource = [] as any;
          if (response && response.body && response.body.data && response.body.data.length) {
            this.dataSource = response.body.data;
            this.loaderService.hide();
          }
          this.loaderService.hide();
        },
          error => {
            this.loaderService.hide();
          })
      }
      // console.log('topic response',response);
      // this.topics = response.body.data;
      this.cdr.detectChanges();
      /* let topics = [];
      for (let i = 2; i < response.body.data.length; i++) { //looping it from 1 because 1st element of the array doesn't contain data'
        topics.push(response.body.data[i])
      }
      this.topics = topics; */
      // this.dataSource.data = this.topics;
    },
      error => {
        this.loaderService.hide();
      })

    this.dataSource.filter = filterValuee.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterChanged(event?){
    {
      this.loaderService.show();

      this.filterData.searchValue = '';

    for(let [key, value] of Object.entries(this.filterOptins)){
      if(!value || (value && !value.length)){
        delete this.filterData[key];
      }else{
        this.filterData[key] = value;
      }
    }

      this.apiService.getTopicCount(this.filterData).subscribe((response: any) => {
        if (response && response.body) {
          this.resultLength = response.body.result;
          this.apiService.getTopicByPagination(this.schoolId, 1, 5, this.filterData).subscribe((response: any) => {
            // then you can assign data to your dataSource like so
            this.dataSource = [] as any;
            if (response && response.body && response.body.data && response.body.data.length) {
              this.dataSource = response.body.data;
              this.loaderService.hide();
            }
            this.loaderService.hide();
          },
            error => {
              this.loaderService.hide();
            })
        }
        this.cdr.detectChanges();
      },
        error => {
          this.loaderService.hide();
        })


      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

  }

  // incrementUpload
  incrementUpload() {
    this.noOfFile.push(1);
    console.log('this.noOfFile', this.noOfFile.length);
    console.log('this.noOfFile', this.noOfFile);
    console.log('allUploadedFiles', this.allUploadedFiles.length);
    console.log('allUploadedFiles', this.allUploadedFiles);
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
      console.log('noOfFiles', this.noOfFile);
      console.log('allUploadedFiles', this.allUploadedFiles);
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
    // if(this.selectedFileTitle && this.selectedFile){
    this.loaderService.show();
    if (action == 'Upload') {
      if (this.selectedFileTitle && this.selectedFile) {
        let size = this.selectedFile.size;
        let sizeType = ['Bytes', 'KB', 'MB', 'GB'];
        let i = 0;
        while (size > 900) {
          size = size / 1024;
          i++;
        }
        let exactSize = (Math.round(size * 100) / 100) + ' ' + sizeType[i];
        console.log('FILE SIZE = ', exactSize);
        let type = this.selectedFile.type.split("/");
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        this.apiService.uploadFile(formData).subscribe((response: any) => {
          if (response.status === 201) {
            this.allUploadedFiles.push({
              'file': response.body.message, 'file_name': this.selectedFileTitle,
              'file_size': exactSize,
              'file_type': type[0]
            });
            this.noOfFile[index].file_btn = 'Remove';
            this.noOfFile.push({ file: 'Upload a file', file_name: '', file_btn: 'Upload' });
            this.selectedFileTitle = '';
            this.selectedFile = '';
            this.loaderService.hide();
            this.cdr.detectChanges();
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
            this.loaderService.hide();
            return;
          }
        }, (error) => {
          if (error.status == 400) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            this.loaderService.hide();
            return;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
            this.loaderService.hide();
            return;
          }
        });
        this.loaderService.hide();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Please select image and add title' });
        this.loaderService.hide();
        return;
      }
    } else {
      let value = this.noOfFile[index];
      let val2 = this.allUploadedFiles[index];
      console.log('uploaded before remove', this.allUploadedFiles);
      this.noOfFile = this.noOfFile.filter(item => item !== value);
      this.allUploadedFiles = this.allUploadedFiles.filter(item => item !== val2);
      this.loaderService.hide();
      this.cdr.detectChanges();
      console.log('uploaded after remove', this.allUploadedFiles);
    }
    this.loaderService.hide();
    /* }else{
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select image and add title' });
      return;
    } */
  }
}
