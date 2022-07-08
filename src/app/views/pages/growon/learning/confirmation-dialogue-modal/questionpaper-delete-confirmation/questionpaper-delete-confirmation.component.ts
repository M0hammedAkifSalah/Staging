import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kt-questionpaper-delete-confirmation',
  templateUrl: './questionpaper-delete-confirmation.component.html',
  styleUrls: ['./questionpaper-delete-confirmation.component.scss']
})
export class QuestionpaperDeleteConfirmationComponent implements OnInit {

  constructor(private activeModal:NgbActiveModal) { }

  ngOnInit(): void {
  }

  confirm(value){
    this.activeModal.close(value)
  }

}
