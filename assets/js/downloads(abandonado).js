encrypt = (salt, text) => {
	const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0)), byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2), applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
	return text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join("");
}

decrypt = (salt, encoded) => {
	const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0)), applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
	return encoded.match(/.{1,2}/g).map((hex) => parseInt(hex, 16)).map(applySaltToChar).map((charCode) => String.fromCharCode(charCode)).join("");
}

expiredAt = (storage) => {
	if (storage === null) { return }
	var j = JSON.parse(storage), s = new Date(), e = new Date(j.expiredAt*1000), d = Math.abs(e - s) / 1000, n = s > e ? -1 : 1;
	return [['days', 24 * 60 * 60], ['hours', 60 * 60], ['minutes', 60], ['seconds', 1]].reduce((x, [y, z]) => (x[y] = Math.floor(d / z) * n, d -= x[y] * n * z, x), {});
}

getUser = (key, storage) => {
	fetch(auth_url + key).then((res) => {
		if (!res.ok) {
			input.parentNode.classList.add("error");
			input.readOnly = false;
		} else {
			return res.json();
		}
	}).then(user => {
		if(storage === null) {
			sessionStorage.setItem("user", JSON.stringify(user))
		}
	});
}

urlsEncrypt = () => {
	const url_redirect = "{{ site.encrypt_url_redirect }}", urls_bases = {{ site.encrypt_urls_bases | jsonify }};
	for (let url of urls_bases){
		const all_urls = document.querySelectorAll("a[href*='" + url + "']");
		all_urls.forEach(value => {
			const url_encrypt = encrypt("{{ site.encrypt_key }}", value.getAttribute("href"));
			value.setAttribute("href", url_redirect + url_encrypt);
			value.setAttribute("target", "_blank");
		});
	}
}



window.addEventListener("load", function() {
	var input = document.getElementById("premium"),
		storage = sessionStorage.getItem("user"),
		auth_url = "https://6270907c6a36d4d62c1aa885.mockapi.io/auth/",
		time = expiredAt(storage),
		user = JSON.parse(storage);

	if((storage === null) || (Math.sign(time.seconds) === -1)) {
		input.onkeyup = function() {
			if (this.value.length === parseInt(this.attributes["maxlength"].value)) {
				getUser(this.value, storage);
				this.readOnly = true;
				this.parentNode.classList.add("completed");
			}
			if (this.value.length <= 19) {
				this.parentNode.classList.remove("completed");
			}
		}
	} else {
		init = setInterval(function() {
			var timeCheck = expiredAt(storage);
			if ((storage === null) || (Math.sign(timeCheck.seconds) === -1)) {
				input.value = user.key;
				clearInterval(init);
			} else {
				urlsEncrypt();
			}

		}, 1000);
		
	}
});

var login = document.getElementById("login"),
	storage = sessionStorage.getItem("user");
login.addEventListener("click", getUser(login.value, storage));