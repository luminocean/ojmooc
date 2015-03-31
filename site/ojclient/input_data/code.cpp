#include <iostream>

using namespace std;

struct Input{
    int a;
    int b;
    int c;
};

int getNum(){
    int num = 0;
    for(int i=0; i<500; i++){
    		num = i*2;
    }
    return num;
}

int main ()
{
	Input input;
	cin>>input.a>>input.b>>input.c;

	int acc = 0;
	acc = getNum();

	cout<<"read:"<<input.a<<","<<input.b<<","<<input.c<<endl;
    cout<<"hello"<<endl;
	return 0 ;
}