const xBtn = document.querySelector(".x-btn");
const mobileMenu = document.querySelector(".mobile__top-nav");
const passwordDOM = document.querySelector("#password")
const comfirmPasswordDom = document.querySelector("#confirm_password");



/* Mobile Menu*/
xBtn.addEventListener('click', () => {
	mobileMenu.style.display === "block" ? mobileMenu.style.display = "none" : mobileMenu.style.display = "block";
	xBtn.classList.toggle("change");
});

/* To confirm input password match*/
const confirmPassword = () => {
	if ( passwordDOM.value === comfirmPasswordDom.value ) {
		comfirmPasswordDom.setCustomValidity('');
	} else {
		comfirmPasswordDom.setCustomValidity("Passwords don't match.");
		return
	}
}

if (passwordDOM != null) {
	passwordDOM.oninput = confirmPassword;comfirmPasswordDom.oninput = confirmPassword;
};




