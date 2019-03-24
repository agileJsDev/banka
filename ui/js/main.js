const xBtn = document.querySelector(".x-btn");
const mobileMenu = document.querySelector(".mobile__top-nav");
const passwordDOM = document.querySelector("#password")
const comfirmPasswordDom = document.querySelector("#confirm_password");
const grid = document.querySelector(".grid-container");



/* Mobile Menu Functionality*/
xBtn.addEventListener('click', () => {
	if ( mobileMenu) {
	mobileMenu.style.display === "block" ? mobileMenu.style.display = "none" : mobileMenu.style.display = "block";
	}
	if (grid) {
		grid.classList.toggle("dropdown__active")
	}
	xBtn.classList.toggle("change");
});




/* Front-end Password Confirmation */
const confirmPassword = () => {
	if ( passwordDOM.value === comfirmPasswordDom.value ) {
		comfirmPasswordDom.setCustomValidity('');
	} else {
		comfirmPasswordDom.setCustomValidity("Passwords don't match.");
	}
}

if (passwordDOM) {
	passwordDOM.oninput = confirmPassword;comfirmPasswordDom.oninput = confirmPassword;
};