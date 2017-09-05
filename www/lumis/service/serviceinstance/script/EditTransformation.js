// $Revision: 15712 $ $Date: 2013-08-05 23:23:39 -0300 (Mon, 05 Aug 2013) $
$(document).ready(function() {
		LumisPortal.opener.$("#contentDiv input:checked").each(function() {
		var id = $(this).attr('id');
		var inputXmlId = id + "_xml";
		$("#editedId").val(id);
		var name;
		var displayName;
		var prefix;
		var sufix;
		var contentType;
		var extension;
		var prmName;
		var builder;
		var value;
		var xml = LumisPortal.opener.$("#xml").val();
		var objectXml = stringtoXML(xml);
		var arraySize = 0;
		var arrayValues = new Array();
		var y = 0;

		var xmlParsed = $.parseXML(xml);
		var size = $(xmlParsed).find("transformation");

		$(objectXml).find("transformation").each(function() {

			if ($(this).attr("id") == id) {
				$("#transformationId").val(id);
				name = $(this).find("name").text();
				displayName = $(this).find("displayName").text();
				prefix = $(this).find("prefix").text();
				sufix = $(this).find("sufix").text();
				contentType = $(this).find("contentType").text();
				extension = $(this).find("extension").text();
				$(this).find("parameters").each(function() {
					var i = 1;
					$(this).find("parameter").each(function() {
						if(i > 1)
						{
							renderParametersHtml();
						}
						prmName = $(this).find("prmName").text();
						builder = $(this).find("builder").text();
						value = $(this).find("value").text();
						
						arrayValues[arraySize++] = prmName +"," + builder + "," + value;
						
						i++;
					});
					
					$(".cLumTransformation").each(function(){
						var paramValues = arrayValues[y++].split(",");
						$("#prmName", this).val(paramValues[0]);
						$("#builder", this).val(paramValues[1]);
						$("#value", this).val(paramValues[2]);
					})
				});
			}

		});
		$("#name").val(name);
		$("#displayName").val(displayName);
		$("#filePrefix").val(prefix);
		$("#fileSufix").val(sufix);
		$("#contentType").val(contentType);
		$("#extension").val(extension);
	});
});
