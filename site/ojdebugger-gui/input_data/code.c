#include<stdio.h>

int main(){
    char name[21] = {'\0'};

    scanf("%20s",name);
    printf("Nice to see you, %s\n", name);

    return 0;
}