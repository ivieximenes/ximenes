<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" method="html" />
	
	<xsl:template match="/">

		<section class="smt-carousel smt-carousel-wrapper">
			<div class="smt-carousel-items">
				<div class="smt-carousel-slide">
					<div class="smt-carousel-content">
						<h1 class="smt-carousel-title">Fale conosco</h1>
						<p>Entre em contato com a gente por telefone através das nossas centrais 24 horas ou por e-mail no formulário.</p>
					</div><xsl:text disable-output-escaping="yes"><![CDATA[<!--
						-->]]></xsl:text><img class="smt-carousel-image" src="img/banner-03.png" alt="Ilustração de atendente de telecomunicação."/>
				</div>
			</div>
		</section>

		<nav class="smt-breadcrumb">
			<ul class="smt-breadcrumb-list">
				<li>Você está em</li>
				<li><a href="/">Home</a></li>
				<li>Fale conosco</li>
			</ul>
		</nav>

		<section class="smt-section smt-section-contactus">
			<div class="smt-section-wrapper">

				<div class="smt-contactus-info">
					<h2 class="smt-contactus-title">Central de atendimento, central de cuidados e SAC - Atendimento 24 horas</h2>
					<p><a href="tel:30044633" class="smt-contactus-phone">3004 4633</a> - Capitais e regiões metropolitanas</p>
					<p><a href="tel:08007799005" class="smt-contactus-phone">0800 779 9005</a> - Demais regiões</p>
					<h2 class="smt-contactus-title">Ouvidoria</h2>
					<a href="mailto:ouvidoria@gamasmart.com.br">ouvidoria@gamasmart.com.br</a>
					<h2 class="smt-contactus-title">Central de atendimento ao Prestador</h2>
					<p><a href="tel:08007799005" class="smt-contactus-phone">0800 779 9005</a></p>
				</div>
				<div class="smt-form-contactus-holder">
					<div class="smt-warning success">
	                	<p>Sua mensagem foi enviada com sucesso.</p>
	            	</div>
	            	<div class="smt-warning error">
	                	<p>Houve erros ao processar sua informação. Tente novamente.</p>
	            	</div>
					<form class="smt-form-contactus" action="{//control[@type='lum_form']/data/action-commit}" method="post" id="contactform" accept-charset="UTF-8">
	                       <div class="smt-input-holder">
	                           <label for="smart-contact-name" class="smt-form-label visuallyhidden"></label>
	                           <input id="nome" class="smt-input" type="text" placeholder="Seu nome" name="nome"/>
	                       </div>
	                       <div class="smt-input-holder">
	                           <label for="smart-contact-email" class="smt-form-label visuallyhidden"></label>
	                           <input id="email" class="smt-input" type="email" placeholder="Seu e-mail" name="email"/>
	                       </div>
	                       <div class="smt-input-holder">
	                            <label for="smart-contact-type" class="smt-form-label visuallyhidden"></label>
	                            <select class="smt-input smt-select" name="perfil" data-placeholder="Tipo" id="perfil">
	                            	<option value=""></option>
	                            	<option value="1">Cliente</option>
	                            	<option value="2">Prestador</option>
	                            </select>
	                            <input type="hidden" value="" name="perfil_hidden" class="smt-input" id="perfil_hidden"/> 
	                        </div>
	                       <div class="smt-input-holder">
	                           <label for="smart-contact-subject" class="smt-form-label visuallyhidden"></label>
	                           <select class="smt-input smt-select" id="motivo_contato" name="motivo_contato" data-placeholder="Assunto">
	                           	<option value=""></option>
	                           	<option value="1">Elogio</option>
	                           	<option value="2">Sugestão</option>
	                           	<option value="3">Reclamação</option>
	                           	<option value="4">Dúvida</option>
	                           </select>
	                           <input type="hidden" value="" name="motivo_contato_hidden" class="smt-input" id="motivo_contato_hidden"/> 
	                       </div>
	                       <div class="smt-input-holder">
	                           <label for="smart-contact-phone" class="smt-form-label visuallyhidden"></label>
	                           <input class="smt-input" type="tel" placeholder="Telefone" id="telefone" name="telefone"/>
	                       </div>
	                       <div class="smt-input-holder">
	                           <label for="smart-contact-message" class="smt-form-label visuallyhidden"></label>
	                           <textarea class="smt-input" placeholder="Escreva aqui sua mensagem." name="mensagem" rows="4"></textarea>
	                       </div>
	                       <div class="smt-input-holder smt-input-actions">
	                           <!-- <button type="submit" class="smt-main-button">Enviar</button> -->
	                           <input type="submit" id="buttonform" name="op" value="Enviar" class="smt-main-button" onclick="ga('send', 'event', 'botao', 'clique', 'fale_conosco-enviar');"/>
	                       </div>
	                   </form>
					</div>
			</div>
		</section>
		
		<script type="text/javascript">
			<xsl:text disable-output-escaping="yes">
			<![CDATA[
			$(".ga_send").focusout(function(){
				ga('send','event', 'Formulario-fale-cadastro-prestador', $(this).attr("name"),$(this).val());
			});	
			
			$(document).ready(function(){
				
				$( "#perfil" ).change(function() {
					var perfilHidden = $('#perfil_hidden').val($( "#perfil" ).val());
					
					if(perfilHidden !="") $('#perfil_hidden-error').hide();
				})
				
				$( "#motivo_contato" ).change(function() {
					var motivo_contatoHidden = $('#motivo_contato_hidden').val($( "#motivo_contato" ).val());
					
					if(motivo_contatoHidden !="") $('#motivo_contato_hidden-error').hide();
				})					
						
				$( "input[name='perfil']" ).change(function() {
				  if($( this ).val()==2)
				  {
				  	$(".divCpf").hide();
				  	$("#cpf").val("");
				  }
				  else
				  {
				  	$( ".divCpf" ).show();
				  }	
				});
				
				$('#email').keyup(function() {
					var email = $('#email').val();
					if ( email.substring(0,1)==" " || email.substring(email.length-1)==" ")
				  		$('#email').val($.trim($('#email').val()));
				});
				
				var curForm = $("#contactform");
				
				curForm.validate({
					ignore: "input[type='text']:hidden",
					rules: {
						perfil_hidden: {required: true},
						nome: {required: true, minlength: 4},
						email: {required: true, email: true},
						telefone: {required: true},
						mensagem: {required: true},
						motivo_contato_hidden: {required: true},
					},
					messages: {
						perfil_hidden: {required: "Favor preencher o perfil"},
						nome: {required: "Favor preencher seu nome completo", minlength: "O nome deve ter pelo menos 4 caracteres"},
						email: "Favor preencher com um e-mail válido",
						telefone: "Favor preencher seu telefone",
						mensagem: "Favor preencher a mensagem",
						motivo_contato_hidden: {required: "Favor preencher o motivo do contato"},
					}, 
					errorClass: 'error smt-message-error',
					errorElement: "span",
					submitHandler: function(form){
						$.ajax({
							type: "POST",
							dataType: "json",
							url: curForm.attr("action"),
							data: curForm.serialize(),
							success: function(data){	
								// success handling here
								curForm[0].reset();
								$('.smt-warning.success').addClass('open');
								$(".smt-warning.error").removeClass('open');
							}

						}).fail(function(data){
						
							try{
								var dataObj = $.parseJSON(data.responseText);
								var errorMessage = dataObj.responseParameters.doui_error;
								if(errorMessage == null)
									errorMessage = dataObj.responseParameters.error.message;
									
								if(errorMessage != null)
								{
									$(".smt-warning.error").text(errorMessage);
								
									console.log(errorMessage);
								}	
							}catch(e){console.log(e);}
							
							$(".smt-warning.error").addClass('open');
						
							// fail handling here
						});
						return false;
					}
				});
				
				$('#telefone').mask("(99) 9999-9999?9").ready(function (event) {
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
				
			});
			]]>
		</xsl:text>
	</script>
	  
	</xsl:template>
	
</xsl:stylesheet>