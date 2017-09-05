<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	
	<xsl:template match="/">
	
	<header class="header-blue white"> 
   		<h1>Alterar Senha - Prestador</h1> 
	</header> 
	<div id="signUpModal"> 
    <form class="form form-signup" action="{//control[@type='lum_form']/data/action-commit}" method="post" id="registerform" accept-charset="UTF-8"> 
            <p class="all-full  success" style="display:none;">Senha alterada com sucesso!</p>
            <p class="all-full  global-error error" style="display:none;">Ocorreu um erro ao processar sua solicitação.</p>
       		<xsl:apply-templates select="/renderData/controls/control[@id='successHidden']" />
			<div class="half" style="padding-left: 15px;padding-right: 15px;"> 
				<div class="div_inner">  
			         <div class="div_inner_radio">
			            <input style="width: 43%;float: right;" type="radio" id="radioCpf" name="cpfCnpj" value="cpf" onclick="trocaClasse()" checked="true" class="form-text" />
			         </div>
					<div class="div_inner_label">
			            <label for="radioBeneficiario">CPF</label>
			         </div>   
		         </div>
		         <div class="div_inner">
		         </div>
		         <div class="div_inner">
			         <div class="div_inner_radio">   
			            <input style="width: 43%;float: right;" type="radio" id="radioCnpj" name="cpfCnpj" value="cnpj" onclick="trocaClasse()" />
					</div>
			         <div class="div_inner_label">
			            <label for="radioPrestador" >CNPJ</label>
			         </div>   
				</div>
			</div>
         	<div class="half last"> 
         		<input type="text" id="cpf_cnpj" name="cpf_cnpj" value="" class="cpf-mask" maxlength="18" /> 
         	</div>
         	<div>
           		<label  for="signUp-prestador-mail">Seu e-mail </label> 
           		<input type="text" id="email" name="email" value="{/renderData/douiContext/userEmail}"  readonly="true" maxlength="100" class="required" /> 
       		</div>
            <div class="half"> 
                <label class="req" for="signUp-beneficiario-password">Senha Atual</label> 
                <input type="password" id="password" name="password" value="" maxlength="8" class="required" /> 
            </div>
            <div>
	             <div class="half"> 
	                <label class="req" for="signUp-beneficiario-newPassword">Nova Senha</label> 
	                <input type="password" id="newPassword" name="newPassword" value="" maxlength="8" class="required" /> 
	            </div> 
	            <div class="half last"> 
	                <label class="req" for="signUp-beneficiario-confirmNewPassword">Confirme a nova senha</label> 
	                <input type="password" id="confirmNewPassword" name="confirmNewPassword" value="" maxlength="8" class=" required" />
	            </div> 
	            <div class="inf-senha">
            		<spam>Atenção: sua senha deve ter entre 6 a 8 caracteres e conter ao menos 1 número, 1 letra e 1 caractere especial <![CDATA[(#, @, & ou _).]]></spam>
            	</div>
            </div>
            <span class="error">* Campos obrigatórios.</span>
        	<div id="divButton">
				<input type="submit" id="buttonform" name="op" value="Enviar" class="button" onclick="ga('send', 'event', 'botao', 'clique', 'alterarsenha_prestador-enviar');"/> 
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
	$.validator.addMethod("passwordValidator",
	    function(value, element) {
	        return this.optional(element) || /((?=.*\d)(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[#@&_]).{6,8})$/.test(value);
   						}, "Formato de Senha Inválido"
	);
	
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
		
		var curForm = $("#registerform");

		curForm.validate({
			rules: {
				cpfCnpj: {required: true},
				cpf_cnpj: {required: true, minlength: 14},
				email: {required: true, email: true},
				password: {required: true},
				newPassword: {required: true, minlength: 6, maxlength: 8, passwordValidator: true},
			    confirmNewPassword: {equalTo: "#newPassword"}
			},
			errorElement: "p",
			messages: {
				cpfCnpj: "Favor selecionar se é um CPF ou CNPJ",
				cpf_cnpj: "Favor preencher com um CPF/CNPJ",
				email: "Favor preencher com um e-mail válido",
				password: "Favor informe a senha atual.",
				newPassword: {
					required: "Favor preencher a nova senha.",
					minlength: "A senha deve ter um mínimo de 6 carateres",
					maxlength: "A senha deve ter um máximo de 8 carateres",
					passwordValidator: "Formato de Senha Inválido."
				},
				confirmNewPassword: {
					required: "Favor confirmar a nova  senha",
					equalTo: "As duas senhas não são iguais."
				}
			}, 
			submitHandler: function(form){
				$(".success").hide();
				$(".error").hide();
				$("#divButton").toggle();
				$("#divLoading").toggle();
				$.ajax({
					type: "POST",
					dataType: "json",
					url: curForm.attr("action"),
					data: curForm.serialize(),
					success: function(data){
						// success handling here
						$("#divButton").toggle();
						$("#divLoading").toggle();
						curForm.validate().resetForm(); 
						curForm[0].reset();
						$('.cpf-mask').mask("999.999.999-99");
						$('.cnpj-mask').mask("99.999.999/9999-99");
						$('#success').val("1");
						$("#formSuccess").submit();
					}

				}).fail(function(data){
					// fail handling here
					if(data.status === 403 || (data.status === 200 && data.getResponseHeader('Content-Type').indexOf('text/html') === 0)) {
						window.location = curForm.attr("action");
						return;
					}
					try{
					var dataObj = $.parseJSON(data.responseText)
					var errorMessage = dataObj.responseParameters.doui_error;
					if(errorMessage == null)
						errorMessage = dataObj.responseParameters.error.message;
						
					if(errorMessage != null)
						$(".global-error").text(errorMessage);
						
						console.log(errorMessage);
					}catch(e){console.log(e);}
						
					$(".global-error").show();
					$("#divButton").toggle();
					$("#divLoading").toggle();	
				});
				return false;
			}
		});
		
		$('.telefone-mask').mask("(99) 9999-9999?9").ready(function (event) {
			var target, phone, element;
			target = (event.currentTarget) ? event.currentTarget : event.srcElement;
			if (!target) return;
			phone = target.value.replace(/\D/g, '');
			element = $(target);
			element.unmask();
			if (phone.length < 11) {
				element.mask("(99) 9999-9999?9");
			} else {
				element.mask("(99) 99999-9999");
			}
		});
		$('.cpf-mask').mask("999.999.999-99");
		$('.cnpj-mask').mask("99.999.999/9999-99");
	});
	function trocaClasse() {
	if ( $("#radioCnpj").is(":checked") )
		{
			$("#cpf_cnpj").removeClass("cpf-mask").addClass("cnpj-mask");
		}
		if ( $("#radioCpf").is(":checked") )
		{
			$("#cpf_cnpj").removeClass("cnpj-mask").addClass("cpf-mask");
		}
		
		$('.cpf-mask').mask("999.999.999-99");
		$('.cnpj-mask').mask("99.999.999/9999-99");
	}
	]]>
</xsl:text>
</script>	

</xsl:template>
	
</xsl:stylesheet>