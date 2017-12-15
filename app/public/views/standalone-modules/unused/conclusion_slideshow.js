var slidekey;
var slidecontent;
var node;

var conclusion = new Linked_List();

slidekey = ["subtitle", "point", "point", "inputbox", "pdfbutton", "hidepage"];
slidecontent = [
		"Conclusion",
		"Mentoring can be a wonderful and life changing experiencing. The mutual relationship that develops between a mentor and mentee is associated with a number of positive outcomes for both individuals. But mentoring takes work and dedication!",
		"We hope that after completing this module you have increased your knowledge and understanding of mentoring, it's characteristics, the roles involved - particularly the role of the mentor - the skill sets required, and keys to developing a successful mentoring relationship.",
		"",
		"",
		""];
slide = new Slide(slidekey, slidecontent);
node = new Node(slide);
conclusion.Add(node);