export interface User 
{ 
    id:string,
    name:string,
    kid:boolean,
 allowance: {
	 transactionHistory: {
		 amount:number,
		 date:Date,
		 reason:string
	 } //transactionHistory
	 allowanceTotal:number
 }, //allowance
 moodHistory: {
	 moodValue:number,
	 date:Date,
	 notes:string
 } //moodHistory
rewards: {
rewardName:string
} //rewards
options:{
optionName:string,
optionValue:string
}//options
points:number
}//user

