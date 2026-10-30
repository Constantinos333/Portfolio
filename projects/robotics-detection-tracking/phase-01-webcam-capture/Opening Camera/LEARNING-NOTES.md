# Robotics Detection & Tracking — Learning Notes

These notes organize the explanations previously written beside my C++ instructions and the concepts discussed while building the webcam detector and coordinate-classification module. They describe the current learning stage, not a finished tracking system.

## 1. C++ Fundamentals

### Header files and `#include`

An `#include` directive makes declarations from another header available to the current source file.

| Instruction | Purpose in this project |
| --- | --- |
| `#include <iostream>` | Provides console input/output tools such as `cout`, `cin`, and `endl`. |
| `#include <vector>` | Provides `std::vector`, a container that holds a sequence of elements. |
| `#include <string>` | Provides `std::string`, used for returning a textual direction. |
| `#include "CoordinateClassifier.h"` | Makes the declaration of our `classifyposition()` function available. |

The angle brackets (`<...>`) are normally used for standard or installed library headers. Quotation marks (`"..."`) are normally used for headers in our own project.

### Namespaces and program structure

- `using namespace cv;` lets us write `Mat` instead of `cv::Mat`.
- `using namespace std;` lets us write `cout` instead of `std::cout`.
- `int main()` is the entry point of the executable program.
- `{` and `}` enclose blocks of instructions.
- `return 0;` at the end of `main()` indicates successful termination.
- `return -1;` in our camera program indicates an error and exits `main()` early.

C++ is **case-sensitive**: `centerx` and `centerX` would be different names. Our own variable and function names use lowercase; OpenCV library names keep their original spelling.

### Conditions and loops

- `if` tests a condition; `else if` tests another condition if preceding conditions failed; `else` handles the remaining case.
- `&&` means **AND**: all combined conditions must be true.
- `>=` and `<=` include their boundary values.
- `while (true)` repeats instructions continuously until something stops the loop.
- `break;` exits the nearest loop.
- `cout << ... << endl;` writes information to the console.
- `cin >> ...;` reads a value entered through the console.
- `cin.get();` can pause for a character (used temporarily during our module test).

### Variables, functions, and returned values

A variable stores data. A *parameter* receives data when a function is called. A function can calculate something and `return` the result to its caller.

**Important distinction:** `cout` **displays** a value; `return` **passes a result back** and ends the function.

For example, our reusable function has this declaration:

```cpp
std::string classifyposition(
    float objectx,
    float objecty,
    float imagewidth,
    float imageheight,
    float tolerance
);
```

- `std::string` is the return type: the function returns text.
- The five `float` parameters are the inputs.
- The semicolon indicates a **declaration**, not an implementation.

### Vectors and indexing

A `vector` is a C++ container with elements that can be accessed by index. Indexing starts at **0**.

- `contours[0]` means the first detected contour.
- `contours[1]` means the second.
- `contours.size()` returns how many contours are stored.
- `vector<Point>` contains multiple points.
- `vector<vector<Point>>` contains multiple lists of points (one list for each detected contour).

Never access `contours[0]` without first ensuring at least one contour exists.

## 2. OpenCV Fundamentals

### OpenCV headers

| Header | Used for |
| --- | --- |
| `<opencv2/core.hpp>` | `Mat` and other core OpenCV types. |
| `<opencv2/videoio.hpp>` | `VideoCapture` and capturing camera frames. |
| `<opencv2/highgui.hpp>` | `imshow()` and `waitKey()` for displaying windows and handling events. |
| `<opencv2/imgproc.hpp>` | Image conversion, thresholding, contour detection, and drawing functions. |

### Images are matrices

`Mat` is an OpenCV type representing image data.

- `Mat src;` stores the original camera frame.
- `Mat hsv;` stores the image converted into HSV color representation.
- `Mat mask;` stores a binary black-and-white detection image.
- `src.cols` is the number of image columns, or width in pixels.
- `src.rows` is the number of image rows, or height in pixels.

Image coordinates start at the **top-left**. X increases to the right, and the original image Y coordinate increases **downward**.

### Camera capture and display

| Code | What it does |
| --- | --- |
| `cv::VideoCapture cap(0);` | Attempts to open the default webcam (camera index 0). |
| `cap.isOpened()` | Checks whether the camera was opened successfully. |
| `cap >> src;` | Reads the next frame into `src`. |
| `src.empty()` | Checks whether a usable image was received. |
| `imshow("Captured Frame", src);` | Displays the camera frame in a named window. |
| `imshow("Detection Mask", mask);` | Displays the binary mask for inspection. |
| `waitKey(1)` | Processes OpenCV window events and briefly waits for a key; the loop checks again on the next iteration. |
| `if (key == 'q') break;` | Exits the camera loop when Q is detected. |
| `cap.release();` | Releases the camera. |
| `destroyAllWindows();` | Closes the OpenCV display windows. |

**Processing and displaying are independent.** Commenting out `imshow("Detection Mask", mask);` hides that window, but the mask still exists and can be processed.

## 3. Image Processing and Color Detection

### BGR and HSV

The camera frame is represented in **BGR** (Blue, Green, Red) color order. We convert it to **HSV**:

- **H — Hue:** which color.
- **S — Saturation:** how vivid or faded the color is.
- **V — Value:** how bright or dark it is.

```cpp
cvtColor(src, hsv, COLOR_BGR2HSV);
```

This converts the image stored in `src` and puts the result into `hsv`.

In the usual 8-bit OpenCV HSV representation, H ranges from **0 to 179**, while S and V range from **0 to 255**.

### `inRange()` and the binary mask

```cpp
inRange(hsv, Scalar(0, 0, 100), Scalar(179, 50, 255), mask);
```

- First argument, `hsv`: image to examine.
- First `Scalar`: minimum accepted `(H, S, V)` values.
- Second `Scalar`: maximum accepted `(H, S, V)` values.
- Last argument, `mask`: output image.

The two `Scalar()` expressions are the **lower and upper boundaries of one range**. They are not two exact colors that must both match.

Every channel must pass its minimum and maximum check (`AND`). A matching pixel becomes **255 (white)** in the mask; a nonmatching pixel becomes **0 (black)**.

The values shown above are the **current starting settings for a white-object experiment**: all hues, low saturation, and brightness of at least 100. Earlier experiments detected green using `Scalar(35, 50, 50)` to `Scalar(85, 255, 255)`.

**Observed limitation:** Fixed HSV thresholds depend on lighting. Adjusting the minimum V value (including trials at 80 and 100) changed how completely the white pen was detected. The cleaner recording was made after returning the lower V threshold to 100 under that lighting. This is not evidence that the same settings work reliably under different lighting.

### Why the mask is useful

The mask simplifies the next operation: rather than analyzing every color and texture in the original scene, `findContours()` can search for boundaries of white regions. The mask is an **internal processing result**; it does not have to appear on the eventual camera HUD.

## 4. Contour Detection

### What a contour means

A **contour** is a collection of points describing the boundary of a detected region. One physical object can produce several separate detected white regions, so the number of contours is not necessarily the number of objects.

```cpp
vector<vector<Point>> contours;
findContours(mask, contours, RETR_EXTERNAL, CHAIN_APPROX_SIMPLE);
```

- `mask`: black-and-white image to examine.
- `contours`: receives the detected boundary-point lists.
- `RETR_EXTERNAL`: retrieves outer contours rather than nested contours.
- `CHAIN_APPROX_SIMPLE`: compresses straight boundary segments, keeping fewer points when possible.

`findContours()` **finds and stores** boundary information. It does not by itself draw red outlines on the original camera image.

### Displaying detected contours

```cpp
drawContours(src, contours, -1, Scalar(0, 0, 255), 2);
```

- `src`: image on which the boundaries are drawn.
- `contours`: boundaries already found.
- `-1`: draw **all** contours.
- `Scalar(0, 0, 255)`: red, in OpenCV's BGR channel order.
- `2`: line thickness in pixels.

**Experiment completed:** Commenting out `drawContours()` removed the red outlines from the original camera view, while the solid white mask regions were still visible. White mask regions and drawn contour lines are **not the same thing**.

### Contour count and limitations

```cpp
cout << "Number of contours found: " << contours.size() << endl;
```

This prints the number of boundaries found in each frame. In an earlier test with one green-containing object, the reported count fluctuated around **10–22**. A single object can have disconnected matching patches; image noise and background regions can also produce contours.

### Next planned work — not yet implemented

- Measure contour areas using `contourArea()`.
- Test a rule for selecting a meaningful detected region, initially considering the largest contour by **enclosed area**, not by number of boundary points.
- Find the selected region's center coordinates.
- Test selection under different backgrounds and lighting conditions.

The largest contour may not be the desired object if a background region is larger or the object is fragmented. Do not assume it is always correct.

## 5. Coordinate Classification and Modular Programming

### Separating the files

| File | Responsibility |
| --- | --- |
| `Opening Camera.cpp` | Captures frames, creates masks, and finds/draws contours. |
| `CoordinateClassifier.h` | Declares `classifyposition()` so another source file can call it. |
| `CoordinateClassifier.cpp` | Implements the calculations and direction-classification conditions. |

A header (`.h`) describes the interface; the source file (`.cpp`) implements the behavior.

`#pragma once` at the start of the header prevents that header from being processed repeatedly in the same translation unit.

Only one `main()` belongs in a single executable. The original standalone coordinate program's logic was moved into `classifyposition()` so it can be reused without copying a second `main()` into the webcam project.

### Image center and relative position

Our classifier accepts the **actual image width and height as parameters** rather than permanently assuming a resolution of 2560 × 1440.

```cpp
float centerx = imagewidth / 2.0f;
float centery = imageheight / 2.0f;
float relativex = objectx - centerx;
float relativey = centery - objecty;
```

- Positive `relativex`: object is to the **right**.
- Negative `relativex`: object is to the **left**.
- Positive `relativey`: object is **above** center.
- Negative `relativey`: object is **below** center.

The `relativey` subtraction is reversed deliberately because image Y values increase downward, but our classification system uses **positive Y for above**.

### Tolerance and nine classifications

`tolerance` sets a permitted deviation around the image center. For a tolerance of 10, values between **−10 and +10 inclusive** are classified as centered on that axis.

The classifier returns one of nine descriptions: left/center/right combined with above/center/below. Its `if` / `else if` / `else` chain selects the appropriate result and uses `return` rather than printing it.

An example from our test:

```cpp
classifyposition(1500, 500, 2560, 1440, 10)
```

For these inputs, `centerx = 1280`, `centery = 720`, `relativex = +220`, and `relativey = +220`, so it returns **`"Object is Right and above center."`**

### What we actually tested

- **Build completed:** `CoordinateClassifier.cpp` compiled as part of the webcam project.
- **Function call tested:** `Opening Camera.cpp` called `classifyposition(...)` using fixed, known coordinates and displayed the expected message in the console.
- **Not yet integrated:** The classifier is **not** receiving coordinates calculated from live detected objects. That is a later milestone.

A temporary `cin.get()` pause was used to keep console output visible before the camera produced diagnostic messages. That temporary test was removed afterward.

## 6. Current Project Status and Next Steps

**Tested:** webcam acquisition, continuous video display, HSV mask generation, contour display, counting contours, and a fixed-input call to the separate coordinate-classification module.

**Not yet verified:** choosing the intended object consistently, calculating its live `(x, y)` position, measuring detection accuracy or reliability, and a tracking HUD.

**Next smallest engineering milestone:** examine contour areas, select a candidate contour while safely handling the case of zero contours, calculate its center, and pass those coordinates to `classifyposition()`.

**Learning rule:** keep source-code comments short and store terminology, function interfaces, experiments, and explanations here. Update this file when understanding or observations genuinely change.
