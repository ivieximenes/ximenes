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
						<h3 class="smt-modal-title">Faça seu login</h3>
					</header>
					<div class="smt-modal-body">
						<div class="smt-modal-content">
						
						    <input class="smt-checkbox visuallyhidden" type="radio" id="smart-login-cliente" name="smart-login-profile" value="Beneficiario" onclick="mudarLayout()" checked="true" />
				            <label class="smt-form-label smt-label-checkbox" for="smart-login-cliente">Sou cliente</label>
					            
				            <input class="smt-checkbox visuallyhidden" type="radio" id="smart-login-prestador" name="smart-login-profile" value="Prestador" onclick="mudarLayout()" />
				            <label class="smt-form-label smt-label-checkbox" for="smart-login-prestador" >Sou prestador</label>
							
							<div class="smt-input-holder">
								<label class="smt-form-label visuallyhidden" id="lbLogin" for="signUp-beneficiario-login">Carteirinha ou CPF (somente números)</label>
								<input class="smt-input" type="text" name="str_login" id="str_login" placeholder="Carteirinha ou CPF" /> 
								<input type="text" name="login" id="login" style="display:none;"/>  
								<input type="hidden" name="typeLogin" id="typeLogin" />
								<xsl:apply-templates select="//control[@id='login']/control"/>
							</div> 
							
							<div class="smt-input-holder smt-checklist-wrapper">
							</div>
							
							<div id="div_cpf" class="half" style="display:none;">
								<input type="text" name="cpf" id="cpf" placeholder="CPF" />  
							</div>
							
							<div class="smt-input-holder">
								<label for="smart-password" class="smt-form-label visuallyhidden"></label>
								<input class="smt-input" type="password" name="password" id="password" placeholder="Senha" />
								
								
								<div class="inf-senha">
									<div id="senhaInfPrestador">
						           		<label for="smart-password" class="smt-label-warn">Atenção: sua senha possui entre 6 a 8 caracteres e contêm ao menos 1 número, 1 letra e 1 caractere especial (#, @, &amp; ou _).</label>
									</div>
									<div id="senhaInfBeneficiario">
					           			<label for="smart-password" class="smt-label-warn">Atenção: sua senha deve possuir entre 8 e 11 caracteres e conter ao menos 1 número, 1 letra maiúscula, 1 letra minúscula e 1 caractere especial (Ex.: #, @, &amp; ou _).</label>
					           		</div>
				           		</div>
								
								<xsl:apply-templates select="//control[@id='password']/control"/>
							</div>
							
							<div id="href_resqueci_senha_beneficiario" class="smt-input-holder smt-input-actions">
                                 <a href="{/renderData/controls/control[@id='link_esqueci_senha_beneficiario']/data/href}" class="smt-form-action">Esqueci minha senha</a>
                                 <button class="smt-main-button" type="button" id="buttonform" onclick="fLogin();" name="op" value="Enviar">Enviar</button>
                             </div>
                             
                             <div id="href_resqueci_senha_prestador" class="smt-input-holder smt-input-actions">
                                  <a href="{/renderData/controls/control[@id='link_esqueci_senha_prestador']/data/href}" class="smt-form-action">Esqueci minha senha</a>
                                  <button class="smt-main-button" type="button" id="buttonform" onclick="fLogin();" name="op" value="Enviar">Enviar</button>
                              </div>
						
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
				$("#str_login").attr("maxlength", 15);
				$("#smart-login-cliente").attr("checked", true);
				$("#senhaInfPrestador").hide();
				$('#href_resqueci_senha_prestador').hide();
				$('#href_resqueci_senha_beneficiario').show();
				
				mudarLayout();
				
			});
			
			
			function mudarLayout(){
				if($("#smart-login-prestador").is(":checked"))
				{
					$("#lbLogin").html("E-mail");
					$('#str_login').attr("placeholder", "E-mail");
					
					$("#senhaInfPrestador").show();
					$("#senhaInfBeneficiario").hide();
					$('#href_resqueci_senha_prestador').show();
					$('#href_resqueci_senha_beneficiario').hide();
					
					$('#str_login').val('');
					$('#loginpassword').val('');
					$("#str_login").removeAttr("maxlength");
					
					$("#typeLogin").val('prestador');
				}
				else
				{
					$("#lbLogin").html("Carteirinha ou CPF (somente números)");
					$('#str_login').attr("placeholder", "Carteirinha ou CPF (somente números)");
					$("#str_login").attr("maxlength", 15);
						
					$("#senhaInfPrestador").hide();
					$("#senhaInfBeneficiario").show();
					$('#href_resqueci_senha_prestador').hide();
					$('#href_resqueci_senha_beneficiario').show();
					
					$('#str_login').val('');
					$('#loginpassword').val('');
					
					$("#typeLogin").val('beneficiario');
				}
    		};
    		
    		$('#str_login').keyup(function() {
    			
    			if($("#smart-login-prestador").is(":checked"))
    			{
					var email = $('#str_login').val();
					if ( email.substring(0,1)==" " || email.substring(email.length-1)==" ")
			  		$('#str_login').val($.trim($('#str_login').val()));
    			}
    			else
    			{
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
    			}
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
		   				]]></xsl:text>
						login = login.replace(/\./g, "");
						login = login.replace(/ /g, "");
						$('#str_login').val(login.trim());
				    });
				 }
			}
			
    		//Evita digitar caracteres diferentes de números
			$('#str_login').keydown(function() {
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
			$("#str_login").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLogin();
			    }
			});
			
			//Habilita o enter para submeter o formulário
			$("#password").keypress(function(event) {
			    if (event.which == 13) {
			        event.preventDefault();
			        fLogin();
			    }
			});
			
		    function fLogin()
		    {  
				$('.smt-main-button').addClass('loading');
		     	//Google Analytics
				ga('send', 'event', 'botao', 'clique', 'header_cliente-entrar');
				
				$("#login").val($("#str_login").val());
				
				<xsl:text disable-output-escaping="yes">
				<![CDATA[
				if($("#smart-login-cliente").is(":checked") && $('#str_login').val().length<15 && $('#str_login').val().length>0)
				{
					var cpf = $('#str_login').val();
					if(cpf.length!=11)
					{
						alert('Cpf inválido.');
						
						$('.smt-main-button').removeClass('loading');
						return false;
					}
					
					$("#cpf").val(cpf_mask(cpf));
								
					if($("#password").val() == "")
			     	{
			      		alert('Favor preencher a Senha.');
			      		$('.smt-main-button').removeClass('loading');
			      		return false;
			     	}
				
		    	]]>
				</xsl:text>
			    	<xsl:value-of select="//control[@id='submitLogin']/data/onclick"/>
					$('.smt-main-button').removeClass('loading');
<!-- 					return false; -->
				}
				
				var loginName = $("#smart-login-prestador").is(":checked")?"E-mail":"Número da Carteirinha";
		     	
		     	if($("#str_login").val() == "")
		     	{	
		     		
		     		if($("#smart-login-cliente").is(":checked"))
		     		{
		      			alert('É necessário informar o Número da Carteira ou o CPF.');
		      			$('.smt-main-button').removeClass('loading');
		      			return false;
		     		}
		     	
		      		alert('Favor preencher o '+loginName+'.');
		      		$('.smt-main-button').removeClass('loading');
		      		return false;
		     	}
		     	
		     	if($("#smart-login-prestador").is(":checked"))
	     		{
	     			if(!isEmail($("#str_login").val()))
		      		{
		      			alert('Formato de E-mail inválido.');
		      			$('.smt-main-button').removeClass('loading');
		      			return false;
		      		}
	     		}
		     	
		     	if($("#password").val() == "")
		     	{
		      		alert('Favor preencher a Senha.');
		      		$('.smt-main-button').removeClass('loading');
		      		return false;
		     	}
		     	
		     	<xsl:value-of select="//control[@id='submitLogin']/data/onclick"/>
		     	$('.smt-main-button').removeClass('loading');
		    }   
		    
		    function listLogin(){
		    
		    	if(!$('input:radio[name=beneficiarioListCPF]').is(':checked'))
		    	{
		    		alert("É necessário selecionar um Beneficiário.");
		    		$('.smt-main-button').removeClass('loading');
		    		return false;
		    	}
		    	
		    	var numero_carteira = $('input:radio[name=beneficiarioListCPF]:checked').val();
		    	
		    	$("#login").val(numero_carteira);
		    	
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
