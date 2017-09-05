@ECHO OFF
REM *********************************
REM *  LUMIS PORTAL                 *
REM *   Copyright (C) 2012, Lumis.  *
REM *********************************

:SETCLASSPATH
ECHO Set classpath
call setclasspath.cmd
if "%LUMIS_HOME%" == "" (
ECHO ***************************************
ECHO * The LUMIS_HOME variable is not set. *
ECHO ***************************************
GOTO :END
)

if "%JAVA_HOME%" == "" (
ECHO ***************************************
ECHO * The JAVA_HOME variable is not set.  *
ECHO ***************************************
GOTO :END
)

ECHO ***************************************
ECHO * 7.2 Folders normalization           *
ECHO ***************************************

@ECHO ON
"%JAVA_HOME%\bin\java.exe" -Xmx500m lumis.initializeportal.NormalizeFolders80 "%LUMIS_HOME%\lumisdata"

@ECHO ON
:END
