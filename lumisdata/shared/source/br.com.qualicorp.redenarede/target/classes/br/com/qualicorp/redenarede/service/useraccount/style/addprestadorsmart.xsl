<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
	<p class="successMsgPrestador" style="display:none;">
    	Seu cadastro foi processado com sucesso! Clique <a href="#" data-remote-modal="#smart-header-login">aqui</a> para continuar navegando no portal.
    </p>
	<form class="smt-hidden-form smt-provider-signup" action="{//control[@type='lum_form']/data/action-commit}" method="post" id="registerformprestador" accept-charset="UTF-8"> 
	    <div class="smt-input-holder">
	        <label for="smart-nome-prestador" class="smt-form-label visuallyhidden">Nome/Nome Fantasia</label>
	        <input class="smt-input required" type="text" placeholder="Nome/Nome Fantasia" id="nome" name="nome"/>
	    </div>
	    <div class="smt-input-holder">
	        <input class="smt-checkbox visuallyhidden" type="radio" name="smart-signup-profile" id="smart-provider-select-cpf"/>
            <label class="smt-form-label smt-label-checkbox" for="smart-provider-select-cpf">CPF</label> 
            <input class="smt-checkbox visuallyhidden" checked="true" type="radio" name="smart-signup-profile" id="smart-provider-select-cnpj"/>
            <label class="smt-form-label smt-label-checkbox" for="smart-provider-select-cnpj">CNPJ</label>
            <input class="smt-input required" name="provider-signup-cpf" type="tel" placeholder="CPF"/>
            <input class="smt-input required" name="provider-signup-cnpj" type="tel" placeholder="CNPJ"/>      
	    </div>
	    <div class="smt-input-holder">
	        <label for="smart-nome-prestador" class="smt-form-label visuallyhidden">E-mail</label>
	        <input class="smt-input required" type="email" placeholder="E-mail" id="email" name="email"/>
	    </div>
	    <div class="smt-input-holder">
	        <label for="smart-nome-prestador" class="smt-form-label visuallyhidden">Razão social</label>
	        <input class="smt-input" type="text" placeholder="Razão social" id="razao_social" name="razao_social"/>
	    </div>
	    <div class="smt-input-holder">
	        <label for="smart-nome-prestador" class="smt-form-label visuallyhidden">Telefone</label>
	        <input class="smt-input" type="tel" placeholder="Telefone" id="telefone" name="telefone"/>
	    </div>
	    <div class="smt-input-holder">
	        <label for="smart-password" class="smt-form-label visuallyhidden">Senha</label>
	        <input class="smt-input required" type="password" placeholder="Senha" id="passwordprestador" name="passwordprestador" maxlength="20"/>
	    </div>
	    <div class="smt-input-holder">
	        <label for="smart-password" class="smt-form-label visuallyhidden">Confirme a senha</label>
	        <input class="smt-input required" type="password" placeholder="Confirme a senha" id="confirmpasswordprestador" name="confirmpasswordprestador" maxlength="8"/>
	    </div>
	    <label for="smart-password" class="smt-label-warn">Atenção: sua senha possui entre 6 e 8 caracteres e contêm ao menos 1 número, 1 letra e 1 caractere especial (#, @, &amp; ou _).</label>
	    
       	<div id="href_resqueci_senha_prestador" class="smt-input-holder smt-input-actions smt-modal-content" style="display: none">
   	       <a href="{/renderData/controls/control[@id='link_esqueci_senha_prestador']/data/href}" class="smt-form-action">Esqueci minha senha</a>
		</div> 
	    <div id="divButton" class="smt-input-holder smt-input-actions">
	        <button type="submit" id="buttonform" name="op" value="Enviar" class="smt-main-button" onclick="ga('send', 'event', 'botao', 'clique', 'cadastro_prestador-enviar');">Enviar</button>
	    </div>
	</form>
	
    
		<script type="text/javascript">
			<xsl:text disable-output-escaping="yes">
				<![CDATA[
					$.validator.addMethod("passwordValidatorPrestador",
					    function(value, element) {
					        return this.optional(element) || /((?=.*\d)(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[#@&_]).{6,8})$/.test(value);
				   						}, "Formato de Senha Inválido"
					);
					
					$(".ga_send").focusout(function(){
						ga('send','event', 'Formulario-fale-cadastro-prestador', $(this).attr("name"),$(this).val());
					});
				
					$(document).ready(function(){ 
					
						$('.smt-modal-close').click(function(){
							$('#divButton').show();
							$('#href_resqueci_senha_prestador').hide();
						});  
					
						$('input[name="cpfcnpj"]').on('click change', function(e) {
						
						    if($('input[name="cpfcnpj"]:checked').val()=="cpf")
						    	$('#cpf_cnpj').attr('placeholder','CPF');
						    else	
						    	$('#cpf_cnpj').attr('placeholder','CNPJ');
						});
					
						$('#email').keyup(function() {
							var email = $('#email').val();
							if ( email.substring(0,1)==" " || email.substring(email.length-1)==" ")
						  		$('#email').val($.trim($('#email').val()));
						});
						
						var curForm = $("#registerformprestador");

						curForm.validate({
							rules: {
								nome: {required: true, minlength: 4},
								cpfCnpj: {required: true},
								cpf_cnpj: {required: true, minlength: 14},
								usuario: {required: true},
								email: {required: true, email: true},
								passwordprestador: {required: true, minlength: 6, maxlength: 8, passwordValidatorPrestador: true},
							    confirmpasswordprestador: {
							      required: true,
							      equalTo: "#passwordprestador"
							    }
							},
							errorClass: 'error smt-message-error',
							errorElement: "span",
							messages: {
								nome: {required: "Favor preencher seu nome completo", minlength: "O nome deve ter pelo menos 4 caracteres"},
								cpfCnpj: "Favor selecionar se é um CPF ou CNPJ",
								cpf_cnpj: "Favor preencher com um CPF/CNPJ",
								usuario: "Favor preencher o Usuário",
								email: "Favor preencher com um e-mail válido",
								passwordprestador: {
									required: "Favor preencher uma senha",
									minlength: "A senha deve ter um mínimo de 6 carateres",
									passwordValidatorPrestador: "Formato de Senha Inválido"
								},
								confirmpasswordprestador: {
									required: "Favor preencher uma confirmação de senha",
									equalTo: "As duas senhas não são iguais."
								}
							}, 
							submitHandler: function(form){
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
										curForm[0].reset();
										
										$('.successMsgPrestador').show();
										$('.smt-warning.success').html($('.successMsgPrestador'));
										
										$(".smt-main-button").removeClass("loading");
										$('.smt-warning.success').addClass('open');
									}

								}).fail(function(data){
									try{
									var dataObj = $.parseJSON(data.responseText)
									var errorMessage = dataObj.responseParameters.doui_error;
									if(errorMessage == null)
										errorMessage = dataObj.responseParameters.error.message;
										
									if(errorMessage != null){
										$(".smt-warning.error").text(errorMessage);
										
										if(errorMessage.toString().indexOf("foi previamente cadastrado") !=-1 ){
											$("#divButton").hide();
											$('#href_resqueci_senha_prestador').show();
										}
									}
								}
								catch(e){console.log(e);}
									
								$(".smt-warning.error").addClass('open');
								
								
									$(".smt-main-button").removeClass("loading");
								});
								$(".smt-main-button").removeClass("loading");
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