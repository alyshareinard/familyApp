export interface User {
	id: string;
	name: string;
	isParent: boolean;
	kids?: string [];
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
} //user
