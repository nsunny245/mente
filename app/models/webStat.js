/*1)Visits to the website;
2) number of registered members;
3) number of mentees and mentors;
4) country of visitor; 
5) total unique visitors, 
6) average time spent on the website; 
7) exit and entrance pages (the pages visitors arrive and leave from); 
8) bounce rate (# of people who visit website and immediately leave); 
9)repeat visitors; 
10) top internal search keywords
I’ve highlighted -repeat visitors, because I wasn’t sure if it required storage of the IP address? 
It would be good for us to also capture location (e.g. province, country). Would this be possible without storing IP unique visitor 
*/

var mongoose = require('mongoose');
//For saving stats not saved in the Database.
var webStat = mongoose.Schema({
	//Weekly tally.
	set_search_keywords: [],//set of unique searched terms
	paral_search_keywords_num: [],//How many times each search terms have been searched.
	//Date
	week_starting: Date

});

module.exports = mongoose.model('webStat', webStat);