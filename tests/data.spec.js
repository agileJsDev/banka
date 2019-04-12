const inputs = {
  validSignupInputs: {
    email: 'xwebyna@gmail.com',
    firstName: 'Ayodeji',
    lastName: 'Afolabi',
    password: 'banka',
    confirmPassword: 'banka'
  },
  adminSignupInputs: {
    email: 'xwebynaADMIN@gmail.com',
    firstName: 'Ayodeji',
    lastName: 'Afolabi',
    password: 'banka',
    confirmPassword: 'banka',
    type: 'staff'
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
  },
  pswResetValid: {
    password: 'banka',
    newPassword: 'andela',
    confirmNewPassword: 'andela'
  },
  pswResetInValid: {
    password: 'banker',
    newPassword: 'andela',
    confirmNewPassword: 'andela'
  },
  pswResetInValid2: {
    password: 'banka',
    newPassword: 'andela',
    confirmNewPassword: 'andeler'
  }
};

export default inputs;
