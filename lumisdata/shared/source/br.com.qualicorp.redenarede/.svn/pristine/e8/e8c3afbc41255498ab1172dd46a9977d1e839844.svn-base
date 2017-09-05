<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
	<div class="services-list customized-font">
			<ul> 
					<xsl:for-each select="//data/row">
						<li>
							<a>
								<xsl:choose>
										<xsl:when test="linkType='3'">
											<xsl:attribute name="href"><xsl:value-of select="linkDocumentId/downloadHref"/></xsl:attribute>
										</xsl:when>
										<xsl:when test="linkType='2'">
											<xsl:attribute name="href">main.jsp?lumPageId=<xsl:value-of select="linkPageId/id"/></xsl:attribute>
										</xsl:when>
										<xsl:when test="linkType='0'">
											<xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute>
											<xsl:if test="contains(linkUrl, 'boaconsulta')">
										      <xsl:attribute name="onclick">ga('send', 'event', 'banner', 'clique', 'homebeneficiario-link_agenda-consultas');</xsl:attribute>
										    </xsl:if>
										    <xsl:if test="contains(linkUrl, 'mais-servicos')">
										      <xsl:attribute name="onclick">ga('send', 'event', 'link', 'clique', 'homebeneficiario-link_mais-servicos');</xsl:attribute>
										    </xsl:if>
										</xsl:when>
										<xsl:otherwise>
											<xsl:attribute name="href"><xsl:value-of select="linkUrl"/></xsl:attribute>
											<xsl:if test="contains(linkUrl, 'boaconsulta')">
										      <xsl:attribute name="onclick">ga('send', 'event', 'banner', 'clique', 'homebeneficiario-link_agenda-consultas');</xsl:attribute>
										    </xsl:if>
										    <xsl:if test="contains(linkUrl, 'mais-servicos')">
										      <xsl:attribute name="onclick">ga('send', 'event', 'link', 'clique', 'homeprestador-link_prontuário-eletronico');</xsl:attribute>
										    </xsl:if>
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
								<xsl:value-of select="name" />
							</a>
						</li> 
			</xsl:for-each>
		</ul>
	</div>
	</xsl:template>
	
</xsl:stylesheet>