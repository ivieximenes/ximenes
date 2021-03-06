<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
					<section class="smt-carousel smt-carousel-wrapper">
                <div class="smt-carousel-items">
                    <div class="smt-carousel-slide">
                        <div class="smt-carousel-content">
                            <h1 class="smt-carousel-title">Saúde e bem-estar</h1>
                            <p>Conteúdos para você ter mais qualidade de vida</p>
                        </div><xsl:text disable-output-escaping="yes"><![CDATA[<!--
						-->]]></xsl:text><img class="smt-carousel-image" src="img/banner-faz-bem.png" alt="ilustração de um notebook com imagens iconográficas"/>
                    </div>
                </div>
            </section>

            <nav class="smt-breadcrumb">
                <ul class="smt-breadcrumb-list">
                    <li>Você está em</li>
                    <li><a href="/">Home</a></li>
                    <li><a href="#">Saúde e bem-estar</a></li>
                </ul>
            </nav>

            <section class="smt-section smt-section-news">
                <div class="smt-section-wrapper smt-news-list-wrapper">
                    <div class="smt-section-contents">
                    	<xsl:choose>
							<xsl:when test="//data/row">
								<ul class="smt-news-list-items">
									<xsl:for-each select="//data/row">
										 <li class="smt-news-slide">
			                                <a class="smt-link-block" href="{@href}">
			                                    <h3 class="smt-news-title"><xsl:value-of select="title" /></h3>
			                                    <xsl:if test="introduction!=''">
													<p class="smt-news-introduction"><xsl:value-of select="introduction" /></p>
												</xsl:if>
			                                </a>
			                            </li>
									</xsl:for-each>
								</ul>	
							</xsl:when>
						</xsl:choose>		
                        
						<xsl:apply-templates select="//control[@type='lum_pagination']" />
                                                   
                    </div> 
				</div>                   
            </section>
		
	</xsl:template>
	<xsl:template match="control[@type='lum_pagination']">
		<div class="smt-section-pagination">
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
		</div>
	</xsl:template>
</xsl:stylesheet>