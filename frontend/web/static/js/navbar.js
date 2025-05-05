$(window).scroll(function() {
  if ($(document).scrollTop() > 50) {
    $('.navbar-first').css({'top': '-80px'});
    $('.navbar-second').css({'top': '0px'});
  } else {
    $('.navbar-first').css({'top': '0px'});
    $('.navbar-second').css({'top': '80px'});
  }
});
var script = document.createElement('script');
script.onload = function () {
    console.log('Application Insights successfully loaded')
};
script.src = 'https://app.roqs.basf.net/application_insights/api/ai.js';
document.head.appendChild(script);