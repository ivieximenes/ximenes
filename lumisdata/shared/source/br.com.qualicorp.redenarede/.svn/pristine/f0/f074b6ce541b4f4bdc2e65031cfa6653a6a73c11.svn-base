<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
		<div class="news-list customized-font">
			<header class="header-blue white">
				<h1>Serviço</h1>
			</header>
			<xsl:for-each select="//data/row">
						<p class="lead"><xsl:value-of select="name" /></p>
						<xsl:if test="introduction != ''">
							<p><xsl:value-of select="introduction" /></p>
						</xsl:if>
						<div class="service-content">
							<p><xsl:value-of disable-output-escaping="yes" select="content" /></p>
						</div>
			</xsl:for-each>
		</div>
	</xsl:template>
	
</xsl:stylesheet>