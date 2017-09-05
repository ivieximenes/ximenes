#!/bin/sh
. ./setclasspath.sh

echo "*********************************"
echo "*  LUMIS PORTAL                 *"
echo "*   Copyright (C) 2012, Lumis.  *"
echo "*********************************"

if [ "$LUMIS_HOME" = "" ]
then
    echo "***************************************"
    echo "* The LUMIS_HOME variable is not set. *"
    echo "***************************************"
    exit 1
fi

if [ "$JAVA_HOME" = "" ]
then
    echo "***************************************"
    echo "* The JAVA_HOME variable is not set.  *"
    echo "***************************************"
    exit 1
fi

echo "***************************************"
echo "* 7.2 Folders normalization           *"
echo "***************************************"

"$JAVA_HOME"/bin/java -Xmx500m -classpath bin lumis.initializeportal.NormalizeFolders80 "$LUMIS_HOME/lumisdata"
