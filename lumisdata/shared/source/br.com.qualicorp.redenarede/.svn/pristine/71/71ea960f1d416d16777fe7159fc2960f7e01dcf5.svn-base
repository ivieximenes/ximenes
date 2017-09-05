<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
		
		<section class="smt-carousel smt-carousel-wrapper">
            <div class="smt-carousel-items">
                <div class="smt-carousel-slide">
                    <div class="smt-carousel-content">
                        <h1 class="smt-carousel-title">Saúde e bem-estar</h1>
						<a class="smt-main-button" href="noticias\" tabindex="0">Voltar para a lista de notícias</a>
                    </div><xsl:text disable-output-escaping="yes"><![CDATA[<!--
						-->]]></xsl:text><img class="smt-carousel-image" src="img/banner-faz-bem.png" alt="ilustração de um notebook com imagens iconográficas"/>
                </div>
            </div>
        </section>
            
        <nav class="smt-breadcrumb">
            <ul class="smt-breadcrumb-list">
                <li>Você está em</li>
                <li><a href="/">Home</a></li>
                <li><a href="noticias\">Saúde e bem-estar</a></li>
                <li><a href="#"><xsl:value-of select="title" /></a></li>
            </ul>
        </nav>
		<xsl:for-each select="//data/row">
	        <article class="smt-news-detail">
				<header class="smt-news-detail-header">
					<div class="smt-news-header-wrapper">
						<div class="smt-header-content">
							<h2 class="smt-section-title"><xsl:value-of select="title" /></h2>
							<time class="smt-news-date"><xsl:value-of select="publishStartDate/dayOfMonth" />/<xsl:value-of select="publishStartDate/month" />/<xsl:value-of select="publishStartDate/year" /></time>
							<p><xsl:value-of select="introduction" /></p>
						</div>
					</div>
				</header>
				<div class="smt-section-contents">
					<section class="smt-news-detail-section">
						<xsl:value-of disable-output-escaping="yes" select="content" />
					</section>
				</div>
			</article>
		</xsl:for-each>
	</xsl:template>
	
</xsl:stylesheet>