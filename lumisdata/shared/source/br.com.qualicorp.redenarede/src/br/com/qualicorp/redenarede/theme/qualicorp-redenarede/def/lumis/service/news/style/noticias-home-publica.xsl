<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">

		<header class="header-blue"> 
    		<h1>faz bem pra você.</h1> 
		</header> 
		
		<xsl:for-each select="//data/row">
				<div class="headline"> 
					
					<img src="assets/imagem.jpg">
						<xsl:if test="introductionImage/href != ''">
							<xsl:attribute name="src"><xsl:value-of select="introductionImage/href" /></xsl:attribute>
							<xsl:attribute name="width">198</xsl:attribute>
							<xsl:attribute name="height">132</xsl:attribute>
						</xsl:if>
					</img>
					
					<a href="{@href}" style="text-decoration: none;"><h2><xsl:value-of select="title" /></h2> 
						<xsl:if test="introduction !=''">
							<p><xsl:value-of select="introduction" /></p>
						</xsl:if>
					</a>
				</div> 
		</xsl:for-each>
			
	  <div style="text-align: right;margin-bottom: 10px;">
		  <a href="{/renderData/controls/control/control/control[@id='autoLayout.listlink']/data/href}">Mais Notícias</a>
		</div>
	</xsl:template>
	
</xsl:stylesheet>
