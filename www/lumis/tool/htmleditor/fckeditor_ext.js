// $Revision: 7522 $ $Date: 2007-06-21 11:10:55 -0300 (Thu, 21 Jun 2007) $
FCKeditor.prototype.Create = function()
{
	// Check for errors
	if ( !this.InstanceName || this.InstanceName.length == 0 )
	{
		this._ThrowError( 701, 'You must specify an instance name.' ) ;
		return ;
	}

	if ( !this.CheckBrowser || this._IsCompatibleBrowser() )
	{
		document.write( '<input type="hidden" id="' + this.InstanceName + '" name="' + this.InstanceName + '" value="' + this._HTMLEncode( this.Value ) + '" style="display:none" />' ) ;
		document.write( this._GetConfigHtml() ) ;
		document.write( this._GetIFrameHtml() ) ;
	}
	else
	{
		var sWidth  = this.Width.toString().indexOf('%')  > 0 ? this.Width  : this.Width  + 'px' ;
		var sHeight = this.Height.toString().indexOf('%') > 0 ? this.Height : this.Height + 'px' ;
		document.write('<textarea name="' + this.InstanceName + '" rows="4" cols="40" style="WIDTH: ' + sWidth + '; HEIGHT: ' + sHeight + '">' + this._HTMLEncode( this.Value ) + '<\/textarea>') ;
	}
}
