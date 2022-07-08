import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateservicesService } from '../../create/services/createservices.service';
import { ImportChapterComponent } from '../import-chapter/import-chapter.component';
import { environment } from '../../../../../../environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingService } from '../../../loader/loading/loading.service';
import { ImportChapterMediaComponent } from './import-chapter-media/import-chapter-media.component';
import * as _ from 'lodash';
@Component({
  selector: 'kt-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
  providers: [NgbActiveModal]
})
export class ChapterComponent implements OnInit {
  constructor(public apiService: LearningService,
    private cdr: ChangeDetectorRef, private createApiServices: CreateservicesService,
    public modalService: NgbModal, private loaderService: LoadingService,
    private activeModal: NgbActiveModal) { }
  @Input() isDialogBoxOpen;
  showModel: boolean = false;
  imagePreviews: Array<any> = [];
  allFiles: Array<any> = [];
  classes: Array<any> = [];
  classmap: Array<any>;
  boards: Array<any> = [];
  syllabus: Array<any> = [];
  authors: Array<any> = [];
  subjects: Array<any> = [];
  class: any;
  board: any;
  SchoolBoards: any;
  subject: any;
  isOwner: boolean;
  syl: any;
  description: any;
  chapterTitle: any;
  imageUrl: any;
  classesLoaded: boolean = false;
  showChapters: boolean = false;
  editingChapter: boolean = false;
  idToEdit: any;
  showImage: any;
  title: string = 'Add Chapter';
  aboutFile: any;
  fileName: any;
  s3Url = environment.s3BucketUrl;
  noOfFile: any = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];
  allUploadedFiles: Array<any> = [];
  selectedFile: any;
  selectedFileTitle: any;
  public chapters: Array<any>;
  displayedColumns: string[] = ['name', 'subject_id','board_id', 'syllabus_id', 'class_id', 'created_by', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedBoardId: any;
  selectedSyllabusId: any;
  subjectFlag: boolean = false;
  resultLength: any;
  pageSize: any = 5;
  pageIndex: any = 1;
  pageEvent: PageEvent;
  schoolId: any
  filterValue: any = '';
  filterData = {
    searchValue: this.filterValue,
    filterKeysArray: ['name', 'class_id.name', 'subject_id.name', 'syllabus_id.name', 'topic_id.name', 'chapter_id.name'],
  }
  isSuperAdmin: boolean = false;

  filterOptins = {
    class_id: null,
    syllabus_id: null,
    subject_id: null,
    author_id: null,
    board_id: null
  }
  selectedChapter:any;
  ngOnInit(): void {
    this.getAdmin();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      this.schoolId = user.user_info[0].school_id;
      this.filterData['repository.id'] = this.schoolId
      this.getallinstitutes();
      this.getSchoolBoards();
      this.isOwner = true;
    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.schoolId = user.user_info[0].repository[0].id
      }
      else {
        this.schoolId = user.user_info[0]._id;

      }
      this.filterData['repository.id'] = this.schoolId;
      this.isOwner = false;

      this.getClasses();
      this.getBoards();
      this.getSyllabus();
      this.getSubjects();
    }

    // this.getallinstitutes();
    // this.getSchoolBoards();
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }



  getallinstitutes() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      this.schoolId = user.user_info[0].school_id;

    }
    // else {
    //   if(user.user_info[0].repository && user.user_info[0].repository.length){
    //     this.schoolId=user.user_info[0].repository[0].id
    //   }else{
    //   this.schoolId = user.user_info[0]._id;
    // }
    // }
    this.createApiServices.getallinstitute(id).subscribe((data: any) => {
      this.classmap = _.sortBy(data.body.data[0].classList, 'className');

      this.classes = [...this.classmap.map(m => ({_id: m.classId, name: m.className})),];
      console.log(this.classmap, "this.class")

      this.cdr.detectChanges();

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
  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;


    // defaultRoles.find(role => { return role.role_name == 'admin' })
    this.isSuperAdmin = user.user_info[0].profile_type.role_name == 'admin'? true : false;
    if (user.user_info[0].profile_type.role_name == 'school_admin' ||
      user.user_info[0].profile_type.role_name == 'teacher'
      || user.user_info[0].profile_type.role_name == 'management'
      || user.user_info[0].profile_type.role_name == 'principal') {


      this.isOwner = true
      console.log(this.isOwner)
    } else if (localStorage.getItem('schoolId')) {
      this.isOwner = true;
    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.schoolId = user.user_info[0].repository[0].id
      } else {
        this.schoolId = user.user_info[0]._id;
      }
      this.isOwner = false
    }
  }
  getClasses() {
    this.classes = [];
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = _.sortBy(response.body.data, 'name');
    });
  }
  getBoards() {
    this.boards = [];
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
      this.subjects = response.body.data;
    })
  }
  getBoardIdAndSyllabusId(value) {
    this.subjects = []
    this.loaderService.show();
    this.createApiServices.getBoardByClassId(value).subscribe(
      (response: any) => {
        if (response && response.body) {
          this.selectedBoardId = response.body.data[0]._id
          this.createApiServices.getSyllabusByClassId(value, this.selectedBoardId).subscribe(
            (response: any) => {
              this.selectedSyllabusId = response.body.data[0] ? response.body.data[0]._id : ''
              this.subjects = [];
              this.createApiServices.getSubjectsByClassId(value, this.selectedBoardId, this.selectedSyllabusId).subscribe(
                (response: any) => {
                  this.subjects = response.body.data
                  this.cdr.detectChanges();
                }
              )
            }
          )
        }
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

  compareFn(c11: any, c22: any): boolean {
    return c11 && c22 ? c11.id === c22.id : c11 === c22;
  }

  getAllChapters() {
    this.apiService.getChaptersCount(this.filterData).subscribe((response: any) => {
      if (response && response.body) {
        this.resultLength = response.body.result;
        this.dataSource = [] as any;
        this.apiService.getChaptersByPaginationFilter(this.schoolId, this.pageIndex, this.pageSize, this.filterData).subscribe((response: any) => {
          // then you can assign data to your dataSource like so
          if (response && response.body && response.body.data && response.body.data.length) {
            this.dataSource = response.body.data;
            this.cdr.detectChanges();
          }
          this.loaderService.hide();
          console.log(this.dataSource, "chapters")
        })

      }
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }
  showChaptersFun(action: boolean) {
    if(this.isOwner){
      this.chapters = [];
      this.subjects = [];
      this.syllabus = [];
    }
    this.filterOptins = {
      class_id: null,
      syllabus_id: null,
      subject_id: null,
      author_id: null,
      board_id: null
    }
    if (!action) {
      this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];

    }
    this.getAllChapters();
    this.showChapters = action;

  }

  importMediaChapter() {
    const modalRef = this.modalService.open(ImportChapterMediaComponent, { size: 'xl' });
    modalRef.result.then(result => {
      console.log(result)
      result.forEach(element => {
        let type = element.file_type.split("/");
        this.allUploadedFiles.push({
          'file': element.file, 'file_name': element.file_name, 'file_size': element.file_size,
          'file_type': type[0]
        });
        this.noOfFile.push({ file: element.file, file_name: element.file_name, file_btn: 'remove' });
        this.cdr.detectChanges();
      });
    })
  }

  onPageFired(event) {
    this.loaderService.show();
    this.apiService.getChaptersByPaginationFilter(this.schoolId, (event.pageIndex + 1), event.pageSize, this.filterData).subscribe((response: any) => {
      if (response && response.body && response.body.data && response.body.data.length) {
        this.dataSource = response.body.data;
        this.loaderService.hide();
      }
      this.loaderService.hide()
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
  // uploadFilesFun
  uploadFilesFun(data: object, valid) {
    if (valid) {
      let dataArr = Object.keys(data).map(key => ({ type: key, value: data[key] }));
      let arr = []
      dataArr.forEach((element) => {
        if (element.type.includes('file')) {
          arr.push(element.value);
        }
      });
      for (let i = 0; i < arr.length; i++) {
        this.allFiles[i].file_name = arr[i];
      }
      // Upload all files
      for (let i = 0; i < this.allFiles.length; i++) {
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
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select image and enter the title' });
      return;
    }
  }


  addChapter(data, valid) {
    if (valid) {
      if (this.selectedFileTitle || this.selectedFile) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Please Upload entered image and title ' });
        return;
      } else {
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
        
        /* let newsortArr = sortArr;
        let finalarray =[];
        sortArr.forEach((ele:any)=>{
          newsortArr.filter((ele2:any)=>{
            if(ele2.file_size !== ele.file_size){
              finalarray.push(ele2);
            }
          })
        }) */
        
       

   
/* 
        console.log('finalarray',finalarray)

        let test = null;
        console.log(this.allUploadedFiles); */
      
        /*   this.selectedChapter ? this.selectedChapter.files_upload.forEach((element:any) => {
              
             sortArr.forEach((ele:any)=>{
               if(ele.file_size !== element.file_size){
               test = ele;
               }
              })
              
            }) : ''; */
         
  
        /* setTimeout(()=>{
          console.log('testArr',test)
        },
        2000
        ) */
        console.log('sortArr',sortArr)
        this.allUploadedFiles = sortArr;
        console.log("school boardId", this.selectedBoardId)
           const chapterData = {
            "name": this.chapterTitle,
            "class_id": data.class,
            /* "list":[], */
            "board_id": this.selectedBoardId,
            "subject_id": data.subject,
            "syllabus_id": this.selectedSyllabusId,
            "chapter_image": this.imageUrl,
            "description": this.description,
            'files_upload': this.allUploadedFiles,
            'repository': [{ 'id': id, 'branch_name': '', 'repository_type': repo, }],
            "created_by": localStorage.getItem('UserName'),
            "updated_by": localStorage.getItem('UserName'),
          }
         /*  this.selectedBoardId.forEach(element => {
            chapterData.list.push({
              "board_id":element,
              "syllabus":this.selectedSyllabusId
            })
          }); */
          console.log("New boardId", chapterData)

        if (this.editingChapter) {
          if (this.idToEdit) {
            this.apiService.updateChapter(this.idToEdit, chapterData, id, chapterData.name).subscribe((response: any) => {
              if (response.status == 200) {

                Swal.fire('Added', 'Chapter Updated', 'success').then(() => {
                  this.chapterTitle = '';
                  this.showImage = '';
                  this.description = '';
                  // this.class = '';
                  // this.board = '';
                  // this.syl = '';
                  // this.subject = '';
                  this.idToEdit = '';
                  this.allUploadedFiles = [];
                  this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];

                  this.cdr.detectChanges();
                  //    window.location.reload()
                }
                );
                if (this.isDialogBoxOpen) {
                  this.activeModal.close();
                }
                let element = document.getElementById('reset') as HTMLElement;
                element.click();
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
                Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your fie please try again' });
                return;
              }
            });
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please reload the page and try again' });
            return;
          }
        } else {
          this.apiService.addChapter(chapterData, id, chapterData.name).subscribe((response: any) => {
            if (response.status == 201) {
              Swal.fire('Added', 'Chapter Added', 'success').then(() => {
                this.chapterTitle = '';
                this.showImage = '';
                this.description = '';
                // this.class = '';
                // this.board = '';
                // this.syl = '';
                // this.subject = '';
                this.idToEdit = '';
                this.allUploadedFiles = [];
                this.noOfFile = [{ file: 'Upload a file', file_name: '', file_btn: 'Upload' }];

                this.cdr.detectChanges();
                //    window.location.reload()
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
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all the fields' });
      return;
    }
    // this.ngOnInit();
  }
  // editChapter
  async editChapter(data) {
    this.selectedChapter = data;
    console.log('data', data);
    this.editingChapter = true;
    this.title = 'Edit Chapter';
    this.chapterTitle = data.name;
    this.description = data.description;
    this.class = data.class_id._id;
    this.board = [data.board_id._id];
    this.syl = [data.syllabus_id._id];
    this.subject = data.subject_id._id;
    this.idToEdit = data._id;
    this.showImage = data.chapter_image;
    this.imageUrl = data.chapter_image;
    this.aboutFile = 'show data from api';
    this.allUploadedFiles = data.files_upload;
    this.allUploadedFiles.push({ file: 'Upload a file', file_name: '', file_btn: 'Upload' });
    this.noOfFile = data.files_upload;
    this.showChapters = false;
    this.selectedBoardId = data.board_id._id;
    this.selectedSyllabusId = data.syllabus_id._id;
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let repo: any;
    if (user.user_info[0].school_id) {
      await this.getBoardIdAndSyllabusId(data.class_id._id)
    }
    this.subject = data.subject_id._id;

  }

  deleteChapter(row) {
    this.loaderService.show();
    let data = {
      chapterId: row._id,
      repositoryId: this.schoolId
    }
    this.apiService.deleteChapter(data).subscribe((res) => {
      this.getAllChapters();
    }, err => {
      this.loaderService.hide();
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
    this.idToEdit = '';
    this.showImage = '';
    this.imageUrl = '';
    this.idToEdit = '';
    this.allUploadedFiles = [];
  }
  // cancelEdit
  cancelEdit() {
    this.editingChapter = false;
    this.showChapters = false;
    this.title = 'Add Chapter';
    this.chapterTitle = '';
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
    const modalRef = this.modalService.open(ImportChapterComponent, { size: 'xl' });
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
    if (action == 'Upload') {
      if (this.selectedFileTitle && this.selectedFile) {
        console.log(this.selectedFile)
        console.log(this.selectedFile.size)
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
              'file': response.body.message, 'file_name': this.selectedFileTitle, 'file_size': exactSize,
              'file_type': type[0]
            });
            console.log(this.allUploadedFiles)
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
      this.cdr.detectChanges();
      this.loaderService.hide();
      console.log('uploaded after remove', this.allUploadedFiles);
    }
  }



  applyFilter(event: Event) {
    const filterValuee = (event.target as HTMLInputElement).value;
    this.filterData['searchValue'] = filterValuee

    this.loaderService.show();
    this.apiService.getChaptersCount(this.filterData).subscribe((response: any) => {
      if (response && response.body) {
        this.resultLength = response.body.result;
        this.apiService.getChaptersByPaginationFilter(this.schoolId, 1, 5, this.filterData).subscribe((response: any) => {
          // then you can assign data to your dataSource like so
          this.dataSource = [] as any;
          if (response && response.body && response.body.data && response.body.data.length) {
            this.dataSource = response.body.data;
            this.cdr.detectChanges();
            this.loaderService.hide();
          }
          this.loaderService.hide();
          console.log(this.dataSource, "chapters")
        },
          error => {
            this.loaderService.hide();
          })

      }
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })

    this.dataSource.filter = filterValuee.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterChanged(event?){
    this.loaderService.show();
    this.filterData.searchValue = '';

    for(let [key, value] of Object.entries(this.filterOptins)){
      if(!value || (value && !value.length)){
        delete this.filterData[key];
      }else{
        this.filterData[key] = value;
      }
    }
    // this.dataSource = [];
    this.apiService.getChaptersCount(this.filterData).subscribe((response: any) => {
      if (response && response.body) {
        this.resultLength = response.body.result;
        this.apiService.getChaptersByPaginationFilter(this.schoolId, 1, 5, this.filterData).subscribe((response: any) => {
          // then you can assign data to your dataSource like so
          this.dataSource = [] as any;
          if (response && response.body && response.body.data && response.body.data.length) {
            this.dataSource = response.body.data;
            this.cdr.detectChanges();
            this.loaderService.hide();
          }
          this.loaderService.hide();
          console.log(this.dataSource, "chapters")


          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
        },
          error => {
            this.loaderService.hide();
          })

      }
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }
}
