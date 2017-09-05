<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />

<xsl:template match="/">
	<div class="login">
		<div class="login-type">
			<img class="login-icon" src="/lumis-theme/br/com/qualicorp/redenarede/theme/qualicorp-redenarede/assets/login.png"/>
			<span class="login-span">login</span>
		</div>
		
		</div>		
		<script type="text/javascript">  
				$('.search').css('margin', '0px');	
				
				$(".login-type").click(function(){window.location='/<xsl:value-of select="/renderData/controls/control[@id='link']/data/href"/>';});		
		</script>
</xsl:template>
	
	
</xsl:stylesheet>