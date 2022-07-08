import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LearningService } from "../../../learning/services/learning.service";
@Component({
  selector: 'kt-edit-all-teacher',
  templateUrl: './edit-all-teacher.component.html',
  styleUrls: ['./edit-all-teacher.component.scss']
})
export class EditAllTeacherComponent implements OnInit {
  updateTeacherForm: FormGroup;
  @Input() teachers;
  constructor(public activeModal: NgbActiveModal, private apiService: LearningService) { }

  ngOnInit(): void {
    this.createUpdateForm();
    console.log(this.teachers)
  }

  createUpdateForm() {
    this.updateTeacherForm = new FormGroup({
      name: new FormControl(this.teachers.name, Validators.required),
      address: new FormControl(this.teachers.address, Validators.required),
      level: new FormControl(this.teachers.level),
      aadhar_card: new FormControl(this.teachers.aadhar_card),
      mobile: new FormControl(this.teachers.mobile, Validators.required),
      _id: new FormControl(this.teachers._id),
      gender: new FormControl(this.teachers.gender),
      marital_status: new FormControl(this.teachers.marital_status),
      email: new FormControl(this.teachers.email),

    });
  }

  updateTeacher() {
    this.apiService.updateTeacher(this.updateTeacherForm.value).subscribe((response: any) => {
      Swal.fire('Success', 'Updated', 'success');
      let element = document.getElementById('reset') as HTMLElement;
      element.click();
      this.activeModal.close();
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    })
  }


}
