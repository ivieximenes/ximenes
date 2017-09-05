<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
		<ul> 
		  <xsl:for-each select="//data/row">
					  <li><a href="{href}"><xsl:value-of select="name" /></a></li> 
				</xsl:for-each>
		</ul>

	</xsl:template>
	
</xsl:stylesheet>