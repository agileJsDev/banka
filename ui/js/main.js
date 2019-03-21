const xBtn = document.querySelector(".x-btn");
const mobileMenu = document.querySelector(".mobile__top-nav");

/* Mobile Menu*/
xBtn.addEventListener('click', () => {
	mobileMenu.style.display === "block" ? mobileMenu.style.display = "none" : mobileMenu.style.display = "block";
	xBtn.classList.toggle("change");
});
