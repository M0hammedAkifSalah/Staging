
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { Observable } from 'rxjs';
import { CreateservicesService } from 'src/app/views/pages/growon/create/services/createservices.service';
import { LoadingService } from '../../../loader/loading/loading.service';
import { AddMultipleSectionRequest, details } from './model/addmultiplesectionrequest.model';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SectionDeleteConfirmationComponent } from './section-delete-confirmation/section-delete-confirmation.component';


@Component({
  selector: 'kt-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  classes: any[] = [];
  sections: any[] = [];
  addSectionForm: FormGroup;
  addSingleSectionForm: FormGroup;
  formLoaded: boolean = false;
  @ViewChildren('allSelected') private allSelected: QueryList<MatOption>;
  addMultipleRequest: AddMultipleSectionRequest = <AddMultipleSectionRequest>{};
  displayedColumns: string[] = ['className', 'sectionList'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  classDetailstable: any[] = []; s

  constructor(private formbuilder: FormBuilder, private apiService: CreateservicesService,
    private loaderService: LoadingService, private modalService:NgbModal) { }

  ngOnInit(): void {
    this.loadinstitute();
  }

  loadinstitute()
  {
    this.loaderService.show();
    this.classDetailstable=[];
    this.getallinstitutes().subscribe((response: any) => {
      this.classes = response.body.data[0].classList;
      this.classes.forEach((x,i) => {
        let classDetails = { className: '', classId: '', sectionList: '' }
        // this.getAllSectionList[i].className=x.className;
        // this.getAllSectionList[i].classId=x.classId;
        // this.getAllSectionList[i].sectionList=x.sectionList;
        classDetails.className = x.className;
        classDetails.classId = x.classId;
        classDetails.sectionList='';
        x.section.forEach((x: any, i: number) => {
          if (i != 0) {
            classDetails.sectionList += ',' + x.name;
          }
          else {
            classDetails.sectionList += x.name;
          }
        })
        this.classDetailstable.push(classDetails);
      })

      this.dataSource = new MatTableDataSource<any>(this.classDetailstable);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.classes, "this.classes");
      this.loaderService.hide();
      if (this.classes.length > 0) {
        this.initializeForm();
        this.initializeSingleSectionForm();
      }
      else {
        alert("No class found please import");
      }
    })
  }

  getallinstitutes(): Observable<any> {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    return this.apiService.getallinstitute(id);
  }

  initializeForm() {
    this.addSectionForm = this.formbuilder.group({
      details: this.formbuilder.array([])
    })
    this.classes.forEach(x => {
      this.classDetails().push(this.newClassDetails(x));
    })
    this.formLoaded = true;
  }

  initializeSingleSectionForm() {
    this.addSingleSectionForm = this.formbuilder.group({
      sectionName: ['', Validators.required],
      sectionDescription: ['',],
    })
  }

  classDetails(): FormArray {
    return this.addSectionForm.get("details") as FormArray
  }

  newClassDetails(x: any): FormGroup {
    return this.formbuilder.group({
      className: [x.className, Validators.required],
      classId: [x.classId, Validators.required],
      sectionName: [''],
    })
  }

  deleteUser(row){
    const modalRef=this.modalService.open(SectionDeleteConfirmationComponent);
    modalRef.componentInstance.row=row;
    modalRef.componentInstance.classlist=this.classes
    modalRef.result.then(()=>{
      this.loadinstitute();
    })
  }

  addSection() {
    if (this.addSingleSectionForm.valid) {
      this.loaderService.show();
      if (this.sections.length > 0) {
        if (this.sections.filter(x => x.name == this.addSingleSectionForm.controls.sectionName.value).length > 0) {
          alert("Section with same name already exist");
          this.loaderService.hide();
        }
        else {
          this.add();
          this.addSingleSectionForm.reset();
          this.loaderService.hide();
        }
      }
      else {
        this.add();
        this.addSingleSectionForm.reset();
        this.loaderService.hide();
      }
    }
    else {
      this.addSingleSectionForm.markAllAsTouched();
    }
  }

  add() {
    let sectionDetails = { name: "", desc: "" };
    sectionDetails.name = this.addSingleSectionForm.controls.sectionName.value;
    sectionDetails.desc = this.addSingleSectionForm.controls.sectionDescription.value;
    this.sections.push(sectionDetails);
  }

  tosslePerOne(i: number) {
    if (this.allSelected.toArray()[i].selected) {
      this.allSelected.toArray()[i].deselect();
      return false;
    }
    let classDetails = this.addSectionForm.controls.details as FormArray;
    let classGroup = classDetails.controls[i] as FormGroup;
    if (classGroup.controls.sectionName.value.length == this.sections.length) {
      this.allSelected.toArray()[i].select();
    }
  }

  toggleAllSelection(i: number) {
    let classDetails = this.addSectionForm.controls.details as FormArray;
    let classGroup = classDetails.controls[i] as FormGroup;
    if (this.allSelected.toArray()[i].selected) {
      classGroup.controls.sectionName
        .patchValue([...this.sections, 0]);
    } else {
      classGroup.controls.sectionName.patchValue([]);
    }
  }

  mapMultipleSections() {
    if (this.addSectionForm.valid) {
      this.loaderService.show();
      this.addMultipleRequest.School_id = localStorage.getItem('schoolId');
      this.addMultipleRequest.data = [];
      let classDetails = this.addSectionForm.controls.details as FormArray;
      let classGroup = classDetails.controls as FormGroup[];
      classGroup.forEach(ctrl => {
        let details: details = <details>{};
        details.class_id = ctrl.controls.classId.value;
        details.sectionList = [];
        if (ctrl.controls.sectionName.value != "" && ctrl.controls.sectionName.value.length > 0) {
          ctrl.controls.sectionName.value.forEach((x: any) => {
            if (x != 0) {
              details.sectionList.push(x);
            }
          })
        }
        this.addMultipleRequest.data.push(details);
      })
      console.log(this.addMultipleRequest);
      this.apiService.createSection(this.addMultipleRequest).subscribe((x: any) => {
        console.log(x);
        if (x.body.status == 201) {
          Swal.fire('Success', 'Updated', 'success');
          this.loadinstitute();
        }
        else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        }
      })
    }
    else {
      this.addSectionForm.markAllAsTouched();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
