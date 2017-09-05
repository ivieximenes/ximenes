<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
		<script>
			$(document).ready(function(){
				var noticiasUrl = "/<xsl:value-of select="/renderData/controls/control/control/control[@id='autoLayout.listlink']/data/href" />";
				$(".smt-breadcrumb-list li:nth-last-child(2) a").attr("href", noticiasUrl);
			});
		</script>
		<section class="smt-section smt-section-news details-highlights">
				<div class="smt-section-wrapper">
					<header class="smt-section-header">
						<div class="smt-header-content">
							<h2 class="smt-section-title">Outros destaques</h2>
						</div>
					</header>
					<div class="smt-section-contents">
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
					</div>
				</div>
			</section>
	</xsl:template>
	
</xsl:stylesheet>