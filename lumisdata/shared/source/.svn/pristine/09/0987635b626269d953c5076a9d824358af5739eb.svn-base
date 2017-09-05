<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	
	<xsl:template match="/">

	
<header class="header-blue white"> 
  		<h1>Esqueci Senha - Prestador</h1>
</header> 
<div id="signUpModal"> 
    <form class="form form-signup" action="{//control[@type='lum_form']/data/action-commit}" method="post" id="registerform" accept-charset="UTF-8"> 
    	
		<p class="all-full success" style="display:none;">Sua solicitação foi processada com sucesso! Você receberá um e-mail com instruções para recuperar a senha.</p>
	    <p class="all-full global-error error" style="display:none;">Ocorreu um erro ao processar sua solicitação.</p>
	    <xsl:apply-templates select="/renderData/controls/control[@id='successHidden']" />
		<div class="half" style="padding-left: 15px;padding-right: 15px;height: 39px;"> 
			<div class="div_inner">  
		         <div class="div_inner_radio">
		            <input style="width: 43%;float: right;" type="radio" id="radioCpf" name="cpfCnpj" value="cpf" onclick="trocaClasse()" checked="true" class="form-text" />
		         </div>
				<div class="div_inner_label">
		            <label class="req" for="radioBeneficiario">CPF</label>
		         </div>   
	         </div>
	         <div class="div_inner">
	         </div>
	         <div class="div_inner">
		         <div class="div_inner_radio">   
		            <input style="width: 43%;float: right;" type="radio" id="radioCnpj" name="cpfCnpj" value="cnpj" onclick="trocaClasse()" />
				</div>
		         <div class="div_inner_label">
		            <label class="req" for="radioPrestador" >CNPJ</label>
		         </div>   
			</div>
		</div> 
		<div class="half"> 
			<input type="text" id="cpf_cnpj" name="cpf_cnpj" value="" class="cpf-mask" maxlength="18" /> 
		</div>
		<div>
		   <label class="req" for="signUp-prestador-mail">Seu e-mail </label> 
		<input type="text" id="email" name="email" value="" maxlength="100" class="required" /> 
		</div> 
		<span class="error">* Campos obrigatórios.</span>
		<div id="divButton">
			<input type="submit" id="buttonform" name="op" value="Enviar" class="button" onclick="ga('send', 'event', 'botao', 'clique', 'esquecisenha_prestador-enviar');"/> 
		</div>
        <div id="divLoading" style="display:none;" align="center">
			<img src="lumis/portal/client/images/Loading.gif" style="vertical-align: middle;" alt="Carregando"/> Carregando
		</div>
    </form> 
    <form id="formSuccess" action="{/renderData/controls/control[@id='link']/data/href}" method="POST">
    	<input type="hidden" id="success" name="success"/> 
   </form>
</div>

		${lum_beforeWrite('<xsl:text disable-output-escaping="yes">&lt;script type="text/javascript" src="lumis/tool/jquery/jquery.js"&gt;&lt;/script&gt;</xsl:text>', 'jquery.js')}
		<script type="text/javascript" src="js/validate/jquery.validate.js"></script>
		<script type="text/javascript" src="js/validate/jquery.maskedinput.min.js"></script>
		<script type="text/javascript">
			<xsl:text disable-output-escaping="yes">
				<![CDATA[
					
					if($('#successHidden').val()==1)
					{
						$(".success").show();
					}
					
					$(document).ready(function(){
					
						$('#email').keyup(function() {
							var email = $('#email').val();
							if ( email.substring(0,1)==" " || email.substring(email.length-1)==" ")
						  		$('#email').val($.trim($('#email').val()));
						});
					
						$('.cpf-mask').mask("999.999.999-99");
						var curForm = $("#registerform");

						curForm.validate({
							rules: {
								cpfCnpj: {required: true},
								cpf_cnpj: {required: true, minlength: 14},
								email: {required: true, email: true},
							},
							errorElement: "p",
							messages: {
								cpfCnpj: "Favor selecionar se é um CPF ou CNPJ",
								cpf_cnpj: "Favor preencher com um CPF/CNPJ",
								email: "Favor preencher com um e-mail válido",
							}, 
							submitHandler: function(form){
								$(".success").hide();
								$(".error").hide();
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
										$('#success').val("1");
										$("#formSuccess").submit();
									}

								}).fail(function(data){
									try{
									var dataObj = $.parseJSON(data.responseText)
									var errorMessage = dataObj.responseParameters.doui_error;
									if(errorMessage == null)
										errorMessage = dataObj.responseParameters.error.message;
										
									if(errorMessage != null)
										$(".global-error").text(errorMessage);
									}catch(e){}
									$(".global-error").show();
									$("#divButton").show();
									$("#divLoading").hide();
								});
								return false;
							}
						});
						
					});
					function trocaClasse() {
						
						
						if ( $("#radioCnpj").is(":checked") )
						{
							$("#cpf_cnpj").mask("99.999.999/9999-99");
						}
						if ( $("#radioCpf").is(":checked") )
						{
							$("#cpf_cnpj").mask("999.999.999-99");
						}
					}	
						
				]]>
			</xsl:text>
		</script>
	</xsl:template>
	
</xsl:stylesheet>