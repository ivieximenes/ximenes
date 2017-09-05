<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	<xsl:template match="control[@type='lum_div']">
	
		<header class="header-blue white"> 
	  		<h1>Login</h1> 
			<div class="login-inform">
				Se você é <strong>cliente</strong>, utilize somente o número da carteirinha, sem os pontos, para o login.<br/> Se você é <strong>prestador</strong>, utilize seu e-mail para o login.
			</div>
		</header> 
		<div id="signUpModal" style="margin-top: 60px;"> 
			<p class="all-full  error" style="display:none;">Ocorreu um erro ao processar sua solicitação.</p>
			    
			<div class="half"> 
				<label for="signUp-beneficiario-login">Login</label> 
				<input type="text" 		name="login"  id="login"		placeholder="Login" />  
				<xsl:apply-templates select="//control[@id='login']/control"/>
			</div> 
			<div class="half"> 
				<label for="signUp-beneficiario-password">Senha</label> 
				<input type="password" 	name="password" id="password" 	placeholder="Senha" />
				<xsl:apply-templates select="//control[@id='password']/control"/>
			</div> 
			<div class="inf-senha">
           		<spam>Atenção: sua senha deve possuir ao menos 8 caracteres e<br/> conter ao menos 1 número, 1 letra maiúscula, 1 letra<br/> minúscula e 1 caractere especial.</spam>
           	</div>
	        <input type="button" id="buttonform" onclick="fLogin();" name="op" value="Enviar" class="button" style="margin: 0; !important;"/>
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
			
		    function fLogin()
		    {  
				
		     	if($("#login").val() == "")
		     	{
		      		alert('Favor preencher o Login.');
		      		return false;
		     	}
		     	if($("#password").val() == "")
		     	{
		      		alert('Favor preencher a Senha.');
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