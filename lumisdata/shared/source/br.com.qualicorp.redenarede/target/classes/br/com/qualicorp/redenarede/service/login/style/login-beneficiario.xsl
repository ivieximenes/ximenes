<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	<xsl:template match="control[@type='lum_div']">
	
		<header class="header-blue white"> 
	  		<h1>Login</h1> 
		</header> 
		<div id="signUpModal"> 
			<p class="all-full  error" style="display:none;">Ocorreu um erro ao processar sua solicitação.</p>
			    
			<div class="half">
				<label id="lbLogin" for="signUp-beneficiario-login">Carteirinha ou CPF (somente números)</label>
				<input type="text" name="str_login" id="str_login" placeholder="Carteirinha ou CPF (somente números)" /> 
				<input type="text" name="login" id="login" style="display:none;"/>   
				<input type="hidden" name="typeLogin" id="typeLogin" />
				<xsl:apply-templates select="//control[@id='login']/control"/>
			</div> 
			<div id="div_cpf" class="half" style="display:none;">
				<input type="text" name="cpf" id="cpf" placeholder="CPF" />  
			</div>
			<div class="half"> 
				<label for="signUp-beneficiario-password">Senha</label> 
				<input type="password" 	name="password"  id="password"	placeholder="Senha" />
				<xsl:apply-templates select="//control[@id='password']/control"/>
			</div> 
			<div class="inf-senha">
           		<spam>Atenção: sua senha deve possuir ao menos 8 caracteres e<br/> conter ao menos 1 número, 1 letra maiúscula, 1 letra<br/> minúscula e 1 caractere especial.</spam>
           	</div>
	        <input type="button" id="buttonform" onclick="fLogin();" name="op" value="Enviar" class="button" style="margin: 0; !important;"/>
	        
	        <div class="half">
			  <a class="login_esqueci_senha"  href="{/renderData/controls/control[@id='link_esqueci_senha_beneficiario']/data/href}">esqueci a senha</a>
			</div>
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
		        <input type="button" id="buttonlistform" onclick="listLogin();" name="op" value="Enviar" class="button" style="margin: 0px auto; !important;"/>
		      </div>
		    </div>
		  </div>
		</div>
		<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript">  
			
			$( document ).ready(function() {
				$("#str_login").attr("maxlength", 15);
			});
			
			$('#str_login').keyup(function() {
   				var login = $('#str_login').val();
   				<xsl:text disable-output-escaping="yes">
				<![CDATA[
   				
   				for(i=0; i < login.length ; i++)
   				{
    				if(!isNumber(login[i]))
    				{
    					login = setCharAt(login,i," ");
    				}
   				}
   				
   				]]>
				</xsl:text>

				login = login.replace(/\./g, "");
				login = login.replace(/ /g, "");
				$('#str_login').val(login.trim());
			});
			
			$("#str_login").on("paste", function(){
		        var login = $('#str_login').val();
   				<xsl:text disable-output-escaping="yes">
				<![CDATA[
   				
   				for(i=0; i < login.length ; i++)
   				{
    				if(!isNumber(login[i]))
    				{
    					login = setCharAt(login,i," ");
    				}
   				}
   				
   				]]>
				</xsl:text>
				
				login = login.replace(/\./g, "");
				login = login.replace(/ /g, "");
				$('#str_login').val(login.trim());
		    });
			
			$('#str_login').keydown(function() {
				if(!$("#radioPrestador").is(":checked"))
    			{
					<![CDATA[
				  
				  // Enable arrows
				  if(event.keyCode == '38' || event.keyCode == '39' || event.keyCode == '40' || event.keyCode == '37')
				  {
				  	return;
				  }
				  
				  // Enable shift, home, end
				  if(event.keyCode == '36' || event.keyCode == '16' || event.keyCode == '35')
				  {
				  	return;
				  }
				  
				  //Enable ctrl + c and ctrl + v
				  if(event.keyCode == '17' || event.keyCode == '86' || event.keyCode == '67')
				  {
				  	return;
				  }	
				  
				  if (event.keyCode == '189' || event.keyCode == '190' || event.keyCode == '110') {
				     event.preventDefault();
				     return false;
				   }
				   
				    // Allow: backspace, delete, tab, escape, enter and .
			        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			             // Allow: Ctrl+A, Command+A
			            (event.keyCode == 65 && ( event.ctrlKey === true || event.metaKey === true ) ) || 
			             // Allow: home, end, left, right, down, up
			            (event.keyCode >= 35 && event.keyCode <= 40)) {
			                 // let it happen, don't do anything
			                 return;
			        }
			        // Ensure that it is a number and stop the keypress
			        if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
			            event.preventDefault();
			        }
	       			]]>
       			}
      		});
			
			function isNumber(n) 
			{ 
				return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
			}
			
			function setCharAt(str,index,chr) {
				if(index > str.length-1) return str;
				return str.substr(0,index) + chr + str.substr(index+1);
			}	 
			
			function cpf_mask(v){
				v=v.replace(/\D/g,"")                 //Remove tudo o que não é dígito
				v=v.replace(/(\d{3})(\d)/,"$1.$2")    //Coloca ponto entre o terceiro e o quarto dígitos
				v=v.replace(/(\d{3})(\d)/,"$1.$2")    //Coloca ponto entre o setimo e o oitava dígitos
				v=v.replace(/(\d{3})(\d)/,"$1-$2")   //Coloca ponto entre o decimoprimeiro e o decimosegundo dígitos
				return v
			}
			
			$("#password").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLogin();
			    }
			});
			
		    function fLogin()
		    {  
				
		     	//Google Analytics
				ga('send', 'event', 'botao', 'clique', 'header_cliente-entrar');
				
				<xsl:text disable-output-escaping="yes">
				<![CDATA[
				if($('#str_login').val().length<15 && $('#str_login').val().length>0)
				{
					var cpf = $('#str_login').val();
					if(cpf.length!=11)
					{
						alert('Cpf inválido.');
						return false;
					}
					
					$("#cpf").val(cpf_mask(cpf));
								
					if($("#password").val() == "")
			     	{
			      		alert('Favor preencher a Senha.');
			      		return false;
			     	}
			     	
					$.get( g_LumisRootPath+"lumis/api/rest/restlogin/lumgetdata/lista.json?cpf=" + $("#cpf").val(), function( searchResults ) {
					
						if(searchResults.rows.length<1)
						{
							alert("Cpf não cadastrado na base do portal.");
							return false;
						}
						]]>
						</xsl:text>
						
						if(searchResults.rows.length==1)
						{
					    	var numero_carteira = searchResults.rows[0].numero_carteira;
					    	
					    	$("#typeLogin").val("cpf");
					    	$("#login").val(numero_carteira);
					    	
					    	<xsl:value-of select="//control[@id='submitLogin']/data/onclick"/>
					    	
						}
						<xsl:text disable-output-escaping="yes">
						<![CDATA[
						var listBenefiHTML = "";
						
								
  				        listBenefiHTML += "<div style='padding-left:15px;padding-right:15px;display:inline-block;width:100%;'>";
					    listBenefiHTML += "<div class='div_inner_modal'>";
					    listBenefiHTML += "        <table  style='border-collapse: collapse;border: 1px solid #ddd;min-width: 795px; width: 100%;'>";
					    
					    listBenefiHTML += "        <tr>";
					    listBenefiHTML += "        	<td align='center' style='width: 25%;border: 1px solid #ddd;vertical-align: middle;font-weight: bold;background-color: lightgrey;'>";
					    listBenefiHTML += "        		número da carteirinha";
					    listBenefiHTML += "        	</td>";
					    listBenefiHTML += "        	<td align='center' style='width: 40%;border: 1px solid #ddd;vertical-align: middle;font-weight: bold;background-color: lightgrey;'>";
					    listBenefiHTML += "        		nome do beneficiário";
					    listBenefiHTML += "        	</td>";
					    listBenefiHTML += "        	<td align='center' style='border: 1px solid #ddd;vertical-align: middle;font-weight: bold;background-color: lightgrey;'>";
					    listBenefiHTML += "        		empresa";
					    listBenefiHTML += "        	</td>";
					    listBenefiHTML += "        </tr>";
					    
						$.each(searchResults.rows, function(index, item){
						
							 listBenefiHTML += "        	<tr>";
							 listBenefiHTML += "        		<td style='width: 25%;border: 1px solid #ddd;vertical-align: middle;'>";
							 listBenefiHTML += "	 				<div class='div_inner_radio_modal' style='margin-right:10px;'>";
							 listBenefiHTML += "						<input style='width: 43%;float: right; margin-bottom: 0px;height: 28px;' type='radio' id='radioCPF+"+index+"' name='beneficiarioListCPF' value='"+item.numero_carteira+"' class='form-text' />";
							 listBenefiHTML += "	 				</div>";
							 listBenefiHTML += "					<div class='div_inner_label_modal'>";
							 listBenefiHTML += "						<label style='font-size: 15px;font-style: inherit;margin-bottom: 0px;' for='radioBeneficiario'>"+item.numero_carteira+"</label>";
							 listBenefiHTML += "	 				</div>";
							 listBenefiHTML += "        		</td>";
							 listBenefiHTML += "        		<td style='width: 40%;border: 1px solid #ddd;vertical-align: middle;'>";
							 listBenefiHTML += "					<p style='padding-top: 23px;'>"+item.nome+"</p>";
							 listBenefiHTML += "        		</td>";
							 listBenefiHTML += "        		</td>";
							 listBenefiHTML += "        		<td style='border: 1px solid #ddd;vertical-align: middle;'>";
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
					]]>
					</xsl:text>
					
					return false;
				}
				
				if($("#str_login").val() == "")
		     	{
		     		
	      			alert('É necessário informar o Número da Carteira ou o CPF.');
	      			return false;
		     	}
		     	
		     	if($("#password").val() == "")
		     	{
		      		alert('Favor preencher a Senha.');
		      		return false;
		     	}
		     	
		     	$("#typeLogin").val("carteirinha");
		     	$("#login").val($("#str_login").val());
		     		
		     	<xsl:value-of select="//control[@id='submitLogin']/data/onclick"/>
		    }
		       
	     	function listLogin(){
	    
		    	if(!$('input:radio[name=beneficiarioListCPF]').is(':checked'))
		    	{
		    		alert("É necessário selecionar um Beneficiário.");
		    		return false;
		    	}
		    	
		    	var numero_carteira = $('input:radio[name=beneficiarioListCPF]:checked').val();
		    	
		    	$("#typeLogin").val("dependente");
		    	$("#login").val(numero_carteira);
		    	
		    	<xsl:value-of select="//control[@id='submitLogin']/data/onclick"/>
		    }
		</script>
	</xsl:template>
</xsl:stylesheet>