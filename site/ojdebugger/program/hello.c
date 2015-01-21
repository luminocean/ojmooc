#include<stdio.h>

int calSum(int upper){
	int sum = 0;

	for(int i=1; i<=upper; i++){
		sum += i;
	}

	return sum;
}

int main(){
	int num = 10;
	num = num+90;

	int sum = calSum(num);
	
	printf("sum is %d\n",sum);

	return 0;
}
