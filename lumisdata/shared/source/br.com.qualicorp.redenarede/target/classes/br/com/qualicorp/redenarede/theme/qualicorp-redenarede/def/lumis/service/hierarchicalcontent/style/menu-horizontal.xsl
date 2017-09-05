<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">

		<xsl:for-each select="//data/row[parentContentId = '']">
			<li>
				<a href="{@href}">
					<xsl:choose>
						<xsl:when test="type = 4">
							<xsl:attribute name="style">text-decoration: none; cursor: default;</xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>
								<xsl:when test="type = 1">
									<xsl:if test="@onClick">
										<xsl:attribute name="onclick"><xsl:value-of select="@onClick" /></xsl:attribute>
									</xsl:if>
									<xsl:if test="target">
										<xsl:attribute name="target"><xsl:value-of select="target" /></xsl:attribute>
									</xsl:if>
								</xsl:when>
								<xsl:when test="type = 3">
									<xsl:attribute name="class">lum-link-attachment</xsl:attribute>
								</xsl:when>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:value-of select="title" />
				</a>
			</li> 
			<xsl:if test="position()!=last()">
				<li class="divider"></li> 
			</xsl:if>
			
		</xsl:for-each>
			

	</xsl:template>
	
</xsl:stylesheet>