package br.com.qualicorp.redenarede.service.administracaodelayout.controller;

import lumis.doui.control.DataBoundControl;
import lumis.doui.source.Source;
import lumis.doui.source.field.ISourceField;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.util.XmlUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

@SuppressWarnings("rawtypes")
public class InputScriptGeneratorControl extends DataBoundControl
{
	private static ILogger logger = LoggerFactory.getLogger(InputScriptGeneratorControl.class);
	
	@Override
	public void setRenderData() throws PortalException
	{
		super.setRenderData();
		
		if(getValue() != null)
			XmlUtil.addTextNode(controlDefinitionNode, "data", "value", getConverter().convert(String.class, getValue()));

		String onEventScript = getClientEventHandlerScript("onChange", false);
		
		if (onEventScript != null)
			XmlUtil.addTextNode(controlDefinitionNode, "clientEventHandler", "onChange", onEventScript);

		onEventScript = getClientEventHandlerScript("onKeyUp", false);
		
		if (onEventScript != null)
			XmlUtil.addTextNode(controlDefinitionNode, "clientEventHandler", "onKeyUp", onEventScript);

		onEventScript = getClientEventHandlerScript("onKeyDown", false);
		
		if (onEventScript != null)
			XmlUtil.addTextNode(controlDefinitionNode, "clientEventHandler", "onKeyDown", onEventScript);
		
		if(XmlUtil.readAttributeString("isPrimaryInput", controlDefinitionNode) == null)
		{
			Source  source         = getSource();
			boolean isPrimaryInput = false;
			
			if(source != null && getDataId() != null)
			{
				ISourceField field = source.getField(getDataId());
				
				if(field != null)
					isPrimaryInput = field.isPrimaryName();
			}
			
			if(isPrimaryInput)
			{
				XmlUtil.addNodeAttr(controlDefinitionNode, "isPrimaryInput", "true");
			}
		}
	}
	
	/*
	 * (non-Javadoc)
	 * @see lumis.doui.control.DataBoundControl#buildSubControls()
	 */
	public void buildSubControls() throws PortalException
	{
		super.buildSubControls();
		
		Layout layout = new Layout();
		
		if(layout.nomeLayout==null)
			return;
		
		StringBuilder script = new StringBuilder();
		
		String id     = XmlUtil.readAttributeString("id", controlDefinitionNode);
		String pageId = douiContext.getRequest().getPageConfig().getId();
		
		script.append("<controls>"                                                );
		script.append(	"<control type=\"lum_script\">"                           );
		script.append(	  "<script>"                                              );
		script.append(			"$( document ).ready(function()"                  );
		script.append(			"{"                                               );
		script.append(				"$('.news-list').attr('style', '"			  );
		
		if(layout.corDeFundo!=null)
			script.append(				"background-color:#"+layout.corDeFundo+";" );
		
		if(layout.corDaLetra!=null)
			script.append(				"color:#"+layout.corDaLetra+";"            );
		
		if(layout.fonteDaLetra!=null)
			script.append(				"font-family:"+layout.fonteDaLetra+";"    );
		
		script.append(				"'); "						  				  );
		script.append(			"});"                                             );
		script.append(		"</script>"                                           );
		script.append(	 "</control>"                                             );
		script.append("</controls>"                                               );
		
		appendSubControls(script.toString());
	}
	
	
	private class Layout
	{
		private String nomeLayout;
		private String corDeFundo;
		private String corDaLetra;
		private String fonteDaLetra;
		
		public Layout() throws UnexpectedException
		{
			
		}
	}
}
