<?xml version="1.0" encoding="ISO-8859-1" ?>
<!-- $Revision: 15927 $ $Date: 2013-10-14 19:22:55 -0300 (Mon, 14 Oct 2013) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
<xsl:output omit-xml-declaration = "yes" />

	<xsl:template name="lum_formBodyControls">
		<!-- <div class="login logged">
			<p style="float: right;margin-right: 28px;">Olá, <span id="{@id}.userName" class="lum-user"></span> | <a href="javascript:;" onclick="ga('send', 'event', 'botao', 'clique', 'header_cliente-sair'); {//control[@id='submitLogout']/data/onclick}">sair</a></p>
		</div> -->
		<script type="text/javascript">
			<!-- var userName = LumisPortal.getCookie('lumUserName'); 
			if (userName != null <xsl:text disable-output-escaping="yes">&amp;</xsl:text><xsl:text disable-output-escaping="yes">&amp;</xsl:text> userName !== 'Guest') 
			{ 
				var spanElem = document.getElementById('<xsl:value-of select="@id"/>.userName'); 
				if (spanElem.innerText != undefined) 
					spanElem.innerText = userName; 
				else spanElem.textContent = userName;
				 
			}
			else 
			{
				window.location.href = window.location.href;
			} -->
			
			function logout() {
				ga('send', 'event', 'botao', 'clique', 'header_cliente-sair');
				<xsl:value-of select="//control[@id='submitLogout']/data/onclick"/>
			}
			
			$(document).ready(function(){
				$("#buttonform").attr("onclick", "logout();")
				$('body').attr('data-user-name', LumisPortal.getCookie('lumUserName'));
			});
		</script>
	</xsl:template>

</xsl:stylesheet>
