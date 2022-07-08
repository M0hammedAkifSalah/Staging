import { Component, OnInit } from '@angular/core';
import { CreateservicesService } from '../../services/createservices.service';
@Component({
  selector: 'kt-all-students',
  templateUrl: './all-students.component.html',
  styleUrls: ['./all-students.component.scss']
})
export class AllStudentsComponent implements OnInit {

  constructor(public apiService:CreateservicesService ) { }

  ngOnInit(): void {
    this.getAllStudents();
  }
  getAllStudents(){
    this.apiService.getAllStudents().subscribe((response:any) => {
      console.log('response => ',response);
    })
  }
}
