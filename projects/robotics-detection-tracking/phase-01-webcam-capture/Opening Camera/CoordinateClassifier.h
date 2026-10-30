#pragma once //Prevents the compiler from processing this header more than once within the same translation unit.
#include <string>  // Makes the C++ std::string type available. We need it because our function will return text such as "Right and above center"

std::string classifyposition(
	float objectx,
	float objecty,
	float imagewidth,
	float imageheight,
	float tolerance
);
