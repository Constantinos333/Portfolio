// Opening Camera.cpp
// Phase 01: webcam opening, ten frame acquisitions, and final-frame display.

#include <opencv2/core.hpp>
#include <opencv2/videoio.hpp>
#include <opencv2/highgui.hpp>
#include <iostream>
#include <stdio.h>

using namespace cv;
using namespace std;

int main()
{
    Mat src; // Create a matrix to hold the captured frame
    cv::VideoCapture cap(0); // Open the default camera (camera index 0)

    if (cap.isOpened()) {
        cout << "Camera Opened Successfully" << endl;
    }
    else {
        cout << "Error: Could not open camera" << endl;
        return -1;
    }

    int framecount = 0;
    while (framecount < 10) {
        cap >> src;
        if (src.empty()) {
            cout << "Error: Could not capture frame" << endl;
            return -1; // Prevent attempting to display an empty frame
        }
        else {
            cout << "Frame " << ++framecount << " Captured Successfully" << endl;
        }
    }

    imshow("Captured Frame", src); // Display the captured frame
    waitKey(0); // Wait for a key press before continuing

    return 0;
}
