<?xml version="1.0" encoding="ISO_8859-1"?>
<!-- $Revision: 15365 $ $Date: 2013-05-22 10:55:59 -0300 (Wed, 22 May 2013) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output omit-xml-declaration = "yes" />
	

	<xsl:template match="/">
		<div class="smt-carousel-items">
			<xsl:for-each select="//banners/banner">
				<div class="smt-carousel-slide">
                <div class="smt-carousel-content">
                    <h1 class="smt-carousel-title"><xsl:value-of disable-output-escaping="yes" select="name" /></h1>
                    <p><xsl:value-of select="description"/></p>
                    <xsl:choose>
						<xsl:when test="image/imageProperties/onclickLinkType='1'">
							<a class="smt-main-button" href="main.jsp?lumPageId={image/imageProperties/onclickPageId}" onclick="ga('send', 'event', 'botao', 'clique', 'home-mid_banner{position()}');"><xsl:value-of select="btncontent"/></a>
						</xsl:when>
						<xsl:when test="image/imageProperties/onclickLinkType='0'">
							<xsl:choose>
								<xsl:when test="image/imageProperties/onClickPopup='true'">
									<a class="smt-main-button" href="{image/imageProperties/onclickUrl}" onclick="ga('send', 'event', 'botao', 'clique', 'home-mid_banner{position()}'); window.open(this.href,'banner','{image/imageProperties/onClickPopupProperties}'); return false;"><xsl:value-of select="btncontent"/></a>
								</xsl:when>
								<xsl:otherwise>
									<a class="smt-main-button" href="{image/imageProperties/onclickUrl}" onclick="ga('send', 'event', 'botao', 'clique', 'home-mid_banner{position()}');"><xsl:value-of select="btncontent"/></a>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
						</xsl:otherwise>
					</xsl:choose> 
                </div><!--
                --><img class="smt-carousel-image" src="{image/src}"/>
	            </div>
			</xsl:for-each>
        </div>
	</xsl:template>
</xsl:stylesheet>