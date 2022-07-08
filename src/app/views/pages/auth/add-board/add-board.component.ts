import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { mapValues } from 'lodash';
import { CreateservicesService } from '../../growon/create/services/createservices.service';
import { LoadingService } from '../../loader/loading/loading.service';

@Component({
  selector: 'kt-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss']
})
export class AddBoardComponent implements OnInit {

  @Input() classList = []
  @Input() mapedValue
  board: any = [];
  displayedColumns: string[] = ['Class', 'Board'];
  dataSource = new MatTableDataSource<any>();
  boardForm: FormGroup;
  boardFlag: boolean = true
  count = 0;
  updateFlag: boolean = false
  constructor(private _formBuilder: FormBuilder, public apiService: CreateservicesService,
    private modalService: NgbModal, private cdr: ChangeDetectorRef, private activeModal: NgbActiveModal,
    private loadingServce: LoadingService) { }

  ngOnInit(): void {
    this.loadingServce.show();
    console.log(this.classList)
    this.boardForm = this._formBuilder.group({
      boardMap: this._formBuilder.array([])
    })
    console.log(this.mapedValue)
    for (let i = 0; i < this.classList.length; i++) {
      if (this.mapedValue[i].board) {
        this.updateFlag = true;
        (<FormArray>this.boardForm.get('boardMap')).push(
          this._formBuilder.group({
            classes: this._formBuilder.control(this.classList[i].className),
            board: this._formBuilder.control(this.mapedValue[i].board)
          })
        )
      } else {
        (<FormArray>this.boardForm.get('boardMap')).push(
          this._formBuilder.group({
            classes: this._formBuilder.control(this.classList[i].className),
            board: this._formBuilder.control('', Validators.required)
          })
        )
      }
    }
    this.dataSource.data = this.classList
    console.log(this.classList)
    console.log(this.mapedValue)
    this.getBoard();
    this.loadingServce.hide();
  }
  getBoard() {
    this.apiService.getBoards().subscribe((response: any) => {
      this.board = response.body.data;
      console.log(this.board)
    })
  }
  addBoard() {
    this.activeModal.close(this.boardForm.value)
  }
  checkValidation() {
    let validFlage = true
    for (let i = 0; i < (<FormArray>this.boardForm.get('boardMap')).length; i++) {
      if ((<FormArray>this.boardForm.get('boardMap')).controls[i].invalid) {
        validFlage = false
      }
    }
    if (validFlage) {
      this.boardFlag = false
    } else {
      this.boardFlag = true
    }
  }


}
