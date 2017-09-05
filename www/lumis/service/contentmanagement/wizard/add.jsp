<%-- $Revision: 15325 $ $Date: 2013-05-14 15:36:25 -0300 (Tue, 14 May 2013) $ --%>
<%@ taglib uri="/WEB-INF/lumis/tld/lum.tld" prefix="lum" %>
<lum:addResource path="lumis/service/content/wizard/strings/strings"/>
<form name="FormProperties" id="FormProperties" action="lumis/service/contentmanagement/wizard/create.jsp" method="post" target="_blank">
  
  <div id="LumisProgressDiv" style="display:none;padding:30px;color:#777777;text-align:center;border:1px solid #777777;width:180;height:100;position:absolute;background-color:#FFFFFF">
    <div><img src="lumis/service/contentmanagement/wizard/images/progress.gif"/></div>
    <div class="cEZTLabelText" style="padding-top:15px"><lum:message key="STR_PLEASE_WAIT"/></div>
  </div>

  <div class="cLumPropertyPage" style="90%">
  
	<div id="LumInterfaceHeader_top">
		<div class="cLumBrdLeft"><img src="lumis/portal/client/images/Pix.gif" alt=" " title=""/></div>
		<div class="cLumBrdRight"><img src="lumis/portal/client/images/Pix.gif" alt=" " title=""/></div>
	</div>
	<div id="LumInterfaceHeader">
		<div class="tit"><lum:message key="STR_ADD"/></div>
		<br style="clear: both" />
	</div>

			<div style="padding:10px;" class="cLumTabBox">
                <!-- *********************************** SCREEN 1 ******************************** -->
                
				<div id="_EZTScreen1" EZTOnScreenFocus="onServicePropertiesScreenFocus()" EZTOnScreenLoseFocus="onServicePropertiesLoseScreenFocus()">
                  <div style="height:350px;">
                    <div class="cLumControlGroupHeader"><lum:message key="STR_SELECT_GENERAL_PROP"/>:</div>
                    <div class="cLumControlGroup" style="border:1px solid #eeeee7;">
                    <table width="100%" align="center" cellspacing="0" cellpadding="0" border="0" style="padding:3px;">
                      <tr>
                        <td nowrap="1" ><lum:message key="STR_NAME"/>: <img src="lumis/portal/client/images/FieldRequired.gif" align="top"/></td>
                        <td width="100%"><input name="_Properties_Name" class="cLumInputText" style="width:100%" onBlur="onNameBlur();"/></td>
                      </tr>
                      <tr>
                        <td nowrap="1" ><lum:message key="STR_DESCRIPTION"/>:<img src="lumis/portal/client/images/FieldRequired.gif" align="top"/></td>
                        <td width="100%"><input name="_Properties_Description" class="cLumInputText" style="width:100%"/></td>
                      </tr>
                      <tr>
                        <td nowrap="1"><lum:message key="STR_INSTALATION_FOLDER"/>:<img src="lumis/portal/client/images/FieldRequired.gif" align="top"/></td>
                        <td width="100%"><input name="_Properties_InstallURL" class="cLumInputText" style="width:100%"/></td>
                      </tr>
                    </table>
                    </div>
                  </div>

				  <div id="LumButton1" style="_height:1%" class="cInterfaceButtons">
					<ul style="float:right;">
						<!--
						<li>
							<span class="brdleft"></span>
							<a href="javascript:onBackClick();">
								<img align="absmiddle" src="lumis/portal/client/images/Back.gif" border="0" alt="<lum:message key="STR_BACK"/>"/><lum:message key="STR_BACK"/>
							</a>
							<span class="brdright"></span>
							<div class="spacer"></div>
						</li>
						-->
						<li>
							<span class="brdleft"></span>
							<a href="javascript:onNextClick();">
								<img align="absmiddle" src="lumis/portal/client/images/Go.gif" border="0" alt="<lum:message key="STR_NEXT"/>"/><lum:message key="STR_NEXT"/>
							</a>
							<span class="brdright"></span>
							<div class="spacer"></div>
						</li>
						
						<li>
						<span class="brdleft"></span>
						<a href="javascript:LumisPortal.opener.LumisPortal.onRefresh();if(window.self != window.top && window.parent.$ && window.parent.LumisLightBox){LumisLightBox.close();}else{window.close();}">
							<img align="absmiddle" src="lumis/portal/client/images/Cancel.gif" border="0" alt="<lum:message key="STR_CANCEL"/>"/><lum:message key="STR_CANCEL"/>
						</a><span class="brdright"></span>
						</li>
					</ul>
				<br style="clear: both" />
				</div>

                </div>

                <!-- *********************************** SCREEN 2 ******************************** -->
                <div id="_EZTScreen2" style="display:none;" EZTOnScreenFocus="onPublishPropertiesScreenFocus()" EZTOnScreenLoseFocus="onPublishPropertiesScreenLoseFocus()">
                  <div style="height:350px;">
                    <div class="cLumControlGroupHeader"><lum:message key="STR_PUBLISH_PROPERTY"/>:</div>
                    <div class="cLumControlGroup" style="border:1px solid #eeeee7;">
                    <table width="100%" align="center" cellspacing="0" cellpadding="0" border="0" style="padding:2px;">
                      <tr>
                        <td width="15"><INPUT TYPE="checkbox" NAME="_Properties_SupportWorkflow" value="true" /></td>
                        <td class="cEZTLabelText"><lum:message key="STR_WORFLOW_INSERT"/></td>
                        <td width="15">&nbsp;</td>
                        <td class="cEZTLabelText">&nbsp;</td>
                      </tr>
                      <tr>
                        <td width="15"><INPUT TYPE="checkbox" NAME="_Properties_Comments" value="true" /></td>
                        <td class="cEZTLabelText"><lum:message key="STR_COMMENTS_INSERT"/></td>
                        <td width="15">&nbsp;</td>
                        <td class="cEZTLabelText">&nbsp;</td>
                      </tr>
                      <tr>
                        <td width="15"><INPUT TYPE="checkbox" NAME="_Properties_StartDate" value="true" /></td>
                        <td><lum:message key="STR_PUBLISH_DATE_INSERT"/></td>
                        <td width="15">&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td width="15"><INPUT TYPE="checkbox" NAME="_Properties_EndDate" value="true" /></td>
                        <td><lum:message key="STR_EXPIRE_DATE_INSERT"/></td>
                        <td width="15">&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td width="15"><INPUT TYPE="checkbox" NAME="_Properties_Highlight"  value="true"onClick="onPropertyHighlightClick()" /></td>
                        <td><lum:message key="STR_DETACHED_INSERT"/></td>
                        <td width="15">&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td width="15"><INPUT TYPE="checkbox" NAME="_Properties_EndHighlightDate"  value="true" onClick="onPropertyEndHighlightDateClick()" /></td>
                        <td><lum:message key="STR_EXPIRE_DETACHED_INSERT"/></td>
                        <td width="15">&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td width="15"><INPUT TYPE="checkbox" NAME="_Properties_PublishToServiceInst" value="true" /></td>
                        <td><lum:message key="STR_MULTIPLE_PUBLISH"/></td>
                        <td width="15">&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td width="15"><INPUT TYPE="checkbox" NAME="_Properties_PublishToUserAndGroup" value="true" /></td>
                        <td><lum:message key="STR_PUBLISH_USERS_GROUPS"/></td>
                        <td width="15">&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td width="15"><INPUT TYPE="checkbox" NAME="_Properties_SupportVersioning" value="true" /></td>
                        <td><lum:message key="STR_CONTENT_VERSION"/></td>
                        <td width="15">&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td width="15"><INPUT TYPE="checkbox" NAME="_Properties_SupportAssociation" value="true" /></td>
                        <td><lum:message key="STR_ASSOCIATION_CONTENT"/></td>
                        <td width="15">&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td width="15" height="25" valign="top"><INPUT TYPE="checkbox" NAME="_Properties_SupportMultilanguage" value="true" /></td>
                        <td valign="middle"><lum:message key="STR_CONTENT_MULTIDIOMAS"/></td>
                        <td width="15" valign="top">&nbsp;</td>
                        <td valign="top">&nbsp;</td>
                      </tr>
                    </table>
                    </div>
                  </div>

				  <div id="LumButton1" style="_height:1%" class="cInterfaceButtons">
					<ul style="float:right;">
						<li>
							<span class="brdleft"></span>
							<a href="javascript:onBackClick();">
								<img align="absmiddle" src="lumis/portal/client/images/Back.gif" border="0" alt="<lum:message key="STR_BACK"/>"/><lum:message key="STR_BACK"/>
							</a>
							<span class="brdright"></span>
							<div class="spacer"></div>
						</li>
						
						<li>
							<span class="brdleft"></span>
							<a href="javascript:onNextClick();">
								<img align="absmiddle" src="lumis/portal/client/images/Go.gif" border="0" alt="<lum:message key="STR_NEXT"/>"/><lum:message key="STR_NEXT"/>
							</a>
							<span class="brdright"></span>
							<div class="spacer"></div>
						</li>
						
						<li>
						<span class="brdleft"></span>
						<a href="javascript:LumisPortal.opener.LumisPortal.onRefresh();if(window.self != window.top && window.parent.$ && window.parent.LumisLightBox){LumisLightBox.close();}else{window.close();}">
							<img align="absmiddle" src="lumis/portal/client/images/Cancel.gif" border="0" alt="<lum:message key="STR_CANCEL"/>"/><lum:message key="STR_CANCEL"/>
						</a><span class="brdright"></span>
						</li>
					</ul>
				<br style="clear: both" />
				</div>
				
				
                </div>
                <!-- *********************************** SCREEN 3 ******************************** -->
                <div id="_EZTScreen3" style="display:none;" EZTOnScreenFocus="onTableInfoScreenFocus()" EZTOnScreenLoseFocus="onTableInfoScreenLoseFocus()">
                  <div style="height:350px; overflow: auto;">
                    <div class="cLumControlGroupHeader"><lum:message key="STR_MANIPULATION_DATAS"/></div>
                     <div class="cLumControlGroup" style="border:1px solid #eeeee7;">
                    <table width="100%" align="center" cellspacing="0" cellpadding="0" border="0" style="padding:3px;">
	                    <tr>
    	                    <td nowrap="1" ><lum:message key="STR_TABLE_NAME"/>:</td>
        	                <td width="100%"><input name="_Properties_TableName" class="cLumInputText" style="width:100%"/></td>
						</tr>
						<tr>
							<td nowrap="1"><lum:message key="STR_CREATE_TABLE"/>:</td>
							<td width="100%"><input type="checkbox" name="_Properties_CreateTable" value="true" checked onclick="toggleCreateTable();"/></td>
						</tr>	
						<tr id="createForeignKeysTr">
							<td nowrap="1"><lum:message key="STR_CREATE_FOREIGN_KEYS"/>:</td>
							<td width="100%"><input type="checkbox" name="_Properties_CreateFKs" value="true" onclick="toggleCreateFKs();"/></td>
						</tr>			
						<tr id="foreignKeysTr" style="display: none;">
							<td colspan="2">
								<div id="foreignKeysTd" style="padding-left: 20px; height: 100px; overflow: auto;"></div>
							</td>
						</tr>			
                    </table>
                    </div>
                    <BR>
                     <table width="100%" align="center" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="right" id="LumButton2" style="border:1px solid #eeeee7;">
							<ul>
								<li>
								<span class="brdleft"></span>
								<a href="javascript:AddBlankField();"><img align="absmiddle" src="lumis/portal/client/images/Add.gif" border="0" alt="<lum:message key="STR_ADD"/>"/><lum:message key="STR_ADD"/></a>
								<span class="brdright"></span>
								</li>
								
								<li>
								<span class="brdleft"></span>
								<a href="javascript:RemoveFields();"><img align="absmiddle" src="lumis/portal/client/images/Delete.gif" border="0" alt="<lum:message key="STR_REMOVE"/>"/><lum:message key="STR_REMOVE"/></a>
								<span class="brdright"></span>
								</li>
								
								<li>
								<span class="brdleft"></span>
								<a href="javascript:OpenAdvancedProperties();"><img align="absmiddle" src="lumis/portal/client/images/Advanced.gif" border="0" alt="<lum:message key="STR_ADVANCED"/>"/><lum:message key="STR_ADVANCED"/></a>
								<span class="brdright"></span>
								</li>
							</ul>
						</td>
                    </table> 
					
                    <table width="100%" align="center" class="cLumTabBox" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #eeeee7;">
						<tr>
							<td class="cLumControlGroup" style="padding:0px;border:1px solid #eeeee7;">
							<table width="100%" border="0" cellspacing="0" cellpadding="0">
		                      <tr>
		                        <td width="50px" >&nbsp;</td>
		                        <td width="165px" class="cLumControlGroupHeader"><lum:message key="STR_NAME"/></td>
		                        <td width="140px" class="cLumControlGroupHeader"><lum:message key="STR_TYPE"/></td>
		                        <td width="30px" align="center"><img border="0" src="lumis/service/contentmanagement/wizard/images/pk.gif" alt="<lum:message key="STR_PRIMARY_KEY"/>"></td>
		                        <td width="30px" align="center"><img border="0" src="lumis/service/contentmanagement/wizard/images/pn.gif" alt="<lum:message key="STR_PRIMARY_NAME"/>"></td>
		                        <td width="30px" align="center"><img border="0" src="lumis/service/contentmanagement/wizard/images/in.gif" alt="<lum:message key="STR_INTRODUCTION"/>"></td>
		                        <td width="30px" align="center"><img border="0" src="lumis/service/contentmanagement/wizard/images/searchable.gif" alt="<lum:message key="STR_SEARCHABLE"/>"></td>
		                        <td>&nbsp;</td>
		                      </tr>
		                    </table>
							</td>
						</tr>
                      <tr>
                        <td class="cEZTLabelText" nowrap="1"><div style="height:130;overflow:auto;">
                            <table ID="_Data_Fields" cellpadding="0" cellspacing="0" border="0" width="100%">
                            </table>
                          </div></td>
                    </table>
                  </div>

				  
				  <div id="LumButton1" style="_height:1%" class="cInterfaceButtons">
					<ul style="float:right;">
						<li>
							<span class="brdleft"></span>
							<a href="javascript:onBackClick();">
								<img align="absmiddle" src="lumis/portal/client/images/Back.gif" border="0" alt="<lum:message key="STR_BACK"/>"/><lum:message key="STR_BACK"/>
							</a>
							<span class="brdright"></span>
							<div class="spacer"></div>
						</li>
						
						<li>
							<span class="brdleft"></span>
							<a href="javascript:onNextClick();">
								<img align="absmiddle" src="lumis/portal/client/images/Go.gif" border="0" alt="<lum:message key="STR_NEXT"/>"/><lum:message key="STR_NEXT"/>
							</a>
							<span class="brdright"></span>
							<div class="spacer"></div>
						</li>
						
						<li>
						<span class="brdleft"></span>
						<a href="javascript:LumisPortal.opener.LumisPortal.onRefresh();if(window.self != window.top && window.parent.$ && window.parent.LumisLightBox){LumisLightBox.close();}else{window.close();}">
							<img align="absmiddle" src="lumis/portal/client/images/Cancel.gif" border="0" alt="<lum:message key="STR_CANCEL"/>"/><lum:message key="STR_CANCEL"/>
						</a><span class="brdright"></span>
						</li>
					</ul>
				<br style="clear: both" />
				</div>
				
                </div>
                <!-- *********************************** Final ******************************** -->
                <div id="_EZTScreenN" style="display:none;" EZTOnScreenFocus="onFinishScreenFocus()">
                  <div style="height:350;">
                    <div class="cLumControlGroupHeader"><lum:message key="STR_SERVICE_CONTENT_CONFIGURED"/>.<BR>
                      <lum:message key="STR_FINISH_SERVICE_CLICK"/>.</div>
                    <BR>
                    <table width="100%" height="270" align="center" class="cLumControlGroup" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #eeeee7;">
                      <tr>
                        <td valign="top"><div class="cLumControlGroupHeader" id="WizardFinishInformation" style="overflow-y:scroll;"></div></td>
                      </tr>
                    </table>
                  </div>

				  <div id="LumButton1" style="_height:1%" class="cInterfaceButtons">
					<ul style="float:right;">
						<li>
							<span class="brdleft"></span>
							<a href="javascript:onBackClick();">
								<img align="absmiddle" src="lumis/portal/client/images/Back.gif" border="0" alt="<lum:message key="STR_BACK"/>"/><lum:message key="STR_BACK"/>
							</a>
							<span class="brdright"></span>
							<div class="spacer"></div>
						</li>
						
						<li>
							<span class="brdleft"></span>
							<a href="javascript:onSaveClick();">
								<img align="absmiddle" src="lumis/portal/client/images/Ok.gif" border="0" alt="<lum:message key="STR_FINISH"/>"/><lum:message key="STR_FINISH"/>
							</a>
							<span class="brdright"></span>
							<div class="spacer"></div>
						</li>
						
						<li>
						<span class="brdleft"></span>
						<a href="javascript:LumisPortal.opener.LumisPortal.onRefresh();if(window.self != window.top && window.parent.$ && window.parent.LumisLightBox){LumisLightBox.close();}else{window.close();}">
							<img align="absmiddle" src="lumis/portal/client/images/Cancel.gif" border="0" alt="<lum:message key="STR_CANCEL"/>"/><lum:message key="STR_CANCEL"/>
						</a><span class="brdright"></span>
						</li>
					</ul>
				<br style="clear: both" />
              </div>
	</div>
	<script type="text/javascript" src="lumis/portal/client/script/LumisPortalUtil.js"></script>
	<script type="text/javascript" src="lumis/service/contentmanagement/wizard/script/createwizard.jsp"></script>
</form>
