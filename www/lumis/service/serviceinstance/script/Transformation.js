// $Revision: 15382 $ $Date: 2013-05-23 19:04:46 -0300 (Thu, 23 May 2013) $
$(document).ready(function()
{
	//hides or shows the parameters the, depending if the transformation is activated or not
	if($("#usesFileTransformation").is(":checked"))
	{
		$('#divAdmin').show();
	}
	// build the html table, if the xml element has information to show
	if($("#xml").val() != null && $("#xml").val() != "")
	{
		var xml = $("#xml").val();
		buildTable(xml);
	}
	
	$('#usesFileTransformation').click(function() 
	{
		if(!$('#usesFileTransformation').is(":checked"))
		{
			if(!confirm(getErrorString("STR_UNSAVED_TNSF_LOST")))
			{
				$('#usesFileTransformation').attr("checked", "checked");
			}
			else
			{
				$('#divAdmin').hide();
				var empty = buildEmptySugestions();
				$("#xml").val(empty);
				buildTable(empty);
			}
		}
		else
		{
			$('#divAdmin').show();
			
			var xmlEmpty = $("#xml").val();
			var fresh = $(xmlEmpty).find('transformation');
			if(fresh.length <= 0)
			{
				if(!confirm(getErrorString("STR_LOAD_SUGESTIONS"))) 
				{
					xml = buildEmptySugestions();
					
					$("#xml").val(xml);
					buildTable(xml);
				}
				else
				{
					xml = buildSugestions();
					$("#xml").val(xml);
					buildTable(xml);
				}
			}
		}
	});
});

/**
 * Returns the string traduction
 * @param name
 * @return
 */
function getErrorString(name)
{
	if(LumisTransformationStrings)
		return LumisTransformationStrings[name];
	return name;
}

/**
 * Adds the html row
 * @param id the item id
 * @param name the name of the item
 * @param xml the xml data
 * @return
 */
function addRow(id, name, xml)
{
	var html = "<tr id ='" + id + "'class=\"cLumEvenRow\">";
	html += "<td>" + buildRow(id, name, xml) +"</td></tr>";
	$("#transformationElements tbody").prepend(html);
}

/**
 * Builds the html row
 * @param id
 * @param name
 * @param xml
 * @return
 */
function buildRow(id, name, xml)
{
	var html = "<input type=\"checkbox\" id=\"{id}\" class=\"trasfomationTemplates\"/>" +
				"<input type=\"hidden\" id=\"{id}_id\" value=\"{id}\" />" +
				"<input type=\"hidden\" id=\"{id}_xml\"\"/>" +
				"<span id=\"{id}_view\" href=\"#\">{name}</span>";
	
	html = replaceAll(html,'{id}', id);
	html = html.replace('{name}', name);
	
	return html;
}

/**
 * Generates a table with the data rows
 * @param xml the xml to be inserted
 */
function buildTable(xml)
{
	var table = 
	"<table id = \"transformationElements\">" +
		"<tbody>";
	
	var xmlParsed = $.parseXML(xml);
	var size = $(xmlParsed).find("transformation");
	
	if (size.length > 0) 
	{
		$(xmlParsed).find("transformation").each(
				function() 
				{
					var id_text = $(this).attr("id");
					var name = $(this).find("displayName").text();
					var transformationXml = XmlToString(this);
					var xml = "<transformation id='" + id_text + "'>"
							+ transformationXml + "</transformation>";
					
					table += "<tr id='" + id_text + "'class=\"cLumEvenRow\">";
					table += "<td>" + buildRow(id_text, name, xml);
					table += "</td>";
					table += "</tr>";
				});
	}
	table += "</tbody>" +
	"</table>";
	$('#contentDiv').html(table);
}

/**
 * Inserts the transformations sugestions if the user options for it
 * @return the sugestions
 */
function buildSugestions()
{
	 var sugestions = [
	                    "\"" + guidGenerator() + "\","+ "vorbis_to_mp3"+","+ getErrorString("STR_VORBIS_TO_MP3")+",mp3,st,^audio/(ogg)$,mp3,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,mp3", 
	                    "\"" + guidGenerator() + "\","+ "mp3_to_vorbis"+","+ getErrorString("STR_MP3_TO_VORBIS")+",ogg,st,^audio/(mpeg)$,ogg,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,vorbis", 
	                    "\"" + guidGenerator() + "\","+ "mp4_to_ogg"+","+ getErrorString("STR_MP4_TO_OGG")+",ogv,st,^video/(mp4)$,ogv,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,ogg", 
	                    "\"" + guidGenerator() + "\","+ "ogg_to_mp4"+","+ getErrorString("STR_OGG_TO_MP4")+",mp4,st,^video/(ogg)$,mp4,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,mp4", 
	                    "\"" + guidGenerator() + "\","+ "flv_or_mpeg_to_avi_sm"+","+ getErrorString("STR_FLV_OR_MPEG_TO_AVI_SM")+",avi,pq,^video/(x-flv|mpe?g)$,avi,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,avi," 
														+ "WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,320",
						"\"" + guidGenerator() + "\","+ "flv_or_mpeg_to_avi_md"+","+ getErrorString("STR_FLV_OR_MPEG_TO_AVI_MD")+",avi,md,^video/(x-flv|mpe?g)$,avi,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,avi," 
																+ "WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,480",
						"\"" + guidGenerator() + "\","+ "flv_or_mpeg_to_avi_lg"+","+ getErrorString("STR_FLV_OR_MPEG_TO_AVI_LG")+",avi,gd,^video/(x-flv|mpe?g)$,avi,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,avi," 
																+ "WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,640",
																
						"\"" + guidGenerator() + "\","+ "flv_or_avi_to_mpeg_sm"+","+ getErrorString("STR_FLV_OR_AVI_TO_MPEG_SM")+",mpeg,pq,^video/(x-flv|x-msvideo)$,mpeg,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,mpeg," 
																+ "WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,320",
						"\"" + guidGenerator() + "\","+ "flv_or_avi_to_mpeg_md"+","+ getErrorString("STR_FLV_OR_AVI_TO_MPEG_MD")+",mpeg,md,^video/(x-flv|x-msvideo)$,mpeg,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,mpeg," 
																+ "WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,480",
						"\"" + guidGenerator() + "\","+ "flv_or_avi_to_mpeg_lg"+","+ getErrorString("STR_FLV_OR_AVI_TO_MPEG_LG")+",mpeg,gd,^video/(x-flv|x-msvideo)$,mpeg,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,mpeg," 
																+ "WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,640",
																
						"\"" + guidGenerator() + "\","+ "mpeg_or_avi_to_flv_sm"+","+ getErrorString("STR_MPEG_OR_AVI_TO_FLV_SM")+",flv,pq,^video/(x-msvideo|mpe?g)$,flv,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,flv," 
																+ "WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,320",
						"\"" + guidGenerator() + "\","+ "mpeg_or_avi_to_flv_md"+","+ getErrorString("STR_MPEG_OR_AVI_TO_FLV_MD")+",flv,md,^video/(x-msvideo|mpe?g)$,flv,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,flv," 
																+ "WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,480",
						"\"" + guidGenerator() + "\","+ "mpeg_or_avi_to_flv_lg"+","+ getErrorString("STR_MPEG_OR_AVI_TO_FLV_LG")+",flv,gd,^video/(x-msvideo|mpe?g)$,flv,FORMAT,lumis.portal.file.transformation.TranscodingTransformationBuilder,flv," 
																+ "WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,640",
																
	                    "\"" + guidGenerator() + "\","+ "scaling_image_lg"+","+ getErrorString("STR_SCALING_IMAGE_LG")+",img,gd,^image/(jpg|jpeg|pjpeg|png|x-png|gif)$,,WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,640", 
						"\"" + guidGenerator() + "\","+ "scaling_image_md"+","+ getErrorString("STR_SCALING_IMAGE_MD")+",img,md,^image/(jpg|jpeg|pjpeg|png|x-png|gif)$,,WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,480", 
						"\"" + guidGenerator() + "\","+ "scaling_image_sm"+","+ getErrorString("STR_SCALING_IMAGE_SM")+",img,pq,^image/(jpg|jpeg|pjpeg|png|x-png|gif)$,,WIDTH,lumis.portal.file.transformation.ScaleTransformationBuilder,320"]; 
	 
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
		"<transformations>";
	
		for (i = 0; i < sugestions.length; i++)
		{
			j = 0;
			var vars = sugestions[i].split(",");
			
			xml += "<transformation id = " + vars[j++] + ">" + 
					"<name>" + vars[j++] + "</name>" +
					"<displayName>" + vars[j++] + "</displayName>" +
					"<prefix>" + vars[j++] + "</prefix>" +
					"<sufix>" + vars[j++] + "</sufix>"; 
					var contentType = vars[j++];
					var contentTypeSplited = contentType.split("/");
					xml += "<contentType>" + contentType + "</contentType>" + 
					"<extension>" + vars[j++] + "</extension>" +
					"<parameters>" +
						"<parameter>" +
							"<prmName>" + vars[j++] + "</prmName>" +
							"<builder>" + vars[j++] + "</builder>" +
							"<value>" + vars[j++] + "</value>" +
						"</parameter>"; 
					if(contentTypeSplited[0] != "^image" && contentTypeSplited[1] != "(mpeg)$" && contentTypeSplited[1] != "(mp4)$" && contentTypeSplited[1] != "(ogg)$")
					{
						xml += "<parameter>" +
									"<prmName>" + vars[j++] + "</prmName>" +
									"<builder>" + vars[j++] + "</builder>" +
									"<value>" + vars[j++] + "</value>" +
								"</parameter>"; 
					}
					xml+="</parameters>" +
							"</transformation>";
		}
	xml+="</transformations>";
	
	return xml;
}

/**
 * Empty sugestions if the user does not option to load the sugestions.
 * @return the empty sugestions
 */
function buildEmptySugestions()
{
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
		"<transformations>" +
				"</transformations>" ;
	return xml;
}

/**
 * A guid generator for front end
 * @return
 */
function guidGenerator() 
{
    var S4 = function() 
    {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase();
    };
    return ("np_"+S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
}

/**
 * Replaces a given string from another
 * @return the new string
 */
function replaceAll(str, from, to)
{
    var pos = str.indexOf(from);
    while (pos > -1)
    {
		str = str.replace(from, to);
		pos = str.indexOf(from);
	}
    return (str);
}

/**
 * Converts a xml string to xml object
 * @param text the xml string to be converted
 * @return the converted xml
 */
function stringtoXML(text)
{
    if (window.ActiveXObject)
    {
      var doc=new ActiveXObject('Microsoft.XMLDOM');
      doc.async='false';
      doc.loadXML(text);
    }
    else 
    {
      var parser=new DOMParser();
      var doc=parser.parseFromString(text,'text/xml');
    }
    
    return doc;
}

/**
 * Removes the wished xml node from the central xml
 * @param myDoc the xml
 * @param id the id of the node to be removed
 */
function remove(myDoc, id) 
{
	var meuselementos = myDoc.getElementsByTagName("transformation");
	for (i = 0; i < meuselementos.length; i++) 
	{
		if (meuselementos[i].attributes['id'] != undefined) 
		{
			if (meuselementos[i].attributes['id'].value == id) 
			{
				myDoc.documentElement.removeChild(meuselementos[i]);
			}
		} 
		else 
		{
			var myattributes = meuselementos[i].attributes;
			for (j = 0; j < myattributes.length; j++) 
			{
				if (myattributes[j].name == 'id' && myattributes[j].value == id) 
				{
					myDoc.documentElement.removeChild(meuselementos[i]);
				}
			}
		}
	}
	updateCentralXml(myDoc);
}

/**
 * Updates the central xml.
 * @param newXml the xml to be inserted
 */
function updateCentralXml(newXml)
{
	if (window.ActiveXObject) 
	{
		var toString = newXml.xml;
	}
	else 
	{
		var toString = (new XMLSerializer()).serializeToString(newXml);
	}
	$('#xml').val(toString);
}

/**
 * Removes the item from the front end and the XML
 * @param id the id to be removed
 */
function removeFromFrontEnd(id)
{
	var xml = $('#xml').val();
	var toBeRemoved = stringtoXML(xml);
	var removed = 'tr#'+id+'';
	$(removed).fadeOut(500, function() { $(this).remove(); });
	remove(toBeRemoved, id);
}

/**
 * Prepares the remotion of the item.
 * @return
 */
function prepareRemotion()
{
	var toBeRemoved = $("#contentDiv input:checked").length;
	if(toBeRemoved <= 0)
	{
		alert(getErrorString("STR_SELECT_AT_LEAST_ONE_ITEM"));
		return;
	}
	$("#contentDiv input:checked").each(function()
	  {
		var id = $(this).attr('id');
		removeFromFrontEnd(id);
	  });
}

/**
 * Renders the parameters pane
 */
function renderParametersHtml()
{	
	var divId = guidGenerator();
	$("div#paramsDiv").hide().append(
			"<div id=\""+ divId +"\" class = \"cLumTransformation\" style=\"margin-bottom:10px; background-color: white; border: 1px solid #EEEEE7;\">" +
					"<table cellspacing=\"4\" cellpadding=\"0\" id=\"paramsTable\">" +
						"<tbody>" +
							"<tr>" +
								"<td>" +
									"<span class=\"cLumLabel\"> " + LumisTransformationStrings["STR_NAME"] + ": </span>" +
								"</td>" + 
								"<td>" +
								"	<input class=\"cLumInputText\" value=\"\" name=\"prmName\" type=\"text\" id=\"prmName\"/></span>" +
								"</td>" +
							"</tr>" + 
							"<tr>" +
								"<td>" +
									"<span class=\"cLumLabel\"> " + LumisTransformationStrings["STR_BUILDER"] + ": </span>" +
								"</td>" + 
								"<td>" +
								"<input class=\"cLumInputText\" value=\"\" name=\"builder\" type=\"text\" id=\"builder\"/></span>" +
								"</td>" +
								"<td>" +
									"<a href=\"#\" onclick=deleteParametersHtml(\"" + divId + "\");><img style=\"border-width: 0px;\" id=\"" + divId +".img\" src=\""+g_LumisRootPath+"lumis/portal/client/images/Delete.gif\" title=\"Remove Transformation\" alt=\"Remove Transformation\">" +
											"<span id=\"" + divId + "\".text\"></span>" +
									"</a>" +
								"</td>" +
								"</tr>" + 
								"<tr>" +
									"<td>" +
										"<span class=\"cLumLabel\">" + LumisTransformationStrings["STR_VALUE"] + ": </span>" +
									"</td>" + 
									"<td>" +
										"<input class=\"cLumInputText\" value=\"\" name=\"value\" type=\"text\" id=\"value\"/></span>" +
									"</td>" +
								"</tr>" +
						"</tbody>" +
					"</table>" +
			"</div>").fadeIn("slow");
}

/**
 * Removes the selected item from the HTML
 * @param id the id of the item to be removed
 */
function deleteParametersHtml(id)
{
	var size = $("#paramsDiv > div").size();
	if (size <= 1)
	{
		alert(getErrorString("STR_MUST_HAVE_AT_LEAST_ONE_PRM"));
		return;
	}
	var remove = "div#" + id;
	$(remove).fadeOut( function() { $(this).remove(); });
}

/**
 * Calls the function to add the xml to the repository,
 * creating a row on the interface with the inserted data 
 * @param xml the xml to be inserted
 */
function addParametersToHidden(xml) 
{
	$("#xmlParameters").val(xml);
	var addedValue = $("#xmlParameters").val();
	var objectXML = stringtoXML(addedValue);
	var object = objectXML.getElementsByTagName("transformation");
	 for(i = 0; i < object.length; i++)
	 {
		 var myattributes = object[i].attributes;
		 
		    for(j = 0; j < myattributes.length; j++)
		    {
		    	id = myattributes[j].value;
		    }
		 name = object[i].childNodes[0].childNodes[0].nodeValue;
	 }
	addToCentralXml(addedValue);
	addRow(id, name, addedValue);
}

/**
 * Adds the xml to a central repository, where the whole 
 * data inserted is stored.
 * @param xml the xml to be stored
 */
function addToCentralXml(xml)
{
	var repo = $("#xml").val();
	var newXml = stringtoXML(xml);
	var repository = stringtoXML(repo);
	var result = repository.getElementsByTagName("transformations")[0];
	var toBeAppended = newXml.getElementsByTagName("transformation")[0];
	result.appendChild(toBeAppended);
	updateCentralXml(result);
}

/**
 * Validates the selected item to be edited.
 * @return true if is valid, false if not
 */
function validateSelected()
{
	var isValid = true;
	var size = $("#contentDiv input:checked").length;
	if (size > 1)
	{
		alert(getErrorString("STR_SELECT_ONE_ITEM"));
		isValid = false;
	}
	if (size < 1)
	{
		alert(getErrorString("STR_SELECT_ONE_ITEM"));
		isValid =false;
	}
	return isValid;
}

/**
 * Transforms a xml object to a string .
 * @param xmlData
 * @return the transformed string
 */
function XmlToString(xmlData)
{
	if (window.ActiveXObject) 
	{
		var string = xmlData.xml;
	} 
	else 
	{
		var string = (new XMLSerializer()).serializeToString(xmlData);
	}
	return string;
}

/**
 * Edits the html transoformation parameters list
 * @param xml the data to be listed
 */
function editTransformationParameters(xml)
{
	var object = stringtoXML(xml);
	
	$(object).find("transformation").each(function()
	{
		var transId = $(this).attr("id");
		removeFromFrontEnd(transId);
	});
	addParametersToHidden(xml);
}

/**
 * Validates the add/edit Transformation pop up fields.
 * @returns {Boolean}
 */
function validateTransformationFields()
{
	var prefixValue = document.getElementById("filePrefix").value;
	var sufixValue = document.getElementById("fileSufix").value;
	var contentType = document.getElementById("contentType").value;
	var name = document.getElementById("name").value;
	var displayName = document.getElementById("displayName").value;
	
	var alertContent = "";
	var isAlert = false;
	var nameFilled = false;
	var builderFilled = false;
	var valueFilled = false;
	
		if(name == "") 
		{ 
			alertContent = getErrorString("STR_NAME_NULL"); 
			isAlert = true;
		} 
		
		if(displayName == "") 
		{ 
			if(alertContent != "")
			{
				alertContent +='\n';
			}
			alertContent += getErrorString("STR_DISPLAY_NAME_NULL"); 
			isAlert = true;
		} 
		
		if(prefixValue == "" && sufixValue =="") 
		{
			if(alertContent != "")
			{
				alertContent +='\n';
			}
		alertContent += getErrorString("STR_PREFIX_SUFIX_MUST_EXIST"); 
		isAlert = true;
	}
	 
		if(contentType == "") 
		{
			if(alertContent != "")
			{
				alertContent +='\n';
			}
		alertContent += getErrorString("STR_CONTENT_TYPE_NULL"); 
		isAlert = true;
	}
	
	$(".cLumTransformation :input[name=prmName]").each(function()
	{
		if($(this).val() == "")
		{
			if(alertContent != "")
				{
					alertContent +='\n';
				}
			alertContent += getErrorString("STR_PARAM_NAME_CAN_NOT_BE_NULL");
			isAlert = true;
			return false;
		}
	});
	
	$(".cLumTransformation :input[name=builder]").each(function()
	{
		if($(this).val() == "")
		{
			if(alertContent != "")
				{
					alertContent +='\n';
				}
			alertContent += getErrorString("STR_PARAM_BUILDER_CAN_NOT_BE_NULL");
			isAlert = true;
			return false;
		}
	});
	
	$(".cLumTransformation :input[name=value]").each(function()
	{
		if($(this).val() == "")
		{
			if(alertContent != "")
				{
					alertContent +='\n';
				}
			alertContent += getErrorString("STR_PARAM_VALUE_CAN_NOT_BE_NULL");
			isAlert = true;
			return false;
		}
	});
	
	if (isAlert)
	{
		alert(alertContent);
		return false;
	}
	
	return true;
}

/**
 * Funtion to assert if a given transformation name already exists.
 * @param isEdition true, if its a Edit pop up, false if its an Add pop up.
 * @returns {Boolean} True if the name already exists, false if not.
 */
function isAlreadyAdded(isEdition) 
{
	var currrentName = document.getElementById("name").value;
	var previouslyAdded = document.getElementById("currentXml").value;
	
	if (isEdition) 
	{
		var editedElementId = document.getElementById("editedId").value;//only exists for edit pop up
	}
	
	var newXML = stringtoXML(previouslyAdded);//bringing string to xml object
	var transformations = newXML.getElementsByTagName("transformation");
	
	for (i = 0; i < transformations.length; i++) 
	{
		var id = transformations[i].attributes[0].value;
		var name = transformations[i].childNodes[0].childNodes[0].nodeValue;

		if (isEdition) 
		{
			if (name.toUpperCase() === currrentName.toUpperCase() && editedElementId != id) 
			{
				alert(getErrorString("STR_TRANSFORMATION_NAME_EXISTS"));
				return true;
			}
		} 
		else 
		{
			if (name.toUpperCase() === currrentName.toUpperCase()) 
			{
				alert(getErrorString("STR_TRANSFORMATION_NAME_EXISTS"));
				return true;
			}
		}
	}
	return false;
}