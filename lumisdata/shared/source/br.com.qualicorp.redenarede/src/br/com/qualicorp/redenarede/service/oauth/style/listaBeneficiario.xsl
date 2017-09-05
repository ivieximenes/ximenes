<!-- $Revision: 15843 $ $Date: 2013-09-05 19:41:54 -0300 (Thu, 05 Sep 2013) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
<xsl:output omit-xml-declaration="yes" method="xml" />

	<xsl:template match="control[@type='lum_pagination']">
	</xsl:template>

<xsl:template match="control[@type='lum_tabularData']">
	
	<script type="text/javascript">
		function redirect(url, integracao)
		{
			var userSessionId = LumisPortal.getCookie('lumUserSessionId');
			var popupUrl = url;

			if( integracao== "BOA_CONSULTA" )
			{
				if (url.indexOf("?") == -1)
				{
					popupUrl = url + "?lum_token="+ userSessionId;
				}
				else
				{
					popupUrl = url + "<![CDATA[&]]>" + "lum_token="+ userSessionId;
				}
		 	}
		
			window.open(popupUrl, 0, '');
		}
	</script>
	
	<ul class="list"> 
	<xsl:for-each select="data/row">
    	<li><h5><xsl:value-of select="titulo" /></h5><a href="javascript:void(0)" onclick="redirect('{url}', '{integracao}')" class="external-link"><xsl:value-of select="url" /></a> <p><xsl:value-of select="introduction" /></p> </li> 
	</xsl:for-each>
	</ul>
</xsl:template>
	
</xsl:stylesheet>
