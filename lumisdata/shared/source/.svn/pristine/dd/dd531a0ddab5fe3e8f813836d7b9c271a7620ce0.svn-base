<?xml version="1.0" encoding="UTF-8" ?>
<!-- $Revision: 15458 $ $Date: 2013-06-10 19:03:05 -0300 (Mon, 10 Jun 2013) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
<xsl:output omit-xml-declaration = "yes" />
	
	<xsl:template match="control[@type='lum_interfaceHeader']">
		<header class="lum-header">
			<h1 class="lum-interface-title">
				<xsl:value-of select="data/patterns/administrationTitle"/>
			</h1>
		</header>
	</xsl:template>
	
	<xsl:template match="control[@type='lum_details']">

		<xsl:for-each select="data/row">
		
			<div class="lum-content-body">
			
				<div class="lum-field lum-field-id-value">
					<div class="lum-field-label"><span class="lum-label"><xsl:value-of select="labelId"/></span></div>
					<div class="lum-field-value"><xsl:value-of select="itemId"/></div>
				</div>
			
				<div class="lum-field lum-field-id-value">
					<div class="lum-field-label"><span class="lum-label">Nome do Serviço</span></div>
					<div class="lum-field-value"><xsl:value-of select="serviceName"/></div>
				</div>
				
				<div class="lum-field lum-field-id-value">
					<div class="lum-field-label"><span class="lum-label">Instância do Serviço</span></div>
					<div class="lum-field-value"><xsl:value-of select="instanceName"/></div>
				</div>
				
				<div class="lum-field lum-field-id-value">
					<xsl:variable name="operation" select="operation"/>
					
					<xsl:choose>
						<xsl:when test="$operation = 'Adicionar'">
							<div class="lum-field-label"><span class="lum-label">Incluído por</span></div>
						</xsl:when>
						<xsl:when test="$operation = 'Editar'">
							<div class="lum-field-label"><span class="lum-label">Alterado por</span></div>
						</xsl:when>
						<xsl:otherwise>
							<div class="lum-field-label"><span class="lum-label">Excluído por</span></div>
						</xsl:otherwise>
					</xsl:choose>
					
					<div class="lum-field-value"><xsl:value-of select="login"/></div>
				</div>

				<div class="lum-field lum-field-id-value">
					<div class="lum-field-label"><span class="lum-label">Operação</span></div>
					<div class="lum-field-value"><xsl:value-of select="operation"/></div>
				</div>
				
				<xsl:if test="customMessage != ''">
					<div class="lum-field lum-field-id-value">
						<div class="lum-field-label"><span class="lum-label">Mensagem</span></div>
						<div class="lum-field-value"><xsl:value-of select="customMessage"/></div>
					</div>
				</xsl:if>
				
				<h1 class="lum-interface-title" style="margin: 20px 0 10px 0;">Conteúdo</h1>
				
				<xsl:value-of select="content" disable-output-escaping="yes"/>
	
			</div>
		
		</xsl:for-each>

	</xsl:template>
	
	
</xsl:stylesheet>