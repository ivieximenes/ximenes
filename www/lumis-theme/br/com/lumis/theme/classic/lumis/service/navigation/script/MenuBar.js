//----------------------------------------------------------------------------
// Code to determine the browser and version.
//----------------------------------------------------------------------------

function LumisMenu_Browser() 
{
	var ua, s, i;
	
	this.isIE    = false;  // Internet Explorer
	this.isOP    = false;  // Opera
	this.isNS    = false;  // Netscape
	this.version = null;
	
	ua = navigator.userAgent;
	
	s = "Opera";
	if ((i = ua.indexOf(s)) >= 0)
	{
		this.isOP = true;
		this.version = parseFloat(ua.substr(i + s.length));
		return;
	}
	
	s = "Netscape6/";
	if ((i = ua.indexOf(s)) >= 0)
	{
		this.isNS = true;
		this.version = parseFloat(ua.substr(i + s.length));
		return;
	}
	
	// Treat any other "Gecko" browser as Netscape 6.1.
	
	s = "Gecko";
	if ((i = ua.indexOf(s)) >= 0)
	{
		this.isNS = true;
		this.version = 6.1;
		return;
	}
	
	s = "MSIE";
	if ((i = ua.indexOf(s)))
	{
		this.isIE = true;
		this.version = parseFloat(ua.substr(i + s.length));
		return;
	}
}

var LumisMenu_browser = new LumisMenu_Browser();

//----------------------------------------------------------------------------
// Code for handling the menu bar
//----------------------------------------------------------------------------

var LumisMenu_activeButton = null;

function LumisMenu_ExpandMenu(strDivID)
{
	var strCurStyle = document.getElementById(strDivID).style.display;
	
	if(strCurStyle == "none")
		document.getElementById(strDivID).style.display="";
	else
		document.getElementById(strDivID).style.display="none";
}

function LumisMenu_buttonClick(event, menuId, isVerticalMenu)
{
	var button;

	LumisMenu_ShowPopups();
	
	// Get the target button element.
	
	if (LumisMenu_browser.isIE)
		button = window.event.srcElement;
	else
		button = event.currentTarget;
	
	// Blur focus from the link to remove that annoying outline.
	
	button.blur();
	
	// Associate the named menu to this button if not already done.
	// Additionally, initialize menu display.
	
	if (button.menu == null)
	{
		button.menu = document.getElementById(menuId);
		if (button.menu.isInitialized == null)
		LumisMenu_menuInit(button.menu);
	}
	
	// Set mouseout event handler for the button, if not already done.
	
	if (button.onmouseout == null)
		button.onmouseout = LumisMenu_buttonOrMenuMouseout;
	
	// Exit if this button is the currently active one.
	
	if (button == LumisMenu_activeButton)
		return false;
	
	// Reset the currently active button, if any.
	
	if (LumisMenu_activeButton != null)
		LumisMenu_resetButton(LumisMenu_activeButton);
	
	// Activate this button, unless it was the currently active one.
	
	if (button != LumisMenu_activeButton)
	{
		LumisMenu_depressButton(button, isVerticalMenu);
		LumisMenu_activeButton = button;
	}
	else
		LumisMenu_activeButton = null;
	
	return false;
}

function LumisMenu_buttonMouseover(event, menuId, isVerticalMenu)
{
	var button;
	
	// Activates this button's menu if no other is currently active.
	
	if (LumisMenu_activeButton == null)
	{
		LumisMenu_buttonClick(event, menuId, isVerticalMenu);
		return;
	}
	
	// Find the target button element.
	
	if (LumisMenu_browser.isIE)
		button = window.event.srcElement;
	else
		button = event.currentTarget;
	
	// If any other button menu is active, make this one active instead.
	
	if (LumisMenu_activeButton != null && LumisMenu_activeButton != button)
		LumisMenu_buttonClick(event, menuId, isVerticalMenu);
}

function LumisMenu_depressButton(button, isVerticalMenu)
{
	var x, y;
	
	// Update the button's style class to make it look like it's
	// depressed.
	
	button.className += " menuButtonActive";
	
	// Set mouseout event handler for the button, if not already done.
	
	if (button.onmouseout == null)
		button.onmouseout = LumisMenu_buttonOrMenuMouseout;
	if (button.menu.onmouseout == null)
		button.menu.onmouseout = LumisMenu_buttonOrMenuMouseout;
	
	// Position the associated drop down menu under the button and
	// show it.
	
	if(isVerticalMenu)
	{
		if (LumisMenu_browser.isNS)
		{
			x = LumisMenu_getPageOffsetLeft(button) + button.offsetWidth - 19;
			y = LumisMenu_getPageOffsetTop(button);
		}
		else
		{
			x = LumisMenu_getPageOffsetLeft(button) + button.offsetWidth;
			y = LumisMenu_getPageOffsetTop(button)-2;
		}
	}
	else
	{
		x = LumisMenu_getPageOffsetLeft(button);
		y = LumisMenu_getPageOffsetTop(button) + button.offsetHeight-1;
	}
	
	// For IE, adjust position.
	
	if (LumisMenu_browser.isIE)
	{
		x += button.offsetParent.clientLeft;
		y += button.offsetParent.clientTop;
	}
	
	button.menu.style.left = x + "px";
	button.menu.style.top  = y + "px";
	button.menu.style.visibility = "visible";
}

function LumisMenu_resetButton(button)
{
	// Restore the button's style class.
	
	LumisMenu_removeClassName(button, "menuButtonActive");
	
	// Hide the button's menu, first closing any sub menus.
	
	if (button.menu != null)
	{
		LumisMenu_closeSubMenu(button.menu);
		button.menu.style.visibility = "hidden";
	}
}

//----------------------------------------------------------------------------
// Code to handle the menus and sub menus.
//----------------------------------------------------------------------------

function LumisMenu_menuMouseover(event)
{
	var menu;
	
	// Find the target menu element.
	
	if (LumisMenu_browser.isIE)
	{
		menu = LumisMenu_getContainerWith(window.event.srcElement, "DIV", "menu");
		if(!menu)
			menu = LumisMenu_getContainerWith(window.event.srcElement, "DIV", "menuVert");
	}
	else
		menu = event.currentTarget;
	
	// Close any active sub menu.
	
	if (menu.activeItem != null)
		LumisMenu_closeSubMenu(menu);
}

function LumisMenu_menuItemMouseover(event, menuId) 
{
	var item, menu, x, y;
	
	// Find the target item element and its parent menu element.
	
	if (LumisMenu_browser.isIE)
		item = LumisMenu_getContainerWith(window.event.srcElement, "A", "menuItem");
	else
		item = event.currentTarget;
		
	menu = LumisMenu_getContainerWith(item, "DIV", "menu");
	if(!menu)
		menu = LumisMenu_getContainerWith(item, "DIV", "menuVert");
	
	// Close any active sub menu and mark this one as active.
	
	if (menu.activeItem != null)
	LumisMenu_closeSubMenu(menu);
	menu.activeItem = item;
	
	// Highlight the item element.
	
	item.className += " menuItemHighlight";
	
	// Initialize the sub menu, if not already done.
	
	if (item.subMenu == null)
	{
		item.subMenu = document.getElementById(menuId);
		if (item.subMenu.isInitialized == null)
		LumisMenu_menuInit(item.subMenu);
	}

	// Set mouseout event handler for the sub menu, if not already done.
	
	if (item.subMenu.onmouseout == null)
		item.subMenu.onmouseout = LumisMenu_buttonOrMenuMouseout;
	
	// Get position for submenu based on the menu item.
	
	x = LumisMenu_getPageOffsetLeft(item) + item.offsetWidth;
	y = LumisMenu_getPageOffsetTop(item);
	
	// Adjust position to fit in view.
	
	var maxX, maxY;
	
	if (LumisMenu_browser.isIE)
	{
		maxX = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) +
			(document.documentElement.clientWidth != 0 ? document.documentElement.clientWidth : document.body.clientWidth);
		maxY = Math.max(document.documentElement.scrollTop, document.body.scrollTop) +
			(document.documentElement.clientHeight != 0 ? document.documentElement.clientHeight : document.body.clientHeight);
	}
	
	if (LumisMenu_browser.isOP)
	{
		maxX = document.documentElement.scrollLeft + window.innerWidth;
		maxY = document.documentElement.scrollTop  + window.innerHeight;
	}
	
	if (LumisMenu_browser.isNS)
	{
		maxX = window.scrollX + window.innerWidth;
		maxY = window.scrollY + window.innerHeight;
	}
	
	maxX -= item.subMenu.offsetWidth;
	maxY -= item.subMenu.offsetHeight;
	
	if (x > maxX)
		x = Math.max(0, x - item.offsetWidth - item.subMenu.offsetWidth + (menu.offsetWidth - item.offsetWidth));

	y = Math.max(0, Math.min(y, maxY));
	
	// Position and show the sub menu.
	
	item.subMenu.style.left = x + "px";
	item.subMenu.style.top  = y + "px";
	item.subMenu.style.visibility = "visible";
	
	// Stop the event from bubbling.
	
	if (LumisMenu_browser.isIE)
		window.event.cancelBubble = true;
	else
		event.stopPropagation();
}

function LumisMenu_closeSubMenu(menu)
{
	if (menu == null || menu.activeItem == null)
		return;
	
	// Recursively close any sub menus.
	
	if (menu.activeItem.subMenu != null)
	{
		LumisMenu_closeSubMenu(menu.activeItem.subMenu);
		menu.activeItem.subMenu.style.visibility = "hidden";
		menu.activeItem.subMenu = null;
	}

	LumisMenu_removeClassName(menu.activeItem, "menuItemHighlight");
	menu.activeItem = null;
}

// event on buttons and menus.

function LumisMenu_buttonOrMenuMouseout(event)
{
	var el;
	
	// If there is no active button, exit.
	
	if (LumisMenu_activeButton == null)
		return;
	
	// Find the element the mouse is moving to.
	
	if (LumisMenu_browser.isIE)
		el = window.event.toElement;
	else if (event.relatedTarget != null)
		el = (event.relatedTarget.tagName ? event.relatedTarget : event.relatedTarget.parentNode);
	
	// If the element is not part of a menu, reset the active button.
	
	if (LumisMenu_getContainerWith(el, "DIV", "menu") == null && LumisMenu_getContainerWith(el, "DIV", "menuVert") == null)
	{
		LumisMenu_resetButton(LumisMenu_activeButton);
		LumisMenu_activeButton = null;
		
		LumisMenu_HidePopups();
	}
}

//----------------------------------------------------------------------------
// Code to initialize menus.
//----------------------------------------------------------------------------

function LumisMenu_menuInit(menu) 
{
	var itemList, spanList;
	var textEl, arrowEl;
	var itemWidth;
	var w, dw;
	var i, j;
	
	// Insert arrow characters by browser.
	
	menu.style.lineHeight = "2.5ex";
	spanList = menu.getElementsByTagName("SPAN");
	for (i = 0; i < spanList.length; i++)
	{
		if (LumisMenu_hasClassName(spanList[i], "menuItemArrow")) 
		{
			if (LumisMenu_browser.isIE)
			{
				spanList[i].style.fontFamily = "Webdings";
				spanList[i].firstChild.nodeValue = "4";
			}
			else
			{
				spanList[i].innerHTML = "<span style='font-size:9px;'>&#9654;</span>";
			}
		}
	}
	
	// Find the width of a menu item.
	
	itemList = menu.getElementsByTagName("A");
	if (itemList.length > 0)
		itemWidth = itemList[0].offsetWidth;
	else
		return;

	// Fix IE hover problem by setting an explicit width on first item of
	// the menu.
	
	if (LumisMenu_browser.isIE)
	{
		w = itemList[0].offsetWidth;
		itemList[0].style.width = w + "px";
		dw = itemList[0].offsetWidth - w;
		w -= dw;
		itemList[0].style.width = w + "px";
	}
	
	// Mark menu as initialized.
	
	menu.isInitialized = true;
}

//----------------------------------------------------------------------------
// General utility functions.
//----------------------------------------------------------------------------

function LumisMenu_getContainerWith(node, tagName, className)
{
	// Starting with the given node, find the nearest containing element
	// with the specified tag name and style class.
	
	while (node != null) 
	{
		if (node.tagName != null && node.tagName == tagName && LumisMenu_hasClassName(node, className))
			return node;
		node = node.parentNode;
	}
	
	return node;
}

function LumisMenu_hasClassName(el, name)
{
	var i, list;
	
	// Return true if the given element currently has the given class
	// name.
	
	list = el.className.split(" ");
	for (i = 0; i < list.length; i++)
	{
		if (list[i] == name)
			return true;
	}
	
	return false;
}

function LumisMenu_removeClassName(el, name)
{
	var i, curList, newList;

	if (el.className == null)
		return;

	// Remove the given class name from the element's className property.
	
	newList = new Array();
	curList = el.className.split(" ");
	for (i = 0; i < curList.length; i++)
	{
		if (curList[i] != name)
			newList.push(curList[i]);
	}
	el.className = newList.join(" ");
}

function LumisMenu_getPageOffsetLeft(el)
{
	var x;
	
	// Return the x coordinate of an element relative to the page.
	
	x = el.offsetLeft;
	if (el.offsetParent != null)
		x += LumisMenu_getPageOffsetLeft(el.offsetParent);
	
	return x;
}

function LumisMenu_getPageOffsetTop(el)
{
	var y;
	
	// Return the x coordinate of an element relative to the page.
	
	y = el.offsetTop;
	if (el.offsetParent != null)
		y += LumisMenu_getPageOffsetTop(el.offsetParent);
	
	return y;
}

function LumisMenu_HidePopups()
{
	var arrForms = document.forms;
	for(var i=0; i<arrForms.length; i++)
	{
		var arrElements = arrForms[i].elements;
		for(var j=0; j<arrElements.length; j++)
		{
			if(arrElements[j].tagName.toUpperCase() == "SELECT")
				arrElements[j].style.visibility="";
		}
	}
}

function LumisMenu_ShowPopups(xPos, yPos)
{
	var arrForms = document.forms;
	for(var i=0; i<arrForms.length; i++)
	{
		var arrElements = arrForms[i].elements;
		for(var j=0; j<arrElements.length; j++)
		{
			if(arrElements[j].tagName.toUpperCase() == "SELECT")
				arrElements[j].style.visibility="hidden";
		}
	}
}

