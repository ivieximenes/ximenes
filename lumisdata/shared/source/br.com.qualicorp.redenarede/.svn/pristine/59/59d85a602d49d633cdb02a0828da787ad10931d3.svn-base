<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
	
		<input id="smart-header-menu" data-modal="hide" class="smt-menu-toggle smt-toggler visuallyhidden" type="checkbox"/>
        <label for="smart-header-menu" class="smt-toggler-menu smt-icon-toggler">Menu</label>  
        <ul class="smt-menu">
            <li class="smt-menu-item smt-menu-logo">
               <div class="smt-menu-logo-wrapper">
                   <a href="/" class="smt-logo">
                        <span class="">
                            Smart 
                            <small>Saúde com inteligência</small>
                        </span>
                    </a>
                </div> 
            </li>
        	<xsl:for-each select="//data/row[parentContentId = '']">
	            <li class="smt-menu-item">
	            	<a href="{@href}"  class="smt-menu-link">
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
        	</xsl:for-each>
        </ul>
	</xsl:template>
</xsl:stylesheet>