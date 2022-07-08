import { LanguageList } from "./languagelist.model";
import { ParentDetails } from "./parentdetails.model";

export class StudentDetails {
    subject: string[] | null;
    repository: any | null;
    _id: string | null;
    username: string | null;
    profile_type: string | null;
    school_id: any | null;
    branch_id: string | null;
    country_id: string | null;
    state_id: any | null;
    city_id: string | null;
    pincode: number | null;
    name: string | null;
    dob: string | null;
    gender: string | null;
    email: string | null;
    address: string | null;
    aadhar: string | null;
    sts_no: string | null;
    rte_student: string | null;
    religion:string | null;
    caste: string | null;
    mother_tongue: string | null;
    blood_gr: string | null;
    mode_of_transp: string | null;
    parent_id:ParentDetails | null;
    medical_cond: string | null;
    wear_glasses: string | null;
    class: any | null;
    schoolName: string | null;
    //Changed cityName to city
    city: any | null;
    //Changed countryName to country
    country: any | null;
    stateName: string | null;
}