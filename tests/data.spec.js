const inputs = {
  validSignupInputs: {
    email: 'xwebyna@gmail.com',
    firstName: 'Ayodeji',
    lastName: 'Afolabi',
    password: 'banka'
  },
  validLoginInputs: {
    email: 'xwebyna@gmail.com',
    password: 'banka'
  },
  invalidLoginPsw: {
    email: 'xwebyna@gmail.com',
    password: 'banka@invalid'
  },
  invalidLoginEmail: {
    email: 'xwebynaxwebyna@gmail.com',
    password: 'banka'
  }
};

export default inputs;
