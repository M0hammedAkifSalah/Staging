import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateservicesService } from '../../growon/create/services/createservices.service';
import { LoadingService } from '../../loader/loading/loading.service';

@Component({
  selector: 'kt-add-syllabus',
  templateUrl: './add-syllabus.component.html',
  styleUrls: ['./add-syllabus.component.scss']
})
export class AddSyllabusComponent implements OnInit {
  @Input() classList = []
  @Input() mapedValue
  syllabus: any = [];
  displayedColumns: string[] = ['Class', 'Syllabus'];
  dataSource = new MatTableDataSource<any>();
  syllabusForm: FormGroup;
  syllabusFlag: boolean = true
  count = 0;
  updateFlag: boolean = false
  constructor(private _formBuilder: FormBuilder, public apiService: CreateservicesService,
    private modalService: NgbModal, private cdr: ChangeDetectorRef, private activeModal: NgbActiveModal,
    private loadingservice: LoadingService) { }

  ngOnInit(): void {
    // this.loadingservice.show();
    this.syllabusForm = this._formBuilder.group({
      syllabusMap: this._formBuilder.array([])
    })
    for (let i = 0; i < this.classList.length; i++) {
      if (this.mapedValue[i].syllabus) {
        this.updateFlag = true;
        (<FormArray>this.syllabusForm.get('syllabusMap')).push(
          this._formBuilder.group({
            classes: this._formBuilder.control(this.classList[i].className),
            syllabus: this._formBuilder.control(this.mapedValue[i].syllabus)
          })
        )
      } else {
        (<FormArray>this.syllabusForm.get('syllabusMap')).push(
          this._formBuilder.group({
            classes: this._formBuilder.control(this.classList[i].className),
            syllabus: this._formBuilder.control('', Validators.required)
          })
        )
      }
    }
    this.dataSource.data = this.classList
    this.getSyllabus();
    // this.loadingservice.hide();
  }
  getSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.syllabus = response.body.data;
    })
  }
  addSyllabus() {
    this.activeModal.close(this.syllabusForm.value)
  }
  checkValidation() {
    let validFlage = true
    for (let i = 0; i < (<FormArray>this.syllabusForm.get('syllabusMap')).length; i++) {
      if ((<FormArray>this.syllabusForm.get('syllabusMap')).controls[i].invalid) {
        validFlage = false
      }
    }
    if (validFlage) {
      this.syllabusFlag = false
    } else {
      this.syllabusFlag = true
    }
  }

}
