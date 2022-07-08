export class ComprehensionArrayModel {
  questionType: string = '';
  practiceAndTestQuestion: string = '';
  difficultyLevel: string = '';
  question: string = '';
  optionsType: string = '';
  options: OptionsModel[] = [];
  answer: any[] = [];
  matchOptions: MatchOptionsModel = new MatchOptionsModel();
  reason: string = '';
  totalMarks: number;
  negativeMarks: number;
  optionsAdded: boolean = false;
  colAdded: boolean = false;
  setAns: boolean = false;
  images: Array<any>;
  colImages:MatchOptionsModel = new MatchOptionsModel();

  // imageupload: any;
}

export class OptionsModel{
  value: string;
  file_text: string;
  score!: number;
  disabled: boolean = true;
  type: string;

  constructor(){
    this.value = '';
    this.file_text = '';
  }
}

export class MatchOptionsModel{
  column1: Array<any>;
  column2: Array<any>;
  column3: Array<any>;
}

