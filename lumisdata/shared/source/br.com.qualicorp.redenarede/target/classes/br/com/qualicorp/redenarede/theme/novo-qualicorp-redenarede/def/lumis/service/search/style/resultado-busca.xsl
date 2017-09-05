<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">

		<section class="smt-carousel smt-carousel-wrapper">
                <div class="smt-carousel-items">
                    <div class="smt-carousel-slide">
                        <div class="smt-carousel-content">
                            <h1 class="smt-carousel-title">Resultado da busca</h1>
                        </div><xsl:text disable-output-escaping="yes"><![CDATA[<!--
						-->]]></xsl:text><img class="smt-carousel-image" src="img/banner-busca.png" alt="ilustração de um notebook com uma lupa"/>
                    </div>
                </div>
            </section>

            <nav class="smt-breadcrumb">
                <ul class="smt-breadcrumb-list">
                    <li>Você está em</li>
                    <li>Resultado da busca</li>
                </ul>
            </nav>

            <section class="smt-section smt-section-search-result">
                <div class="smt-section-wrapper">

                    <div class="smt-list-result">
                    	<xsl:choose>
							<xsl:when test="//data/row">
								<xsl:for-each select="//data/row">
									<div class="headline" style="padding-left: 0;">
										<a class="smt-result-news-item" href="{url}" style="text-decoration:none;">
					                         <xsl:if test="introductionImageFile">
											 	<img src="{introductionImageFile/href}" class="smt-news-image"/>
											 </xsl:if>
											 <div class="smt-result-text">
					                               <h2 class="smt-news-title"><xsl:value-of select="title" /></h2>
					                               <p><xsl:value-of select="subtitle" /></p>
					                               <span class="smt-news-date"><xsl:value-of select="publishStartDate" /></span>
					                           </div> 
										</a>
									</div> 
								</xsl:for-each>
							</xsl:when>
							<xsl:otherwise>
								<h2>Nenhum registro encontrado.</h2> 
							</xsl:otherwise>
						</xsl:choose>
                        
                        <div class="smt-section-pagination">
                        	<xsl:apply-templates select="//control[@type='lum_pagination']" />
                        </div>

                    </div>

                </div>                   
            </section>
		
		
	</xsl:template>
	
	<xsl:template match="control[@type='lum_pagination']">
		<ul class="smt-news-list-pages">
   			<xsl:for-each select="data/page">
            	<li>
            		<xsl:if test="@currentPage = 'true'">
            			<xsl:attribute name="class">smt-active-page</xsl:attribute> 
            		</xsl:if>
	            	<a href="{@hrefQSParameter}">
	            		<xsl:value-of select="."/>
            		</a>
            	</li>
   			</xsl:for-each>
		</ul>
	</xsl:template>
</xsl:stylesheet>