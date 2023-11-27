
import { writable } from 'svelte/store';

export const userRecord = writable({
  id: '12345',
  name: '',
  isParent: false,
  kids: [],
  allowanceTotal: 0,
  rewards: [{
      rewardName: '',
      dateEarned: '',
  }], //rewards
  options: [{
      optionName: '',
      optionValue: '',
  }], //options
  points: 0,
});

