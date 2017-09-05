<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">

	
<header class="header-blue white"> 
  		<h1>Cadastro - Prestador</h1> 
</header> 
<div id="signUpModal"> 
    <form class="form form-signup" action="{//control[@type='lum_form']/data/action-commit}" method="post" id="registerform" accept-charset="UTF-8"> 
    	
       <p class="all-full success" style="display:none;">Seu cadastro foi processado com sucesso! Clique <a href="{/renderData/controls/control[@id='link']/data/href}">aqui</a> para continuar navegando no portal.</p>
       <p class="all-full global-error error" style="display:none;">Houveram erros na hora de processar seu cadastro.</p>
       <div> 
            <label class="req" for="signUp-prestador-nome">Nome/Nome Fantasia </label> 
            <input type="text" id="nome" name="nome" value="" maxlength="150" class="required" /> 
        </div> 
        <div class="half" style="padding-left: 15px;padding-right: 15px;"> 
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
         <div class="half last">
         	<input type="text" id="cpf_cnpj" name="cpf_cnpj" value="" class="cpf-mask required" maxlength="18" /> 
         </div>
        <div> 
            <label  for="signUp-prestador-razao_social">Razão Social </label> 
            <input type="text" id="razao_social" name="razao_social" value="" maxlength="100" class="form-text" /> 
        </div> 
       	<div class="half"> 
               <label  for="signUp-beneficiario-tel">Telefone</label> 
               <input type="text" id="telefone" name="telefone" value="" maxlength="20" class="telefone-mask" /> 
        </div>  
       	<div>
           <label class="req" for="signUp-prestador-mail">Seu e-mail </label> 
           <input type="text" id="email" name="email" value="" maxlength="100" class="required" /> 
       </div> 
       <div class="half"> 
           <label class="req" for="signUp-prestador-password">Senha</label> 
           <input type="password" id="password" name="password" value="" maxlength="20" class="required" /> 
       </div> 
       <div class="half last"> 
           <label class="req" for="signUp-prestador-confirmpassword">Confirme a senha</label> 
           <input type="password" id="confirmpassword" name="confirmpassword" value="" maxlength="20" class="required" /> 
       </div>
       <div class="inf-senha">
	   		<spam>Atenção: sua senha deve ter entre seis a oito caracteres e conter ao menos um número, uma letra e um caractere especial <![CDATA[(#, @, & ou _).]]></spam>
	   </div> 
		 <input type="hidden" id="user_id" name="user_id" value=""  class="form-text" />
		 <span class="error">* Campos obrigatórios.</span>
       <div id="href_resqueci_senha_prestador" class="smt-input-holder smt-input-actions smt-modal-content" style="display: none">
   	       <a href="{/renderData/controls/control[@id='link_esqueci_senha_prestador']/data/href}" class="smt-form-action">Esqueci minha senha</a>
		</div>
        <div id="divButton">
			<input type="submit" id="buttonform" name="op" value="Enviar" class="button" onclick="ga('send', 'event', 'botao', 'clique', 'cadastro_prestador-enviar');"/> 
		</div>
        <div id="divLoading" style="display:none;" align="center">
			<img src="lumis/portal/client/images/Loading.gif" style="vertical-align: middle;" alt="Carregando"/> Carregando
		</div>  
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
					
					$(".ga_send").focusout(function(){
						ga('send','event', 'Formulario-fale-cadastro-prestador', $(this).attr("name"),$(this).val());
					});
				
					$(document).ready(function(){
					
						$('.smt-modal-close').click(function(){
							$('#divButton').show();
							$('#href_resqueci_senha_prestador').hide();
						});
					
						$('#email').keyup(function() {
							var email = $('#email').val();
							if ( email.substring(0,1)==" " || email.substring(email.length-1)==" ")
						  		$('#email').val($.trim($('#email').val()));
						});
						
						var curForm = $("#registerform");

						curForm.validate({
							rules: {
								nome: {required: true, minlength: 4},
								cpfCnpj: {required: true},
								cpf_cnpj: {required: true, minlength: 14},
								usuario: {required: true},
								email: {required: true, email: true},
								password: {required: true, minlength: 6, maxlength: 8, passwordValidator: true},
							    confirmpassword: {
							      required: true,
							      equalTo: "#password"
							    }
							},
							errorElement: "p",
							messages: {
								nome: {required: "Favor preencher seu nome completo", minlength: "O nome deve ter pelo menos 4 caracteres"},
								cpfCnpj: "Favor selecionar se é um CPF ou CNPJ",
								cpf_cnpj: "Favor preencher com um CPF/CNPJ",
								usuario: "Favor preencher o Usuário",
								email: "Favor preencher com um e-mail válido",
								password: {
									required: "Favor preencher uma senha",
									minlength: "A senha deve ter um mínimo de 6 carateres",
									passwordValidator: "Formato de Senha Inválido"
								},
								confirmpassword: {
									required: "Favor preencher uma confirmação de senha",
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
										$(".success").show();
										$("#divButton").toggle();
										$("#divLoading").toggle();
										curForm[0].reset();
									}

								}).fail(function(data){
									try{
									var dataObj = $.parseJSON(data.responseText)
									var errorMessage = dataObj.responseParameters.doui_error;
									if(errorMessage == null)
										errorMessage = dataObj.responseParameters.error.message;
										
									if(errorMessage != null){
										$(".global-error").text(errorMessage);
										
										if(errorMessage.toString().indexOf("foi previamente cadastrado") !=-1 ){
											$("#divButton").hide();
											$('#href_resqueci_senha_prestador').show();
										}	
									}
									}catch(e){}
										
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