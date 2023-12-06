
import { writable } from 'svelte/store';

export const userRecord = writable({
  allowanceTotal: 0,
  rewards: [{
    rewardName: '',
    dateEarned: '',
  }], //rewards
  options: [{
    optionName: '',
    optionValue: '',
}], //options
points: -1,
  isParent: false,
  weeklyAllowance:0,
  children: [{
    id: '',
    name: '',
}],
valid:false


});
