import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingService } from './loading/loading.service';

@Component({
  selector: 'kt-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  showLoader: Subject<boolean> = this.loaderService.showLoader;

  constructor(private loaderService:LoadingService) { }

  ngOnInit(): void {
  }

}
