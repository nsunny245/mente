# PSDnet Documentation.



#### Content Manager

`Accessible to authorized user.`

#### Community account
    This is the first step anyone is required to complete. 
	Url: mSignup/user. (app.js)
	Router: /signup. (routes.js)
	This creates a temporary token and sends a verification email to the user. 
	At this point eh user status is unverified
	`the temporay tokens and accounts can be removed from content manager page after 24H.`

##### Email verification
	Before the user can signup for mentorship or post on a forum, they need to follow 
	the link from their verification email.
	If an account doesnt get verified after 24h it will be deleted.
	`Once they click the verified link, their account status will be **verified**`

### Membership Paths

```
Step by step of the whole process of signup/mentor match/setup.
Types of account status: 
unverified : temporary account. Only last 24h if it remains unverified (use email verification).
verified : basic account, lets the user access the forum, libraries etc.

//NOT USED ANYMORE: 
menteeIncomplete: status while a user has selected to become a mentee and is filling the form. 
	(used for save function).
mentorIncomplete: status while a user has selected to become a mentor and is filling the form. 
	(used for save function).


menteeInTraining : status of a mentee once the forms have been filled up and 
	is doing the training modules.
mentorInTraining : status of a mentor once the forms have been filled up and 
	is doing the training modules.

menteeSeeking : Once a menteeInTraining has completed the training and the 
	application/(school email has been verified "Not yet added").
				
		`At this the mentee will can request to be matched with mentors from the timeline.`

mentee : Once a mentee has reviewed and accepted a mentor match. The program starts here.
mentor : Once a mentor has finished all required training and police check/application 
	verification has been completed.
mentorFull : status if a mentor as the max number of mentee permited OR as set his 
	account to not receive new/any mentees.


#### MenteeSeeking
	Once approved the system will send request to the best matched mentors.
	Matching point system:
		first checks for matching data :
			Gender -> true/false
			Field/Study -> true/false
			Disabilities -> true/false
		Then it applies the point values for each:
```

 | If True       | mentee        | mentor 	|
 | ------------- |:-------------:| --------:|
 | high		    | +10 			| 	+5	 	|
 | low		    | +6      		|   +3 		|
 | none 		| +4     		|   +2		|

 | If False     | mentee        | mentor 	|
 | -------------|:-------------:| --------:	|
 | high		    | -6 			| 	-3	 	|
 | low		    | -4      		|   -2 		|
 | none 		| 0     		|   0	 	|

 example : 

```
 	Mentor: gender 			-> low
 			(male)
 			Field/Study 	-> high
			(Computer Science)
 			Disabilities 	-> none
 			(Physical)



	Mentee: gender 			-> high
			(male)
 			Field/Study 	-> high
 			(Design)
 			Disabilities 	-> none
 			(learning)



first we check if their information matches:


	-gender 		: True
	-Field/study 	: False
	-Disabilities: 	: False


Then we assign points based on their matching preferences:


	-gender : (true)
		mentee has high preference 	-> +10
		mentor has low preference	-> +3

	-Field/study : (false)
		mentee has high preference 	-> -6
		mentor has high preference	-> -3

	-Disabilities : (false)
		mentee has none preference 	-> +0
		mentor has none preference	-> +0


	Calculate the total (+10, +6, -6, -3)

	**This match gets a score of +7**
```

#### External Dependency/how to get set up
0. Install mongodb

The version is : 
`$ mongod --version
db version v3.2.8
git version: ed70e33130c977bda0024c125b56d159573dbaf0
OpenSSL version: OpenSSL 1.0.1p-fips 9 Jul 2015
allocator: tcmalloc
modules: none
build environment:
    distmod: 2008plus-ssl
    distarch: x86_64
    target_arch: x86_64
`
1. Make folder C:\data\db

2. Install git bash on your computer
3. Make sure node package manager is present (ex: "npm -v" should output the version number)
4. install ruby -> https://rubyinstaller.org/
5. use command "gem install sass"
6. use the command "npm install" in the project directory to pull all dependencies
7. Associate mongodb in git bash path by opening up Environment variables on windows (help: http://www.computerhope.com/issues/ch000549.htm)
7. Once open, add mongos path to the PATH section, so I appended "C:\MongoDB\bin" to the end (all new variable are seperated by a ;)
8. Use "gulp" to run everything, if the command is not found ->
Use npm install -g gulp

>we do this because the gulp file needs that path association to actually run the database

#### Testing

A crucial part of the process is to actually test out the application. We use protractor for this.

1. run `npm install -g protractor`
2. then `webdriver-manager update`
3. and (in another terminal, we need this to be always open) run `webdriver-manager start
`
4. now in a new terminal navigate to /tests, and run `protractor conf.js --suites makemm`
5. This will run an automated test. Checkout the folder to see/make new tests
6. 


