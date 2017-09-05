
// $Revision: 4906 $ $Date: 2006-10-30 16:50:31 -0300 (Mon, 30 Oct 2006) $ 
// JavaScript Document

function startList() {
if (document.all&&document.getElementById) {
navRoot = document.getElementById("LumNav");
for (i=0; i<navRoot.childNodes.length; i++) {
node = navRoot.childNodes[i];
if (node.nodeName=="LI") {
node.onmouseover=function() {
this.className+=" over";
  }
  node.onmouseout=function() {
  this.className=this.className.replace(" over", "");
   }
   }
  }
 }
}
//window.onload=startList;