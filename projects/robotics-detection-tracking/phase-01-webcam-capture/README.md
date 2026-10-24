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

**The original Visual Studio solution and project files are not included yet.** They were not present in the connected Engineering-OS Drive folder and have not been shared as files. This folder therefore documents source code, **not a ready-to-build Visual Studio solution**. Local OpenCV paths must be configured on each computer.

## Next milestone
Develop a controlled continuous live-view loop and verify keyboard-triggered exit and cleanup, before starting object detection.

## Scope
Civilian, educational, stationary sensor-orientation work using benign objects only. No weaponization or covert tracking.
