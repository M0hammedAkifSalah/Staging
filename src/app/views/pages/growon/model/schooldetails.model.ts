import { BranchDetails } from "./branchdetails.model";
import { RepositoryDetails } from "./repositorydetails.model";

export class SchoolDetails {
    classList:any [] | null;
    createdAt:string | null;
    updatedAt:string | null;
    schoolName: string | null;
    schoolImage:string |null;
    address: string | null;
    country: string | null;
    state: string | null;
    city: string | null;
    email: string | null;
    pincode:string | null;
    webSite:string | null;
    contact_number: number | null;
    sType: string | null;
    countryName: string | null;
    stateName: string | null;
    cityName: string | null;
    stypeName: string | null;
    _id:string | null;
    branch:BranchDetails[] | null;
    //syllabusId: string | null;
    // syllabus: string | null;
    // Branch: BranchDetails[] | null;
    // repository: RepositoryDetails[] | null;
    // _id: string | null;
    // schoolImage: string | null;
    // Board: string | null;
    // boardId: string | null;
    // __v: number | null;
}
