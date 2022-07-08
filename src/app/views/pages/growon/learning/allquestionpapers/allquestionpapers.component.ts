import { QuestionpaperDeleteConfirmationComponent } from './../confirmation-dialogue-modal/questionpaper-delete-confirmation/questionpaper-delete-confirmation.component';
import { LoadingService } from './../../../loader/loading/loading.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LearningService } from '../services/learning.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'kt-allquestionpapers',
  templateUrl: './allquestionpapers.component.html',
  styleUrls: ['./allquestionpapers.component.scss']
})
export class AllquestionpapersComponent implements OnInit {
  questionPapers: any;
  displayedColumns: string[] = ['question_title', 'class', 'createdBy', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isOwner:boolean=false;
  schoolId:any;
  globalId:any;
  globalType:any;
  constructor(public apiService: LearningService, private cdr: ChangeDetectorRef,
    public loaderService:LoadingService, public modalService:NgbModal,
    public router: Router) { }

  ngOnInit(): void {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;
    console.log(user.user_info[0].name)
    if (user.user_info[0].school_id) {
      this.isOwner=true
      this.schoolId = localStorage.getItem('schoolId');
    } else {
      if(user.user_info[0].repository && user.user_info[0].repository.length){
        id= user.user_info[0].repository[0].id
        this.globalId= user.user_info[0].repository[0].id
      }else{
        id= user.user_info[0]._id;
        this.globalId = user.user_info[0]._id;
      }
      this.isOwner=false
      // this.globalId = user.user_info[0]._id;
      // this.globalType = user.user_info[0].profile_type.repository[0].repository_type
    }
    this.getAllQuestionPapers();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // getAllQuestionPapers
  getAllQuestionPapers() {
    if(this.isOwner){
    this.apiService.getAllQuestionPapers().subscribe((response: any) => {
      this.questionPapers = response.body.data;
      this.cdr.detectChanges();
      this.dataSource.data = this.questionPapers;
      console.log('this.questionPapers', this.questionPapers);
    })}else{
      this.apiService.getQuestionPaperForGlobalUsers(this.globalId).subscribe(
        (response: any) => {
          this.questionPapers = response.body.data;
          this.cdr.detectChanges();
          this.dataSource.data = this.questionPapers;
          console.log('this.questionPapers', this.questionPapers);
        }
      )
    }
  }

  deleteQuestionPaper(row){

    const modalRef=this.modalService.open(QuestionpaperDeleteConfirmationComponent,{size:'sm'})
    modalRef.result.then(result=>{
      if(result=='yes'){
        this.loaderService.show();
        let data = {
          "questionPaperId":row._id,
        }
        this.apiService.deleteQuestionPaper(data).subscribe((res) => {
          this.getAllQuestionPapers();
          this.loaderService.hide();
        }, err => {
          this.loaderService.hide();
          Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
        })
      }else{
        this.loaderService.hide();
      }
    })

  }

  openQuestionPaper(paper) {
    //console.log(paper._id)
    //this.router.navigate(['/show/qpaper', {id:paper._id}])
    // window.open(`/view/questionpaper/${id}`)
    // show/qpaper/:id
    this.router.navigate(['create/question-paper/', paper._id])

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  import() {
    this.router.navigate(['view/questions/import-paper']);
  }

}
