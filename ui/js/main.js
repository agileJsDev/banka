const loginForm = document.querySelector('#login__form');
const registerForm = document.querySelector('#register__form');
const bankAccountForm = document.querySelector('#bank__account__form');
const userAccountForm = document.querySelector('#create__user__form');
const resetPasswordForm = document.querySelector('#reset__password');
const formButton = document.querySelector('.form .btn');
const xBtn = document.querySelector('.x-btn');
const mobileMenu = document.querySelector('.mobile__top-nav');
const passwordDOM = document.querySelector('#password');
const comfirmPasswordDom = document.querySelector('#confirmPassword');
const grid = document.querySelector('.grid-container');
const divi = document.querySelector('.divi');
const deleteAccount = document.querySelector('.delete__account');
const logoutBtn = document.querySelector('#logout');
const goBackBtn = document.querySelector('#goBack');

const createNode = (element, content, className) => {
  const el = document.createElement(element);
  el.textContent = content;
  el.className = className;
  return el;
};

const appendTo = (parent, child) => parent.appendChild(child);

const modal = (parentDiv) => {
  const dialog = document.querySelector('.dialog');
  const close = document.querySelector('.close');
  dialog.classList.add('hidden');
  const arry = [close, dialog];
  arry.forEach((dom) => {
    dom.addEventListener('click', () => {
      dialog.classList.remove('hidden');
      while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
      }
    });
  });
};

const toastSuccess = 'toast__success';
const toastFail = 'toast__fail';
const toast = (className, msg) => {
  const divToast = createNode('div', msg);
  divToast.className = className;
  document.body.appendChild(divToast);
  setTimeout(() => document.body.removeChild(divToast), 4000);
};

/* Mobile Menu Functionality */
xBtn.addEventListener('click', () => {
  if (mobileMenu) {
    if (mobileMenu.style.display === 'block') mobileMenu.style.display = 'none';
    else mobileMenu.style.display = 'block';
  }
  if (grid) {
    grid.classList.toggle('dropdown__active');
  }
  xBtn.classList.toggle('change');
});

/* Front-end Password Confirmation */
const passwordConfirm = () => {
  if (passwordDOM.value === comfirmPasswordDom.value) {
    comfirmPasswordDom.setCustomValidity('');
  } else {
    comfirmPasswordDom.setCustomValidity("Passwords don't match.");
  }
};

const getTransactionDetails = () => {
  const viewDetailsBtnDOM = document.querySelectorAll('.view__btn');
  viewDetailsBtnDOM.forEach((btnDOM) => {
    btnDOM.addEventListener('click', () => {
      const transacDetail = btnDOM.parentElement.parentNode;
      const detail = {
        date: transacDetail.querySelector('.transac_date').innerHTML,
        desc: transacDetail.querySelector('.transac_details').innerHTML,
        amount: transacDetail.querySelector('.transac_amount').innerHTML
      };
      const h1Tag = createNode('h1', detail.date);
      const para = createNode('p', detail.desc);
      const amountTag = createNode('h1', `NGN ${detail.amount}`);
      const parentNode = createNode('div');
      appendTo(parentNode, h1Tag);
      appendTo(parentNode, para);
      appendTo(parentNode, amountTag);
      divi.appendChild(parentNode);
      modal(divi);
    });
  });
};

const deleteBankAccount = () => {
  const res = prompt(
    'Are you sure you want this account deleted? Enter your password to confirm: '
  );
  if (res) toast(toastSuccess, 'Success Dialog. Simply giving feedback to user.');
  if (!res) toast(toastFail, 'Failed Dialog. Simply giving feedback to user.');
};

/* Logout User */
const logutUser = () => {
  localStorage.clear();
  window.location.replace('../login.html');
};

/* Go back Button */
const goBack = () => {
  window.history.back();
};

// Frontend Implementations
const btnLoading = () => {
  formButton.disabled = true;
  formButton.classList.add('loading');
};

const stopBtnLoading = () => {
  formButton.disabled = false;
  formButton.classList.remove('loading');
};

const request = (endpoint = '', method = 'GET', body = null) => {
  const apiBase = 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('token');
  return fetch(`${apiBase}/${endpoint}`, {
    mode: 'cors',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    method,
    body
  })
    .then(res => res.json())
    .catch(err => err);
};

// ChecK if user is signed in
const isLoggedIn = async () => {
  try {const response = await request('accounts');
  if (response.error && response.status === 401) {
    localStorage.clear();
    window.location.replace('../login.html');
  }
  const userFirstName = document.querySelectorAll('.user__name');
  userFirstName.forEach((userName) => {
    const user = userName;
    [user.textContent] = localStorage.getItem('name').split(' ');
  });} catch (err) {

  }
};

// Implement Signup Functionality
const register = async (e) => {
  try {
    e.preventDefault();
    btnLoading();
    const email = registerForm.elements.email.value;
    const firstName = registerForm.elements.firstName.value;
    const lastName = registerForm.elements.lastName.value;
    const password = registerForm.elements.password.value;
    const confirmPassword = registerForm.elements.confirmPassword.value;
    const data = JSON.stringify({
      email,
      firstName,
      lastName,
      password,
      confirmPassword
    });
    const response = await request('auth/signup', 'POST', data);
    stopBtnLoading();
    if (!response.data) throw Error(response.error);
    localStorage.setItem('token', response.data.token);
    const { firstname, lastname } = response.data;
    localStorage.setItem('name', `${firstname} ${lastname}`);
    toast(toastSuccess, 'User Profile Successfully Created');
    window.location.replace('./user/create-account.html');
  } catch (error) {
    toast(toastFail, error);
  }
};

const signIn = async (e) => {
  try {
    e.preventDefault();
    btnLoading();
    const email = loginForm.elements.email.value;
    const password = loginForm.elements.password.value;
    const data = JSON.stringify({ email, password });
    const response = await request('auth/signin', 'POST', data);
    stopBtnLoading();
    if (!response.data) throw Error(response.error);
    localStorage.setItem('token', response.data.token);
    const { firstname, lastname } = response.data;
    localStorage.setItem('name', `${firstname} ${lastname}`);
    toast(toastSuccess, 'User Logged In');
    window.location.replace('./user/myaccounts.html');
  } catch (error) {
    toast(toastFail, error);
  }
};

const createAccount = async (e) => {
  try {
    e.preventDefault();
    btnLoading();
    const sel = document.querySelector('#select__account');
    const type = sel.options[sel.selectedIndex].value;
    const data = JSON.stringify({ type });
    const response = await request('accounts', 'POST', data);
    stopBtnLoading();
    if (!response.data) throw Error(response.error);
    toast(toastSuccess, `${response.data.type} account created`);
    window.location.replace('./myaccounts.html');
  } catch (error) {
    toast(toastFail, error);
  }
};

const myAccounts = async () => {
  try {
    isLoggedIn();
    const response = await request('myaccounts');
    if (!response.accounts) throw Error(response.message);
    response.accounts.forEach((account) => {
      const myAccountsBoxDOM = document.querySelector('.myaccounts');
      const accountBox = `<div class="box">
  <br>
  <br>
  <h2  id="undertext-line" class="account__type__name">${account.type}</h2>
  <br>
  <h2 class="account__number">${account.accountnumber}</h2>
  <h1>&#8358; ${account.balance}</h1>
  <a><button class='btn open__account'>Open Account</button></a>
</div>`;
      myAccountsBoxDOM.insertAdjacentHTML('afterbegin', accountBox);
    });

    const openAccountBtn = document.querySelectorAll('.open__account');
    openAccountBtn.forEach((accountBtn) => {
      accountBtn.addEventListener('click', () => {
        const accountDOM = accountBtn.parentElement.parentNode;
        localStorage.setItem('no', accountDOM.querySelector('.account__number').innerHTML);
        window.location.replace('./home.html');
      });
    });
  } catch (error) {
    toast(toastFail, error);
  }
};

const transactionsList = [
  {
    transactionid: 1,
    createddate: '2019-05-19T23:58:13.760Z',
    type: 'credit',
    accountnumber: 1933763471,
    amount: 500,
    oldbalance: 1000,
    newbalance: 1500
  },
  {
    transactionid: 2,
    createddate: '2019-05-19T23:58:40.474Z',
    type: 'credit',
    accountnumber: 1933763471,
    amount: 500,
    oldbalance: 1500,
    newbalance: 2000
  },
  {
    transactionid: 3,
    createddate: '2019-05-19T23:58:43.357Z',
    type: 'credit',
    accountnumber: 1933763471,
    amount: 500,
    oldbalance: 2000,
    newbalance: 2500
  },
  {
    transactionid: 4,
    createddate: '2019-05-19T23:58:44.807Z',
    type: 'credit',
    accountnumber: 1933763471,
    amount: 500,
    oldbalance: 2500,
    newbalance: 3000
  },
  {
    transactionid: 5,
    createddate: '2019-05-19T23:59:07.776Z',
    type: 'debit',
    accountnumber: 1933763471,
    amount: 750,
    oldbalance: 3000,
    newbalance: 2250
  }
];

const accountDetails = async () => {
  isLoggedIn();
  const accountNumber = localStorage.getItem('no');
  const response = await request(`accounts/${accountNumber}`);
  if (!response.data) throw Error(response.error);
  const {
    accountnumber, balance, type, createddate
  } = response.data;
  document.querySelector('.account__name').textContent = localStorage.getItem('name');
  document.querySelector('.acct__number').textContent = accountnumber;
  document.querySelector('.acct__type').textContent = type;
  document.querySelector('.acct__date').textContent = new Date(createddate).toDateString();
  document.querySelector('.balance').appendChild(document.createTextNode(balance));

  // const transactions = await request(`accounts/${accountnumber}/transactions`);
  // if (!transactions.data) throw Error(transactions.error);
  // const recentTransactions = transactions.data.slice(0, 4);
  transactionsList.forEach((transaction) => {
    const recentTransactionsDOM = `<tr class="table__row">
    <td class="transac_date">${transaction.createddate}</td>
    <td class="transac_details">Caash Deposit //Lagos_Branch</td>
    <td class="transac_amount" id="credit_amt">${transaction.amount}</td>
  </tr> `;
    document.querySelector('tbody').insertAdjacentHTML('beforeend', recentTransactionsDOM);
  });
};

const transactions = () => {
  isLoggedIn();
  transactionsList.forEach((transaction) => {
    const recentTransactionsDOM = `<tr class="table__row">
    <td class="transac_date">${transaction.createddate} </td>
    <td class="transac_details"> Cash Deposit //Lagos Branch </td>
    <td class="transac_amount" id="credit_amt">${transaction.amount}</td>
    <td class="view_details"><button class="view__btn">Details</button></td>
</tr>`;
    document.querySelector('tbody').insertAdjacentHTML('beforeend', recentTransactionsDOM);
  });
  getTransactionDetails();
};


if (registerForm) registerForm.addEventListener('submit', register);
if (bankAccountForm) bankAccountForm.addEventListener('submit', createAccount);
if (loginForm) loginForm.addEventListener('submit', signIn);

if (deleteAccount) deleteAccount.addEventListener('click', deleteBankAccount);
if (resetPasswordForm) resetPasswordForm.addEventListener('submit', signInSample);
if (userAccountForm) userAccountForm.addEventListener('submit', signInSample);
if (logoutBtn) logoutBtn.addEventListener('click', logutUser);
if (goBackBtn) goBackBtn.addEventListener('click', goBack);
if (passwordDOM) {
  passwordDOM.oninput = passwordConfirm;
  comfirmPasswordDom.oninput = passwordConfirm;
}

const currentView = window.location.pathname;
switch (currentView) {
  case '/C:/Users/Xwebyna/Desktop/banka/ui/user/create-account.html':
    isLoggedIn();
    break;

  case '/C:/Users/Xwebyna/Desktop/banka/ui/user/myaccounts.html':
    myAccounts();
    break;

  case '/C:/Users/Xwebyna/Desktop/banka/ui/user/home.html':
    accountDetails();
    break;

  case '/C:/Users/Xwebyna/Desktop/banka/ui/user/transactions.html':
    transactions();
    break;

  default:
    break;
}
