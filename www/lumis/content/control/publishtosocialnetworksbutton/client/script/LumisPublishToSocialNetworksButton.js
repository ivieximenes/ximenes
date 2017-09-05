// $Revision: 13677 $ $Date: 2011-10-03 17:23:05 -0300 (Mon, 03 Oct 2011) $
var LumisPublishToSocialNetworksButton = new LumisPublishToSocialNetworksButton();

function LumisPublishToSocialNetworksButton()
{
	this.postParametrsToUrl = postParametrsToUrl;
	
	function postParametrsToUrl(url, targetWindowName, postParameters)
	{
		var dataForm = document.createElement("form");
		dataForm.method="post";
		dataForm.target=targetWindowName;
		dataForm.action = url;
		for(k in postParameters) 
		{
			var myInput = document.createElement("input");
			myInput.setAttribute("name", k);
			myInput.setAttribute("value", postParameters[k]);
			dataForm.appendChild(myInput);
		}
		document.body.appendChild(dataForm);
		dataForm.submit();
		document.body.removeChild(dataForm);
	}
}
