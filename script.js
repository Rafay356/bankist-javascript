'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  //acc.balance is createing a balance object or variable in accounts
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  });
  labelBalance.textContent = `${acc.balance} €`;
};

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${incomes}€`;
  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(outgoing)}€`;
  // labelSumInterest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    //only those interest wll be calculated which is above 1
    .filter(int => int >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}€`;
};

// calcDisplaySummary(account1.movements);

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

//Eevent Handlers
//we need this current Account in other like transer and summary too that why we are making it global

const displayUI = acc => {
  //Display movements
  displayMovements(acc.movements);

  //Display Balance
  calcDisplayBalance(acc);

  //Display Summary
  calcDisplaySummary(acc);
};
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting automaticallly
  e.preventDefault();
  //.value give string always
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('Loging');
    //UI and messdage upadte
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    //e=empty the login input field after login

    //the assignment operation work fro rigth to left
    inputLoginUsername.value = inputLoginPin.value = '';

    //to losses focus after login
    inputLoginPin.blur();

    //Display UI
    displayUI(currentAccount);
  }
});
// console.log(accounts);
//Transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //e=empty the login input field after login

  //the assignment operation work fro rigth to left
  inputTransferAmount.value = inputTransferTo.value = '';

  //to losses focus after login
  inputTransferAmount.blur();

  //now we ar goint to add checks which shows that the transfer amount is not negative and the transfer amount is not more than the current balance and the reciver account is avaible and the input receiver name matches the account name in data

  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    //now push the amount in reciver and current user movemnts array
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    //Display UI
    displayUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const percentNum = 10;
  const amountLoan = Number(inputLoanAmount.value);
  const loanTax = (percentNum / 100) * amountLoan;

  const loanApproved = currentAccount.movements.some(mov => mov >= loanTax);

  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  if (amountLoan > 0 && loanApproved) {
    //Add movements
    currentAccount.movements.push(amountLoan);

    //Update UI
    displayUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let un = inputCloseUsername.value;
  let pw = Number(inputClosePin.value);

  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
  if (
    currentAccount &&
    currentAccount.username === un &&
    currentAccount.pin === pw
  ) {
    //finding index
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delete account
    accounts.splice(index, 1);

    //changing opacity
    containerApp.style.opacity = 0;

    //changing ui
    labelWelcome.textContent = `Log in to get started`;
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

console.log(accounts);
//COding Chellenge
// const dogsJulia = [4, 2, 3, 5, 1];
// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 2, 3, 5, 1];

// function checkDogs(dogsJulia, dogsKate) {
//   const dogsJuliaCopy = dogsJulia.slice(1, -2);
// for (const [i, age] of dogsJulia.entries()) {
//   if (age >= 3) {
//     console.log(`Dog number ${i + 1} is an adult`);
//   } else {
//     console.log(`Dog number ${i + 1} is still a puppy 👲`);
//   }
// }
// for (const [i, age] of dogsKate.entries()) {
//   if (age >= 3) {
//     console.log(`Dog number ${i + 1} is an adult`);
//   } else {
//     console.log(`Dog number ${i + 1} is still a puppy 👲`);
//   }
// }
// const dogs = dogsJuliaCopy.concat(dogsKate);

// dogs.forEach(function (dog, i) {
//   if (dog >= 3) {
//     console.log(`Dog number ${i + 1} is an adult and is ${dog} year old`);
//   } else {
//     console.log(
//       `Dog number ${i + 1} is still a puppy 👲 and is ${dog} year old`
//     );
//   }
// });

//A dog is an adult i it is 3 year old and puppy if it is les than 3 year
// }
// checkDogs(dogsJulia, dogsKate);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
//similar with strinfg slice method it will return the new array anot change the original array

let arr = ['a', 'b', 'c', 'd', 'e'];

//Slice method
console.log(arr.slice(2)); //['c','d','e']
console.log(arr.slice(2, 4)); //['c','d']
console.log(arr.slice(-2)); // ['d','e']
console.log(arr.slice(-1)); // ['e']
console.log(arr.slice(1, -2)); //['b','c']
console.log(arr.slice()); //shallow copy
console.log([...arr]); //shallow capy with spread operator

//Splice method
//it works almost the same as slice method
//but it does fundamentally change the original array
//when we use splice it with take out the elemets we want and these elements are gone from the original array
The splice() method in JavaScript is used to add, remove, or replace elements in an array.
array.splice(startIndex, deleteCount, item1, item2, ...)
console.log(arr.splice(2)); //[c,d,e]
console.log(arr.splice(-1)); //[e]
console.log(arr); // [a,b]

//Reverse method
//it reverse the array and also mutate the originak array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

//CONCAT method
//it doesnot mutatae the original array and it concat arrays
//similar to ..spread operator when conctatination
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN method
//this is array method it seperate means join the array with the given value and show it in string
console.log(letters.join(' - '));

at method
console.log(arr.at(-1)) //gets the end element of array
*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // for (const movement of movements)
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You have deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You have deposited ${Math.abs(movement)}`);
//   }
// }

// console.log('------FOREACH------');
//ForEach loop it is a higher order function it take call back function in his parameter
//the forEach not only passes the current element but also index and the complete array too
//order matters but name doesnot
//first always current element second always index adn third always the array
//you cannot break out the forEach loop
//but can you break in for..of loop and comeout
// movements.forEach(function (movement, i, arr) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You have deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You have deposited ${Math.abs(movement)}`);
//   }
// });

//behind the secence
//at iteration 0  forEach call the function anonymus fucntion
//lets just call like that 0 : function(200)
//1 : function(450)
//like this this function tells the higher order function forEach to iterate it like this one by one

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

//on set data structure the forEach methd key does not have any use because set does not have index and dont have keys too so it doesnot matter
//it just the fprEach developer doesnt want it to be different the ForEach so they kept like that
// const currenciesUniques = new Set(['USD', 'EUR', 'GBP']);
// currenciesUniques.forEach(function (value, key, set) {
//   console.log(`${key}:${value}`);
// });

//map method
//it give new array withe new elemets of the original array
//forEach() method create sideEffect
// const eruToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eruToUsd;
// });

//similarly if we convert this in for..of loop
//we are cretae an array manully and populate it it later
// const movementsUSDFor = [];
// for (const mov of movements) movementsUSDFor.push(mov * eruToUsd);

//now we refactor and make it more clean by using arraw function

// const movementsUSDArrow = movements.map(mov => mov * eruToUsd);

// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You have ${
//       mov > 0 ? 'deposited' : 'withdraw'
//     } ${Math.abs(mov)}`
// );
// console.log(movementsDescription);
// console.log(movementsUSDFor);
// console.log(movementsUSD);
// console.log(movementsUSDArrow);

//filtered method
//it also create a new array with elements that statisfy the condition

// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposit);

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(withdrawals);

//reduce data transmission method
//it is use to boil down all the elements in an array to one single value
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(acc, curr);
//   return acc + curr;
// }, 0);
// console.log(balance);
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

//maximiun value of the movements
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);

// console.log(max);

//Coding Challenge # 2 😁
// const calcAverageHumageAge = function (ages) {
//   const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adult = humanAge.filter(age => age >= 18);
//   // const avg = adult.reduce((acc, curr) => acc + curr, 0) / adult.length;
//   const avg = adult.reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

//   //2,3  (2+3)/2 === 2/2 + 3/2 === 2.5

//   return avg;
// };
// const calcAverageHumageAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

// //2,3  (2+3)/2 === 2/2 + 3/2 === 2.5

// const avg1 = calcAverageHumageAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumageAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1, avg2);

//find method
//we can retrieve one element of an array based on a condition
//it doesnt not return the new array but it will return the first elemnt of an array that will satisfy the condition
//find looks similar to filter method but it is fundamentaly different
//1. the filter method return all the element in array based on condition while find method return the first elemnt of an array based on condition
//2. filter return the new array but find returns only one element not an array
// const frstWithDrawals = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(frstWithDrawals);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// let accountJ;
// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     accountJ = acc;
//     break; // stop after finding the first match
//   }
// }
// console.log(movements);
// //findLast
// const lastWithdrawals = movements.findLast(mov => mov < 0);
// console.log(lastWithdrawals);

// //findLastIndex
// const lastIndexWithDrawals = movements.findLastIndex(mov => mov > 1000);
// console.log(
//   `Your lastest large amount was ${
//     movements.length - lastIndexWithDrawals
//   } movements ago`
// );

//includes method
//for EQUALITY
// const s = movements.includes(-130);
// console.log(s);

//some method
//For CONDITION
//if any value is true for the condition then the answer is true
// const anyDeposit = movements.some(mov => mov > 2000);
// console.log(anyDeposit);

//every method
//it check if every elemny in array staisfy the condition
// const depo = movements.every(mov => mov > 0);
// console.log(depo);

//one more thing is that we can simply right the
//call back function seperatly and call into the function parameter

//Seperate callback
// const deposit = mov => mov > 0;
// console.log(movements.every(deposit));
// console.log(movements.some(deposit));
// console.log(movements.filter(deposit));

//flat method
// it uses to flatten the array into one single new array
const arr = [1, [2, 3], 4, 5, 6, [7, 8]];
console.log(arr);
console.log(arr.flat());
//to further deep the flat method can take parameter
//if we want to go 2 level nested then 2 pass in parameter of flat method
const arrDeep = [[1, [2, 3], 4], 5, [6, [7, 8], 9]];
console.log(arrDeep.flat());
console.log(arrDeep.flat(2));

//Now fpr example if we want to calculate the sum balance of all the account =s movements

// const accountsMovements = accounts.map(acc => acc.movements);
// console.log(accountsMovements);
// const allMovements = accountsMovements.flat();
// const overallBalance = allMovements.reduce((acc, curr) => {
//   return acc + curr;
// }, 0);

//And we can do it bu chaining it

// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, curr) => acc + curr, 0);

// console.log(overallBalance);

//And as you can see abpve we are using map first than flat method which common
//So to get it more simplify there is a method called flapMap
//flatMap take the same callback as map it iterate over and the flatten the array
//IMPORTANT ting to knew is that flatMap only goes one level deep if you want to go further deep level tha you still need to use flat method
//flatMap method
// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, curr) => acc + curr, 0);

// console.log(overallBalance2);
// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/

/*const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch', 'running'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];*/

//1.
// let husky;
// husky = breeds.find(dog => dog.breed === 'Husky');
// const huskyWeight = husky.averageWeight;
// console.log(huskyWeight);

// //2.
// const dogBothActivities = breeds.find(
//   breed =>
//     breed.activities.includes('fetch') && breed.activities.includes('running')
// ).breed;
// let dogBothActivities = [];
// for (const breed of breeds) {
//   if (
//     breed.activities.includes('fetch') &&
//     breed.activities.includes('running')
//   ) {
//     dogBothActivities.push(breed.breed);
//   }
// }
//3.
// const allActivities = breeds.map(breed => breed.activities).flat();
// console.log(allActivities);
//for alternative whenever we use map then flat only
// const allActivities = breeds.flatMap(breed => breed.activities);
// console.log(allActivities);
// //4.
// const uniqueActivities = [...new Set(allActivities)];
// console.log(uniqueActivities);
//5.
// const swimmingAdjacent = [
//   ...new Set(
//     breeds
//       .filter(breed => breed.activities.includes('swimming'))
//       .flatMap(breed => breed.activities)
//       .filter(activity => activity !== 'swimming')
//   ),
// ];

// console.log(swimmingAdjacent);

//6.
// console.log(breeds.every(breed => breed.averageWeight >= 10));

// console.log(breeds.some(breed => breed.activities.length >= 3));
// //tp take the value out of the array we use spread operator

// const fetchBreed = breeds
//   .filter(breed => breed.activities.includes('fetch'))
//   .map(breed => breed.averageWeight);

// const heaviestWeight = Math.max(...fetchBreed);

// console.log(heaviestWeight);

//sort method
//it mutates the original array
//sort method sort based on string
//string
// const array = ['rafay', 'muqeet', 'sarah', 'usman'];
// console.log(array.sort());
//return < 0 A , B
//return >0 B,A
//for number we need to compare and then return

// 🧪 Example Dry Run:
// Let's take this array:

// js
// Copy
// Edit
// let movements = [200, -100, 50, 400];
// Initial:

// csharp
// Copy
// Edit
// [200, -100, 50, 400]
// Now JavaScript will compare values pair by pair:

// ✅ Step 1: Compare 200 and -100
// js
// Copy
// Edit
// if (200 > -100) return 1; ✅
// ➡️ Swap them:

// css
// Copy
// Edit
// [-100, 200, 50, 400]
// ✅ Step 2: Compare 200 and 50
// js
// Copy
// Edit
// if (200 > 50) return 1; ✅
// ➡️ Swap them:

// css
// Copy
// Edit
// [-100, 50, 200, 400]
// ✅ Step 3: Compare 200 and 400
// js
// Copy
// Edit
// if (200 > 400) return 1 ❌
// if (400 > 200) return -1 ✅
// ➡️ Keep order

// Final sorted array:

// css
// Copy
// Edit
// [-100, 50, 200, 400]
// ✅ Result:
// Your comparator sorts movements in ascending order:

// [-100, 50, 200, 400]
// console.log(movements);
// movements.sort((a, b) => {
//   if (a > b) return 1; //(swap)
//   if (a < b) return -1; //(keep order)
// });

//improved version ascending order
// movements.sort((a, b) => a - b);
// console.log(movements);

// movements.sort((a, b) => {
//   if (a < b) return 1; //(swap)
//   if (a > b) return -1; //(keep order)
// });

//imporved version of desending order
// movements.sort((a, b) => b - a);
// console.log(movements);

console.log(movements);
//group array
//in in this method we group array according to trhe condityion
//Object.groupBy(items, callbackFn)
//items
// An iterable (such as an Array) whose elements will be grouped.
// const groupMovements = Object.groupBy(movements, mov =>
//   mov > 0 ? 'disposit' : 'withdrawal'
// );
// console.log(groupMovements);
// const inventory = [
//   { name: 'asparagus', type: 'vegetables', quantity: 5 },
//   { name: 'bananas', type: 'fruit', quantity: 0 },
//   { name: 'goat', type: 'meat', quantity: 23 },
//   { name: 'cherries', type: 'fruit', quantity: 5 },
//   { name: 'fish', type: 'meat', quantity: 22 },
// ];
// const type = Object.groupBy(inventory, ({ type }) => type);
// const callBackFn = ({ quantity }) => (quantity > 5 ? 'ok' : 'restoke');
// const checkQuantity = Object.groupBy(inventory, callBackFn);
// // const type = Object.groupBy(inventory, inv => inv.type);
// console.log(type);
// console.log(checkQuantity);

//Creating ways of Arrays
// console.log([1, 2, 3, 4, 5]);
//usinmg Array constructor
// console.log(new Array(1, 2, 3, 4, 5, 6));
//if we make Array with constructor and only use one argument then it will creat array with emplty no of slots pass in argument
// const x = new Array(7);
// console.log(x);
//only one method can use on this tyoe of array is fill
// console.log(x.fill(1, 3));
//this work as slice method this fill can tell where we want to fill array first is value sencod is index
// console.log(x.fill(1, 4, 6));

//from method
// const t = Array.from({ length: 7 }, () => 1);
// console.log(t);

//to fill up the array in from
//that _ is throw back mean we dont need that value
// const u = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(u);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });

//method that change the original array splice sorted and reverse
//so we use slice to make shallow copy and then use thes it but now
//we can use new method
//toReversed toSorted toSpliced

// console.log(movements.toReversed());

//Arrays Practise
console.log(accounts);
// const totalMovements = accounts
//   .flatMap(({ movements }) => movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, curr) => acc + curr, 0);
// console.log(totalMovements);

// const numOfDeposit1000 = accounts
//   .flatMap(({ movements }) => movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numOfDeposit1000);

// const numOfDeposit1000 = accounts
//   .flatMap(({ movements }) => movements)
//   .reduce((count, curr) => (curr >= 1000 ? count + 1 : count), 0);

// console.log(numOfDeposit1000);

//we can create brand new object based on reduce
//we destruct it here
// sumOfAllMovements
// const { deposit, withDrawal } = accounts
//   .flatMap(({ movements }) => movements)
//   .reduce(
//     (sums, curr) => {
//       //we can make this part look more good as we know there is some repeting code
//       // curr > 0 ? (sums.deposit += curr) : (sums.withDrawal += curr);
//       //we use bracket notation instead of . notation
//       sums[curr > 0 ? 'deposit' : 'withDrawal'] += curr;
//       return sums;
//     },
//     { deposit: 0, withDrawal: 0 }
//   );
// console.log(deposit, withDrawal);

// const convertTItleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   //this how everyone do it
//   const execption = ['a', 'an', 'the', 'but', 'or', 'and', 'on', 'in', 'with'];
//   const word = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (execption.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(word);
// };

// console.log(convertTItleCase('This is a nice title'));
// console.log(convertTItleCase('This is a LONG title but not too long'));
// console.log(convertTItleCase('and here is another title with an EXAMPLE'));

//coding challend #5
/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1.

dogs.forEach(function (dog) {
  // dog['recFood'] = Math.trunc(dog.weight ** 0.75 * 28);
  dog.recFood = Math.trunc(dog.weight ** 0.75 * 28);
});

console.log(dogs);

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(
  `Sarah's Dog eats too ${
    sarahDog.curFood > sarahDog.recFood ? 'much' : 'little'
  }`
);

//3
const ownersTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);

console.log(ownersTooMuch);
const ownersTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersTooLittle);
//4.

console.log(
  `${ownersTooMuch.slice(0, -1).join(', ')} and ${ownersTooMuch.slice(
    -1
  )}'s dogs eat too much`
);

console.log(
  `${ownersTooLittle.slice(0, -1).join(', ')} and ${ownersTooLittle.slice(
    -1
  )}'s dogs eat too little`
);
//5
console.log(dogs.some(dog => dog.curFood === dog.recFood));
//6
console.log(
  dogs.every(
    dog => dog.curFood >= dog.recFood * 0.9 && dog.curFood <= dog.recFood * 1.1
  )
);
//currFood 10% above and below the recFood
//7
console.log(
  `dogs.filter(
    dog => dog.curFood >= dog.recFood * 0.9 && dog.curFood <= dog.recFood * 1.1
  )`
);
//8 Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
console.log(
  Object.groupBy(dogs, dog =>
    dog.curFood > dog.recFood
      ? 'too-much'
      : dog.curFood < dog.recFood
      ? 'too-little'
      : 'exact'
  )
);

//9. Group the dogs by the number of owners they have
console.log(Object.groupBy(dogs, dog => `${dog.owners.length}-owners`));

//10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

const sortByRecFood = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(sortByRecFood);
console.log(dogs);
