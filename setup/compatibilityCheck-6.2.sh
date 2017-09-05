#!/bin/sh
. ./setclasspath.sh
"$JAVA_HOME"/bin/java -Xmx500m -classpath "$CLASSPATH" lumis.initializeportal.CompatibilityCheck62 -d:"$LUMIS_HOME"/lumisdata