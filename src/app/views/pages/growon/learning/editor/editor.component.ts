import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'kt-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @Input()editordata='';
  @Input()configType='all'
  @Output() valuechanges = new EventEmitter();
  public Editor = ClassicEditor;
  public config= {};
  public mathconfig = {
    toolbar: {
			items: [
        'MathType',
        'ChemType'
      ]
    }
  }
  public allConfig = {
  	toolbar: {
			items: [
        'heading',
        '|',
        'fontBackgroundColor',
        'fontColor',
        'fontSize',
        'fontFamily',
        'bold',
        'italic',
        'strikethrough',
        'underline',
        'subscript',
        'superscript',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        'alignment',
        '|',
        'MathType',
        'ChemType',
        'code',
        'blockQuote',
        'imageUpload',
        'imageInsert',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo'
      ]
    },
    language: 'en',
    image: {
      // Configure the available styles.
      styles: [
          'alignLeft', 'alignCenter', 'alignRight'
      ],

      // Configure the available image resize options.
      resizeOptions: [
          {
              name: 'imageResize:original',
              label: 'Original',
              value: null
          },
          {
              name: 'imageResize:50',
              label: '50%',
              value: '50'
          },
          {
              name: 'imageResize:75',
              label: '75%',
              value: '75'
          }
      ],

      // You need to configure the image toolbar, too, so it shows the new style
      // buttons as well as the resize buttons.
      toolbar: [
          'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
          '|',
          'imageResize',
          '|',
          'imageTextAlternative'
      ]
  },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    minHeight: '500px',
    // extraPlugins: [ this.TheUploadAdapterPlugin ],
    licenseKey: '', 
  };
  constructor(public http:HttpClient) { }

  ngOnInit(): void {
    if(this.configType=='all'){
      this.config=this.allConfig
    }else{
      this.config=this.mathconfig;
    }
  }

  onReady($event){
    $event.ui.getEditableElement().parentElement.insertBefore(
      $event.ui.view.toolbar.element,
      $event.ui.getEditableElement()
    );
    $event.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader,this.http);
    };
  }

  valueishanged(){
    this.valuechanges.emit(this.editordata);
  }

}

export class UploadAdapter {
  loader;  // your adapter communicates to CKEditor through this
  url='http://ec2-35-154-221-135.ap-south-1.compute.amazonaws.com:3000/'
  constructor(loader, public http:HttpClient ) {
    this.loader = loader;   
  }

 

  // Customized upload file method, can be packaged as needed
  uploadFile(file){
    // let name = '';
    let formData:FormData = new FormData();
    let headers = new Headers();
    // name = file.name;
    formData.append('file', file);
    // const dotIndex = name.lastIndexOf('.');
    // const fileName  = dotIndex>0?name.substring(0,dotIndex):name;
    // formData.append('name', fileName);
    // formData.append('source', user);
    // headers.append('Content-Type', 'multipart/form-data');
    // headers.append('Accept', 'application/json');
    // let params = new HttpParams();
    // const options = {
    //     params: params,
    //     reportProgress: true,
    // };
    let reqHdrs = new HttpHeaders({
      'token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYTdhN2I0ZjNiNzNjMDYwZDVkYzJmNSIsImlhdCI6MTYwNzY4MTcwNn0.t-oWFnZikwLOMv2ETGzkn0dvSmDFxVCX4ELRCZ2QJbI'
    });
    return this.http.post(this.url+'api/v1/file/upload',formData,{headers:reqHdrs,observe: 'response'});
  }


  upload() {
    let upload = new Promise((resolve, reject)=>{
      this.loader['file'].then(
          (data)=>{
              this.uploadFile(data)
              .subscribe(
                  (result:any)=>{
                      resolve({ default: 'https://grow-on.s3.ap-south-1.amazonaws.com/'+result.body.message})
                  },
                  (error)=>{
                      reject(data.msg);
                  }
              );
          }
      );
    });
    return upload;
}
abort() {
    console.log("abort")
}

}
