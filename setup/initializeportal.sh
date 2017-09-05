#!/bin/sh
. ./setclasspath.sh
"$JAVA_HOME"/bin/java -classpath "$CLASSPATH" -Xmx500m lumis.initializeportal.InitializePortal -d:"$LUMIS_HOME"/lumisdata