import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CreateservicesService } from '../../services/createservices.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'kt-bulk-upload-student',
  templateUrl: './bulk-upload-student.component.html',
  styleUrls: ['./bulk-upload-student.component.scss']
})
export class BulkUploadStudentComponent implements OnInit {
  profilePicture: any;
  constructor(public apiService: CreateservicesService, private cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {

  }
  uploadStudent() {

    // this.students = data.body.data;
    // this.dataSource.data = this.students;
    // console.log(this.profilePicture)



  }
  handleFileSelect(event) {


    const file = event.target.files[0];
    console.log(file);
    var reader = new FileReader();
    this.cdr.detectChanges();
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    console.log('formData', formData);
    this.apiService.bulkUploadstudent(formData).subscribe((response: any) => {
      console.log(' response', response);
      if (response.status === 201) {
        Swal.fire('Success', 'success', 'success');
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
        return;
      }
    });

    reader.readAsText(file);
    reader.onload = (event: any) => {
      const csv = event.target.result;
      console.log(csv);
      // this.cdr.detectChanges();
      // const formData = new FormData();
      // formData.append('file', event.target.result);
      // console.log('formData', formData);
      // this.apiService.bulkUploadstudent(formData).subscribe((response: any) => {
      //   console.log(' response', response);
      //   if (response.status === 201) {
      //     Swal.fire('Success', 'success', 'success');
      //   } else {
      //     Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
      //     return;
      //   }
      // }, (error) => {
      //   if (error.status == 400) {
      //     Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
      //     return;
      //   } else {
      //     Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
      //     return;
      //   }
      // });

    }
  }

}
