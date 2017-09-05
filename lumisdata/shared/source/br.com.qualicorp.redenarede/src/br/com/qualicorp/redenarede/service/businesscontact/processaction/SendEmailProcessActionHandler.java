package br.com.qualicorp.redenarede.service.businesscontact.processaction;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import lumis.doui.processaction.GenericProcessActionHandler;
import lumis.doui.source.field.ISourceField;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.sendmail.IMailConfig;
import lumis.portal.sendmail.ISendMailManager;
import lumis.portal.sendmail.ISingleMail;

public class SendEmailProcessActionHandler extends GenericProcessActionHandler
{
	private final String ELOGIO = "Elogio";
	private final String SUGESTAO = "Sugestão";
	private final String RECLAMACAO = "Reclamação";
	private final String DUVIDA = "Dúvida";
	
	private final String BENEFICIARIO = "Beneficiário";
	private final String PRESTADOR = "Prestador";
	
	@Override
	public void processAction() throws PortalException
	{
		try {
			String emailto = ManagerFactory.getServiceInstanceManager().getCustomProperty(sessionConfig, douiContext.getRequest().getServiceInstanceConfig().getId(), "mailTo", transaction);
			if(emailto == null)
				return;
			
			
			ISendMailManager sendMailManager = ManagerFactory.getSendMailManager();
			IMailConfig mailConfig = sendMailManager.getMailConfig(sessionConfig, transaction);
			String emailfrom = mailConfig.getDefaultFromAddress();
			StringBuilder emailBody = new StringBuilder();
			
			String tipoDaMensagem = "";
			Map<String, String> fields = new HashMap<String, String>();
			
			for(Object fieldObject :this.source.getFields())
			{
				ISourceField field = (ISourceField) fieldObject;
				String fieldId = field.getId();
				
				Object parameterValue = this.getParameter(fieldId);
				if(parameterValue != null)
				{	
					String value = field.getConverter().convert(String.class, parameterValue);
					
					if(fieldId.equals("perfil"))
						value = recuperaPerfilPorCodigo(Integer.parseInt(value));
					
					if(fieldId.equals("motivo_contato"))
						value = tipoDaMensagem = recuperaTipoPorCodigo(Integer.parseInt(value));
					
					fields.put(field.getName(), value);
				}
				
			}
			
			emailBody.append(fields.get("Email").trim());
			emailBody.append("<br/>");
			
			DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
			Calendar cal = Calendar.getInstance();
			
		    emailBody.append("Fale Conosco - " + fields.get("Assunto").trim() + " (" + dateFormat.format(cal.getTime()) + ")");	
			emailBody.append("<br/>");
			emailBody.append("<label>Perfil: </label>" + fields.get("Perfil").trim());
			emailBody.append("<br/>");
			emailBody.append(fields.get("Nome").trim());
			emailBody.append("<br/>");
			emailBody.append("<label>Telefone: </label>" + fields.get("Telefone").trim());
			emailBody.append("<br/>");
			emailBody.append("<label>Mensagem: </label>" + fields.get("Mensagem"));
			emailBody.append("<br/><br/>");
			
			ISingleMail mail = sendMailManager.createSingleMail();  
			mail.setTo(emailto);
			mail.setSourceComponent(douiContext.getRequest().getServiceInstanceConfig().getName());  
			mail.setFrom(emailfrom);
			mail.setSubject(localize("STR_SUBJECT")+" - "+tipoDaMensagem);  
			mail.setCharset("utf-8");
			mail.getBody().setHtmlMsg(emailBody.toString());
			
			sendMailManager.addMailToSendQueue(SessionConfig.getCurrentSessionConfig(), mail, null, transaction);
			
			super.processAction();
		} catch (Exception e) {
			throw new PortalException(localize("STR_ERROR_CONTACTUS"), e);
		}
	}
	
	private String recuperaPerfilPorCodigo(int codPerfil){
		
		switch (codPerfil) {
		case 1:
			return BENEFICIARIO;
			
		case 2:
			return PRESTADOR;
			
		default:
			break;
		}
		
		return "";
	}
	
	private String recuperaTipoPorCodigo(int codPerfil){
		
		switch (codPerfil) {
		case 1:
			return ELOGIO;
			
		case 2:
			return SUGESTAO;
			
		case 3:
			return RECLAMACAO;
		
		case 4:
			return DUVIDA;
			
		default:
			break;
		}
		
		return "";
	}
}
