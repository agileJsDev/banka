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

const createNode = (element, content) => {
  const el = document.createElement(element);
  el.textContent = content;
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

const toast = (className, msg) => {
  const divToast = createNode('div', msg);
  divToast.className = className;
  document.body.appendChild(divToast);
  setTimeout(() => document.body.removeChild(divToast), 4000);
};
const toastSuccess = 'toast__success';
const toastFail = 'toast__fail';

/* Mobile Menu Functionality */
xBtn.addEventListener('click', () => {
  if (mobileMenu) {
    mobileMenu.style.display === 'block'
      ? (mobileMenu.style.display = 'none')
      : (mobileMenu.style.display = 'block');
  }
  if (grid) {
    grid.classList.toggle('dropdown__active');
  }
  xBtn.classList.toggle('change');
});

/* Front-end Password Confirmation */
const confirmPassword = () => {
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
      const parentNode = createNode('div', '');
      appendTo(parentNode, h1Tag);
      appendTo(parentNode, para);
      appendTo(parentNode, amountTag);
      divi.appendChild(parentNode);
      modal(divi);
    });
  });
};

// const workBtn = document.querySelector('.work--btn')
const signInSample = (e) => {
  e.preventDefault();
  const loadR = (button, callback) => {
    button.disabled = true;
    button.classList.add('loading');
    setTimeout(() => {
      button.disabled = false;
      button.classList.remove('loading');
      callback();
    }, 3000);
  };

  loadR(formButton, () => {
    toast(toastSuccess, 'Success Dialog. Simply giving feedback to user.');
    if (loginForm) window.location.replace('./user/myaccounts.html');
    if (registerForm) window.location.replace('./user/create-account.html');
    if (bankAccountForm) window.location.replace('./myaccounts.html');
  });
};

const deleteBankAccount = () => {
  const res = prompt('Are you sure you want this account deleted? Enter your password to confirm: ');
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


getTransactionDetails();
if (registerForm) registerForm.addEventListener('submit', signInSample);
if (loginForm) loginForm.addEventListener('submit', signInSample);
if (bankAccountForm) bankAccountForm.addEventListener('submit', signInSample);
if (deleteAccount) deleteAccount.addEventListener('click', deleteBankAccount);
if (resetPasswordForm) resetPasswordForm.addEventListener('submit', signInSample);
if (userAccountForm) userAccountForm.addEventListener('submit', signInSample);
if (logoutBtn) logoutBtn.addEventListener('click', logutUser);
if (goBackBtn) goBackBtn.addEventListener('click', goBack);
if (passwordDOM) {
  passwordDOM.oninput = confirmPassword;
  comfirmPasswordDom.oninput = confirmPassword;
}
