function getConsent() {
	if (!localStorage.getItem("cookie_consent")) {
		document.body.innerHTML += '\
		<div class="cookie_consent" style="position:fixed;padding:20px;left:0;bottom:0;background-color:#000;color:#FFF;text-align:center;width:100%;z-index:99999;">\
			This site uses cookies. By continuing to use this website, you agree to their use. \
			<a href="#" style="color:#CCCCCC;">I Understand</a>\
		</div>\
		';
		document.querySelector(".cookie_consent a").onclick = function(e) {
			e.preventDefault();
			document.querySelector(".cookie_consent").style.display = 'none';
			localStorage.setItem('cookie_consent', "true");
		};
	}
}

getConsent();
