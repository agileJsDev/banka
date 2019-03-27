const xBtn = document.querySelector(".x-btn");
const mobileMenu = document.querySelector(".mobile__top-nav");
const passwordDOM = document.querySelector("#password")
const comfirmPasswordDom = document.querySelector("#confirm_password");
const grid = document.querySelector(".grid-container");
const divi = document.querySelector('.divi')

const createNode = (element, content) => {
	const el = document.createElement(element);
	el.textContent = content;
	return el;
}

const appendTo = (parent, child) => parent.appendChild(child);

/* Mobile Menu Functionality*/
xBtn.addEventListener('click', () => {
	if (mobileMenu) {
		mobileMenu.style.display === "block" ? mobileMenu.style.display = "none" : mobileMenu.style.display = "block";
	}
	if (grid) {
		grid.classList.toggle("dropdown__active")
	}
	xBtn.classList.toggle("change");
});

/* Front-end Password Confirmation */
const confirmPassword = () => {
	if (passwordDOM.value === comfirmPasswordDom.value) {
		comfirmPasswordDom.setCustomValidity('');
	} else {
		comfirmPasswordDom.setCustomValidity("Passwords don't match.");
	}
}
if (passwordDOM) {
	passwordDOM.oninput = confirmPassword; comfirmPasswordDom.oninput = confirmPassword;
};

class Dialog {
	modal(parentDiv) {
		const dialog = document.querySelector('.dialog');
		const close = document.querySelector('.close');

		dialog.classList.add('hidden');
		const arry = [close, dialog]
		arry.forEach(dom => {
			dom.addEventListener('click', () => {
				dialog.classList.remove('hidden');
				while (parentDiv.firstChild) {
					parentDiv.removeChild(parentDiv.firstChild)
				};
			});
		});
	};
};


const getTransaction = () => {
	const viewDetailsBtnDOM = document.querySelectorAll('.view__btn');
	viewDetailsBtnDOM.forEach(btnDOM => {
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
			const parentNode = createNode('div', '')
			appendTo(parentNode, h1Tag);
			appendTo(parentNode, para);
			appendTo(parentNode, amountTag);
			divi.appendChild(parentNode)
			const dialog = new Dialog;
			dialog.modal(divi);
		});
	});
};
getTransaction();

