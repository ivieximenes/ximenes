<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	
	<xsl:template match="/">
	
	<header class="header-blue white"> 
   		<h1>Esqueci Senha - Beneficiário</h1>
	</header> 
	
	<p id="gamaResponseMsg" class="all-full success" style="display:none;"></p>
	<div >
 		<div class="contactus-inform-line">
	 		<div class="contactus-inform-label">
		 		Para receber uma nova senha no e-mail cadastrado, informe o número da carteirinha ou o CPF e clique em enviar.
		 	</div>
 		</div>
	</div>
	
	<div id="signUpModal" style="margin-top: 50px;"> 
    <form class="form form-signup" action="{//control[@type='lum_form']/data/action-commit}" method="post" id="registerform" accept-charset="UTF-8"> 
	    
	    <p class="all-full global-error error" style="display:none;">Ocorreu um erro ao processar sua solicitação.</p>
	    <xsl:apply-templates select="/renderData/controls/control[@id='successHidden']" />
	    <xsl:apply-templates select="/renderData/controls/control[@id='gamaMsgHidden']" />
	    <div class="half"> 
		    <label for="signUp-beneficiario-login">Nº da Carteirinha</label> 
		    <input type="text" id="login" name="login" value="" class="required matricula-mask" /> 
	    </div> 
	    <div > 
		    <label for="signUp-beneficiario-cpf" >CPF</label>
		    <input type="text" id="cpf" name="cpf" value="" maxlength="14" class="cpf-mask" style="width: 49%;" /> 
	    </div> 
	    <span class="error" style="display: block;margin-bottom: 20px;">* Campos obrigatórios.</span>
		<input type="button" id="buttonform" name="op" value="Enviar" class="button" style="margin:0px !important;" onclick="listaCadastrosPorCpf();"/> 
        <div id="divLoading" style="display:none;" align="center">
			<img src="lumis/portal/client/images/Loading.gif" style="vertical-align: middle;" alt="Carregando"/> Carregando
		</div>
    </form> 
    <form id="formSuccess" action="{/renderData/controls/control[@id='link']/data/href}" method="POST">
    	<input type="hidden" id="success" name="success"/> 
    	<input type="hidden" id="gamaMsg" name="gamaMsg"/>
   </form>
</div>
<!-- Modal -->
<div id="myModal" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" style="float: right;">X</button>
        <h4 style="text-transform: inherit;" class="modal-title">Este CPF possui mais de um beneficiário vinculado. Por favor escolha o beneficiário desejado:</h4>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <input type="button" id="buttonlistform" onclick="listEsqueciMinhaSenha();" name="op" value="Enviar" class="button" style="margin: 0px auto; !important;"/>
      </div>
    </div>
  </div>
</div>
<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>

${lum_beforeWrite('<xsl:text disable-output-escaping="yes">&lt;script type="text/javascript" src="lumis/tool/jquery/jquery.js"&gt;&lt;/script&gt;</xsl:text>', 'jquery.js')}
<script type="text/javascript" src="js/validate/jquery.validate.js"></script>
<script type="text/javascript" src="js/validate/jquery.maskedinput.min.js"></script>
			
<script type="text/javascript">
	<xsl:text disable-output-escaping="yes">
		<![CDATA[

	if($('#successHidden').val()==1)
	{
		$("#gamaResponseMsg").text($("#gamaMsgHidden").val());
		$(".success").show();
	}
	
	function listEsqueciMinhaSenha()
	{
		if(!$('input:radio[name=beneficiarioListCPF]').is(':checked'))
    	{
    		alert("É necessário selecionar um Beneficiário.");
    		return false;
    	}
    	
    	var numero_carteira = $('input:radio[name=beneficiarioListCPF]:checked').val();
    	
    	$("#login").val(numero_carteira);
    	
    	$("#registerform").submit();
	}
	
	function listaCadastrosPorCpf()
	{
		ga('send', 'event', 'botao', 'clique', 'esquecisenha_beneficiario-enviar');
		
		if($('#login').val() == "" && $('#cpf').val() == "" )
		{
    		alert('É necessário informar o Número da Carteira ou o CPF.');
	    	return false;
		}
		else if($('#login').val() != "")
		{
			$("#registerform").submit();
			return false;
		}
		else
		{
			$.get( g_LumisRootPath+"lumis/api/rest/restlogin/lumgetdata/lista.json?cpf=" + $("#cpf").val(), function( searchResults ) {
						
				if(searchResults.rows.length < 1)
				{
					alert("Cpf não cadastrado na base do portal.");
					return false;
				}
				]]>
				</xsl:text>
				
				if(searchResults.rows.length == 1)
				{
			    	var numero_carteira = searchResults.rows[0].numero_carteira;
			    	
			    	$("#login").val(numero_carteira);
			    	
			    	$("#registerform").submit();
			    	
			    	return;
				}
				<xsl:text disable-output-escaping="yes">
				<![CDATA[
				var listBenefiHTML = "";
				
						
		        listBenefiHTML += "<div style='padding-left:15px;padding-right:15px;display:inline-block;width:100%;'>";
			    listBenefiHTML += "<div class='div_inner_modal'>";
			    listBenefiHTML += "        <table  style='border-collapse: collapse;border: 1px solid #ddd;min-width: 795px; width: 100%;'>";
			    
			    listBenefiHTML += "        <tr>";
			    listBenefiHTML += "        	<td align='center' style='padding: 1em;width: 25%;border: 1px solid #ddd;vertical-align: middle;font-weight: bold;background-color: lightgrey;'>";
			    listBenefiHTML += "        		número da carteirinha";
			    listBenefiHTML += "        	</td>";
			    listBenefiHTML += "        	<td align='center' style='padding: 1em;width: 40%;border: 1px solid #ddd;vertical-align: middle;font-weight: bold;background-color: lightgrey;'>";
			    listBenefiHTML += "        		nome do beneficiário";
			    listBenefiHTML += "        	</td>";
			    listBenefiHTML += "        	<td align='center' style='padding: 1em;border: 1px solid #ddd;vertical-align: middle;font-weight: bold;background-color: lightgrey;'>";
			    listBenefiHTML += "        		empresa";
			    listBenefiHTML += "        	</td>";
			    listBenefiHTML += "        </tr>";
			    
				$.each(searchResults.rows, function(index, item){
				
					 listBenefiHTML += "        	<tr>";
					 listBenefiHTML += "        		<td style='padding: 1em;width: 25%;border: 1px solid #ddd;vertical-align: middle;'>";
					 listBenefiHTML += "	 				<div class='div_inner_radio_modal' style='margin-right:10px;'>";
					 listBenefiHTML += "						<input style='width: 43%;float: right; margin-bottom: 0px;height: 28px;' type='radio' id='radioCPF+"+index+"' name='beneficiarioListCPF' value='"+item.numero_carteira+"' class='form-text' />";
					 listBenefiHTML += "	 				</div>";
					 listBenefiHTML += "					<div class='div_inner_label_modal'>";
					 listBenefiHTML += "						<label style='font-size: 15px;font-style: inherit;margin-bottom: 0px;' for='radioBeneficiario'>"+item.numero_carteira+"</label>";
					 listBenefiHTML += "	 				</div>";
					 listBenefiHTML += "        		</td>";
					 listBenefiHTML += "        		<td style='padding: 1em;width: 40%;border: 1px solid #ddd;vertical-align: middle;'>";
					 listBenefiHTML += "					<p style='padding-top: 23px;'>"+item.nome+"</p>";
					 listBenefiHTML += "        		</td>";
					 listBenefiHTML += "        		</td>";
					 listBenefiHTML += "        		<td style='padding: 1em;border: 1px solid #ddd;vertical-align: middle;'>";
					 listBenefiHTML += "					<p style='padding-top: 23px;'>"+item.estipulante+"</p>";
					 listBenefiHTML += "        		</td>";
					 listBenefiHTML += "        	</tr>";
					 
				});
				
				listBenefiHTML += "        </table>";							 
				listBenefiHTML += " </div>";
				listBenefiHTML += " </div>";
				
				
				$(".modal-body").html(listBenefiHTML);
		
				$('#myModal').modal('show');  
	
			}, "json");	
			
			return false;
		}
	}
	
	$(document).ready(function() {
	
		var curForm = $("#registerform");

		curForm.validate({
			rules: {
				login: {required: true},
				cpf: {minlength: 14},
				email: {required: true, email: true},
			},
			errorElement: "p",
			messages: {
				login: {required: "Favor preencher o código da carteirinha"},
				cpf: {minlength: "O CPF deve ter pelo menos 14 caracteres"},
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
						
						$("#gamaMsg").val(data.responseParameters.doui_message[0]);
						
						$('#success').val("1");
						$("#formSuccess").submit();
					}

				}).fail(function(data){
					try{
						var dataObj = $.parseJSON(data.responseText);
						var errorMessage = dataObj.responseParameters.doui_error;
						if(errorMessage == null)
							errorMessage = dataObj.responseParameters.error.message;
							
						if(errorMessage != null)
							$(".global-error").text(errorMessage);
					}catch(e){console.log(e);}
					$(".global-error").show();
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
