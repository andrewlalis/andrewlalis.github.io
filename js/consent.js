function getConsent() {
	if (!localStorage.getItem("cookie_consent")) {
		document.body.innerHTML += '\
		<div class="cookie_consent">\
			This site uses third-party cookies. By continuing to use this site, you agree to their usage. \
			<a href="#">I&nbsp;understand.</a>\
		</div>\
		';
		document.querySelector(".cookie_consent a").onclick = function(e) {
			e.preventDefault();
			document.querySelector(".cookie_consent").style.display = "none";
			localStorage.setItem("cookie_consent", "true");
		};
	}
}

getConsent();
