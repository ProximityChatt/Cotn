@echo off
REM Build and Release script for Child of the Night (Windows)
REM Creates distribution packages for desktop and mobile versions

setlocal enabledelayedexpansion

set VERSION=1.0.0
set RELEASE_DIR=releases

echo.
echo 🌙 Child of the Night - Build ^& Release System (Windows)
echo ======================================================
echo.

REM Create release directory
if not exist %RELEASE_DIR% mkdir %RELEASE_DIR%

REM ========== DESKTOP BUILD ==========
echo 📦 Building Desktop Version...
set DESKTOP_BUILD=%RELEASE_DIR%\child-of-night-desktop-v%VERSION%
if exist %DESKTOP_BUILD% rmdir /s /q %DESKTOP_BUILD%
mkdir %DESKTOP_BUILD%

REM Copy files
xcopy child-of-night\src\* %DESKTOP_BUILD%\ /E /I /Y >nul
copy child-of-night\package.json %DESKTOP_BUILD%\ /Y >nul

REM Create build info
(
echo Child of the Night - Desktop Browser v%VERSION%
echo Build Date: %DATE% %TIME%
echo Platform: Windows, macOS, Linux
echo.
echo Features:
echo ✅ Multi-tab browsing
echo ✅ Complete history management
echo ✅ Bookmark organization
echo ✅ HTTPS enforcement
echo ✅ Tracking prevention
echo ✅ Input sanitization
echo ✅ Content Security Policy (CSP)
) > %DESKTOP_BUILD%\BUILD_INFO.txt

echo ✅ Desktop build created: %DESKTOP_BUILD%
echo.

REM ========== MOBILE BUILD ==========
echo 📦 Building Mobile Version...
set MOBILE_BUILD=%RELEASE_DIR%\child-of-night-mobile-v%VERSION%
if exist %MOBILE_BUILD% rmdir /s /q %MOBILE_BUILD%
mkdir %MOBILE_BUILD%

REM Copy files
xcopy child-of-night-mobile\src\* %MOBILE_BUILD%\ /E /I /Y >nul
copy child-of-night-mobile\package.json %MOBILE_BUILD%\ /Y >nul

REM Create build info
(
echo Child of the Night - Mobile Browser v%VERSION%
echo Build Date: %DATE% %TIME%
echo Platforms: iOS (Safari 12+^), Android (Chrome 80+^)
echo.
echo Features:
echo ✅ Touch-optimized interface
echo ✅ Multi-tab browsing
echo ✅ Complete history management
echo ✅ Bookmark organization
echo ✅ HTTPS enforcement
echo ✅ Tracking prevention
echo ✅ Bottom navigation (thumb-friendly^)
echo ✅ Slide-out menus
echo ✅ Safe area support
) > %MOBILE_BUILD%\BUILD_INFO.txt

echo ✅ Mobile build created: %MOBILE_BUILD%
echo.

REM ========== COMPLETE PACKAGE ==========
echo 📦 Building Complete Package...
set COMPLETE_BUILD=%RELEASE_DIR%\child-of-night-complete-v%VERSION%
if exist %COMPLETE_BUILD% rmdir /s /q %COMPLETE_BUILD%
mkdir %COMPLETE_BUILD%
mkdir %COMPLETE_BUILD%\desktop
mkdir %COMPLETE_BUILD%\mobile

xcopy %DESKTOP_BUILD%\* %COMPLETE_BUILD%\desktop\ /E /I /Y >nul
xcopy %MOBILE_BUILD%\* %COMPLETE_BUILD%\mobile\ /E /I /Y >nul

echo ✅ Complete package created: %COMPLETE_BUILD%
echo.

REM ========== CREATE MANIFEST ==========
echo 📄 Creating Release Manifest...
(
echo 🌙 Child of the Night v%VERSION% - Release Manifest
echo ================================================
echo.
echo Build Date: %DATE% %TIME%
echo Release Type: Full Release
echo.
echo Files:
echo ------
echo.
echo 1. child-of-night-desktop-v%VERSION%.zip
echo    - Desktop browser for Windows, macOS, Linux
echo    - Includes: Full UI, styling, all 4 core features
echo.
echo 2. child-of-night-mobile-v%VERSION%.zip
echo    - Mobile browser for iOS and Android
echo    - Includes: Touch-optimized UI, all 4 core features
echo.
echo 3. child-of-night-complete-v%VERSION%.zip
echo    - Complete package with both versions
echo    - Includes: Desktop + Mobile + Documentation
echo.
echo Features Included:
echo ------------------
echo ✅ Tab Management
echo ✅ History System
echo ✅ Bookmarks Manager
echo ✅ Security System
echo ✅ HTTPS Enforcement
echo ✅ Tracking Prevention
echo ✅ Input Sanitization
echo ✅ CSP Headers
echo ✅ URL Validation
echo ✅ Responsive Design
echo ✅ Touch Optimization
echo ✅ Dark Theme
echo.
echo Installation Options:
echo ---------------------
echo 1. Web Browser: Open index.html directly
echo 2. Electron: npm install ^&^& electron .
echo 3. React Native: Integrate mobile version
echo 4. Cordova: Wrap with Apache Cordova
echo.
echo Supported Browsers:
echo -------------------
echo Desktop: Chrome 80+, Firefox 75+, Safari 12+, Edge 80+
echo Mobile: iOS Safari 12+, Chrome Android 80+, Firefox Android 68+
) > %RELEASE_DIR%\RELEASE_MANIFEST.txt

type %RELEASE_DIR%\RELEASE_MANIFEST.txt
echo.

REM ========== SUMMARY ==========
echo ======================================================
echo ✅ Build Complete!
echo ======================================================
echo.
echo 📁 Release Location: %RELEASE_DIR%\
echo.
echo 📦 Artifacts:
dir %RELEASE_DIR%\child-of-night-* /s
echo.
echo 📊 Build Summary:
echo    - Desktop Version: child-of-night-desktop-v%VERSION%
echo    - Mobile Version: child-of-night-mobile-v%VERSION%
echo    - Complete Package: child-of-night-complete-v%VERSION%
echo.
echo 🚀 Next Steps:
echo    1. Create GitHub Release (Tag: v%VERSION%^)
echo    2. Upload ZIP files to release (using 7-Zip or WinRAR^)
echo    3. Share release link
echo.
echo 🌙 Child of the Night v%VERSION% - Ready for distribution!
echo.

pause
