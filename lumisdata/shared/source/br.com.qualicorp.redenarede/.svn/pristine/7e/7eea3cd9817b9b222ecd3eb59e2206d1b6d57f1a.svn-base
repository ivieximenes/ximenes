<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">

		<header class="header-blue white"> 
    		<h1>Resultado da Busca</h1> 
		</header> 
		<xsl:choose>
			<xsl:when test="//data/row">
				<xsl:for-each select="//data/row">
					<div class="headline" style="padding-left: 0;">
						<a href="{@href}" style="text-decoration:none;">
							 <h2><xsl:value-of select="title" /></h2> 
						</a>
						<p class="news-date"><xsl:value-of select="publishStartDate" /></p> 
						<xsl:if test="subtitle!=''">
							<p><xsl:value-of select="subtitle" /></p>
						</xsl:if>
					</div> 
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<h2>Nenhum resgistro encontrado.</h2> 
			</xsl:otherwise>
		</xsl:choose>
		
		<xsl:apply-templates select="//control[@type='lum_pagination']" />
	</xsl:template>
	
	<xsl:template match="control[@type='lum_pagination']">
		<ul class="page-number">
   			<xsl:for-each select="data/page">
            	<li>
            		<xsl:if test="@currentPage = 'true'">
            			<xsl:attribute name="class">active</xsl:attribute> 
            		</xsl:if>
	            	<a href="{@hrefQSParameter}">
	            		<xsl:value-of select="."/>
            		</a>
            	</li>
   			</xsl:for-each>
		</ul>
	</xsl:template>
</xsl:stylesheet>