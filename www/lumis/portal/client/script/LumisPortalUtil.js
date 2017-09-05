// $Revision: 16540 $ $Date: 2014-10-23 16:21:33 -0200 (Thu, 23 Oct 2014) $
var LumisPortalUtil = new LumisPortalUtil();

if( document.implementation.hasFeature("XPath", "3.0") )
{ 
	// prototying the XMLDocument
	XMLDocument.prototype.selectNodes = function(cXPathString, xNode)
	{
		if(!xNode)
		{	
			xNode = this;
		}
		var oNSResolver = this.createNSResolver(this.documentElement);
		var aItems = this.evaluate(cXPathString, xNode, oNSResolver,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var aResult = [];
		
		for( var i = 0; i < aItems.snapshotLength; i++)
		{
			aResult[i] =  aItems.snapshotItem(i);
		}
		return aResult;
	}
	
	// prototying the Element
	Element.prototype.selectNodes = function(cXPathString)
	{
		if(this.ownerDocument.selectNodes)
		{
			return this.ownerDocument.selectNodes(cXPathString, this);
		}
		else
		{
			throw "For XML Elements Only";
		}
	}
	
   // prototying the XMLDocument
   XMLDocument.prototype.selectSingleNode = function(cXPathString, xNode)
   {
      if( !xNode )
      {
      	xNode = this;
      } 
      var xItems = this.selectNodes(cXPathString, xNode);
      if( xItems.length > 0 )
      {
         return xItems[0];
      }
      else
      {
         return null;
      }
   }
   
   // prototying the Element
   Element.prototype.selectSingleNode = function(cXPathString)
   {	
      if(this.ownerDocument.selectSingleNode)
      {
         return this.ownerDocument.selectSingleNode(cXPathString, this);
      }
      else{throw "For XML Elements Only";}
   }
}

function LumisPortalUtil()
{
	this.selectNodes = selectNodes;
	this.selectSingleNode = selectSingleNode;
	this.getXmlHttpObject = getXmlHttpObject;
	this.makeHttpRequest = makeHttpRequest;
	this.replaceString = replaceString;
	this.validateResponse = validateResponse;
	this.getAbsoluteLeft = getAbsoluteLeft;
	this.getAbsoluteTop = getAbsoluteTop;
	this.getElementText = getElementText;
	this.getElementChildrenWithName = getElementChildrenWithName;
	this.hasAttribute = hasAttribute;
	this.disableSelection = disableSelection;
	this.enableSelection = enableSelection;
	this.elementContainsPoint = elementContainsPoint;
	this.xmlEncode = xmlEncode;
	this.xmlDecode = xmlDecode;
	
	//-------------------------------------------------------------------------------

	function selectNodes(cXPathString, xmlDomNode, xmlOwnerDocument)
	{
		if(xmlOwnerDocument == null)
		{
			xmlOwnerDocument = xmlDomNode.ownerDocument;
			
			if(xmlOwnerDocument == null)
				xmlOwnerDocument = xmlDomNode;
		}
		
		if( document.implementation.hasFeature("XPath", "3.0") )
		{
			var xNode = xmlDomNode;
			var oNSResolver = xmlOwnerDocument.createNSResolver(xmlOwnerDocument.documentElement);
			var aItems = xmlOwnerDocument.evaluate(cXPathString, xNode, oNSResolver,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var aResult = [];
			
			for( var i = 0; i < aItems.snapshotLength; i++)
			{
				aResult[i] =  aItems.snapshotItem(i);
			}
			return aResult;
		}
		else
		{
			return xmlDomNode.selectNodes(cXPathString);
		}
	}
	
	//-------------------------------------------------------------------

	function selectSingleNode(cXPathString, xmlDomNode)
	{
		var xNode = xmlDomNode;
		
		var xmlOwnerDocument = xmlDomNode.ownerDocument;
		
		if(xmlOwnerDocument == null)
			xmlOwnerDocument = xmlDomNode;
		
		if( document.implementation.hasFeature("XPath", "3.0") )
		{
			var xItems = selectNodes(cXPathString, xNode, xmlOwnerDocument);
			if (xItems.length > 0)
			{
				return xItems[0];
			}
			else
			{
				return null;
			}
		}
		else
		{
			var xItem = xmlDomNode.selectSingleNode(cXPathString);
			return xItem;
		}
	}
	
	//-------------------------------------------------------------------

	function getAbsoluteTop(elem)
	{
		if (jQuery) 
		{  
			return jQuery(elem).offset()['top'];
		}
		else
		{
			var topPosition = 0;
			
			while (elem)
			{
				if(!isNaN(parseInt(elem.offsetTop)))
					topPosition += parseInt(elem.offsetTop);
	
				if(!isNaN(parseInt(elem.scrollTop)))
					topPosition -= parseInt(elem.scrollTop);
				
				elem = elem.offsetParent;
			}
	
			return topPosition;
		}
	}
	
	//-------------------------------------------------------------------------------------
	// Get real Left value with respect to client area

	function getAbsoluteLeft(elem)
	{
		if (jQuery) 
		{  
			return jQuery(elem).offset()['left'];
		} 
		else 
		{
			var leftPosition = 0;

			while (elem)
			{
				if(!isNaN(parseInt(elem.offsetLeft)))
					leftPosition += parseInt(elem.offsetLeft);

				if(!isNaN(parseInt(elem.scrollLeft)))
					leftPosition -= parseInt(elem.scrollLeft);

				elem = elem.offsetParent;
			}

			return leftPosition;
		}
	}
	
	//-------------------------------------------------------------------------------

	function makeHttpRequest(url, methodString, onReadyStateChangeMethod, bReturnXml, xmlhttp)
	{
		var bAsync = false;
		
		if(onReadyStateChangeMethod != null)
			bAsync = true;
		
		var strRequest = "<request>";
		strRequest += methodString;
		strRequest += "</request>";
		
		if(xmlhttp == null)
			xmlhttp = getXmlHttpObject();
			
		xmlhttp.open("POST", url, bAsync);
		
		// fix for IE11 to provide select* functions
		if (bReturnXml)
			try { xmlhttp.responseType = 'msxml-document'; } catch(e){}

		if(bAsync)
			xmlhttp.onreadystatechange = onReadyStateChangeMethod;

		xmlhttp.send(strRequest);

		if(!bAsync)
		{
			if(bReturnXml)
				return xmlhttp.responseXML;
			else
				return xmlhttp.responseText;
		}
	}
	
	//-------------------------------------------------------------------------------

	function replaceString(sourceString, searchString, replaceString, replaceType)
	{
		if(replaceType == null)
			replaceType = "gi";
		var regExp = new RegExp(searchString, replaceType);
		return sourceString.replace(regExp, replaceString);
	}

	//-------------------------------------------------------------------------------
	
	function validateResponse(pResponseXML)
	{
		if(pResponseXML)
		{
			var pNode = pResponseXML.getElementsByTagName("PortalException");
			if(pNode.length > 0)
			{
				var pMessage = pResponseXML.getElementsByTagName("message");
				if(pMessage.length > 0 && pMessage.item(0).firstChild != null)
					throwException(pMessage.item(0).firstChild.data);
				else
					throwException("Unexpected exception.");
			}
		}
		else
		{
			throwException("Unexpected exception.");
		}

		function throwException(strMessage)
		{
			var pError = new Object();
			pError.description = strMessage;
			throw(pError);
		}
	}
	
	function getXmlHttpObject()
	{
		var httpObj = null;
		
		if (window.ActiveXObject)
			httpObj=new ActiveXObject("Microsoft.XMLHTTP");
		else
			httpObj=new XMLHttpRequest();
			
		return httpObj;
	}

	function getElementText(element)
	{
		if(element.textContent)
			return element.textContent;
		else
			return element.text;
	}
	
	function getElementChildrenWithName(element, name)
	{
		var arrChildren = new Array();
		var possibleElements = document.getElementsByName(name);
		
		for(var i=0; i<possibleElements.length; i++)
		{
			var possibleElement = possibleElements[i];
			var curElement = possibleElement;
			while(curElement.parentNode)
			{
				if(curElement.parentNode == element)
				{
					arrChildren[arrChildren.length] = possibleElement;
					break;
				}
				
				curElement = curElement.parentNode;
			}
		}
		
		if(arrChildren.length == 0)
			return null;
		else
			return arrChildren;
	}
	
	function hasAttribute(element, name)
	{
		if(element.hasAttribute)
			return element.hasAttribute(name);
		else
			return element[name]!=undefined;
	}
	
	function disableSelection(target)
	{
		if (typeof target.onselectstart!="undefined") //IE route
			target.onselectstart=function(){return false;}
		else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
			target.style.MozUserSelect="none";
		else //All other route (ie: Opera)
			target.onmousedown=function(){return false;}
		target.style.cursor = "default";
	}
	
	function enableSelection(target)
	{
		if (typeof target.onselectstart!="undefined") //IE route
			target.onselectstart=null;
		else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
			target.style.MozUserSelect="";
		else //All other route (ie: Opera)
			target.onmousedown=null;
		target.style.cursor = "";
	}
	
	function elementContainsPoint(target, x, y)
	{
		var targPos    = {x:LumisPortalUtil.getAbsoluteLeft(target),y:LumisPortalUtil.getAbsoluteTop(target)};
		var targWidth  = parseInt(target.offsetWidth);
		var targHeight = parseInt(target.offsetHeight);

		if(	(x > targPos.x+target.scrollLeft)           &&
			(x < targPos.x+target.scrollLeft+targWidth) &&
			(y > targPos.y+target.scrollTop)            &&
			(y < targPos.y+target.scrollTop+targHeight))
			return true;
		else
			return false;
	}
	
	function xmlEncode(string)
	{
		return LumisPortal.xmlEncode(string);
	}

	function xmlDecode(string)
	{
		return LumisPortal.xmlDecode(string);
	}
}
