// $Revision: 14445 $ $Date: 2012-06-29 17:15:50 -0300 (Fri, 29 Jun 2012) $
function openServiceInterfaceInstance(url, formName) 
{
	document.forms["LumisPortalForm"].action = url;
	LumisPortal.onSubmitForm(formName, "", "", false, "");
}