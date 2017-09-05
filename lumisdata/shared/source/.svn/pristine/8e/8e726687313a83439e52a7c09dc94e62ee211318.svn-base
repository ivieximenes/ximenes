<?xml version="1.0" encoding="UTF-8" ?>
<!-- $Revision: 4073 $ $Date: 2006-08-24 11:46:28 -0300 (Thu, 24 Aug 2006) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	<xsl:output omit-xml-declaration = "yes" />

	<xsl:template match="/">
		<script>
			if ("${requestScope.custumizedLayout}" == "true")
				document.body.className += " customized-layout";
		</script>
		
		<xsl:for-each select="/renderData/controls/control/control/data/row">
			<style>
				body.customized-layout,
				body.customized-layout .header-blue.white
				{
					<xsl:if test="corDeFundo != ''">
						background-color: #<xsl:value-of select="corDeFundo" />;
					</xsl:if>
				}
				
				body.customized-layout .customized-font,
				body.customized-layout .customized-font p,
				body.customized-layout .customized-font li a,
				body.customized-layout .customized-font label,
				body.customized-layout .customized-font div,
				body.customized-layout .customized-font h1
				{
					<xsl:if test="corDaLetra != ''">
						color: #<xsl:value-of select="corDaLetra" />;
					</xsl:if>
					
					<xsl:if test="fonteDaLetra != ''">
						font-family: <xsl:value-of select="fonteDaLetra" />;
					</xsl:if>
				}
				
				body.customized-layout .customized-layout,
				body.customized-layout .customized-layout h1,
				body.customized-layout header.customized-layout
				{
					<xsl:if test="corDeFundo != ''">
						background-color: #<xsl:value-of select="corDeFundo" />;
					</xsl:if>
					
					<xsl:if test="corDaLetra != ''">
						color: #<xsl:value-of select="corDaLetra" />;
					</xsl:if>
					
					<xsl:if test="fonteDaLetra != ''">
						font-family: <xsl:value-of select="fonteDaLetra" />;
					</xsl:if>
				}
				
				body.customized-layout .header-blue.white h1
				{
					border-bottom-color: #<xsl:value-of select="corDaLetra" />;
				}
			</style>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>