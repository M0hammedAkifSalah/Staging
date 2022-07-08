import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "comprehensionFormValidate",
})
export class ComprehensionFormValidPipe implements PipeTransform {
  transform(formArr, form1, refreshCount): boolean {
    console.log("CALLED..");

    if (formArr && formArr.length && form1) {
      if (form1.questionType && form1.questionType.value == "comprehension") {
        if (
          !form1.board.valid ||
          !form1.class.valid ||
          !form1.syllabus.valid ||
          !form1.subject.valid ||
          !form1.chapter.valid ||
          !form1.questionType.valid ||
          !form1.negativeScore.valid ||
          !form1.totalMarks.valid ||
          !form1.question.valid
        ) {
          return false;
        }

        if (formArr && formArr.length) {
          for (let question of formArr) {
            if(!question.totalMarks){
              return false;
            }
            if (
              question.questionType == "objectives" ||
              question.questionType == "mcq" ||
              question.questionType == "fillInTheBlanks" ||
              question.questionType == "optionLevelScoring"
            ) {
              if (
                question.question &&
                question.answer &&
                question.answer.length &&
                question.options &&
                question.options.length
              ) {
                for (let opt of question.options) {
                  if (question.optionsType == "text") {
                    if (
                      !opt.value
                    ) {
                      return false;
                    }
                  } else {
                    if (
                      !opt.value ||
                      !opt.file_text
                    ) {
                      return false;
                    }
                  }
                }

                for (let opt of question.answer) {
                  if (!opt.value ||
                    (question.questionType == "optionLevelScoring" &&
                      !opt.score)) {
                    return false;
                  }
                }
              } else {
                return false;
              }

              return true; // Objectives/ Mcq / FillInTheBlanks / OptionLevelScoring valid.......
            } else if (
              question.questionType == "twoColMtf" ||
              question.questionType == "threeColMtf" ||
              question.questionType == "3colOptionLevelScoring"
            ) {
              if (
                question.question &&
                question.answer &&
                question.answer.length &&
                question.options &&
                question.options.length
              ) {
                for (let opt of question.options) {
                  if (question.optionsType == "text") {
                    if (!opt.value) {
                      return false;
                    }
                  } else {
                    if (!opt.value || !opt.file_text) {
                      return false;
                    }
                  }
                }

                for (let opt of question.answer) {
                  if (!opt.value || (question.questionType == '3colOptionLevelScoring' && !opt.score)) {
                    return false;
                  }
                }

                if (
                  question.matchOptions.column1 &&
                  question.matchOptions.column1.length &&
                  question.matchOptions.column2 &&
                  question.matchOptions.column2.length
                ) {
                  for (let op of question.matchOptions.column1) {
                    if (
                      question.optionsType == "text"
                    ) {
                      if (!op.value) {
                        return false;
                      }
                    } else {
                      if (
                        !op.value ||
                        !op.file_text
                      ) {
                        return false;
                      }
                    }
                  }

                  for (let op of question.matchOptions.column2) {
                    if (question.optionsType == "text") {
                      if (
                        !op.value
                      ) {
                        return false;
                      }
                    } else {
                      if (
                        !op.value ||
                        !op.file_text
                      ) {
                        return false;
                      }
                    }
                  }

                  if (
                    question.questionType == "threeColMtf" ||
                    question.questionType == "3colOptionLevelScoring"
                  ) {
                    if (
                      question.matchOptions.column3 &&
                      question.matchOptions.column3.length
                    ) {
                      for (let op of question.matchOptions.column3) {
                        if (question.optionsType == "text") {
                          if (
                            !op.value
                          ) {
                            return false;
                          }
                        } else {
                          if (
                            !op.value ||
                            !op.file_text
                          ) {
                            return false;
                          }
                        }
                      }
                    } else {
                      return false;
                    }
                  }
                } else {
                  return false;
                }
              } else {
                return false;
              }

              return true; // Two and three col / 3ColOptionLevelScoring valid......
            } else if (question.questionType == "trueOrFalse") {
              if (
                !question.question ||
                !question.answer ||
                !question.answer.length
              ) {
                return false;
              }

              return true; // True false valid......
            } else if (question.questionType == "NumericalRange") {
              if (
                !question.question ||
                !question.answer ||
                !question.answer.length ||
                question.answer[0].minValue == undefined ||
                question.answer[0].minValue == null ||
                question.answer[0].maxValue == undefined ||
                question.answer[0].maxValue == null ||
                !question.answer[0].value
              ) {
                return false;
              }

              return true; // Num range valid....
            } else if (question.questionType == "freeText") {
              if (question.question) {
                return true;
              } else {
                return false;
              }
            }
          }
        } else {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  }
}
