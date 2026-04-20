export type T_PricingPlan = {
    planName: string;
    price: number;
    description: string;
    billingCycle: 'Monthly' | 'Yearly';
    userType: string;
    planFeatures: {
        featureName: string;
        featureLimit: string;
    }[]
}
