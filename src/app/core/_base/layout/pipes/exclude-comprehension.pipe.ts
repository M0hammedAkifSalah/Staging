import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "excludeComprehension",
})
export class ExcludeComprehensionPipe implements PipeTransform {
  transform(value) {
    if (value && value.length){
      return value.filter((f) => f.value != "comprehension");
    }
    else {
      return value;
    }
  }
}
