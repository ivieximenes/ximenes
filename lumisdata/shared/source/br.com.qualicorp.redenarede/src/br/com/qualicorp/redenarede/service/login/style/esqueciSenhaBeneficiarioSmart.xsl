<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	
	<xsl:template match="/">
	
	<section class="smt-carousel smt-carousel-wrapper">
		<div class="smt-carousel-items">
			<div class="smt-carousel-slide">
				<div class="smt-carousel-content">
					<h1 class="smt-carousel-title">Esqueci a senha</h1>
					<p>Para receber uma nova senha no e-mail cadastrado, informe o número da carteirinha ou o CPF e clique em enviar.</p>
				</div><xsl:text disable-output-escaping="yes"><![CDATA[<!--
						-->]]></xsl:text><img class="smt-carousel-image" src="img/banner-03.png" alt="Ilustração de atendente de telecomunicação."/>
			</div>
		</div>
	</section>
	
	<nav class="smt-breadcrumb">
		<ul class="smt-breadcrumb-list">
			<li>Você está em</li>
			<li><a href="/">Home</a></li>
			<li>Esqueci a senha</li>
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
            <form class="smt-form-forgot-password" action="{//control[@type='lum_form']/data/action-commit}" method="post" id="esqueciSenhaForm" accept-charset="UTF-8">
                 <div class="smt-input-holder">
                     <label for="smart-card" class="smt-form-label visuallyhidden">Nº da carteirinha</label>
                     <input class="smt-input matricula-mask" type="text" placeholder="Nº da carteirinha" id="carteirinha" name="carteirinha"/>
                     <input class="smt-input matricula-mask" type="hidden" id="loginEsqueciSenha" name="loginEsqueciSenha"/>
                 </div>
                 <div class="smt-input-holder">
                  <label class="smt-form-label visuallyhidden" for="smart-contact-cpf"></label>
				  <input class="smt-input cpf-mask" type="tel" placeholder="CPF" id="cpfEsqueciSenha" name="cpfEsqueciSenha"/>
                 </div>
                 <div class="smt-input-holder smt-input-actions">
                     <input type="button" id="buttonform" name="op" value="Enviar" class="smt-main-button" onclick="listaCadastrosPorCpf();"/>
                 </div>
             </form>
	
		</div>
	</section>
	
<script type="text/javascript">
	<xsl:text disable-output-escaping="yes">
		<![CDATA[

	function listaCadastrosPorCpf()
	{
		ga('send', 'event', 'botao', 'clique', 'esquecisenha_beneficiario-enviar');
		
		$('#loginEsqueciSenha').val($('#carteirinha').val());
		
		if($('#loginEsqueciSenha').val() == "" && $('#cpfEsqueciSenha').val() == "" )
		{
    		alert('É necessário informar o Número da Carteira ou o CPF.');
	    	return false;
		}
		else if($('#loginEsqueciSenha').val() != "")
		{
			$("#esqueciSenhaForm").submit();
			return false;
		}
		else
		{
			$.get( g_LumisRootPath+"lumis/api/rest/restlogin/lumgetdata/lista.json?cpf=" + $("#cpfEsqueciSenha").val(), function( searchResults ) {
						
				if(searchResults.rows.length < 1)
				{
					$("#esqueciSenhaForm").submit();
			    	
			    	return;
				}
				]]>
				</xsl:text>
				
				if(searchResults.rows.length == 1)
				{
			    	var numero_carteira = searchResults.rows[0].numero_carteira;
			    	
			    	$("#loginEsqueciSenha").val(numero_carteira);
			    	
			    	$("#esqueciSenhaForm").submit();
			    	
			    	$(".smt-warning.error").removeClass('open');
			    	return;
				}
				
				if(searchResults.rows.length > 1){
					alert("Usuário possui mais de um plano na Operadora. A autenticação deverá ser feita pelo número de uma carteirinha.");
					return false;
				}
			}, "json");	
			
			return false;
		}
	}
	<xsl:text disable-output-escaping="yes">
	<![CDATA[
	$(document).ready(function() {
	
		var curForm = $("#esqueciSenhaForm");

		curForm.validate({
			rules: {
				loginEsqueciSenha: {required: true},
				cpfEsqueciSenha: {minlength: 14},
				email: {required: true, email: true},
			},
			errorClass: 'error smt-message-error',
			errorElement: "span",
			messages: {
				loginEsqueciSenha: {required: "Favor preencher o código da carteirinha"},
				cpfEsqueciSenha: {minlength: "O CPF deve ter pelo menos 14 caracteres"},
				email: "Favor preencher com um e-mail válido",
			}, 
			submitHandler: function(form){
				$("#divButton").hide();
				$("#divLoading").show();
				$.ajax({
					type: "POST",
					dataType: "json",
					url: curForm.attr("action"),
					data: curForm.serialize(),
					success: function(data){
						$("#divButton").show();
						$("#divLoading").hide();
						curForm[0].reset();
						
						$("#gamaMsg").val(data.responseParameters.doui_message[0]);
						
						$('#success').val("1");
						$("#formSuccess").submit();
						
						$('.smt-warning.success').addClass('open');
						$(".smt-warning.error").removeClass('open');
					}

				}).fail(function(data){
					try{
						var dataObj = $.parseJSON(data.responseText);
						var errorMessage = dataObj.responseParameters.doui_error;
						if(errorMessage == null)
							errorMessage = dataObj.responseParameters.error.message;
							
						if(errorMessage != null)
						{
							$(".smt-warning.error").text(errorMessage);
						
							console.log(errorMessage);
						}	
					}catch(e){console.log(e);}
					
					$(".smt-warning.error").addClass('open');
					
					$("#divButton").show();
					$("#divLoading").hide();
				});
				return false;
			}
		});
		
		$('.cpf-mask').mask("999.999.999-99");
		$('.matricula-mask').mask("99999.9.999999.99.9");
	});
	
	]]>
</xsl:text>
</script>	

</xsl:template>
	
</xsl:stylesheet>