@ECHO OFF
REM *********************************
REM *	LUMIS PORTAL			 *
REM *       Copyright (C) 2006, Lumis.	 *
REM *********************************

:SETCLASSPATH
ECHO Set classpath
ECHO ***************************************
call setclasspath.cmd
if "%LUMIS_HOME%" == "" (
	ECHO ***************************************
	ECHO * The LUMIS_HOME variable is not set. *
	ECHO ***************************************
	ECHO ON
	@EXIT /B 1
)
if "%JAVA_HOME%" == "" (
	ECHO ***************************************
	ECHO * The JAVA_HOME variable is not set. *
	ECHO ***************************************
	ECHO ON
	@EXIT /B 1
)
GOTO :RUNUPGRADE

:RUNUPGRADE
ECHO Upgrade Portal
ECHO ***************************************
@ECHO ON
"%JAVA_HOME%\bin\java.exe" -Xmx500m lumis.initializeportal.UpgradePortal -d:"%LUMIS_HOME%\lumisdata"
@SET javaErrorLevel=%ERRORLEVEL%
@ECHO OFF
IF %javaErrorLevel% NEQ 0 (
	ECHO ON
	@EXIT /B %javaErrorLevel%
)
ECHO ON
@EXIT /B 0