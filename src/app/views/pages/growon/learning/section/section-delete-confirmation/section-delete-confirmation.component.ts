import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from './../../../../loader/loading/loading.service';
import { LearningService } from './../../services/learning.service';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-section-delete-confirmation',
  templateUrl: './section-delete-confirmation.component.html',
  styleUrls: ['./section-delete-confirmation.component.scss']
})
export class SectionDeleteConfirmationComponent implements OnInit {
  @Input() row;
  @Input() classlist;
  deleteSection = {
    sectionIds: null,
    classId: null,
  }
  sectionList = [];
  constructor(private apiService: LearningService, private loaderService: LoadingService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.row)
    this.deleteSection.classId = this.row.classId
    if (this.classlist && this.classlist.length) {
      let itm = this.classlist.filter((x: any) => x.classId == this.row.classId)
      if (itm && itm.length) {
        this.sectionList = itm[0].section
      }
    }
  }

  deleteSections() {
    this.loaderService.show()
    this.apiService.deleteSections(this.deleteSection).subscribe(
      (response: any) => {
        if (response.body.data.sectionDeleted && response.body.data.sectionDeleted.length && response.body.data.sectionNotDeleted &&
          response.body.data.sectionNotDeleted.length) {
          Swal.fire({ icon: 'success', title: 'Deleteted', text: 'some sections are deleted some are mapped' });
        } else if (response.body.data.sectionDeleted && response.body.data.sectionDeleted.length) {
          Swal.fire({ icon: 'success', title: 'Deleteted', text: response.body.message });
        } else if (response.body.data.sectionNotDeleted && response.body.data.sectionNotDeleted.length){
          Swal.fire({ icon: 'error', title: 'Error', text: 'This section is already mapped, please delete the mapping first' });
        }
        this.activeModal.close();
        this.loaderService.hide();
      }, (err: any) => {
        this.loaderService.hide();
        Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
      }
    )
  }
}
