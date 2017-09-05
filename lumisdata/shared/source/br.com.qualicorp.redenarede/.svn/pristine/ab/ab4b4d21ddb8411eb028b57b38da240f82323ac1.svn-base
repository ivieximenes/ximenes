package br.com.qualicorp.redenarede.service.banner;

import lumis.content.table.ContentTableUpdateDataProcessActionHandler;
import lumis.portal.PortalException;
import lumis.service.media.field.MediaDataType;

/**
 * Process action handler for Banner content updates.
 * <p>
 * Banner data changes need not update the interface or page cache since the data
 * rendered is generated serverside, and the client side javascript does not change.
 *
 * @version $Revision: 14372 $ $Date: 2012-06-08 17:36:32 -0300 (Fri, 08 Jun 2012) $
 * @since 4.0.11
 */
public class BannerUpdateDataProcessActionHandler extends ContentTableUpdateDataProcessActionHandler
{
	public void processAction() throws PortalException
	{
		Integer type = getParameter("type", Integer.class);
		if(type != null && type.intValue() == 1)
		{
			MediaDataType.Data imageDataType =  (MediaDataType.Data)getParameter("image");
			
			if(imageDataType != null && !imageDataType.getFullPath().toLowerCase().endsWith(".swf"))
				throw new PortalException("STR_INVALID_FLASH_FILE", getResource());
		}
		
		super.processAction();
	}
	
	@Override
	protected boolean shouldSendRenderDataChangedNotification() throws PortalException
	{
		return false;
	}
}
