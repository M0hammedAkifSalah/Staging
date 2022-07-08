import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeResourceUrl'
})
export class SafeResourceUrlPipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) {}

  transform(value) {
    return this.sanitized.bypassSecurityTrustResourceUrl(value);
  }

}
