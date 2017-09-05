package br.com.qualicorp.redenarede.webservice.stub.handler;

import java.io.ByteArrayOutputStream;
import java.util.Set;

import javax.xml.namespace.QName;
import javax.xml.soap.SOAPMessage;
import javax.xml.ws.handler.MessageContext;
import javax.xml.ws.handler.soap.SOAPHandler;
import javax.xml.ws.handler.soap.SOAPMessageContext;

import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class PrestadorHandlerServiveLog implements SOAPHandler<SOAPMessageContext>
{
   private static ILogger logger = LoggerFactory.getLogger(PrestadorHandlerServiveLog.class);
   
   private static String[] secretsTags = {"SenhaAtual", "SenhaNova", "ConfirmacaoSenha"};
   
   @Override
   public boolean handleMessage(SOAPMessageContext context)
   {
	    Boolean isRequest = (Boolean) context.get(MessageContext.MESSAGE_OUTBOUND_PROPERTY);
 
		try
		{
			SOAPMessage soapMsg = context.getMessage();
			
            soapMsg.saveChanges();
            
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            
            soapMsg.writeTo(byteArrayOutputStream);
            
            String xml = new String(byteArrayOutputStream.toByteArray());
            
            xml = StringUtils.replaceContentXMLTags(xml, "*****", secretsTags);
            
            if( isRequest )
            	logger.debug("*** XML Enviado: \n" + xml +" \n***");
            else
            	logger.debug("*** XML Consultado: \n" + xml + " \n***");
            
            context.put("xml", new String(byteArrayOutputStream.toByteArray()));
		}
		catch(Exception e)
		{
			logger.error("Erro em handleMessage(SOAPMessageContext context)", e);
		}
	 
	   return true;
   }
   
	@Override
	public boolean handleFault(SOAPMessageContext context)
	{
		try
		{
			SOAPMessage soapMsg = context.getMessage();
			
	        soapMsg.saveChanges();
	        
	        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
	        
	        soapMsg.writeTo(byteArrayOutputStream);
	        
	        String xmlEnviado = (String) context.get("xml");
	        
	        xmlEnviado = StringUtils.replaceContentXMLTags(xmlEnviado, "*****", secretsTags);
	        
	        logger.debug("*** Erro: \n" + new String(byteArrayOutputStream.toByteArray()) + "\n*** \nXML Enviado: \n" + xmlEnviado + "\n***");
		}
		catch(Exception e)
		{
			logger.error("Erro em handleFault(SOAPMessageContext context)", e);
		}
		return true;
	}
 
	
	@Override
	public void close(MessageContext context){}
 
	@Override
	public Set<QName> getHeaders()
	{		
		return null;
	} 
}
