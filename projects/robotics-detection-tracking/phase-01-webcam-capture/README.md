# Phase 01 — Webcam frame acquisition (C++ / OpenCV)

An early, stationary, non-weaponized camera-acquisition experiment within the planned Modular Intelligent Detection & Tracking System. This milestone tests webcam input separately from later object detection, motors, and sensors.

## What the program does
1. Opens webcam index `0` using `cv::VideoCapture`.
2. Checks camera initialization using `isOpened()`.
3. Acquires up to 10 frames, checking `src.empty()` after each acquisition.
4. Counts only non-empty captured frames.
5. Displays the final captured frame using `imshow()` and `waitKey(0)`.
6. Exits with a nonzero status if camera initialization or frame capture fails.

## Test evidence (24 October 2026)

**TESTED — normal capture path (user-run on Windows / Visual Studio):**
- After changing the failed-frame branch from `break;` to `return -1;`, a Visual Studio `Debug x64` rebuild reported **1 succeeded, 0 failed** (screenshot shared).
- The camera reported `Camera Opened Successfully`.
- The console printed **Frame 1** through **Frame 10 Captured Successfully** (screenshot shared).
- OpenCV reported creating the `Captured Frame` Win32 display window (screenshot shared).
- The user previously confirmed that the single final frame could be displayed before the error-handling correction.

**NOT VERIFIED:** The screenshots of the corrected build do not directly show the image contents or final exit code. The forced capture-failure path has not been tested. No frame-rate, latency, detection, camera calibration, or reliability measurements are claimed. Optional OpenCV plugin loading warnings did not prevent the successful captures.

## Setup
- Windows and webcam.
- Visual Studio C++ with OpenCV headers, libraries and runtime binaries configured (development used vcpkg).
- Compile `Opening Camera.cpp` in a project linking OpenCV core, videoio, and highgui.

### Visual Studio solution layout

- `Opening Camera.slnx` — solution file for Visual Studio.
- `Opening Camera/Opening Camera.vcxproj` — C++ project configuration (now included).
- `Opening Camera/Opening Camera.vcxproj.filters` — source organization within Visual Studio.
- `Opening Camera/Opening Camera.cpp` — source code for the acquisition experiment.

The local `.vcxproj.user` file is intentionally excluded because it holds per-user settings.

### Reproducing the development setup

1. Use Visual Studio with the **v145 C++ platform toolset** (as recorded in the original project file) and a suitable Windows SDK. Other toolsets might work if the project is deliberately retargeted, but have not been tested here.
2. Install vcpkg and OpenCV 4 for the `x64-windows` triplet in classic mode, and enable MSBuild user-wide integration with `vcpkg integrate install`. This integration provides automatic include/link settings and runtime DLL deployment for supported packages.
3. Ensure the Windows environment variable `VCPKG_ROOT` points to the vcpkg installation directory before launching Visual Studio. The published **Debug|x64** configuration refers to `$(VCPKG_ROOT)\installed\x64-windows\include\opencv4`, rather than the developer's absolute `C:\Users\...` path.
4. Open `Opening Camera.slnx`, select **Debug | x64**, build, and run with a working webcam.

**Build caveat:** No independent clean-checkout build has been performed with the portable variable-based configuration. Only the user's original local **Debug | x64** configuration and normal capture path have been tested. The other target configurations were retained but not verified, and no `vcpkg.json` dependency manifest or pinned OpenCV version is included.
## Next milestone
Develop a controlled continuous live-view loop and verify keyboard-triggered exit and cleanup, before starting object detection.

## Scope
Civilian, educational, stationary sensor-orientation work using benign objects only. No weaponization or covert tracking.
