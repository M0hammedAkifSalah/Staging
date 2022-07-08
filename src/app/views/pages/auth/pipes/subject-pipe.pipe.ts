import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subjectPipe'
})
export class SubjectPipePipe implements PipeTransform {

  transform(list, value) {
    if (list && list.length && value) {
      return list.filter(f => f === value).length
    }
    return false;
  }

}
