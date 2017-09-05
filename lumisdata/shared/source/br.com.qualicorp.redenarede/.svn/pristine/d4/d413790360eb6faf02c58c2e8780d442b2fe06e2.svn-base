<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:lum="http://www.lumis.com.br/doui" exclude-result-prefixes="lum" version="1.0">
	<!-- $Revision: 16544 $ $Date: 2014-10-27 11:16:49 -0200 (Mon, 27 Oct 2014) $ -->
	<xsl:import href="HierarchicalTemplate.xsl" />
	<xsl:output omit-xml-declaration="yes" method="xml" />

	<xsl:template match="control[@id='breadCrumb']">
		<xsl:if test="data/row">
			${lum_beforeWrite('<link type="text/css" rel="stylesheet" href="lumis/service/hierarchicalcontent/stylesheet/breadcrumb.css" />', 'lumis/service/hierarchicalcontent/stylesheet/breadcrumb.css')}
			<ul class="smt-breadcrumb-list">
				<li>Você está em</li>
				<xsl:for-each select="data/row">
					<li>
						<xsl:attribute name="class">
							<xsl:if test="position() = 1"> lum-first</xsl:if>
							<xsl:if test="position() = last()"> lum-last</xsl:if>
						</xsl:attribute>
						<xsl:apply-templates select="." mode="lum_renderItemHref"/>
					</li>
				</xsl:for-each>
			</ul>
		</xsl:if>
	</xsl:template>
	
</xsl:stylesheet>