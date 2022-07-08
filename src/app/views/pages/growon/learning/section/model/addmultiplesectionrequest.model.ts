export class AddMultipleSectionRequest {
    School_id: string | null;
    data: details[] | null;
}

export class details {
    class_id: string | null;
    sectionList: sectionDetails[] | null;
}

export class sectionDetails {
    name: string | null;
    desc: string | null;
}