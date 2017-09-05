#-- Lumis Portal MySql Scripts

#-----------------------------------------------
#-- Generated SQL for: /lumis/portal/database
#-----------------------------------------------

	
CREATE TABLE lum_Principal
(	
		`principalId`
	 CHAR(32) NOT NULL,
		`shortId`
	 VARCHAR(100) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`type`
	 INT NOT NULL,
		`subType`
	 INT NOT NULL,
		`channelId`
	 VARCHAR(32) NULL,
	CONSTRAINT LUM_PK_PRINCIPAL PRIMARY KEY (principalId),
	CONSTRAINT LUM_UN_PRINCIPAL UNIQUE (shortId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_AccessControlList
(	
		`accessControlListId`
	 CHAR(32) NOT NULL,
		`inheritAccessControl`
	 INT DEFAULT 0 NOT NULL,
		`parentId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_ACCESSCONTROLLIST PRIMARY KEY (accessControlListId),
	CONSTRAINT LUM_FK_ACCESSCONTROLLISTPARENT FOREIGN KEY (parentId) REFERENCES lum_AccessControlList(accessControlListId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_ACCESSCONTROLLIST1 ON lum_AccessControlList(parentId);
	
	
CREATE TABLE lum_AccessControlEntry
(	
		`accessControlListId`
	 CHAR(32) NOT NULL,
		`principalId`
	 CHAR(32) NOT NULL,
		`inherited`
	 INT NOT NULL,
		`allowPermissions`
	 INT NOT NULL,
		`denyPermissions`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_ACCESSCONTROLENTRY PRIMARY KEY (principalId,accessControlListId),
	CONSTRAINT LUM_FK_ACCESSCONTROLENTRY FOREIGN KEY (accessControlListId) REFERENCES lum_AccessControlList(accessControlListId) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_ACCESSCONTROLENTRY2 FOREIGN KEY (principalId) REFERENCES lum_Principal(principalId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_ACCESSCONTROLENTRY1 ON lum_AccessControlEntry(accessControlListId);
	
	
CREATE TABLE lum_PBPropertyBag
(	
		`id`
	 CHAR(32) NOT NULL,
		`parentPropertyBagId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_PBPROPERTYBAG PRIMARY KEY (id),
	CONSTRAINT LUM_FK_PBPROPERTYBAG1 FOREIGN KEY (parentPropertyBagId) REFERENCES lum_PBPropertyBag(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_PBPropertyDefault
(	
		`id`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_PBPROPERTYDEFAULT PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_PBProperty
(	
		`id`
	 CHAR(32) NOT NULL,
		`propertyBagId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`isPrivate`
	 TINYINT NOT NULL,
		`propertyDefaultId`
	 CHAR(32) NULL,
		`inheritMode`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_PBPROPERTY PRIMARY KEY (id),
	CONSTRAINT LUM_FK_PBPROPERTY1 FOREIGN KEY (propertyBagId) REFERENCES lum_PBPropertyBag(id),
	CONSTRAINT LUM_FK_PBPROPERTY2 FOREIGN KEY (propertyDefaultId) REFERENCES lum_PBPropertyDefault(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_PBPROPERTY1 ON lum_PBProperty(propertyBagId,name);
	
CREATE TABLE lum_PBPropertyDefValue
(	
		`propertyDefaultId`
	 CHAR(32) NOT NULL,
		`position`
	 INT NOT NULL,
		`value`
	 LONGTEXT NULL,
	CONSTRAINT LUM_FK_PBPROPERTYDEFVALUE1 FOREIGN KEY (propertyDefaultId) REFERENCES lum_PBPropertyDefault(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_PBPROPERTYDEFVALUE1 ON lum_PBPropertyDefValue(propertyDefaultId,position);
	
	
CREATE TABLE lum_Channel
(	
		`channelId`
	 VARCHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`type`
	 INT DEFAULT 0 NOT NULL,
		`parentId`
	 VARCHAR(32) NULL,
		`hidden`
	 INT DEFAULT 0 NOT NULL,
		`position`
	 INT NULL,
		`isTemplate`
	 INT DEFAULT 0 NOT NULL,
		`parentTemplateId`
	 VARCHAR(32) NULL,
		`pageTemplateId`
	 CHAR(32) NULL,
		`protocol`
	 INT DEFAULT 0 NOT NULL,
		`inheritStylesheet`
	 INT DEFAULT 1 NOT NULL,
		`accessControlListId`
	 CHAR(32) NOT NULL,
		`centerPages`
	 INT DEFAULT 2 NOT NULL,
		`layoutPagesType`
	 INT DEFAULT 0 NOT NULL,
		`localGroups`
	 INT DEFAULT 0 NOT NULL,
		`localGroupPrefix`
	 VARCHAR(50) NULL,
		`templateLocalGroupPrefix`
	 VARCHAR(255) NULL,
		`cachePages`
	 INT DEFAULT 3 NOT NULL,
		`friendlyPathType`
	 INT DEFAULT 0 NOT NULL,
		`friendlyPathUserDefined`
	 VARCHAR(255) NULL,
		`inheritPageTemplate`
	 INT DEFAULT 1 NOT NULL,
		`inheritMetaTags`
	 INT DEFAULT 1 NOT NULL,
		`propertyBagId`
	 CHAR(32) NOT NULL,
		`pageWebResDataProvType`
	 INT DEFAULT 0 NOT NULL,
		`pageWebResDataProv`
	 VARCHAR(255) NULL,
		`friendlyURLPattern`
	 VARCHAR(255) NULL,
		`friendlyURLPatternEnabled`
	 TINYINT DEFAULT 0 NOT NULL,
		`friendlyId`
	 VARCHAR(50) NOT NULL,
		`automaticFriendlyId`
	 TINYINT NOT NULL,
		`ignoreOnExportImport`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_CHANNEL PRIMARY KEY (channelId),
	CONSTRAINT LUM_FK_CHANNEL FOREIGN KEY (accessControlListId) REFERENCES lum_AccessControlList(accessControlListId),
	CONSTRAINT LUM_FK_CHANNEL2 FOREIGN KEY (parentId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_CHANNEL3 FOREIGN KEY (parentTemplateId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_CHANNEL4 FOREIGN KEY (propertyBagId) REFERENCES lum_PBPropertyBag(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_CHANNEL1 ON lum_Channel(parentId,position,name);
	
CREATE INDEX LUM_IDX_CHANNEL2 ON lum_Channel(parentId,friendlyId);
	
	
ALTER TABLE lum_Principal ADD CONSTRAINT LUM_FK_PRINCIPAL FOREIGN KEY (channelId) REFERENCES lum_Channel(channelId);
	
CREATE TABLE lum_ChannelTemplateLinks
(	
		`linkId`
	 CHAR(32) NOT NULL,
		`templateChannelId`
	 VARCHAR(32) NOT NULL,
		`destinationChannelId`
	 VARCHAR(32) NOT NULL,
		`sourceId`
	 VARCHAR(255) NOT NULL,
		`destinationId`
	 VARCHAR(255) NOT NULL,
		`itemType`
	 INT NOT NULL,
		`linked`
	 INT DEFAULT 1 NOT NULL,
	CONSTRAINT LUM_PK_CHANNELTMPLLINKS PRIMARY KEY (linkId),
	CONSTRAINT LUM_FK_CHANNELTMPLLINKS1 FOREIGN KEY (templateChannelId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_CHANNELTMPLLINKS2 FOREIGN KEY (destinationChannelId) REFERENCES lum_Channel(channelId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_CHANNELTMPLLINKS1 ON lum_ChannelTemplateLinks(destinationChannelId,itemType,linked);
	
CREATE UNIQUE INDEX LUM_IDX_CHANNELTMPLLINKS2 ON lum_ChannelTemplateLinks(sourceId,destinationChannelId);
	
CREATE UNIQUE INDEX LUM_IDX_CHANNELTMPLLINKS3 ON lum_ChannelTemplateLinks(destinationId);
	
	
CREATE TABLE lum_Page
(	
		`pageId`
	 VARCHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`channelId`
	 VARCHAR(32) NULL,
		`position`
	 INT NULL,
		`layout`
	 LONGTEXT NULL,
		`isTemplate`
	 INT DEFAULT 0 NOT NULL,
		`hidden`
	 INT DEFAULT 0 NOT NULL,
		`parentTemplateId`
	 CHAR(32) NULL,
		`pageTitle`
	 VARCHAR(255) NULL,
		`cachePage`
	 INT DEFAULT 3 NOT NULL,
		`inheritStylesheet`
	 INT DEFAULT 1 NULL,
		`type`
	 INT DEFAULT 0 NOT NULL,
		`accessControlListId`
	 CHAR(32) NOT NULL,
		`centerPage`
	 INT DEFAULT 2 NOT NULL,
		`layoutType`
	 INT DEFAULT 0 NOT NULL,
		`inheritMetaTags`
	 INT DEFAULT 1 NOT NULL,
		`overrideSsi`
	 INT DEFAULT 0 NOT NULL,
		`ssiType`
	 INT DEFAULT 0 NOT NULL,
		`protocol`
	 INT DEFAULT 0 NOT NULL,
		`propertyBagId`
	 CHAR(32) NOT NULL,
		`pageWebResDataProvType`
	 INT DEFAULT 0 NOT NULL,
		`pageWebResDataProv`
	 VARCHAR(255) NULL,
		`friendlyId`
	 VARCHAR(50) NOT NULL,
		`automaticFriendlyId`
	 TINYINT NOT NULL,
		`keywords`
	 LONGTEXT NULL,
		`description`
	 LONGTEXT NULL,
	CONSTRAINT LUM_PK_PAGE PRIMARY KEY (pageId),
	CONSTRAINT LUM_FK_PAGE1 FOREIGN KEY (channelId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_PAGE2 FOREIGN KEY (accessControlListId) REFERENCES lum_AccessControlList(accessControlListId),
	CONSTRAINT LUM_FK_PAGE3 FOREIGN KEY (propertyBagId) REFERENCES lum_PBPropertyBag(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_PAGE1 ON lum_Page(channelId,position,name,isTemplate);
	
CREATE INDEX LUM_IDX_PAGE2 ON lum_Page(channelId,friendlyId);
	
	
CREATE TABLE lum_Service
(	
		`serviceId`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`baseUrl`
	 VARCHAR(255) NULL,
		`stringsUrlPrefix`
	 VARCHAR(255) NULL,
		`image`
	 VARCHAR(255) NULL,
		`definition`
	 LONGTEXT NULL,
		`accessControlListId`
	 CHAR(32) NOT NULL,
		`isInstantiable`
	 INT DEFAULT 1 NULL,
		`isSocialProfile`
	 TINYINT DEFAULT 0 NOT NULL,
	CONSTRAINT LUM_PK_Service PRIMARY KEY (serviceId),
	CONSTRAINT LUM_FK_SERVICE FOREIGN KEY (accessControlListId) REFERENCES lum_AccessControlList(accessControlListId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_ServiceInstance
(	
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
		`serviceId`
	 VARCHAR(255) NOT NULL,
		`channelId`
	 VARCHAR(32) NULL,
		`name`
	 VARCHAR(255) NULL,
		`description`
	 VARCHAR(255) NULL,
		`inheritAccessControl`
	 INT DEFAULT 1 NOT NULL,
		`isSearchable`
	 INT DEFAULT 1 NOT NULL,
		`accessControlListId`
	 CHAR(32) NULL,
		`usesPublicFileStorage`
	 INT DEFAULT 0 NOT NULL,
		`friendlyId`
	 VARCHAR(50) NOT NULL,
		`automaticFriendlyId`
	 TINYINT NOT NULL,
		`usesFileTransformation`
	 INT DEFAULT 0 NOT NULL,
		`propertyBagId`
	 CHAR(32) NOT NULL,
		`restShortName`
	 VARCHAR(255) NOT NULL,
		`restEnabled`
	 INT DEFAULT 0 NOT NULL,
		`disableInContextEdit`
	 INT DEFAULT 0 NOT NULL,
	CONSTRAINT LUM_PK_SERVICEINSTANCE PRIMARY KEY (serviceInstanceId),
	CONSTRAINT LUM_FK_SERVICEINSTANCE FOREIGN KEY (accessControlListId) REFERENCES lum_AccessControlList(accessControlListId),
	CONSTRAINT LUM_FK_SERVICEINSTANCE2 FOREIGN KEY (serviceId) REFERENCES lum_Service(serviceId),
	CONSTRAINT LUM_FK_SERVICEINSTANCE3 FOREIGN KEY (channelId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_SERVICEINSTANCE4 FOREIGN KEY (propertyBagId) REFERENCES lum_PBPropertyBag(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_SERVICEINSTANCE1 ON lum_ServiceInstance(channelId,friendlyId);
	
CREATE UNIQUE INDEX LUM_IDX_SERVICEINSTANCE2 ON lum_ServiceInstance(restShortName);
	
CREATE INDEX LUM_IDX_SERVICEINSTANCE3 ON lum_ServiceInstance(serviceId);
	
	
CREATE TABLE lum_ServiceInstanceDependency
(	
		`id`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
		`dependentServiceInstanceId`
	 CHAR(32) NOT NULL,
		`dependencyType`
	 VARCHAR(50) NOT NULL,
	CONSTRAINT LUM_PK_SERVICEINSTANCEDEP PRIMARY KEY (id),
	CONSTRAINT LUM_FK_SERVICEINSTANCEDEP FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId),
	CONSTRAINT LUM_FK_SERVICEINSTANCEDEP2 FOREIGN KEY (dependentServiceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId),
	CONSTRAINT LUM_UN_SERVICEINSTANCEDEP UNIQUE (serviceInstanceId,dependentServiceInstanceId,dependencyType),
	CONSTRAINT LUM_UN_SERVICEINSTANCEDEP2 UNIQUE (dependentServiceInstanceId,dependencyType,serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_Interface
(	
		`interfaceId`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`title`
	 VARCHAR(255) NULL,
		`description`
	 VARCHAR(255) NULL,
		`baseUrl`
	 VARCHAR(255) NULL,
		`stringsUrlPrefix`
	 VARCHAR(255) NULL,
		`serviceId`
	 VARCHAR(255) NOT NULL,
		`isRuntimeOnly`
	 INT DEFAULT 0 NOT NULL,
		`isAdministration`
	 INT DEFAULT 0 NOT NULL,
		`isDetails`
	 INT DEFAULT 0 NOT NULL,
		`isPrintable`
	 INT DEFAULT 0 NOT NULL,
		`renderAs`
	 INT DEFAULT 0 NOT NULL,
		`enableCache`
	 INT DEFAULT 0 NOT NULL,
		`cacheLevel`
	 INT DEFAULT 0 NOT NULL,
		`cachePersonalization`
	 INT DEFAULT 0 NOT NULL,
		`cacheServerSideInclude`
	 INT DEFAULT 0 NOT NULL,
		`definition`
	 LONGTEXT NULL,
		`defaultInterfaceStyleId`
	 VARCHAR(100) NULL,
		`customDefaultInterfaceStyleId`
	 VARCHAR(100) NULL,
		`previewSupported`
	 INT DEFAULT 0 NOT NULL,
		`isWidget`
	 INT DEFAULT 0 NOT NULL,
		`usesSocialProfileInformation`
	 TINYINT DEFAULT 0 NOT NULL,
		`openerWindowRequired`
	 TINYINT DEFAULT 1 NOT NULL,
		`inContextEditSupported`
	 INT DEFAULT 1 NOT NULL,
	CONSTRAINT LUM_PK_INTERFACE PRIMARY KEY (interfaceId),
	CONSTRAINT LUM_FK_INTERFACE FOREIGN KEY (serviceId) REFERENCES lum_Service(serviceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_INTERFACE1 ON lum_Interface(serviceId);
	
	
CREATE TABLE lum_InterfaceStyle
(	
		`interfaceStyleId`
	 VARCHAR(100) NOT NULL,
		`interfaceId`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`filePath`
	 VARCHAR(255) NOT NULL,
		`isFromDefinition`
	 INT DEFAULT 0 NOT NULL,
		`isWidgetDefault`
	 INT DEFAULT 0 NOT NULL,
		`isolationLevel`
	 INT DEFAULT 0 NOT NULL,
	CONSTRAINT LUM_PK_INTERFACESTYLE PRIMARY KEY (interfaceStyleId,interfaceId),
	CONSTRAINT LUM_FK_INTERFACESTYLE FOREIGN KEY (interfaceId) REFERENCES lum_Interface(interfaceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_INTERFACESTYLE1 ON lum_InterfaceStyle(interfaceId);
	
CREATE INDEX LUM_IDX_INTERFACESTYLE2 ON lum_InterfaceStyle(isolationLevel);
	
ALTER TABLE lum_Interface ADD CONSTRAINT LUM_FK_INTERFACE2 FOREIGN KEY (defaultInterfaceStyleId,interfaceId) REFERENCES lum_InterfaceStyle(interfaceStyleId,interfaceId);
	
ALTER TABLE lum_Interface ADD CONSTRAINT LUM_FK_INTERFACE3 FOREIGN KEY (customDefaultInterfaceStyleId,interfaceId) REFERENCES lum_InterfaceStyle(interfaceStyleId,interfaceId);
	
	
CREATE TABLE lum_InterfaceInstance
(	
		`interfaceInstanceId`
	 CHAR(32) NOT NULL,
		`interfaceId`
	 VARCHAR(255) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NULL,
		`pageId`
	 VARCHAR(32) NULL,
		`parentInterfaceId`
	 CHAR(32) NULL,
		`isCreatedRunTime`
	 INT DEFAULT 0 NOT NULL,
		`createRuntimeOnly`
	 INT DEFAULT 0 NOT NULL,
		`interfaceStyleId`
	 VARCHAR(100) NULL,
		`title`
	 VARCHAR(300) NULL,
		`width`
	 VARCHAR(10) NULL,
		`height`
	 VARCHAR(10) NULL,
		`paddingLeft`
	 VARCHAR(10) NULL,
		`paddingRight`
	 VARCHAR(10) NULL,
		`paddingTop`
	 VARCHAR(10) NULL,
		`paddingBottom`
	 VARCHAR(10) NULL,
		`colspan`
	 INT NULL,
		`rowspan`
	 INT NULL,
		`isPrintable`
	 INT DEFAULT 2 NOT NULL,
		`renderAs`
	 INT DEFAULT 2 NOT NULL,
		`enableCache`
	 INT DEFAULT 2 NOT NULL,
		`cacheLevel`
	 INT DEFAULT 2 NOT NULL,
		`cachePersonalization`
	 INT DEFAULT 3 NOT NULL,
		`cacheServerSideInclude`
	 INT DEFAULT 2 NOT NULL,
		`holderPriority`
	 INT NULL,
		`showTitleBar`
	 INT DEFAULT 0 NOT NULL,
		`displayName`
	 VARCHAR(100) NULL,
		`owner`
	 VARCHAR(255) NULL,
		`disableInContextEdit`
	 INT DEFAULT 0 NOT NULL,
	CONSTRAINT LUM_PK_INTERFACEINSTANCE PRIMARY KEY (interfaceInstanceId),
	CONSTRAINT LUM_FK_INTERFACEINSTANCE FOREIGN KEY (interfaceId) REFERENCES lum_Interface(interfaceId),
	CONSTRAINT LUM_FK_INTERFACEINSTANCE2 FOREIGN KEY (pageId) REFERENCES lum_Page(pageId),
	CONSTRAINT LUM_FK_INTERFACEINSTANCE3 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId),
	CONSTRAINT LUM_FK_INTERFACEINSTANCE4 FOREIGN KEY (interfaceStyleId,interfaceId) REFERENCES lum_InterfaceStyle(interfaceStyleId,interfaceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_INTERFACEINSTANCE1 ON lum_InterfaceInstance(pageId,isCreatedRunTime);
	
CREATE INDEX LUM_IDX_INTERFACEINSTANCE2 ON lum_InterfaceInstance(interfaceId,interfaceStyleId);
	
CREATE INDEX LUM_IDX_INTERFACEINSTANCE3 ON lum_InterfaceInstance(interfaceId,serviceInstanceId,isCreatedRunTime);
	
CREATE INDEX LUM_IDX_INTERFACEINSTANCE4 ON lum_InterfaceInstance(serviceInstanceId,isCreatedRunTime,interfaceId,pageId);
	
CREATE VIEW lum_vwInterfaceInstanceStyle AS
(
	SELECT a.interfaceInstanceId, b.interfaceId, IFNULL(a.interfaceStyleId, b.defaultInterfaceStyleId) as interfaceStyleId FROM lum_InterfaceInstance a, lum_Interface b WHERE a.interfaceId = b.interfaceId
);

	
CREATE TABLE lum_ISAllowedConsumers
(	
		`id`
	 CHAR(32) NOT NULL,
		`interfaceStyleId`
	 VARCHAR(100) NOT NULL,
		`interfaceId`
	 VARCHAR(255) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NULL,
		`interfaceInstanceId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_ISALLOWEDCONSUMERS PRIMARY KEY (id),
	CONSTRAINT LUM_FK_ISALLOWEDCONSUMERS1 FOREIGN KEY (interfaceStyleId,interfaceId) REFERENCES lum_InterfaceStyle(interfaceStyleId,interfaceId),
	CONSTRAINT LUM_FK_ISALLOWEDCONSUMERS2 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId),
	CONSTRAINT LUM_FK_ISALLOWEDCONSUMERS3 FOREIGN KEY (interfaceInstanceId) REFERENCES lum_InterfaceInstance(interfaceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_ISALLOWEDCONSUMERS1 ON lum_ISAllowedConsumers(interfaceStyleId,interfaceId,serviceInstanceId);
	
CREATE INDEX LUM_IX_ISALLOWEDCONSUMERS2 ON lum_ISAllowedConsumers(interfaceInstanceId);
	
CREATE INDEX LUM_IX_ISALLOWEDCONSUMERS3 ON lum_ISAllowedConsumers(serviceInstanceId);
	
	
CREATE TABLE lum_User
(	
		`userId`
	 CHAR(32) NOT NULL,
		`login`
	 VARCHAR(100) NOT NULL,
		`password`
	 VARCHAR(255) NULL,
		`firstName`
	 VARCHAR(100) NOT NULL,
		`middleName`
	 VARCHAR(100) NULL,
		`lastName`
	 VARCHAR(100) NULL,
		`email`
	 VARCHAR(255) NULL,
		`lastLogin`
	 DATETIME NULL,
		`createdDate`
	 DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL,
		`disabled`
	 INT DEFAULT 0 NOT NULL,
		`channelId`
	 VARCHAR(32) NULL,
		`type`
	 INT DEFAULT 0 NOT NULL,
		`multiSession`
	 INT DEFAULT 0 NOT NULL,
		`origin`
	 VARCHAR(255) NULL,
		`portalLogin`
	 INT DEFAULT 1 NULL,
		`attributes`
	 LONGTEXT NULL,
	CONSTRAINT LUM_PK_USER PRIMARY KEY (userId),
	CONSTRAINT LUM_FK_USER FOREIGN KEY (userId) REFERENCES lum_Principal(principalId),
	CONSTRAINT LUM_FK_USER2 FOREIGN KEY (channelId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_UN_USER_LOGIN UNIQUE (login)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	CREATE TRIGGER LUM_TG_USER BEFORE INSERT ON `lum_User` FOR EACH ROW SET NEW.createdDate = NOW();

	
CREATE VIEW lum_vwUser AS
(
	SELECT userId, concat(concat(firstName, ifnull(concat(' ', middleName), '')), ifnull(concat(' ', lastName), '')) AS fullName, login, lastLogin, createdDate, channelId FROM lum_User
);
	
	
CREATE TABLE lum_UserAlternativeLogin
(	
		`id`
	 CHAR(32) NOT NULL,
		`userId`
	 CHAR(32) NOT NULL,
		`login`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_USERALTERNATIVELOGIN PRIMARY KEY (id),
	CONSTRAINT LUM_FK_USERALTERNATIVELOGIN FOREIGN KEY (userId) REFERENCES lum_User(userId) ON DELETE CASCADE ,
	CONSTRAINT LUM_UN_USERALTLOG_LOGIN UNIQUE (login)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_GroupType
(	
		`id`
	 VARCHAR(100) NOT NULL,
		`name`
	 VARCHAR(50) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`groupMembershipProvider`
	 VARCHAR(100) NOT NULL,
	CONSTRAINT LUM_PK_GROUPTYPE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_Group
(	
		`groupId`
	 CHAR(32) NOT NULL,
		`alias`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`type`
	 INT DEFAULT 0 NOT NULL,
		`channelId`
	 VARCHAR(32) NULL,
		`accessControlListId`
	 CHAR(32) NOT NULL,
		`origin`
	 VARCHAR(255) NULL,
		`groupTypeId`
	 VARCHAR(100) NOT NULL,
	CONSTRAINT LUM_PK_GROUP PRIMARY KEY (groupId),
	CONSTRAINT LUM_FK_GROUP FOREIGN KEY (groupId) REFERENCES lum_Principal(principalId),
	CONSTRAINT LUM_FK_GROUP2 FOREIGN KEY (channelId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_GROUP3 FOREIGN KEY (accessControlListId) REFERENCES lum_AccessControlList(accessControlListId),
	CONSTRAINT LUM_FK_GROUP4 FOREIGN KEY (groupTypeId) REFERENCES lum_GroupType(id),
	CONSTRAINT LUM_UN_GROUP_ALIAS UNIQUE (alias)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_GROUP1 ON lum_Group(channelId);
	
CREATE INDEX LUM_IDX_GROUP2 ON lum_Group(groupTypeId);
	
	
CREATE VIEW lum_vwGlobalGroups AS
(
	select * from lum_Group where channelId is null and type=0
);
	
	
CREATE TABLE lum_GroupMember
(	
		`groupId`
	 CHAR(32) NOT NULL,
		`principalId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_GROUPMEMBER PRIMARY KEY (groupId,principalId),
	CONSTRAINT LUM_FK_GROUPMEMBERS FOREIGN KEY (groupId) REFERENCES lum_Group(groupId),
	CONSTRAINT LUM_FK_GROUPMEMBERS2 FOREIGN KEY (principalId) REFERENCES lum_Principal(principalId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_GROUPMEMBER ON lum_GroupMember(principalId,groupId);
	
	
CREATE TABLE lum_GroupDbVwGrpTypeCfg
(	
		`id`
	 CHAR(32) NOT NULL,
		`connectionId`
	 VARCHAR(50) NULL,
		`viewName`
	 VARCHAR(50) NOT NULL,
		`principalShortIdField`
	 VARCHAR(50) NOT NULL,
		`cacheMaxAgeSeconds`
	 INT NOT NULL,
		`groupTypeId`
	 VARCHAR(100) NOT NULL,
	CONSTRAINT LUM_PK_GROUPDBVWGRPTYPECFG PRIMARY KEY (id),
	CONSTRAINT LUM_FK_GROUPDBVWGRPTYPECFG1 FOREIGN KEY (groupTypeId) REFERENCES lum_GroupType(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_GROUPDBVWGRPTYPECFG1 ON lum_GroupDbVwGrpTypeCfg(groupTypeId);
	
	
CREATE TABLE lum_GroupDbVwField
(	
		`id`
	 CHAR(32) NOT NULL,
		`columnName`
	 VARCHAR(50) NOT NULL,
		`dataType`
	 VARCHAR(50) NOT NULL,
		`groupTypeConfigId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_GROUPDBVWFIELD PRIMARY KEY (id),
	CONSTRAINT LUM_FK_GROUPDBVWFIELD1 FOREIGN KEY (groupTypeConfigId) REFERENCES lum_GroupDbVwGrpTypeCfg(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_GROUPDBVWFIELD1 ON lum_GroupDbVwField(groupTypeConfigId);
	
	
CREATE TABLE lum_GroupDbVwGrpCfg
(	
		`id`
	 CHAR(32) NOT NULL,
		`groupId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_GROUPDBVWGRPCFG PRIMARY KEY (id),
	CONSTRAINT LUM_FK_GROUPDBVWGRPCFG1 FOREIGN KEY (groupId) REFERENCES lum_Group(groupId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_GROUPDBVWGRPCFG1 ON lum_GroupDbVwGrpCfg(groupId);

	
CREATE TABLE lum_GroupDbVwFormulaEntry
(	
		`id`
	 CHAR(32) NOT NULL,
		`leftParentheses`
	 VARCHAR(10) NULL,
		`fieldId`
	 CHAR(32) NOT NULL,
		`operator`
	 VARCHAR(11) NOT NULL,
		`value`
	 VARCHAR(255) NULL,
		`rightParentheses`
	 VARCHAR(10) NULL,
		`logicalOperator`
	 VARCHAR(3) NOT NULL,
		`position`
	 INT NOT NULL,
		`groupConfigId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_GROUPDBVWFORMULAENTRY PRIMARY KEY (id),
	CONSTRAINT LUM_FK_GROUPDBVWFORMULAENTRY1 FOREIGN KEY (groupConfigId) REFERENCES lum_GroupDbVwGrpCfg(id) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_GROUPDBVWFORMULAENTRY2 FOREIGN KEY (fieldId) REFERENCES lum_GroupDbVwField(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_GROUPDBVWFORMULAENTRY1 ON lum_GroupDbVwFormulaEntry(groupConfigId,position);

	
CREATE TABLE lum_UserSession
(	
		`userSessionId`
	 CHAR(32) NOT NULL,
		`userId`
	 CHAR(32) NOT NULL,
		`lastAccessDate`
	 DATETIME NOT NULL,
	CONSTRAINT LUM_PK_USERSESSION PRIMARY KEY (userSessionId),
	CONSTRAINT LUM_FK_AUTHENTICATEDUSERS FOREIGN KEY (userId) REFERENCES lum_User(userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE INDEX LUM_IDX_USERSESSION1 ON lum_UserSession(userId);
	
CREATE INDEX LUM_IDX_USERSESSION2 ON lum_UserSession(lastAccessDate);
	
CREATE TABLE lum_ServiceType
(	
		`serviceTypeId`
	 VARCHAR(255) NOT NULL,
		`serviceType`
	 VARCHAR(255) NOT NULL,
		`serviceClass`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_SERVICETYPE PRIMARY KEY (serviceTypeId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_ServiceInterfaceType
(	
		`interfaceTypeId`
	 VARCHAR(255) NOT NULL,
		`interfaceType`
	 VARCHAR(255) NOT NULL,
		`interfaceClass`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_SERVICEINTERFACETYPE PRIMARY KEY (interfaceTypeId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_Css
(	
		`cssId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`filePath`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_CSS PRIMARY KEY (cssId),
	CONSTRAINT LUM_UN_CSS UNIQUE (filePath)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE VIEW lum_vwCss AS
(
	SELECT a.cssId, concat(a.name, ' (', a.filePath, ')') as name, a.description, a.filePath FROM lum_Css a
);

	
CREATE TABLE lum_ChannelCss
(	
		`cssId`
	 CHAR(32) NOT NULL,
		`channelId`
	 VARCHAR(32) NOT NULL,
		`position`
	 INT NULL,
	CONSTRAINT LUM_PK_CHANNELCSS PRIMARY KEY (cssId,channelId),
	CONSTRAINT LUM_FK_CHANNELSTYLESHEETS FOREIGN KEY (cssId) REFERENCES lum_Css(cssId),
	CONSTRAINT LUM_FK_CHANNELSTYLESHEETS2 FOREIGN KEY (channelId) REFERENCES lum_Channel(channelId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_CHANNELSTYLESHEETS1 ON lum_ChannelCss(channelId,position);
	
	
CREATE VIEW lum_vwChannelCss AS
(
	SELECT b.cssId, a.channelId, a.position, concat(b.name, ' (', b.filePath, ')') as name, b.description, b.filePath FROM lum_ChannelCss a, lum_Css b WHERE a.cssId = b.cssId
);

	
CREATE TABLE lum_PageCss
(	
		`cssId`
	 CHAR(32) NOT NULL,
		`pageId`
	 VARCHAR(32) NOT NULL,
		`position`
	 INT NULL,
	CONSTRAINT LUM_PK_PAGECSS PRIMARY KEY (cssId,pageId),
	CONSTRAINT LUM_FK_PAGESTYLESHEETS FOREIGN KEY (cssId) REFERENCES lum_Css(cssId),
	CONSTRAINT LUM_FK_PAGESTYLESHEETS2 FOREIGN KEY (pageId) REFERENCES lum_Page(pageId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_PAGESTYLESHEETS1 ON lum_PageCss(pageId,position);
	
	
CREATE VIEW lum_vwPageCss AS
(
	SELECT b.cssId, a.pageId, a.position, concat(b.name, ' (', b.filePath, ')') as name, b.description, b.filePath FROM lum_PageCss a, lum_Css b WHERE a.cssId = b.cssId
);

	
CREATE TABLE lum_MetaTag
(	
		`metaTagId`
	 CHAR(32) NOT NULL,
		`parentChannelId`
	 VARCHAR(32) NULL,
		`parentPageId`
	 VARCHAR(32) NULL,
		`position`
	 INT NOT NULL,
		`content`
	 VARCHAR(1000) NOT NULL,
	CONSTRAINT LUM_PK_METATAG PRIMARY KEY (metaTagId),
	CONSTRAINT LUM_FK_METATAG FOREIGN KEY (parentChannelId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_METATAG2 FOREIGN KEY (parentPageId) REFERENCES lum_Page(pageId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_METATAG1 ON lum_MetaTag(parentChannelId,position);
	
CREATE INDEX LUM_IX_METATAG2 ON lum_MetaTag(parentPageId,position);
	
	
CREATE TABLE lum_Clock
(	
		`clockId`
	 VARCHAR(255) NOT NULL,
		`clockClass`
	 VARCHAR(255) NOT NULL,
		`serviceId`
	 VARCHAR(255) NULL,
		`startTime`
	 DATETIME NOT NULL,
		`stopTime`
	 DATETIME NULL,
		`tickIntervalType`
	 INT NOT NULL,
		`tickInterval`
	 INT NOT NULL,
		`runOnlyOnServer`
	 VARCHAR(100) NULL,
		`lastTick`
	 DATETIME NULL,
		`enabled`
	 INT NOT NULL,
		`nextScheduleDate`
	 DATETIME NOT NULL,
		`running`
	 INT NOT NULL,
		`maxRunTime`
	 INT NOT NULL,
		`lastTickStart`
	 DATETIME NULL,
	CONSTRAINT LUM_PK_PORTALCLOCK PRIMARY KEY (clockId),
	CONSTRAINT LUM_FK_PORTALCLOCK1 FOREIGN KEY (serviceId) REFERENCES lum_Service(serviceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE INDEX LUM_IDX_PORTALCLOCK ON lum_Clock(enabled,running,nextScheduleDate,runOnlyOnServer);
	
	
CREATE TABLE lum_CustomString
(	
		`customStringId`
	 CHAR(32) NOT NULL,
		`stringId`
	 VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		`string`
	 VARCHAR(1000) NOT NULL,
		`resourcePath`
	 VARCHAR(255) NOT NULL,
		`localeCode`
	 VARCHAR(50) NOT NULL,
		`status`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_CUSTOMSTRING PRIMARY KEY (customStringId),
	CONSTRAINT LUM_UN_CUSTOMSTRING UNIQUE (stringId,resourcePath,localeCode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_LRResource
(	
		`id`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_LRRESOURCE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_LRResourceLock
(	
		`id`
	 CHAR(32) NOT NULL,
		`resourceId`
	 VARCHAR(255) NOT NULL,
		`owner`
	 CHAR(32) NOT NULL,
		`deadline`
	 DATETIME NOT NULL,
		`type`
	 VARCHAR(5) NOT NULL,
	CONSTRAINT LUM_PK_LRRESOURCELOCK PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_LRRESOURCELOCK1 ON lum_LRResourceLock(resourceId,owner);
	
CREATE INDEX LUM_IX_LRRESOURCELOCK2 ON lum_LRResourceLock(deadline);
	
CREATE INDEX LUM_IX_LRRESOURCELOCK3 ON lum_LRResourceLock(resourceId,type);
	
CREATE TABLE lum_Website
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(50) NOT NULL,
		`webRootPath`
	 VARCHAR(255) NULL,
		`rootChannelId`
	 VARCHAR(32) NULL,
		`defaultWebsite`
	 TINYINT NOT NULL,
		`forceMainURLsNavigation`
	 TINYINT NOT NULL,
		`priority`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_WEBSITE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WEBSITE1 FOREIGN KEY (rootChannelId) REFERENCES lum_Channel(channelId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_WEBSITE1 ON lum_Website(rootChannelId);
	
CREATE UNIQUE INDEX LUM_IX_WEBSITE2 ON lum_Website(name);
	
CREATE INDEX LUM_IX_WEBSITE3 ON lum_Website(priority);
	
CREATE TABLE lum_WebsiteBaseURL
(	
		`id`
	 CHAR(32) NOT NULL,
		`domain`
	 VARCHAR(120) NOT NULL,
		`port`
	 INT NOT NULL,
		`path`
	 VARCHAR(100) NULL,
		`secure`
	 TINYINT NULL,
		`type`
	 VARCHAR(1) NOT NULL,
		`websiteId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_WEBSITEBASEURL PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WEBSITEBASEURL1 FOREIGN KEY (websiteId) REFERENCES lum_Website(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_WEBSITEBASEURL1 ON lum_WebsiteBaseURL(domain,port,path);
	
CREATE INDEX LUM_IX_WEBSITEBASEURL2 ON lum_WebsiteBaseURL(websiteId,type,secure);	
	
CREATE TABLE lum_PageLink
(	
		`pageLinkId`
	 CHAR(32) NOT NULL,
		`pageId`
	 VARCHAR(32) NOT NULL,
		`type`
	 INT DEFAULT 0 NOT NULL,
		`channelId`
	 VARCHAR(32) NULL,
		`capabilities`
	 LONGTEXT NULL,
		`priority`
	 INT NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
		`websiteId`
	 CHAR(32) NOT NULL,
		`usesAllWebsiteBaseURLs`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_PAGELINK PRIMARY KEY (pageLinkId),
	CONSTRAINT LUM_FK_PAGELINK FOREIGN KEY (pageId) REFERENCES lum_Page(pageId),
	CONSTRAINT LUM_FK_PAGELINK2 FOREIGN KEY (channelId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_PAGELINK3 FOREIGN KEY (websiteId) REFERENCES lum_Website(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_PAGELINK1 ON lum_PageLink(websiteId,priority);

	
CREATE TABLE lum_PageLinkWebsiteBaseURL
(	
		`pageLinkId`
	 CHAR(32) NOT NULL,
		`websiteBaseURLId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_PAGELINKWEBSITEBASEURL PRIMARY KEY (pageLinkId,websiteBaseURLId),
	CONSTRAINT LUM_FK_PAGELINKWEBSITEBASEURL1 FOREIGN KEY (pageLinkId) REFERENCES lum_PageLink(pageLinkId),
	CONSTRAINT LUM_FK_PAGELINKWEBSITEBASEURL2 FOREIGN KEY (websiteBaseURLId) REFERENCES lum_WebsiteBaseURL(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_PAGELINKWEBSITEBASEURL1 ON lum_PageLinkWebsiteBaseURL(websiteBaseURLId);
	
	
CREATE TABLE lum_ServiceMenuType
(	
		`menuTypeId`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`definition`
	 LONGTEXT NULL,
	CONSTRAINT LUM_PK_SERVICEMENUTYPE PRIMARY KEY (menuTypeId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_BuildInformation
(	
		`buildId`
	 CHAR(32) NOT NULL,
		`majorVersion`
	 INT NOT NULL,
		`minorVersion`
	 INT NOT NULL,
		`releaseVersion`
	 INT NOT NULL,
		`buildNumber`
	 VARCHAR(6) NOT NULL,
		`buildSequence`
	 INT NOT NULL,
		`steps`
	 INT NOT NULL,
		`status`
	 INT NOT NULL,
		`userResponse`
	 INT NOT NULL,
		`upgradeDate`
	 DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL,
		`area`
	 VARCHAR(50) NULL,
		`userId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_BUILDINFORMATION PRIMARY KEY (buildId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	CREATE TRIGGER LUM_TG_BUILDINFORMATION BEFORE INSERT ON `lum_BuildInformation` FOR EACH ROW SET NEW.upgradeDate = NOW();
	
	
CREATE TABLE lum_PostUpgradeStatus
(	
		`id`
	 CHAR(32) NOT NULL,
		`lastExecutedNumber`
	 INT NOT NULL,
		`upgradeExecuted`
	 TINYINT DEFAULT 0 NOT NULL,
	CONSTRAINT LUM_PK_POSTUPGRADESTATUS PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_IntfInstCustomProperty
(	
		`customPropertyId`
	 CHAR(32) NOT NULL,
		`interfaceInstanceId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
		`value`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_INTFINSTCUSTOMPROPERTY PRIMARY KEY (customPropertyId),
	CONSTRAINT LUM_UN_INTFINSTCUSTOMPROPERTY UNIQUE (interfaceInstanceId,name),
	CONSTRAINT LUM_FK_INTFINSTCUSTOMPROPERTY FOREIGN KEY (interfaceInstanceId) REFERENCES lum_InterfaceInstance(interfaceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_SvcInstCustomProperty
(	
		`customPropertyId`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
		`value`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_SVCINSTCUSTOMPROPERTY PRIMARY KEY (customPropertyId),
	CONSTRAINT LUM_UN_SVCINSTCUSTOMPROPERTY UNIQUE (serviceInstanceId,name),
	CONSTRAINT LUM_FK_SVCINSTCUSTOMPROPERTY FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_InterfaceMenuItem
(	
		`menuItemId`
	 VARCHAR(255) NOT NULL,
		`type`
	 VARCHAR(200) NOT NULL,
		`className`
	 VARCHAR(200) NOT NULL,
		`definition`
	 LONGTEXT NULL,
	CONSTRAINT LUM_PK_INTERFACEMENUITEM PRIMARY KEY (menuItemId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_InterfaceMenuGroup
(	
		`menuGroupId`
	 VARCHAR(255) NOT NULL,
		`type`
	 VARCHAR(200) NOT NULL,
		`definition`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_INTERFACEMENUGROUP PRIMARY KEY (menuGroupId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
CREATE TABLE lum_Locale
(	
		`localeId`
	 CHAR(32) NOT NULL,
		`locale`
	 VARCHAR(10) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_LOCALE PRIMARY KEY (localeId),
	CONSTRAINT LUM_UN_LOCALE1 UNIQUE (locale)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_WebResource
(	
		`id`
	 CHAR(32) NOT NULL,
		`pageId`
	 VARCHAR(32) NULL,
		`channelId`
	 VARCHAR(32) NULL,
		`locale`
	 VARCHAR(10) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		`dynamicPath`
	 VARCHAR(400) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
		`friendlyPath`
	 VARCHAR(400) CHARACTER SET latin1 COLLATE latin1_bin NULL,
		`createdDateTime`
	 DATETIME NOT NULL,
		`type`
	 VARCHAR(1) NOT NULL,
		`cachedPageId`
	 VARCHAR(255) NULL,
		`websiteId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_WEBRESOURCE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WEBRESOURCE1 FOREIGN KEY (pageId) REFERENCES lum_Page(pageId),
	CONSTRAINT LUM_FK_WEBRESOURCE2 FOREIGN KEY (channelId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_WEBRESOURCE3 FOREIGN KEY (locale) REFERENCES lum_Locale(locale),
	CONSTRAINT LUM_FK_WEBRESOURCE4 FOREIGN KEY (websiteId) REFERENCES lum_Website(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_WEBRESOURCE1 ON lum_WebResource(dynamicPath,locale);
	
CREATE INDEX LUM_IX_WEBRESOURCE2 ON lum_WebResource(friendlyPath);
	
CREATE INDEX LUM_IX_WEBRESOURCE3 ON lum_WebResource(pageId,locale);
	
CREATE INDEX LUM_IX_WEBRESOURCE4 ON lum_WebResource(channelId,locale);
	
CREATE INDEX LUM_IX_WEBRESOURCE5 ON lum_WebResource(cachedPageId);
	
CREATE INDEX LUM_IX_WEBRESOURCE6 ON lum_WebResource(websiteId);
	
	
CREATE TABLE lum_WebResPageParam
(	
		`id`
	 CHAR(32) NOT NULL,
		`webResourceId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
	CONSTRAINT LUM_PK_WEBRESPAGEPARAM PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WEBRESPAGEPARAM1 FOREIGN KEY (webResourceId) REFERENCES lum_WebResource(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_WEBRESPAGEPARAM1 ON lum_WebResPageParam(webResourceId,name);
	
	
CREATE TABLE lum_WebResPageParamValue
(	
		`parameterId`
	 CHAR(32) NOT NULL,
		`position`
	 INT NOT NULL,
		`parameterValue`
	 VARCHAR(300) NOT NULL,
	CONSTRAINT LUM_PK_WEBRESPAGEPARAMVALUE PRIMARY KEY (parameterId,position),
	CONSTRAINT LUM_FK_WEBRESPAGEPARAMVALUE1 FOREIGN KEY (parameterId) REFERENCES lum_WebResPageParam(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	ALTER TABLE lum_WebResPageParamValue CHANGE COLUMN parameterValue parameterValue VARCHAR(300) NOT NULL COLLATE 'ucs2_bin';
	
CREATE INDEX LUM_IX_WEBRESPAGEPARAMVALUE1 ON lum_WebResPageParamValue(parameterValue,parameterId);
	
	
CREATE TABLE lum_CachedPage
(	
		`cachedPageId`
	 VARCHAR(255) NOT NULL,
		`webResourceId`
	 CHAR(32) NOT NULL,
		`createdDateTime`
	 DATETIME NOT NULL,
		`cachedDate`
	 DATETIME NULL,
		`expiredDate`
	 DATETIME NULL,
		`status`
	 INT DEFAULT 0 NOT NULL,
		`priority`
	 INT DEFAULT 0 NOT NULL,
		`initialPriority`
	 INT DEFAULT 0 NOT NULL,
		`resourcePriority`
	 INT NOT NULL,
		`numErrors`
	 INT DEFAULT 0 NOT NULL,
		`filePath`
	 VARCHAR(400) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
		`serverId`
	 VARCHAR(100) NULL,
		`queueId`
	 VARCHAR(50) NOT NULL,
		`generationStartDate`
	 DATETIME NULL,
		`nextGenerationDate`
	 DATETIME NULL,
	CONSTRAINT LUM_PK_CACHEDPAGE PRIMARY KEY (cachedPageId),
	CONSTRAINT LUM_FK_CACHEDPAGE1 FOREIGN KEY (webResourceId) REFERENCES lum_WebResource(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IDX_CACHEDPAGE1 ON lum_CachedPage(filePath,webResourceId);
	
CREATE INDEX LUM_IDX_CACHEDPAGE2 ON lum_CachedPage(status,priority desc,resourcePriority desc,queueId,initialPriority,nextGenerationDate);
	
CREATE UNIQUE INDEX LUM_IDX_CACHEDPAGE3 ON lum_CachedPage(webResourceId);
	
CREATE INDEX LUM_IDX_CACHEDPAGE5 ON lum_CachedPage(queueId,status,priority desc,resourcePriority desc,initialPriority,nextGenerationDate);
	
-- Index for optimizing PageCacheManager.resetExpiredGeneratingPages.
CREATE INDEX LUM_IDX_CACHEDPAGE6 ON lum_CachedPage(status,generationStartDate);
		
	CREATE TABLE lum_CachedPageLock (id INT NOT NULL, CONSTRAINT LUM_PK_CACHEDPAGELOCK PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	INSERT INTO lum_CachedPageLock VALUES (0);
	
	
CREATE TABLE lum_PageCacheGenerator
(	
		`id`
	 CHAR(32) NOT NULL,
		`state`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_PAGECACHEGENERATOR PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
CREATE TABLE lum_PCQueue
(	
		`id`
	 CHAR(32) NOT NULL,
		`queueId`
	 VARCHAR(50) NOT NULL,
		`onDemandOnly`
	 TINYINT NOT NULL,
		`deleteOutdated`
	 TINYINT NOT NULL,
		`shadowCacheEnabled`
	 TINYINT NOT NULL,
		`isolated`
	 TINYINT NOT NULL,
		`maxErrorCount`
	 INT NOT NULL,
		`errorPriorityDecrement`
	 INT NOT NULL,
		`errorGenerationDelay`
	 INT NOT NULL,
		`autoBulkExpiration`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_PCQUEUE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_PCQUEUE1 ON lum_PCQueue(isolated,queueId);
	
CREATE UNIQUE INDEX LUM_IX_PCQUEUE2 ON lum_PCQueue(queueId);
	
	
CREATE TABLE lum_PCGeneratorProfile
(	
		`id`
	 CHAR(32) NOT NULL,
		`displayName`
	 VARCHAR(50) NOT NULL,
		`delayBetweenGenerations`
	 INT NOT NULL,
		`delayAfterStabilization`
	 INT NOT NULL,
		`numberOfThreads`
	 INT NOT NULL,
		`numberOfThreadsIU`
	 INT NOT NULL,
		`threadPriority`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_PCGENERATORPROFILE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_PCGENERATORPROFILE1 ON lum_PCGeneratorProfile(displayName);
	
	
CREATE TABLE lum_PCGeneratorConfig
(	
		`id`
	 CHAR(32) NOT NULL,
		`displayName`
	 VARCHAR(50) NOT NULL,
		`generateOtherQueues`
	 TINYINT NOT NULL,
		`generatorProfileId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_PCGENERATORCONFIG PRIMARY KEY (id),
	CONSTRAINT LUM_FK_PCGENERATORCONFIG1 FOREIGN KEY (generatorProfileId) REFERENCES lum_PCGeneratorProfile(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_PCGENERATORCONFIG1 ON lum_PCGeneratorConfig(displayName);
	
	
CREATE TABLE lum_PCGCQueue
(	
		`id`
	 CHAR(32) NOT NULL,
		`generatorConfigId`
	 CHAR(32) NOT NULL,
		`queueId`
	 VARCHAR(50) NOT NULL,
	CONSTRAINT LUM_PK_PCGCQUEUE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_PCGCQUEUE1 FOREIGN KEY (generatorConfigId) REFERENCES lum_PCGeneratorConfig(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_PCGCQUEUE1 ON lum_PCGCQueue(generatorConfigId,queueId);
	
	
CREATE TABLE lum_PCGCServer
(	
		`id`
	 CHAR(32) NOT NULL,
		`generatorConfigId`
	 CHAR(32) NOT NULL,
		`serverId`
	 VARCHAR(50) NOT NULL,
	CONSTRAINT LUM_PK_PCGCSERVER PRIMARY KEY (id),
	CONSTRAINT LUM_FK_PCGCSERVER1 FOREIGN KEY (generatorConfigId) REFERENCES lum_PCGeneratorConfig(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_PCGCSERVER1 ON lum_PCGCServer(generatorConfigId,serverId);
	
	
CREATE TABLE lum_XslCache
(	
		`fileName`
	 VARCHAR(255) NOT NULL,
		`enabled`
	 INT NOT NULL,
		`cached`
	 INT DEFAULT 1 NOT NULL,
	CONSTRAINT LUM_PK_XSLCACHE PRIMARY KEY (fileName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_File
(	
		`fileId`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`fullPath`
	 VARCHAR(500) NOT NULL,
		`contentType`
	 VARCHAR(100) NOT NULL,
		`fileSize`
	 INT NOT NULL,
		`type`
	 INT NOT NULL,
		`height`
	 INT NULL,
		`width`
	 INT NULL,
		`duration`
	 BIGINT NULL,
		`format`
	 VARCHAR(255) NULL,
		`macroType`
	 VARCHAR(10) NOT NULL,
		`colorDepth`
	 INT NULL,
		`videoFrameRate`
	 DOUBLE PRECISION NULL,
		`audioBitRate`
	 DOUBLE PRECISION NULL,
		`audioSamplingRate`
	 INT NULL,
		`audioChannels`
	 INT NULL,
	CONSTRAINT LUM_PK_FILE PRIMARY KEY (fileId),
	CONSTRAINT LUM_FK_FILE FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_FileMimeType
(	
		`id`
	 CHAR(32) NOT NULL,
		`mimeType`
	 VARCHAR(100) NOT NULL,
		`icon`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_FILEMIMETYPE PRIMARY KEY (id),
	CONSTRAINT LUM_UN_FILEMIMETYPE UNIQUE (mimeType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_Files
(	
		`filesId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_FILES PRIMARY KEY (filesId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_FilesList
(	
		`id`
	 CHAR(32) NOT NULL,
		`filesId`
	 CHAR(32) NOT NULL,
		`fileId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_FILESLIST PRIMARY KEY (id),
	CONSTRAINT LUM_FK_FILESLIST FOREIGN KEY (filesId) REFERENCES lum_Files(filesId),
	CONSTRAINT LUM_FK_FILESLIST2 FOREIGN KEY (fileId) REFERENCES lum_File(fileId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_FTTransformationPrm
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(32) NOT NULL,
		`builder`
	 VARCHAR(128) NULL,
	CONSTRAINT LUM_PK_FTTRANSFORMATIONPRM PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_FTTRANSFORMATIONPRM1 ON lum_FTTransformationPrm(name);
	
	
CREATE TABLE lum_FTTransformationFile
(	
		`id`
	 CHAR(32) NOT NULL,
		`filePrefix`
	 VARCHAR(10) NULL,
		`fileSufix`
	 VARCHAR(10) NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
		`contentType`
	 VARCHAR(64) NOT NULL,
		`name`
	 VARCHAR(64) NOT NULL,
		`displayName`
	 VARCHAR(255) NOT NULL,
		`extension`
	 VARCHAR(10) NULL,
	CONSTRAINT LUM_PK_FTTRANSFORMATIONFILE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_FTTRANSFORMATIONFILE1 ON lum_FTTransformationFile(serviceInstanceId);
	
CREATE UNIQUE INDEX LUM_IX_FTTRANSFORMATIONFILE2 ON lum_FTTransformationFile(name,serviceInstanceId);
	
	
CREATE TABLE lum_FTTransformationPrmValues
(	
		`id`
	 CHAR(32) NOT NULL,
		`tnsfPrmId`
	 CHAR(32) NOT NULL,
		`fileTransformationId`
	 CHAR(32) NOT NULL,
		`value`
	 VARCHAR(64) NOT NULL,
	CONSTRAINT LUM_PK_FTTRANSFORMATIONPRMVLS PRIMARY KEY (id),
	CONSTRAINT LUM_FK_FTTRANSFORMATIONPRMVLS1 FOREIGN KEY (tnsfPrmId) REFERENCES lum_FTTransformationPrm(id),
	CONSTRAINT LUM_FK_FTTRANSFORMATIONPRMVLS2 FOREIGN KEY (fileTransformationId) REFERENCES lum_FTTransformationFile(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_FTTRANSFORMATIONPRMVLS1 ON lum_FTTransformationPrmValues(fileTransformationId,tnsfPrmId);
	
CREATE TABLE lum_FTTransformedFile
(	
		`transformedFileId`
	 CHAR(32) NOT NULL,
		`fileTnsfId`
	 CHAR(32) NOT NULL,
		`fileConfigId`
	 CHAR(32) NOT NULL,
		`fullPath`
	 VARCHAR(500) NOT NULL,
		`contentType`
	 VARCHAR(100) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`fileSize`
	 INT NOT NULL,
		`height`
	 INT NULL,
		`width`
	 INT NULL,
		`duration`
	 BIGINT NULL,
		`format`
	 VARCHAR(10) NULL,
		`macroType`
	 VARCHAR(10) NOT NULL,
		`colorDepth`
	 INT NULL,
		`videoFrameRate`
	 DOUBLE PRECISION NULL,
		`audioBitRate`
	 DOUBLE PRECISION NULL,
		`audioSamplingRate`
	 INT NULL,
		`audioChannels`
	 INT NULL,
	CONSTRAINT LUM_PK_FTTRANSFORMEDFILE PRIMARY KEY (transformedFileId),
	CONSTRAINT LUM_FK_FTTRANSFORMEDFILE1 FOREIGN KEY (fileTnsfId) REFERENCES lum_FTTransformationFile(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_FTTRANSFORMEDFILE1 ON lum_FTTransformedFile(fileConfigId);
	
CREATE TABLE lum_Observer
(	
		`observerId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`className`
	 VARCHAR(255) NOT NULL,
		`enabled`
	 INT DEFAULT 1 NOT NULL,
	CONSTRAINT LUM_PK_OBSERVER PRIMARY KEY (observerId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_MailConfig
(	
		`id`
	 CHAR(32) NOT NULL,
		`smtpHost`
	 VARCHAR(255) NOT NULL,
		`smtpPort`
	 INT NOT NULL,
		`smtpUser`
	 VARCHAR(255) NULL,
		`smtpPassword`
	 VARCHAR(255) NULL,
		`sendInterval`
	 INT NOT NULL,
		`maxSendThreads`
	 INT NOT NULL,
		`blockSize`
	 INT NOT NULL,
		`blockInterval`
	 INT NOT NULL,
		`removeMailsSent`
	 INT NOT NULL,
		`queueLockTimeout`
	 INT NOT NULL,
		`mailSenderClass`
	 VARCHAR(255) NOT NULL,
		`defaultFromAddress`
	 VARCHAR(255) NULL,
		`cryptographicProtocol`
	 VARCHAR(4) DEFAULT 'NONE' NOT NULL,
		`socketTimeout`
	 INT DEFAULT 0 NOT NULL,
		`socketConnectionTimeout`
	 INT DEFAULT 0 NOT NULL,
	CONSTRAINT LUM_PK_MAILCONFIG PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_MailBody
(	
		`id`
	 CHAR(32) NOT NULL,
		`textMsg`
	 LONGTEXT NULL,
		`htmlMsg`
	 LONGTEXT NULL,
	CONSTRAINT LUM_PK_MAILBODY PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_Mail
(	
		`id`
	 CHAR(32) NOT NULL,
		`mailQueueId`
	 CHAR(32) NOT NULL,
		`mailBodyId`
	 CHAR(32) NULL,
		`charset`
	 VARCHAR(50) NOT NULL,
		`subject`
	 VARCHAR(255) NULL,
		`fromAddress`
	 VARCHAR(255) NULL,
		`toAddress`
	 VARCHAR(255) NULL,
		`ccAddress`
	 VARCHAR(255) NULL,
		`bccAddress`
	 VARCHAR(255) NULL,
		`replyToAddress`
	 VARCHAR(255) NULL,
		`requestDateTime`
	 DATETIME NOT NULL,
		`sourceComponent`
	 VARCHAR(255) NULL,
		`sourceComponentStringsUrl`
	 VARCHAR(255) NULL,
		`sentDateTime`
	 DATETIME NULL,
		`status`
	 INT NOT NULL,
		`errorMessage`
	 VARCHAR(500) NULL,
	CONSTRAINT LUM_PK_MAIL PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MAIL1 FOREIGN KEY (mailBodyId) REFERENCES lum_MailBody(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
CREATE INDEX LUM_IDX_MAIL1 ON lum_Mail(mailQueueId,requestDateTime);
	
CREATE INDEX LUM_IDX_MAIL3 ON lum_Mail(mailBodyId);
	
	
CREATE TABLE lum_MailDestination
(	
		`id`
	 CHAR(32) NOT NULL,
		`mailId`
	 CHAR(32) NOT NULL,
		`emailAddress`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(255) NULL,
		`sentDateTime`
	 DATETIME NULL,
		`status`
	 INT NOT NULL,
		`errorMessage`
	 VARCHAR(2000) NULL,
	CONSTRAINT LUM_PK_MAILDESTINATION PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MAILDESTINATION1 FOREIGN KEY (mailId) REFERENCES lum_Mail(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_MAILDESTINATION1 ON lum_MailDestination(mailId,status);
	
CREATE TABLE lum_MailAttachment
(	
		`id`
	 CHAR(32) NOT NULL,
		`mailBodyId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`contentType`
	 VARCHAR(100) NOT NULL,
		`content`
	 LONGBLOB NOT NULL,
	CONSTRAINT LUM_PK_MAILATTACHMENT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MAILATTACHMENT FOREIGN KEY (mailBodyId) REFERENCES lum_MailBody(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_MAILATTACHMENT1 ON lum_MailAttachment(mailBodyId);
	
CREATE TABLE lum_MailQueue
(	
		`id`
	 CHAR(32) NOT NULL,
		`locked`
	 INT NOT NULL,
		`lockExpirationDateTime`
	 DATETIME NULL,
		`requestDateTime`
	 DATETIME NULL,
	CONSTRAINT LUM_PK_MAILQUEUE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE INDEX LUM_IDX_MAILQUEUE1 ON lum_MailQueue(requestDateTime,lockExpirationDateTime,locked);
	
	
CREATE TABLE lum_Preferences
(	
		`id`
	 CHAR(32) NOT NULL,
		`resourceId`
	 CHAR(32) NOT NULL,
		`resourceType`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_PREFERENCES PRIMARY KEY (id),
	CONSTRAINT LUM_UN_PREFERENCES1 UNIQUE (resourceId,resourceType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_PrefPrinc
(	
		`id`
	 CHAR(32) NOT NULL,
		`preferencesId`
	 CHAR(32) NOT NULL,
		`principalId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_PREFPRINC PRIMARY KEY (id),
	CONSTRAINT LUM_UN_PREFPRINC1 UNIQUE (preferencesId,principalId),
	CONSTRAINT LUM_FK_PREFPRINC1 FOREIGN KEY (preferencesId) REFERENCES lum_Preferences(id) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_PREFPRINC2 FOREIGN KEY (principalId) REFERENCES lum_Principal(principalId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_PrefPrincEntry
(	
		`id`
	 CHAR(32) NOT NULL,
		`prefPrincId`
	 CHAR(32) NOT NULL,
		`entryKey`
	 VARCHAR(255) NOT NULL,
		`readOnly`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_PREFPRINCENTRY PRIMARY KEY (id),
	CONSTRAINT LUM_UN_PREFPRINCENTRY1 UNIQUE (prefPrincId,entryKey),
	CONSTRAINT LUM_FK_PREFPRINCENTRY1 FOREIGN KEY (prefPrincId) REFERENCES lum_PrefPrinc(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_PrefPrincEntryValue
(	
		`prefPrincEntryId`
	 CHAR(32) NOT NULL,
		`value`
	 VARCHAR(255) NULL,
		`position`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_PREFPRINCENTRYVALUE PRIMARY KEY (prefPrincEntryId,position),
	CONSTRAINT LUM_FK_PREFPRINCENTRYVALUE1 FOREIGN KEY (prefPrincEntryId) REFERENCES lum_PrefPrincEntry(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_Progress
(	
		`id`
	 CHAR(32) NOT NULL,
		`processId`
	 CHAR(32) NOT NULL,
		`createdDateTime`
	 BIGINT NOT NULL,
		`lastMessage`
	 INT NOT NULL,
		`type`
	 INT NOT NULL,
		`overallMax`
	 INT NULL,
		`overallValue`
	 INT NULL,
		`itemMax`
	 INT NULL,
		`itemValue`
	 INT NULL,
		`message`
	 LONGTEXT NULL,
		`elapsedTime`
	 INT NULL,
		`innerProgressId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_PROGRESS PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;	
	
CREATE INDEX LUM_IDX_PROGRESS1 ON lum_Progress(processId,type);
	
CREATE INDEX LUM_IDX_PROGRESS2 ON lum_Progress(processId,createdDateTime);
	
CREATE INDEX LUM_IDX_PROGRESS3 ON lum_Progress(createdDateTime);
	
CREATE TABLE lum_Cache
(	
		`id`
	 VARCHAR(255) NOT NULL,
		`capacity`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_CACHE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;	
	
CREATE TABLE lum_RepType
(	
		`id`
	 VARCHAR(255) NOT NULL,
		`reportPath`
	 VARCHAR(255) NOT NULL,
		`baseUrl`
	 VARCHAR(255) NULL,
		`configParametersDef`
	 LONGTEXT NULL,
		`runtimeParametersDef`
	 LONGTEXT NULL,
		`dataSourceProvider`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_REPTYPE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_REPTYPE ON lum_RepType(baseUrl);

	
CREATE TABLE lum_RepTypeParameter
(	
		`id`
	 CHAR(32) NOT NULL,
		`reportTypeId`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
		`type`
	 VARCHAR(255) NULL,
		`value`
	 LONGTEXT NULL,
	CONSTRAINT LUM_PK_REPTYPEPARAM PRIMARY KEY (id),
	CONSTRAINT LUM_FK_REPTYPEPARAM1 FOREIGN KEY (reportTypeId) REFERENCES lum_RepType(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_REPTYPEPARAMETER ON lum_RepTypeParameter(reportTypeId,name);
	
	
CREATE TABLE lum_RepReport
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`reportTypeId`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_REPREPORT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_REPREPORT1 FOREIGN KEY (reportTypeId) REFERENCES lum_RepType(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_REPREPORT ON lum_RepReport(reportTypeId);
	
	
CREATE TABLE lum_RepParameter
(	
		`id`
	 CHAR(32) NOT NULL,
		`reportId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`value`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_REPPARAMETER PRIMARY KEY (id),
	CONSTRAINT LUM_FK_REPPARAMETER1 FOREIGN KEY (reportId) REFERENCES lum_RepReport(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_REPPARAMETER ON lum_RepParameter(reportId,name);
	
CREATE TABLE lum_DEPackage
(	
		`id`
	 CHAR(32) NOT NULL,
		`userId`
	 CHAR(32) NOT NULL,
		`outcome`
	 VARCHAR(50) NOT NULL,
		`installDate`
	 DATETIME NULL,
		`packageFile`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_DEPACKAGE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;	
	
CREATE TABLE lum_DEModule
(	
		`id`
	 VARCHAR(50) NOT NULL,
		`displayName`
	 VARCHAR(50) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`deploymentDateTime`
	 DATETIME NOT NULL,
		`type`
	 INT NOT NULL,
		`checksum`
	 CHAR(28) NULL,
		`numErrors`
	 INT NOT NULL,
		`numWarnings`
	 INT NOT NULL,
		`deployMessage`
	 LONGTEXT NULL,
		`version`
	 VARCHAR(30) NULL,
		`status`
	 VARCHAR(20) NOT NULL,
		`resolved`
	 TINYINT NOT NULL,
		`sourceDir`
	 VARCHAR(255) NULL,
		`metadata`
	 LONGBLOB NULL,
	CONSTRAINT LUM_PK_DEMODULE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_DEMODULE1 ON lum_DEModule(type);
	
CREATE INDEX LUM_IX_DEMODULE2 ON lum_DEModule(status);
	
CREATE TABLE lum_DEComponent
(	
		`id`
	 VARCHAR(255) NOT NULL,
		`moduleId`
	 VARCHAR(50) NOT NULL,
		`version`
	 VARCHAR(30) NULL,
		`description`
	 LONGTEXT NULL,
		`channelId`
	 VARCHAR(32) NULL,
		`sourcePath`
	 VARCHAR(255) NULL,
		`checksum`
	 CHAR(28) NULL,
		`status`
	 VARCHAR(20) NOT NULL,
		`numErrors`
	 INT NOT NULL,
		`numWarnings`
	 INT NOT NULL,
		`deployMessage`
	 LONGTEXT NULL,
		`deploymentDateTime`
	 DATETIME NOT NULL,
		`resolved`
	 TINYINT NOT NULL,
		`lastUpgradeStepExecuted`
	 VARCHAR(30) NULL,
		`metadata`
	 LONGBLOB NULL,
	CONSTRAINT LUM_PK_DECOMPONENT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_DECOMPONENT1 FOREIGN KEY (channelId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_DECOMPONENT2 FOREIGN KEY (moduleId) REFERENCES lum_DEModule(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_DECOMPONENT1 ON lum_DEComponent(channelId);
	
CREATE INDEX LUM_IX_DECOMPONENT2 ON lum_DEComponent(status);
	
CREATE VIEW lum_vwChannelComponent AS
(
	
			SELECT
				ch.*,
				co.id componentId,
				co.sourcePath,
				mo.sourceDir as moduleSourceDir
			FROM
				lum_Channel ch
			LEFT OUTER JOIN lum_DEComponent co
				ON ch.channelId = co.channelId
			LEFT OUTER JOIN lum_DEModule mo
				ON co.moduleId = mo.id
		
);
	
CREATE TABLE lum_DELastDeployment
(	
		`id`
	 CHAR(32) NOT NULL,
		`installInProgress`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_DELASTDEPLOYMENT PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_DEDeploymentMessage
(	
		`id`
	 CHAR(32) NOT NULL,
		`objectId`
	 VARCHAR(255) NOT NULL,
		`objectType`
	 CHAR(1) NOT NULL,
		`messageLevel`
	 VARCHAR(10) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`message`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_DEDEPLOYMENTMESSAGE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_DEDEPLOYMENTMESSAGE1 ON lum_DEDeploymentMessage(objectType,objectId);
	
	
CREATE TABLE lum_CrySymmetricCipher
(	
		`id`
	 CHAR(32) NOT NULL,
		`cipherKey`
	 VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		`iv`
	 VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		`macKey`
	 VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
	CONSTRAINT LUM_PK_CRYSYMMETRICCIPHER PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_AuditCategory
(	
		`categoryId`
	 CHAR(32) NOT NULL,
		`auditCategoryKey`
	 VARCHAR(100) NOT NULL,
		`name`
	 VARCHAR(50) NOT NULL,
		`description`
	 LONGTEXT NOT NULL,
		`enabled`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_AUDITCATEGORY PRIMARY KEY (categoryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IDX_AUDITCATEGORY1 ON lum_AuditCategory(auditCategoryKey);

	
CREATE TABLE lum_AuditEntryType
(	
		`auditEntryTypeId`
	 CHAR(32) NOT NULL,
		`auditEntryTypeKey`
	 VARCHAR(100) NOT NULL,
		`name`
	 VARCHAR(50) NOT NULL,
		`description`
	 LONGTEXT NOT NULL,
		`enabled`
	 TINYINT NOT NULL,
		`categoryId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_AUDITENTRYTYPE PRIMARY KEY (auditEntryTypeId),
	CONSTRAINT LUM_FK_AUDITENTRYTYPE1 FOREIGN KEY (categoryId) REFERENCES lum_AuditCategory(categoryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IDX_AUDITENTRYTYPE1 ON lum_AuditEntryType(auditEntryTypeKey);
	
CREATE INDEX LUM_IDX_AUDITENTRYTYPE2 ON lum_AuditEntryType(categoryId);

	
CREATE TABLE lum_AuditEntry
(	
		`auditEntryId`
	 CHAR(32) NOT NULL,
		`entryDate`
	 DATETIME NOT NULL,
		`serverId`
	 VARCHAR(50) NOT NULL,
		`entryUserLogin`
	 VARCHAR(100) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`description`
	 LONGTEXT NOT NULL,
		`categoryId`
	 CHAR(32) NOT NULL,
		`auditEntryTypeId`
	 CHAR(32) NOT NULL,
		`parentEntryId`
	 CHAR(32) NULL,
		`entryUserId`
	 VARCHAR(32) NOT NULL,
		`entryState`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_AUDITENTRY PRIMARY KEY (auditEntryId),
	CONSTRAINT LUM_FK_AUDITENTRY1 FOREIGN KEY (categoryId) REFERENCES lum_AuditCategory(categoryId),
	CONSTRAINT LUM_FK_AUDITENTRY2 FOREIGN KEY (auditEntryTypeId) REFERENCES lum_AuditEntryType(auditEntryTypeId),
	CONSTRAINT LUM_FK_AUDITENTRY3 FOREIGN KEY (parentEntryId) REFERENCES lum_AuditEntry(auditEntryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_AUDITENTRY1 ON lum_AuditEntry(entryDate,categoryId,auditEntryTypeId);
	
CREATE INDEX LUM_IDX_AUDITENTRY2 ON lum_AuditEntry(categoryId,auditEntryTypeId,entryDate);	
	
CREATE TABLE lum_AuditConfig
(	
		`auditConfigId`
	 CHAR(32) NOT NULL,
		`cleanInterval`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_AUDITCONFIG PRIMARY KEY (auditConfigId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
CREATE TABLE lum_WFRType
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`fileReplicatorClassName`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_WFRTYPE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;	
	
CREATE TABLE lum_WFRProperty
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`dataType`
	 VARCHAR(255) NOT NULL,
		`type`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_WFRPROPERTY PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WFRPROPERTY1 FOREIGN KEY (type) REFERENCES lum_WFRType(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_WFReplication
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`type`
	 CHAR(32) NOT NULL,
		`filterChannelId`
	 VARCHAR(32) NULL,
		`filterPath`
	 LONGTEXT NULL,
		`websiteId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_WFREPLICATION PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WFREPLICATION1 FOREIGN KEY (type) REFERENCES lum_WFRType(id),
	CONSTRAINT LUM_FK_WFREPLICATION2 FOREIGN KEY (filterChannelId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_WFREPLICATION3 FOREIGN KEY (websiteId) REFERENCES lum_Website(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
-- Index to filter lum_WFReplication.
CREATE INDEX LUM_IX_WFREPLICATION1 ON lum_WFReplication(websiteId);
		
	
CREATE TABLE lum_WFRPropValue
(	
		`id`
	 CHAR(32) NOT NULL,
		`replicationId`
	 CHAR(32) NOT NULL,
		`propertyId`
	 CHAR(32) NOT NULL,
		`value`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_WFRPROPVALUE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WFRPROPVALUE1 FOREIGN KEY (replicationId) REFERENCES lum_WFReplication(id),
	CONSTRAINT LUM_FK_WFRPROPVALUE2 FOREIGN KEY (propertyId) REFERENCES lum_WFRProperty(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
-- Index for navigation from lum_WFReplication to lum_WFRPropValue.
CREATE INDEX LUM_IX_WFRPROPVALUE1 ON lum_WFRPropValue(replicationId);
	
	
CREATE TABLE lum_SISocialNetwork
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`permissions`
	 VARCHAR(255) NULL,
		`messageMaxLength`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_SISOCIALNETWORK PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_SIApplication
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`publicSocialNetworkId`
	 CHAR(32) NOT NULL,
		`enabled`
	 TINYINT NOT NULL,
		`consumerKey`
	 VARCHAR(64) NOT NULL,
		`consumerKeySecret`
	 VARCHAR(64) NOT NULL,
	CONSTRAINT LUM_PK_SIAPPLICATION PRIMARY KEY (id),
	CONSTRAINT LUM_FK_SIAPPLICATION1 FOREIGN KEY (publicSocialNetworkId) REFERENCES lum_SISocialNetwork(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_SIAPPLICATION1 ON lum_SIApplication(publicSocialNetworkId);
	
CREATE TABLE lum_SIApplicationAccount
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`socialNetworkApplicationId`
	 CHAR(32) NOT NULL,
		`enabled`
	 TINYINT NOT NULL,
		`authenticationResponse`
	 VARCHAR(255) NOT NULL,
		`allServiceInstances`
	 TINYINT NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
		`publicationDestination`
	 VARCHAR(255) NOT NULL,
		`publicationToken`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_SIAPPLICATIONACCOUNT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_SIAPPLICATIONACCOUNT1 FOREIGN KEY (socialNetworkApplicationId) REFERENCES lum_SIApplication(id),
	CONSTRAINT LUM_FK_SIAPPLICATIONACCOUNT2 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_SIAPPLICATIONACCOUNT1 ON lum_SIApplicationAccount(socialNetworkApplicationId);
	
CREATE INDEX LUM_IX_SIAPPLICATIONACCOUNT2 ON lum_SIApplicationAccount(serviceInstanceId);
	
CREATE TABLE lum_SIMessage
(	
		`id`
	 CHAR(32) NOT NULL,
		`remoteId`
	 VARCHAR(50) NULL,
		`messageContent`
	 LONGTEXT NOT NULL,
		`accountId`
	 CHAR(32) NOT NULL,
		`publishDate`
	 DATETIME NULL,
		`status`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_SIMESSAGE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_SIMESSAGE1 FOREIGN KEY (accountId) REFERENCES lum_SIApplicationAccount(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_SIMESSAGE1 ON lum_SIMessage(accountId,status);
	
	
CREATE TABLE lum_SIRemoteMessageId
(	
		`messageId`
	 CHAR(32) NOT NULL,
		`remoteId`
	 VARCHAR(50) NULL,
		`accountId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_SIREMOTEMESSAGEID PRIMARY KEY (messageId),
	CONSTRAINT LUM_FK_SIREMOTEMESSAGEID1 FOREIGN KEY (accountId) REFERENCES lum_SIApplicationAccount(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_SIREMOTEMESSAGEID1 ON lum_SIRemoteMessageId(accountId);
	
	
CREATE TABLE lum_SIQueue
(	
		`messageId`
	 CHAR(32) NOT NULL,
		`status`
	 INT NOT NULL,
		`processId`
	 CHAR(32) NOT NULL,
		`publishDateTime`
	 DATETIME NOT NULL,
		`messageContent`
	 LONGTEXT NOT NULL,
		`accountId`
	 CHAR(32) NOT NULL,
		`action`
	 VARCHAR(1) NOT NULL,
		`locale`
	 VARCHAR(5) NULL,
	CONSTRAINT LUM_PK_SIQUEUE PRIMARY KEY (processId),
	CONSTRAINT LUM_FK_SIQUEUE1 FOREIGN KEY (accountId) REFERENCES lum_SIApplicationAccount(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_SIQUEUE1 ON lum_SIQueue(messageId,publishDateTime desc);
	
CREATE INDEX LUM_IX_SIQUEUE2 ON lum_SIQueue(publishDateTime desc);
	
CREATE INDEX LUM_IX_SIQUEUE3 ON lum_SIQueue(accountId,publishDateTime desc);
	
	
CREATE TABLE lum_PQQueueServerConfig
(	
		`id`
	 CHAR(32) NOT NULL,
		`serverId`
	 VARCHAR(128) NOT NULL,
		`threads`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_PQQUEUESERVERCONFIG PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE UNIQUE INDEX LUM_IDX_PQQUEUESERVERCONFIG1 ON lum_PQQueueServerConfig(serverId);
	
	
CREATE TABLE lum_PQQueueTaskProcess
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(128) NULL,
		`status`
	 INT NOT NULL,
		`queued`
	 DATETIME NOT NULL,
		`scheduled`
	 DATETIME NULL,
		`scheduledTimeMillis`
	 BIGINT NOT NULL,
		`started`
	 DATETIME NULL,
		`finished`
	 DATETIME NULL,
		`task`
	 LONGBLOB NOT NULL,
		`ownerId`
	 CHAR(32) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	ALTER TABLE lum_PQQueueTaskProcess ADD taskOrder BIGINT NOT NULL AUTO_INCREMENT, ADD CONSTRAINT LUM_PK_PQQUEUETASKPROCESS PRIMARY KEY (taskOrder);
	
	
	
	
	
	
	
	
CREATE INDEX LUM_IX_PQQUEUETASKPROCESS1 ON lum_PQQueueTaskProcess(scheduledTimeMillis,status,taskOrder,id);
	
CREATE UNIQUE INDEX LUM_IX_PQQUEUETASKPROCESS2 ON lum_PQQueueTaskProcess(id);
	
CREATE INDEX LUM_IX_PQQUEUETASKPROCESS3 ON lum_PQQueueTaskProcess(status,id);
	
CREATE INDEX LUM_IX_PQQUEUETASKPROCESS4 ON lum_PQQueueTaskProcess(ownerId);
	
	
	
	
CREATE TABLE lum_PQTaskProcessLock
(	
		`id`
	 CHAR(32) NOT NULL,
		`taskProcessId`
	 CHAR(32) NOT NULL,
		`lockId`
	 VARCHAR(100) NOT NULL,
		`lockType`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_PQTASKPROCESSLOCK PRIMARY KEY (id),
	CONSTRAINT LUM_FK_PQTASKPROCESSLOCK1 FOREIGN KEY (taskProcessId) REFERENCES lum_PQQueueTaskProcess(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_PQTASKPROCESSLOCK1 ON lum_PQTaskProcessLock(taskProcessId,lockId,lockType);
	
	
CREATE TABLE lum_SNSocialNetwork
(	
		`socialNetworkId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(150) NOT NULL,
		`creationDate`
	 DATETIME NOT NULL,
		`channelBaseId`
	 VARCHAR(32) NOT NULL,
		`personalPageId`
	 VARCHAR(32) NOT NULL,
		`socialProfileServiceInstanceId`
	 CHAR(32) NULL,
		`socialProfileSourceId`
	 VARCHAR(255) NULL,
		`socialProfileUserFieldId`
	 VARCHAR(255) NULL,
		`socialProfileClassName`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_SNSOCIALNETWORK PRIMARY KEY (socialNetworkId),
	CONSTRAINT LUM_FK_SNSOCIALNETWORK1 FOREIGN KEY (channelBaseId) REFERENCES lum_Channel(channelId),
	CONSTRAINT LUM_FK_SNSOCIALNETWORK2 FOREIGN KEY (personalPageId) REFERENCES lum_Page(pageId),
	CONSTRAINT LUM_FK_SNSOCIALNETWORK3 FOREIGN KEY (socialProfileServiceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_SNSOCIALNETWORK1 ON lum_SNSocialNetwork(channelBaseId);
	
CREATE UNIQUE INDEX LUM_IX_SNSOCIALNETWORK2 ON lum_SNSocialNetwork(name);
	
CREATE INDEX LUM_IX_SNSOCIALNETWORK3 ON lum_SNSocialNetwork(personalPageId);
	
CREATE INDEX LUM_IX_SNSOCIALNETWORK4 ON lum_SNSocialNetwork(socialProfileServiceInstanceId);
	
	
CREATE TABLE lum_Theme
(	
		`id`
	 VARCHAR(100) NOT NULL,
		`name`
	 VARCHAR(50) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`openRtInterfaceBehavior`
	 VARCHAR(10) NULL,
		`openRtIntfBehaviorAcPar`
	 VARCHAR(10) NULL,
	CONSTRAINT LUM_PK_THEME PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
-- Theme usage view
CREATE VIEW lum_vwThemeUsage AS
(
	
			select 
				c.channelId as channelId, 
				c.name as channelName, 
				pag.pageId as pageId, 
				pag.name as pageName, 
				pdv.value as themeId
			from 
				lum_PBPropertyBag pb 
				inner join 
					lum_PBProperty p 
					on pb.id = p.propertyBagId 
				inner join 
					lum_PBPropertyDefault pd 
					on p.propertyDefaultId = pd.id 
				inner join 
					lum_PBPropertyDefValue pdv
					on pdv.propertyDefaultId = pd.id
				left outer join
					lum_Channel c 
					on c.propertyBagId = pb.id 
				left outer join
					lum_Page pag
					on pag.propertyBagId = pb.id 
			where 
				p.name = 'lumis.portal.themes'
		
);
	
	
CREATE TABLE lum_SRRelationshipType
(	
		`id`
	 VARCHAR(128) NOT NULL,
		`name`
	 VARCHAR(64) NOT NULL,
		`reverseName`
	 VARCHAR(64) NOT NULL,
		`bidirectional`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_SRRELATIONSHIPTYPE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_SRNodeTypeSource
(	
		`id`
	 CHAR(32) NOT NULL,
		`relationshipTypeId`
	 VARCHAR(128) NOT NULL,
		`typeName`
	 VARCHAR(128) NOT NULL,
	CONSTRAINT LUM_PK_SRNODETYPESOUCE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_SRNODETYPESOURCE FOREIGN KEY (relationshipTypeId) REFERENCES lum_SRRelationshipType(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_SRNodeTypeTarget
(	
		`id`
	 CHAR(32) NOT NULL,
		`relationshipTypeId`
	 VARCHAR(128) NOT NULL,
		`typeName`
	 VARCHAR(128) NOT NULL,
	CONSTRAINT LUM_PK_SRNODETYPETARGET PRIMARY KEY (id),
	CONSTRAINT LUM_FK_SRNODETYPETARGET FOREIGN KEY (relationshipTypeId) REFERENCES lum_SRRelationshipType(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_SRRelatableNode
(	
		`id`
	 CHAR(32) NOT NULL,
		`creationDate`
	 DATETIME NOT NULL,
		`type`
	 VARCHAR(128) NOT NULL,
		`objectId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_SRRELATABLENODE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_SRRelationshipNode
(	
		`id`
	 CHAR(32) NOT NULL,
		`source`
	 CHAR(32) NOT NULL,
		`target`
	 CHAR(32) NOT NULL,
		`relationshipTypeId`
	 VARCHAR(128) NOT NULL,
		`creationDate`
	 DATETIME NOT NULL,
	CONSTRAINT LUM_PK_SRRELATIONSHIPNODE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_SRRELATIONSHIPNODE FOREIGN KEY (source) REFERENCES lum_SRRelatableNode(id),
	CONSTRAINT LUM_FK_SRRELATIONSHIPNODE1 FOREIGN KEY (target) REFERENCES lum_SRRelatableNode(id),
	CONSTRAINT LUM_FK_SRRELATIONSHIPNODE2 FOREIGN KEY (relationshipTypeId) REFERENCES lum_SRRelationshipType(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_FMMacrotypeMap
(	
		`id`
	 CHAR(32) NOT NULL,
		`expression`
	 VARCHAR(255) NOT NULL,
		`fileMetadataType`
	 VARCHAR(10) NOT NULL,
		`position`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_FMMACROTYPEMAP PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_BCBusinessContext
(	
		`id`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`content`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_BCBUSINESSCONTEXT PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_IPProcess
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`lastExecutedStep`
	 INT NULL,
		`processState`
	 VARCHAR(50) NOT NULL,
		`owner`
	 CHAR(32) NULL,
		`ownerUserId`
	 VARCHAR(255) NULL,
		`callbackHandler`
	 LONGBLOB NULL,
		`creationDate`
	 DATETIME NULL,
		`lastExecutedStepDate`
	 DATETIME NULL,
	CONSTRAINT LUM_PK_IPPROCESS PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_IPStep
(	
		`id`
	 CHAR(32) NOT NULL,
		`stepNumber`
	 INT NOT NULL,
		`processId`
	 CHAR(32) NOT NULL,
		`executable`
	 LONGBLOB NOT NULL,
		`mandatory`
	 TINYINT NOT NULL,
		`ignoredDate`
	 DATETIME NULL,
		`ignoredUserId`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_IPSTEP PRIMARY KEY (id),
	CONSTRAINT LUM_FK_IPSTEP1 FOREIGN KEY (processId) REFERENCES lum_IPProcess(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
-- Index for searching steps of a process.
CREATE INDEX LUM_IX_IPSTEP1 ON lum_IPStep(processId);
	
CREATE TABLE lum_IPStepOutcome
(	
		`stepId`
	 CHAR(32) NOT NULL,
		`message`
	 LONGTEXT NULL,
		`outcomeStatus`
	 VARCHAR(50) NULL,
	CONSTRAINT LUM_PK_IPSTEPOUTCOME PRIMARY KEY (stepId),
	CONSTRAINT LUM_FK_IPSTEPOUTCOME1 FOREIGN KEY (stepId) REFERENCES lum_IPStep(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_IPStepEnvironment
(	
		`id`
	 CHAR(32) NOT NULL,
		`environmentTag`
	 VARCHAR(255) NULL,
		`environmentType`
	 VARCHAR(25) NULL,
		`stepId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_IPSTEPENVIRONMENT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_IPSTEPENVIRONMENT1 FOREIGN KEY (stepId) REFERENCES lum_IPStep(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
-- Index for searching environment restrictions of a step.
CREATE INDEX LUM_IX_IPSTEPENVIRONMENT1 ON lum_IPStepEnvironment(stepId);
	
CREATE TABLE lum_CfgEnvironmentConf
(	
		`id`
	 CHAR(32) NOT NULL,
		`type`
	 VARCHAR(25) NOT NULL,
		`fileSystemImplementation`
	 VARCHAR(255) NULL,
		`javaMelodyEnabled`
	 TINYINT DEFAULT 1 NOT NULL,
		`bigDataRepositoryType`
	 VARCHAR(30) DEFAULT 'ELASTICSEARCH_EMBEDDED' NOT NULL,
		`bigDataRepositoryClassName`
	 VARCHAR(255) NULL,
		`esClusterName`
	 VARCHAR(50) NULL,
		`esConnectionAddresses`
	 LONGTEXT NULL,
		`esIndexNamePrefix`
	 VARCHAR(80) NULL,
		`esBulkConcurrentRequests`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_CFGENVIRONMENTCONF PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_CfgEnvironmentTag
(	
		`environmentId`
	 CHAR(32) NOT NULL,
		`tag`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_CFGENVIRONMENTTAG PRIMARY KEY (environmentId,tag),
	CONSTRAINT LUM_FK_CFGENVIRONMENTTAG1 FOREIGN KEY (environmentId) REFERENCES lum_CfgEnvironmentConf(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_CfgServerConf
(	
		`serverId`
	 VARCHAR(255) NOT NULL,
		`baseSourcePath`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_CFGSERVERCONF PRIMARY KEY (serverId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
-- Area Tags usage view
CREATE VIEW lum_vwAreaTagsUsage AS
(
	
			select 
				c.channelId as channelId, 
				c.name as channelName, 
				si.serviceInstanceId as serviceInstanceId, 
				si.name as serviceInstanceName, 
				pdv.value as tag
			from 
				lum_PBPropertyBag pb 
				inner join 
					lum_PBProperty p 
					on pb.id = p.propertyBagId 
				inner join 
					lum_PBPropertyDefault pd 
					on p.propertyDefaultId = pd.id 
				inner join 
					lum_PBPropertyDefValue pdv
					on pdv.propertyDefaultId = pd.id
				left outer join
					lum_Channel c 
					on c.propertyBagId = pb.id 
				left outer join
					lum_ServiceInstance si
					on si.propertyBagId = pb.id 
			where 
				p.name = 'lumis.portal.areatag'
		
);

#-----------------------------------------------
#-- Generated SQL for: /lumis/doui/database
#-----------------------------------------------

	
CREATE TABLE lum_DouiDefinition
(	
		`serviceId`
	 VARCHAR(255) NOT NULL,
		`definition`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_DOUIDEFINITION PRIMARY KEY (serviceId),
	CONSTRAINT LUM_FK_DOUIDEFINITION FOREIGN KEY (serviceId) REFERENCES lum_Service(serviceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_DouiControl
(	
		`controlId`
	 VARCHAR(255) NOT NULL,
		`controlType`
	 VARCHAR(255) NOT NULL,
		`controlClass`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PF_DOUICONTROL PRIMARY KEY (controlId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_DouiSource
(	
		`sourceId`
	 VARCHAR(255) NOT NULL,
		`sourceType`
	 VARCHAR(255) NOT NULL,
		`sourceClass`
	 VARCHAR(255) NULL,
		`dataProviderClass`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_DOUISOURCE PRIMARY KEY (sourceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_DouiProcessAction
(	
		`processActionId`
	 VARCHAR(255) NOT NULL,
		`processActionType`
	 VARCHAR(255) NOT NULL,
		`processActionClass`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_DOUIPROCESSACT PRIMARY KEY (processActionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: /lumis/content/database
#-----------------------------------------------


	
CREATE TABLE lum_Content
(	
		`id`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
		`sourceId`
	 VARCHAR(255) NOT NULL,
		`defaultLocale`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_CONTENT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CONTENT1 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_CONTENT1 ON lum_Content(serviceInstanceId,sourceId);

	
CREATE TABLE lum_ContentVersion
(	
		`id`
	 CHAR(32) NOT NULL,
		`itemId`
	 CHAR(32) NOT NULL,
		`versionNumber`
	 INT NOT NULL,
		`primaryName`
	 VARCHAR(255) NULL,
		`introduction`
	 LONGTEXT NULL,
		`contentLocaleId`
	 CHAR(32) NOT NULL,
		`lastModifiedBy`
	 CHAR(32) NOT NULL,
		`lastModifiedDateTime`
	 DATETIME NOT NULL,
	CONSTRAINT LUM_PK_CONTENTVERSION PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_CONTENTVERSION1 ON lum_ContentVersion(itemId);
	
CREATE UNIQUE INDEX LUM_IX_CONTENTVERSION2 ON lum_ContentVersion(contentLocaleId,versionNumber);
	
	
CREATE TABLE lum_ContentLocale
(	
		`id`
	 CHAR(32) NOT NULL,
		`contentId`
	 CHAR(32) NOT NULL,
		`locale`
	 VARCHAR(10) NOT NULL,
		`createdDateTime`
	 DATETIME NOT NULL,
		`createdBy`
	 CHAR(32) NOT NULL,
		`activeVersionId`
	 CHAR(32) NULL,
		`publishedVersionId`
	 CHAR(32) NULL,
		`dirty`
	 TINYINT DEFAULT 0 NOT NULL,
		`lockType`
	 VARCHAR(10) NULL,
		`lockedBy`
	 CHAR(32) NULL,
		`lockedDate`
	 DATETIME NULL,
	CONSTRAINT LUM_PK_CONTENTLOCALE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CONTENTLOCALE1 FOREIGN KEY (contentId) REFERENCES lum_Content(id),
	CONSTRAINT LUM_FK_CONTENTLOCALE2 FOREIGN KEY (activeVersionId) REFERENCES lum_ContentVersion(id),
	CONSTRAINT LUM_FK_CONTENTLOCALE3 FOREIGN KEY (publishedVersionId) REFERENCES lum_ContentVersion(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
CREATE UNIQUE INDEX LUM_IX_CONTENTLOCALE1 ON lum_ContentLocale(contentId,locale);
	
	
CREATE INDEX LUM_IX_CONTENTLOCALE2 ON lum_ContentLocale(locale);

	
CREATE INDEX LUM_IX_CONTENTLOCALE3 ON lum_ContentLocale(dirty);
	
	
-- Optimize navigation from ContentVersion to ContentLocale or Content based on activeVersionId.
CREATE INDEX LUM_IX_CONTENTLOCALE4 ON lum_ContentLocale(activeVersionId,contentId);
	
	
-- Optimize navigation from ContentVersion to ContentLocale or Content based on publishedVersionId.
CREATE INDEX LUM_IX_CONTENTLOCALE5 ON lum_ContentLocale(publishedVersionId,contentId);
	
	
CREATE TABLE lum_ContentComment
(	
		`id`
	 CHAR(32) NOT NULL,
		`contentLocaleId`
	 CHAR(32) NOT NULL,
		`createdBy`
	 CHAR(32) NOT NULL,
		`createdDateTime`
	 DATETIME NOT NULL,
		`commentText`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_CONTENTCOMMENT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CONTENTCOMMENT1 FOREIGN KEY (contentLocaleId) REFERENCES lum_ContentLocale(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_ContentAssociation
(	
		`id`
	 CHAR(32) NOT NULL,
		`contentVersionId`
	 CHAR(32) NOT NULL,
		`associatedContentId`
	 CHAR(32) NOT NULL,
		`type`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_CONTENTASSOCIATION PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CONTENTASSOCIATION1 FOREIGN KEY (contentVersionId) REFERENCES lum_ContentVersion(id) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_CONTENTASSOCIATION2 FOREIGN KEY (associatedContentId) REFERENCES lum_Content(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_ContentPublication
(	
		`id`
	 CHAR(32) NOT NULL,
		`contentVersionId`
	 CHAR(32) NULL,
		`highlight`
	 INT NOT NULL,
		`highlightEndDateTime`
	 DATETIME NULL,
		`publishStartDateTime`
	 DATETIME NULL,
		`publishEndDateTime`
	 DATETIME NULL,
		`published`
	 INT NOT NULL,
		`waitingForExpiration`
	 INT NOT NULL,
		`waitingForPublishing`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_CONTENTPUBLICATION PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CONTENTPUBLICATION1 FOREIGN KEY (contentVersionId) REFERENCES lum_ContentVersion(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
-- Used for updating published state in ContentClock.
CREATE INDEX LUM_IX_CONTENTPUBLICATION1 ON lum_ContentPublication(published,waitingForPublishing,publishStartDateTime,publishEndDateTime);
	
	
-- Used for updating published state in ContentClock.
CREATE INDEX LUM_IX_CONTENTPUBLICATION2 ON lum_ContentPublication(published,waitingForExpiration,publishStartDateTime,publishEndDateTime);
	
	
-- Used for updating highlight state in ContentClock.
CREATE INDEX LUM_IX_CONTENTPUBLICATION3 ON lum_ContentPublication(highlight,highlightEndDateTime);
	
	
-- Used on default lists, to filter versions that are currently published (and optionally highlighted), and generic queries by content version.
CREATE INDEX LUM_IX_CONTENTPUBLICATION4 ON lum_ContentPublication(contentVersionId,published,highlight);
	
	
CREATE TABLE lum_ContentPubPrincipal
(	
		`id`
	 CHAR(32) NOT NULL,
		`contentPublicationId`
	 CHAR(32) NOT NULL,
		`principalId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_CONTENTPUBPRINCIPAL PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CONTENTPUBPRINCIPAL1 FOREIGN KEY (contentPublicationId) REFERENCES lum_ContentPublication(id) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_CONTENTPUBPRINCIPAL2 FOREIGN KEY (principalId) REFERENCES lum_Principal(principalId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IDX_CONTENTPUBPRINCIPAL1 ON lum_ContentPubPrincipal(contentPublicationId,principalId);
	
	
CREATE TABLE lum_ContentPubServiceInst
(	
		`id`
	 CHAR(32) NOT NULL,
		`contentPublicationId`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_CONTENTPUBSERVICEINST PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CONTENTPUBSERVICEINST1 FOREIGN KEY (contentPublicationId) REFERENCES lum_ContentPublication(id) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_CONTENTPUBSERVICEINST2 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IDX_CONTENTPUBSERVICEINST1 ON lum_ContentPubServiceInst(contentPublicationId,serviceInstanceId);
	
CREATE TABLE lum_ContentTag
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(30) NOT NULL,
		`normalizedName`
	 VARCHAR(40) NOT NULL,
	CONSTRAINT LUM_PK_CONTENT_TAG PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IDX_CONTENT_TAG ON lum_ContentTag(normalizedName);
	
CREATE TABLE lum_ContentLocaleTag
(	
		`id`
	 CHAR(32) NOT NULL,
		`tagContentId`
	 CHAR(32) NOT NULL,
		`contentLocaleId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_LOCALE_CONTENT_TAG PRIMARY KEY (id),
	CONSTRAINT LUM_FK_TAG_CONTENT_ID FOREIGN KEY (tagContentId) REFERENCES lum_Content(id) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_CONTENT_LOCALE_ID FOREIGN KEY (contentLocaleId) REFERENCES lum_ContentLocale(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IDX_CONTENT_LOCALE_TAG ON lum_ContentLocaleTag(tagContentId,contentLocaleId);
	
CREATE UNIQUE INDEX LUM_IDX_CONTENT_LOCALE_TAG_1 ON lum_ContentLocaleTag(contentLocaleId,tagContentId);
	
CREATE TABLE lum_SIAccountServiceInstance
(	
		`id`
	 CHAR(32) NOT NULL,
		`accountId`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_SIACCOUNTSVCINSTANCE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_SIACCOUNTSVCINSTANCE1 FOREIGN KEY (accountId) REFERENCES lum_SIApplicationAccount(id) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_SIACCOUNTSVCINSTANCE2 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_SIACCOUNTSVCINSTANCE1 ON lum_SIAccountServiceInstance(accountId);
	
CREATE INDEX LUM_IX_SIACCOUNTSVCINSTANCE2 ON lum_SIAccountServiceInstance(serviceInstanceId);
	
CREATE TABLE lum_SIContentMessage
(	
		`id`
	 CHAR(32) NOT NULL,
		`contentLocaleId`
	 CHAR(32) NOT NULL,
		`messageId`
	 CHAR(32) NOT NULL,
		`isDefault`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_SICONTENTMESSAGE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_SICONTENTMESSAGE1 FOREIGN KEY (contentLocaleId) REFERENCES lum_ContentLocale(id),
	CONSTRAINT LUM_FK_SICONTENTMESSAGE2 FOREIGN KEY (messageId) REFERENCES lum_SIMessage(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_SICONTENTMESSAGE1 ON lum_SIContentMessage(contentLocaleId);
	
CREATE INDEX LUM_IX_SICONTENTMESSAGE2 ON lum_SIContentMessage(messageId);

#-----------------------------------------------
#-- Generated SQL for: /lumis/workflow/database
#-----------------------------------------------

	
CREATE TABLE lum_Workflow
(	
		`workflowId`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`baseUrl`
	 VARCHAR(255) NULL,
		`stringsUrlPrefix`
	 VARCHAR(255) NULL,
		`definition`
	 LONGTEXT NULL,
	CONSTRAINT LUM_PK_WORKFLOW PRIMARY KEY (workflowId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_WorkflowMetaData
(	
		`workflowMetaDataId`
	 CHAR(32) NOT NULL,
		`contentLocaleId`
	 CHAR(32) NOT NULL,
		`stateId`
	 VARCHAR(100) NOT NULL,
		`assignedTo`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_WORKFLOWMD PRIMARY KEY (workflowMetaDataId),
	CONSTRAINT LUM_FK_WORKFLOWMD FOREIGN KEY (contentLocaleId) REFERENCES lum_ContentLocale(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
CREATE UNIQUE INDEX LUM_IX_WORKFLOWMD ON lum_WorkflowMetaData(contentLocaleId);
	
	
CREATE TABLE lum_WorkflowServiceInstance
(	
		`id`
	 CHAR(32) NOT NULL,
		`workflowId`
	 VARCHAR(255) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_WORKFLOWSI PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WORKFLOWSI FOREIGN KEY (workflowId) REFERENCES lum_Workflow(workflowId),
	CONSTRAINT LUM_FK_WORKFLOWSI2 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE UNIQUE INDEX LUM_IX_WORKFLOWSI ON lum_WorkflowServiceInstance(serviceInstanceId);
	
	
CREATE TABLE lum_WorkflowPermission
(	
		`id`
	 CHAR(32) NOT NULL,
		`workflowServiceInstanceId`
	 CHAR(32) NOT NULL,
		`principalId`
	 CHAR(32) NOT NULL,
		`role`
	 VARCHAR(100) NOT NULL,
		`type`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_WORKFLOW_PERM PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WORKFLOW_PERM FOREIGN KEY (workflowServiceInstanceId) REFERENCES lum_WorkflowServiceInstance(id),
	CONSTRAINT LUM_FK_WORKFLOW_PERM2 FOREIGN KEY (principalId) REFERENCES lum_Principal(principalId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/portal/cluster/multiserver/database
#-----------------------------------------------

	
CREATE TABLE lum_ClusterTrans
(	
		`transmissionId`
	 CHAR(32) NOT NULL,
		`sender`
	 VARCHAR(50) NOT NULL,
		`content`
	 LONGBLOB NOT NULL,
		`sendDateTime`
	 DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL,
	CONSTRAINT LUM_PK_CLUSTERTRANS PRIMARY KEY (transmissionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	CREATE TRIGGER LUM_TG_CLUSTERTRANS BEFORE INSERT ON `lum_ClusterTrans` FOR EACH ROW SET NEW.sendDateTime = NOW();
	
	
-- For optimizing removal of expired transmissions.
CREATE INDEX LUM_IX_CLUSTERTRANS ON lum_ClusterTrans(sendDateTime);
	
	
CREATE TABLE lum_ClusterTransAck
(	
		`serverId`
	 VARCHAR(255) NOT NULL,
		`lastTransmissionOrder`
	 BIGINT NULL,
	CONSTRAINT LUM_PK_CLUSTERTRANSACK PRIMARY KEY (serverId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_ClusterTransOrder
(	
		`transmissionId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_FK_CLUSTERTRANSORDER FOREIGN KEY (transmissionId) REFERENCES lum_ClusterTrans(transmissionId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE UNIQUE INDEX LUM_IX_CLUSTERTRANSORDER ON lum_ClusterTransOrder(transmissionId);
	
	ALTER TABLE lum_ClusterTransOrder ADD transmissionOrder BIGINT NOT NULL;
	ALTER TABLE lum_ClusterTransOrder ADD CONSTRAINT LUM_PK_CLUSTERTRANSORDER PRIMARY KEY(transmissionOrder);
	ALTER TABLE lum_ClusterTransOrder MODIFY COLUMN transmissionOrder BIGINT NOT NULL AUTO_INCREMENT;
	
	
	
	
	
CREATE TABLE lum_ClusterConfig
(	
		`id`
	 CHAR(32) NOT NULL,
		`durableMessageTimeToLive`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_CLUSTERCONFIG PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/portal/monitor/impl/database
#-----------------------------------------------


	
CREATE TABLE lum_MonCategory
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(50) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`stringResourcePath`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_MONCATEGORY PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_MonEvent
(	
		`id`
	 CHAR(32) NOT NULL,
		`categoryId`
	 CHAR(32) NOT NULL,
		`eventKey`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(50) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`stringResourcePath`
	 VARCHAR(255) NULL,
		`enabled`
	 TINYINT NOT NULL,
		`duration`
	 BIGINT NOT NULL,
	CONSTRAINT LUM_PK_MONEVENT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MONEVENT1 FOREIGN KEY (categoryId) REFERENCES lum_MonCategory(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_MONEVENT1 ON lum_MonEvent(eventKey);
	
CREATE INDEX LUM_IX_MONEVENT2 ON lum_MonEvent(categoryId);
	
	
CREATE TABLE lum_MonEventData
(	
		`id`
	 CHAR(32) NOT NULL,
		`eventId`
	 CHAR(32) NOT NULL,
		`startOfPeriod`
	 DATETIME NULL,
		`endOfPeriod`
	 DATETIME NULL,
		`startOfPeriodMillis`
	 BIGINT NULL,
		`endOfPeriodMillis`
	 BIGINT NULL,
	CONSTRAINT LUM_PK_MONEVENTDATA PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MONEVENTDATA1 FOREIGN KEY (eventId) REFERENCES lum_MonEvent(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_MONEVENTDATA1 ON lum_MonEventData(eventId,startOfPeriodMillis,endOfPeriodMillis);
	
CREATE INDEX LUM_IX_MONEVENTDATA2 ON lum_MonEventData(eventId,startOfPeriod,endOfPeriod);
	
	
CREATE TABLE lum_MonAggregationType
(	
		`id`
	 CHAR(32) NOT NULL,
		`aggregationTypeKey`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(50) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`stringResourcePath`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_MONAGGREGATIONTYPE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_MONAGGREGATIONTYPE1 ON lum_MonAggregationType(aggregationTypeKey);
	
	
CREATE TABLE lum_MonEventAggregType
(	
		`id`
	 CHAR(32) NOT NULL,
		`eventId`
	 CHAR(32) NOT NULL,
		`aggregationTypeId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_MONEVENTAGGREGTYPE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MONEVENTAGGREGTYPE1 FOREIGN KEY (eventId) REFERENCES lum_MonEvent(id),
	CONSTRAINT LUM_FK_MONEVENTAGGREGTYPE2 FOREIGN KEY (aggregationTypeId) REFERENCES lum_MonAggregationType(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_MONEVENTAGGREGTYPE1 ON lum_MonEventAggregType(eventId);
	
CREATE INDEX LUM_IX_MONEVENTAGGREGTYPE2 ON lum_MonEventAggregType(aggregationTypeId);
	
	
CREATE TABLE lum_MonEventDataAggregation
(	
		`id`
	 CHAR(32) NOT NULL,
		`eventDataId`
	 CHAR(32) NOT NULL,
		`aggregationTypeId`
	 CHAR(32) NOT NULL,
		`value`
	 VARCHAR(1000) NULL,
	CONSTRAINT LUM_PK_MONEVENTDATAAGGREG PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MONEVENTDATAAGGREG1 FOREIGN KEY (eventDataId) REFERENCES lum_MonEventData(id),
	CONSTRAINT LUM_FK_MONEVENTDATAAGGREG2 FOREIGN KEY (aggregationTypeId) REFERENCES lum_MonAggregationType(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_MONEVENTDATAAGGREG1 ON lum_MonEventDataAggregation(eventDataId,aggregationTypeId);
	
	
CREATE TABLE lum_MonMeasureType
(	
		`id`
	 CHAR(32) NOT NULL,
		`measureTypeKey`
	 VARCHAR(255) NOT NULL,
		`name`
	 VARCHAR(50) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`unit`
	 VARCHAR(50) NOT NULL,
		`stringResourcePath`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_MONMEASURETYPE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_MONMEASURETYPE1 ON lum_MonMeasureType(measureTypeKey);
	
	
CREATE TABLE lum_MonEventDataMeasure
(	
		`id`
	 CHAR(32) NOT NULL,
		`eventDataId`
	 CHAR(32) NOT NULL,
		`measureTypeId`
	 CHAR(32) NOT NULL,
		`sumOfValues`
	 DOUBLE PRECISION NOT NULL,
		`minValue`
	 DOUBLE PRECISION NOT NULL,
		`maximumValue`
	 DOUBLE PRECISION NOT NULL,
		`lastValue`
	 DOUBLE PRECISION NOT NULL,
		`sumOfSquares`
	 DOUBLE PRECISION NOT NULL,
		`hits`
	 BIGINT NOT NULL,
		`firstUpdate`
	 DATETIME NOT NULL,
		`lastUpdate`
	 DATETIME NOT NULL,
	CONSTRAINT LUM_PK_MONEVENTDATAMEASURE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MONEVENTDATAMEASURE1 FOREIGN KEY (eventDataId) REFERENCES lum_MonEventData(id),
	CONSTRAINT LUM_FK_MONEVENTDATAMEASURE2 FOREIGN KEY (measureTypeId) REFERENCES lum_MonMeasureType(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_MONEVENTDATAMEASURE1 ON lum_MonEventDataMeasure(eventDataId,measureTypeId);
	

#-----------------------------------------------
#-- Generated SQL for: lumis/service/activitystream/database
#-----------------------------------------------

	
CREATE TABLE lum_ASAction
(	
		`id`
	 VARCHAR(100) NOT NULL,
		`stringResourcePaths`
	 LONGTEXT NULL,
		`displayName`
	 VARCHAR(50) NOT NULL,
	CONSTRAINT LUM_PK_ASACTIONTYPE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_ASObjectType
(	
		`id`
	 VARCHAR(100) NOT NULL,
		`stringResourcePaths`
	 LONGTEXT NULL,
		`displayName`
	 VARCHAR(50) NOT NULL,
	CONSTRAINT LUM_PK_ASOBJECTTYPE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_ASActivity
(	
		`id`
	 CHAR(32) NOT NULL,
		`streamServiceInstanceId`
	 CHAR(32) NOT NULL,
		`originServiceInstanceId`
	 CHAR(32) NOT NULL,
		`createdDateTimeMillis`
	 BIGINT NOT NULL,
		`createdBy`
	 CHAR(32) NOT NULL,
		`customData`
	 LONGTEXT NULL,
		`objectId`
	 VARCHAR(255) NULL,
		`objectTypeId`
	 VARCHAR(100) NULL,
		`objectDisplayName`
	 VARCHAR(255) NULL,
		`objectIntroduction`
	 LONGTEXT NULL,
		`objectImageUrl`
	 VARCHAR(255) NULL,
		`objectUrl`
	 VARCHAR(255) NULL,
		`actor`
	 CHAR(32) NULL,
		`actionId`
	 VARCHAR(100) NULL,
	CONSTRAINT LUM_PK_ASACTIVITY PRIMARY KEY (id),
	CONSTRAINT LUM_FK_ASACTIVITY1 FOREIGN KEY (objectTypeId) REFERENCES lum_ASObjectType(id),
	CONSTRAINT LUM_FK_ASACTIVITY2 FOREIGN KEY (actionId) REFERENCES lum_ASAction(id),
	CONSTRAINT LUM_FK_ASACTIVITY3 FOREIGN KEY (streamServiceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId),
	CONSTRAINT LUM_FK_ASACTIVITY4 FOREIGN KEY (originServiceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_ASACTIVITY1 ON lum_ASActivity(actionId);
	
CREATE INDEX LUM_IX_ASACTIVITY2 ON lum_ASActivity(objectTypeId);
	
CREATE INDEX LUM_IX_ASACTIVITY3 ON lum_ASActivity(originServiceInstanceId);
	
CREATE INDEX LUM_IX_ASACTIVITY4 ON lum_ASActivity(streamServiceInstanceId,originServiceInstanceId,createdDateTimeMillis);
	
CREATE INDEX LUM_IX_ASACTIVITY5 ON lum_ASActivity(createdDateTimeMillis,streamServiceInstanceId,originServiceInstanceId);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/album/database
#-----------------------------------------------

	
CREATE TABLE lum_Album
(	
		`albumId`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`imageFile`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_ALBUM PRIMARY KEY (albumId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_AlbumPhotograph
(	
		`photographId`
	 CHAR(32) NOT NULL,
		`albumContentId`
	 CHAR(32) NOT NULL,
		`imageFile`
	 CHAR(32) NOT NULL,
		`thumbnailImageFile`
	 CHAR(32) NULL,
		`title`
	 VARCHAR(255) NULL,
		`credits`
	 VARCHAR(255) NULL,
		`legend`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_ALBUMPHOTOGRAPH PRIMARY KEY (photographId),
	CONSTRAINT LUM_FK_ALBUMPHOTOGRAPH FOREIGN KEY (albumContentId) REFERENCES lum_Content(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_ALBUMPHOTOGRAPH ON lum_AlbumPhotograph(albumContentId);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/announcement/database
#-----------------------------------------------

	
CREATE TABLE lum_Announcement
(	
		`announcementId`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`introduction`
	 LONGTEXT NOT NULL,
		`content`
	 LONGTEXT NULL,
		`priority`
	 INT NOT NULL,
		`linkType`
	 INT NOT NULL,
		`linkUrl`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_ANNOUNCEMENT PRIMARY KEY (announcementId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/banner/database
#-----------------------------------------------

	
CREATE TABLE lum_BannerCategory
(	
		`bannerCategoryId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_BANNERCAT PRIMARY KEY (bannerCategoryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_Banner
(	
		`bannerId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NOT NULL,
		`categoryId`
	 CHAR(32) NULL,
		`type`
	 INT NOT NULL,
		`pointWeight`
	 INT DEFAULT 1 NOT NULL,
		`htmlContent`
	 LONGTEXT NULL,
		`onClickLinkType`
	 INT NULL,
		`onClickPageId`
	 VARCHAR(32) NULL,
		`onClickUrl`
	 VARCHAR(1000) NULL,
		`onClickPopup`
	 INT DEFAULT 0 NULL,
		`onClickPopupProperties`
	 VARCHAR(255) NULL,
		`width`
	 INT NULL,
		`height`
	 INT NULL,
		`image`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_BANNER PRIMARY KEY (bannerId),
	CONSTRAINT LUM_FK_BANNERCAT FOREIGN KEY (categoryId) REFERENCES lum_BannerCategory(bannerCategoryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_BANNER1 ON lum_Banner(categoryId);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/blog/database
#-----------------------------------------------

	
	
CREATE TABLE lum_Blog
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`introduction`
	 LONGTEXT NULL,
		`owner`
	 CHAR(32) NOT NULL,
		`postsperpage`
	 INT DEFAULT 10 NOT NULL,
	CONSTRAINT LUM_PK_BLOG PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE INDEX LUM_IX_BLOG1 ON lum_Blog(owner);
	
	
CREATE TABLE lum_BlogPost
(	
		`id`
	 CHAR(32) NOT NULL,
		`blogContentId`
	 CHAR(32) NULL,
		`title`
	 VARCHAR(255) NULL,
		`content`
	 LONGTEXT NOT NULL,
		`contentImages`
	 CHAR(32) NULL,
		`numberOfComments`
	 INT NULL,
	CONSTRAINT LUM_PK_BLOGPOST PRIMARY KEY (id),
	CONSTRAINT LUM_FK_BLOGPOST1 FOREIGN KEY (blogContentId) REFERENCES lum_Content(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE INDEX LUM_IX_BLOGPOST1 ON lum_BlogPost(blogContentId);
	
	
CREATE TABLE lum_BlogPostComment
(	
		`id`
	 CHAR(32) NOT NULL,
		`blogPostContentId`
	 CHAR(32) NULL,
		`commentText`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_BLOGPOSTCOMMENT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_BLOGPOSTCOMMENT1 FOREIGN KEY (blogPostContentId) REFERENCES lum_Content(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE INDEX LUM_IX_BLOGPOSTCOMMENT1 ON lum_BlogPostComment(blogPostContentId);
	

#-----------------------------------------------
#-- Generated SQL for: lumis/service/callcenteronline/database
#-----------------------------------------------

	
	
CREATE TABLE lum_COLAttendingHours
(	
		`id`
	 CHAR(32) NOT NULL,
		`dayOfWeek`
	 INT NOT NULL,
		`startTime`
	 TIME NOT NULL,
		`endTime`
	 TIME NOT NULL,
	CONSTRAINT LUM_PK_COLATTENDINGHOURS PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_COLStandardMessage
(	
		`id`
	 CHAR(32) NOT NULL,
		`message`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_COLSTANDARDMESSAGE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_COLRequest
(	
		`id`
	 CHAR(32) NOT NULL,
		`firstMessage`
	 VARCHAR(255) NOT NULL,
		`clientId`
	 CHAR(32) NOT NULL,
		`attendantId`
	 CHAR(32) NULL,
		`state`
	 INT NOT NULL,
		`chatConversationId`
	 CHAR(32) NOT NULL,
		`requestTime`
	 DATETIME NOT NULL,
		`attendedTime`
	 DATETIME NULL,
	CONSTRAINT LUM_PK_COLREQUEST PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/categorization/database
#-----------------------------------------------

	
CREATE TABLE lum_CategorizationTerm
(	
		`termId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`parentTermContentId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_CATEGORIZATIONTERM PRIMARY KEY (termId),
	CONSTRAINT LUM_FK_CATEGORIZATIONTERM FOREIGN KEY (parentTermContentId) REFERENCES lum_Content(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE INDEX LUM_IX_CATEGORIZATIONTERM ON lum_CategorizationTerm(parentTermContentId);
	

#-----------------------------------------------
#-- Generated SQL for: lumis/collaboration/chat/database
#-----------------------------------------------

	
	
CREATE TABLE lum_ChatConversation
(	
		`id`
	 CHAR(32) NOT NULL,
		`state`
	 INT NOT NULL,
		`moderated`
	 TINYINT NOT NULL,
		`moderator`
	 CHAR(32) NULL,
		`userLimit`
	 INT NULL,
		`startTime`
	 DATETIME NULL,
		`endTime`
	 DATETIME NULL,
	CONSTRAINT LUM_PK_CHATCONVERSATION PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_ChatUser
(	
		`id`
	 CHAR(32) NOT NULL,
		`userId`
	 CHAR(32) NOT NULL,
		`userSessionId`
	 CHAR(32) NOT NULL,
		`conversationId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`state`
	 TINYINT NOT NULL,
		`lastAccessDate`
	 DATETIME NOT NULL,
		`blocked`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_CHATUSER PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CHATUSER FOREIGN KEY (conversationId) REFERENCES lum_ChatConversation(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_ChatMessage
(	
		`id`
	 CHAR(32) NOT NULL,
		`conversationId`
	 CHAR(32) NOT NULL,
		`fromUserId`
	 CHAR(32) NULL,
		`toUserId`
	 CHAR(32) NULL,
		`type`
	 INT NOT NULL,
		`tone`
	 INT NOT NULL,
		`privateMessage`
	 TINYINT NOT NULL,
		`style`
	 VARCHAR(255) NULL,
		`message`
	 LONGTEXT NOT NULL,
		`sentTime`
	 DATETIME NOT NULL,
		`moderated`
	 TINYINT NOT NULL,
		`approved`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_CHATMESSAGE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CHATMESSAGE FOREIGN KEY (conversationId) REFERENCES lum_ChatConversation(id),
	CONSTRAINT LUM_FK_CHATMESSAGE2 FOREIGN KEY (fromUserId) REFERENCES lum_ChatUser(id),
	CONSTRAINT LUM_FK_CHATMESSAGE3 FOREIGN KEY (toUserId) REFERENCES lum_ChatUser(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE INDEX LUM_IDX_CHATMSG1 ON lum_ChatMessage(sentTime);
	
	
CREATE INDEX LUM_IDX_CHATMSG2 ON lum_ChatMessage(moderated);
	
	
CREATE INDEX LUM_IDX_CHATMSG3 ON lum_ChatMessage(approved);

	
CREATE INDEX LUM_IDX_CHATMSG4 ON lum_ChatMessage(privateMessage);

	
CREATE INDEX LUM_IDX_CHATMSG5 ON lum_ChatMessage(toUserId);


#-----------------------------------------------
#-- Generated SQL for: lumis/service/chatroom/database
#-----------------------------------------------

	
	
CREATE TABLE lum_ChatRoom
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`introduction`
	 LONGTEXT NULL,
		`chatConversationId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_CHATROOM PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
-- join between a chat room and chat conversation
CREATE VIEW lum_vwChatRoom AS
(
	SELECT A.id, A.title, A.introduction, A.chatConversationId, B.state, B.moderated, B.moderator, B.userLimit, B.startTime, B.endTime FROM lum_ChatRoom A, lum_ChatConversation B where A.chatConversationId = B.id
);
	
	

#-----------------------------------------------
#-- Generated SQL for: lumis/service/comment/database
#-----------------------------------------------


CREATE TABLE lum_Comment
(	
		`commentId`
	 CHAR(32) NOT NULL,
		`targetContentLocaleId`
	 CHAR(32) NOT NULL,
		`commentText`
	 LONGTEXT NULL,
		`grade`
	 INT NULL,
		`status`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_COMMENT PRIMARY KEY (commentId),
	CONSTRAINT LUM_FK_COMMENT FOREIGN KEY (targetContentLocaleId) REFERENCES lum_ContentLocale(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE INDEX LUM_IX_COMMENT ON lum_Comment(status,targetContentLocaleId);

CREATE TABLE lum_CommentTotal
(	
		`id`
	 CHAR(32) NOT NULL,
		`targetContentLocaleId`
	 CHAR(32) NOT NULL,
		`averageGrade`
	 DOUBLE PRECISION NOT NULL,
		`numberOfComments`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_COMMENTTOTAL PRIMARY KEY (id),
	CONSTRAINT LUM_FK_COMMENTTOTAL FOREIGN KEY (targetContentLocaleId) REFERENCES lum_ContentLocale(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE INDEX LUM_IX_COMMENTTOTAL ON lum_CommentTotal(targetContentLocaleId);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/community/database
#-----------------------------------------------

	
CREATE TABLE lum_Community
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`image`
	 CHAR(32) NULL,
		`privacy`
	 INT NOT NULL,
		`channelId`
	 VARCHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_COMMUNITY PRIMARY KEY (id),
	CONSTRAINT LUM_FK_COMMUNITY1 FOREIGN KEY (channelId) REFERENCES lum_Channel(channelId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_COMMUNITY1 ON lum_Community(channelId);
	
CREATE INDEX LUM_IX_COMMUNITY2 ON lum_Community(privacy,name);
	
	
CREATE TABLE lum_CommMembershipRequest
(	
		`id`
	 CHAR(32) NOT NULL,
		`communityId`
	 CHAR(32) NOT NULL,
		`requester`
	 CHAR(32) NOT NULL,
		`createdDateTime`
	 DATETIME NOT NULL,
	CONSTRAINT LUM_PK_COMMMEMBERSHIPREQUEST PRIMARY KEY (id),
	CONSTRAINT LUM_FK_COMMMEMBERSHIPREQUEST1 FOREIGN KEY (communityId) REFERENCES lum_Community(id) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_COMMMEMBERSHIPREQUEST2 FOREIGN KEY (requester) REFERENCES lum_User(userId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_COMMMEMBERSHIPREQUEST1 ON lum_CommMembershipRequest(communityId,requester);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/contact/database
#-----------------------------------------------

	
CREATE TABLE lum_Contact
(	
		`id`
	 CHAR(32) NOT NULL,
		`firstName`
	 VARCHAR(255) NOT NULL,
		`lastName`
	 VARCHAR(255) NULL,
		`title`
	 VARCHAR(255) NULL,
		`company`
	 VARCHAR(255) NULL,
		`email`
	 VARCHAR(255) NULL,
		`telephoneHome`
	 VARCHAR(255) NULL,
		`telephoneWork`
	 VARCHAR(255) NULL,
		`telephoneCell`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_CONTACT PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/contactus/database
#-----------------------------------------------

	
CREATE TABLE lum_ContactUs
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`email`
	 VARCHAR(255) NOT NULL,
		`subject`
	 VARCHAR(255) NOT NULL,
		`message`
	 LONGTEXT NOT NULL,
		`state`
	 INT NOT NULL,
		`categoryContentId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_CONTACTUS PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CONTACTUS FOREIGN KEY (categoryContentId) REFERENCES lum_Content(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_CONTACTUS ON lum_ContactUs(categoryContentId);
	
CREATE TABLE lum_ContactUsCategory
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_CONTACTUSCATEGORY PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/event/database
#-----------------------------------------------

	
CREATE TABLE lum_Event
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`introduction`
	 LONGTEXT NULL,
		`introductionImage`
	 CHAR(32) NULL,
		`content`
	 LONGTEXT NOT NULL,
		`contentImage`
	 CHAR(32) NULL,
		`locale`
	 VARCHAR(255) NULL,
		`eventStartDateTime`
	 DATETIME NOT NULL,
		`eventEndDateTime`
	 DATETIME NULL,
	CONSTRAINT LUM_PK_EVENT PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/document/database
#-----------------------------------------------

	
CREATE TABLE lum_Document
(	
		`id`
	 CHAR(32) NOT NULL,
		`type`
	 INT NOT NULL,
		`documentFile`
	 CHAR(32) NULL,
		`parentFolder`
	 CHAR(32) NULL,
		`title`
	 VARCHAR(255) NULL,
		`description`
	 VARCHAR(500) NULL,
	CONSTRAINT LUM_PK_DOCUMENT PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/faq/database
#-----------------------------------------------

	
CREATE TABLE lum_Faq
(	
		`faqId`
	 CHAR(32) NOT NULL,
		`question`
	 VARCHAR(255) NOT NULL,
		`answer`
	 LONGTEXT NULL,
		`priority`
	 INT NULL,
	CONSTRAINT LUM_PK_FAQ PRIMARY KEY (faqId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/forum/database
#-----------------------------------------------

	
CREATE TABLE lum_ForumCategory
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_FORUMCATEGORY PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_Forum
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`state`
	 INT NOT NULL,
		`moderator`
	 CHAR(32) NULL,
		`numberOfTopics`
	 INT NULL,
		`numberOfMessages`
	 INT NULL,
		`lastMessageDate`
	 DATETIME NULL,
		`lastMessageUser`
	 CHAR(32) NULL,
		`categoryContentId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_FORUM PRIMARY KEY (id),
	CONSTRAINT LUM_FK_FORUM1 FOREIGN KEY (categoryContentId) REFERENCES lum_Content(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_ForumTopic
(	
		`id`
	 CHAR(32) NOT NULL,
		`topic`
	 VARCHAR(255) NOT NULL,
		`state`
	 INT NOT NULL,
		`numberOfMessages`
	 INT NOT NULL,
		`lastMessageDate`
	 DATETIME NULL,
		`lastMessageUser`
	 CHAR(32) NULL,
		`numberOfViews`
	 INT NULL,
		`firstMessageId`
	 CHAR(32) NULL,
		`forumContentId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_FORUMTOPIC PRIMARY KEY (id),
	CONSTRAINT LUM_FK_FORUMTOPIC1 FOREIGN KEY (forumContentId) REFERENCES lum_Content(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_ForumMessage
(	
		`id`
	 CHAR(32) NOT NULL,
		`subject`
	 VARCHAR(255) NULL,
		`message`
	 LONGTEXT NOT NULL,
		`datePosted`
	 DATETIME NOT NULL,
		`postedByUser`
	 CHAR(32) NOT NULL,
		`dateEdited`
	 DATETIME NULL,
		`topicContentId`
	 CHAR(32) NOT NULL,
		`attachmentFiles`
	 CHAR(32) NULL,
		`messageImages`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_FORUMMESSAGE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_FORUMMESSAGE1 FOREIGN KEY (topicContentId) REFERENCES lum_Content(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/hierarchicalcontent/database
#-----------------------------------------------

	
CREATE TABLE lum_HierarchicalContent
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`introduction`
	 LONGTEXT NULL,
		`image`
	 CHAR(32) NULL,
		`parentContentId`
	 CHAR(32) NULL,
		`position`
	 INT NOT NULL,
		`type`
	 INT NOT NULL,
		`linkContent`
	 LONGTEXT NULL,
		`linkDocumentId`
	 CHAR(32) NULL,
		`linkOpeningType`
	 INT NULL,
		`linkPageId`
	 VARCHAR(32) NULL,
		`linkUrl`
	 VARCHAR(255) NULL,
		`linkPopUpProperties`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_HIERARCHICALCONTENT PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/htmlcontent/database
#-----------------------------------------------

	
CREATE TABLE lum_HCHtmlContent
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`content`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_HCHTMLCONTENT PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/link/database
#-----------------------------------------------

	
CREATE TABLE lum_LinkCategory
(	
		`linkCategoryId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_LINK_CATEGORY PRIMARY KEY (linkCategoryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_Link
(	
		`linkId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`introduction`
	 LONGTEXT NULL,
		`image`
	 CHAR(32) NULL,
		`categoryId`
	 CHAR(32) NULL,
		`content`
	 LONGTEXT NULL,
		`priority`
	 INT NOT NULL,
		`linkType`
	 INT NOT NULL,
		`linkUrl`
	 VARCHAR(255) NULL,
		`linkPageId`
	 VARCHAR(32) NULL,
		`linkClickPopup`
	 INT DEFAULT 0 NOT NULL,
		`linkPopupProperties`
	 VARCHAR(255) NULL,
		`linkDocumentId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_LINK PRIMARY KEY (linkId),
	CONSTRAINT LUM_FK_LINKCAT FOREIGN KEY (categoryId) REFERENCES lum_LinkCategory(linkCategoryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/mailmarketing/database
#-----------------------------------------------

	
	
CREATE TABLE lum_MMktgCategory
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`position`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_MMKTGCATEGORY PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
CREATE TABLE lum_MMktgSubscription
(	
		`id`
	 CHAR(32) NOT NULL,
		`userId`
	 CHAR(32) NULL,
		`email`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_MMKTGSUBSCRIPTION PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_MMktgSubscriptionCat
(	
		`id`
	 CHAR(32) NOT NULL,
		`subscriptionId`
	 CHAR(32) NOT NULL,
		`categoryId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_MMKTGCATSUBSCRIPTION PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MMKTGCATSUBSCRIPTION1 FOREIGN KEY (subscriptionId) REFERENCES lum_MMktgSubscription(id),
	CONSTRAINT LUM_FK_MMKTGCATSUBSCRIPTION2 FOREIGN KEY (categoryId) REFERENCES lum_MMktgCategory(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_MMktgBulletin
(	
		`id`
	 CHAR(32) NOT NULL,
		`senderEmail`
	 VARCHAR(255) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`subject`
	 VARCHAR(255) NOT NULL,
		`content`
	 LONGTEXT NOT NULL,
		`sendDateTime`
	 DATETIME NOT NULL,
		`status`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_MMKTGBULLETIN PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_MMktgBulletinCat
(	
		`id`
	 CHAR(32) NOT NULL,
		`bulletinId`
	 CHAR(32) NOT NULL,
		`categoryId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_MMKTGBULLETINCAT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MMKTGBULLETINCAT1 FOREIGN KEY (bulletinId) REFERENCES lum_MMktgBulletin(id),
	CONSTRAINT LUM_FK_MMKTGBULLETINCAT2 FOREIGN KEY (categoryId) REFERENCES lum_MMktgCategory(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
	

#-----------------------------------------------
#-- Generated SQL for: lumis/service/media/database
#-----------------------------------------------

	
CREATE TABLE lum_Media
(	
		`id`
	 CHAR(32) NOT NULL,
		`type`
	 INT NOT NULL,
		`mediaFile`
	 CHAR(32) NULL,
		`parentFolder`
	 CHAR(32) NULL,
		`title`
	 VARCHAR(255) NULL,
		`credits`
	 VARCHAR(255) NULL,
		`legend`
	 VARCHAR(255) NULL,
		`description`
	 LONGTEXT NULL,
	CONSTRAINT LUM_PK_MEDIA PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_MEDIA1 ON lum_Media(parentFolder);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/mediaalbum/database
#-----------------------------------------------

	
CREATE TABLE lum_MAAlbum
(	
		`albumId`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`imageFile`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_MAALBUM PRIMARY KEY (albumId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_MAMedia
(	
		`mediaId`
	 CHAR(32) NOT NULL,
		`albumContentId`
	 CHAR(32) NOT NULL,
		`mediaFile`
	 CHAR(32) NOT NULL,
		`thumbnailMediaFile`
	 CHAR(32) NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`position`
	 INT NOT NULL,
		`credits`
	 VARCHAR(255) NULL,
		`legend`
	 VARCHAR(255) NULL,
		`lastModifiedDateTime`
	 BIGINT NOT NULL,
		`approved`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_MAMEDIA PRIMARY KEY (mediaId),
	CONSTRAINT LUM_FK_MAMEDIA1 FOREIGN KEY (albumContentId) REFERENCES lum_Content(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_MAMEDIA1 ON lum_MAMedia(albumContentId,position,lastModifiedDateTime);
	
CREATE VIEW lum_vwMAAlbum AS
(
	
			SELECT
				a.albumId,
				a.imageFile,
				a.title,
				a.description
			FROM
				lum_MAAlbum a
			INNER JOIN
				lum_ContentVersion cv
				ON cv.itemId = a.albumId
			INNER JOIN
				lum_ContentLocale cl
				ON cv.id = cl.publishedVersionId
			WHERE 
				EXISTS 
					(SELECT 
						* 
					FROM 
						lum_MAMedia m 
					WHERE 
						m.albumContentId = cl.contentId 
						AND m.approved = 1)
		
);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/navigation/database
#-----------------------------------------------

	
CREATE TABLE lum_Navigation
(	
		`navigationId`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`position`
	 INT DEFAULT 0 NOT NULL,
		`parentId`
	 CHAR(32) NULL,
		`type`
	 INT DEFAULT 1 NOT NULL,
		`typeClassName`
	 VARCHAR(255) NULL,
		`openingType`
	 INT DEFAULT 0 NOT NULL,
		`popUpProperties`
	 VARCHAR(255) NULL,
		`url`
	 VARCHAR(255) NULL,
		`channelId`
	 VARCHAR(32) NULL,
		`channelTreeMaxLevels`
	 INT NULL,
		`hideRootChannel`
	 INT DEFAULT 0 NOT NULL,
		`image`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_NAVIGATION PRIMARY KEY (navigationId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/news/database
#-----------------------------------------------

	
CREATE TABLE lum_News
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`introduction`
	 LONGTEXT NULL,
		`introductionImage`
	 CHAR(32) NULL,
		`content`
	 LONGTEXT NOT NULL,
		`contentImage`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_NEWS PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/newsletter/database
#-----------------------------------------------

	
CREATE TABLE lum_NLCategory
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
		`description`
	 VARCHAR(255) NULL,
		`position`
	 INT NOT NULL,
		`maxItems`
	 INT NOT NULL,
		`serviceId`
	 VARCHAR(250) NOT NULL,
		`sourceId`
	 VARCHAR(250) NOT NULL,
		`catServiceInstId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_NLCATEGORY PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_NLModel
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`senderEmail`
	 VARCHAR(100) NOT NULL,
		`subject`
	 VARCHAR(200) NOT NULL,
		`introduction`
	 LONGTEXT NULL,
		`xslTextMode`
	 VARCHAR(255) NOT NULL,
		`xslHtmlMode`
	 VARCHAR(255) NOT NULL,
		`website`
	 VARCHAR(255) NULL,
		`introductionText`
	 LONGTEXT NULL,
		`locale`
	 VARCHAR(10) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
	CONSTRAINT LUM_PK_NLMODEL PRIMARY KEY (id),
	CONSTRAINT LUM_FK_NLMODEL1 FOREIGN KEY (locale) REFERENCES lum_Locale(locale)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_NLModelCat
(	
		`id`
	 CHAR(32) NOT NULL,
		`modelId`
	 CHAR(32) NOT NULL,
		`categoryId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_NLMODELCAT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_NLMODELCAT1 FOREIGN KEY (modelId) REFERENCES lum_NLModel(id),
	CONSTRAINT LUM_FK_NLMODELCAT2 FOREIGN KEY (categoryId) REFERENCES lum_NLCategory(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_NLSchedule
(	
		`id`
	 CHAR(32) NOT NULL,
		`modelId`
	 CHAR(32) NOT NULL,
		`status`
	 INT NOT NULL,
		`executionStatus`
	 INT DEFAULT 0 NOT NULL,
		`startDate`
	 DATE NOT NULL,
		`endDate`
	 DATE NULL,
		`processTime`
	 TIME NOT NULL,
		`lastProcessDateTime`
	 DATETIME NULL,
		`nextProcessDateTime`
	 DATETIME NULL,
		`scheduleType`
	 INT NOT NULL,
		`scheduleWeekDay`
	 INT NULL,
		`scheduleMonthDay`
	 INT NULL,
	CONSTRAINT LUM_PK_NLSCHEDULE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_NLSubscription
(	
		`id`
	 CHAR(32) NOT NULL,
		`userId`
	 CHAR(32) NULL,
		`emailFormat`
	 INT NOT NULL,
		`email`
	 VARCHAR(255) NULL,
		`locale`
	 VARCHAR(10) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
	CONSTRAINT LUM_PK_NLSUBSCRIPTION PRIMARY KEY (id),
	CONSTRAINT LUM_FK_NLSUBSCRIPTION1 FOREIGN KEY (locale) REFERENCES lum_Locale(locale)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_NLSubscriptionCat
(	
		`id`
	 CHAR(32) NOT NULL,
		`subscriptionId`
	 CHAR(32) NOT NULL,
		`categoryId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_NLCATSUBSCRIPTION PRIMARY KEY (id),
	CONSTRAINT LUM_FK_NLCATSUBSCRIPTION1 FOREIGN KEY (subscriptionId) REFERENCES lum_NLSubscription(id),
	CONSTRAINT LUM_FK_NLCATSUBSCRIPTION2 FOREIGN KEY (categoryId) REFERENCES lum_NLCategory(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/pagepersonalization/database
#-----------------------------------------------

	
CREATE TABLE lum_PPWidget
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`icon`
	 CHAR(32) NULL,
		`interfaceInstanceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_PPWIDGET PRIMARY KEY (id),
	CONSTRAINT LUM_FK_PPWIDGET1 FOREIGN KEY (interfaceInstanceId) REFERENCES lum_InterfaceInstance(interfaceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_PPWidgetTmpDef
(	
		`holderInstanceId`
	 CHAR(32) NOT NULL,
		`typeOfConf`
	 VARCHAR(1) NOT NULL,
		`widgets`
	 LONGTEXT NULL,
	CONSTRAINT LUM_PK_PPWIDGETTMPDEF PRIMARY KEY (holderInstanceId,typeOfConf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_PPIIToBeDeleted
(	
		`interfaceInstanceId`
	 CHAR(32) NOT NULL,
		`whenToDelete`
	 DATETIME NOT NULL,
	CONSTRAINT LUM_PK_PPIITOBEDELETED PRIMARY KEY (interfaceInstanceId),
	CONSTRAINT LUM_FK_PPIITOBEDELETED1 FOREIGN KEY (interfaceInstanceId) REFERENCES lum_InterfaceInstance(interfaceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	

#-----------------------------------------------
#-- Generated SQL for: lumis/service/portalmanagement/importprincipal/database
#-----------------------------------------------

	
CREATE TABLE lum_ImpPrincReader
(	
		`id`
	 CHAR(32) NOT NULL,
		`origin`
	 VARCHAR(255) NOT NULL,
		`configFile`
	 VARCHAR(255) NOT NULL,
		`outputFile`
	 VARCHAR(255) NOT NULL,
		`lastRun`
	 DATETIME NULL,
		`schedule`
	 TINYINT DEFAULT 0 NOT NULL,
	CONSTRAINT LUM_PK_IMPPRINCREADER PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_ImpPrincWriter
(	
		`id`
	 CHAR(32) NOT NULL,
		`origin`
	 VARCHAR(255) NOT NULL,
		`inputFile`
	 VARCHAR(255) NOT NULL,
		`lastRun`
	 DATETIME NULL,
		`ifExistsInDestination`
	 INT NULL,
		`ifDoesNotExistInDestination`
	 INT NULL,
		`ifDoesNotExistInSource`
	 INT NULL,
		`schedule`
	 TINYINT DEFAULT 0 NOT NULL,
	CONSTRAINT LUM_PK_IMPPRINCWRITER PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/questionnaire/database
#-----------------------------------------------

	
	
CREATE TABLE lum_QUQuestionnaire
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`allowAnswerMoreThanOnce`
	 TINYINT NOT NULL,
		`anonymous`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_QUQUESTIONNAIRE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_QUQuestion
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`questionnaireId`
	 CHAR(32) NOT NULL,
		`type`
	 VARCHAR(20) NOT NULL,
		`configuration`
	 LONGTEXT NULL,
		`position`
	 INT NOT NULL,
		`required`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_QUQUESTION PRIMARY KEY (id),
	CONSTRAINT LUM_FK_QUQUESTION1 FOREIGN KEY (questionnaireId) REFERENCES lum_QUQuestionnaire(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_QUAnswer
(	
		`id`
	 CHAR(32) NOT NULL,
		`answerDate`
	 DATETIME NOT NULL,
		`userId`
	 CHAR(32) NOT NULL,
		`answerValues`
	 LONGTEXT NOT NULL,
		`questionnaireId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_QUANSWER PRIMARY KEY (id),
	CONSTRAINT LUM_FK_QUANSWER1 FOREIGN KEY (questionnaireId) REFERENCES lum_QUQuestionnaire(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	

#-----------------------------------------------
#-- Generated SQL for: lumis/service/report/database
#-----------------------------------------------

	
CREATE TABLE lum_RepReportServInst
(	
		`id`
	 CHAR(32) NOT NULL,
		`reportId`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_REPREPORTSERVINST PRIMARY KEY (id),
	CONSTRAINT LUM_FK_REPREPORTSERVINST1 FOREIGN KEY (reportId) REFERENCES lum_RepReport(id) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_REPREPORTSERVINST2 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_REPREPORTSERVINST1 ON lum_RepReportServInst(serviceInstanceId,reportId);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/resourcescheduler/database
#-----------------------------------------------


	
CREATE TABLE lum_ResSchdResource
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`resourceType`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_RESSCHDRESOURCE PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
CREATE TABLE lum_ResSchdSchedule
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(100) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`roomId`
	 CHAR(32) NOT NULL,
		`startDateTime`
	 DATETIME NOT NULL,
		`endDateTime`
	 DATETIME NOT NULL,
		`principalId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_RESSCHDSCHEDULE PRIMARY KEY (id),
	CONSTRAINT LUM_FK_RESSCHDSCHEDULE1 FOREIGN KEY (roomId) REFERENCES lum_ResSchdResource(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
CREATE TABLE lum_ResSchdScheduleRes
(	
		`id`
	 CHAR(32) NOT NULL,
		`scheduleId`
	 CHAR(32) NOT NULL,
		`resourceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_RESSCHDSCHEDULERES PRIMARY KEY (id),
	CONSTRAINT LUM_FK_RESSCHDSCHEDULERES1 FOREIGN KEY (scheduleId) REFERENCES lum_ResSchdSchedule(id),
	CONSTRAINT LUM_FK_RESSCHDSCHEDULERES2 FOREIGN KEY (resourceId) REFERENCES lum_ResSchdResource(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


#-----------------------------------------------
#-- Generated SQL for: lumis/service/rss/database
#-----------------------------------------------

	
CREATE TABLE lum_Rss
(	
		`id`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(255) NOT NULL,
		`header`
	 LONGTEXT NOT NULL,
		`position`
	 INT DEFAULT 0 NULL,
		`serviceId`
	 VARCHAR(250) NOT NULL,
		`servInstanceId`
	 CHAR(32) NOT NULL,
		`source`
	 VARCHAR(255) NULL,
		`category`
	 VARCHAR(255) NULL,
		`title`
	 VARCHAR(255) NULL,
		`pubDate`
	 VARCHAR(255) NULL,
		`description`
	 VARCHAR(255) NULL,
		`link`
	 VARCHAR(255) NULL,
		`maxRows`
	 INT NULL,
		`filter`
	 VARCHAR(255) NULL,
		`path`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_RSS PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/sendtofriend/database
#-----------------------------------------------

	
CREATE TABLE lum_SendToFriend
(	
		`id`
	 CHAR(32) NOT NULL,
		`toName`
	 VARCHAR(255) NOT NULL,
		`toEmail`
	 VARCHAR(255) NOT NULL,
		`fromName`
	 VARCHAR(255) NOT NULL,
		`fromEmail`
	 VARCHAR(255) NOT NULL,
		`message`
	 LONGTEXT NOT NULL,
		`link`
	 VARCHAR(255) NOT NULL,
		`linkTitle`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_SENDTOFRIEND PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/seo/robotstxt/database
#-----------------------------------------------

	
	
CREATE TABLE lum_RbtsUserAgent
(	
		`id`
	 CHAR(32) NOT NULL,
		`crawlDelay`
	 INT NULL,
		`requestRate`
	 VARCHAR(255) NULL,
		`userAgent`
	 VARCHAR(255) NOT NULL,
		`visitTime`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_RBTSUSERAGENT PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_RBTSUSERAGENT ON lum_RbtsUserAgent(userAgent);
	
	
CREATE TABLE lum_RbtsUserAgentPerm
(	
		`id`
	 CHAR(32) NOT NULL,
		`type`
	 INT NOT NULL,
		`userAgentId`
	 CHAR(32) NOT NULL,
		`value`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_RBTSUSERAGENTPERM PRIMARY KEY (id),
	CONSTRAINT LUM_FK_RBTSUSERAGENT FOREIGN KEY (userAgentId) REFERENCES lum_RbtsUserAgent(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE TABLE lum_RbtsSitemap
(	
		`id`
	 CHAR(32) NOT NULL,
		`url`
	 VARCHAR(255) NOT NULL,
	CONSTRAINT LUM_PK_RBTSSITEMAP PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/seo/sitemap/database
#-----------------------------------------------

	
CREATE TABLE lum_SitemapChannel
(	
		`id`
	 CHAR(32) NOT NULL,
		`channelId`
	 VARCHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_SITEMAPCHANNEL PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



#-----------------------------------------------
#-- Generated SQL for: lumis/service/simplecontent/database
#-----------------------------------------------

	
CREATE TABLE lum_SCSimpleContent
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`content`
	 LONGTEXT NOT NULL,
		`image`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_SCSIMPLECONTENT PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/likeit/database
#-----------------------------------------------

	
CREATE TABLE lum_LikeIt
(	
		`id`
	 CHAR(32) NOT NULL,
		`itemId`
	 VARCHAR(255) NOT NULL,
		`itemName`
	 VARCHAR(255) NULL,
		`itemUrl`
	 VARCHAR(255) NULL,
		`itemServiceInstanceId`
	 CHAR(32) NULL,
		`likeDate`
	 DATETIME NOT NULL,
		`userId`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_LIKEIT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_LIKEIT1 FOREIGN KEY (itemServiceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_LIKEIT2 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_LIKEIT1 ON lum_LikeIt(serviceInstanceId,itemId,userId);
	
CREATE INDEX LUM_IX_LIKEIT2 ON lum_LikeIt(itemServiceInstanceId);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/commentit/database
#-----------------------------------------------

	
CREATE TABLE lum_CommentIt
(	
		`id`
	 CHAR(32) NOT NULL,
		`itemId`
	 VARCHAR(255) NOT NULL,
		`itemName`
	 VARCHAR(255) NULL,
		`itemUrl`
	 VARCHAR(255) NULL,
		`itemServiceInstanceId`
	 CHAR(32) NULL,
		`commentText`
	 LONGTEXT NOT NULL,
		`commentDate`
	 DATETIME NOT NULL,
		`userId`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_COMMENTIT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_COMMENTIT1 FOREIGN KEY (itemServiceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_COMMENTIT2 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	CREATE INDEX LUM_IX_COMMENTIT1 ON lum_CommentIt(serviceInstanceId, itemId, commentDate DESC);
	
CREATE INDEX LUM_IX_COMMENTIT2 ON lum_CommentIt(itemServiceInstanceId);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/socialnetworkservices/microblog/database
#-----------------------------------------------


	
CREATE TABLE lum_MBPost
(	
		`postId`
	 CHAR(32) NOT NULL,
		`creation`
	 DATETIME NOT NULL,
		`owner`
	 CHAR(32) NOT NULL,
		`post`
	 VARCHAR(255) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_MBPOST PRIMARY KEY (postId),
	CONSTRAINT LUM_FK_MBPOST1 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_MBPOST1 ON lum_MBPost(serviceInstanceId);
	
	
CREATE TABLE lum_MBComment
(	
		`id`
	 CHAR(32) NOT NULL,
		`postComment`
	 VARCHAR(255) NOT NULL,
		`author`
	 CHAR(32) NOT NULL,
		`postId`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
		`creation`
	 DATETIME NOT NULL,
		`removed`
	 TINYINT NULL,
	CONSTRAINT LUM_PK_MBCOMMENT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MBCOMMENT1 FOREIGN KEY (postId) REFERENCES lum_MBPost(postId) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_MBCOMMENT2 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_MBCOMMENT1 ON lum_MBComment(postId);
	
CREATE INDEX LUM_IX_MBCOMMENT2 ON lum_MBComment(serviceInstanceId);
	
	
CREATE TABLE lum_MBPostAttachment
(	
		`id`
	 CHAR(32) NOT NULL,
		`fileId`
	 CHAR(32) NULL,
		`postId`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_MBPOSTATTACHMENT PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MBPOSTATTACHMENT1 FOREIGN KEY (postId) REFERENCES lum_MBPost(postId),
	CONSTRAINT LUM_FK_MBPOSTATTACHMENT2 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_MBPOSTATTACHMENT1 ON lum_MBPostAttachment(postId);
	
CREATE INDEX LUM_IX_MBPOSTATTACHMENT2 ON lum_MBPostAttachment(serviceInstanceId);
	
	
CREATE TABLE lum_MBHash
(	
		`hash`
	 VARCHAR(255) NOT NULL,
		`postId`
	 CHAR(32) NOT NULL,
		`stemmed`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_MBHASH PRIMARY KEY (hash,postId),
	CONSTRAINT LUM_FK_MBHASH1 FOREIGN KEY (postId) REFERENCES lum_MBPost(postId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_MBHASH1 ON lum_MBHash(postId);
	
	
CREATE TABLE lum_MBUserFollows
(	
		`id`
	 CHAR(32) NOT NULL,
		`userId`
	 CHAR(32) NOT NULL,
		`followedUserId`
	 CHAR(32) NOT NULL,
		`socialNetworkId`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_MBUSERFOLLOWS PRIMARY KEY (id),
	CONSTRAINT LUM_FK_MBUSERFOLLOWS1 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_MBUSERFOLLOWS1 ON lum_MBUserFollows(serviceInstanceId);
	

#-----------------------------------------------
#-- Generated SQL for: lumis/service/socialnetworkservices/socialprofile/database
#-----------------------------------------------

	
CREATE TABLE lum_SNSocialProfile
(	
		`socialProfileId`
	 CHAR(32) NOT NULL,
		`lumUserId`
	 CHAR(32) NOT NULL,
		`description`
	 LONGTEXT NULL,
		`photo`
	 CHAR(32) NULL,
		`title`
	 VARCHAR(255) NULL,
		`departament`
	 VARCHAR(255) NULL,
		`locale`
	 VARCHAR(100) NULL,
		`areaCode`
	 VARCHAR(3) NULL,
		`phone`
	 VARCHAR(8) NULL,
		`email`
	 VARCHAR(255) NULL,
		`address`
	 LONGTEXT NULL,
		`otherContacts`
	 LONGTEXT NULL,
		`birthday`
	 DATETIME NULL,
		`sex`
	 INT NOT NULL,
		`name`
	 VARCHAR(100) NOT NULL,
		`resume`
	 CHAR(32) NULL,
	CONSTRAINT LUM_PK_SNSOCIALPROFILE PRIMARY KEY (socialProfileId),
	CONSTRAINT LUM_FK_SNSOCIALPROFILE1 FOREIGN KEY (lumUserId) REFERENCES lum_User(userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_SNSOCIALPROFILE1 ON lum_SNSocialProfile(lumUserId);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/vote/database
#-----------------------------------------------

	
CREATE TABLE lum_VoteQuestion
(	
		`id`
	 CHAR(32) NOT NULL,
		`question`
	 VARCHAR(255) NOT NULL,
		`onlyOneVotePerUser`
	 INT NOT NULL,
		`optionType`
	 INT NOT NULL,
		`numberOfOptions`
	 INT NOT NULL,
		`numberOfVotes`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_VOTEQUESTION PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_VoteOption
(	
		`optionId`
	 CHAR(32) NOT NULL,
		`questionId`
	 CHAR(32) NOT NULL,
		`optionTitle`
	 VARCHAR(255) NOT NULL,
		`position`
	 INT NOT NULL,
		`numberOfVotes`
	 INT NOT NULL,
	CONSTRAINT LUM_PK_VOTEOPTION PRIMARY KEY (optionId),
	CONSTRAINT LUM_FK_VOTEOPTION1 FOREIGN KEY (questionId) REFERENCES lum_VoteQuestion(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_VoteLog
(	
		`id`
	 CHAR(32) NOT NULL,
		`questionId`
	 CHAR(32) NOT NULL,
		`userId`
	 CHAR(32) NOT NULL,
		`logDate`
	 DATETIME NOT NULL,
	CONSTRAINT LUM_PK_VOTELOG PRIMARY KEY (id),
	CONSTRAINT LUM_FK_VOTELOG1 FOREIGN KEY (questionId) REFERENCES lum_VoteQuestion(id) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE INDEX LUM_IDX_VOTELOG1 ON lum_VoteLog(userId);
	
	
CREATE TABLE lum_VoteOptionLog
(	
		`id`
	 CHAR(32) NOT NULL,
		`voteLogId`
	 CHAR(32) NOT NULL,
		`optionId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_VOTEOPTIONLOG PRIMARY KEY (id),
	CONSTRAINT LUM_FK_VOTEOPTIONLOG1 FOREIGN KEY (voteLogId) REFERENCES lum_VoteLog(id) ON DELETE CASCADE ,
	CONSTRAINT LUM_FK_VOTEOPTIONLOG2 FOREIGN KEY (optionId) REFERENCES lum_VoteOption(optionId) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/wiki/database
#-----------------------------------------------

	
CREATE TABLE lum_WikiArticle
(	
		`id`
	 CHAR(32) NOT NULL,
		`title`
	 VARCHAR(255) NOT NULL,
		`content`
	 LONGTEXT NULL,
		`mainArticle`
	 TINYINT NOT NULL,
	CONSTRAINT LUM_PK_ARTICLE_ID PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#-----------------------------------------------
#-- Generated SQL for: lumis/service/wsrp/consumer/database
#-----------------------------------------------

	
CREATE TABLE lum_WsrpCProducer
(	
		`id`
	 CHAR(32) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
		`producerURL`
	 VARCHAR(255) NOT NULL,
		`producerVersion`
	 VARCHAR(10) NOT NULL,
		`producerMarkupEndpoint`
	 VARCHAR(255) NOT NULL,
		`producerStatus`
	 INT NOT NULL,
		`serviceDescriptionLastModified`
	 DATETIME NOT NULL,
		`serviceDescription`
	 LONGTEXT NOT NULL,
	CONSTRAINT LUM_PK_WSRPCPRODUCER PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WSRPCPRODUCER FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_WSRPCPRODUCER ON lum_WsrpCProducer(serviceInstanceId);
	
CREATE TABLE lum_WsrpCRegistration
(	
		`registrationHandle`
	 CHAR(32) NOT NULL,
		`producerEntityId`
	 CHAR(32) NOT NULL,
		`registrationState`
	 LONGBLOB NULL,
	CONSTRAINT LUM_PK_WSRPCREGISTRATION PRIMARY KEY (registrationHandle),
	CONSTRAINT LUM_FK_WSRPCREGISTRATION FOREIGN KEY (producerEntityId) REFERENCES lum_WsrpCProducer(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE UNIQUE INDEX LUM_UN_WSRPCREGISTRATION ON lum_WsrpCRegistration(producerEntityId);
	
	
CREATE TABLE lum_WsrpCClonedPortlet
(	
		`portletHandle`
	 CHAR(32) NOT NULL,
		`name`
	 VARCHAR(64) NOT NULL,
		`registrationHandle`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_WSRPCCLONEDPORTLET PRIMARY KEY (portletHandle),
	CONSTRAINT LUM_FK_WSRPCCLONEDPORTLET FOREIGN KEY (registrationHandle) REFERENCES lum_WsrpCRegistration(registrationHandle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE TABLE lum_WsrpCClonedTgtInst
(	
		`portletHandle`
	 CHAR(32) NOT NULL,
		`interfaceInstanceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_WSRPCCLONEDTGTINST PRIMARY KEY (portletHandle,interfaceInstanceId),
	CONSTRAINT LUM_FK_WSRPCCLONEDTGTINST FOREIGN KEY (portletHandle) REFERENCES lum_WsrpCClonedPortlet(portletHandle),
	CONSTRAINT LUM_FK_WSRPCCLONEDTGTINST2 FOREIGN KEY (interfaceInstanceId) REFERENCES lum_InterfaceInstance(interfaceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_UN_WSRPCCLONEDTGTINST ON lum_WsrpCClonedTgtInst(interfaceInstanceId);

#-----------------------------------------------
#-- Generated SQL for: lumis/service/wsrp/producer/database
#-----------------------------------------------

	
CREATE TABLE lum_WsrpPProducer
(	
		`id`
	 CHAR(32) NOT NULL,
		`producerKey`
	 VARCHAR(255) NOT NULL,
		`serviceInstanceId`
	 CHAR(32) NOT NULL,
		`version`
	 VARCHAR(10) NOT NULL,
		`enabled`
	 TINYINT NOT NULL,
		`httpAuthenticator`
	 VARCHAR(100) NULL,
		`requiresRegistration`
	 TINYINT NOT NULL,
		`supportsInbandRegistration`
	 TINYINT NOT NULL,
		`maxInbandLifetime`
	 BIGINT NOT NULL,
	CONSTRAINT LUM_PK_WSRPPPRODUCER PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WSRPPPRODUCER1 FOREIGN KEY (serviceInstanceId) REFERENCES lum_ServiceInstance(serviceInstanceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_WSRPPPRODUCER1 ON lum_WsrpPProducer(serviceInstanceId);
	
CREATE UNIQUE INDEX LUM_IX_WSRPPPRODUCER2 ON lum_WsrpPProducer(producerKey);	
	
CREATE TABLE lum_WsrpPOfferedPortlet
(	
		`id`
	 CHAR(32) NOT NULL,
		`producerId`
	 CHAR(32) NOT NULL,
		`interfaceInstanceId`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_WSRPPOFFEREDPORTLET PRIMARY KEY (id),
	CONSTRAINT LUM_FK_WSRPPOFFEREDPORTLET1 FOREIGN KEY (interfaceInstanceId) REFERENCES lum_InterfaceInstance(interfaceInstanceId),
	CONSTRAINT LUM_FK_WSRPPOFFEREDPORTLET2 FOREIGN KEY (producerId) REFERENCES lum_WsrpPProducer(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE UNIQUE INDEX LUM_IX_WSRPPOFFEREDPORTLET1 ON lum_WsrpPOfferedPortlet(producerId,interfaceInstanceId);
	
CREATE TABLE lum_WsrpPRegistrationData
(	
		`registrationHandle`
	 CHAR(32) NOT NULL,
		`producerId`
	 CHAR(32) NOT NULL,
		`consumerName`
	 VARCHAR(255) NOT NULL,
		`consumerAgent`
	 VARCHAR(255) NOT NULL,
		`methodGetSupported`
	 TINYINT NOT NULL,
		`consumerModes`
	 VARCHAR(128) NULL,
		`consumerWindowStates`
	 VARCHAR(128) NULL,
		`customUserProfileData`
	 VARCHAR(255) NULL,
		`enabled`
	 TINYINT NULL,
		`lifetimeTerminationTime`
	 DATETIME NULL,
		`consumerUserScopes`
	 VARCHAR(255) NULL,
	CONSTRAINT LUM_PK_WSRPPREGISTRATIONDATA PRIMARY KEY (registrationHandle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
	
CREATE INDEX LUM_IX_WSRPPREGISTRATIONDATA1 ON lum_WsrpPRegistrationData(producerId);
	
	
CREATE TABLE lum_WsrpPClonedPortlet
(	
		`id`
	 CHAR(32) NOT NULL,
		`originalPortletId`
	 CHAR(32) NOT NULL,
		`registrationHandle`
	 CHAR(32) NOT NULL,
	CONSTRAINT LUM_PK_CLONEDPORTLET PRIMARY KEY (id),
	CONSTRAINT LUM_FK_CLONEDPORTLET1 FOREIGN KEY (id) REFERENCES lum_InterfaceInstance(interfaceInstanceId),
	CONSTRAINT LUM_FK_CLONEDPORTLET2 FOREIGN KEY (registrationHandle) REFERENCES lum_WsrpPRegistrationData(registrationHandle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
CREATE INDEX LUM_IX_WSRPPCLONEDPORTLET1 ON lum_WsrpPClonedPortlet(registrationHandle);


