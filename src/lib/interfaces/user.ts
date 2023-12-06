export interface User {
	allowanceTotal: number;
	rewards: {
		rewardName: string;
		dateEarned: string;
	}[]; //rewards
	options: {
		optionName: string;
		optionValue: string;
	}[]; //options
	points: number;
	isParent: boolean;
	weeklyAllowance:number;
	children: {
        id: string;
		name: string; 
	}[];
	valid:boolean;
} //user
