program HelloWorld;
uses crt;
const
msg='Hello,';
type
name=string;
var
firstname:name;
lastname:name;
begin
	writeln('Pascal Program Starts...');
	readln(firstname);
	readln(lastname);
	writeln(msg,firstname,' ',lastname);
end.
