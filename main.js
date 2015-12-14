function setContent(contentFile) {
	var HTTP_OK = 200;
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		return false;
	}

	var doChange = function() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === HTTP_OK) {
				document.getElementById("content").innerHTML = httpRequest.responseText;
			} else {
				return false;
			}
		}
	};

	httpRequest.onreadystatechange = doChange;
	httpRequest.open("GET", contentFile + ".html");
	httpRequest.send();
}
