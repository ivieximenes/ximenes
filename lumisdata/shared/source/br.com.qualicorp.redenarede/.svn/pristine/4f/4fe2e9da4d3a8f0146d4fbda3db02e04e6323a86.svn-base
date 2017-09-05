<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">
	
	<style>
		#beneficiarioModal input, textarea, select { margin-bottom: 30px; }
		
		.one-third {display: inline-block; width: calc(33.33% - 11.42px); margin-right: 14px; vertical-align: top; padding: 0;}
		.one-third.last {margin-right: 0; padding-right: 0;}
	</style>
	
	<header class="header-blue white"> 
   		<h1>Cadastro - Beneficiário</h1> 
	</header> 
	<div id="signUpModal"> 
    <form class="form form-signup" action="{//control[@type='lum_form']/data/action-commit}" method="post" id="registerform" accept-charset="UTF-8"> 
            <p class="all-full  success" style="display:none;">
            	Seu cadastro foi realizado com sucesso. Você pode acessar os serviços do portal ou fazer um novo cadastro para seu dependente:<br/><br/> 
            	1) Para cadastrar um dependente, acesse a página de cadastro novamente <a href="#" onclick="window.location.href=g_LumisRoot_href+'cadastro';return false;">aqui</a>.<br/>  
            	2) Para continuar navegando e acessar os serviços do portal, faça o login <a href="{/renderData/controls/control[@id='link']/data/href}">aqui</a>.
            </p>
            <p id="erroCadastro" class="all-full global-error error" style="display:none;">Ocorreu um erro ao realizar seu cadastro.</p>
        	<div class="form-fields">
            <div> 
                <label class="req" for="signUp-beneficiario-cpf" style="display: inline-block;">CPF</label>
                <span style="display: inline-block;vertical-align: sub;margin-left: 20px;margin-top: 3px; color: #00537f;">Menores de 18 anos que não possuem CPF não precisam preencher este campo</span> 
                <input type="text" id="cpf" name="cpf" value="" maxlength="14" class="cpf-mask" /> 
            </div> 
            <div> 
                <label class="req" for="signUp-beneficiario-nome-mae">Nome da Mãe </label> 
                <input type="text" id="nome_mae" name="nome_mae" value="" maxlength="100" class="required" onblur="this.value=this.value.replace(/^\s*|\s*$/g,'');" /> 
            </div> 
       
			<div class="half"> 
                <label class="req" for="signUp-beneficiario-matricula">Nº da Carteirinha</label> 
                <input type="text" id="numero_carteira" name="numero_carteira" value="" maxlength="20" class="required matricula-mask" /> 
            </div> 
            <div class="half last"> 
                <label class="req" for="signUp-beneficiario-data-nascimetno">Data de Nascimento</label> 
                <input type="text" id="data_nascimento_str" name="data_nascimento_str" value="" maxlength="10" class="dataNascimento ga_send" />
                <input type="hidden" id="data_nascimento" name="data_nascimento" />
            </div> 
            <div class="half"> 
                <label class="req" for="signUp-beneficiario-password">Senha</label> 
                <input type="password" id="password" name="password" value="" maxlength="20" class="required" /> 
            </div> 
            <div class="half last"> 
                <label class="req" for="signUp-beneficiario-confirmpassord">Confirme a senha</label> 
                <input type="password" id="confirmpassword" name="confirmpassword" value="" maxlength="20" class=" required" /> 
            </div>
            <div class="inf-senha">
           		<spam>Atenção: Cadastre uma senha com oito ou mais caracteres e que possua pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial.</spam>
           	</div> 
        <input type="hidden" id="user_id" name="user_id" value="" maxlength="20" class="" /> 
        
        
        <span class="error">* Campos obrigatórios.</span>
        <div id="href_resqueci_senha_beneficiario" class="smt-input-holder smt-input-actions smt-modal-content" style="display: none">
	    	<a href="{/renderData/controls/control[@id='link_esqueci_senha_beneficiario']/data/href}" class="smt-form-action">Esqueci minha senha</a>
	    </div>
        <div id="divButton">
			<input type="submit" id="buttonform" name="op" value="Enviar" class="button" onclick="ga('send', 'event', 'botao', 'clique', 'cadastro-enviar');"/> 
		</div>
        <div id="divLoading" style="display:none;" align="center">
			<img src="lumis/portal/client/images/Loading.gif" style="vertical-align: middle;" alt="Carregando"/> Carregando
		</div>
		</div>
    </form> 
</div>

<div id="beneficiarioModal" class="modal fade" role="dialog">
	<div class="modal-dialog">
	
		<!-- Modal content -->
		<div class="modal-content">
			<form id="finishBeneficiarioform" action="/beneficiario-rest/finish-add" method="post" accept-charset="UTF-8">
				<div class="modal-header">
					<button type="button" class="close close-update" data-dismiss="modal" style="float: right; display: none">X</button>
					<!--<h4 style="text-transform: inherit;" class="modal-title big-blue">
						Cadastro realizado com sucesso!
					</h4>-->
					<h4 class="modal-title big-blue alert sub">
						Caso necessário, atualize nos campos abaixo seu e-mail e número de celular. Para atualizar ou completar outros dados, entre em contato com o RH da sua empresa.
					</h4>
				</div>
				<div class="modal-body" style="padding-left: 89px; padding-right: 89px; padding-bottom: 0;">
					<p id="erroUpdate" class="all-full global-error error" style="margin-top: 10px; display:none;">Ocorreu um erro ao realizar seu cadastro.</p>
					<div>
						<label>Nome </label>
						<input type="text" name="nome" disabled="disabled" />
					</div>
					<div class="one-third">
						<label>CPF </label>
						<input type="text" name="cpf" disabled="disabled" class="cpf-mask" />
					</div>
					<div class="one-third">
						<label>RG </label>
						<input type="text" name="rg" disabled="disabled" class="rg-mask" />
					</div>
					<div class="one-third last">
						<label>Órgão Emissor </label>
						<input type="text" name="orgaoEmissor" disabled="disabled" />
					</div>
					<div>
						<label>Nome da Mãe </label>
						<input type="text" name="nomeMae" disabled="disabled" />
					</div>
					<div>
						<label>E-mail </label>
						<input type="text" name="email" style="background-color: white;" />
					</div>
					<div class="one-third">
						<label>Nº da Carteirinha</label>
						<input type="text" name="numeroCarteira" class="matricula-mask" disabled="disabled" />
					</div>
					<div class="one-third">
						<label>Data de Nascimento</label>
						<input type="text" name="dataNascimento" class="dataNascimento ga_send" disabled="disabled" />
					</div>
					<div class="one-third last">
						<label>Telefone  </label>
						<input type="text" name="telefone" class="telefone-mask" style="background-color: white;" />
					</div>
				</div>
				<div class="modal-footer">
					<input id="updateBt" type="button" value="Ok" class="button" style="margin: 0px auto; !important;" />
				</div>
			</form>
		</div>
	</div>
</div>


${lum_beforeWrite('<xsl:text disable-output-escaping="yes">&lt;script type="text/javascript" src="lumis/tool/jquery/jquery.js"&gt;&lt;/script&gt;</xsl:text>', 'jquery.js')}
<script type="text/javascript" src="js/validate/jquery.validate.js"></script>
<script type="text/javascript" src="js/validate/jquery.maskedinput.min.js"></script>
			
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

	
	$(".ga_send").focusout(function(){
		ga('send','event', 'Formulario-fale-cadastro-prestador', $(this).attr("name"),$(this).val());
	});	
	
	$.validator.addMethod("passwordValidator",
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
	    	
	        return ($('#cpf').val() != ""	&&	$('#cpf').val() != "___.___.___-__") || (dataStr == "") || (calculateAge(dataStr) < 18);
   						}, "CPF obrigatório para maiores de 18 anos."
	);
	
	$(document).ready(function() {
		
		$('.smt-modal-close').click(function(){
			$("#divButton").show();
			$("#href_resqueci_senha_beneficiario").hide();
		});
		
		var curForm = $("#registerform");

		curForm.validate({
			rules: {
				nome: {minlength:	 4},
				cpf: {minlength: 14, cpfRequiredOnMinimunAge: true},
				nome_mae: {required: true},
				numero_carteira: {required: true},
				data_nascimento_str: {required: true, dateBR: true},
				password: {required: true, minlength: 8, maxlength: 11, passwordValidator: true},
			    confirmpassword: {required: true, equalTo: "#password"}
			},
			errorElement: "p",
			messages: {
				nome: {minlength: "O nome deve ter pelo menos 4 caracteres"},
				cpf: {minlength: "O CPF deve ter pelo menos 14 caracteres"},
				rg: {required: "Favor preencher o RG"},
				orgao_emissor: {required: "Favor preencher o Órgão Emissor"},
				nome_mae: {required: "Favor preencher o nome da mãe completo"},
				numero_carteira: "Favor preencher o número da carteirinha",
				data_nascimento_str: "Favor preencher data de nascimento corretamente",
				password: {
					required: "Favor preencher uma senha",
					minlength: "A senha deve ter um mínimo de 8 carateres",
					maxlength: "A senha deve ter um máximo de 11 carateres",
					passwordValidator: "Formato de Senha Inválido"
				},
				confirmpassword: {
					required: "Favor preencher uma confirmação de senha",
					equalTo: "As duas senhas não são iguais."
				}
			}, 
			submitHandler: function(form){
				$(".success").hide();
				$("#erroCadastro").hide();
				$("#divButton").toggle();
				$("#divLoading").toggle();
				
				document.getElementById("data_nascimento").value = document.getElementById("data_nascimento_str").value;
				
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
						$(".form-fields").hide();
						
						var befeficiario = jQuery.parseJSON( data.responseParameters.doui_message[0] );
						
						window.showBeneficionarioModal(befeficiario);
					}

				}).fail(function(data){
					try
					{
						var dataObj = $.parseJSON(data.responseText)
						var errorMessage = dataObj.responseParameters.doui_error;
						
						if(errorMessage == null)
							errorMessage = dataObj.responseParameters.error.message;
							
						if(errorMessage != null){
							$("#erroCadastro").text(errorMessage);
							if(errorMessage.toString().indexOf("foi previamente cadastrado") !=-1 ){
								$("#divButton").hide();
								$("#href_resqueci_senha_beneficiario").show();
							}
						}
					}
					catch(e){console.log(e);}
						
					$("#erroCadastro").show();
					$("#divButton").toggle();
					$("#divLoading").toggle();
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
			errorElement: "p",
			messages: {
				telefone: {required: "Favor preencher o Telefone"},
				email: {required: "Favor preencher o E-mail", email: "Favor preencher com um e-mail válido"}
			}, 
			submitHandler: function(form) {
				
				$("#erroUpdate").hide();
				
				$("#updateBt").prop("disabled", true);
				
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
							$("#beneficiarioModal").animate({scrollTop:$("#erroUpdate").text(data.error).show().offset().top}, 500);
							
							$("#updateBt").prop("disabled", false);
							
							return;
						}
						
						window.closeBeneficiarioModal();
						
						$(".success").show();
					}

				})
				.fail(function(data) {
					
					alert("Erro inesperado!");
					console.log("Erro inesperado!");
					console.log(data);
					
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
		
			$("#finishBeneficiarioform").submit();
		});
	});
	
	]]>
</xsl:text>
</script>	

<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/validate/jquery.maskedinput.min.js"></script>

<script>
	
	(function ($)
	{
		window.showBeneficionarioModal = function (befeficiario)
		{
			$("#beneficiarioModal .modal-body input[type='text']").val("");
			
			for (var field in befeficiario)
			{
				$("#beneficiarioModal input[name='" + field + "']").val(befeficiario[field]);
			}
			
			if ($("#beneficiarioModal input[name='numeroCarteira']").val().length == 15)
				$("#beneficiarioModal input[name='numeroCarteira']").mask("99999.9.999999.99.9");
			
			var cpfInputBack = $("#beneficiarioModal input[name='cpf']");
			
			if (cpfInputBack.val().length == 11)
				cpfInputBack.mask("999.999.999-99");
			
			if (!cpfInputBack.val().trim() || cpfInputBack.val().trim() == "null")
				cpfInputBack.parent().hide();
			else
				cpfInputBack.parent().show();
			
			if ($("#beneficiarioModal input[name='rg']").val().length == 9)
				$("#beneficiarioModal input[name='rg']").mask("99.999.999-9");
			
			$("#updateBt").prop("disabled", false);
			
			$("#beneficiarioModal").modal({backdrop: 'static', keyboard: false});
		}
		
		window.closeBeneficiarioModal = function ()
		{
			$('#beneficiarioModal').modal('hide');
		};
		
		$('#beneficiarioModal').on('shown.bs.modal', function() {
		
			$(document).bind("keydown.tabBlock", function(e) {
			    if (e.keyCode == 9) {
			        e.preventDefault();
			    }
			});
		});
		
		$('.modal').on('hidden.bs.modal', function() {
		    $(document).unbind('keydown.tabBlock');
		});
	})($);
	
	jQuery.noConflict( true );
</script>

</xsl:template>
	
</xsl:stylesheet>
