import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeScript'
})
export class SafeScriptPipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) {}

  transform(value) {
    return this.sanitized.bypassSecurityTrustStyle(value);
  }

}
