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
