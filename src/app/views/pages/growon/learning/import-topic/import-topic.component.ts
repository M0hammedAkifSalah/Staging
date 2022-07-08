import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LearningService } from '../services/learning.service';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'kt-import-topic',
  templateUrl: './import-topic.component.html',
  styleUrls: ['./import-topic.component.scss']
})
export class ImportTopicComponent implements OnInit {
​
  ELEMENT_DATA = []
  displayedColumns: string[] = ['select', 'name', 'board', 'class', 'syllabus', 'subject', 'chapter'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  repository: any[] = [];
  index = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public apiService: LearningService,
    public cdr: ChangeDetectorRef,
    public activeModal: NgbActiveModal
  ) { }
​
  ngOnInit(): void {
    this.getGlobalTopicData()
    this.saveCurrentRepository();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter() {
​
​
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  saveCurrentRepository() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    if (user.user_info[0].school_id) {
      this.repository = [{
        id: user.user_info[0].school_id,
        repository_type: 'School',
​
      }]
    } else {
      this.repository = [{
        id: user.user_info[0].id,
        repository_type: 'Global'
      }]
    }
  }
​
  getGlobalTopicData() {
    this.apiService.getGlobalTopics().subscribe((response: any) => {
      this.ELEMENT_DATA = Object.assign(response.body.data);
      this.dataSource.data = this.ELEMENT_DATA;
      this.cdr.detectChanges();
      console.log(this.ELEMENT_DATA)
    })
  }
​
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
​
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
​
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
​
  submit() {
​
    this.selection.selected.forEach(selected => {
      selected.repository = this.repository;
      this.updateTopic(selected)
    });
  }
​
  updateTopic(topic) {
    this.apiService.addTopic(topic, this.repository[0].id, topic.name).subscribe((response: any) => {
      if (response.body.error) {
        Swal.fire({ icon: 'error', title: 'Error', text: response.body.error });
      } else {
        this.index++;
        Swal.fire('Success', 'Topic Added', 'success').then(() => location.reload());
        if (this.index == this.selection.selected.length) {
          this.activeModal.close(this.selection.selected);
        }
      }
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    });
  }
​
}