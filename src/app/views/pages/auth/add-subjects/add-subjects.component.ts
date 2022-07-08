import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateservicesService } from '../../growon/create/services/createservices.service';
import { LoadingService } from '../../loader/loading/loading.service';

@Component({
  selector: 'kt-add-subjects',
  templateUrl: './add-subjects.component.html',
  styleUrls: ['./add-subjects.component.scss']
})
export class AddSubjectsComponent implements OnInit {
  @Input() classList
  @Input() mapedValue;
  @Input() addMappingFlag;
  subjects: any;
  subjectForm: FormGroup;
  displayedColumns: string[] = ['class', 'subject'];
  subjectData = {}
  removeSubject: any = []
  oldSubject: any = []
  subjectAddedFlag: boolean = true
  dataSource = new MatTableDataSource<any>();
  updateFlag: boolean = false;
  newAdded: any = [];
  notexistCheck: any;


  constructor(private _formBuilder: FormBuilder, public apiService: CreateservicesService,
    private modalService: NgbModal, private cdr: ChangeDetectorRef, private activeModal: NgbActiveModal, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.dataSource.data = this.classList
    console.log(this.dataSource.data)
    console.log(this.dataSource.filteredData)
    console.log(this.mapedValue)
    if (this.mapedValue) {
      for (let i = 0; i < this.mapedValue.length; i++) {
        if (this.mapedValue[i].subject) {
          for (let j = 0; j < this.mapedValue[i].subject.length; j++) {
            this.updateFlag = true
            if (!this.subjectData[this.mapedValue[i].classs]) {
              this.subjectData[this.mapedValue[i].classs] = []
              this.oldSubject[this.mapedValue[i].classs] = []
            }
            this.subjectData[this.mapedValue[i].classs].push(this.mapedValue[i].subject[j])
            this.oldSubject[this.mapedValue[i].classs].push(this.mapedValue[i].subject[j])
          }
        }
      }
      console.log(this.subjectData)
    }
    this.getSubjects()
    this.loadingService.hide();
  }
  getSubjects() {
    this.apiService.getSubjects().subscribe((response: any) => {
      this.subjects = response.body.data
    })
  }

  setCheckbox(index, subName, value) {
    if (value.target.checked) {
      if (!this.subjectData[this.dataSource.filteredData[index].className]) {
        this.subjectData[this.dataSource.filteredData[index].className] = []
      }
      this.subjectData[this.dataSource.filteredData[index].className].push(subName);
      this.notexistCheck = '';
      if (!this.addMappingFlag) {
        //if seleccted subject exist in removeSubject than Remove it
        if (this.oldSubject[this.dataSource.filteredData[index].className]) {
          this.notexistCheck = this.oldSubject[this.dataSource.filteredData[index].className].filter(element => {
            if (element == subName) {
              return true;
            }
          });
        }
        if (this.notexistCheck && this.notexistCheck.length) {
          let removeData = this.removeSubject[this.dataSource.filteredData[index].className].filter((item) => item === subName)
          console.log("remove filter Data", removeData)
          if (removeData && removeData.length) {
            this.removeSubject[this.dataSource.filteredData[index].className] = this.removeSubject[this.dataSource.filteredData[index].className].filter((item) => item !== subName)
            for (let item of Object.keys(this.removeSubject)) {
              if (this.removeSubject[item].length == 0) {
                delete this.removeSubject[item]
              }
            }
          }
        } else {
          //add selected subject in new added array
          if (!this.newAdded[this.dataSource.filteredData[index].className]) {
            this.newAdded[this.dataSource.filteredData[index].className] = []
          }
          this.newAdded[this.dataSource.filteredData[index].className].push(subName)
        }

      }
      console.log("add new Added", this.newAdded);
      console.log("remove from remove list", this.removeSubject)
    } else {
      console.log()
      this.subjectData[this.dataSource.filteredData[index].className] = this.subjectData[this.dataSource.filteredData[index].className].filter((item) => item !== subName)
      for (let item of Object.keys(this.subjectData)) {
        if (this.subjectData[item].length == 0) {
          delete this.subjectData[item]
        }
      }

      // adding subject to remove subject list
      if (!this.addMappingFlag) {
        console.log("Old Subject List", this.oldSubject)
        //check if it's exist in old selected subject Data
        if (this.oldSubject[this.dataSource.filteredData[index].className]) {
          this.notexistCheck = this.oldSubject[this.dataSource.filteredData[index].className].filter((f) => f === subName)
          console.log(this.notexistCheck)
        }
        if (this.notexistCheck && this.notexistCheck.length) {
          if (!this.removeSubject[this.dataSource.filteredData[index].className]) {
            this.removeSubject[this.dataSource.filteredData[index].className] = []
          }
          this.removeSubject[this.dataSource.filteredData[index].className].push(subName)
        }
        else {
          //remove selected subject  from new added
          this.newAdded[this.dataSource.filteredData[index].className] = this.newAdded[this.dataSource.filteredData[index].className].filter((item) => item !== subName)
          for (let item of Object.keys(this.newAdded)) {
            if (this.newAdded[item].length == 0) {
              delete this.newAdded[item]
            }
          }
        }
      }
      console.log("remove new Added", this.newAdded);
      console.log(this.subjectData)
      console.log("added to remove list", this.removeSubject)
    }
    if (Object.keys(this.subjectData).length == this.dataSource.filteredData.length) {
      this.subjectAddedFlag = false
    } else {
      this.subjectAddedFlag = true
    }
  }
  addSubject() {
    console.log(this.removeSubject)
    console.log(this.newAdded)
    !this.addMappingFlag ? this.activeModal.close({ subjectData: this.subjectData, removeList: this.removeSubject, newAdded: this.newAdded }) : this.activeModal.close({ subjectData: this.subjectData })

  }

}
