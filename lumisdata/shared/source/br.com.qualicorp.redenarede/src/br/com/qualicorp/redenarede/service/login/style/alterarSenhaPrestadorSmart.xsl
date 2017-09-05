<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	
	<xsl:template match="/">
	<input id="smart-header-logged" class="visuallyhidden smt-toggler" type="checkbox"/>
    <label for="smart-header-logged" class="smt-toggler-logged smt-icon-toggler">Menu Logado</label>
    <nav class="smt-drop-menu">
        <ul>
            <li>
                <input id="smart-header-change-password" data-modal="hide" class="visuallyhidden smt-toggler smt-modal-toggler" type="checkbox"/>
                <label for="smart-header-change-password" class="smt-toggler-change-password smt-icon-toggler">Alterar senha</label>
                <div class="smt-modal-change-password smt-modal">
                    <div class="smt-modal-backdrop">
                        <div class="smt-modal-wrapper">
                            <a class="smt-modal-close" href="#">Fechar modal</a>
                            <article class="smt-modal-popup">
                                <header class="smt-modal-header">
                                    <h3 class="smt-modal-title">Alterar Senha</h3>
                                </header>
                                <div class="smt-modal-body">
                                    <div class="smt-modal-content">
                                    	<form class="smt-change-password" action="{//control[@type='lum_form']/data/action-commit}" method="post" id="registerform" accept-charset="UTF-8">
                                            <div class="smt-input-holder">
                                            
                                                <input class="smt-checkbox visuallyhidden required" type="radio" id="smart-provider-select-cpf" name="cpfCnpj" value="cpf" onclick="trocaClasse()" checked="true" />                                            
												<label class="smt-form-label smt-label-checkbox" for="smart-provider-select-cpf">CPF</label>
												<input class="smt-checkbox visuallyhidden required" type="radio" id="smart-provider-select-cnpj" name="cpfCnpj" value="cnpj" onclick="trocaClasse()" /> 
												<label class="smt-form-label smt-label-checkbox" for="smart-provider-select-cnpj">CNPJ</label>
                                                <input class="smt-input required" name="provider-signup-cpf" type="tel" placeholder="CPF"/>
                                                <input class="smt-input required" name="provider-signup-cnpj" type="tel" placeholder="CNPJ"/>
                                            </div>
                                            <div class="smt-input-holder">
                                                <label for="smart-email" class="smt-form-label visuallyhidden">Seu e-mail</label>
                                                <input type="text" id="email" name="email" value="{/renderData/douiContext/userEmail}" placeholder="Seu e-mail" readonly="true" maxlength="100" class="smt-input required" />
                                                <label for="smart-email" class="smt-label-warn"></label>
                                            </div>
                                            <div class="smt-input-holder">
                                                <label for="smart-password" class="smt-form-label visuallyhidden">Senha atual</label>
                                                <input type="password" id="password" name="password" value="" maxlength="8" class="smt-input required" placeholder="Senha atual"/> 
                                                <label for="smart-password" class="smt-label-warn"></label>
                                            </div>
                                            <div class="smt-input-holder">
                                                <label for="smart-password" class="smt-form-label visuallyhidden">Nova senha</label>
                                                <input type="password" id="newPassword" name="newPassword" value="" maxlength="8" class="smt-input required" placeholder="Nova senha"/>
                                            </div>
                                            <div class="smt-input-holder">
                                                <label for="smart-password" class="smt-form-label visuallyhidden">Confirme a nova senha</label>
                                                <input type="password" id="confirmNewPassword" name="confirmNewPassword" value="" maxlength="8" class="smt-input required" placeholder="Confirmar nova senha"/>
                                            </div>
                                            <label for="smart-password" class="smt-label-warn">Atenção: sua senha deve possuir entre 8 e 11 caracteres e conter ao menos 1 número, 1 letra maiúscula, 1 letra minúscula e 1 caractere especial (Ex.: #, @, &amp; ou _).</label>
                                            <div class="smt-input-holder smt-input-actions">
                                                <button type="submit" name="op" value="Enviar" class="smt-main-button" onclick="ga('send', 'event', 'botao', 'clique', 'alterarsenha_prestador-enviar');">Enviar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <a href="#" id="buttonform" class="smt-logged-logout">Sair</a>
            </li>
        </ul>
    </nav>
			
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
			errorClass: 'error smt-message-error',
			errorElement: "span",
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
				$(".smt-main-button").addClass("loading");
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
						$(".smt-main-button").removeClass("loading");
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
					}catch(e){console.log(e);$(".smt-main-button").removeClass("loading");}
						
					$(".global-error").show();
					$(".smt-main-button").removeClass("loading");
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
	if ( $("#smart-provider-select-cnpj").is(":checked") )
		{
			$("#cpf_cnpj").removeClass("cpf-mask").addClass("cnpj-mask");
		}
		if ( $("#smart-provider-select-cpf").is(":checked") )
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