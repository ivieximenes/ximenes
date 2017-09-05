#!/bin/sh
[ -z "$LUMIS_HOME" ] && LUMIS_HOME=../
[ -z "$JAVA_HOME" ] && JAVA_HOME=
CLASSPATH=./bin
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/lib/shared/portlet-api-2.0.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/lib/shared/commons-logging-api.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/lib/servlet-api.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/lib/jsp-api.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/classes
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/lumisportal_8.1.1.150831.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/commons-dbcp-1.2.1.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/commons-codec-1.9.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/commons-pool-1.2.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/commons-collections-3.2.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/commons-el-1.0-custom.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/jtds-1.2.2.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/log4j-1.2.15.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/datedFileAppender-1.0.2.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/oscache-2.4.1.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/ojdbc6.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/mysql-connector-java-5.1.34-bin.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/hibernate3.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/hibernate-annotations.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/hibernate-commons-annotations.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/hibernate-entitymanager.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/hibernate-validator.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/ejb3-persistence.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/jboss-common-core-2.2.0.GA.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/hibernate-dbcp.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/c3p0-0.9.1.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/antlr-2.7.6.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/asm-3.2.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/cglib-2.2.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/dom4j-1.6.1.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/jta.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/xstream-1.3.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/xpp3_min-1.1.4c.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/lucene-1.4.3.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/h2-1.0.79.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/beanlib-3.3.0beta21.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/beanlib-hibernate-3.3.0beta21.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/javassist-3.18.1-GA.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/slf4j-api-1.5.8.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/slf4j-log4j12-1.5.8.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/container-2.1.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/wsrp-consumer-2.0.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/wsrp-common-2.0.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/wsrp-producer-2.0.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/tika-core-1.5.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/tika-parsers-1.5.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/tagsoup-1.2.1.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/commons-compress-1.8.1.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/metadata-extractor-2.6.2.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/xmpcore-5.1.2.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/poi-3.10.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/poi-ooxml-3.10.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/poi-ooxml-schemas-3.10.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/poi-scratchpad-3.10.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/fontbox-1.8.5.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/pdfbox-1.8.5.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/jempbox-1.8.5.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/jtidy-r938.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/wurfl-1.2.2.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/commons-lang-2.4.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/commons-net-ftp-2.0.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/xbean-classloader-3.7.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/jaxrs-ri-2.6.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/jackson-all-1.9.11.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/json_simple-1.1.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/simple-xml-2.6.2.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/mail-1.4.jar
CLASSPATH="$CLASSPATH":"$LUMIS_HOME"/www/WEB-INF/lib/wicket-1.4.9.jar