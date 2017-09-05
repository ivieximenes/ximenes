<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:import href="/lumis/doui/style/DouiServiceInterface.xsl" />
	<xsl:template match="/">
	
		<xsl:apply-imports/>
		
		<script>
			
			$(function () {
				
				var sii = "<xsl:value-of select="/renderData/douiContext/serviceInstanceId" />";
				
				<xsl:text disable-output-escaping="yes"><![CDATA[
				
				var reader = new FileReader();
					
				reader.addEventListener("load", function () {
				
					console.log( "loaded" );
					
					$.ajax({
					    url: "/lumis/api/rest/" + sii + "/estupulante-rest/beneficiario/associar-csv",
					    data: {"arquivo": reader.result, "charset": $("#charset").val(), "useHeader": $("#useHeader").prop("checked")},
					    type: 'POST',
					    success: function (data) {
					        
							if (data.msg)
								alert(data.msg);
							
							var a = window.document.createElement('a');
							a.href = window.URL.createObjectURL(new Blob([data.fileLineErros], {type: 'text/csv'}));
							a.download = 'linhas_com_problema.csv';
							
							document.body.appendChild(a)
							a.click();
							
							document.body.removeChild(a)
							
							$("#arquivo").val("");
							
							$("#loading-import").remove();
							$(".lum-interface-buttons").show();
					    },
					    error: function (jqXHR, textStatus, errorThrown) {
					    
					    	console.log("jqXHR =");
					    	console.log(jqXHR);
					    	
					    	console.log("textStatus =");
					    	console.log(textStatus);
					    	
					    	console.log("errorThrown =");
					    	console.log(errorThrown);
					    	
					    	alert("Error: " + JSON.stringify(jqXHR));
							
							$("#loading-import").remove();
							$(".lum-interface-buttons").show();
					    }
					});
					
				}, false);
				
				var changeLoadingText = function ()
				{
					if (!$("#loading-import").length)
					{
						clearInterval(window.refreshIntervalIdLoadImport);
						return;
					}
					
					if ($("#loading-import").text() == "loading...")
					{
						$("#loading-import").text("loading");
					}
					else if ($("#loading-import").text() == "loading")
					{
						$("#loading-import").text("loading.");
					}
					else if ($("#loading-import").text() == "loading.")
					{
						$("#loading-import").text("loading..");
					}
					else if ($("#loading-import").text() == "loading..")
					{
						$("#loading-import").text("loading...");
					}
				};
				
				window.importBtOkHandler = function () {
						
					var file = $("#arquivo")[0].files[0];
					
					$(".lum-interface-buttons")
					.hide()
					.after("<p id='loading-import' style='text-align: end;'>loading...</p>");
					
					window.refreshIntervalIdLoadImport = setInterval(changeLoadingText, 700);
					
					if (file)
					{
						console.log( "loading" );
						
						reader.readAsDataURL(file)
					}
					else
					{
						alert("Selecione um arquivo!");
					}
				};
				
				
				]]></xsl:text>
			});
		</script>
	</xsl:template>
	
</xsl:stylesheet>