#include <iostream>

using namespace std;

int main ()
{
	int a,b,c;

	double arr[500];

	cin>>a>>b>>c;

	int acc = 0;
	for(int i=0; i<500; i++){
		acc = i*2;
	}

	cout<<"read:"<<a<<","<<b<<","<<c<<endl;

	return 0 ;
}