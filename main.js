(function() {
  "use strict";

  var fillHead = function() {
    document.head.innerHTML += '<link href="https://fonts.googleapis.com/css?family=Raleway:700|Source+Sans+Pro|PT+Sans+Narrow:700" rel="stylesheet">';
  };

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

  var pageLoadContent = function() {
    var hash = window.location.hash.split(":");
    var id = hash[0].slice(1);
    var page = hash[1];
    if (id && page) {
      setContent(id, page + ".html");
    }
  };

  fillHead();
  
  setContent("footer", "footer.html");
  setContent("banner", "banner.html");
  setContent("categories", "categories.html");

  pageLoadContent();

  window.onhashchange = pageLoadContent;
}());
