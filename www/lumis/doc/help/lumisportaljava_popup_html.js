/* --- Script � 2005-2010 EC Software --- */
var ua = navigator.userAgent;
var dom = (document.getElementById) ? true : false;
var ie4 = (document.all && !dom) ? true : false;
var ie5_5 = ((ua.indexOf("MSIE 5.5")>=0 || ua.indexOf("MSIE 6")>=0) && ua.indexOf("Opera")<0) ? true : false;
var ns4 = (document.layers && !dom) ? true : false;
var offsxy = 6;
function hmshowPopup(e, txt, stick) {
  var tip = '<table  cellpadding="6" cellspacing="0" style="background-color:#FFFFFF; border:1px solid #000000; border-collapse:collapse;"><tr valign=top><td>'+ txt + '<\/td><\/tr><\/table>';
  var tooltip = atooltip();
  e = e?e:window.event;
  var mx = ns4 ? e.PageX : e.clientX;
  var my = ns4 ? e.PageY : e.clientY;
  var obj   = (window.document.compatMode && window.document.compatMode == "CSS1Compat") ? window.document.documentElement : window.document.body;
  var bodyl = (window.pageXOffset) ? window.pageXOffset : obj.scrollLeft;
  var bodyt = (window.pageYOffset) ? window.pageYOffset : obj.scrollTop;
  var bodyw = (window.innerWidth)  ? window.innerWidth  : obj.offsetWidth;
  if (ns4) {
    tooltip.document.write(tip);
    tooltip.document.close();
    if ((mx + offsxy + bodyl + tooltip.width) > bodyw) { mx = bodyw - offsxy - bodyl - tooltip.width; if (mx < 0) mx = 0; }
    tooltip.left = mx + offsxy + bodyl;
    tooltip.top = my + offsxy + bodyt;
  }
  else {
    tooltip.innerHTML = tip;
    if (tooltip.offsetWidth) if ((mx + offsxy + bodyl + tooltip.offsetWidth) > bodyw) { mx = bodyw - offsxy - bodyl - tooltip.offsetWidth; if (mx < 0) mx = 0; }
    tooltip.style.left = (mx + offsxy + bodyl)+"px";
    tooltip.style.top  = (my + offsxy + bodyt)+"px";
  }
  with(tooltip) { ns4 ? visibility="show" : style.visibility="visible" }
  if (stick) document.onmouseup = hmhidePopup;
}
function hmhidePopup() {
  var tooltip = atooltip();
  ns4 ? tooltip.visibility="hide" : tooltip.style.visibility="hidden";
}
function atooltip(){
 return ns4 ? document.hmpopupDiv : ie4 ? document.all.hmpopupDiv : document.getElementById('hmpopupDiv')
}
popid_1543459="<div style=\"text-align: justify; text-indent: 0px; padding: 0px 0px 0px 0px; margin: 0px 0px 0px 0px;\"><table width=\"450\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"background-image:url(\'Capa_tablebg34881884.bmp\'); background-position: center center; background-repeat: no-repeat; border: none; border-spacing:0px;\">\n\r<tr style=\"text-align:left;vertical-align:top;\">\n\r<td valign=\"top\"><p style=\"text-align: left; margin: 7px 0px 7px 0px;\"><span style=\"font-size: 18pt; font-family: \'Arial\'; color: #808080;\">Documentação do Lumis Portal. <\/span><\/p>\n\r<p style=\"text-align: left; margin: 7px 0px 7px 0px;\"><span style=\"font-size: 11pt; font-family: \'Arial\'; color: #808080;\">Aqui você encontrará informações para construir, administrar e customizar o seu portal. <\/span><\/p>\n\r<\/td>\n\r<\/tr>\n\r<\/table>\n\r<\/div>\n\r<p style=\"text-align: left; margin: 7px 0px 7px 0px;\"><img src=\"bgcapa02.gif\" width=\"566\" height=\"128\" border=\"0\" alt=\"bgCapa02\"><\/p>\n\r"
popid_329345651="<p><img src=\"bg_topheader.gif\" width=\"7\" height=\"55\" border=\"0\" alt=\"bg_topHeader\"><img src=\"bg_topheader01.gif\" width=\"7\" height=\"66\" border=\"0\" alt=\"bg_topHeader01\"><img src=\"bor_leftlogo.gif\" width=\"10\" height=\"50\" border=\"0\" alt=\"bor_leftLogo\"><img src=\"ico_cancel.gif\" width=\"14\" height=\"14\" border=\"0\" alt=\"ico_cancel\"><img src=\"ico_help.gif\" width=\"14\" height=\"14\" border=\"0\" alt=\"ico_Help\"><img src=\"ico_home.gif\" width=\"14\" height=\"14\" border=\"0\" alt=\"ico_home\"><img src=\"img_logo.gif\" width=\"161\" height=\"50\" border=\"0\" alt=\"img_Logo\"><img src=\"top_tithelp.gif\" width=\"97\" height=\"43\" border=\"0\" alt=\"top_titHelp\"><\/p>\n\r"
