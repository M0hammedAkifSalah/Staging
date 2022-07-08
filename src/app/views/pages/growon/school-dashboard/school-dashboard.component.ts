import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CreateservicesService } from '../create/services/createservices.service';
import { Chart } from 'node_modules/chart.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { defaultRoles } from '../roles-permission/default-roles';
import { Router } from '@angular/router';
import { LoadingService } from '../../loader/loading/loading.service';
import { LearningService } from '../learning/services/learning.service';


@Component({
  selector: 'kt-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.scss']
})
export class SchoolDashboardComponent implements OnInit {
  max = 100;
  min = 0;
  boysK = 0;
  girlsK = 0;
  boysCount = 0;
  girlsCount = 0;
  dup: any[] = []
  totalQuestions = 0;
  user_id: any[] = []
  user_num: any[] = []
  users: any[] = []
  isOwner: boolean;
  q_id: any[] = []
  q_num: any[] = []
  donutChart: any[] = []

  classes: any[] = []
  parentDetails: any[] = []
  dashboards: any[] = []
  task: any[] = []
  announcement: any[] = []
  assignment: any[] = []
  event: any[] = []
  checkList: any[] = []
  livePoll: any[] = []
  schools: any[] = []
  teachersData: any[] = []
  teachersDisplayedColumns: string[] = ['name', 'mobile', 'gender', 'class', 'school',];
  displayedColumns2: string[] = ['class', 'student', 'boys', 'girls'];
  displayedColumns: string[] = ['school', 'students', 'boys', 'girls'];
  filterDisplayedColumns: string[] = ['id', 'num', 'progress'];
  taskDisplayedColumns: string[] = ['id', 'num', 'progress'];
  parentsDisplayedColumns: string[] = ['name', 'mobile', 'student'];
  schoolDisplayedColumns: string[] = ['school', 'schoolCode', 'students', 'boys', 'girls']
  schoolDataSource = new MatTableDataSource<any>();
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  casteDataSource = new MatTableDataSource<any>();
  motherTongueDataSource = new MatTableDataSource<any>();
  bloodGroupDataSource = new MatTableDataSource<any>();
  transportDataSource = new MatTableDataSource<any>();
  illnessDataSource = new MatTableDataSource<any>();
  wearGlassDataSource = new MatTableDataSource<any>();
  teacherDataSource = new MatTableDataSource<any>();
  parentDataSource = new MatTableDataSource<any>();
  TaskDataSource = new MatTableDataSource<any>();
  teachers: any[] = []
  faculty: any[] = []
  genders: any[] = []
  boys: any[] = []
  girls: any[] = []
  girlsNo: any[] = []
  boysNo: any[] = []
  gender: any[] = []
  religion: any[] = []
  totalSchool = 0;
  totalStudent = 0;
  totalTeacher = 0;
  totalManagement = 0;
  totalBranch = 0;
  selected = 'caste';
  illness: any[] = []
  transport: any[] = []
  wearGlass: any[] = []
  motherTongue: any[] = []
  bloodGroup: any[] = []
  intersection: any[] = []
  studentNo = 0;
  parentNo = 0;
  managementNo = 0;
  teacherNo = 0;
  branchNo = 0;
  columnChart: any[] = []
  // @ViewChild(MatPaginator, { read: '', static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: '', static: true }) sort: MatSort;
  questions: any[] = []
  value: any[] = []
  subject: any[] = []
  pieChartOptions = {
    responsive: true
  }
  @ViewChild('MatPaginator') paginator: MatPaginator;
  @ViewChild('MatPaginator1') paginator1: MatPaginator;
  @ViewChild('MatPaginator2') paginator2: MatPaginator;
  schoolCode: any;
  schoolImage: any = null;
  parentPageIndex: number = 1;
  parentPageSize: number = 5;
  schoolId: any;
  parentResultLength: number = 0;
  teacherResultLength: number = 0;
  studentResultLength: number = 0;
  studnetPageIndex: number = 1;
  studentPageSize: number = 5;
  teacherPageIndex: number = 1;
  teacherPageSize: number = 5;
  totalFaculty: number = 0;
  totalBranchCount: number = 0;
  schoolStudentLenght: any;
  constructor(public apiService: CreateservicesService, private cdr: ChangeDetectorRef, public router: Router, private loaderService: LoadingService, private learningService: LearningService
  ) { }

  async ngOnInit() {

    this.schoolCode = localStorage.getItem('schoolCode')
    this.schoolImage = localStorage.getItem('schoolImage')
    this.getdashboarddetails();
    await this.getParentDetails();
    await this.getAdmin();
    await this.getFacultyCount();
    await this.getBranchCount();
    await this.getAdminTableDetails();
    await this.getStudentReligion();
    await this.getStudentBloodgroup();
    await this.getStudentIllness();
    await this.getStudentMotherTongue();
    await this.getStudentTransport();
    await this.getStudentWearGlass();
    await this.getParentDetails();
    await this.getallinstitutes();
    await this.getallteachers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator2;
    this.dataSource2.paginator = this.paginator;
    this.parentDataSource.paginator = this.paginator;
    this.teacherDataSource.paginator = this.paginator;
    this.schoolDataSource.paginator = this.paginator1;
    this.parentDataSource.sort = this.sort;
  }
  getFacultyCount() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      this.learningService.getFacultyCount(id).subscribe(
        (response: any) => {
          this.totalFaculty = response.body.result;
          this.loaderService.hide();
        }, error => {
          this.loaderService.hide();
        }
      )
    } else {
      this.learningService.getFacultyCount().subscribe(
        (response: any) => {
          this.totalFaculty = response.body.result;
          this.loaderService.hide();
        }, error => {
          this.loaderService.hide();
        }
      )
    }

  }
  getBranchCount() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    if (user.user_info[0].school_id) {
      let obj = {
        _id: user.user_info[0].school_id
      }
      this.learningService.getBranchCount(obj).subscribe(
        (response: any) => {
          this.totalBranchCount = response.body.result;
          this.loaderService.hide();
        }, error => {
          this.loaderService.hide();
        }
      )
    }
    else {
      this.loaderService.hide();
    }
  }
  getdashboarddetails() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.dashboardData(id,5,0).subscribe((res:any)=>{
      console.log('DashboardData',res)
      this.totalStudent = res.body.data.totalStudents
      this.boysCount = res.body.data.totalBoys;
      this.girlsCount = res.body.data.totalGirls;
    })
    this.apiService.getdashboarddetail(id).subscribe((data: any) => {
      this.dashboards = data;
      console.log('DataList',data)
      console.log(this.totalStudent, "studentNo details")
      this.TaskDataSource = data.data;
      console.log(this.dashboards, "dashboards details")
      this.questions = data.question;


      console.log(this.questions, "questions")

      // this.users = data.user;
      this.users = data.user.filter(usr => {
        return usr._id == "5fd2f18f9cc6537951f0b35c" || usr._id == "5fd1c839ba54044664ff8c10"
          || usr._id == "5fd1c86cba54044664ff8c11" || usr._id == "5fd1c885ba54044664ff8c12"
          || usr._id == "5fd1c755ba54044664ff8c0f"
      })

      console.log(this.users, "this.users")
      this.questions.forEach(element => {
        if (element._id == "threeColMtf") {
          element._id = `${element.num} - Match the following with 3 columns`

        }
        if (element._id == "sentenceSequencing") {
          element._id = `${element.num}- Sentence Sequencing`

        }
        if (element._id == "twoColMtf") {
          element._id = `${element.num} - Match the following with 2 columns`

        }
        if (element._id == "NumericalRange") {
          element._id = `${element.num} - Numerical Range`

        }
        if (element._id == "objectives") {
          element._id = `${element.num} - Objectives`

        }
        if (element._id == "fillInTheBlanks") {
          element._id = `${element.num} - Fill In The Blanks`

        }
        if (element._id == "sequencingQuestion") {
          element._id = `${element.num} - Sequencing Question`

        }
        if (element._id == "freeText") {
          element._id = `${element.num} - Free Text`

        }
        if (element._id == "mcq") {
          element._id = `${element.num} - Multiple Choice Questions`

        }
        if (element._id == "trueOrFalse") {
          element._id = `${element.num} - True Or False`

        }
        this.q_id.push(element._id);
        this.q_num.push(element.num);

      })
      for (let i = 0; i < this.questions.length; i++) {
        this.totalQuestions += this.q_num[i];
      }
      console.log(this.totalQuestions, "totalQuestions")

      this.users.forEach(element => {

        if (element._id == "5fd1c839ba54044664ff8c10") {
          element._id = "Management"
          // element.num = this.managementNo;
        }
        if (element._id == "5fd2f18f9cc6537951f0b35c") {
          element._id = "Teachers"
          // element.num = this.teacherNo;
        }
        if (element._id == "5fd1c755ba54044664ff8c0f") {
          element._id = "Principal"
        }

        // if (this.user_id == this.user_id) {


        // }

        this.user_id.push(element._id);
        this.user_num.push(element.num);
      })


      this.user_id.push('Students', 'Parents',);
      this.user_num.push(this.totalStudent, this.totalStudent);

      var ctx = document.getElementById('myChart');
      var myChart = new Chart(ctx, {
        type: 'pie',

        data: {
          labels: [] = this.q_id,
          datasets: [{
            label: '# of Votes',


            data: [] = this.q_num,
            backgroundColor: [
              '#855CF8',
              '#E289F2',
              '#ACB9FF',
              '#263238',
              '#855CF8',
              '#E289F2',
              '#ACB9FF',
              '#263238',
              '#855CF8',
              '#E289F2',

            ],
            borderColor: [
              '#855CF8',
              '#E289F2',
              '#ACB9FF',
              '#263238',
              '#855CF8',
              '#E289F2',
              '#ACB9FF',
              '#263238',
              '#855CF8',
              '#E289F2',

            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          legend: {



            position: 'right'

          }
        }
      });
      var ctx = document.getElementById('myChart2');
      var myChart2 = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [] = this.user_id,
          datasets: [{
            // label: '# of Votes',


            data: [] = this.user_num,
            backgroundColor: [
              '#BEDEFF',
              '#BCFFEB',
              '#FFBDC4',
              '#f9f09f',
              '#D3BCFF',
              '#BEDEFF',
              '#BCFFEB',
              '#FFBDC4',
              '#f9f09f',
              '#D3BCFF',
              '#BEDEFF',
              '#BCFFEB',


            ],
            borderColor: [
              '#BEDEFF',
              '#BCFFEB',
              '#FFBDC4',
              '#f9f09f',
              '#D3BCFF',
              '#BEDEFF',
              '#BCFFEB',
              '#FFBDC4',
              '#f9f09f',
              '#D3BCFF',
              '#BEDEFF',
              '#BCFFEB',

            ],
            borderWidth: 1
          }],

        },
        options: {
          showTooltips: true,

          onAnimationComplete: function() {
            this.showTooltip(this.datasets[0].points, true);
          },
          tooltipEvents: [],
          responsive: true,
          cutoutPercentage: 80,
          legend: {
            position: 'bottom'
          },
          hover: {
            animationDuration: 0
          }, tooltips: {
            enabled: true
          },
          // elements: {
          //   center: {
          //     text: '22',
          //     color: '#464E5F;', // Default is #000000
          //     fontStyle: 'normal', // Default is Arial
          //     fontWeight: 'bold',
          //     sidePadding: 20, // Default is 20 (as a percentage)
          //     minFontSize: 10, // Default is 20 (in px), set to false and text will not wrap.
          //     lineHeight: 33 // Default is 25 (in px), used for when text wraps

          //   }
          // }
        }
      });



      this.boysK = data.studentNumber.filter(usr => {
        return usr._id == "Male"
      })
      this.girlsK = data.studentNumber.filter(usr => {
        return usr._id == "Female"
      })
     /*  if (this.boysK && this.boysK[0].num) {
        this.boysCount = this.boysK[0].num;
      }
      if (this.girlsK && this.girlsK[0] ? this.girlsK[0].num : '') {
        this.girlsCount = this.girlsK[0].num;
      } */


    })
    this.loaderService.hide();
  }
  getAdminTableDetails() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    if (localStorage.getItem('schoolId')) {
      this.isOwner = true;
    } else {
      this.isOwner = false
    }
    if (this.isOwner) {

      id = localStorage.getItem('schoolId');
      this.apiService.getStudentListCount(id).subscribe(
        (response: any) => {
          this.studentResultLength = response.length;
          this.cdr.detectChanges();
          console.log(response);
          console.log(this.studentResultLength);

        }
      )

    }

    // this.apiService.getAdminTableDetails(id).subscribe((data: any) => {

    //   this.schools = data.groups;
    //   this.dataSource.data = this.schools;
    //   console.log(this.schools, "admin")
    // })
    this.apiService.dashboardData(id,5,0).subscribe((res:any)=>{
      this.dataSource.data = res.body.data.classes
    })
    this.apiService.getAdminTableDetails(id, this.studnetPageIndex, this.studentPageSize).subscribe((data: any) => {
      if (!id) {
        this.schools = data.groups;
        this.schoolDataSource.data = data.groups
        
        this.schoolStudentLenght = data.count;
        this.loaderService.hide();
      }
      else {
        
        this.schools = data.groups;
        console.log('DATASTUDENT',this.schools)
        //this.dataSource.data = this.schools;
        console.log('New DataSource',this.dataSource.data)
        this.loaderService.hide();
      }
      console.log(this.schools, "admin")
    },
      error => {
        this.loaderService.hide();
      }
    )
  }

  studentonPageFired(event) {
    this.loaderService.show();
    this.studnetPageIndex = event.pageIndex ;
    this.studentPageSize = event.pageSize;
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      this.apiService.dashboardData(id,this.studentPageSize,this.studnetPageIndex).subscribe((res:any)=>{
        this.dataSource.data = res.body.data.classes
      })
      this.apiService.getAdminTableDetails(id, this.studnetPageIndex, this.studentPageSize).subscribe((data: any) => {
        this.schools = data.groups;
        //this.dataSource.data = this.schools;
        this.cdr.detectChanges();
        console.log(this.schools, "admin")
        this.loaderService.hide();
      })
    }
    this.loaderService.hide();
  }
  // getStudentTableDetails() {

  //   let userInfo = localStorage.getItem('info');
  //   let user = JSON.parse(userInfo);
  //   let id: any;

  //   if (user.user_info[0].school_id) {
  //     id = user.user_info[0].school_id;

  //   }
  //   this.apiService.getSchoolTableDetails(id).subscribe((data: any) => {
  //     this.classes = data.groups;
  //     this.dataSource2.data = this.classes;
  //   })

  // }
  getStudentReligion() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getReligion(id).subscribe((data: any) => {
      this.religion = data.data;
      this.casteDataSource = data.data;
      this.loaderService.hide();
    },
      error => {
        this.loaderService.hide();
      })
  }
  getStudentIllness() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }

    this.apiService.getIllness(id).subscribe((data: any) => {
      this.illness = data.data;


      console.log(this.illness, "illness details")
      this.illnessDataSource = data.data;
      this.loaderService.hide();
    },
      error => {
        this.loaderService.hide();
      })
  }
  getStudentTransport() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getTransport(id).subscribe((data: any) => {
      this.transport = data.data;
      this.transportDataSource = data.data;
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }
  getStudentWearGlass() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getWearGlass(id).subscribe((data: any) => {
      this.wearGlass = data.data;
      this.wearGlassDataSource = data.data;
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }
  getStudentMotherTongue() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getMotherTongue(id).subscribe((data: any) => {
      this.motherTongue = data.data;
      this.motherTongueDataSource = data.data;
      this.loaderService.show();
    }, error => {
      this.loaderService.hide();
    })
  }

  getStudentBloodgroup() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getBloodGroup(id).subscribe((data: any) => {
      this.bloodGroup = data.data;
      this.bloodGroupDataSource = data.data;
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }
  applyFilter(event: Event) {
    this.loaderService.show();
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.parentDataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.paginator = this.paginator;
    if (this.teacherDataSource.paginator) {
      this.teacherDataSource.paginator.firstPage();
    }
    this.teacherDataSource.paginator = this.paginator;
    if (this.parentDataSource.paginator) {
      this.parentDataSource.paginator.firstPage();
    }
    this.parentDataSource.paginator = this.paginator;
    this.parentDataSource.sort = this.sort;
    this.loaderService.hide();
  }

  // applyFilter2() {


  //   if (this.dataSource2.paginator) {
  //     this.dataSource2.paginator.firstPage();
  //   }
  // }
  // applyFilter3() {

  //   if (this.teacherDataSource.paginator) {
  //     this.teacherDataSource.paginator.firstPage();
  //   }

  // }
  // applyFilter4() {

  //   if (this.parentDataSource.paginator) {
  //     this.parentDataSource.paginator.firstPage();
  //   }

  // }


  getAdmin() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let schoolId = localStorage.getItem('schoolId');
    let id: any;
    if (user.user_info[0].profile_type.role_name == 'admin') {

      this.isOwner = false
    }
    else if (schoolId) {
      this.isOwner = true;
    }
    else {
      this.isOwner = false;
    }
    this.loaderService.hide();
  }

  getallinstitutes() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getallinstitute(id).subscribe((data: any) => {
      this.totalSchool = data.body.data.length;
      this.intersection = data.body.data[0].schoolName
      localStorage.setItem('schoolname',`${this.intersection}`);
      this.cdr.detectChanges();
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })

  }

  // getallstudents() {



  //   let userInfo = localStorage.getItem('info');
  //   let user = JSON.parse(userInfo);
  //   let id: any;

  //   if (user.user_info[0].school_id) {
  //     id = user.user_info[0].school_id;

  //   } /* else {
  //     id = user.user_info[0].id;

  //   } */
  //   this.apiService.getallstudent(id,1,1000).subscribe((data: any) => {
  //     this.totalStudent = data.body.data.length;
  //     console.log(this.totalStudent, "this.totalStudent")
  //   })


  // }

  // getallBranch() {



  //   let userInfo = localStorage.getItem('info');
  //   let user = JSON.parse(userInfo);
  //   let id: any;

  //   if (user.user_info[0].school_id.branch_id) {
  //     id = user.user_info[0].school_id.branch_id;

  //   } /* else {
  //     id = user.user_info[0].id;

  //   } */
  //   this.apiService.getallBranch(id).subscribe((data: any) => {
  //     // this.totalBranch = data.length;

  //     console.log(data, "this.totalBranch")

  //   })


  // }

  getallteachers() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let reqData;
    let paginationReqData
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      reqData = {
        'profile_type': defaultRoles.find(role => { return role.role_name == 'teacher' }).id,
        "school_id": id
      }
      paginationReqData = {
        'profile_type': defaultRoles.find(role => { return role.role_name == 'teacher' }).id,
        "school_id": id,
        "page": this.teacherPageIndex,
        "limit": this.teacherPageSize,
      }
    }
    else {
      id = user.user_info[0].id;
      reqData = {
        'profile_type': defaultRoles.find(role => { return role.role_name == 'teacher' }).id
      }
      paginationReqData = {
        'profile_type': defaultRoles.find(role => { return role.role_name == 'teacher' }).id,
        "page": this.teacherPageIndex,
        "limit": this.teacherPageSize,
      }
    }


    let data = reqData;
    this.apiService.getallteacher(data).subscribe((data: any) => {
      this.teacherResultLength = data.body.result;
      this.totalTeacher = data.body.result;
      this.cdr.detectChanges();
    })
    this.apiService.getallteacher(paginationReqData).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data) {
          this.teachersData = response.body.data;
          // this.totalTeacher = this.teachersData.length;
          this.teacherDataSource.data = this.teachersData;
          console.log('Teachers',this.teacherDataSource.data)
          this.cdr.detectChanges();
          this.loaderService.hide();
        }
      },
      error => {
        this.loaderService.hide();
      }
    )
  }

  teacheronPageFired(event) {
    this.loaderService.show();
    this.teacherPageIndex = event.pageIndex + 1;
    this.teacherPageSize = event.pageSize;
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let reqData;
    let paginationReqData
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      paginationReqData = {
        'profile_type': defaultRoles.find(role => { return role.role_name == 'teacher' }).id,
        "school_id": id,
        "page": this.teacherPageIndex,
        "limit": this.teacherPageSize,
      }
    }
    else {
      id = user.user_info[0].id;
      paginationReqData = {
        'profile_type': defaultRoles.find(role => { return role.role_name == 'teacher' }).id,
        "page": this.teacherPageIndex,
        "limit": this.teacherPageSize,
      }
    }
    this.apiService.getallteacher(paginationReqData).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data) {
          this.teachersData = response.body.data;
          // this.totalTeacher = this.teachersData.length;
          this.teacherDataSource.data = this.teachersData;
          this.loaderService.hide();
        }
        else {
          this.loaderService.hide();
        }

      }, error => {
        this.loaderService.hide();
      }
    )


  }
  getParentDetails() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let reqData;
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      this.schoolId = localStorage.getItem('schoolId');
      reqData = {
        "school_id": id,
        "page": this.parentPageIndex,
        "limit": this.parentPageSize,
      }
    }

    let allData = {
      "school_id": id,
    }
    let data = reqData;
    this.apiService.getParentTableDetails(allData).subscribe(
      (response: any) => {
        if (response && response.body) {
          this.parentResultLength = response.body.count;
        }
      }
    )
    this.apiService.getParentTableDetails(data).subscribe((data: any) => {
      if (data.body.count > 0) {
        this.parentDetails = data.body.result
        this.parentDataSource = new MatTableDataSource(this.parentDetails);
        this.parentDataSource.paginator = this.paginator;
        this.parentDataSource.sort = this.sort;
        this.cdr.detectChanges();
        this.loaderService.show();
      } else {
        this.loaderService.hide();
      }
    },
      error => {
        this.loaderService.hide();
      })
  }

  onPageFired(event) {
    this.loaderService.show();
    this.parentPageIndex = event.pageIndex + 1;
    this.parentPageSize = event.pageSize;
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id;
    let paginationReqData;
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      paginationReqData = {
        // 'profile_type': defaultRoles.find(role => { return role.role_name == 'teacher' }).id,
        "school_id": id,
        "page": this.parentPageIndex,
        "limit": this.parentPageSize,
      }
    }
    else {
      id = user.user_info[0].id;
      paginationReqData = {
        // 'profile_type': defaultRoles.find(role => { return role.role_name == 'teacher' }).id,
        "page": this.parentPageIndex,
        "limit": this.parentPageSize,
      }
    }
    // let reqData = {
    //   "school_id": this.schoolId,
    //   "page": this.parentPageIndex,
    //   "limit": this.parentPageSize,
    // }
    this.apiService.getParentTableDetails(paginationReqData).subscribe(
      (response: any) => {
        // then you can assign data to your dataSource like so
        if (response && response.body && response.body.result && response.body.result.length) {
          this.parentDetails = response.body.result
          this.parentDataSource = new MatTableDataSource(this.parentDetails);
          // this.parentDataSource.data = this.parentDetails;
          this.parentDataSource.paginator = this.paginator;
          this.parentDataSource.sort = this.sort;
          this.cdr.detectChanges();
          console.log(this.parentDataSource.filteredData, "data source")
          this.loaderService.hide();
        }
        else {
          this.loaderService.hide();
        }
      }, error => {
        this.loaderService.hide()
      }
    )
  }
  // getallmanagements() {

  //   let userInfo = localStorage.getItem('info');
  //   let user = JSON.parse(userInfo);
  //   let id: any;
  //   let reqData;
  //   if (user.user_info[0].school_id) {
  //     id = user.user_info[0].school_id;
  //     reqData = {
  //       // "profile_type": "5fd2f18f9cc6537951f0b35c"
  //       'profile_type': defaultRoles.find(role => { return role.role_name == 'management' }).id,
  //       "school_id": id
  //     }
  //   }
  //   else {
  //     id = user.user_info[0].id;
  //     reqData = {
  //       // "profile_type": "5fd2f18f9cc6537951f0b35c"
  //       'profile_type': defaultRoles.find(role => { return role.role_name == 'management' }).id
  //     }
  //   }

  //   let data = reqData;
  //   this.apiService.getallmanagement(data).subscribe((data: any) => {
  //     this.totalManagement = data.body.data.length;

  //     console.log(this.totalManagement, "this.totalManagement")

  //   })

  // }



}
