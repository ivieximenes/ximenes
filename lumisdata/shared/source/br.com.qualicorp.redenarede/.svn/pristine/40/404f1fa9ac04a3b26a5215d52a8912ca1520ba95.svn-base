<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />

	<xsl:template match="/">
		<xsl:for-each select="//data/row">
			<header class="header-blue white">
				<h1><xsl:value-of select="title" /></h1>
			</header>

			<xsl:if test="introduction != ''">
				<p><xsl:value-of select="introduction" /></p>
			</xsl:if>
			<div class="service-content">
				<p><xsl:value-of disable-output-escaping="yes" select="linkContent" /></p>
			</div>	
		</xsl:for-each>
	</xsl:template>

</xsl:stylesheet>