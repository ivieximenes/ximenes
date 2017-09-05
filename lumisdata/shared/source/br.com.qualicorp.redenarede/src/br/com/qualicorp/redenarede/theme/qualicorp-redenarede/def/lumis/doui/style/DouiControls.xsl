<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:lum="http://www.lumis.com.br/doui" exclude-result-prefixes="lum" version="1.0" >
<xsl:import href="lum_basetheme/DouiControls.xsl"/>
<xsl:output omit-xml-declaration="yes" />
	
	<xsl:template match="control[@type='lum_inputHtmlEditor']" mode="includeCustomPlugins">
		<xsl:apply-imports/>
		
		(function () {
		
			var urlFile = "${lum_url('lumis/tool/ckeditor/customplugins/lumisRemoveformat/plugin.js')}";
			var urlFolder = urlFile.substring(0, urlFile.length - "plugin.js".length);
			
			CKEDITOR._lumAddPlugin( 'lumisRemoveformat', '../../../' + urlFolder, 'plugin.js');
		})();
		
	</xsl:template>
	
	<xsl:template match="control[@type='lum_inputHtmlEditor']" mode="listExtraPlugins"><xsl:apply-imports />,lumisRemoveformat</xsl:template>
	
	<!--
		Custom CKEditor buttons
	-->
	<xsl:template match="control[@type='lum_inputHtmlEditor']" mode="listToolbarButtons">
		{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','-','Subscript','Superscript' ] },
		{ name: 'util', items : ['Undo','Redo','-','Find','Replace','-','SelectAll','-','lumisRemoveformat'] },
		{ name: 'paragraph', items : [ 'BulletedList','NumberedList','-','Outdent','Indent' ] },
		{ name: 'paragraph2', items : [ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock' ] },
		'/',
		{ name: 'links', items : [ 'lumisPage','lumisMedia','lumisContentLink', 'lumisDocument', 'Link','Unlink','Anchor' ] },
		{ name: 'insert', items : [ 'Image','Table','Smiley','SpecialChar' ] },
		{ name: 'styles', items : [ 'Format','Font','FontSize' ] },
		{ name: 'colors', items : [ 'TextColor','BGColor' ] },
		{ name: 'code', items : [ 'Maximize', 'Source' ] }
	</xsl:template>
	
	<!-- LOG DE AUDITORIA -->
	<!-- SERVE PARA PREENCHER O FILTER QUANDO VEM DE OUTRA INTERFACE -->
	<xsl:template match="control[@id='serviceIdLogAuditFilter']">
		<input type="hidden" name="serviceIdLogAuditFilter" value="{/renderData/douiContext/serviceId}" />
	</xsl:template>
</xsl:stylesheet>