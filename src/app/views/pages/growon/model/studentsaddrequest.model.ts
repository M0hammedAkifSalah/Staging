import { LanguageList } from "./languagelist.model";

export class StudentAddRequest {
    dob: string | null;
    profile_image: string | null;
    aadhar: string | null;
    address: string | null;
    blood_gr: string | null;
    branch_id: string | null;
    caste: string | null;
    city: string | null;
    class: string | null;
    username: number | null;
    wear_glasses: string | null;
    contact_number: string | null;
    country: string | null;
    email: string | null;
    f_aadhar_no: string | null;
    f_contact_number: number | null;
    f_email: string | null;
    f_qualification: string | null;
    father_name: string | null;
    g_aadhar: string | null;
    g_email: string | null;
    g_qualificaton: string | null;
    gender: string | null;
    guardian: string | null;
    guardian_mobile: string | null;
    guardian_mobile_to_reg_student: string | null;
    guardian_name: string | null;
    m_aadhar_no: string | null;
    m_contact_number: string | null;
    m_email: string | null;
    m_mobile_to_reg_student: string | null;
    m_qualification: string | null;
    medical_cond: string | null;
    mobile_to_reg_student: number | null;
    mode_of_transp: string | null;
    mother_name: string | null;
    mother_tongue: string | null;
    name: string | null;
    p_password: string | null;
    p_username: string | null;
    password: string | null;
    pincode: number | null;
    primaryParent: string | null;
    religion: string | null;
    section:string | null;
    rte_student: string | null;
    school_id: string | null;
    state: string | null;
    sts_no: string | null;
    subjects: string[] | null;
    m_language_proficiency: LanguageList[] | null;
    language_proficiency: LanguageList[] | null;
    g_language_proficiency: LanguageList[] | null;
}