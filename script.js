'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2025-08-10T10:17:24.185Z',
    '2025-08-09T14:11:59.604Z',
    '2025-08-04T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // return `${day}/${month}/${year}`;
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(date, new Date());

  if (daysPassed === 0) return 'TODAY';
  if (daysPassed === 1) return 'YESTERDAY';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));
  console.log(combinedMovDates);
  if (sort) combinedMovDates.sort((a, b) => a.movement - b.movement);
  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;

  combinedMovDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const date = new Date(movementDate);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurr(movement, acc.locale, acc.currency);

    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
      
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const accBalance = formatCurr(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${accBalance}`;
  // labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
//in below setTimeout there is bug tht the function does nit call immediatlt but it call after 1 second so that value we have before still show on UI
//Te trick we use is to make seperate function and call in immedialty and then use it inside the setTimeout this way it calls first then start calling after 1 seconf
const startLogoutTime = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //display it in UI
    labelTimer.textContent = `${min}:${sec}`;

    //when time hits 0 logout and clear the time
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //decrease time every second
    time = time - 1;
  };

  //set time
  let time = 120;
  //call function imediatly
  tick();
  //call the timer evry second
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer; //it for presistisng data that why we are making it global

//FAKE always LOGGED in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimentin API Internalization
// const now = new Date();
// const option = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   year: 'numeric',
//   weekday: 'long',
//   month: 'long',
// };
// const locale = navigator.language;
// console.log(locale);
// labelDate.textContent = new Intl.DateTimeFormat(locale, option).format();

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Date
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const hour = ` ${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      year: 'numeric',
      // weekday: 'long',
      month: 'numeric',
    };
    //to get the locale from the user browser
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //checks if timer left then clear the timer
    if (timer) clearInterval(timer);
    //Login Time starter
    //this is  timer function as we returning it above in setTimeout
    timer = startLogoutTime();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //create date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //reseting timer
    if (timer) clearInterval(timer);
    timer = startLogoutTime();
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);

      //Date
      currentAccount.movementsDates.push(new Date().toISOString());
      //reseting timer
      if (timer) clearInterval(timer);
      timer = startLogoutTime();
      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)
    //string.indexOf(searchValue, fromIndex)
    //searchValue → what you’re looking for
    //fromIndex (optional) → where to start searching (default 0)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//Numbers
// //another parameter that it take is redix which is base of the number that we are dealing with like base 10 or 2 binary
// console.log(Number.parseInt('30px', 10));
// //here in this prefer the number first than something else
// //it gives NaN
// console.log(Number.parseInt('e30', 10));
// //float Number
// //the parse only take first number fo string
// console.log(Number.parseFloat('2.5rem', 10));
// //Infinity also exist in javascript
// //isNaN checks if the given string or number is NaN or not if not then it give false
// //literaly NaN
// console.log('-------');
// console.log(Number.isNaN('20')); //false
// console.log(Number.isNaN(20)); //false
// console.log(Number.isNaN(+'20')); //false
// console.log(Number.isNaN(+'20px')); //true
// console.log('-------');
// //best way of checking vlaue is a number is isFinite()
// console.log(Number.isFinite(20)); //true
// console.log(Number.isFinite('20')); //false
// console.log(Number.isFinite('20px')); //false
// console.log(Number.isFinite(+'20px')); //false
// console.log(Number.isFinite(+'20')); //true
// console.log(Number.isFinite(20 / 0)); //false
// console.log('-------');
// //Integer
// console.log(Number.isInteger(20)); //true
// console.log(Number.isInteger('20')); //false
// console.log(Number.isInteger('20px')); //false
// console.log(Number.isInteger(+'20px')); //false
// console.log(Number.isInteger(+'20')); //true
// console.log(Number.isInteger(20 / 0)); //false

// //Math

// console.log(Math.sqrt(25));
// //same as above sqaure root of 2
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// //Max
// console.log(Math.max(1, 2, 3, 4, 5, 6, 7));
// console.log(Math.max(1, 2, 3, 4, '23', 6, 7)); //23
// console.log(Math.max(1, 2, 3, '23px', 5, 6, 7)); //NaN

// //Min
// console.log(Math.min(1, 2, 3, '23', 5, 6, 7));

// //random()
// //it give random number between 0 and 1
// //if we dont add 1 in this while multiply by six it give between 0 and 5
// //also to trunc all the other
// //Math trunc cut the decimal part
// // range >=0 and <6
// console.log(Math.trunc(Math.random() * 6)) + 1;

//we are adding min init because we want to start the random number from given minimum number 
//in this case it is 10 
//so random number start from 10 and ends with 20 
//i t between 10 and 20
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20), 'random');

// //Rounding Integers

// console.log(Math.trunc(23.4)); //23
// console.log(Math.round(25.5)); //26
// //n negative situation we should use floor
// console.log(Math.floor(-23.3)); //24
// console.log(Math.trunc(-23.3)); //23

// //Rounding decimal Number

// //toFixed returns always string
// //the parameter it takes will only return that number of decimal part
// console.log((2.7).toFixed(0)); //2 in string
// console.log((2.4).toFixed(3)); // 2.400 string
// console.log(+(2.356).toFixed(2)); //2.36 number above it round it

//Remainder Operator
// console.log(5 % 2); // 2*2+1 so remainder is 1

// const isEven = n => n % 2 === 0;

// console.log(isEven(8));
// console.log(isEven(9));
// console.log(isEven(14));

// //this here give the complete node list document.querySelectorAll('.movements__row')
// //Now converting it to an array
// //and using spread operator to stor it into new aray shallow caopy
// //now we can do something about by looping over it
// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'orangered';
//     }
//     if (i % 2 !== 0) {
//       row.style.backgroundColor = 'yellow';
//     }
//   });
// });

//Numeric seperator
//it helps to read the numeric number easily
//e.g 2870000000 very to tell if it is 28 billion or what
//so numeric seperator adds , in the number 287,000,000
//like this
// console.log(287, 908, 876);
// //javascript engine ignore the . _ - in the numbers
// //also javascript will not parse the nUmber correctly if we pass _ in the string
// console.log(Number('23_33')); //this get me NaN
// console.log(parseInt('23_33')); //it will only get 23

//BingInt
//BigInt constructor
//you cannot mix bigint with the reqular number
//n at the end of the bifg integer number you will get eact number

//Working with dates
// date.getDate() → Day of the month (1–31)

// date.getDay() → Day of the week (0–6, where 0 = Sunday)

// date.getMonth() → Month (0–11, so January = 0)

// date.getFullYear() → Four-digit year
// const future = new Date(2037, 10, 19, 15, 25);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// //it ive all the time till now in milisecond
// console.log(future.getTime());
// //convert it to the string of date
// console.log(new Date(2142239100000));
// console.log(Date.now());

// //also have set for all of these
// future.setFullYear(2040);
// console.log(future);

//Caculating dates
// const future = new Date(2037, 10, 19, 15, 25);
// //miliseconds
// console.log(+future);
//to convert milisecon  into days no
// 1 sec contain 1000 milisecond
// 1 min contain 60 sec
// 1 hr contain 60 min
// 1 day contain 24 hr
//to make number alwayss positive use Math.abs
// const calcDaysPassed = (day1, day2) =>
//   Math.abs(day2 - day1) / (1000 * 60 * 60 * 24);

// console.log(calcDaysPassed(new Date(2025, 9, 11), new Date(2025, 9, 1)));

//Internationlization Dates Api
// Intl.DateTimeFormat('en-PK').format()

//Timer setTimeout and setInterval
//setTimeout runs after a certain time
//setInterval keeps on runnig until we stop it

//we can seperate the ingritands or array or object
// const ingredients = ['olives ', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
//   // 'olives ',
//   // 'spinach'
// );
//also we can break the timeout
// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//setInterval
//this is used to print the answer every given time and wont stop until we do so
// setInterval(() => {
//   const now = new Date();
//   const hour = now.getHours();
//   const minutes = now.getMinutes();
//   const seconds = now.getSeconds();
//   console.log(`${hour}:${minutes}:${seconds}`);
// }, 1000);
