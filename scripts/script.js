"use strict";
$(document).ready(function() {
	function loadGallery() {
		$("#images").empty();
		var sub = $("#subreddit").val();
		var count = $("#imageCount").val();
		var sort = $("#sort").val();
		var hasnsfw = $("#allowNSFW").prop('checked');
		var minWid = $("#imgWidth").val();
		var minHei = $("#imgHeight").val();
		var total = 0;
		$.getJSON("https://www.reddit.com/r/"+sub+"/"+sort+"/.json?jsonp=&limit="+count+"&count="+count, function(data) { 
			$.each(data.data.children, function(i,item){
				if ((hasnsfw==false && item.data.over_18!=true) || hasnsfw==true) {
					var linkpreview = item.data.preview;
					var prevSource = "";
					var prevSourceURL = "";
					var imgLink = "";
					var imgCont = $("<div>").attr("class", "imgCont");
					var image = $("<img>").attr("class", "imageResult");
					var showImg = true;
					if (linkpreview) {
						prevSource = linkpreview.images[0].source;
						prevSourceURL = unescape(prevSource.url);
						imgLink = $("<a>").attr("href", prevSourceURL);
						image.attr("src", prevSourceURL);
						if (prevSource.width >= minWid && prevSource.height >= minHei) {
							imgLink = imgLink.attr("download",true);
						} else {
							showImg = false;
							console.log("blocked: is "+prevSource.width+"x"+prevSource.height);
						}
					} else {
						showImg = false;
						imgLink = $("<a>").attr("href", item.data.url);
						image.attr("src", item.data.url);
						imgCont.addClass("notAnImg");
					}
					
					if (showImg) {
						total = total + 1;
						if (item.data.over_18==true) {
							image.addClass("nsfw");
						}
						var commentLink = $("<a>")
						.attr("href", "https://www.reddit.com"+item.data.permalink)
						.append(item.data.title)
						.addClass("imgTitle");
						imgLink = imgLink.append(image);
						imgCont = imgCont.append(imgLink);
						if (linkpreview) {
							imgCont = imgCont.append();
						}
						imgCont = imgCont.append("<br>");
						imgCont = imgCont.append(commentLink);
						imgCont.appendTo("#images");
					}
				}
			});
			$("#totalCount").text("loaded "+total+" images");
		});
	}
	$("#inputForm").submit(function(e) {
		loadGallery();
		e.preventDefault();
	});
	loadGallery();
});
