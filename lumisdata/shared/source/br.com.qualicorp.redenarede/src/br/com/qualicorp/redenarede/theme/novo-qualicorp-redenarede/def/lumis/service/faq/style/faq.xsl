<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">

		<header class="header-blue white">
			<h1>Perguntas Frequentes</h1>
		</header>
		<xsl:for-each select="//data/row">
			<div class="faq">
				<div class="question"><xsl:value-of select="question" /></div>
				<div class="answer"><xsl:value-of disable-output-escaping="yes" select="answer" /></div>
			</div>
		</xsl:for-each>
		${lum_beforeWrite('<xsl:text disable-output-escaping="yes">&lt;script type="text/javascript" src="lumis/tool/jquery/jquery.js"&gt;&lt;/script&gt;</xsl:text>', 'jquery.js')}
		<script type="text/javascript">
			$(function(){
				$('.question').click(function(){
					if ($(this).hasClass('active')){
						$(this).removeClass('active');
					} else {
						$('.question').removeClass('active');
						$(this).addClass('active');
					}
				});
			});
		</script>
	</xsl:template>
	
</xsl:stylesheet>