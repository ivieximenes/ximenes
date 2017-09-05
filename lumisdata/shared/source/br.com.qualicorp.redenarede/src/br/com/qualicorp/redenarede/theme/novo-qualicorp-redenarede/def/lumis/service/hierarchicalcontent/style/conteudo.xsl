<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />

	<xsl:template match="/">
		<xsl:for-each select="//data/row">
				<section class="smt-carousel smt-carousel-wrapper">
	                <div class="smt-carousel-items">
	                    <div class="smt-carousel-slide">
	                        <div class="smt-carousel-content">
	                            <h1 class="smt-carousel-title"><xsl:value-of select="title" /></h1>
	                            <p><xsl:value-of select="introduction" /></p>
	                        </div><xsl:text disable-output-escaping="yes"><![CDATA[<!--
						-->]]></xsl:text><img class="smt-carousel-image" src="{image/href}" alt="ilustração de um notebook com imagens iconográficas"/>
	                    </div>
	                </div>
	            </section>
            
			
	            <nav class="smt-breadcrumb">
	                <ul class="smt-breadcrumb-list">
	                    <li>Você está em</li>
	                    <li><a href="/">Home</a></li>
	                    <li><xsl:value-of select="title" /></li>
	                </ul>
	            </nav>
	            
				<xsl:value-of disable-output-escaping="yes" select="linkContent" />
				
		</xsl:for-each>
	</xsl:template>

</xsl:stylesheet>