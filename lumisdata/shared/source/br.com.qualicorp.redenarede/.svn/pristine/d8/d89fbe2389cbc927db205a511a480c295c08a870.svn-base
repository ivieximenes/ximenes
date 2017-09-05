<?xml version="1.0" encoding="UTF-8" ?>
<!-- $Revision: 15458 $ $Date: 2013-06-10 19:03:05 -0300 (Mon, 10 Jun 2013) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
<xsl:output omit-xml-declaration = "yes" />
	
	<xsl:template match="/">
	
		<xsl:apply-imports/>
		
		
		<script>
			
			<xsl:text disable-output-escaping="yes"><![CDATA[
			
		
			$(function () {
			
				var filterBt = $("[id*='_adminList_filters_applyFilter']");
				
				var adicionalValidationStr = " var errosFiltersA = adicionalValidationsFilter(); if (errosFiltersA) {alert(errosFiltersA); return;} ";
				
				var onclick = filterBt.attr("onclick").replace("document.forms", adicionalValidationStr + "document.forms");
				
				filterBt.attr("onclick", onclick);
			});
			
			function adicionalValidationsFilter()
			{
				var errors = "";
				
				var deDate = $("#adminList\\.filters\\.de\\.value\\.date").datepicker('getDate');
				var ateDate = $("#adminList\\.filters\\.ate\\.value\\.date").datepicker('getDate');
				
				if (deDate && ateDate)
				{
					var detime = $("#adminList\\.filters\\.de\\.value\\.time").val();
					var ateTime = $("#adminList\\.filters\\.ate\\.value\\.time").val();
					
					if (!detime) detime = "00:00";
					if (!ateTime) ateTime = "00:00";
					
					if (deDate.getTime() > ateDate.getTime() || (deDate.getTime() === ateDate.getTime() && detime > ateTime))
						errors += "O filtro 'Data e Hora De' não pode ser posterior ao filtro 'Data e Hora Até'!"
				}
				
				
				return errors;
			}
			
			]]></xsl:text>
		</script>
	</xsl:template>
	
</xsl:stylesheet>