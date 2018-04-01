window.onload = function(){
	var aTags = document.getElementsByTagName("A");
	for(var i in aTags) {
		var a = aTags[i];
		if (a.rel && a.rel == "external") {
			a.title = "Opens new window";
			a.onclick = function() {
				newwindow = window.open(this.href, '_blank');
				newwindow.focus();
				return false;
			};
		}
	}
}
