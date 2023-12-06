export interface CalEvent {
	date: string;
    timeFrom?: string;
    timeTo?: string;
    title: string;
    description?: string;
    isPublic: boolean;
    location?: string;
    forIds: string[];
    valid: boolean;
};