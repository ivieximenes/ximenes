<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	<xsl:template match="control[@type='lum_div']">
	
		<header class="header-blue white">
	  		<h1>Login</h1> 
		</header> 
		<div id="signUpModal"> 
			<p class="all-full  error" style="display:none;">Ocorreu um erro ao processar sua solicitação.</p>
			    
			<div class="half"> 
				<label for="signUp-beneficiario-login">E-mail</label> 
				<input type="text" 		name="login"  id="login"		placeholder="E-mail" />  
				<xsl:apply-templates select="//control[@id='login']/control"/>
			</div> 
			<div class="half"> 
				<label for="signUp-beneficiario-password">Senha</label> 
				<input type="password" 	name="password" id="password"	placeholder="Senha" />
				<xsl:apply-templates select="//control[@id='password']/control"/>
			</div> 
			<div class="inf-senha">
           		<spam>Atenção: sua senha possui entre 6 a 8 caracteres e contêm ao<br/> menos 1 número, 1 letra e 1 caractere especial <![CDATA[(#, @, & ou _).]]></spam>
           	</div>
	        <input type="button" id="buttonform" onclick="fLogin();" name="op" value="Enviar" class="button" style="margin: 0; !important;"/>
	        
			<div class="half">
			  <a class="login_esqueci_senha"  href="{/renderData/controls/control[@id='link_esqueci_senha_prestador']/data/href}">esqueci a senha</a>
			</div>
		</div>
		<script type="text/javascript">  
		
			$("#login").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLogin();
			    }
			});
			
			$("#password").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLogin();
			    }
			});
			
			$('#login').keyup(function() {
				var email = $('#login').val();
				if ( email.substring(0,1)==" " || email.substring(email.length-1)==" ")
			  		$('#login').val($.trim($('#login').val()));
			});
			
			function isEmail(email) {
			  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			  return regex.test(email);
			}
						
		    function fLogin()
		    {  
				
		     	if($("#login").val() == "")
		     	{
		      		alert('Favor preencher o E-mail.');
		      		return false;
		     	}  
		     	else if($("#password").val() == "")
		     	{
		      		alert('Favor preencher a Senha.');
		      		return false;
		     	}  
		     	else if(!isEmail($("#login").val()))
	     		{
		      		alert('Formato de E-mail inválido.');
		      		return false;
	     		}
	     		else
		     	{
	     			<xsl:value-of select="//control[@id='submitLogin']/data/onclick"/>
		     	}
		    }   
		</script>
	</xsl:template>
</xsl:stylesheet>