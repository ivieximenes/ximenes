<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:lum="http://www.lumis.com.br/doui" exclude-result-prefixes="lum" version="1.0">
<!-- $Revision: 13269 $ $Date: 2011-07-27 19:29:14 -0300 (Wed, 27 Jul 2011) $ -->
<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
<xsl:output omit-xml-declaration = "yes" />

	<xsl:template match="/">
		<h1>quem é você?</h1>
		<xsl:for-each select="//data/row">
			<a  class="box">
					<xsl:choose>
						<xsl:when test="linkType='3'">
							<xsl:attribute name="href"><xsl:value-of select="linkDocumentId/downloadHref"/></xsl:attribute>
						</xsl:when>
						<xsl:when test="linkType='2'">
							<xsl:attribute name="href">main.jsp?lumPageId=<xsl:value-of select="linkPageId/id"/></xsl:attribute>
						</xsl:when>
						<xsl:when test="linkType='0'">
							<xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
							<xsl:attribute name="href"><xsl:value-of select="linkUrl"/></xsl:attribute>
							<xsl:if test="linkClickPopup = 'true'">
								<xsl:choose>
								<xsl:when test="linkPopupProperties != ''">
									<xsl:attribute name="onclick">javascript:window.open(this.href, '_blank' ,'<xsl:value-of select="linkPopupProperties"/>'); return false</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="target">_blank</xsl:attribute>
								</xsl:otherwise>
								</xsl:choose>
							</xsl:if>
						</xsl:otherwise>
				</xsl:choose>
					<xsl:if test="image/href != ''">
							<img src="{image/href}" width="276" height="180"/>
						</xsl:if>
				 <h2><xsl:value-of select="name" /> </h2>
	</a>
</xsl:for-each>
	</xsl:template>
	
</xsl:stylesheet>

