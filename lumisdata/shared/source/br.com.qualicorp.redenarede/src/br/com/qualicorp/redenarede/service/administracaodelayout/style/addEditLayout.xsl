<?xml version="1.0" encoding="UTF-8" ?>
<!-- $Revision: 4073 $ $Date: 2006-08-24 11:46:28 -0300 (Thu, 24 Aug 2006) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	<xsl:output omit-xml-declaration = "yes" />
	<xsl:template match="/">
		<xsl:apply-imports />
		${lum_beforeWrite('<xsl:text disable-output-escaping="yes">&lt;script type="text/javascript" src="lumis-theme/br/com/qualicorp/redenarede/theme/qualicorp-redenarede/js/jscolor/jscolor.js"&gt;&lt;/script&gt;</xsl:text>', 'jscolor.js')}
	</xsl:template>
</xsl:stylesheet>