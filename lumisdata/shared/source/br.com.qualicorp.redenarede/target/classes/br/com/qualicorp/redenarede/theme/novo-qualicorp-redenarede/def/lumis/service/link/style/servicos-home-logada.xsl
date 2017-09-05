<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
	
	
	<div class="smt-section-wrapper">
	    <div class="smt-section-contents">
	        <div class="smt-features-carousel smt-carousel-wrapper">
	            <ul class="smt-features-items">
	            	<xsl:for-each select="//data/row">
		                <li class="smt-features-slide">
		                    <a  class="smt-link-block">
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
							      <xsl:attribute name="onclick">ga('send', 'event', 'banner', 'clique', 'homeprestador-mid_banner2');</xsl:attribute>
							    </xsl:if>
							    <xsl:if test="contains(linkUrl, 'prontmed')">
							      <xsl:attribute name="onclick">ga('send', 'event', 'banner', 'clique', 'homeprestador-mid_banner1');</xsl:attribute>
							    </xsl:if>
							</xsl:when>
							<xsl:otherwise>
								<xsl:attribute name="href"><xsl:value-of select="linkUrl"/></xsl:attribute>
								<xsl:if test="contains(linkUrl, 'boaconsulta')">
							      <xsl:attribute name="onclick">ga('send', 'event', 'banner', 'clique', 'homeprestador-mid_banner2');</xsl:attribute>
							    </xsl:if>
							    <xsl:if test="contains(linkUrl, 'prontmed')">
							      <xsl:attribute name="onclick">ga('send', 'event', 'banner', 'clique', 'homeprestador-mid_banner1');</xsl:attribute>
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
					<xsl:if test="image/href">
									<img class="smt-features-image" src="{image/href}" />
								</xsl:if>
		                        <h3 class="smt-features-title"><xsl:value-of select="name" /> </h3>
		                        <p class="smt-features-introduction"><xsl:value-of select="introduction" /></p>
							</a>
			                </li>
		                </xsl:for-each>
		            </ul>
		            <div class="smt-section-actions">
	                <a href="#" class="smt-secondary-button">Mais serviços</a>
	            </div>
	        </div>
	    </div>
	</div>
	</xsl:template>
</xsl:stylesheet>