import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondaryClassSelected'
})
export class SecondaryClassSelectedPipe implements PipeTransform {

  transform(list,selectedList,selectedvalueIndex ,i)  {
    if(list && list.length ){
      return list.filter(
        a => selectedList.findIndex(v => v.get('secondClasses').value == a.classId) == -1  ||
        a.classId == selectedList[selectedvalueIndex].get('secondClasses').value
      );
    }
    return [];
  }

}
