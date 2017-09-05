<?xml version="1.0" encoding="ISO_8859-1"?>
<!-- $Revision: 15365 $ $Date: 2013-05-22 10:55:59 -0300 (Wed, 22 May 2013) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output omit-xml-declaration = "yes" />
	

	<xsl:template match="/">
	<script type="text/javascript" src="js/bjqs-1.3.min.js"></script> 
  	<script class="secret-source">
        $(document).ready(function($) {

          $('#banner-fade').bjqs({
            height      : 270,
            width       : 640,
            responsive  : true,
            automatic	: true,
            showcontrols: false,
            showmarkers	: false,
            animtype 	: 'slide',
            usecaptions : false,
            animspeed 	: 6000
          });

        });
        
      </script>
		<div id="banner-fade" >
			<ul class="bjqs">
				<xsl:for-each select="//control[@type='lum_banner']/banners/banner/image">
					<li>
						<xsl:if test="imageProperties/onclickLinkType = '0'">
						
							<xsl:if test="imageProperties/onClickPopup = 'true'">
								<a href="javascript:window.open('{imageProperties/onclickUrl}', '_blank',{imageProperties/onClickPopupProperties});">
									<img style="border:0;" src="{src}"  width="640" height="270"/>
								</a>
							</xsl:if>
							<xsl:if test="imageProperties/onClickPopup = 'false'">
								<a href="{imageProperties/onclickUrl}">
									<img style="border:0;" src="{src}"  width="640" height="270"/>
								</a>
							</xsl:if>
						</xsl:if>
						<xsl:if test="imageProperties/onclickLinkType = '1'">
							<a href="main.jsp?lumPageId={imageProperties/onclickPageId}">
								<img style="border:0;" src="{src}"  width="640" height="270"/>
							</a>
						</xsl:if>
						<xsl:if test="imageProperties/onclickLinkType = '2'">
							<img style="border:0;" src="{src}"  width="640" height="270"/>
						</xsl:if>
					</li>
				</xsl:for-each>
			</ul>
		</div>
	</xsl:template>
</xsl:stylesheet>