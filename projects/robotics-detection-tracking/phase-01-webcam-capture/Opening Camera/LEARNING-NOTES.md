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


## Learning Session — Largest-Contour Selection
**Date:** 31 October 2026

### 1. What is a contour?

A contour is a collection of points describing the boundary of a detected region.

The camera captures an image, but OpenCV identifies contours through image processing:

1. `cvtColor()` converts the captured frame to HSV.
2. `inRange()` generates a binary mask.
3. `findContours()` identifies boundaries of white regions.
4. `drawContours()` draws those boundaries onto the camera image.

One contour does not necessarily represent one physical object. Reflections, noise and connected background regions can also produce contours.

### 2. Understanding the `for` loop

We use a `for` loop to examine all detected contours.

```cpp
for (int i = 0; i < static_cast<int>(contours.size()); i++)
```

Execution order:

1. Initialize `i = 0`.
2. Check whether `i` is less than the number of contours.
3. If true, execute the loop body.
4. After the loop body finishes, execute `i++`.
5. Check the condition again.

`contours.size()` returns the number of elements stored in the vector. It does not return a string.

Its return type is `size_t`, an unsigned integer type.

`static_cast<int>(contours.size())` converts that count into an `int`, matching the counter's type. For very large vectors, conversion to `int` can exceed its range, although that is not a practical issue for our current camera experiment.

### 3. Understanding contour indexing

Our variable:

```cpp
vector<vector<Point>> contours;
```

stores a collection of contours.

Each contour has an index, starting from zero.

- `contours[0]` accesses the first contour.
- `contours[1]` accesses the second contour.
- `contours[i]` accesses the contour corresponding to the current loop counter.

The index tells us where the contour is stored, not its size.

### 4. Why use `double` instead of `float`?

Both types represent fractional numbers.

| Type | Typical size | Approximate precision |
| --- | --- | --- |
| `float` | 4 bytes | 6–7 significant decimal digits |
| `double` | 8 bytes | 15–16 significant decimal digits |

A `double` also supports a much wider range of magnitudes.

OpenCV's `contourArea()` returns a `double`, so we use that type to store its result without reducing precision.

### 5. Understanding `contourArea()`

```cpp
double area = contourArea(contours[i]);
```

This instruction:

1. Selects the current contour through `contours[i]`.
2. Passes that contour to `contourArea()`.
3. Calculates its enclosed geometric area.
4. Stores the result in `area`.

For pixel-coordinate contours, the area is expressed in square-pixel units. It is not necessarily identical to the count of white pixels in the mask.

### 6. Understanding `largestarea` and `largestindex`

We initialize:

```cpp
double largestarea = 0.0;
int largestindex = -1;
```

`largestarea` stores the largest contour area found so far in the current frame.

`largestindex` stores the index of that contour in the vector.

The initial value `-1` means that no qualifying contour has been selected.

This value is deliberately chosen because normal vector indices begin at zero.

### 7. Understanding the comparison

Inside the loop:

```cpp
if (area > largestarea) {
    largestarea = area;
    largestindex = i;
}
```

The `if` asks whether the current contour is larger than the largest contour found previously.

If true:

- Save the current area in `largestarea`.
- Save the current contour index in `largestindex`.

If false, retain the previously stored values.

The `if` does not terminate the `for` loop.

Example:

| Index | Current area | Largest area afterward | Selected index |
| --- | --- | --- | --- |
| 0 | 100 | 100 | 0 |
| 1 | 60 | 100 | 0 |
| 2 | 250 | 250 | 2 |
| 3 | 150 | 250 | 2 |

Final result:

```cpp
largestarea = 250;
largestindex = 2;
```

If no contours exist, or none has an area greater than zero, `largestindex` remains `-1`.

### 8. Understanding `drawContours()`

`drawContours()` is an OpenCV function, not an object.

A function call supplies arguments to a function.

Our earlier instruction:

```cpp
drawContours(src, contours, -1, Scalar(0, 0, 255), 2);
```

Its arguments are:

- `src`: image on which contours are drawn.
- `contours`: collection of detected boundaries.
- `-1`: draw every contour.
- `Scalar(0, 0, 255)`: red color in BGR order.
- `2`: line thickness in pixels.

A fixed index such as `0` would select the first contour, not necessarily the largest.

To draw the largest detected contour, we use `largestindex` as the third argument.

```cpp
if (largestindex >= 0) {
    drawContours(src, contours, largestindex, Scalar(0, 0, 255), 2);
}
```

The condition prevents drawing when no qualifying contour has been selected.

This check is important because `drawContours()` interprets `-1` as an instruction to draw all contours.

The drawing instruction belongs after the comparison loop, once the largest contour has been identified.

### 9. C++ terminology

**Function:** Reusable code that performs a task, such as `drawContours()` or `contourArea()`.

**Function call:** An expression that invokes a function.

**Parameter:** A named input defined in a function declaration or definition.

**Argument:** A value or variable supplied to a function when it is called.

**Variable:** A named location that stores a value.

**Object:** A value of a class or structure type, such as an OpenCV `Mat` image.

**Index:** The position of an element within a collection.

**Return value:** A value passed back by a function to its caller.

C++ is case-sensitive. `Scalar` and `scalar` are different names.

### 10. Experimental results

**Status: Implemented and visually tested**

The largest-contour algorithm was added to the working webcam program.

Observed results:

1. The display showed at most one red contour per frame rather than all detected contours.
2. The selected contour frequently followed a large reflective region of the desk.
3. Moving the white pen closer to the camera could make its detected region appear larger and become selected.
4. Nearby white regions sometimes appeared connected, allowing the pen and reflected background to be included in one contour.

These observations demonstrate that largest-contour selection works as a selection algorithm.

They do not establish reliable pen recognition.

**Important distinction:** Drawing fewer contours reduces visual clutter, but it does not remove noise from the binary mask.

A controlled experiment using a dark, non-reflective background was proposed but not completed because suitable material was unavailable.

No numerical detection accuracy or reliability measurements have been established.

### 11. Next concept — `boundingRect()`

**Status: Discussed, not yet implemented**

OpenCV provides:

```cpp
boundingRect(contours[largestindex])
```

This function returns an OpenCV `Rect` describing an axis-aligned rectangle surrounding the selected contour.

The rectangle contains:

- Its top-left X coordinate.
- Its top-left Y coordinate.
- Its width.
- Its height.

These values can subsequently be used to calculate the rectangle's center coordinates.

We have not yet implemented or tested the bounding rectangle or passed live coordinates into `classifyposition()`.

### 12. Development status

**Tested:**
- Live camera capture
- HSV conversion
- Binary-mask generation
- Contour detection and visualization
- Separate coordinate-classification function using fixed inputs
- Largest-contour selection and single-contour drawing

**Not yet implemented or verified:**
- Live selected-object center coordinates
- Live coordinates passed to `classifyposition()`
- Object-position labels on the camera image
- Reliable object identification across backgrounds and lighting conditions
- Detection accuracy and latency measurements

**Next programming milestone:** Calculate and test the bounding rectangle of the selected contour.
