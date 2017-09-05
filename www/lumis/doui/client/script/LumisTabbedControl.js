function LumisTabbedControlSelectTab(formName, tabbedControlId, tabId)
{
	function updateTabClasses(tabId, textClassName, tabClassNamePrevSuffix, tabClassNameNewSuffix)
	{
		var pattern = new RegExp(tabClassNamePrevSuffix, "gi");
		var curElement = document.getElementById("left_"+tabId);

		if(tabClassNameNewSuffix != "_off2")
			curElement.className = curElement.className.replace(pattern, tabClassNameNewSuffix);
		
		curElement = curElement.nextSibling;
		
		curElement.className = textClassName;

		curElement = curElement.nextSibling;
		
		curElement.className = curElement.className.replace(pattern, tabClassNameNewSuffix);
	}
	
	function getPreviousSiblingWithId(curElement)
	{
		if(curElement.previousSibling.id)
		{
			return curElement.previousSibling;
		}
		else
		{
			// firefox places a text node as a previous sibling always.
			return curElement.previousSibling.previousSibling;
		}
	}
	
	var currentlySelectedTabId = document.forms[formName].elements[tabbedControlId].value;
	
	if(currentlySelectedTabId == tabId)
		return;
	
	var curTab = document.getElementById(currentlySelectedTabId);

	var newTab = document.getElementById(tabId);

	if(newTab)
	{
		updateTabClasses(currentlySelectedTabId, "", "_on", "_off");
		
		if(getPreviousSiblingWithId(curTab).id.substring(0,7)!="LumTabs" && getPreviousSiblingWithId(curTab).id.length > 0 && getPreviousSiblingWithId(curTab) != newTab)
			updateTabClasses(getPreviousSiblingWithId(curTab).id, "", "_off.*", "_off");
		
		updateTabClasses(tabId, "selected", "_off.*", "_on");
		if(getPreviousSiblingWithId(newTab).id.substring(0,7) !="LumTabs" && getPreviousSiblingWithId(newTab).id.length > 0)
		{
			updateTabClasses(getPreviousSiblingWithId(newTab).id, "", "_off.*", "_off2");
		}
		
		if(curTab)
			curTab.style.display = "none";
		
		if(newTab)
			newTab.style.display = "";
	}
	
	document.forms[formName].elements[tabbedControlId].value = tabId;
}