<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:lum="http://www.lumis.com.br/doui" exclude-result-prefixes="lum" version="1.0">
<!-- $Revision: 13269 $ $Date: 2011-07-27 19:29:14 -0300 (Wed, 27 Jul 2011) $ -->
<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
<xsl:output omit-xml-declaration = "yes" />

	<xsl:template match="/">
		<xsl:for-each select="//data/row">
			<div class="smt-role-item" data-focus-class="true">
                 <input id="smt-role-client" type="radio" name="smt-role-select" class="smt-role-toggler visuallyhidden"/>
                 <label for="smt-role-client" class="smt-role-title"><xsl:value-of select="name" /></label>
                 <div class="smt-role-content">
                     <img class="smt-role-image" alt="Ilustração de um garoto, sorrindo" src="img/cliente.png"/>
                     <p><xsl:value-of select="introduction" /></p>
                     <div class="smt-role-links">
                         <a id="client-signup" class="smt-main-button" href="#" data-remote-modal="#smart-signup">Cadastre-se</a>
                         <a id="client-login" class="smt-secondary-link" href="#" data-remote-modal="#smart-header-login">Fazer login</a>
                     </div>
                 </div>
             </div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>

