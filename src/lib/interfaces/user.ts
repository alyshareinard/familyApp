export interface User {
	id: string;
	name: string;
	kid: boolean;

	allowanceTotal: number;

	rewards: {
		rewardName: string;
		dateEarned: string;
	}; //rewards
	options: {
		optionName: string;
		optionValue: string;
	}; //options
	points: number;
} //user
