package br.com.qualicorp.redenarede.service.administracaodelayout.postload;

import org.w3c.dom.Node;

import lumis.doui.source.ISourceData;
import lumis.doui.source.Source;
import lumis.doui.source.TabularData;
import lumis.doui.source.postloadprocessor.IPostLoadProcessor;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.util.ITransaction;

public class NomeEstipulandoCheckListPostload  implements IPostLoadProcessor
{
	@SuppressWarnings("rawtypes")
	@Override
	public void processSource(SessionConfig session, Source source, Node parameterNode, ITransaction transaction) throws PortalException 
	{
		TabularData tabularData = (TabularData)source.getData();
		
        for( ISourceData row : tabularData.getRows() )
        {  
    		row.put("nome", addZeros(row.get("codigo").toString()) + " - " + addZeros(row.get("subestipulante").toString()) + " - " + row.get("nome"));
        }
	}
	
	public String addZeros(String number)
	{
		int zeros = 6 - number.length();
		
		if (zeros > 0)
		{
			for (int i = 0; i < zeros; i++)
				number = "0" + number;
		}
		
		return number;
	}
}