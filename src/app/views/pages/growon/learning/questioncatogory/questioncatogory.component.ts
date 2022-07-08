import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
import { CreateservicesService } from '../../create/services/createservices.service';
import { ImportFromGlobalComponent } from '../import-from-global/import-from-global.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingService } from '../../../loader/loading/loading.service';
@Component({
  selector: 'kt-questioncatogory',
  templateUrl: './questioncatogory.component.html',
  styleUrls: ['./questioncatogory.component.scss']
})
export class QuestioncatogoryComponent implements OnInit {
  constructor(private apiService: LearningService, private cdr: ChangeDetectorRef, private createApiServices: CreateservicesService, private modalService: NgbModal,
    private loadingService: LoadingService) { }
  name: any;
  description: any;
  questionCategories: any;
  classesLoaded: boolean = false;
  editingquestionCatergory: boolean = false;
  currentQCId: any;
  btnTitle: any = 'Add Question Category';
  index: number = 0;
  classCount: number = 100;
  displayedColumns: string[] = ['name', 'description', 'createdBy', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  classes: any;
  classmap: any;
  class: any;
  isOwner: boolean;
  disabledButton: boolean = false
  ngOnInit(): void {
    this.loadingService.show();
    this.getAllQuestionsCategory();
    this.getClasses();
    this.getAdmin();
    this.getallinstitutes();
    this.loadingService.hide();
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

    }
    this.createApiServices.getallinstitute(id).subscribe((data: any) => {
      this.classmap = data.body.data[0].classList;


      console.log(this.classmap, "this.class")

      this.cdr.detectChanges();

    })

  }

  //delete question category
  deleteUser(row) {
    this.loadingService.show();
    let data = {
      questionCategoryId: row._id,
      isGlobal: this.isOwner,
      repositoryId: row.repository[0].id,
    }
    this.apiService.deleteQuestionCategory(data).subscribe((res) => {
      this.getAllQuestionsCategory(); // call get student api based on global or school level
      this.loadingService.hide();
    }, err => {
      this.loadingService.hide();
      Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
    })
  }

  // Get all questioncatogory
  getAllQuestionsCategory() {
    this.apiService.getQuestionCategory().subscribe((response: any) => {
      this.questionCategories = response.body.data;
      this.classesLoaded = true;
      this.cdr.detectChanges();
      this.dataSource.data = this.questionCategories;
    })
  }
  // Add question
  addQuestionCatogory(data) {
    this.disabledButton = true
    this.loadingService.show();
    if (data.name) {
      let userInfo = localStorage.getItem('info');
      let user = JSON.parse(userInfo);
      let id: any;
      let repo: any;
      if (user.user_info[0].school_id) {
        id = user.user_info[0].school_id;
        repo = 'School';
      }
      //  else if (user.user_info[0]._id) {
      //   id = user.user_info[0]._id;
      //   // id = user.user_info[0].repository[0].id;
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

        // id = user.user_info[0].id;
        // id = user.user_info[0].repository[0].id;
        // repo = user.user_info[0].repository[0].repository_type;
      }
      /* if(user.user_info[0].profile_type == 'school_admin'){
        id = user.user_info[0].school_id;
        repo = 'School';
      }else if(user.user_info[0].profile_type == 'admin'){
        id = user.user_info[0].id;
        repo = 'Global';
      }else{
        id = null;
        repo = null;
      } */
      const questionCategoryData = {
        'class_id': data.class,
        'name': data.name,
        'description': data.description,
        'repository': [{ 'id': id, 'branch_name': '', 'repository_type': repo }],
        'createdBy': localStorage.getItem('UserName')
      }
      if (this.editingquestionCatergory) {
        if (this.currentQCId) {
          this.apiService.updateQuestionCategory(this.currentQCId, questionCategoryData, id, data.name).subscribe((response: any) => {
            Swal.fire('Success', 'Question Category Updated', 'success').then(() => {
              this.class = '';
              this.name = '';
              this.description = '';
              this.disabledButton = false
              this.loadingService.hide();
              this.cdr.detectChanges();
            });
            let element = document.getElementById('reset') as HTMLElement;
            element.click();
          }, (error) => {
            if (error.status == 400) {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
              this.disabledButton = false
              this.loadingService.hide();
              return;
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
              this.disabledButton = false
              this.loadingService.hide();
              return;
            }
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'reload the page and try again' });
          this.disabledButton = false
          this.loadingService.hide();
          return;
        }
      } else {

        this.apiService.addQuestionCategory(questionCategoryData, id, data.name).subscribe((response: any) => {
          if (response.status == 201) {
            Swal.fire('Success', 'Question Category Added', 'success').then(() => {
              this.class = '';
              this.name = '';
              this.description = '';
              this.disabledButton = false
              this.cdr.detectChanges();
              this.loadingService.hide();
              //    window.location.reload()
            });
            let element = document.getElementById('reset') as HTMLElement;
            element.click();
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
            this.disabledButton = false
            this.loadingService.hide();
            return;
          }
        }, (error) => {
          if (error.status == 400) {
            console.log('error => ', error)
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            this.disabledButton = false
            this.loadingService.hide();
            return;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            this.disabledButton = false;
            this.loadingService.hide();
            return;
          }
        })
        this.ngOnInit();
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Name is required' });
      this.disabledButton = false
      this.loadingService.hide();
      return;
    }
    this.ngOnInit();
    this.loadingService.hide();
  }

  // updateClass
  updateQuestionCategory(id, name, description, qCatClass) {
    this.loadingService.show();
    this.class = qCatClass;
    this.name = name;
    this.description = description;
    this.currentQCId = id;
    this.btnTitle = 'Update Question Category';
    this.editingquestionCatergory = true;
    this.loadingService.hide();
  }

  // cancelEdit
  cancelQuestionCategory() {
    this.name = '';
    this.description = '';
    this.currentQCId = '';
    this.class = '';
    this.btnTitle = 'Add Question Category';
    this.editingquestionCatergory = false;
  }
  // Pagination
  next() {
    this.classesLoaded = false;
    this.index = this.index + 10;
    this.classCount = this.classCount + 10;
    this.getAllQuestionsCategory();
  }
  prev() {
    this.classesLoaded = false;
    this.index = this.index - 10;
    this.classCount = this.classCount - 10;
    this.getAllQuestionsCategory();
  }
  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
      this.cdr.detectChanges();
    });
  }
  // getSlNo
  getSlNo(slNo) {
    return slNo + this.index;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  import() {
    const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    modalRef.componentInstance.type = "questionCategory";
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


      this.isOwner = true
      console.log(this.isOwner)
    } else if (localStorage.getItem('schoolId')) {
      this.isOwner = true;
    }
    else {
      this.isOwner = false
    }
  }
}
