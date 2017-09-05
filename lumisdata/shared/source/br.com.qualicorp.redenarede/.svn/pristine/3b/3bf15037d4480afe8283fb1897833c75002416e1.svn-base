package br.com.qualicorp.redenarede.service.banner;

import lumis.content.table.ContentTableDeleteDataProcessActionHandler;
import lumis.portal.PortalException;

/**
 * Process action handler for Banner content removals.
 * <p>
 * Banner data changes need not update the interface or page cache since the data
 * rendered is generated serverside, and the client side javascript does not change.
 *
 * @version $Revision: 8100 $ $Date: 2007-09-03 11:54:38 -0300 (Mon, 03 Sep 2007) $
 * @since 4.0.11
 */
public class BannerDeleteDataProcessActionHandler extends ContentTableDeleteDataProcessActionHandler
{
	@Override
	protected boolean shouldSendRenderDataChangedNotification() throws PortalException
	{
		return false;
	}
}
