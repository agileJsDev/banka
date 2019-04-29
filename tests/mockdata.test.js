const inputs = {
  validSignupInputs: {
    email: 'xwebyna@gmail.com',
    firstName: 'Ayodeji',
    lastName: 'Afolabi',
    password: 'BankaTest20',
    confirmPassword: 'BankaTest20'
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
    password: 'BankaTest20'
  },
  invalidLoginPsw: {
    email: 'xwebyna@gmail.com',
    password: 'Test20129'
  },
  invalidLoginEmail: {
    email: 'xwebynaxwebyna@gmail.com',
    password: 'BankaTest20'
  },
  pswResetValid: {
    password: 'BankaAdmin2019',
    newPassword: 'Andela2019',
    confirmNewPassword: 'Andela2019'
  },
  pswResetInValid: {
    password: 'Admin2019',
    newPassword: 'andela',
    confirmNewPassword: 'andela'
  },
  pswResetInValid2: {
    password: 'banka',
    newPassword: 'Andela2019',
    confirmNewPassword: 'Andela20197'
  },

  admin2SignupInputs: {
    email: 'xwebynaxwebyna@gmail.com',
    firstName: 'Ayodeji',
    lastName: 'Afolabi',
    password: 'banka',
    confirmPassword: 'banka',
    type: 'staff'
  }

};

export default inputs;
