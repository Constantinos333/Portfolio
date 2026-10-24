# Phase 01 — Webcam frame acquisition (C++ / OpenCV)

An early, stationary, non-weaponized camera-acquisition experiment within the planned Modular Intelligent Detection & Tracking System. This milestone tests webcam input separately from later object detection, motors, and sensors.

## What the program does
1. Opens webcam index `0` using `cv::VideoCapture`.
2. Checks camera initialization using `isOpened()`.
3. Acquires up to 10 frames, checking `src.empty()` after each acquisition.
4. Counts only non-empty captured frames.
5. Displays the final captured frame using `imshow()` and `waitKey(0)`.
6. Reports capture failures using a nonzero program exit status.

## Evidence (user-reported on 24 October 2026)
The Visual Studio / OpenCV program opened the webcam, printed ten successful frame-acquisition messages, and displayed the final captured image. The camera could still return a non-empty (dark) frame with its physical privacy cover closed.

**Verification boundary:** The source committed here contains one small correction, using `return -1;` instead of `break;` on a failed frame acquisition, to prevent displaying an empty image. The corrected version has **not yet been recompiled or tested** by the user. No frame-rate, latency, detection, calibration, or reliability measurement is claimed.

## Setup
- Windows and webcam.
- Visual Studio C++ with OpenCV headers, libraries and runtime binaries configured (development used vcpkg).
- Compile `Opening Camera.cpp` in a project linking OpenCV core, videoio, and highgui.

**The original Visual Studio solution and project files are not included yet.** They were not present in the connected Engineering-OS Drive folder and have not been shared as files. This folder therefore documents source code, **not a ready-to-build Visual Studio solution**. Local OpenCV paths must be configured on each computer.

## Next milestone
Develop a controlled continuous live-view loop and verify keyboard-triggered exit and cleanup, before starting object detection.

## Scope
Civilian, educational, stationary sensor-orientation work using benign objects only. No weaponization or covert tracking.
