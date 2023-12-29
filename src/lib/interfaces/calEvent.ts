export interface CalEvent {
	date: string;
    timeFrom?: number; //0-24, decimals to 2 digits - fraction of hour
    timeTo?: number; //0-24, decimals to 2 digits
    title: string;
    description?: string;
    isPublic: boolean;
    location?: string;
    forIds: string[];
    valid: boolean;
};