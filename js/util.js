window.addEventListener("DOMContentLoaded", function() {
	var ddt = document.body.querySelectorAll('[data-type="dropdownToggler"]');
	
	for(var i = 0; i < ddt.length; i++) {
		var toggler = ddt[i];
		
		//Add clicking functionality
		toggler.addEventListener("click", function(e) {
			toggleDropdown(e.target);
		});
		
		//Add triangular indicator
		var indicator = document.createElement("span");
		indicator.className = "dropdown";
		indicator.setAttribute("collapsed", "true");
		
		toggler.appendChild(indicator);
		
		//Collapse all menus
		var strTarget = toggler.getAttribute("data-target");
		
		var target = document.querySelector(strTarget);
		target.style.display = "none";
		target.setAttribute("collapsed", "true");
	}
});

window.toggleDropdown = function(e) {
	var strTarget = e.getAttribute("data-target");
	
	var target = document.querySelector(strTarget);
	
	var isCollapsed = target.getAttribute("collapsed");
	
	if(isCollapsed == "true") {
		target.style.display = "block";
		target.setAttribute("collapsed", "false");
		
		var indicator = e.getElementsByClassName("dropdown")[0];
		indicator.setAttribute("collapsed", "false");
	} else {
		target.style.display = "none";
		target.setAttribute("collapsed", "true");
		
		var indicator = e.getElementsByClassName("dropdown")[0];
		indicator.setAttribute("collapsed", "true");
	}
}