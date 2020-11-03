@ECHO OFF
REM Windows build
del .\bin\win\*.* /F /Q
for /D %%p in (".\bin\win\*.*") do rmdir "%%p" /s /q
call pkg index.js --targets node10-win-x64 --output .\bin\win\w2w-node-win64.exe
copy .\tools\cgservice.exe .\bin\win
xcopy /s /q /i html bin\win\html
copy .\commands\win\*.* .\bin\win
copy exclude.txt .\bin\win\exclude.txt
copy config.json.sample .\bin\win\config.json
.\tools\7z.exe a -r .\bin\win\w2w-node-win64.zip .\bin\win\*.*

REM Linux build
del .\bin\linux\*.* /F /Q
for /D %%p in (".\bin\linux\*.*") do rmdir "%%p" /s /q
call pkg index.js --targets node10-linux-x64 --output .\bin\linux\w2w-node-linux64
xcopy /s /q /i html bin\linux\html
copy exclude.txt .\bin\linux\exclude.txt
copy w2w-nolde.service.template .\bin\linux
copy config.json.sample .\bin\linux\config.json
.\tools\7z.exe a -r -ttar .\bin\linux\w2w-node-linux64.tar .\bin\linux\w2w-node-linux64 .\bin\linux\config.json .\bin\linux\exclude.txt .\bin\linux\w2w-node.service.template .\bin\linux\html
.\tools\7z.exe a -tgzip .\bin\linux\w2w-node-linux64.tar.gz .\bin\linux\w2w-node-linux64.tar

REM OSX build (uncomplete, just the binary)
REM call pkg index.js --targets node10-macos-x64 --output .\bin\macos\w2w-node-macos64\