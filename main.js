(function() {
  "use strict";

  var setInnerHTML = function(elementId, html) {
    var el = document.getElementById(elementId);
    if (el) {
      el.innerHTML = html;
    }
  };
  
  var setContent = function(contentId, contentFile) {
    var HTTP_OK = 200;
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      return false;
    }

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === HTTP_OK) {
          setInnerHTML(contentId, httpRequest.responseText);
        } else {
          return false;
        }
      }
    };
    httpRequest.open("GET", contentFile);
    httpRequest.send();
  };

  setContent("footer", "footer.html");
  setContent("banner", "banner.html");
  setContent("categories", "categories.html");
}());
