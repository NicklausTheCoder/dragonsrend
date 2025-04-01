@echo off
SETLOCAL

:: 1. Create required directories
mkdir android\app\src\main\res\values
mkdir android\app\src\main\res\xml

:: 2. Create strings.xml
echo ^<resources^> > android\app\src\main\res\values\strings.xml
echo     ^<string name="app_name"^>My Game^</string^> >> android\app\src\main\res\values\strings.xml
echo     ^<string name="title_activity_main"^>My Game^</string^> >> android\app\src\main\res\values\strings.xml
echo ^</resources^> >> android\app\src\main\res\values\strings.xml

:: 3. Create styles.xml
echo ^<resources^> > android\app\src\main\res\values\styles.xml
echo     ^<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar"^> >> android\app\src\main\res\values\styles.xml
echo         ^<item name="colorPrimary"^>@color/colorPrimary^</item^> >> android\app\src\main\res\values\styles.xml
echo         ^<item name="colorPrimaryDark"^>@color/colorPrimaryDark^</item^> >> android\app\src\main\res\values\styles.xml
echo         ^<item name="colorAccent"^>@color/colorAccent^</item^> >> android\app\src\main\res\values\styles.xml
echo     ^</style^> >> android\app\src\main\res\values\styles.xml
echo     ^<style name="AppTheme.NoActionBarLaunch" parent="AppTheme"^> >> android\app\src\main\res\values\styles.xml
echo         ^<item name="windowActionBar"^>false^</item^> >> android\app\src\main\res\values\styles.xml
echo         ^<item name="windowNoTitle"^>true^</item^> >> android\app\src\main\res\values\styles.xml
echo     ^</style^> >> android\app\src\main\res\values\styles.xml
echo ^</resources^> >> android\app\src\main\res\values\styles.xml

:: 4. Create colors.xml
echo ^<resources^> > android\app\src\main\res\values\colors.xml
echo     ^<color name="colorPrimary"^>#6200EE^</color^> >> android\app\src\main\res\values\colors.xml
echo     ^<color name="colorPrimaryDark"^>#3700B3^</color^> >> android\app\src\main\res\values\colors.xml
echo     ^<color name="colorAccent"^>#03DAC5^</color^> >> android\app\src\main\res\values\colors.xml
echo ^</resources^> >> android\app\src\main\res\values\colors.xml

:: 5. Create file_paths.xml
echo ^<?xml version="1.0" encoding="utf-8"?^> > android\app\src\main\res\xml\file_paths.xml
echo ^<paths^> >> android\app\src\main\res\xml\file_paths.xml
echo     ^<files-path name="my_files" path="." /^> >> android\app\src\main\res\xml\file_paths.xml
echo ^</paths^> >> android\app\src\main\res\xml\file_paths.xml

echo Android resources created successfully!
echo Now run: cd android && gradlew clean && gradlew assembleDebug
PAUSE