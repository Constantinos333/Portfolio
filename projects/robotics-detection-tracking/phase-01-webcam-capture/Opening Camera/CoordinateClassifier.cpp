#include "CoordinateClassifier.h" //This tells the compiler that the source file uses the function declaration in CoordinateClassifier.h.

std::string classifyposition(
	float objectx,
	float objecty,
	float imagewidth,
	float imageheight,
	float tolerance
)
{
	float centerx = imagewidth / 2.0f;
	float centery = imageheight / 2.0f;
	float relativex = objectx - centerx;
	float relativey = centery - objecty;

	if (relativex > tolerance && relativey <= tolerance && relativey >= -tolerance)
	{
		return "Object is Right and Centered.";
	}
	else if (relativex > tolerance && relativey > tolerance)
	{
		return "Object is Right and above center.";
	}
	else if (relativex >= -tolerance && relativex <= tolerance && relativey > tolerance)
	{
		return "Object is Centered and above center.";
	}
	else if (relativex < -tolerance && relativey > tolerance)
	{
		return "Object is Left and above center.";
	}
	else if (relativex < -tolerance && relativey >= -tolerance && relativey <= tolerance)
	{
		return "Object is Left and Centered.";
	}
	else if (relativex < -tolerance && relativey < -tolerance)
	{
		return "Object is Left and Below center.";
	}
	else if (relativex <= tolerance && relativex >= -tolerance && relativey < -tolerance)
	{
		return "Object is Centered and below center.";
	}
	else if (relativex > tolerance && relativey < -tolerance)
	{
		return "Object is Right and Below center.";
	}
	else
	{
		return "Object is Centered.";
	}
}