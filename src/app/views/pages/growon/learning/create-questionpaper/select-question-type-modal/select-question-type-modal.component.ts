import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kt-select-question-type-modal',
  templateUrl: './select-question-type-modal.component.html',
  styleUrls: ['./select-question-type-modal.component.scss']
})
export class SelectQuestionTypeModalComponent implements OnInit {

  @Input() allQuestion;
  @Input() selectQuestion;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns = ['select', 'questionTitle', 'questionType', 'topic', 'learningOutcome', 'repository']
  constructor(public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.dataSource.data = this.allQuestion;
    this.selection = new SelectionModel<any>(true, this.selectQuestion);;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  submit() {
    this.activeModal.close(this.selection.selected);
  }

}
