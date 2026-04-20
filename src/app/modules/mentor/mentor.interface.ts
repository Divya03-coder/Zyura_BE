export type T_Mentor = {
    accountId: string,
    firstName: string,
    lastName: string,
    currentRole: string,
    hospitalOrInstitute: string,
    specialty: string,
    professionalExperience: number,
    postgraduateDegree: string,
    country: string,
    isConditionAccepted: boolean,
    profileVerification: "PENDING" | "VERIFIED",
    // file information
    profile_photo: string,
    degree: string,
    identity_card: string,
    certificate: string, 
    //other information
    bio: string,
    skills: string[],
    languages: string[],
    hourlyRate:number,
    currency:string,
    availability:{
        day:string,
        time:string[];
    }[] ,
    bankInformation:{
        accountHolderName:string,
        bankName:string,
        accountNumber:string,
        routingNumber:string,
        accountType:string,
    }
}
