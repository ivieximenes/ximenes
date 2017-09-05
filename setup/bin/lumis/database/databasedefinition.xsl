<!-- $Revision: 16974 $ $Date: 2015-02-20 11:16:28 -0200 (Fri, 20 Feb 2015) $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration = "yes" />

	<!-- match table -->
	<xsl:template match="table">
		<xsl:variable name="dbType" select="../@dbType" />
CREATE TABLE <xsl:value-of select="@name"/>
(	<xsl:for-each select="fields/field[not(@dbType) or @dbType=$dbType]">
		<xsl:apply-templates select="."/>
		<xsl:if test="position()!=last()"><xsl:text>,</xsl:text></xsl:if>
	</xsl:for-each>

	<xsl:for-each select="constraints/constraint">
		<xsl:text>,</xsl:text>
	<xsl:text>
	</xsl:text>
		<xsl:apply-templates select="."/>
	</xsl:for-each>
)<xsl:call-template name="sqlTableStatementEnd"/>
	</xsl:template>

	<!-- match a field -->
	<xsl:template match="field">
		<xsl:call-template name="fieldName"/>
		<xsl:call-template name="fieldDataType"/>
		<xsl:call-template name="fieldCollation"/>
		<xsl:call-template name="fieldConstraint"/>
		<xsl:call-template name="fieldNotNull"/>
	</xsl:template>

	<xsl:template name="fieldName">
		<!-- the generic transformer does not implement field data type -->
	</xsl:template>

	<xsl:template name="fieldDataType">
		<!-- the generic transformer does not implement field data type -->
	</xsl:template>
	
	<xsl:template name="fieldCollation">
		<!-- the generic transformer does not apply field collation -->
	</xsl:template>
	
	<xsl:template name="fieldConstraint">
		<xsl:for-each select="constraint">
			<xsl:text> DEFAULT </xsl:text>
			<xsl:call-template name="fieldConstraintDefaultValue" />
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="fieldDataTypeSize">
		<xsl:choose>
			<xsl:when test="@size='' or not(@size)">
				<xsl:text>(255)</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>(</xsl:text><xsl:value-of select="@size"/><xsl:text>)</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>	

	<xsl:template name="fieldNotNull">
		<xsl:choose>
			<xsl:when test="@isNotNull='true'">
				<xsl:text> NOT NULL</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text> NULL</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="fieldConstraintDefaultValue">
		<xsl:choose>
			<xsl:when test="@defaultValue='$date$'">
				<xsl:call-template name="fieldConstraintDefaultDate"/>
			</xsl:when>
			<xsl:when test="../@type='string'">'<xsl:value-of select="@defaultValue"/>'</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="@defaultValue"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
		
	<xsl:template name="fieldConstraintDefaultDate">
		<!-- the generic transformer does not implement default date-->
	</xsl:template>

	<xsl:template match="constraint" name="constraint">
		<xsl:text>CONSTRAINT </xsl:text>
		<xsl:value-of select="@name"/>
		<xsl:choose>
			<xsl:when test="@type='primaryKey'">
				<xsl:text> PRIMARY KEY </xsl:text>
				<xsl:call-template name="tableConstraintFields" />
			</xsl:when>
			<xsl:when test="@type='unique'">
				<xsl:text> UNIQUE </xsl:text>
				<xsl:call-template name="tableConstraintFields" />
			</xsl:when>
			<xsl:when test="@type='foreignKey'">
				<xsl:text> FOREIGN KEY </xsl:text>
				<xsl:call-template name="tableConstraintFields" />
				<xsl:call-template name="tableConstraintFKReferences" />
				<xsl:if test="@onDeleteCascade='true'">
					<xsl:text> ON DELETE CASCADE </xsl:text>
				</xsl:if>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="tableConstraintFKReferences">
		<xsl:for-each select="references">
			<xsl:text> REFERENCES </xsl:text>
			<xsl:value-of select="@table"/>
			<xsl:call-template name="tableConstraintFields"/>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="tableConstraintFields">
		<xsl:if test="count(fields/field) > 0">
			<xsl:text>(</xsl:text>
			<xsl:for-each select="fields/field">
				<xsl:if test="position() > 1">
					<xsl:text>,</xsl:text>
				</xsl:if>
				<xsl:value-of select="@name"/>
			</xsl:for-each>
			<xsl:text>)</xsl:text>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="view">
		<xsl:choose>
			<xsl:when test="description!=''">
-- <xsl:value-of select="description" />
			</xsl:when>
		</xsl:choose>
CREATE VIEW <xsl:value-of select="@name" /> AS
(
	<xsl:variable name="dbType" select="../@dbType" />
	<xsl:choose>
		<xsl:when test="query[@dbType=$dbType]!=''">
			<xsl:value-of disable-output-escaping="yes" select="query[@dbType=$dbType]"/>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of disable-output-escaping="yes" select="query[not(@dbType)]" />
		</xsl:otherwise>
	</xsl:choose>
)<xsl:call-template name="sqlStatementEnd"/>
	</xsl:template>

	<xsl:template match="sqlQuery">
		<xsl:variable name="dbType" select="../@dbType" />
		<xsl:choose>
			<xsl:when test="query[@dbType=$dbType]!=''">
<xsl:value-of disable-output-escaping="yes" select="query[@dbType=$dbType]"/>
<xsl:call-template name="sqlStatementEnd"/>
			</xsl:when>
			<xsl:when test="query[not(@dbType)]!=''">
<xsl:value-of disable-output-escaping="yes" select="query[not(@dbType)]" />
<xsl:call-template name="sqlStatementEnd"/>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="index">
		<xsl:if test="description!=''">
-- <xsl:value-of select="description" />
		</xsl:if>
CREATE <xsl:if test="@unique='true'"><xsl:text>UNIQUE </xsl:text></xsl:if>INDEX <xsl:value-of select="@name"/> ON <xsl:value-of select="@table"/> <xsl:call-template name="tableConstraintFields" /><xsl:call-template name="sqlStatementEnd"/>
	</xsl:template>
	
	<xsl:template match="constraint[@table!='']">
		<xsl:if test="description!=''">
-- <xsl:value-of select="description" />
		</xsl:if>
ALTER TABLE <xsl:value-of select="@table"/> ADD <xsl:call-template name="constraint"/><xsl:call-template name="sqlStatementEnd"/>
	</xsl:template>
	
	<xsl:template name="sqlStatementEnd">
		<xsl:text>;</xsl:text>
	</xsl:template>
	
	<xsl:template name="sqlTableStatementEnd">
		<xsl:text>;</xsl:text>
	</xsl:template>	
	
</xsl:stylesheet>