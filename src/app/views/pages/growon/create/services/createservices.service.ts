import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { DataResponse } from '../../model/dataresponse.model';
import { map, delay } from 'rxjs/operators';
import { SchoolDetails } from '../../model/schooldetails.model';
import { AddMultipleSectionRequest } from '../../learning/section/model/addmultiplesectionrequest.model';
@Injectable({
  providedIn: 'root'
})
export class CreateservicesService {

  constructor(private http: HttpClient) { }
  reqHeaders: any = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'token': localStorage.getItem('userToken')
  });
  // getId
  getId() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    if (user.user_info[0].school_id) {
      return localStorage.getItem('schoolId');
    }
    // else {
    //   // return user.user_info[0].repository[0].id;
    //   // return user.user_info[0]._id;

    //   return user.user_info[0].profile_type.repository[0].id;
    // }
    else if (user.user_info[0]._id) {
      return user.user_info[0]._id;
    }
    else {

      return user.user_info[0].repository[0].id;

    }
  }

  searchStudentData(data){
    const apiUrl= `${environment.apiUrl}api/v1/student/search`;
    return this.http.post(apiUrl,data, { headers: this.reqHeaders, observe: 'response' })
  }

  getGlobalTeacherCount(data){
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/userByRoleCount`
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  getGlobalPrincipleAndManagementForRepo(data) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/userByRole`
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  //get principle and management of repo
  getPrincipleAndManagementForRepo(data, id) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/userByRole?school_id=${id}`
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }
  getTeacherCount(data,id){
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/userByRoleCount?school_id=${id}`
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  //create Role
  createRole(data) {
    const apiUrl = `${environment.apiUrl}api/v1/role`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  //check status for student
  changeActiveDeactiveStatus(id, data) {
    const apiUrl = `${environment.apiUrl}api/v1/student/studentActiveStatus/${id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  //check for other user username
  changeActiveDeactiveStatusAllUser(id, data) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/userActiveStatus/${id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  //deactivate School
  deactiveActiveSchool(data){
    const apiUrl=`${environment.apiUrl}api/v1/school/updateActiveStatus`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  // Register School
  registerSchool(data: object) {
    const apiUrl = `${environment.apiUrl}api/v1/school`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  checkUserExist(data) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/validationCheck`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  addSchoolNew(data: any): Observable<any> {
    const apiUrl = `${environment.apiUrl}api/v1/school/newapi/create/addschool`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  updateStepForm(data, id) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/updatestate/${id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  updateBoard(data) {
    const apiUrl = `${environment.apiUrl}api/v1/board/byschool/${this.getId()}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  updateSyllabus(data) {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus/byschool/${this.getId()}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  updateSubject(data) {
    const apiUrl = `${environment.apiUrl}api/v1/subject/byschool/${this.getId()}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  // get list of schools
  getSchools() {
    const apiUrl = `${environment.apiUrl}api/v1/school`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });

  }
  // Register Teacher
  signUp(data: object) {
    const apiUrl = `${environment.apiUrl}api/v1/signUp`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // Register managemenent
  registerManagement(data) {
    const apiUrl = `${environment.apiUrl}api/v1/management`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // Register student
  registerStudent(data) {
    const apiUrl = `${environment.apiUrl}api/v1/student`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  //add Section
  addSection(data) {
    const apiUrl = `${environment.apiUrl}api/v1/section`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }
  // Get all students
  getAllStudents() {
    const apiUrl = `${environment.apiUrl}api/v1/student`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  //get SchoolType
  getSchoolType() {
    const apiUrl = `${environment.apiUrl}api/v1/stype`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  // get Countries
  getCountries() {
    const apiUrl = `${environment.apiUrl}api/v1/country`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // Get states
  getStates() {
    const apiUrl = `${environment.apiUrl}api/v1/state`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // Get cities
  getCities() {
    const apiUrl = `${environment.apiUrl}api/v1/city?limit=2500`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // File upload
  uploadFile(data: FormData) {
    let reqHdrs = new HttpHeaders({
      'token': localStorage.getItem('userToken')
    });
    const apiUrl = `${environment.apiUrl}api/v1/file/upload`;
    return this.http.post(apiUrl, data, { headers: reqHdrs, observe: 'response' });
  }

  bulkUploadstudent(data) {
    let reqHdrs = new HttpHeaders({
      'token': localStorage.getItem('userToken')
    });
    const apiUrl = `${environment.apiUrl}api/v1/student/bulkupload`;
    return this.http.post(apiUrl, data, { headers: reqHdrs, observe: 'response' });
  }
  // getbranch
  getBranch(id) {
    const apiUrl = `${environment.apiUrl}api/v1/school/${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // getClass

  getClasses() {
    const apiUrl = `${environment.apiUrl}api/v1/class?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  // getallinstitute(id) {
  //   const apiUrl = id ? `${environment.apiUrl}api/v1/school/${id}` : `${environment.apiUrl}api/v1/school/`;
  //   return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  // }

  //getSections
  getSections(classId: string) {
    const apiUrl = `${environment.apiUrl}api/v1/section?repository.id=${this.getId()}&class_id=${classId}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' })
  }

  getAllSections() {
    const apiUrl = `${environment.apiUrl}api/v1/section?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' })
  }

  createSection(reqParams: AddMultipleSectionRequest) {
    const apiUrl = `${environment.apiUrl}api/v1/section`;
    return this.http.post(apiUrl, reqParams, { headers: this.reqHeaders, observe: 'response' })
  }

  //get Syllabus By class Id
  getSyllabusById(id) {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus?repository.mapDetails.classId=${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' })
  }
  // get syllabus
  getSyllabus() {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // get subjects
  getSubjects() {
    const apiUrl = `${environment.apiUrl}api/v1/subject?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  getBoardByClassId(id) {
    const apiUrl = `${environment.apiUrl}api/v1/board/getmapdata?repository.id=${this.getId()}&repository.mapDetails.classId=${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' })
  }

  getMappedData() {
    const apiUrl = `${environment.apiUrl}api/v1/school/mapping/${this.getId()}`
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' })
  }

  //get syllabus by class Id
  getSyllabusByClassId(classId, boardId) {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus/getmapdata?repository.id=${this.getId()}&repository.mapDetails.classId=${classId}&repository.mapDetails.boardId=${boardId}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' })
  }

  //get Subject By class Id
  getSubjectsByClassId(classId, boardId, syllabusId) {
    const apiUrl = `${environment.apiUrl}api/v1/subject/getmapdata?repository.id=${this.getId()}&repository.mapDetails.classId=${classId}&repository.mapDetails.boardId=${boardId}&repository.mapDetails.syllabuseId=${syllabusId}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' })
  }

  //get InstitutionType
  getInstitutionType() {
    const apiUrl = `${environment.apiUrl}api/v1/stype`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' })
  }

  //get management
  getallmanagement(data) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/user/dashboard`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  updateManagement(data: any) {
    console.log(data)
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/${data._id}`;

    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }


  //get Institute
  getallinstitute(id: string): Observable<any> {
    const apiUrl = id ? `${environment.apiUrl}api/v1/school/${id}` : `${environment.apiUrl}api/v1/school/`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  getallinstitutenew(id: string, flag: boolean): Observable<any> {
    if (flag) {
      const apiUrl = id ? `${environment.apiUrl}api/v1/school/newapi/getschool/${id}` : `${environment.apiUrl}api/v1/school/newapi/getschool`;
      return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
    }
    else {
      let res: DataResponse = {
        "data": [
          {
            "syllabusId": "fadfdsf",
            "syllabus": "",
            "branch": [
              {
                "name": "sdsdsdsds",
                "address": "dsdsdsd",
                "branchCity": "MUMBAI",
                "branchCityId": "vndvnjdnj",
                "branchState": "MAHARASHTRA",
                "branchStateId": "4324234",
                "contact": 34343453434,
                "branchPincode": 400097,
                "branchCountry": "India",
                "branchCountryId": "India"
              }
            ],
            "repository": [],
            "createdAt": "2021-04-29T09:03:17.194Z",
            "updatedAt": "2021-04-29T09:03:17.194Z",
            "_id": "608db7b76946f448a8b6be34",
            "schoolName": "francis school",
            "schoolImage": "",
            "schoolWebsite": "www.google.com",
            "schoolEmail": "francis123@gmail.com",
            "board": "test 78 board",
            "boardId": "603c4e1858478c34385a2ce5",
            "contact_number": 8838268362,
            "institutionType": "Government",
            "institutionTypeId": "1",
            "address": "kurarvillage",
            "cityId": "603c54d76381e5384d50f25e",
            "city": "mumbai",
            "state": "603c4e1858478c34385a2ce5",
            "stateId": "603c4e1858478c34385a2ce5",
            "country": "5fddd8189b6e1c097f568dc2",
            "countryId": "5fddd8189b6e1c097f568dc2",
            "pincode": "400097",
            "__v": 0
          },
          {
            "syllabusId": "fadfdsf",
            "syllabus": "",
            "branch": [
              {
                "name": "sdsdsdsds",
                "address": "dsdsdsd",
                "branchCity": "MUMBAI",
                "branchCityId": "vndvnjdnj",
                "branchState": "MAHARASHTRA",
                "branchStateId": "4324234",
                "contact": 34343453434,
                "branchPincode": 400097,
                "branchCountry": "India",
                "branchCountryId": "India"
              }
            ],
            "repository": [],
            "createdAt": "2021-04-29T09:03:17.194Z",
            "updatedAt": "2021-04-29T09:03:17.194Z",
            "_id": "608db7b76946f448a8b6be34",
            "schoolName": "francis school",
            "schoolImage": "",
            "schoolWebsite": "www.google.com",
            "schoolEmail": "francis123@gmail.com",
            "board": "test 78 board",
            "boardId": "603c4e1858478c34385a2ce5",
            "contact_number": 8838268362,
            "institutionType": "Government",
            "institutionTypeId": "1",
            "address": "kurarvillage",
            "cityId": "603c54d76381e5384d50f25e",
            "city": "mumbai",
            "state": "603c4e1858478c34385a2ce5",
            "stateId": "603c4e1858478c34385a2ce5",
            "country": "5fddd8189b6e1c097f568dc2",
            "countryId": "5fddd8189b6e1c097f568dc2",
            "pincode": "400097",
            "__v": 0
          },
          {
            "syllabusId": "fadfdsf",
            "syllabus": "",
            "branch": [
              {
                "name": "sdsdsdsds",
                "address": "dsdsdsd",
                "branchCity": "MUMBAI",
                "branchCityId": "vndvnjdnj",
                "branchState": "MAHARASHTRA",
                "branchStateId": "4324234",
                "contact": 34343453434,
                "branchPincode": 400097,
                "branchCountry": "India",
                "branchCountryId": "India"
              }
            ],
            "repository": [],
            "createdAt": "2021-04-29T09:03:17.194Z",
            "updatedAt": "2021-04-29T09:03:17.194Z",
            "_id": "608db7b76946f448a8b6be34",
            "schoolName": "francis school",
            "schoolImage": "",
            "schoolWebsite": "www.google.com",
            "schoolEmail": "francis123@gmail.com",
            "board": "test 78 board",
            "boardId": "603c4e1858478c34385a2ce5",
            "contact_number": 8838268362,
            "institutionType": "Government",
            "institutionTypeId": "1",
            "address": "kurarvillage",
            "cityId": "603c54d76381e5384d50f25e",
            "city": "mumbai",
            "state": "603c4e1858478c34385a2ce5",
            "stateId": "603c4e1858478c34385a2ce5",
            "country": "5fddd8189b6e1c097f568dc2",
            "countryId": "5fddd8189b6e1c097f568dc2",
            "pincode": "400097",
            "__v": 0
          },
          {
            "syllabusId": "fadfdsf",
            "syllabus": "",
            "branch": [
              {
                "name": "sdsdsdsds",
                "address": "dsdsdsd",
                "branchCity": "MUMBAI",
                "branchCityId": "vndvnjdnj",
                "branchState": "MAHARASHTRA",
                "branchStateId": "4324234",
                "contact": 34343453434,
                "branchPincode": 400097,
                "branchCountry": "India",
                "branchCountryId": "India"
              }
            ],
            "repository": [],
            "createdAt": "2021-04-29T09:03:17.194Z",
            "updatedAt": "2021-04-29T09:03:17.194Z",
            "_id": "608db7b76946f448a8b6be34",
            "schoolName": "francis school",
            "schoolImage": "",
            "schoolWebsite": "www.google.com",
            "schoolEmail": "francis123@gmail.com",
            "board": "test 78 board",
            "boardId": "603c4e1858478c34385a2ce5",
            "contact_number": 8838268362,
            "institutionType": "Government",
            "institutionTypeId": "1",
            "address": "kurarvillage",
            "cityId": "603c54d76381e5384d50f25e",
            "city": "mumbai",
            "state": "603c4e1858478c34385a2ce5",
            "stateId": "603c4e1858478c34385a2ce5",
            "country": "5fddd8189b6e1c097f568dc2",
            "countryId": "5fddd8189b6e1c097f568dc2",
            "pincode": "400097",
            "__v": 0
          },
          {
            "syllabusId": "fadfdsf",
            "syllabus": "",
            "branch": [
              {
                "name": "sdsdsdsds",
                "address": "dsdsdsd",
                "branchCity": "MUMBAI",
                "branchCityId": "vndvnjdnj",
                "branchState": "MAHARASHTRA",
                "branchStateId": "4324234",
                "contact": 34343453434,
                "branchPincode": 400097,
                "branchCountry": "India",
                "branchCountryId": "India"
              }
            ],
            "repository": [],
            "createdAt": "2021-04-29T09:03:17.194Z",
            "updatedAt": "2021-04-29T09:03:17.194Z",
            "_id": "608db7b76946f448a8b6be34",
            "schoolName": "francis school",
            "schoolImage": "",
            "schoolWebsite": "www.google.com",
            "schoolEmail": "francis123@gmail.com",
            "board": "test 78 board",
            "boardId": "603c4e1858478c34385a2ce5",
            "contact_number": 8838268362,
            "institutionType": "Government",
            "institutionTypeId": "1",
            "address": "kurarvillage",
            "cityId": "603c54d76381e5384d50f25e",
            "city": "mumbai",
            "state": "603c4e1858478c34385a2ce5",
            "stateId": "603c4e1858478c34385a2ce5",
            "country": "5fddd8189b6e1c097f568dc2",
            "countryId": "5fddd8189b6e1c097f568dc2",
            "pincode": "400097",
            "__v": 0
          },
          {
            "syllabusId": "fadfdsf",
            "syllabus": "",
            "branch": [
              {
                "name": "sdsdsdsds",
                "address": "dsdsdsd",
                "branchCity": "MUMBAI",
                "branchCityId": "vndvnjdnj",
                "branchState": "MAHARASHTRA",
                "branchStateId": "4324234",
                "contact": 34343453434,
                "branchPincode": 400097,
                "branchCountry": "India",
                "branchCountryId": "India"
              }
            ],
            "repository": [],
            "createdAt": "2021-04-29T09:03:17.194Z",
            "updatedAt": "2021-04-29T09:03:17.194Z",
            "_id": "608db7b76946f448a8b6be34",
            "schoolName": "francis school",
            "schoolImage": "",
            "schoolWebsite": "www.google.com",
            "schoolEmail": "francis123@gmail.com",
            "board": "test 78 board",
            "boardId": "603c4e1858478c34385a2ce5",
            "contact_number": 8838268362,
            "institutionType": "Government",
            "institutionTypeId": "1",
            "address": "kurarvillage",
            "cityId": "603c54d76381e5384d50f25e",
            "city": "mumbai",
            "state": "603c4e1858478c34385a2ce5",
            "stateId": "603c4e1858478c34385a2ce5",
            "country": "5fddd8189b6e1c097f568dc2",
            "countryId": "5fddd8189b6e1c097f568dc2",
            "pincode": "400097",
            "__v": 0
          },
          {
            "syllabusId": "fadfdsf",
            "syllabus": "",
            "branch": [
              {
                "name": "sdsdsdsds",
                "address": "dsdsdsd",
                "branchCity": "MUMBAI",
                "branchCityId": "vndvnjdnj",
                "branchState": "MAHARASHTRA",
                "branchStateId": "4324234",
                "contact": 34343453434,
                "branchPincode": 400097,
                "branchCountry": "India",
                "branchCountryId": "India"
              }
            ],
            "repository": [],
            "createdAt": "2021-04-29T09:03:17.194Z",
            "updatedAt": "2021-04-29T09:03:17.194Z",
            "_id": "608db7b76946f448a8b6be34",
            "schoolName": "francis school",
            "schoolImage": "",
            "schoolWebsite": "www.google.com",
            "schoolEmail": "francis123@gmail.com",
            "board": "test 78 board",
            "boardId": "603c4e1858478c34385a2ce5",
            "contact_number": 8838268362,
            "institutionType": "Government",
            "institutionTypeId": "1",
            "address": "kurarvillage",
            "cityId": "603c54d76381e5384d50f25e",
            "city": "mumbai",
            "state": "603c4e1858478c34385a2ce5",
            "stateId": "603c4e1858478c34385a2ce5",
            "country": "5fddd8189b6e1c097f568dc2",
            "countryId": "5fddd8189b6e1c097f568dc2",
            "pincode": "400097",
            "__v": 0
          },
          {
            "syllabusId": "fadfdsf",
            "syllabus": "",
            "branch": [
              {
                "name": "sdsdsdsds",
                "address": "dsdsdsd",
                "branchCity": "MUMBAI",
                "branchCityId": "vndvnjdnj",
                "branchState": "MAHARASHTRA",
                "branchStateId": "4324234",
                "contact": 34343453434,
                "branchPincode": 400097,
                "branchCountry": "India",
                "branchCountryId": "India"
              }
            ],
            "repository": [],
            "createdAt": "2021-04-29T09:03:17.194Z",
            "updatedAt": "2021-04-29T09:03:17.194Z",
            "_id": "608db7b76946f448a8b6be34",
            "schoolName": "francis school",
            "schoolImage": "",
            "schoolWebsite": "www.google.com",
            "schoolEmail": "francis123@gmail.com",
            "board": "test 78 board",
            "boardId": "603c4e1858478c34385a2ce5",
            "contact_number": 8838268362,
            "institutionType": "Government",
            "institutionTypeId": "1",
            "address": "kurarvillage",
            "cityId": "603c54d76381e5384d50f25e",
            "city": "mumbai",
            "state": "603c4e1858478c34385a2ce5",
            "stateId": "603c4e1858478c34385a2ce5",
            "country": "5fddd8189b6e1c097f568dc2",
            "countryId": "5fddd8189b6e1c097f568dc2",
            "pincode": "400097",
            "__v": 0
          },
          {
            "syllabusId": "fadfdsf",
            "syllabus": "",
            "branch": [
              {
                "name": "sdsdsdsds",
                "address": "dsdsdsd",
                "branchCity": "MUMBAI",
                "branchCityId": "vndvnjdnj",
                "branchState": "MAHARASHTRA",
                "branchStateId": "4324234",
                "contact": 34343453434,
                "branchPincode": 400097,
                "branchCountry": "India",
                "branchCountryId": "India"
              }
            ],
            "repository": [],
            "createdAt": "2021-04-29T09:03:17.194Z",
            "updatedAt": "2021-04-29T09:03:17.194Z",
            "_id": "608db7b76946f448a8b6be34",
            "schoolName": "francis school",
            "schoolImage": "",
            "schoolWebsite": "www.google.com",
            "schoolEmail": "francis123@gmail.com",
            "board": "test 78 board",
            "boardId": "603c4e1858478c34385a2ce5",
            "contact_number": 8838268362,
            "institutionType": "Government",
            "institutionTypeId": "1",
            "address": "kurarvillage",
            "cityId": "603c54d76381e5384d50f25e",
            "city": "mumbai",
            "state": "603c4e1858478c34385a2ce5",
            "stateId": "603c4e1858478c34385a2ce5",
            "country": "5fddd8189b6e1c097f568dc2",
            "countryId": "5fddd8189b6e1c097f568dc2",
            "pincode": "400097",
            "__v": 0
          },
          {
            "syllabusId": "fadfdsf",
            "syllabus": "",
            "branch": [
              {
                "name": "sdsdsdsds",
                "address": "dsdsdsd",
                "branchCity": "MUMBAI",
                "branchCityId": "vndvnjdnj",
                "branchState": "MAHARASHTRA",
                "branchStateId": "4324234",
                "contact": 34343453434,
                "branchPincode": 400097,
                "branchCountry": "India",
                "branchCountryId": "India"
              }
            ],
            "repository": [],
            "createdAt": "2021-04-29T09:03:17.194Z",
            "updatedAt": "2021-04-29T09:03:17.194Z",
            "_id": "608db7b76946f448a8b6be34",
            "schoolName": "francis school",
            "schoolImage": "",
            "schoolWebsite": "www.google.com",
            "schoolEmail": "francis123@gmail.com",
            "board": "test 78 board",
            "boardId": "603c4e1858478c34385a2ce5",
            "contact_number": 8838268362,
            "institutionType": "Government",
            "institutionTypeId": "1",
            "address": "kurarvillage",
            "cityId": "603c54d76381e5384d50f25e",
            "city": "mumbai",
            "state": "603c4e1858478c34385a2ce5",
            "stateId": "603c4e1858478c34385a2ce5",
            "country": "5fddd8189b6e1c097f568dc2",
            "countryId": "5fddd8189b6e1c097f568dc2",
            "pincode": "400097",
            "__v": 0
          },
        ]
      }
      return of(res);
    }
  }

  updateSchool(data: any, schoolId: string) {
    console.log(data)
    const apiUrl = `${environment.apiUrl}api/v1/school/newapi/updateschool/${schoolId}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  updateStudent(data: any) {
    console.log(data)
    const apiUrl = `${environment.apiUrl}api/v1/student/student/${data.student_id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // GetAllUsers
  getAllUsers(data) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/user`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // getallstudent(id) {
  //   const apiUrl = id ? `${environment.apiUrl}api/v1/student/?school_id=${id}` : `${environment.apiUrl}api/v1/student/`;
  //   return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });

  // }
  getGlobalStudentCount() {
    const apiUrl = `${environment.apiUrl}api/v1/student/dashboardCount`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  getGlobalStudentCountPostFilter(data) {
    const apiUrl = `${environment.apiUrl}api/v1/student/dashboardCount`;
    return this.http.post(apiUrl, data,{ headers: this.reqHeaders, observe: 'response' });
  }

  getGlobalStudentPagination(page, limit) {
    const apiUrl = `${environment.apiUrl}api/v1/student/dashboard?page=${page}&limit=${limit}`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' });
  }

  getGlobalStudentPaginationPostFilter(page, limit,data) {
    const apiUrl = `${environment.apiUrl}api/v1/student/dashboard?page=${page}&limit=${limit}`;
    return this.http.post(apiUrl,data, { headers: this.reqHeaders, observe: 'response' });
  }

  getStudentRecordCount(id) {
    const apiUrl = `${environment.apiUrl}api/v1/student/count/byschool/${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  getStudentRecordCountPostFilter(id,data) {
    const apiUrl = `${environment.apiUrl}api/v1/student/count/byschool/${id}`;
    return this.http.post(apiUrl, data,{ headers: this.reqHeaders, observe: 'response' });
  }

  getallstudent(id, page, count) {
    const apiUrl = id ? `${environment.apiUrl}api/v1/student/byschool/${id}/${page}/${count}` : `${environment.apiUrl}api/v1/student/dashboard`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });

  }

  getallstudentPostFilter(id, page, count,data) {
    const apiUrl = `${environment.apiUrl}api/v1/student/byschool/${id}/${page}/${count}`;
    return this.http.post(apiUrl, data,{ headers: this.reqHeaders, observe: 'response' });

  }

  getGlobalSections() {
    const apiUrl = `${environment.apiUrl}api/v1/section?page=1&limit=100000`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // getallstudent(id) {
  //   const apiUrl = `${environment.apiUrl}api/v1/student/dashboard/?school_id=${id}`;
  //   return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });

  // }
  getallBranch(id) {
    const apiUrl = `${environment.apiUrl}api/v1/class?repository.id=${id}`;
    // const apiUrl = `${environment.apiUrl}api/v1/dashboard/stats/school/branch?_id=${id}`;

    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });

  }
  // get boards
  getBoards() {
    const apiUrl = `${environment.apiUrl}api/v1/board?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  //get boards By class Id
  getBoardsByClassId(id) {
    const apiUrl = `${environment.apiUrl}api/v1/board?repository.mapDetails.classId=${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' })
  }

  // Add class
  addClass(data: object, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/class?repository.id=${repoId}&name=${name}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  //get teacher
  getallteacher(data,) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/user/dashboard`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  // getallstudent() {
  //   const apiUrl = `${environment.apiUrl}api/v1/student`;
  //   return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  // }

  // Get all students
  getdashboarddetail(id) {
    const apiUrl = id ? `${environment.apiUrl}api/v1/dashboard/stats?school_id=${id}` : `${environment.apiUrl}api/v1/dashboard/stats`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  parentNumberValidation(data){
    const apiUrl=`${environment.apiUrl}api/v1/student/parentNumberValidation`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  getStudentListCount(id) {
    const apiUrl = `${environment.apiUrl}api/v1/dashboard/stats/student/class/count/count?school_id=${id}`
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  getAdminTableDetails(id, page, limit) {
    const apiUrl = id ? `${environment.apiUrl}api/v1/dashboard/stats/student/class/count?school_id=${id}&page=${page}&limit=${limit}` : `${environment.apiUrl}api/v1/dashboard/stats/student/count/`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }
  // getAdminTableDetails(id) {
  //   const apiUrl = id ? `${environment.apiUrl}api/v1/dashboard/stats/student/class/count?school_id=${id}` : `${environment.apiUrl}api/v1/dashboard/stats/student/count/`;
  //   return this.http.get(apiUrl, { headers: this.reqHeaders });
  // }
  getSchoolTableDetails(id) {
    const apiUrl = `${environment.apiUrl}api/v1/dashboard/stats/student/class/count?school_id=${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  getParentTableDetails(data,) {
    const apiUrl = `${environment.apiUrl}api/v1/dashboard/stats/parentList`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  getFacultyList(id) {
    const apiUrl = `${environment.apiUrl}api/v1/dashboard/stats/facultyList`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  getGenderList(id) {
    const apiUrl = `${environment.apiUrl}api/v1/dashboard/stats/studentListCount`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  getReligion(id) {
    const apiUrl = id ? `${environment.apiUrl}api/v1/dashboard/stats/student/caste?school_id=${id}` : `${environment.apiUrl}api/v1/dashboard/stats/student/caste`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  getIllness(id) {

    const apiUrl = id ? `${environment.apiUrl}api/v1/dashboard/stats/student/illness?school_id=${id}` : `${environment.apiUrl}api/v1/dashboard/stats/student/illness`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  getTransport(id) {
    const apiUrl = id ? `${environment.apiUrl}api/v1/dashboard/stats/student/transport?school_id=${id}` : `${environment.apiUrl}api/v1/dashboard/stats/student/transport`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }
  getWearGlass(id) {
    const apiUrl = id ? `${environment.apiUrl}api/v1/dashboard/stats/student/wearglass?school_id=${id}` : `${environment.apiUrl}api/v1/dashboard/stats/student/wearglass`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }
  getMotherTongue(id) {
    const apiUrl = id ? `${environment.apiUrl}api/v1/dashboard/stats/student/motherTongue?school_id=${id}` : `${environment.apiUrl}api/v1/dashboard/stats/student/motherTongue`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  getBloodGroup(id) {
    const apiUrl = id ? `${environment.apiUrl}api/v1/dashboard/stats/student/bloodGr?school_id=${id}` : `${environment.apiUrl}api/v1/dashboard/stats/student/bloodGr`;
    return this.http.get(apiUrl, { headers: this.reqHeaders });
  }

  deleteUser(data) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/deleteUser`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  //Update Branch
  updateBranch(id,data){
    const apiUrl = `${environment.apiUrl}api/v1/branch/${id}`;
    return this.http.put(apiUrl,data,{ headers: this.reqHeaders, observe: 'response' })
  }

  getSchool(id:string){
    const apiUrl = `${environment.apiUrl}api/v1/school/${id}`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' })
  }

  getSectionbyClass(classId:string,){
    const apiUrl = `${environment.apiUrl}api/v1/section?class_id=${classId}&repository.id=${localStorage.getItem('schoolId')}`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' })
  }
  dashboardData(id:string,limit:number,page:number){
    const apiUrl = `${environment.apiUrl}api/v1/dashboard/stats/school/${id}/classgendercount?limit=${limit}&page=${page}`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' })
  }
  getPayments(id:string){
    const apiUrl = `${environment.apiUrl}api/v1/school/payment/${id}`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' })
  }
  verifyPayment(data:any){
    const apiUrl = `${environment.apiUrl}api/v1/razorpay/verifyOrder`;
    return this.http.post(apiUrl,data,{ headers: this.reqHeaders, observe: 'response' })
  }
  activatePayment(date:any,id:string){
    const apiUrl = `${environment.apiUrl}api/v1/school/payment/${id}`;
    return this.http.put(apiUrl,date,{ headers: this.reqHeaders, observe: 'response' })
  }
}
