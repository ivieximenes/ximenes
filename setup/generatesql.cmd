@ECHO OFF
@REM *********************************
@REM *	LUMIS PORTAL			 *
@REM *       Copyright (C) 2006, Lumis.	 *
@REM *********************************

:SETCLASSPATH
@ECHO Set classpath
@ECHO ***************************************
call setclasspath.cmd
if "%LUMIS_HOME%" == "" (
@ECHO ***************************************
@ECHO * The LUMIS_HOME variable is not set. *
@ECHO ***************************************
GOTO :END
)
if "%JAVA_HOME%" == "" (
@ECHO ***************************************
@ECHO * The JAVA_HOME variable is not set. *
@ECHO ***************************************
GOTO :END
)
GOTO :GENERATESQL



:GENERATESQL
"%JAVA_HOME%\bin\java.exe" -Xmx500m lumis.initializeportal.GenerateSql -d:"%LUMIS_HOME%\lumisdata"
GOTO :END



:END
@ECHO ON