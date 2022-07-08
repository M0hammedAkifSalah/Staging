import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'kt-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.scss']
})
export class AdmissionsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'phoneno', 'class', 'section','approve','reject'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor() { }

  ngOnInit() {
  }

}

export interface PeriodicElement {
  name: string;
  phoneno: number;
  class: string;
  section: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {phoneno: 7019471038, name: 'Nawaz', class: 'Class 1', section: 'A'},
  {phoneno: 9019471038, name: 'Alex', class:'Class 1', section: 'B'},
  {phoneno: 5019471038, name: 'John', class: 'Class 1', section: 'C'},
  {phoneno: 4019471038, name: 'Hermes Miller', class: 'Class 1', section: 'D'},
  {phoneno: 3019471038, name: 'James', class: 'Class 1', section: 'B'},
  {phoneno: 1019471038, name: 'Chadwick', class: 'Class 1', section: 'C'},
  {phoneno: 6019471038, name: 'Noah', class: 'Class 1', section: 'A'},
];