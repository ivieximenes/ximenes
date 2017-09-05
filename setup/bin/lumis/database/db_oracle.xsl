<!-- $Revision: 13415 $ $Date: 2011-08-26 16:17:57 -0300 (Fri, 26 Aug 2011) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:import href="databasedefinition.xsl" />

	<xsl:output omit-xml-declaration = "yes" />
	
	<xsl:template name="fieldName">
		<xsl:value-of select="@name"/>
	</xsl:template>
	
	<xsl:template name="fieldDataType">
		<xsl:choose>
			<xsl:when test="@type='guid' or @type='lumisPrincipal'">
				<xsl:text> CHAR(32)</xsl:text>
			</xsl:when>
			<xsl:when test="@type='guidOrId'">
				<xsl:text> VARCHAR2(32)</xsl:text>
			</xsl:when>
			<xsl:when test="@type='string'">
				<xsl:choose>
					<xsl:when test="@fixed='true'">
						<xsl:choose>
							<xsl:when test="@unicode='false'">
								<xsl:text> CHAR</xsl:text>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text> NCHAR</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="@unicode='false'">
								<xsl:text> VARCHAR2</xsl:text>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text> NVARCHAR2</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:call-template name="fieldDataTypeSize"/>
			</xsl:when>
			<xsl:when test="@type='text'">
				<xsl:text> CLOB</xsl:text>
			</xsl:when>
			<xsl:when test="@type='binary'">
				<xsl:text> BLOB</xsl:text>
			</xsl:when>
			<xsl:when test="@type='integer'">
				<xsl:text> NUMBER(10)</xsl:text>
			</xsl:when>
			<xsl:when test="@type='long'">
				<xsl:text> NUMBER(19)</xsl:text>
			</xsl:when>
			<xsl:when test="@type='number'">
				<xsl:text> INT</xsl:text>
			</xsl:when>
			<xsl:when test="@type='double'">
				<xsl:text> DOUBLE PRECISION</xsl:text>
			</xsl:when>
			<xsl:when test="@type='date'">
				<xsl:text> DATE</xsl:text>
			</xsl:when>
			<xsl:when test="@type='time'">
				<xsl:text> DATE</xsl:text>
			</xsl:when>
			<xsl:when test="@type='dateTime'">
				<xsl:text> DATE</xsl:text>
			</xsl:when>
			<xsl:when test="@type='html'">
				<xsl:text> CLOB</xsl:text>
			</xsl:when>
			<xsl:when test="@type='boolean'">
				<xsl:text> NUMBER(1)</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>		

	<xsl:template name="fieldConstraint">
		<xsl:for-each select="constraint">
			<xsl:text> DEFAULT </xsl:text>
			<xsl:call-template name="fieldConstraintDefaultValue" />
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="fieldConstraintDefaultDate">
		<xsl:text> SYSDATE </xsl:text>
	</xsl:template>
	
</xsl:stylesheet>