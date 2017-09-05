<?xml version="1.0" encoding="ISO_8859-1"?>
<!-- $Revision: 15365 $ $Date: 2013-05-22 10:55:59 -0300 (Wed, 22 May 2013) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output omit-xml-declaration = "yes" />
	

	<xsl:template match="/">
		<!-- Indicators -->
		<div id="myCarousel" class="carousel slide" data-ride="carousel" > 
		<ol class="carousel-indicators"> 
		    <xsl:for-each select="//banners/banner">
				<xsl:choose>
					<xsl:when test="position()=1">
						<li data-target="#myCarousel" data-slide-to="{position()-1}" class="active"></li>
					</xsl:when>
					<xsl:otherwise>
						<li data-target="#myCarousel" data-slide-to="{position()-1}"></li>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>	
		</ol> 
		<div class="carousel-inner" role="listbox"> 
		    <xsl:for-each select="//banners/banner">
				<xsl:choose>
					<xsl:when test="position()=1">
						<div class="item active">
						 	<xsl:choose>
								<xsl:when test="image/imageProperties/onclickLinkType='1'">
									<a href="main.jsp?lumPageId={image/imageProperties/onclickPageId}" onclick="ga('send', 'event', 'botao', 'clique', 'home-mid_banner{position()}');">
										<img style="border: 0px; height: 450px; width: 1000px;" src="{image/src}" alt="{name}" />
									</a>
								</xsl:when>
								<xsl:when test="image/imageProperties/onclickLinkType='0'">
									<xsl:choose>
										<xsl:when test="image/imageProperties/onClickPopup">
											<a href="{image/imageProperties/onclickUrl}" onclick="ga('send', 'event', 'botao', 'clique', 'home-mid_banner{position()}'); window.open(this.href,'banner','{image/imageProperties/onClickPopupProperties}'); return false;">
												<img style="border: 0px; height: 450px; width: 1000px;" src="{image/src}" alt="{name}" />
											</a>
										</xsl:when>
										<xsl:otherwise>
											<a href="{image/imageProperties/onclickUrl}" onclick="ga('send', 'event', 'botao', 'clique', 'home-mid_banner{position()}');">
												<img style="border: 0px; height: 450px; width: 1000px;" src="{image/src}" alt="{name}" />
											</a>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:when>
								<xsl:otherwise>
									<img style="border: 0px; height: 450px; width: 1000px;" src="{image/src}" alt="{name}" />
								</xsl:otherwise>
							</xsl:choose>
						</div>
					</xsl:when>
					<xsl:otherwise>
						<div class="item"> 
							<xsl:choose>
								<xsl:when test="image/imageProperties/onclickLinkType='1'">
									<a href="main.jsp?lumPageId={image/imageProperties/onclickPageId}" onclick="ga('send', 'event', 'botao', 'clique', 'home-mid_banner{position()}');">
										<img style="border: 0px; height: 450px; width: 1000px;" src="{image/src}" alt="{name}" />
									</a>
								</xsl:when>
								<xsl:when test="image/imageProperties/onclickLinkType='0'">
									<xsl:choose>
										<xsl:when test="image/imageProperties/onClickPopup">
											<a href="{image/imageProperties/onclickUrl}" onclick="ga('send', 'event', 'botao', 'clique', 'home-mid_banner{position()}'); window.open(this.href,'banner','{image/imageProperties/onClickPopupProperties}'); return false;">
												<img style="border: 0px; height: 450px; width: 1000px;" src="{image/src}" alt="{name}" />
											</a>
										</xsl:when>
										<xsl:otherwise>
											<a href="{image/imageProperties/onclickUrl}" onclick="ga('send', 'event', 'botao', 'clique', 'home-mid_banner{position()}');">
												<img style="border: 0px; height: 450px; width: 1000px;" src="{image/src}" alt="{name}" />
											</a>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:when>
								<xsl:otherwise>
									<img style="border: 0px; height: 450px; width: 1000px;" src="{image/src}" alt="{name}" />
								</xsl:otherwise>
							</xsl:choose> 
						</div>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>	
		</div> 
		<!-- .container -->
		</div>
	</xsl:template>
</xsl:stylesheet>