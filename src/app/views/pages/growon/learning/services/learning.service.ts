import { environment } from './../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import date from 'src/assets/plugins/formvalidation/src/js/validators/date';
@Injectable({
  providedIn: 'root'
})
export class LearningService {

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
    // else if (user.user_info[0]._id) {
    //   return user.user_info[0]._id;
    // }
    else {
        if(user.user_info[0].repository && user.user_info[0].repository.length){
          return user.user_info[0].repository[0].id
        }else{
          return user.user_info[0]._id;}
      // return user.user_info[0].repository[0].id;

    }
  }
  allQuestions: any;
  // test variable
  public testVariable: any = 'test variable from service';
  // Add class
  addClass(data: object, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/class?repository.id=${repoId}&name=${name}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  //get question paper for global admin
  getQuestionPaperForGlobalUsers(id){
    const apiUrl= `${environment.apiUrl}api/v1/actualQuestions?repository.id=${id}`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' })
  }

  getQuestionAttemptCount(data){
    const apiUrl= `${environment.apiUrl}api/v1/objectiveQuestion/globalgetQuesAttempCount`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })

  }

  //get Question Paper
  getQuestionPaper(){
    const apiUrl= `${environment.apiUrl}api/v1/actualQuestions`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' })
  }

  //getQuestionPaper by Id
  getQuestionPaperById(id){
    const apiUrl=`${environment.apiUrl}api/v1/actualQuestions/${id}`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' });
  }

  //create Question Paper
  createQuestionPaper(data){
    const apiUrl= `${environment.apiUrl}api/v1/actualQuestions`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
    
  }

  // questions based on global filter
  questionsBasedOnGlobalFilter(data){
    const apiUrl =`${environment.apiUrl}api/v1/objectiveQuestion/globalgetQuesCount`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  //question Based on filter
  questionsBasedOnFilter(data){
    const apiUrl =`${environment.apiUrl}api/v1/objectiveQuestion/getQuesCount`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  //content to download csv for question
  getQuestionCsvData(){
    const apiUrl =`${environment.apiUrl}api/v1/actualQuestions/mappingApi`;
    return this.http.post(apiUrl, { headers: this.reqHeaders, observe: 'response' })
  }

  questionsBasedOnFilterForImport(data){
    const apiUrl =`${environment.apiUrl}api/v1/objectiveQuestion/globalQuestionsImport`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  getFacultyCount(schoolId?){
    const apiUrl=schoolId?`${environment.apiUrl}api/v1/dashboard/stats/userByRole?school_id=${schoolId}`:`${environment.apiUrl}api/v1/dashboard/stats/userByRole`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' });
  }

  getBranchCount(data){
    const apiUrl=`${environment.apiUrl}api/v1/school/filter`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' })
  }

  importClass(classList) {
    const apiUrl = `${environment.apiUrl}api/v1/school/${this.getId()}`;
    return this.http.put(apiUrl, classList, { headers: this.reqHeaders, observe: 'response' });
  }
  // deleteClass
  deleteClass(id) {
    const apiUrl = `${environment.apiUrl}api/v1/class/${id}`;
    return this.http.delete(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // Register Teacher
  signUp(data: object) {
    const apiUrl = `${environment.apiUrl}api/v1/signUp`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  //get Institute
  getallinstitute(id) {
    const apiUrl = id ? `${environment.apiUrl}api/v1/school/${id}` : `${environment.apiUrl}api/v1/school/`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // updateClass
  updateClass(id, data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/class/${id}?repository.id=${repoId}&name=${name}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // get all Classes
  getClasses() {
    const apiUrl = `${environment.apiUrl}api/v1/class?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  // get all Classes
  getGlobalClasses() {
    const apiUrl = `${environment.apiUrl}api/v1/class?repository.repository_type=Global`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  // add question category
  addQuestionCategory(data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/question_category?repository.id=${repoId}&name=${name}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // update question category
  updateQuestionCategory(id, data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/question_category/${id}?repository.id=${repoId}&name=${name}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // get question category
  // getQuestionCategory() {
  //   const apiUrl = `${environment.apiUrl}api/v1/question_category?repository.id=${this.getId()}`;
  //   return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  // }
  getQuestionCategory() {
    const apiUrl = `${environment.apiUrl}api/v1/question_category/byrepositoryid/${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  getGlobalQuestionCategories() {
    const apiUrl = `${environment.apiUrl}api/v1/question_category?repository.repository_type=Global`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // add examType
  addExamType(data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/exam_type?repository.id=${repoId}&name=${name}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // get examType
  getExamType() {
    const apiUrl = `${environment.apiUrl}api/v1/exam_type?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  // get examType
  getGlobalExamTypes() {
    const apiUrl = `${environment.apiUrl}api/v1/exam_type?repository.repository_type=Global`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  //update Exam types
  updateExamTypes(id, data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/exam_type/${id}?repository.id=${repoId}&name=${name}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // add section
  addSection(data) {
    const apiUrl = `${environment.apiUrl}api/v1/section`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // get sections
  getSections() {
    const apiUrl = `${environment.apiUrl}api/v1/section?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // add syllabus
  addSyllabus(data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus?repository.id=${repoId}&name=${name}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  importSyllabus(data, sylId) {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus?_id=${sylId}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  // get syllabus
  getSyllabus() {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  getSchoolSyllabus() {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus/byschool/${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  //get global syllabuses
  getGlobalSyllabuses() {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus?repository.repository_type=Global`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // updateSyllabus
  updateSyllabus(id, data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus/${id}?repository.id=${repoId}&name=${name}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // add subjects
  addSubjects(data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/subject?repository.id=${repoId}&name=${name}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  importSubjects(data, subId) {
    const apiUrl = `${environment.apiUrl}api/v1/subject?_id=${subId}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  getSchoolSubjects() {
    const apiUrl = `${environment.apiUrl}api/v1/subject/byschool/${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // get subjects
  getSubjects() {
    const apiUrl = `${environment.apiUrl}api/v1/subject?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  


  getGlobalSubjects() {
    const apiUrl = `${environment.apiUrl}api/v1/subject?repository.repository_type=Global`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  updateSubject(id, data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/subject/${id}?repository.id=${repoId}&name=${name}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // add boards
  addBoards(data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/board`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  importBoards(data, boardId) {
    const apiUrl = `${environment.apiUrl}api/v1/board?_id=${boardId}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  // addBoards(data, repoId, name) {
  //   const apiUrl = `${environment.apiUrl}api/v1/board`;
  //   return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  // }
  // get boards
  getBoards() {
    const apiUrl = `${environment.apiUrl}api/v1/board`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  getSchoolBoards() {
    const apiUrl = `${environment.apiUrl}api/v1/board/byschool/${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // updateBoard
  // updateBoard(id, data, repoId, name) {
  //   const apiUrl = `${environment.apiUrl}api/v1/board/${id}?repository.id=${repoId}&name=${name}`;
  //   return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  // }
  updateBoard(id, data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/board/${id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // get all global  boards
  getGlobalBoards() {
    const apiUrl = `${environment.apiUrl}api/v1/board?repository.repository_type=Global`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // add chapter
  addChapter(data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/chapter?repository.id=${repoId}&name=${name}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // update chapter
  updateChapter(id, data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/chapter/${id}?repository.id=${repoId}&name=${name}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  //import media
  importMediaChapter(data){
    const apiUrl=`${environment.apiUrl}api/v1/chapter/filter/media`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  importMediaTopic(data){
    const apiUrl=`${environment.apiUrl}api/v1/topic/filter/media`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  // globalFilterChapterByClassSubject(data){
  //   const apiUrl= `${environment.apiUrl}api/v1/chapter/filter`;
  //   return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  // }

  //get chapter post import question filter for both
  getChapterImprotQuestionFilter(data){
    const apiUrl=`${environment.apiUrl}api/v1/chapter/filter`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  //get topic post import question filter for both
  getTopicImprotQuestionFilter(data){
    const apiUrl=`${environment.apiUrl}api/v1/topic/filter`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  //get chapter post import question filter for both
  getLearningOutcomeImprotQuestionFilter(data){
    const apiUrl=`${environment.apiUrl}api/v1/learnOutcome/filter`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  getChaptersBySubjectGlobalFilter(data) {
    const apiUrl = `${environment.apiUrl}api/v1/chapter/get`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  getTopicsByChapterGlobalFilter(data) {
    const apiUrl = `${environment.apiUrl}api/v1/topic/get`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  getLearningOutcomeByGlobalFilter(data) {
    const apiUrl = `${environment.apiUrl}api/v1/learnOutcome/get`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  getChaptersBySubject(classId, boardId, syllabusId, subjectId) {
    const apiUrl = `${environment.apiUrl}api/v1/chapter?repository.id=${this.getId()}&class_id=${classId}&board_id=${boardId}&syllabus_id=${syllabusId}&subject_id=${subjectId}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  getTopicByChapters(classId, boardId, syllabusId, subjectId, chapterId) {
    const apiUrl = `${environment.apiUrl}api/v1/topic?repository.id=${this.getId()}&class_id=${classId}&board_id=${boardId}&syllabus_id=${syllabusId}&subject_id=${subjectId}&chapter_id=${chapterId}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  getLearningOutcomeByTopic(classId, boardId, syllabusId, subjectId, chapterId, topicId) {
    const apiUrl = `${environment.apiUrl}api/v1/learnOutcome?repository.id=${this.getId()}&class_id=${classId}&board_id=${boardId}&syllabus_id=${syllabusId}&subject_id=${subjectId}&chapter_id=${chapterId}&topic_id=${topicId}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  //chapter pagination
  getChaptersByPagination(id, pageIndex, pageCount) {
    console.log(id, "id")
    const apiUrl = `${environment.apiUrl}api/v1/chapter/page?repository.id=${id}&page=${pageIndex}&limit=${pageCount}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  getChaptersByPaginationFilter(id, pageIndex, pageCount,data) {
    console.log(id, "id")
    const apiUrl = `${environment.apiUrl}api/v1/chapter/getAll?repository.id=${id}&page=${pageIndex}&limit=${pageCount}`;
    return this.http.post(apiUrl, data,{ headers: this.reqHeaders, observe: 'response' });
  }

  //topic Pagination
  getTopicByPagination(id, pageIndex, pageCount,data) {
    const apiUrl = `${environment.apiUrl}api/v1/topic/getAll?repository.id=${id}&page=${pageIndex}&limit=${pageCount}`;
    return this.http.post(apiUrl,data, { headers: this.reqHeaders, observe: 'response' });
  }

  getLearnOutComeByPagination(id, pageIndex, pageCount,data) {
    const apiUrl = `${environment.apiUrl}api/v1/learnOutcome/getAll?repository.id=${id}&page=${pageIndex}&limit=${pageCount}`;
    return this.http.post(apiUrl,data, { headers: this.reqHeaders, observe: 'response' });
  }

  getAllGlobalQuestionByPagination(id, pageIndex, pageCount,data) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/globalQuestions/getAll?repository.id=${id}&page=${pageIndex}&limit=${pageCount}`;
    return this.http.post(apiUrl, data,{ headers: this.reqHeaders, observe: 'response' });
  }

  getAllQuestionByPagination(id, pageIndex, pageCount,data) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/getAll??repository.id=${id}&page=${pageIndex}&limit=${pageCount}`;
    return this.http.post(apiUrl, data,{ headers: this.reqHeaders, observe: 'response' });
  }

  //teacher Pagination
  getAllTecherByPagination(data, id, pageIndex, pageCount) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/userByRole?school_id=${id}&page=${pageIndex}&limit=${pageCount}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  //globally Teacher Pagination
  getGlobalAllTeacherByPagination(data, pageIndex, pageCount) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/userByRole?page=${pageIndex}&limit=${pageCount}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }


  // get add chapters
  getChapters() {
    const apiUrl = `${environment.apiUrl}api/v1/chapter?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  getChaptersCount(data){
    const apiUrl = `${environment.apiUrl}api/v1/chapter/recordCount?repository.id=${this.getId()}`;
    return this.http.post(apiUrl,data, { headers: this.reqHeaders, observe: 'response' });
  }

  //get global chapters
  getGlobalChapters() {
    const apiUrl = `${environment.apiUrl}api/v1/chapter?repository.repository_type=Global`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // add topic
  addTopic(data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/topic?repository.id=${repoId}&name=${name}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // get add topics
  getTopics() {
    const apiUrl = `${environment.apiUrl}api/v1/topic?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  getTopicCount(data){
    const apiUrl = `${environment.apiUrl}api/v1/topic/recordCount?repository.id=${this.getId()}`;
    return this.http.post(apiUrl,data, { headers: this.reqHeaders, observe: 'response' })
  }

  //get global topics
  getGlobalTopics() {
    const apiUrl = `${environment.apiUrl}api/v1/topic?repository.repository_type=Global`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // editTopic
  updateTopic(id, data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/topic/${id}?repository.id=${repoId}&name=${name}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // add question type
  addQuestionType(data) {
    const apiUrl = `${environment.apiUrl}api/v1/question_category`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }


  // add learningOutcome
  addLearningOutcome(data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/learnOutcome?repository.id=${repoId}&name=${name}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  updateLearnOutcome(id, data, repoId, name) {
    const apiUrl = `${environment.apiUrl}api/v1/learnOutcome/${id}?repository.id=${repoId}&name=${name}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // get larningOutcome
  getAllLarningOutcomes() {
    const apiUrl = `${environment.apiUrl}api/v1/learnOutcome?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  getAllLearningOutcomeCount(data){
    const apiUrl = `${environment.apiUrl}api/v1/learnOutcome/recordCount?repository.id=${this.getId()}`;
    return this.http.post(apiUrl,data, { headers: this.reqHeaders, observe: 'response' });
  }

  //get global learing outcomes
  getGlobalLearningOutcomes() {
    const apiUrl = `${environment.apiUrl}api/v1/learnOutcome?repository.repository_type=Global`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // File upload
  uploadFile(data) {
    const apiUrl = `${environment.apiUrl}api/v1/file/upload`;
    let reqHdrs = new HttpHeaders({
      'token': localStorage.getItem('userToken')
    });
    return this.http.post(apiUrl, data, { headers: reqHdrs, observe: 'response' });
  }
  // add Question
  addQuestion(data) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // Filter chapters
  filterQuestionData(query) {
    // const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion?class=${data.class}&board=${data.board}&syllabus=${data.syl}&subject=${data.subject}&language=${data.language}&examType=${data.examType}&studentType=${data.studentType}`;
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion?${query}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // Copy
  filterQuestionDataCopy(query) {
    this.testVariable = 'changed before api call';
    console.log('this.testVariable bfr', this.testVariable);
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion?${query}`;
    // return this.http.get(apiUrl,{headers:this.reqHeaders,observe: 'response'})
    // return this.http.get(apiUrl,{headers:this.reqHeaders,observe: 'response'})
    let res = this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
    res.subscribe((response: any) => {
      console.log('response in service file', response);
      console.log('this.testVariable bfr', this.testVariable);
      this.testVariable = 'changed in learning service file itself';
      console.log('this.testVariable after', this.testVariable);
    })
  }
  // getQTypeAndCount
  getQTypeAndCount(query) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/count?${query}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // generate question paper
  generatedQuestionPaper(data, action) {
    if (action == 'insert') {
      const apiUrl = `${environment.apiUrl}api/v1/generatedQuestionWithId`;
      return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
    } else if (action == 'fetch') {

    }
  }
  // get submitted questions
  getSubmittedQuestions(id) {
    // const apiUrl = `${environment.apiUrl}api/v1/generatedQuestionWithId?questionId=${id}`;
    const apiUrl = `${environment.apiUrl}api/v1/generatedQuestionWithId/${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // changeQuestion
  changeQuestion(qType) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion?questionType=${qType}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // getAddQuestions
  getAllQuestions() {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/recordCount?repository.id=${this.getId()}`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' });
  }
  getAllQuestionCount(data){
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/recordCount?repository.id=${this.getId()}`;
    return this.http.post(apiUrl, data,{ headers: this.reqHeaders, observe: 'response' });
  }
  getQuestionByIdGlobally(id) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/globalQuestions/${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  //getAllQuestionGlobally
  getAllQuestionGlobalUser() {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/globalQuestions?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  getAllQuestionGlobalUserCount(data) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/globalQuestions/recordCount?repository.id=${this.getId()}`;
    return this.http.post(apiUrl, data,{ headers: this.reqHeaders, observe: 'response' });
  }
  getGlobalQuestions() {
    const apiUrl = `${environment.apiUrl}api/v1/actualQuestions`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  //create question paper Globally
  createQuestionPaperGlobally(id,data){
    const apiUrl = `${environment.apiUrl}api/v1/actualQuestions?repository.id=${id}`;
    return this.http.post(apiUrl,data, { headers: this.reqHeaders, observe: 'response' });
  }

  // saveQuestionPaper
  saveQuestionPaper(data) {
    const apiUrl = `${environment.apiUrl}api/v1/actualQuestions`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // getAllQuestionPapers
  getAllQuestionPapers() {
    const apiUrl = `${environment.apiUrl}api/v1/actualQuestions?school_id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  // getQuestionWithId
  getQuestionPaperWithId(id) {
    const apiUrl = `${environment.apiUrl}api/v1/actualQuestions/${id}`;
    // const apiUrl = `${environment.apiUrl}api/v1/generatedQuestionWithId/${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  //update questions paper
  updateQuestionPaper(id, data) {
    const apiUrl = `${environment.apiUrl}api/v1/actualQuestions/${id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // getQuestionWithId
  getQuestionWithId(id) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  //update Question
  updateQuestion(id, data) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/${id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  addQuestionGlobally(data) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/globalQuestions`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  updateQuestionGlobally(id, data) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/globalQuestions/${id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  autoSelectQuestionList(data){
    const apiUrl = `${environment.apiUrl}`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }





  //get principle
  getallprinciple(data) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/user/dashboard`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  updatePrinciple(data: any) {
    console.log(data)
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/${data._id}`;

    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }


  //get student
  getallstudent(id) {
    const apiUrl = id ? `${environment.apiUrl}api/v1/student/?school_id=${id}` : `${environment.apiUrl}api/v1/student/`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });

  }

  updateStudent(data: any) {
    console.log(data)
    const apiUrl = `${environment.apiUrl}api/v1/student/${data._id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }


  //get teacher
  // getallteacher(data,) {
  //   const apiUrl = `${environment.apiUrl}api/v1/SignUp/user`;
  //   return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  // }

  getallteacher(data,) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/user/dashboard`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  updateTeacher(data: any) {
    console.log(data)
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/${data._id}`;

    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  // updateTeacher(data: any) {
  //   console.log(data)
  //   const apiUrl = `${environment.apiUrl}api/v1/SignUp/user/dashboard/${data._id}`;

  //   return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  // }

  // getClassWithId
  getBoardWithId(id) {
    const apiUrl = `${environment.apiUrl}api/v1/board?class_id=${id}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
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

  getQuestionsWithFilters(filters) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion?${filters}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }

  // Get question papers for import question paper..
  getQuestionPapersForImport(data) {
    const apiUrl = `${environment.apiUrl}api/v1/actualQuestions/filter`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteChapter(data) {
    const apiUrl = `${environment.apiUrl}api/v1/chapter/deleteChapter/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteTopic(data) {
    const apiUrl = `${environment.apiUrl}api/v1/topic/deleteTopic/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteSchoolAdminSubject(data) {
    const apiUrl = `${environment.apiUrl}api/v1/subject/unMapSubject/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteGlobalSubject(data) {
    const apiUrl = `${environment.apiUrl}api/v1/subject/deleteSubject/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteSchoolAdminSyllabus(data) {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus/unMapSyllabus/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteGlobalSyllabus(data) {
    const apiUrl = `${environment.apiUrl}api/v1/syllabus/deleteSyllabus/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteSchoolAdminBoard(data) {
    const apiUrl = `${environment.apiUrl}api/v1/board/unMapBoard/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteGlobalBoard(data) {
    const apiUrl = `${environment.apiUrl}api/v1/board/deleteBoard/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteSchoolAdminClass(data) {
    const apiUrl = `${environment.apiUrl}api/v1/class/unMapClass/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteGlobalClass(data) {
    const apiUrl = `${environment.apiUrl}api/v1/class/deleteClass/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteLearningOutCome(data) {
    const apiUrl = `${environment.apiUrl}api/v1/learnOutcome/deleteLearningOutcome/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteQuestions(data) {
    const apiUrl = `${environment.apiUrl}api/v1/objectiveQuestion/deleteQuestions/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteQuestionPaper(data){
    const apiUrl = `${environment.apiUrl}api/v1/actualQuestions/deleteQuestionPaper/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteExamType(data){
    const apiUrl = `${environment.apiUrl}api/v1/exam_type/delete`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteQuestionCategory(data){
    const apiUrl = `${environment.apiUrl}api/v1/question_category/delete`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  deleteSections(data){
    const apiUrl = `${environment.apiUrl}api/v1/section/delete`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  getAllClasses(){
    const apiUrl = `${environment.apiUrl}api/v1/class`;
    return this.http.get(apiUrl,{ headers: this.reqHeaders, observe: 'response' })
  }
}




