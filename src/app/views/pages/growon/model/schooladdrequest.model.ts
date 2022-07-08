import { BranchDetails } from './branchdetails.model';

export class SchoolAddRequest {
  schoolImage: string | null;
  schoolName: string | null;
  address: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  schoolEmail: string | null;
  schoolWebsite: string | null;
  SchoolContactNumber: number | null;
  boardId: string | null;
  institutionTypeId: string | null;
  pincode: number | null;
  syllabusId: string[] | null;
  Branch: BranchDetails[] | null;
}
