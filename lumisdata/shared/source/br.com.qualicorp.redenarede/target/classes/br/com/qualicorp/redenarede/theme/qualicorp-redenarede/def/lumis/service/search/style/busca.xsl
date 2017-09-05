<!-- $Revision: 17416 $ $Date: 2015-06-18 15:44:53 -0300 (Thu, 18 Jun 2015) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	<xsl:output omit-xml-declaration = "yes" />
	<xsl:variable name="searchControlId" select="'simplequery'" />

	<xsl:template name="lum_formBodyControls">
		<xsl:apply-templates select="control[@type!='lum_interfaceHeader']" />
	</xsl:template>

	<xsl:template match="control[@type='lum_div']">	
		<div style="display:none;"> <xsl:apply-templates select="control[@type='lum_inputText']" /></div>
		<input type="text" id="inputBuscaFiltro"/>
		<xsl:apply-templates select="control[@type='lum_buttonList']" />
		
		

	 <script type="text/javascript">  
		   $("#inputBuscaFiltro").keypress(function (e) {
		   	  //Google Analytics
		   	  ga('send', 'event', 'botao', 'clique', 'busca_rede-pesquisar');
		   	  
			  if (e.which == 13) {
			   $("#btBusca").click();
			    return false;
			  }
			});
		</script>
	</xsl:template>
	
	<xsl:template match="control[@type='lum_button']" name="lum_button">
		<xsl:variable name="buttonId"><xsl:call-template name="lum_getControlNamespace"><xsl:with-param name="controlId" select="@id" /></xsl:call-template></xsl:variable>
		<xsl:variable name="buttonName" select="data/name" />
		<xsl:variable name="buttonHref" select="data/href" />
		<xsl:variable name="buttonOnclick" select="data/onclick" />
		<xsl:variable name="buttonStyle" select="@style" />
		<xsl:variable name="isPrimary" select="@isPrimary" />
		<a href="#" id="btBusca">
			<xsl:if test="$buttonStyle!=''">
				<xsl:attribute name="style">
					<xsl:value-of select="$buttonStyle" />
				</xsl:attribute>
			</xsl:if>
			<xsl:attribute name="class">lum-button<xsl:if test="$isPrimary='true'"> lum-button-primary</xsl:if></xsl:attribute>
			<xsl:if test="$buttonHref!=''">
				<xsl:attribute name="href">
					<xsl:value-of select="$buttonHref" />
				</xsl:attribute>
			</xsl:if>
			<xsl:if test="$buttonOnclick!=''">
				<xsl:attribute name="onclick">
					$("#simplequery").val($("#inputBuscaFiltro").val());<xsl:value-of select="$buttonOnclick" />
				</xsl:attribute>
			</xsl:if>
		</a>
		
	</xsl:template>
	
<xsl:template name="lum_formHeaderProcessActionControls">
	<input type="hidden" name="lumA" value="1" />
	<input type="hidden" name="doui_processActionId" value="doSearch" />
</xsl:template>
</xsl:stylesheet>