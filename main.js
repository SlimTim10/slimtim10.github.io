(function() {
  "use strict";

  var setInnerHTML = function(elementId, html) {
    document.getElementById(elementId).innerHTML = html;
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

  var setupContentLink = function(contentId, linkId, contentFile) {
    document.getElementById(linkId).addEventListener("click", function(e) {
      setContent(contentId, contentFile);
    });
  };

  var setupContentLinks = function(links) {
    links.forEach(function(link) {
      setupContentLink(link[0], link[1], link[3]);
    });
  };

  // Load correct content on page load based on hash link
  var pageLoadContent = function(links) {
    links.forEach(function(link) {
      if (window.location.hash === link[2]) {
        setContent(link[0], link[3]);
      }
    });
  };

  var links = [
    ["content", "about-link", "#about", "about.html"],
    ["content", "projects-link", "#projects", "projects.html"],
    ["content", "blog-link", "#blog", "blog.html"],
  ];
  
  setupContentLinks(links);
  pageLoadContent(links);
}());
