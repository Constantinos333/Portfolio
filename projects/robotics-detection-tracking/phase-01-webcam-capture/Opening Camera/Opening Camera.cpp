//Opening Camera.cpp 

#include <opencv2/core.hpp> //Provides Mat, which stores your captured image data
#include <opencv2/videoio.hpp> //Provides VideoCapture for accessing the webcam and retrieving frames
#include <opencv2/highgui.hpp> //Provides imshow() and waitKey() for displaying images and processing keyboard input
#include <iostream> //Provides cout and endl for console output


using namespace cv;
using namespace std; //lets you write cout instead of std::cout

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


	while (true) {
		cap >> src;
		if (src.empty()) {
			cout << "Error: Could not capture frame" << endl;
			return -1;
		}
		imshow("Captured Frame", src); //Display the captured frame
			
		int key = waitKey(1); //Process window events and check for a keypress
		if (key == 'q') {
			break; //Exit the loop if 'q' is pressed
		}
	}
	cap.release();       // Release the webcam
	destroyAllWindows(); // Close OpenCV windows
		
	return 0;
}
