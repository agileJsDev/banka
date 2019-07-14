const loginForm = document.querySelector('#login__form');
const registerForm = document.querySelector('#register__form');
const bankAccountForm = document.querySelector('#bank__account__form');
const userAccountForm = document.querySelector('#create__user__form');
const resetPasswordForm = document.querySelector('#reset__password');
const updateBalanceForm = document.querySelector('#account__update');
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

/* Logout User */
const logutUser = () => {
  localStorage.clear();
  window.location.replace('../login.html');
};

/* Go back Button */
const goBack = () => {
  window.history.back();
};

/* Frontend Implementations - Consuming the API endpoints */
const btnLoading = () => {
  formButton.disabled = true;
  formButton.classList.add('loading');
};

const stopBtnLoading = () => {
  formButton.disabled = false;
  formButton.classList.remove('loading');
};

const request = (endpoint = '', method = 'GET', body = null) => {
  const apiBase = 'https://this-banka.herokuapp.com/api/v1';
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
  try {
    const response = await request('accounts');
    if (response.error && response.status === 401) {
      localStorage.clear();
      window.location.replace('../login.html');
    }
    const userFirstName = document.querySelectorAll('.user__name');
    userFirstName.forEach((userName) => {
      const user = userName;
      [user.textContent] = localStorage.getItem('name').split(' ');
    });
    const notAdmin = localStorage.getItem('rl');
    if (notAdmin) {
      const el = document.querySelectorAll('#role_based');
      el.forEach(child => child.parentNode.removeChild(child));
    }
  } catch (err) {}
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
    const {
      firstname, lastname, token, type
    } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('type', `${type}`);
    localStorage.setItem('name', `${firstname} ${lastname}`);
    toast(toastSuccess, 'User Profile Successfully Created');
    window.location.replace('./user/create-account.html');
  } catch (error) {
    toast(toastFail, error);
  }
};

// Implement login Functionality
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
    const {
      firstname, lastname, type, isadmin, token
    } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('name', `${firstname} ${lastname}`);
    localStorage.setItem('type', `${type}`);
    toast(toastSuccess, 'User Logged In');
    if (type === 'client') window.location.replace('./user/myaccounts.html');
    else if (type === 'staff') {
      window.location.replace('./admin/dashboard.html');
      if (!isadmin) localStorage.setItem('rl', 'f');
    }
  } catch (error) {
    toast(toastFail, error);
  }
};

// Implement create account Functionality
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
  const transactions = await request(`accounts/${accountnumber}/transactions`);
  if (!transactions.data) throw Error(transactions.error);
  const recentTransactions = transactions.data.slice(0, 4);
  recentTransactions.forEach((transaction) => {
    const recentTransactionsDOM = `<tr class="table__row">
    <td class="transac_date">${transaction.createddate}</td>
    <td class="transac_details">Caash Deposit //Lagos_Branch</td>
    <td class="transac_amount" id="credit_amt">${transaction.amount}</td>
  </tr> `;
    document.querySelector('tbody').insertAdjacentHTML('beforeend', recentTransactionsDOM);
  });
};

const transactions = async () => {
  isLoggedIn();
  const accountNumber = localStorage.getItem('no');
  const { data } = await request(`accounts/${accountNumber}/transactions`);
  data.forEach((transaction) => {
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

// Implement create role Functionality
const createRole = async (e) => {
  try {
    e.preventDefault();
    btnLoading();
    const email = userAccountForm.elements.email.value;
    const firstName = userAccountForm.elements.firstname.value;
    const lastName = userAccountForm.elements.lastname.value;
    const select = userAccountForm.querySelector('select');
    const role = select.options[select.selectedIndex].value;
    const data = JSON.stringify({
      email,
      firstName,
      lastName,
      role
    });
    const response = await request('createrole', 'POST', data);
    stopBtnLoading();
    if (!response.data) throw Error(response.error);
    toast(toastSuccess, 'User Profile Successfully Created');
  } catch (error) {
    toast(toastFail, error);
  }
};

const updateNameBalance = async () => {
  try {
    const accountNumberInput = updateBalanceForm.elements.account__number.value;
    if (accountNumberInput.length === 10) {
      const response = await request(`accounts/${accountNumberInput}`);
      const balanceDOM = updateBalanceForm.elements.balance;
      const nameDOM = updateBalanceForm.elements.name;
      if (!response.data) {
        balanceDOM.value = 'Null';
        nameDOM.value = 'Null';
        throw Error('Account does not exist');
      }
      const { balance, name } = response.data;
      balanceDOM.value = new Intl.NumberFormat('en-UK', {
        style: 'currency',
        currency: 'NGN'
      }).format(balance);
      nameDOM.value = name;
    }
  } catch (error) {
    toast(toastFail, error);
  }
};

const updateAccountBalance = async (event) => {
  try {
    event.preventDefault();
    const action = document.activeElement.textContent.trim().toLowerCase();
    // const description = updateBalanceForm.elements.description.value;
    const amount = updateBalanceForm.elements.amount.value;
    const accountNumber = updateBalanceForm.elements.account__number.value;
    const data = JSON.stringify({ amount });
    const response = await request(`transactions/${accountNumber}/${action}`, 'POST', data);
    if (!response.data) throw Error(response.error);
    toast(toastSuccess, `The ${action} transaction is successful`);
    updateBalanceForm.reset();
  } catch (error) {
    toast(toastFail, error);
  }
};

const allAccounts = async () => {
  isLoggedIn();
  const { data } = await request('accounts');
  if (!data) throw Error('No Registered Accounts');
  await Promise.all(
    data.map(async (account) => {
      const res = await request(`accounts/${account.accountnumber}`);
      const { name, type, accountnumber } = res.data;
      const accountDOM = `<tr class="table__row">
    <td class="row__account__name">${name}</td>
    <td class="row__account__number">${accountnumber}</td>
    <td class="row__account__type">${type}</td>
    <td>
      <a href="./view-bank-account.html" class="go__to__account__page"><button>Details</button></a>
    </td>
    </tr>`;
      document.querySelector('tbody').insertAdjacentHTML('beforeend', accountDOM);
    })
  );
  const accountDetailBtnDOM = document.querySelectorAll('.go__to__account__page');
  accountDetailBtnDOM.forEach((detailsDOM) => {
    detailsDOM.addEventListener('click', (event) => {
      event.preventDefault();
      const accountNumber = detailsDOM.parentElement.parentNode.querySelector(
        '.row__account__number'
      ).innerHTML;
      localStorage.setItem('no', accountNumber);
      window.location.replace('./view-bank-account.html');
    });
  });
};

const resetPassword = async (event) => {
  try {
    event.preventDefault();
    btnLoading();
    const password = resetPasswordForm.elements.old__password.value;
    const newPassword = resetPasswordForm.elements.password.value;
    const confirmNewPassword = resetPasswordForm.elements.confirm__password.value;
    const data = JSON.stringify({ password, newPassword, confirmNewPassword });
    const response = await request('auth/reset', 'PATCH', data);
    stopBtnLoading();
    if (!response.message) throw Error(response.error);
    toast(toastSuccess, response.message);
  } catch (error) {
    toast(toastFail, error);
  }
};

const indexAccessibility = () => {
  const type = localStorage.getItem('type');
  if (type === 'client') window.location.replace('./user/home.html');
  else if (type === 'staff') window.location.replace('./admin/dashboard.html');
};

const viewBankAccount = async () => {
  isLoggedIn();
  const accountNumber = localStorage.getItem('no');
  const response = await request(`accounts/${accountNumber}`);
  const {
    accountnumber, balance, type, createddate, name
  } = response.data;
  document.querySelector('.account__name').textContent = name;
  document.querySelector('.acct__number').textContent = accountnumber;
  document.querySelector('.acct__type').textContent = type;
  document.querySelector('.acct__date').textContent = new Date(createddate).toDateString();
  document.querySelector('.balance').appendChild(document.createTextNode(balance));
  const accountTransactions = await request(`accounts/${accountnumber}/transactions`);
  // if (!transactions.data) throw Error(transactions.error);
  const recentTransactions = accountTransactions.data.slice(0, 4);
  recentTransactions.forEach((transaction) => {
    const { createddate, amount } = transaction;
    const recentTransactionsDOM = `<tr class="table__row">
    <td class="transac_date">${new Date(createddate).toDateString()}</td>
    <td class="transac_details">Caash Deposit //Lagos_Branch</td>
    <td class="transac_amount" id="credit_amt">${amount}</td>
  </tr> `;
    document.querySelector('tbody').insertAdjacentHTML('beforeend', recentTransactionsDOM);
  });
};

const statusAction = () => {
  const statusButtonsDOM = document.querySelectorAll('#status__actions button');
  statusButtonsDOM.forEach((statusButton) => {
    statusButton.addEventListener('click', async () => {
      const statusDetail = statusButton.parentElement.parentNode;
      const accountNumber = statusDetail.querySelector('.row__account').innerHTML;
      let status = statusDetail.querySelector('.row__status').innerHTML;
      status = (status === 'active' && 'dormant') || (status === 'dormant' && 'active');
      const data = JSON.stringify({ status });
      await request(`account/${accountNumber}`, 'PATCH', data);
      statusDetail.querySelector('.row__status').textContent = status;
      const otherButton = document.activeElement.previousElementSibling || document.activeElement.nextElementSibling;
      document.activeElement.disabled = true;
      otherButton.disabled = false;
    });
  });
};

const accountStatus = async () => {
  try {
    const { data } = await request('accounts?');
    if (!data) throw Error('No Registered Accounts');
    await Promise.all(
      data.map(async (account) => {
        const response = await request(`accounts/${account.accountnumber}`);
        const { name, status, accountnumber } = response.data;
        const accountStatusDOM = `<tr class="table__row">
      <td class="user__names">${name}</td>
      <td class="row__account">${accountnumber}</td>
      <td class="row__status">${status}</td>
      <td class="row__actions" id="status__actions">
        <button class="activate__btn" ${status === 'active' && 'disabled'}>Activate</button>
        <button class="d_activate__btn" ${status === 'dormant' && 'disabled'}>Deactivate</button>
      </td>
    </tr>`;
        document.querySelector('tbody').insertAdjacentHTML('beforeend', accountStatusDOM);
      })
    );
    statusAction();
  } catch (error) {
    toast(toastFail, error);
  }
};

const deleteBankAccount = async () => {
  try {
    // eslint-disable-next-line no-alert
    const random = Math.random()
      .toString(32)
      .slice(7);
    const confirmation = prompt(`Confirm you are human. Enter these characters: ${random}`);
    if (confirmation !== random) throw Error('Characters entered did not mtach. Try Again!');
    const accountNumber = localStorage.getItem('no');
    const { status } = await request(`account/${accountNumber}`, 'DELETE');
    if (status !== 200) throw Error('You have encountered an error. Try Again!');
    toast(toastSuccess, 'Account Deleted!');
    localStorage.removeItem('no');
  } catch (error) {
    toast(toastFail, error);
  }
};

if (updateBalanceForm) {
  const accountNumberInputDOM = updateBalanceForm.elements.account__number;
  accountNumberInputDOM.addEventListener('input', updateNameBalance);
  updateBalanceForm.addEventListener('submit', updateAccountBalance);
}
if (registerForm) registerForm.addEventListener('submit', register);
if (bankAccountForm) bankAccountForm.addEventListener('submit', createAccount);
if (loginForm) loginForm.addEventListener('submit', signIn);
if (deleteAccount) deleteAccount.addEventListener('click', deleteBankAccount);
if (resetPasswordForm) resetPasswordForm.addEventListener('submit', resetPassword);
if (userAccountForm) userAccountForm.addEventListener('submit', createRole);
if (logoutBtn) logoutBtn.addEventListener('click', logutUser);
if (goBackBtn) goBackBtn.addEventListener('click', goBack);
if (passwordDOM) {
  passwordDOM.oninput = passwordConfirm;
  comfirmPasswordDom.oninput = passwordConfirm;
}

const currentView = window.location.pathname;
switch (currentView) {
  case '/user/create-account.html':
    isLoggedIn();
    break;

  case '/user/myaccounts.html':
    myAccounts();
    break;

  case '/user/home.html':
    accountDetails();
    break;

  case '/user/transactions.html':
    transactions();
    break;

  case '/index.html':
    indexAccessibility();
    break;

  case '/admin/dashboard.html':
    allAccounts();
    break;
  case '/admin/account-update.html':
    isLoggedIn();
    break;
  case '/admin/reset.html':
    isLoggedIn();
    break;

  case '/user/reset.html':
    isLoggedIn();
    break;

  case '/admin/view-bank-account.html':
    viewBankAccount();
    break;

  case '/admin/view-user-transactions.html':
    transactions();
    break;

  case '/admin/user-account-status.html':
    isLoggedIn();
    accountStatus();
    break;

  case '/admin/create-user.html':
    isLoggedIn();
    break;

  default:
    break;
}
