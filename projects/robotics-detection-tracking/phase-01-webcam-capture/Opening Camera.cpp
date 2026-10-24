//Opening Camera.cpp 

#include <opencv2/core.hpp> //Provides Mat, which stores your captured image data
#include <opencv2/videoio.hpp> //Provides VideoCapture for accessing the webcam and retrieving frames
#include <opencv2/highgui.hpp> //Provides imshow() and waitKey() for displaying images and processing keyboard input
#include <iostream> //Provides cout and endl for console output


using namespace cv;
using namespace std; //groups related names together, helping prevent naming conflicts.

int main() //is a function, a block of instructions that performs a task
{
	Mat src; // Create a matrix to hold the captured frame, Mat is an object that represents an image in OpenCV, src is a variable that will store the captured frame from the camera
	cv::VideoCapture cap(0); // Open the default camera (camera index 0), videoCapture is a class that provides an interface for capturing video from cameras or video files, cap is a variable that will be used to access the camera and retrieve frames

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
			return -1;
		}
		else {
			cout << "Frame " << ++framecount << " Captured Successfully" << endl;
		}
		
	}
	imshow("Captured Frame", src); //Display the captured frame
	waitKey(0); //Wait for a key press to proceed
	
	return 0;
}
