<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
			<ul class="smt-footer-nav-items">
				<xsl:for-each select="//data/row[parentContentId = '']">
	                <li class="smt-footer-item">
		            	<a href="{@href}"  class="smt-footer-link">
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
									</xsl:choose>
								</xsl:otherwise>
							</xsl:choose>
							<xsl:value-of select="title" />
						</a>
		            </li>
				</xsl:for-each>
            </ul>
	</xsl:template>
</xsl:stylesheet>