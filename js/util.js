async function loadGallery() {
	//Get list of media from list.txt
	fetch("../gallery/list.txt")
	.then(response => {
		if(!response.ok) {
			console.error(response.message);
		}
		
		return response.text();
	})
	.then(data => {
		window.galleryList = data.split("\n");
	})
	.catch(error => {
		console.error(error);
	});
}

window.createGallery = function() {
	if(window.galleryList == null || window.galleryList.length == 0) {
		await loadGallery();
	}
	
	for(var i = 0; i < window.galleryList.length; i++) {
		var source = window.galleryList[i];
		
		//Ignore if comment
		if(source.startsWith("#")) {
			continue;
		}
		
		var extention = window.getExtention(source);
		var type = window.getMediaType(source);
		
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
			console.log("couldn't determine type for \"" + source + "\"");
			return "Unknown";
	}
	
	return type;
}
