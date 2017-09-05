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
				<xsl:text> VARCHAR(32)</xsl:text>
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
								<xsl:text> VARCHAR</xsl:text>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text> NVARCHAR</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:call-template name="fieldDataTypeSize"/>
			</xsl:when>
			<xsl:when test="@type='text'">
				<xsl:text> NTEXT</xsl:text>
			</xsl:when>
			<xsl:when test="@type='binary'">
				<xsl:text> IMAGE</xsl:text>
			</xsl:when>
			<xsl:when test="@type='integer'">
				<xsl:text> INT</xsl:text>
			</xsl:when>
			<xsl:when test="@type='long'">
				<xsl:text> BIGINT</xsl:text>
			</xsl:when>
			<xsl:when test="@type='number'">
				<xsl:text> INT</xsl:text>
			</xsl:when>
			<xsl:when test="@type='double'">
				<xsl:text> DOUBLE PRECISION</xsl:text>
			</xsl:when>
			<xsl:when test="@type='date'">
				<xsl:text> DATETIME</xsl:text>
			</xsl:when>
			<xsl:when test="@type='time'">
				<xsl:text> DATETIME</xsl:text>
			</xsl:when>
			<xsl:when test="@type='dateTime'">
				<xsl:text> DATETIME</xsl:text>
			</xsl:when>
			<xsl:when test="@type='html'">
				<xsl:text> NTEXT</xsl:text>
			</xsl:when>
			<xsl:when test="@type='boolean'">
				<xsl:text> TINYINT</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>		

	<xsl:template name="fieldCollation">
		<xsl:if test="@collate='binary'">
			<xsl:text> COLLATE Latin1_General_BIN</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template name="fieldConstraint">
		<xsl:for-each select="constraint">
			<xsl:text> CONSTRAINT </xsl:text>
			<xsl:value-of select="@name"/>
			<xsl:text> DEFAULT </xsl:text>
			<xsl:call-template name="fieldConstraintDefaultValue" />
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="fieldConstraintDefaultDate">
		<xsl:text> GETDATE() </xsl:text>
	</xsl:template>

	<xsl:template name="sqlStatementEnd">
		<xsl:text>
GO
</xsl:text>
	</xsl:template>
	
	<xsl:template name="sqlTableStatementEnd">
		<xsl:text>
GO
</xsl:text>
	</xsl:template>	
	
</xsl:stylesheet>