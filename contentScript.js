const pwdFieldCount = document.querySelectorAll('input[type=password]').length

chrome.runtime.sendMessage({pwdFieldCount}, function(response) {
	console.log(response);
});
