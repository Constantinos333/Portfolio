#include <opencv2/core.hpp>
#include <opencv2/videoio.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc.hpp>
#include <iostream>
#include <vector>
#include "CoordinateClassifier.h"


using namespace cv;
using namespace std;

int main()
{

	//Image Matrices
	Mat src;
	Mat hsv;
	Mat mask;

	//Open the default camera (camera index 0)
	cv::VideoCapture cap(0);

	//Check Camera Connection
	if (cap.isOpened()) {
		cout << "Camera Opened Successfully" << endl;
	}
	else {
		cout << "Error: Could not open camera" << endl;
		return -1;
	}

	while (true) {
		// Capture and validate camera frame
		cap >> src;
		if (src.empty()) {
			cout << "Error: Could not capture frame" << endl;
			return -1;
		}

		//Convert the camera frame into a binary mask
		cvtColor(src, hsv, COLOR_BGR2HSV);
		inRange(hsv, Scalar(0, 0, 100), Scalar(179, 50, 255), mask);

		// Detect and draw contours around detected regions
		vector<vector<Point>> contours;
		findContours(mask, contours, RETR_EXTERNAL, CHAIN_APPROX_SIMPLE);
		double largestarea = 0.0;
		int largestindex = -1;

		for (int i = 0; i < static_cast<int>(contours.size()); i++) {

			double area = contourArea(contours[i]);

				if (area > largestarea) {
					largestarea = area;
					largestindex = i;
				}

		}

		if (largestindex >= 0) {

			drawContours(src, contours, largestindex, Scalar(0, 0, 255), 2);
		}
		//Calculate Image Center
		int centerx = src.cols / 2;
		int centery = src.rows / 2;

		//Display camera frame and detection mask
		imshow("Captured Frame", src);
		imshow("Detection Mask", mask);
			
		//Process window events and check for a keypress
		int key = waitKey(1);
		if (key == 'q') {
			cout << "Largest area: " << largestarea << endl;
			cout << "Contour index: " << largestindex << endl;
			break;
		}

	}

	// Release Camera and Destroy Windows
	cap.release();
	destroyAllWindows();
		
	return 0;
}
