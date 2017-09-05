<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
	
	<form class="smt-hidden-form smt-client-signup" action="{//control[@type='lum_form']/data/action-commit}" method="post" id="registerformbeneficiario" accept-charset="UTF-8">
	    <div class="smt-client-warning">
			Olá! Para realizar o cadastro, você precisará do número da sua carteirinha.<br/>Caso ainda não tenha este número, ligue para:<br/><strong>3004 4633</strong> - Capitais e regiões metropolitanas ou<br/><strong>0800 779 9005</strong>                                            - Demais regiões.
			<a href="#" class="smt-close-warning">Fechar</a>
			<script>
				$('.smt-close-warning').click(function() {
					$(this).parent().addClass('closed');
					$(this).parent().hide();
				})
			</script>
		</div> 
		<div class="smt-input-holder">
	         <label for="smart-cpf" class="smt-form-label visuallyhidden">CPF</label>
	         <input class="smt-input cpf-mask" type="tel" placeholder="CPF" id="cpfbeneficiario" name="cpfbeneficiario"/>
	         <label for="smart-carteirinha-cliente" class="smt-label-warn">Menores de 18 anos que não possuem CPF não precisam preencher este campo.</label>
	     </div>
	     <div class="smt-input-holder">
	         <label for="smart-mother-name" class="smt-form-label visuallyhidden">Nome da mãe</label>
	         <input class="smt-input required" type="text" placeholder="Nome da mãe" id="nome_mae" name="nome_mae"/>
	     </div>
	     <div class="smt-input-holder">
	         <label for="smart-card" class="smt-form-label visuallyhidden">Nº da carteirinha</label>
	         <input class="smt-input required matricula-mask" type="text" placeholder="Nº da carteirinha" id="numero_carteira" name="numero_carteira"/>
	     </div>
	     <div class="smt-input-holder">
	         <label for="smart-date" class="smt-form-label visuallyhidden">Data de nascimento</label>
	         <input class="smt-input required dataNascimento" type="text" placeholder="Data de nascimento" id="data_nascimento_str" name="data_nascimento_str"/>
	         <input type="hidden" id="data_nascimento" name="data_nascimento" />
	     </div>
	     <div class="smt-input-holder">
	         <label for="smart-password" class="smt-form-label visuallyhidden">Senha</label>
	         <input class="smt-input required" type="password" placeholder="Senha" id="passwordbeneficiario" name="passwordbeneficiario" maxlength="20"/>
	     </div>
	     <div class="smt-input-holder">
	         <label for="smart-password-confirm" class="smt-form-label visuallyhidden">Confirme a senha</label>
	         <input class="smt-input required" type="password" placeholder="Confirme a senha" id="confirmpasswordbeneficiario" name="confirmpasswordbeneficiario" maxlength="20"/>
	     </div>
		 <label for="smart-password" class="smt-label-warn">Atenção: sua senha deve possuir entre 8 e 11 caracteres e conter ao menos 1 número, 1 letra maiúscula, 1 letra minúscula e 1 caractere especial (Ex.: #, @, &amp; ou _).</label>
		 
		 <div id="href_resqueci_senha_beneficiario" class="smt-input-holder smt-input-actions smt-modal-content" style="display: none">
	          <a href="{/renderData/controls/control[@id='link_esqueci_senha_beneficiario']/data/href}" class="smt-form-action">Esqueci minha senha</a>
	      </div>   
	      
	     <div id="divButton" class="smt-input-holder smt-input-actions">
	         <button type="submit" id="buttonform" name="op" value="Enviar" class="smt-main-button" onclick="ga('send', 'event', 'botao', 'clique', 'cadastro-enviar');">Enviar</button> 
	     </div>
	 </form>

<script type="text/javascript">
	<xsl:text disable-output-escaping="yes">
		<![CDATA[
	
	function validateData(value)
	{
		return /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value);
	}
	
	function parseDate(value)
	{
		var parts = value.split("/");
		return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
	}
	
	function calculateAge(dataStr)
	{
		var parts = dataStr.split("/");
	
		var birthDay = Number(parts[0]);
		var birthMonth = Number(parts[1]);
		var birthYear = Number(parts[2]);
	
		todayDate = new Date();
		todayYear = todayDate.getFullYear();
		todayMonth = todayDate.getMonth();
		todayDay = todayDate.getDate();
		age = todayYear - birthYear; 
		
		if (todayMonth < birthMonth - 1)
		{
		  age--;
		}
		
		if (birthMonth - 1 == todayMonth && todayDay < birthDay)
		{
		  age--;
		}
		
		return age;
	}
	
	function montaConfirmModal(befeficiario)
		{
			$(".smt-client-signup-continue .modal-body input[type='text']").val("");
			
			for (var field in befeficiario)
			{
				$(".smt-client-signup-continue input[name='" + field + "']").val(befeficiario[field]);
			}
			
			if ($(".smt-client-signup-continue input[name='numeroCarteira']").val().length == 15)
				$(".smt-client-signup-continue input[name='numeroCarteira']").mask("99999.9.999999.99.9");
			
			var cpfInputBack = $(".smt-client-signup-continue input[name='cpf']");
			
			if (cpfInputBack.val().length == 11)
				cpfInputBack.mask("999.999.999-99");
			
			if (!cpfInputBack.val().trim() || cpfInputBack.val().trim() == "null")
				cpfInputBack.parent().hide();
			else
				cpfInputBack.parent().show();
			
			if ($(".smt-client-signup-continue input[name='rg']").val().length == 9)
				$(".smt-client-signup-continue input[name='rg']").mask("99.999.999-9");
			
			$("#updateBt").prop("disabled", false);
			
		}

	$(".ga_send").focusout(function(){
		ga('send','event', 'Formulario-fale-cadastro-prestador', $(this).attr("name"),$(this).val());
	});	
	
	$.validator.addMethod("passwordValidatorBeneficiario",
	    function(value, element) {
	        return this.optional(element) || /((?=.*\d)(?=.*[a-z])(?=.*?[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,15})$/.test(value);
   						}, "Formato de Senha Inválido"
	);
	
	$.validator.addMethod("dateBR",
	    function(value, element) {
	        return this.optional(element) || validateData(value);
   						}, "Data inválida"
	);
	
	$.validator.addMethod("cpfRequiredOnMinimunAge",
	    function(value, element) {
	    	
	    	var dataStr = $('#data_nascimento_str').val();
	    
	    	if (dataStr && !validateData(dataStr)) //se a data não é válida, a validação da data não deixará passar no formulário
	    		return true;
	    	
	        return ($('#cpfbeneficiario').val() != ""	&&	$('#cpfbeneficiario').val() != "___.___.___-__") || (dataStr == "") || (calculateAge(dataStr) < 18);
   						}, "CPF obrigatório para maiores de 18 anos."
	);
	
	$(document).ready(function() {
		
		$('.smt-modal-header').show();
	
		$('.finish-signup').click(function(){
			$('.smt-modal-header').show();
		});
		
		$('.smt-modal-close').click(function(){
			$("#divButton").show();
			$('.smt-modal-header').show();
		});
		
		$('.smt-main-button').click(function(){
			$('#sucesso-cadastro').removeClass('open');
		});
		
		var curForm = $("#registerformbeneficiario");
		$('.smt-close-warning').removeClass('closed')
		
		curForm.validate({
			rules: {
				nome: {minlength:	 4},
				cpfbeneficiario: {minlength: 14, cpfRequiredOnMinimunAge: true},
				nome_mae: {required: true},
				numero_carteira: {required: true},
				data_nascimento_str: {required: true, dateBR: true},
				passwordbeneficiario: {required: true, minlength: 8, maxlength: 11, passwordValidatorBeneficiario: true},
			    confirmpasswordbeneficiario: {required: true, equalTo: "#passwordbeneficiario"}
			},
			errorClass: 'error smt-message-error',
			errorElement: "span",
			messages: {
				nome: {minlength: "O nome deve ter pelo menos 4 caracteres"},
				cpfbeneficiario: {minlength: "O CPF deve ter pelo menos 14 caracteres"},
				rg: {required: "Favor preencher o RG"},
				orgao_emissor: {required: "Favor preencher o Órgão Emissor"},
				nome_mae: {required: "Favor preencher o nome da mãe completo"},
				numero_carteira: "Favor preencher o número da carteirinha",
				data_nascimento_str: "Favor preencher data de nascimento corretamente",
				passwordbeneficiario: {
					required: "Favor preencher uma senha",
					minlength: "A senha deve ter um mínimo de 8 carateres",
					maxlength: "A senha deve ter um máximo de 11 carateres",
					passwordValidatorBeneficiario: "Formato de Senha Inválido"
				},
				confirmpasswordbeneficiario: {
					required: "Favor preencher uma confirmação de senha",
					equalTo: "As duas senhas não são iguais."
				}
			}, 
			submitHandler: function(form){
				$("#erroCadastro").hide();
				
				$(".smt-main-button").addClass('loading');
				
				document.getElementById("data_nascimento").value = document.getElementById("data_nascimento_str").value;
				
				
				$.ajax({
					type: "POST",
					dataType: "json",
					url: curForm.attr("action"),
					data: curForm.serialize(),
					success: function(data){
						// success handling here
						$("#divLoading").toggle();
						curForm[0].reset();
						$(".form-fields").hide();
						
						var beneficiario = jQuery.parseJSON( data.responseParameters.doui_message[0] );
						
						
						$('#smart-signup-continue').prop('checked', true);
						$('#smart-signup').prop('checked', false)
						
						montaConfirmModal(beneficiario);
						
						$(".smt-warning.error").removeClass('open');
						$(".smt-main-button").removeClass('loading');
					}

				}).fail(function(data){
					try
					{
						var dataObj = $.parseJSON(data.responseText)
						var errorMessage = dataObj.responseParameters.doui_error;
						
						if(errorMessage == null)
							errorMessage = dataObj.responseParameters.error.message;
							
						if(errorMessage != null){
							$(".smt-warning.error").text(errorMessage);

							if(errorMessage.toString().indexOf("foi previamente cadastrado") !=-1 ){
								$("#href_resqueci_senha_beneficiario").show();
							}	
						}							
					}
					catch(e){console.log(e);}
						
					$(".smt-warning.error").addClass('open');
					$(".smt-main-button").removeClass('loading');
				});
				return false;
			}
		});

		var updateForm = $("#finishBeneficiarioform");

		$("#finishBeneficiarioform").validate({
			rules: {
				telefone: {required: true},
				email: {required: true, email: true}
			},
			errorClass: 'error smt-message-error',
			errorElement: "span",
			messages: {
				telefone: {required: "Favor preencher o Telefone"},
				email: {required: "Favor preencher o E-mail", email: "Favor preencher com um e-mail válido"}
			}, 
			submitHandler: function(form) {
				
				$("#erroUpdate").hide();
				
				$("#updateBt").addClass("loading");
				
				$("#updateBt").prop("disabled", true);
				$('.smt-close-warning').removeClass('closed')
				
				$.ajax({
		            type: 'post',
		            dataType: 'json',
		            contentType: "application/json; charset=utf-8",
		            traditional: true,
					url: updateForm.attr("action"),
					data: JSON.stringify({telefone: updateForm.find("[name='telefone']").val(), email: updateForm.find("[name='email']").val(), numeroCarteira: updateForm.find("[name='numeroCarteira']").val()}),
					success: function(data) {
						
						console.log("data");
						console.log(data);
						
						if (data.error)
						{
							
							$(".smt-warning.error").text(data.error);
							$(".smt-warning.error").addClass('open');
							
							return;
						}
						
						$("#updateBt").removeClass("loading");		
						$('.smt-modal-header').hide();				
						$('#sucesso-cadastro').addClass('open');
					}

				})
				.fail(function(data) {
					
					alert("Erro inesperado!");
					console.log("Erro inesperado!");
					console.log(data);
					
					$("#updateBt").removeClass("loading");
					$("#updateBt").prop("disabled", false);
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
		$('.dataNascimento').mask("99/99/9999");
		$('.matricula-mask').mask("99999.9.999999.99.9");
		
		$("#updateBt").click(function () {
			$('#sucesso-cadastro').removeClass('open');
			$("#finishBeneficiarioform").submit();
		});
		
		$('.smt-input[name="provider-signup-cpf"], .smt-input[name="client-signup-cpf"]').mask('999.999.999-99');
            $('.smt-input[name="provider-signup-cnpj"]').mask('99.999.999/9999-99');
            $('.smt-input[name="client-card-number"]').mask('99999.9.999999.99.9');
            $('.smt-input[name="client-birthdate"]').mask('99/99/9999');
            $('.smt-input[name="telefone"], .smt-input[name="client-phone"] ').mask('(99) 99999-999?9');
            $('.smt-input[name="telefone"], .smt-input[name="client-phone"] ').each(function(){
                var $this = $(this);
                $this.blur(function(event) {
                    var myValue = $this.val().replace(/\D/g, '');
                    $this.unmask();  
                    if(myValue.length > 10) {
                        $this.mask('(99) 99999-999?9');
                    } else {
                        $this.mask('(99) 9999-9999?9');
                        $this.val($this.val);
                    }
                });
            });
	});
	
	]]>
</xsl:text>
</script>	

<script type="text/javascript" src="js/validate/jquery.maskedinput.min.js"></script>

</xsl:template>
	
</xsl:stylesheet>