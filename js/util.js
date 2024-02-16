//Create dropdown
window.addEventListener("DOMContentLoaded", function() {
	//Get all dropdown togglers
	var togglers = document.getElementsByClassName("ddToggler");
	
	for(var i = 0; i < togglers.length; i++) {
		var toggle = togglers[i];
		
		//Add click functionality
		toggle.addEventListener("pointerup", function(evt) {
			toggleDropdown(evt.target);
		});
		
		//Remove click functionality for dropdown icon
		toggle.querySelector(".ddIcon").removeEventListener("pointerup", function(evt) {
			toggleDropdown(evt.target);
		});
		
		//Hide dropdown
		toggle.querySelector(".ddIcon").setAttribute("collapsed", "false");
		toggleDropdown(toggle);
		
		//Set parent to relative
		toggle.parentElement.style.position = "relative";
	}
});

window.toggleDropdown = function(elmt) {
	//Get target element
	var target = elmt.parentElement.querySelector(".ddMenu");
	
	//Toggle target visibility
	target.style.display = (target.style.display == "none") ? "block" : "none";
	
	//Toggle dropdown icon
	var icon = elmt.querySelector(".ddIcon");
	
	icon.setAttribute("collapsed", icon.getAttribute("collapsed") == "false");
}

window.createGallery = function(limit = 100) {
	//Get list of media from list.txt
	fetch("gallery/list.txt")
	.then(response => {
		if(!response.ok) {
			console.error(response.message);
		}
		
		return response.text();
	})
	.then(data => {
		data = data.replaceAll("\r", "");
		var galleryList = data.split("\n");

		//Remove comments and empty lines
		galleryList = galleryList.filter(item => !(item.startsWith('#') || item.length == 0));
		
		galleryList = getRandomUniqueItems(galleryList, limit);
		
		//Create elements
		for(var i = 0; i < galleryList.length; i++) {
			var source = galleryList[i];
			
			//Ignore if comment
			if(source.startsWith("#")) {
				continue;
			}
			
			var extention = window.getExtention(source);
			var type = window.getMediaType(source);
	
			source = "gallery/" + source;
				
			//Create element
			if(type == "img") {
				var img = document.createElement("img");
				img.src = source;
				img.alt = source.split("/").pop().split(".")[0];
				
				document.getElementById("gallery").appendChild(img);
			}
			if(type == "video") {
				var video = document.createElement("video");
				var src = document.createElement("source");
				src.src = source;
				src.type = "video/" + extention;
				video.appendChild(src);
				
				document.getElementById("gallery").appendChild(video);
			}
		}
	})
	.catch(error => {
		console.error(error);
	});
}

window.getExtention = function(name) {
	return name.split(".").pop().toLowerCase();
}

window.getMediaType = function(name) {
	//Get extention
	var extention = window.getExtention(name);
	
	var type = "";
	switch(extention) {
		case "jpg":
		case "jpeg":
		case "png":
		case "pdf":
		case "svg":
		case "gif":
			type = "img";
			break;
		
		case "mp4":
		case "webm":
			type = "video";
			break;
		
		default:
			console.log("couldn't determine type for \"" + name + "\"");
			return "Unknown";
	}
	
	return type;
}

window.getRandomUniqueItems = function(arr, n) {
  // Check if the array has enough items
  if (n > arr.length) {
    console.error("Error: Not enough items in the array.");
    return arr;
  }

  // Clone the array to avoid modifying the original
  const shuffledArray = [...arr];

  // Fisher-Yates shuffle algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Return the first n items from the shuffled array
  return shuffledArray.slice(0, n);
}

window.handleFormSubmission = function(evt) {
	evt.preventDefault();
	
	var formData = new FormData(evt.target);
	
	const formDataObject = {};
	formData.forEach((value, key) => {
		formDataObject[key] = value;
	});
	
	sendEmail(formDataObject);
}

window.sendEmail = function(data) {
	//Replace empty strings
	var nonEmpty = {};
	Object.keys(data).forEach(key => {
		nonEmpty[key] = data[key] === '' ? 'unknown' : data[key];
	});
	
	data = nonEmpty;
	
	var dest = "admin@believeedu.co.za";
	var subject = "Student application";
	
	// var body = "Good day,\n" +
			// "I would like to enroll <span style=\"font-weight: bold;\">" + data.name + "</span> " + 
			// "in the <span style=\"font-weight: bold;\">" + data.curriculum + "</span> curriculum.\n" +
			// "Their ID number is <span style=\"font-weight: bold;\">" + data.idNum + "</span> and they " +
			// "will be attending level <span style=\"font-weight: bold;\">" + data.grade + "</span>.\n" +
			// "I give the following permissions: <span style=\"font-weight: bold;\">" + getPermissions(data) +
			// "</span>.\nMy child's father's name is <span style=\"font-weight: bold;\">" + data.father +
			// "</span> and his number is <span style=\"font-weight: bold;\">" + data.telFather + "</span>.\n" +
			// "My child's mother's name is <span style=\"font-weight: bold;\">" + data.mother+
			// "</span> and her number is <span style=\"font-weight: bold;\">" + data.telMother+ "</span>.\n" +
			// "My email address is <span style=\"font-weight: bold;\">" + data.email + "</span>.\n" +
			// "My emergency contact is <span style=\"font-weight: bold\">" + data.emergency + "</span>.\n" +
			// "My family's doctor is <span style=\"font-weight: bold;\">" + data.doctor + "</span>.\n\n" +
			// "The account should be made in my name <span style=\"font-weight: bold;\">(" + data.holderName + ")</span>. " +
			// "My ID number is <span style=\"font-weight: bold;\">" + data.holderId + "</span> and my number is " +
			// "<span style=\"font-weight: bold;\">" + data.holderTel + "</span>.\n" +
			// "Our address is <span style=\"font-weight: bold;\">" + data.address + "</span>.\n" +
			// "You can send any invoices to <span style=\"font-weight: bold;\">" + data.holderEmail + "</span>.\n\n" +
			// "Sincerely,\n" +
			// data.holderName;
			
		var body = "Good day,\n" +
			"I would like to enroll " + data.name + " " + 
			"in the " + data.curriculum + " curriculum.\n" +
			"Their ID number is " + data.idNum + " and they " +
			"will be attending level " + data.grade + ".\n" +
			"I give the following permissions: " + getPermissions(data) +
			".\nMy child's father's name is " + data.father +
			" and his number is " + data.telFather + ".\n" +
			"My child's mother's name is " + data.mother+
			" and her number is " + data.telMother+ ".\n" +
			"My email address is " + data.email + ".\n" +
			"My emergency contact is " + data.emergency + ".\n" +
			"My family's doctor is " + data.doctor + ".\n\n" +
			"The account should be made in my name (" + data.holderName + ") and " +
			"my ID number is " + data.holderId + ". My number is " + data.holderTel + ".\n" +
			"Our address is " + data.address + ".\n" +
			"You can send any invoices to " + data.holderEmail + ".\n\n" +
			"Sincerely,\n" +
			data.holderName;
	
	
	var concat = "mailto:" + encodeURIComponent(dest) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
	
	var mailer = document.createElement("a");
	mailer.href = concat;//encodeURIComponent(concat);
	mailer.target = "_blank";
	mailer.style.display = "none";
	mailer.click();
	mailer.remove();
}

window.getPermissions = function(data) {
	var list = getKeysWithValue(data, "on").join(", ");
	return list.length == 0 ? "none" : list;
}

window.getKeysWithValue = function(obj, targetValue) {
  return Object.keys(obj).filter(key => obj[key] === targetValue);
}
