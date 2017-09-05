// $Revision: 15879 $ $Date: 2013-09-26 17:53:24 -0300 (Thu, 26 Sep 2013) $
function LumisMediaController()
{
	this.addMedia = addMedia;
	this.showMedia = showMedia;
	this.makeImageMedia = makeImageMedia;
	this.makeVideoMedia = makeVideoMedia;
	this.makeAudioMedia = makeAudioMedia;
	this.makeGenericFile = makeGenericFile;
	this.getFirstMedia =  getFirstMedia;
	
	var lumisGenericFileElements = new Array();
	var lumisImgMediaElements = new Array();
	var lumisAudioMediaElements = new Array();
	var lumisAudioSourceMediaElements = new Array();
	var lumisVideoMediaElements = new Array();
	var lumisVideoSourceMediaElements = new Array();
	var lumisMedias = new Array();
	var lumisFirstMedias = new Array();

	function makeImageMedia(src, title, albumId, legend, credits)
	{
		var img = getImageElement(albumId);
		var audio = getAudioElement(albumId);
		var video = getVideoElement(albumId);
		var downloadMessage = getDownloadMessageElement(albumId);
		
		if(downloadMessage != null)
		{
			downloadMessage.style.display = "none";
		}
		
		if(audio != null)
		{
			audio.style.display = "none";
			try
			{
				pauseByType("audio", albumId);
			}
			catch(e){}
		}
		
		if(video != null)
		{
			video.style.display = "none";
			try
			{
				pauseByType("video",albumId);
			}
			catch(e){}
		}
		
		img.src = src;
		img.title = title;
		img.style.display = "";
		
		document.getElementById("lumisAlbumMedia" + albumId).style.display = "";
		setUpLegendAndCredits(legend, credits);
	}
	
	function makeGenericFile(src, title, albumId, legend, credits, downloadURL)
	{
		var img = getImageElement(albumId);
		var audio = getAudioElement(albumId);
		var video = getVideoElement(albumId);
		var downloadMessage = getDownloadMessageElement(albumId);
		
		if(audio != null)
		{
			audio.style.display = "none";
			try
			{
				pauseByType("audio", albumId);
			}
			catch(e){}
		}
		
		if(video != null)
		{
			video.style.display = "none";
			try
			{
				pauseByType("video",albumId);
			}
			catch(e){}
		}
		
		img.src = src;
		img.title = title;
		img.style.display = "";
		
		$("#lum_album_downl_file" + albumId)[0].href = downloadURL;
		document.getElementById("lumisAlbumMedia" + albumId).style.display = "";
		setUpLegendAndCredits(legend, credits);
		downloadMessage.style.display = "";
	}
	
	function makeVideoMedia(src, contentType, albumId, legend, credits)
	{
		var img = getImageElement(albumId);
		var audio = getAudioElement(albumId);
		var video = getVideoElement(albumId);
		var downloadMessage = getDownloadMessageElement(albumId);
		
		if(downloadMessage != null)
		{
			downloadMessage.style.display = "none";
		}
		
		if(audio != null)
		{
			audio.style.display = "none";
			try
			{
				pauseByType("audio", albumId);
			}
			catch(e){}
		}
		
		if(img != null)
			img.style.display = "none";
		
		if(video != null)
		{
			pauseByType("video",albumId);
			
			if (src && src != null && src.length > 0)
			{
				var videoHTML = '<video class="album-img" controls="controls" width="600">';
				var innerHTML = "<div class=\"html5tag-msg\">" + $("#lumAlbum" + albumId + "_video div.html5tag-msg").html() + "</div>";
				var sourceElements = '';
				for(var x = 0; x < src.length; x++)
				{
					sourceElements += '<source src="'+src[x]+'" media="screen"></source>';
				}
				videoHTML += sourceElements + innerHTML + '</video>'
				$(video).html("");
				$(video).append(videoHTML);
				video.style.display = "";
				try
				{
					$("#lumAlbum" + albumId + "_video video")[0].load();
					$("#lumAlbum" + albumId + "_video video")[0].play();
				}
				catch(e){}
				if($("#lum_album_downl_video" + albumId)[0])
					$("#lum_album_downl_video" + albumId)[0].href = src[0];
			}
		}
		else
		{
			video.style.display = "";
		}
		
		document.getElementById("lumisAlbumMedia" + albumId).style.display = "";
		setUpLegendAndCredits(legend, credits);
	}
	
	function makeAudioMedia(src, contentType, albumId, legend, credits)
	{
		var img = getImageElement(albumId);
		var audio = getAudioElement(albumId);
		var video = getVideoElement(albumId);
		var downloadMessage = getDownloadMessageElement(albumId);
		
		if(downloadMessage != null)
		{
			downloadMessage.style.display = "none";
		}
		
		if(video != null)
		{
			video.style.display = "none";
			try
			{
				pauseByType("video",albumId);
			}
			catch(e){}
		}
		if(img != null)
			img.style.display = "none";
		
		if(audio != null)
		{
			pauseByType("audio", albumId);
			
			if (src && src != null && src.length > 0)
			{
				var audioHTML = '<audio class="album-img" controls="controls">';
				var innerHTML = "<div class=\"html5tag-msg\">" + $("#lumAlbum" + albumId + "_audio div.html5tag-msg").html() + "</div>";
				var sourceElements = '';
				for(var x = 0; x < src.length; x++)
				{
					sourceElements += '<source src="'+src[x]+'" media="screen"></source>';
				}
				audioHTML += sourceElements + innerHTML + '</audio>'
				$(audio).html("");
				$(audio).append(audioHTML);
				audio.style.display = "";
				try
				{
					$("#lumAlbum" + albumId + "_audio audio")[0].load();
					$("#lumAlbum" + albumId + "_audio audio")[0].play();
				}
				catch(e){}
				if($("#lum_album_downl_audio" + albumId)[0])
					$("#lum_album_downl_audio" + albumId)[0].href = src[0];
			}
		}
		else
		{
			audio.style.display = "";
		}
		
		document.getElementById("lumisAlbumMedia" + albumId).style.display = "";
		setUpLegendAndCredits(legend, credits);
	}
	
	function setUpLegendAndCredits(legend, credits)
	{
		if((legend != null && legend.length > 0) || (credits != null && credits.length > 0))
		{
			if(legend != null && legend.length > 0)
			{
				$(".cLumMediaAlbumLegend").text(legend);
				$(".cLumMediaAlbumLegend").show();
			}
			else
			{
				$(".cLumMediaAlbumLegend").hide();
			}
			
			if(credits != null && credits.length > 0)
			{
				$(".cLumMediaAlbumCreditsText").text(credits);
				$(".cLumMediaAlbumCredits").show();
			}
			else
			{
				$(".cLumMediaAlbumCredits").hide();
			}
			
			$(".album-imgdesc").show();
		}
		else
		{
			$(".album-imgdesc").hide();
		}
	}
	
	function getImageElement(albumId)
	{
		return getElementInCache(albumId, lumisImgMediaElements, function(albumId)
		{
			return document.getElementById("lumAlbum" + albumId + "_img");
		});	
	}

	function getDownloadMessageElement(albumId)
	{
		return getElementInCache(albumId, lumisGenericFileElements, function(albumId)
		{
			return document.getElementById("lumAlbum" + albumId + "_file");
		});	
	}
	
	function getAudioElement(albumId)
	{
		return getElementInCache(albumId, lumisAudioMediaElements, function(albumId)
		{
			return document.getElementById("lumAlbum" + albumId + "_audio");
		});
	}
	
	function getAudioSourceElement(albumId)
	{
		return getElementInCache(albumId, lumisAudioSourceMediaElements, function(albumId)
		{
			var audioSrc = getAudioElement(albumId).firstChild;
			while(audioSrc != null)
			{
				if(audioSrc.nodeType == 1 && audioSrc.tagName.toUpperCase() == "SOURCE")
					break;
				
				audioSrc = audioSrc.nextSibling;
			}
			
			return audioSrc;
		});
	}
	
	function getVideoElement(albumId)
	{
		return getElementInCache(albumId, lumisVideoMediaElements, function(albumId)
		{
			return document.getElementById("lumAlbum" + albumId + "_video");
		});
	}
	
	function getVideoSourceElement(albumId)
	{
		return getElementInCache(albumId, lumisVideoSourceMediaElements, function(albumId)
		{
			var videoSrc = getVideoElement(albumId).firstChild;
			while(videoSrc != null)
			{
				if(videoSrc.nodeType == 1 && videoSrc.tagName.toUpperCase() == "SOURCE")
					break;
				
				videoSrc = videoSrc.nextSibling;
			}
			
			return videoSrc;
		});
	}
	
	function getElementInCache(albumId, cacheArray, functionRead)
	{
		if(cacheArray[albumId] != null)
			return cacheArray[albumId];
		
		var elem = functionRead(albumId);
		cacheArray[albumId] = elem;
		return elem;
	}
	
	function addMedia(media, mediaId, albumId)
	{
		lumisMedias[mediaId] = media;
		if(lumisFirstMedias[albumId] == null)
		{
			lumisFirstMedias[albumId] = media;
		}
	}
	
	function showMedia(mediaId)
	{
		var media = lumisMedias[mediaId];
		if(media != null)
		{
			media.make();
		}
	}
	
	function getFirstMedia(albumId)
	{
		return lumisFirstMedias[albumId];
	}
}

var LumisMediaController = new LumisMediaController();

function LumisVideoMedia(mediaId, src, contentType, albumId, legend, credits)
{
	this.src = src;
	this.contentType = contentType;
	this.albumId = albumId;
	this.make = make;
	this.legend = legend;
	this.credits = credits;
	LumisMediaController.addMedia(this, mediaId, albumId);
	
	function make()
	{
		LumisMediaController.makeVideoMedia(src, contentType, albumId, legend, credits);
	}
}

function LumisAudioMedia(mediaId, src, contentType, albumId, legend, credits)
{
	this.src = src;
	this.contentType = contentType;
	this.albumId = albumId;
	this.make = make;
	this.legend = legend;
	this.credits = credits;
	LumisMediaController.addMedia(this, mediaId, albumId);
	
	function make()
	{
		LumisMediaController.makeAudioMedia(src, contentType, albumId, legend, credits);
	}
}

function LumisFile(mediaId, src, title, albumId, legend, credits, downLoadURL)
{
	this.src = src;
	this.title = title;
	this.albumId = albumId;
	this.make = make;
	this.legend = legend;
	this.credits = credits;
	this.downLoadURL = downLoadURL;
	LumisMediaController.addMedia(this, mediaId, albumId);
	
	function make()
	{
		LumisMediaController.makeGenericFile(src, title, albumId, legend, credits, downLoadURL);
	}
}

function LumisImageMedia(mediaId, src, title, albumId, legend, credits, downloadURL)
{
	this.src = src;
	this.title = title;
	this.albumId = albumId;
	this.make = make;
	this.legend = legend;
	this.credits = credits;
	LumisMediaController.addMedia(this, mediaId, albumId);
	
	function make()
	{
		LumisMediaController.makeImageMedia(src, title, albumId, legend, credits);
	}
}

function setNavigationButtons(id)
{
	var height = $('#'+id).height();
	var position = height * 0.5;
	// treats the height of navigation button to avoid problems with small images
	// the height of navigation button is 24px
	if (position > 12)
	{
		position -= 12;
	}
	$('#previous').css('margin-top',position + 'px');
	$('#next').css('margin-top',position + 'px');
	$('#previous').css('display','block');
	$('#next').css('display','block');
}

function hideNextAndPrevious()
{
	$('#previous').css('display','none');
	$('#next').css('display','none');
}

function previous()
{
	if (!$(".selected").parent().prev().is(':visible'))
	{
		$(".goto_previous").click();
	}
	$(".selected").parent().prev().children().click();
	hideNextAndPrevious();
}

function next()
{
	if (!$(".selected").parent().next().is(':visible'))
	{
		$(".goto_next").click();
	}
	$(".selected").parent().next().children().click();
	hideNextAndPrevious();
}

function pauseByType(type, albumId)
{	
	if(type == "audio")
	{
		if($("#lumAlbum" + albumId + "_audio audio").length > 0)
		{
			$("#lumAlbum" + albumId + "_audio audio")[0].pause();
		}
	}
	else if(type == "video")
	{
		if($("#lumAlbum" + albumId + "_video video").length > 0)
		{
			$("#lumAlbum" + albumId + "_video video")[0].pause();
		}
	}
}