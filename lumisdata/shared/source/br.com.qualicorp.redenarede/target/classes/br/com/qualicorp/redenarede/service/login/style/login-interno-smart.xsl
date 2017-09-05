<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	<xsl:template match="control[@type='lum_div']">
	
	
		<section class="smt-carousel smt-carousel-wrapper">
			<div class="smt-carousel-items">
				<div class="smt-carousel-slide">
					<div class="smt-carousel-content">
						<h1 class="smt-carousel-title">Login</h1>
					</div><!--
					--><img class="smt-carousel-image" src="img/banner-03.png" alt="Ilustração de atendente de telecomunicação."/>
				</div>
			</div>
		</section>
		
		<nav class="smt-breadcrumb">
			<ul class="smt-breadcrumb-list">
				<li>Você está em</li>
				<li><a href="#">Home</a></li>
				<li>Login</li>
			</ul>
		</nav>
		
		<section class="smt-section smt-section-forgot-password">
			<div class="smt-section-wrapper">
				<div class="smt-warning success">
		               <p>Sua solicitação foi processada com sucesso! Você receberá um e-mail com instruções para recuperar a senha.</p>
		           </div>
		           <div class="smt-warning error">
		               <p>Ocorreu um erro ao processar sua solicitação.</p>
		           </div>
		           <div class="smt-form-forgot-password">
		                <div class="smt-input-holder">
					        <label for="smart-nome-prestador" class="smt-form-label visuallyhidden">Login</label>
					        <input class="smt-input required" type="text" name="login" id="loginInterno" placeholder="Login"/>
					        <xsl:apply-templates select="//control[@id='login']/control"/>
					    </div>
					    <div class="smt-input-holder">
					        <label for="smart-password" class="smt-form-label visuallyhidden"></label>
							<input class="smt-input" type="password" name="password" id="passwordInterno" placeholder="Senha" />
							<xsl:apply-templates select="//control[@id='password']/control"/>
					    </div>
		                <div class="smt-input-holder smt-input-actions">
		                    <input type="button" id="buttonform" onclick="fLoginInterno();" name="op" value="Enviar" class="smt-main-button" style="margin: 0; !important;"/>
		                </div>
		            </div>
			</div>
		</section>
		
		<script type="text/javascript">  
		
			$("#loginInterno").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLoginInterno();
			    }
			});
			
			$("#passwordInterno").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLoginInterno();
			    }
			});
			
		    function fLoginInterno()
		    {  
				
		     	if($("#loginInterno").val() == "")
		     	{
		      		alert('Favor preencher o Login.');
		      		return false;
		     	}
		     	if($("#passwordInterno").val() == "")
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