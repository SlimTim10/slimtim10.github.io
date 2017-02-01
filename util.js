var toggleList = function(outerList) {
  var innerList = outerList.getElementsByTagName('ul')[0];
  if (innerList.style.display === "none" || innerList.style.display === "") {
    innerList.style.display = "block";
    outerList.style.color = "#999";
  } else {
    innerList.style.display = "none";
    outerList.style.color = "white";
  }
};
