<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	<xsl:import href="/lumis/doui/style/DouiControls.xsl" />
	
	<xsl:template match="control[@type='lum_div']">
	<input id="smart-header-login" data-modal="hide" class="visuallyhidden smt-toggler smt-modal-toggler" type="checkbox"/>
	<label for="smart-header-login" class="smt-toggler-login smt-icon-toggler">Login</label>
	<div class="smt-modal-login smt-modal">
	    <div class="smt-modal-backdrop">
	        <div class="smt-modal-wrapper">
	            <a class="smt-modal-close" href="#">Fechar modal</a>
	            <article class="smt-modal-popup" >
					<header class="smt-modal-header">
						<h3 class="smt-modal-title">Faça seu <span class="smt-smile">login</span></h3>
					</header>
					<div class="smt-modal-body">
						<div class="smt-modal-content">                                            
							<input class="smt-checkbox visuallyhidden"  type="radio" name="smart-login-profile" id="smart-login-cliente"/>
							<label class="smt-form-label smt-label-checkbox" for="smart-login-cliente">Sou um cliente</label> 
							<input class="smt-checkbox visuallyhidden" type="radio" name="smart-login-profile" id="smart-login-prestador"/>
							<label class="smt-form-label smt-label-checkbox" for="smart-login-prestador">Sou um prestador</label>
							<form class="smt-hidden-form smt-client-login">
								<div class="smt-input-holder">
									<label for="smart-carteirinha-cliente" class="smt-form-label visuallyhidden"></label>
									<input id="client-id" class="smt-input" type="tel" placeholder="Carteirinha ou CPF" name="client-id"/>
									<label for="smart-carteirinha-cliente" class="smt-label-warn">Somente números</label>
									<input type="text" name="login" id="login" style="display:none;"/>  
									<xsl:apply-templates select="//control[@id='login']/control"/>
								</div>
								
								<div class="smt-input-holder smt-checklist-wrapper">
	                            </div>
	                            
								<div class="smt-input-holder">
									<label for="smart-password" class="smt-form-label visuallyhidden"></label>
									<input id="client-password" class="smt-input" type="password" placeholder="Senha" name="client-password" maxlength="11"/>
									<label for="smart-password" class="smt-label-warn">Atenção: sua senha deve possuir entre 8 e 11 caracteres e conter ao menos 1 número, 1 letra maiúscula, 1 letra minúscula e 1 caractere especial (Ex.: #, @, &amp; ou _).</label>
									<input type="password" 	name="password" id="password" style="display:none;" />
									<xsl:apply-templates select="//control[@id='password']/control"/>
								</div>
								<div class="smt-input-holder smt-input-actions">
									<a href="#" class="smt-form-action">Esqueci minha senha</a>
									<button type="button" onclick="fLogin();" class="smt-main-button">entrar</button>
								</div>
							</form>
							<form class="smt-hidden-form smt-provider-login">
								<div class="smt-input-holder">
									<label for="smart-carteirinha-cliente" class="smt-form-label visuallyhidden"></label>
									<input id="provider-email" class="smt-input" type="email" placeholder="E-mail" name="provider-email"/>
								</div>
								<div class="smt-input-holder">
									<label for="smart-password" class="smt-form-label visuallyhidden"></label>
									<input id="provider-password" class="smt-input" type="password" placeholder="Senha" name="provider-password" maxlength="8"/>
									<label for="smart-password" class="smt-label-warn">Atenção: sua senha possui entre 6 a 8 caracteres e contêm ao menos 1 número, 1 letra e 1 caractere especial (#, @, &amp; ou _).</label>
								</div>
								<div class="smt-input-holder smt-input-actions">
									<a href="#" class="smt-form-action">Esqueci minha senha</a>
									<button type="button" onclick="fLogin();" class="smt-main-button">entrar</button>
								</div>
							</form>
						</div>
						<footer class="smt-modal-footer">
							<div class="smt-modal-message">
								<p>Não tem uma conta? <a href="#" id="modal-signup" data-remote-modal="#smart-signup">Cadastre-se</a></p>
							</div>
						</footer>
					</div>
				</article>
		        </div>
		    </div>
		</div>
		
		<script type="text/javascript">
			
			$( document ).ready(function() {
				$("#client-id").attr("maxlength", 15);
				$("#smart-login-cliente").attr("checked", true);
			});
			
			$('#provider-email').keyup(function() {
				var email = $('#provider-email').val();
				if ( email.substring(0,1)==" " || email.substring(email.length-1)==" ")
		  		$('#provider-email').val($.trim($('#provider-email').val()));
			});
			
			$('#client-id').keyup(function() {
   				var login = $('#client-id').val();
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
				$('#client-id').val(login.trim());
			});
			
			$(function () {
			    $('#str_login').bind('paste input', removeAlphaChars);
			})
			
			//Remove os caracteres diferentes de números
			function removeAlphaChars(e) {
				if(!$("#smart-login-prestador").is(":checked"))
	    		{
				    var self = $(this);
				    setTimeout(function () {
				        var login = $('#client-id').val();
		   				<xsl:text disable-output-escaping="yes">
						<![CDATA[
		   				
		   				for(i=0; i < login.length ; i++)
		   				{
		    				if(!isNumber(login[i]))
		    				{
		    					login = setCharAt(login,i," ");
		    				}
		   				}
		   				]]></xsl:text>
						login = login.replace(/\./g, "");
						login = login.replace(/ /g, "");
						$('#client-id').val(login.trim());
				    });
				 }
			}
			
    		//Evita digitar caracteres diferentes de números
			$('#client-id').keydown(function() {
				if(!$("#smart-login-prestador").is(":checked"))
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
				  
				  if (event.keyCode == '189' || event.keyCode == '190' || event.keyCode == '110') 
				  {
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
			
			function isEmail(email) {
			  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			  return regex.test(email);
			}
			
			//Habilita o enter para submeter o formulário
			$("#client-id").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLogin();
			    }
			});
			
			//Habilita o enter para submeter o formulário
			$("#client-password").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLogin();
			    }
			});
			
			//Habilita o enter para submeter o formulário
			$("#provider-email").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLogin();
			    }
			});
			
			//Habilita o enter para submeter o formulário
			$("#provider-password").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLogin();
			    }
			});
			
			function fLogin()
		    {  
		     	//Google Analytics
				ga('send', 'event', 'botao', 'clique', 'header_cliente-entrar');
				
				var loginName = '';
				
				if(!$("#smart-login-prestador").is(":checked"))
    			{
    				loginName = "Número da Carteirinha";
    				
					<xsl:text disable-output-escaping="yes">
					<![CDATA[
					if($('#client-id').val().length<15 && $('#client-id').val().length>0)
					{
						var cpf = $('#client-id').val();
						if(cpf.length!=11)
						{
							alert('Cpf inválido.');
							return false;
						}
						
						$("#cpf").val(cpf_mask(cpf));
									
						if($("#client-password").val() == "")
				     	{
				      		alert('Favor preencher a Senha.');
				      		return false;
				     	}
				     	
				     	if($('input:radio[name=beneficiarioListCPF]:checked').val()!='' && $('input:radio[name=beneficiarioListCPF]:checked').val()!=undefined)
				     	{
				     		$("#typeLogin").val("dependente");
					    	$("#login").val($('input:radio[name=beneficiarioListCPF]:checked').val());
					    	
					    	]]>
							</xsl:text>
							
					    	<xsl:value-of select="//control[@id='submitLogin']/data/onclick"/>
					    	
					    	<xsl:text disable-output-escaping="yes">
							<![CDATA[
				     	}
				     	else
				     	{
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
								
										
		  				        listBenefiHTML += "<div class='smt-checklist-holder'>";
		  				        listBenefiHTML += "<h4 class='smt-checklist-title'>Dependentes inscritos neste CPF:</h4>";
							    
								$.each(searchResults.rows, function(index, item){
								
									 listBenefiHTML += "<input class='smt-checkbox visuallyhidden' type='radio' name='beneficiarioListCPF' id='radioCPF+"+index+"' value='"+item.numero_carteira+"'/>";
									 listBenefiHTML += "<label class='smt-form-label smt-label-checkbox' for='radioCPF+"+index+"'>";
									 listBenefiHTML += "	<span class='smt-checklist-client-name'>"+item.nome+"</span>";
									 listBenefiHTML += "	<span class='smt-checklist-client-card'>"+item.numero_carteira+"</span>";
									 listBenefiHTML += "	<span class='smt-checklist-client-company'>"+item.estipulante+"</span>";
									 listBenefiHTML += "</label>";
									 
								});
								
								listBenefiHTML += " </div>";
								
								
								$(".smt-checklist-wrapper").html(listBenefiHTML);
						
								$('.smt-checklist-wrapper').addClass('open');
							}, "json");	
							]]>
							</xsl:text>
						}
						
						return false;
					}
					
			     	if($("#client-id").val() == "")
			     	{
			     		
			     		if($("#radioBeneficiario").is(":checked"))
			     		{
			      			alert('É necessário informar o Número da Carteira ou o CPF.');
			      			return false;
			     		}
			     	
			      		alert('Favor preencher o '+loginName+'.');
			      		return false;
			     	}
			     	
			     	if($("#client-password").val() == "")
			     	{
			      		alert('Favor preencher a Senha.');
			      		return false;
			     	}
			     	
			     	$("#typeLogin").val("carteirinha");
			     	$("#password").val($("#client-password").val());
			     	$("#login").val($("#client-id").val());
				}
				else
				{
					loginName = "E-Mail";
					
					if(!isEmail($("#provider-email").val()))
		      		{
		      			alert('Formato de E-mail inválido.');
		      			return false;
		      		}
		      		if($("#provider-password").val() == "")
			     	{
			      		alert('Favor preencher a Senha.');
			      		return false;
			     	}
			     	
			     	$("#password").val($("#client-password").val());
			     	$("#login").val($("#provider-email").val());
				}		     		
				
		     	<xsl:value-of select="//control[@id='submitLogin']/data/onclick"/>
		    }
			  
			function cpf_mask(v){
				v=v.replace(/\D/g,"")                 //Remove tudo o que não é dígito
				v=v.replace(/(\d{3})(\d)/,"$1.$2")    //Coloca ponto entre o terceiro e o quarto dígitos
				v=v.replace(/(\d{3})(\d)/,"$1.$2")    //Coloca ponto entre o setimo e o oitava dígitos
				v=v.replace(/(\d{3})(\d)/,"$1-$2")   //Coloca ponto entre o decimoprimeiro e o decimosegundo dígitos
				return v
			}
		</script>
		
	</xsl:template>
</xsl:stylesheet>
