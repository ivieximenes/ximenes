<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
		<div class="smt-news-carousel smt-carousel-wrapper">
           <ul class="smt-news-items">
           	   <xsl:for-each select="//data/row">
	           	   	<li class="smt-news-slide">
	                   <a class="smt-link-block" href="{@href}">
	                       <h3 class="smt-news-title"><xsl:value-of select="title" /></h3>
	                       <p class="smt-news-introduction"><xsl:value-of select="introduction" /></p>
	                   </a>
	               </li>
           	   </xsl:for-each>
           </ul>
           <div class="smt-section-actions">
               <a href="{/renderData/controls/control/control/control[@id='autoLayout.listlink']/data/href}" class="smt-secondary-button">Ver todos os artigos</a>
           </div>
       </div>
	</xsl:template>
</xsl:stylesheet>
