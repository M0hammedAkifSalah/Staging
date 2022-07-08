export class BranchDetails {
    name: string | null;
    address: string | null;
    contact: number | null;
    city:string | null;
    branchCityId: string | null;
    state: string | null;
    branchStateId:string | null;
    country: {
        country_name:null,
        _id:null
    } | null;
    branchCountryId:string | null;
    branchPincode: number | null;
}