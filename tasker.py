import sys
from pymongo import MongoClient


#mongodb stuff, grab the db
client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.test
userProfiles = db.userprofiles
#endmongo stuff

usersNames = []
usersEmail = []
parseArg = sys.argv[1:]
cursor = userProfiles.find().sort("since", -1)

for record in cursor:
    usersNames.append(record["username"])
    usersEmail.append(record["email"])


def become_verified():
    userProfiles.update_one(
        {"username": usersNames[0]},
        {
            "$set": {
                "status": "verified"
            }
        }
    )


def helper():
    print ('-vl to verify the latest created user')
    print ('-l to get info on the latest created user')

if not parseArg:
    print('You need to provide arguments')
    helper()

if parseArg.__contains__("-vl"):
    print("verifying latest user..." + usersNames[0])
    become_verified()

elif parseArg.__contains__("-l"):
    print("displaying latest user..." + usersNames[0])
    print ("email is " + usersEmail[0])

else:
    print ("invalid options")


