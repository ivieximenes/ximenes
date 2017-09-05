package br.com.qualicorp.redenarede.service.auditoria.postload;

import java.util.Map.Entry;
import java.util.Set;

import org.w3c.dom.Node;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import br.com.qualicorp.redenarede.commons.utils.JsonUtils;
import br.com.qualicorp.redenarede.service.auditoria.processaction.AuditProcessActionHandler;
import br.com.qualicorp.redenarede.service.auditoria.to.TableTO;
import lumis.content.ContentManagerFactory;
import lumis.content.core.Content;
import lumis.doui.source.ISourceData;
import lumis.doui.source.Source;
import lumis.doui.source.TabularData;
import lumis.doui.source.postloadprocessor.IPostLoadProcessor;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.util.HtmlUtil;
import lumis.util.ITransaction;

public class AuditPostLoadProcessor implements IPostLoadProcessor
{
	@SuppressWarnings("unchecked")
	@Override
	public void processSource(SessionConfig sessionConfig, Source source, Node parametersNode, ITransaction transaction) throws PortalException
	{
		TabularData tabularData = (TabularData) source.getData();

		for (ISourceData row : tabularData.getRows())
		{			
			String content = (String) row.get("content");
			StringBuilder sb = new StringBuilder();

			JsonObject jsonRoot = JsonUtils.getJsonObject( content );
			
			if (jsonRoot.has(AuditProcessActionHandler.AUDITORIA_FIELDS_OLD))
			{
				JsonObject jsonOld = jsonRoot.getAsJsonObject(AuditProcessActionHandler.AUDITORIA_FIELDS_OLD);
				
				if (jsonOld != null)
				{
					sb.append("<div>");
					sb.append("<h1 style='margin-top: 20px;'>Antes</h1>");
					
					appendFields(jsonOld, false, sb);
					
					sb.append("</div>");
				}
				
				JsonObject jsonNew = jsonRoot.getAsJsonObject(AuditProcessActionHandler.AUDITORIA_FIELDS_NEW);
				
				if (jsonNew != null)
				{
					sb.append("<div>");
					sb.append("<h1 style='margin-top: 30px;'>Depois</h1>");
					
					appendFields(jsonNew, false, sb);
					
					sb.append("</div>");
				}
			}
			else
			{
				appendFields(jsonRoot, false, sb);
			}
			
			row.put( "content", sb.toString() );
			row.put( "labelId", getLabelId(row) );
		}
	}
	
	private void appendFields(JsonObject jsonObject, boolean isFist, StringBuilder sb)
	{
		sb.append("<div");
		
		if (isFist)
			sb.append(" style='margin-top: 35px; padding-left: 50px;'");
		
		sb.append(">");
		
		JsonElement title = jsonObject.get(TableTO.$AUDITORIA_TITLE);
		
		if (title != null)
			sb.append("<h3>").append(title.getAsString()).append("</h3>");
		
		Set<Entry<String, JsonElement>> jsons = jsonObject.entrySet();
		
		for( Entry<String, JsonElement> json : jsons)
		{
			if (json.getKey().equals(TableTO.$AUDITORIA_TITLE) || json.getKey().equals(TableTO.$AUDITORIA_RELATION))
				continue;
			
			sb.append("<div class='lum-field lum-field-id-value'>");
			sb.append("	  <div class='lum-field-label'><span class='lum-label'>" + json.getKey() + "</span></div>");
			sb.append("	  <div class='lum-field-value'>" + HtmlUtil.encode(json.getValue().toString()) + "</div>");
			sb.append("</div>");
		}
		
		JsonArray relations = jsonObject.getAsJsonArray(TableTO.$AUDITORIA_RELATION);
		
		if (relations != null)
		{
			for (JsonElement relation : relations)
			{
				appendFields((JsonObject) relation, true, sb);
			}
		}
		
		sb.append("</div>");
	}
	
	private String getLabelId(ISourceData row)
	{
		Content contentLumis = null;
		
		try
		{
			contentLumis = ContentManagerFactory.getContentManager().getContent((String) row.get("itemId"));
		}
		catch (PortalException e)
		{
		}
		
		if (contentLumis != null)
		{
			return "ID (content)";
		}
		
		return "ID";
	}
}