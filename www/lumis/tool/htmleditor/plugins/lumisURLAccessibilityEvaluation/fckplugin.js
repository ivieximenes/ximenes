// $Revision: 14619 $ $Date: 2012-08-15 14:09:50 -0300 (Wed, 15 Aug 2012) $
// create the command
var LumisURLAccessibilityEvaluation=function(){};
var request = false;
var pop;
var response;

LumisURLAccessibilityEvaluation.prototype.Execute=function(){};
LumisURLAccessibilityEvaluation.GetState=function() { return FCK_TRISTATE_OFF };
LumisURLAccessibilityEvaluation.Execute=function() 
{
	FCK.Focus();

	try {
		request = new XMLHttpRequest();
	} catch (trymicrosoft) {
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (othermicrosoft) {
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				request = false;
			}  
		}
	}

	if (!request)
	{
		alert("Error initializing XMLHttpRequest!");
	}
    var url = "../../../../service/htmlevaluation/UrlAccessibilityEvaluation.jsp?contentHtml="+FCK.GetHTML();
    request.open("GET", url, true);
    request.onreadystatechange = updatePage;
    request.send(null);
}

function updatePage() {
	if (request.readyState == 4) {
		if (request.status == 200) {
			var conteudo = "";
			response = "";
			response = request.responseText;
			pop = window.open('../../../../../main.jsp?lumPageId=' + window.parent.g_LumisPageId + '&lumChannelId=' + window.parent.g_LumisChannelId + '&lumRTI=lumis.service.htmlevaluation.validationResults', "_blank", "width=650,height=400,top=40,resizable=yes,scrolling=yes,location=no,toolbar=no");
 			setTimeout("setValue();",100);
		} else
			alert("status is " + request.status);
	}
}

function setValue(){
	if (pop.document.getElementById("result")!=null)
	{
		pop.document.getElementById("result").value = response;
	}
	else
	{
		setTimeout("setValue();",100);
	}	
}

LumisURLAccessibilityEvaluation.GetHTML=function() 
{
	return FCK.GetXHTML();
}

// register the command.
FCKCommands.RegisterCommand('LumisURLAccessibilityEvaluation', LumisURLAccessibilityEvaluation);

// create the toolbar buttons.
var oLumisURLAccessibilityEvaluationItem = new FCKToolbarButton( 'LumisURLAccessibilityEvaluation', FCKLang.LumisURLAccessibilityEvaluationBtn ) ;
oLumisURLAccessibilityEvaluationItem.IconPath = FCKPlugins.Items['lumisURLAccessibilityEvaluation'].Path + 'image.gif' ;
FCKToolbarItems.RegisterItem( 'LumisURLAccessibilityEvaluation', oLumisURLAccessibilityEvaluationItem ) ;
