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

		//Remove comments
		galleryList = galleryList.filter(item => !item.startsWith('#'));
		
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
