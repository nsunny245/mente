//Controller definitions.
var psdnetAppControllers = angular.module('psdnetAppControllers', ['angular-carousel'//, '$http', '$scope', 'youtubeService', function ($http, $scope, youtubeService) {
  // youtubeService.getPlaylists(playlist).then(function (response) {
  //   $scope.$apply(function () {
  //     $scope.playlists = response.items;
  //   });
  // });

  // $scope.getPlaylistVideos = function (selection) {
  //   youtubeService.getPlaylistVideos(selection).then(function (response) {
  //     $scope.$apply(function () {
  //       $scope.playlistvideos = response.items;
  //     });
  //   });
  // }

  // $scope.getVideos = function (selection) {
  //   youtubeService.getVideos(selection).then(function (response) {
  //     $scope.$apply(function () {
  //       $scope.videos = response.items;
  //     });
  //   });
  // }
]);//}]);

//factories////////////////////////////////////////////////////////////////////////
//                                                                              //
//                                                                              //
//                              factories                                        //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////



psdnetAppControllers.factory('forumPersistenceFactory', function () {
  return {
    get() {
      console.log("getting forum persistence");
      var ForumData = angular.fromJson(sessionStorage.ForumDataValues);
      return ForumData;
    },

    set(fp, fos) {
      var ForumData = {};
      console.log("setting forum persistence");
      ForumData.forumParent = fp;
      ForumData.forumStart = fos;

      sessionStorage.ForumDataValues = angular.toJson(ForumData);
    }
  }
});

psdnetAppControllers.factory('subForumPersistenceFactory', function () {
  return {
    get() {
      console.log("getting subforum persistence");
      var subForumData = angular.fromJson(sessionStorage.subForumDataValues);
      return subForumData;
    },

    set(meta) {
      console.log("setting subforum persistence");
      var subForumData = meta;
      sessionStorage.subForumDataValues = angular.toJson(subForumData);
    }
  }
});

/* podcast/webinar factory */
var key = 'AIzaSyCMNscyJC-88AaxryJOvYcTfbQnn0S68qs';

psdnetAppControllers.factory('youtubeService', ['$http', function ($http) {

  function getPlaylists(channelId) {
    return $.get("https://www.googleapis.com/youtube/v3/playlists", { part: 'snippet', channelId: channelId, key: key, maxResults: 50 });
  }

  function getPlaylistVideos(playlistId) {

    var items = [];
    var nextPageToken = "";

    return $.get('https://www.googleapis.com/youtube/v3/playlistItems', { part: 'snippet', maxResults: 50, playlistId: playlistId, key: key }).then(function (firstResponse) {

      items = firstResponse.items;
      var numberOfPages = Math.ceil(firstResponse.pageInfo.totalResults / 50);

      for (var page = 1; page <= numberOfPages; page++) {
        $.get('https://www.googleapis.com/youtube/v3/playlistItems', { part: 'snippet', maxResults: 50, pageToken: nextPageToken, playlistId: playlistId, key: key }).then(function (response) {
          items = items.concat(response.items);
          nextPageToken = response.nextPageToken;
        });
      }

      return { "items": items, "nextPageToken": nextPageToken };
    });

  }

  function getVideos(keyword) {
    return $.get('https://www.googleapis.com/youtube/v3/search', { part: 'snippet', q: keyword, key: key, type: 'video' });
  }

  function getChannelLivestream(channelId) {
    return $.get('https://www.googleapis.com/youtube/v3/search', { part: 'snippet', channelId: channelId, eventType: 'live', type: 'video', key: key });
  }

  return { getPlaylists: getPlaylists, getPlaylistVideos: getPlaylistVideos, getVideos: getVideos, getChannelLivestream: getChannelLivestream };

}]);



//Services////////////////////////////////////////////////////////////////////////
//                                                                              //
//                                                                              //
//                              services                                        //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////

//a set of services to filter out bad words
//var badWordList = require('./localExports/badwords');

//BIG TODO, MOVE THIS SERVER SIDE!!!


// "hell"
// ["hello", "shell"]

// (?!o+), (?!s+)(?!c+)[h]+[e3]

var swearwords = [ // \b.*((?!har|embar)[a4]+[s5]{2,}|d[i1]+ck|(?!s+)[h]+[e3]+[l1]+(?!o+)).*\b, gix
  "4r5e",
  "50 yard cunt punt",
  "5h1t",
  "5hit",
  "a_s_s",
  "a2m",
  "a55",
  "adult",
  "amateur",
  "anal",
  "anal impaler   ",
  "anal leakage   ",
  "anilingus",
  "anus",
  "ar5e",
  "arrse",
  "arse",
  "arsehole",
  "aspy",
  "ass",
  "assburger",
  "ass fuck   ",
  "asses",
  "assfucker",
  "ass-fucker",
  "assfukka",
  "asshole",
  "assholes",
  "assmucus   ",
  "assmunch",
  "asswhole",
  "autoerotic",
  "b!tch",
  "b00bs",
  "b17ch",
  "b1tch",
  "ballbag",
  "ballsack",
  "bang (one's) box   ",
  "bangbros",
  "bareback",
  "bastard",
  "beastial",
  "beastiality",
  "beef curtain   ",
  "bellend",
  "bestial",
  "bestiality",
  "bi+ch",
  "biatch",
  "bimbos",
  "birdlock",
  "bitch",
  "bitch tit   ",
  "bitcher",
  "bitchers",
  "bitches",
  "bitchin",
  "bitching",
  "bloody",
  "blow job",
  "blow me   ",
  "blow mud   ",
  "blowjob",
  "blowjobs",
  "blue waffle   ",
  "blumpkin   ",
  "boiolas",
  "bollock",
  "bollok",
  "boner",
  "boob",
  "boobs",
  "booobs",
  "boooobs",
  "booooobs",
  "booooooobs",
  "breasts",
  "buceta",
  "bugger",
  "bum",
  "bunny fucker",
  "bust a load   ",
  "busty",
  "butt",
  "butt fuck   ",
  "butthole",
  "buttmuch",
  "buttplug",
  "c0ck",
  "c0cksucker",
  "carpet muncher",
  "carpetmuncher",
  "cawk",
  "chink",
  "choade   ",
  "chota bags   ",
  "cipa",
  "cl1t",
  "clit",
  "clit licker   ",
  "clitoris",
  "clits",
  "clitty litter   ",
  "clusterfuck",
  "cnut",
  "cock",
  "cock pocket   ",
  "cock snot   ",
  "cockface",
  "cockhead",
  "cockmunch",
  "cockmuncher",
  "cocks",
  "cocksuck ",
  "cocksucked ",
  "cocksucker",
  "cock-sucker",
  "cocksucking",
  "cocksucks ",
  "cocksuka",
  "cocksukka",
  "cok",
  "cokmuncher",
  "coksucka",
  "coon",
  "cop some wood   ",
  "cornhole   ",
  "corp whore   ",
  "cox",
  "crip",
  "cripple",
  "cum",
  "cum chugger   ",
  "cum dumpster   ",
  "cum freak   ",
  "cum guzzler   ",
  "cumdump   ",
  "cummer",
  "cumming",
  "cums",
  "cumshot",
  "cunilingus",
  "cunillingus",
  "cunnilingus",
  "cunt",
  "cunt hair   ",
  "cuntbag   ",
  "cuntlick ",
  "cuntlicker ",
  "cuntlicking ",
  "cunts",
  "cuntsicle   ",
  "cunt-struck   ",
  "cut rope   ",
  "cyalis",
  "cyberfuc",
  "cyberfuck ",
  "cyberfucked ",
  "cyberfucker",
  "cyberfuckers",
  "cyberfucking ",
  "d1ck",
  "damn",
  "dick",
  "dick hole   ",
  "dick shy   ",
  "dickhead",
  "dildo",
  "dildos",
  "dink",
  "dinks",
  "dirsa",
  "dirty Sanchez   ",
  "dlck",
  "dog-fucker",
  "doggie style",
  "doggiestyle",
  "doggin",
  "dogging",
  "donkeyribber",
  "doosh",
  "duche",
  "dyke",
  "eat a dick   ",
  "eat hair pie   ",
  "ejaculate",
  "ejaculated",
  "ejaculates ",
  "ejaculating ",
  "ejaculatings",
  "ejaculation",
  "ejakulate",
  "erotic",
  "fuck",
  "f u c k",
  "f u c k e r",
  "f_u_c_k",
  "f4nny",
  "facial   ",
  "fag",
  "fagging",
  "faggitt",
  "faggot",
  "faggs",
  "fagot",
  "fagots",
  "fags",
  "fanny",
  "fannyflaps",
  "fannyfucker",
  "fanyy",
  "fatass",
  "fcuk",
  "fcuker",
  "fcuking",
  "feck",
  "fecker",
  "felching",
  "fellate",
  "fellatio",
  "fingerfuck ",
  "fingerfucked ",
  "fingerfucker ",
  "fingerfuckers",
  "fingerfucking ",
  "fingerfucks ",
  "fist fuck   ",
  "fistfuck",
  "fistfucked ",
  "fistfucker ",
  "fistfuckers ",
  "fistfucking ",
  "fistfuckings ",
  "fistfucks ",
  "flange",
  "flog the log   ",
  "fook",
  "fooker",
  "freak",
  "fuck hole   ",
  "fuck puppet   ",
  "fuck trophy   ",
  "fuck yo mama   ",
  "fuck   ",
  "fucka",
  "fuck-ass   ",
  "fuck-bitch   ",
  "fucked",
  "fucker",
  "fuckers",
  "fuckhead",
  "fuckheads",
  "fuckin",
  "fucking",
  "fuckings",
  "fuckingshitmotherfucker",
  "fuckme ",
  "fuckmeat   ",
  "fucks",
  "fucktoy   ",
  "fuckwhit",
  "fuckwit",
  "fudge packer",
  "fudgepacker",
  "fuk",
  "fuker",
  "fukker",
  "fukkin",
  "fuks",
  "fukwhit",
  "fukwit",
  "fux",
  "fux0r",
  "gangbang",
  "gangbang   ",
  "gang-bang   ",
  "gangbanged ",
  "gangbangs ",
  "gassy ass   ",
  "gaylord",
  "gaysex",
  "goatse",
  "god",
  "god damn",
  "god-dam",
  "goddamn",
  "goddamned",
  "god-damned",
  "gimp",
  "gimmpy",
  "ham flap   ",
  "handicapped",
  "hardcoresex ",
  "hell",
  "heshe",
  "hoar",
  "hoare",
  "hoer",
  "homo",
  "homoerotic",
  "hore",
  "horniest",
  "horny",
  "hotsex",
  "how to kill",
  "how to murdep",
  "idiot",
  "imbecile",
  "insane",
  "invalid",
  "jackoff",
  "jack-off ",
  "jap",
  "jerk",
  "jerk-off ",
  "jism",
  "jiz ",
  "jizm ",
  "jizz",
  "kawk",
  "kinky Jesus   ",
  "knob",
  "knob end",
  "knobead",
  "knobed",
  "knobend",
  "knobhead",
  "knobjocky",
  "knobjokey",
  "kock",
  "kondum",
  "kondums",
  "kum",
  "kummer",
  "kumming",
  "kums",
  "kunilingus",
  "kwif   ",
  "l3i+ch",
  "l3itch",
  "labia",
  "lame",
  "LEN",
  "lmao",
  "lmfao",
  "looney",
  "lust",
  "lusting",
  "m0f0",
  "m0fo",
  "m45terbate",
  "ma5terb8",
  "ma5terbate",
  "mafugly   ",
  "maniac",
  "masochist",
  "masterb8",
  "masterbat*",
  "masterbat3",
  "masterbate",
  "master-bate",
  "masterbation",
  "masterbations",
  "masturbate",
  "midget",
  "mof0",
  "mofo",
  "mo-fo",
  "mongol",
  "moron",
  "mothafuck",
  "mothafucka",
  "mothafuckas",
  "mothafuckaz",
  "mothafucked ",
  "mothafucker",
  "mothafuckers",
  "mothafuckin",
  "mothafucking ",
  "mothafuckings",
  "mothafucks",
  "mother fucker",
  "mother fucker   ",
  "motherfuck",
  "motherfucked",
  "motherfucker",
  "motherfuckers",
  "motherfuckin",
  "motherfucking",
  "motherfuckings",
  "motherfuckka",
  "motherfucks",
  "muff",
  "muff puff   ",
  "mutha",
  "muthafecker",
  "muthafuckker",
  "muther",
  "mutherfucker",
  "n1gga",
  "n1gger",
  "nazi",
  "need the dick   ",
  "nigg3r",
  "nigg4h",
  "nigga",
  "niggah",
  "niggas",
  "niggaz",
  "nigger",
  "niggers ",
  "nob",
  "nob jokey",
  "nobhead",
  "nobjocky",
  "nobjokey",
  "numbnuts",
  "nuts",
  "nutter",
  "nut butter   ",
  "nutsack",
  "omg",
  "orgasim ",
  "orgasims ",
  "orgasm",
  "orgasms ",
  "p0rn",
  "pawn",
  "pecker",
  "penis",
  "penisfucker",
  "phonesex",
  "phuck",
  "phuk",
  "phuked",
  "phuking",
  "phukked",
  "phukking",
  "phuks",
  "phuq",
  "pigfucker",
  "pimpis",
  "piss",
  "pissed",
  "pisser",
  "pissers",
  "pisses ",
  "pissflaps",
  "pissin ",
  "pissing",
  "pissoff ",
  "poop",
  "porn",
  "porno",
  "pornography",
  "pornos",
  "prick",
  "pricks ",
  "pron",
  "pube",
  "pusse",
  "pussi",
  "pussies",
  "pussy",
  "pussy fart   ",
  "pussy palace   ",
  "pussys ",
  "queaf   ",
  "queer",
  "rectum",
  "retard",
  "rimjaw",
  "rimming",
  "s hit",
  "s.o.b.",
  "s_h_i_t",
  "sadism",
  "sadist",
  "sandbar   ",
  "sausage queen   ",
  "schizo",
  "schlong",
  "screwing",
  "scroat",
  "scrote",
  "scrotum",
  "semen",
  "sex",
  "sh!+",
  "sh!t",
  "sh1t",
  "shag",
  "shagger",
  "shaggin",
  "shagging",
  "shemale",
  "shit",
  "shit fucker   ",
  "shitdick",
  "shite",
  "shited",
  "shitey",
  "shitfuck",
  "shitfull",
  "shithead",
  "shiting",
  "shitings",
  "shits",
  "shitted",
  "shitter",
  "shitters ",
  "shitting",
  "shittings",
  "shitty ",
  "skank",
  "slope   ",
  "slut",
  "slut bucket   ",
  "sluts",
  "smegma",
  "smut",
  "snatch",
  "son-of-a-bitch",
  "spac",
  "spunk",
  "tard",
  "t1tt1e5",
  "t1tties",
  "teets",
  "teez",
  "testical",
  "testicle",
  "tit",
  "tit wank   ",
  "titfuck",
  "tits",
  "titt",
  "tittie5",
  "tittiefucker",
  "titties",
  "tittyfuck",
  "tittywank",
  "titwank",
  "tosser",
  "turd",
  "tw4t",
  "twat",
  "twathead",
  "twatty",
  "twunt",
  "twunter",
  "v14gra",
  "v1gra",
  "vagina",
  "viagra",
  "vulva",
  "w00se",
  "wang",
  "wank",
  "wanker",
  "wanky",
  "whoar",
  "whore",
  "willies",
  "willy",
  "wtf",
  "xrated",
  "xxx"
];

psdnetAppControllers.service('paragraph', function () {
  return {
    isGentle: function (input) {
      if (input) {
        //input = input.replace(/\s/g, '');
        var badwords = [];
        for (var i = 0; i < swearwords.length; i++) {
          var swear = new RegExp('\\b'+ swearwords[i] +'\\b', 'gi');
          if (input.match(swear)) {
            badwords.push(swearwords[i]);
          }
        }
        return badwords;
      }
    }
  };
});


//Provides data on the previous location.
//Used so we can redirect the user to the approriate page after login.
//I.E. if user came from the forum we want to redirect back to forum.
psdnetAppControllers.service('initProfileService', function ($http, $rootScope, $state) {
  //console.log("running the profile loader: ");
  return {
    loadVars: function () {
      return $http.post('/auth/refresh').then(function (res) {
        //console.log("parsing res on initProfileService");
        if (res.data) {
          $rootScope.userProfile = res.data;
          console.log("fetch profile: ", $rootScope.userProfile);
          if ($rootScope.userProfile.status === "mentee" || $rootScope.userProfile.status === "menteeSeeking"
            || $rootScope.userProfile.status === "menteeInTraining") {
            $rootScope.fullName = $rootScope.userProfile.mentee[0].firstName + " " + $rootScope.userProfile.mentee[0].lastName;
            $rootScope.timelineEvents = $rootScope.userProfile.mentee[0].timeline;
          } else if ($rootScope.userProfile.status === "mentor" || $rootScope.userProfile.status === "mentorSeeking" ||
            $rootScope.userProfile.status === "mentorInTraining") {
            $rootScope.fullName = $rootScope.userProfile.mentor[0].firstName + " " + $rootScope.userProfile.mentor[0].lastName;
            $rootScope.timelineEvents = $rootScope.userProfile.mentor[0].timeline;
          }
        } else {
          //console.log("no profile");
          $rootScope.userProfile = null;
        }
      })
    }
  }
});

psdnetAppControllers.service('checkBoxes', function ($rootScope) {
  console.log("loading checkbox items");
  // CHECKBOX STUFF
  var genderSelected = {
    Female: false
  };

  var disabilitySelected = {
    NotSpecified: true
  };

  function calculateGenderSelected() {
    return Object.keys(genderSelected).some(function (key) {
      return genderSelected[key];
    })
  }

  function calculateDisabilitySelected() {
    return Object.keys(disabilitySelected).some(function (key) {
      return disabilitySelected[key];
    });
  }

  var formData = {
    genderSelected: genderSelected,
    disabilitySelected: disabilitySelected
  }

  var otherGenderStringData = "";
  var otherDisabilityStringData = "";
  var gendersData = [
    {
      'name': 'Female',
      'read': 'Female'
    },
    {
      'name': 'Male',
      'read': 'Male'
    },
    {
      'name': 'TransFemale',
      'read': 'Trans. Female'
    },
    {
      'name': 'TransMale',
      'read': 'Trans. Male'
    },
    {
      'name': 'NonBinary',
      'read': 'Non-binary / third gender'
    },
    {
      'name': 'Fluid',
      'read': 'Gender Fluid'
    },
    {
      'name': 'Queer',
      'read': 'Genderqueer'
    },
    {
      'name': 'OtherGender',
      'read': 'Prefer to self-describe'
    },
    {
      'name': 'Undisclosed',
      'read': 'Prefer not to say'
    }
  ]

  var disabilitiesData = [
    { 'name': 'Physical' },
    { 'name': 'Hearing' },
    { 'name': 'Intellectual' },
    { 'name': 'Learning' },
    { 'name': 'Invisible' },
    { 'name': 'Communication' },
    { 'name': 'Mental' },
    { 'name': 'OtherDisability' },
    { 'name': 'PreferNotToSay' },
    { 'name': 'NotSpecified' }//placeholder, in other words
  ];

  //SELECT STUFF
  var studyData = [
    'Natural Sciences',
    'Health Sciences',
    'Humanities and Arts',
    'Engineering',
    'Social Sciences',
    'Economics/Business',
    'Policy',
    'Other Area of Study',
  ];

  var fieldData = [//first is the key data to be entered in db, after is display val, not 1:1
    { 'dbEntry': "Sciences - Biology and Physics", 'display': 'Sciences - Biology, Chemistry, Physics' },
    { 'dbEntry': "Engineering and Computer Science", 'display': 'Engineer and Computer Science' },
    { 'dbEntry': "Mathematics", 'display': 'Mathematics' },
    { 'dbEntry': "Arts and Entertainment", 'display': 'Arts and Entertainment' },
    { 'dbEntry': "Health and Medicine", 'display': 'Health and Medicine (physician, nurse, pharmacist, etc.)' },
    { 'dbEntry': "Business", 'display': 'Business (banking, marketing, sales, etc.)' },
    { 'dbEntry': "Communications", 'display': 'Communications (journalism, hospitality, etc.)' },
    { 'dbEntry': "Government", 'display': 'Government' },
    { 'dbEntry': "Industry", 'display': 'Industry' },
    { 'dbEntry': "Non‐profit", 'display': 'Non‐profit' },
    { 'dbEntry': "Education", 'display': 'Education (teacher, professor, etc.)' },
    { 'dbEntry': "Law and public policy", 'display': 'Law and public policy' },
    { 'dbEntry': "Environment", 'display': 'Environment' },
    { 'dbEntry': "Architecture, Planning and Environmental Design", 'display': 'Architecture, Planning and Environmental Design' },
    { 'dbEntry': "OtherField", 'display': 'Other Field' },
  ];

  var highestEducationData = [
    "College Certificate",
    "College Diploma",
    "Bachelor’s degree",
    "Master’s degree",
    "Doctorate degree",
    "Other Education"
  ];

  var schoolType = [
    'College',
    'Collège d\'enseignement général et professionnel (Cégep)',
    'Private Career College',
    'University',
    'Vocational/Technical Institute',
    'Other Institution Type',
  ];


  return {
    formData: formData,
    otherGenderString: otherGenderStringData,
    otherDisabilityString: otherDisabilityStringData,
    genders: gendersData,
    disabilities: disabilitiesData,
    study: studyData,
    field: fieldData,
    highestEducation: highestEducationData,
    schoolType: schoolType,

    spaceBeforeCapital: function (word) {//for formatting on tick boxes
      word = word.replace(/([A-Z])/g, ' $1').trim();
      return word;
    },

    calculateGenderSelected,
    calculateDisabilitySelected,
  }
});


psdnetAppControllers.service('previousLoc', function () {
  this.Set = function (x) {
    this.value = x;
  }
  this.Get = function () {
    return this.value;
  }
});
//Empty Controllers///////////////////////////////////////////////////////////////
//                                                                              //
//                                                                              //
//                              Controllers                                     //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////

psdnetAppControllers.controller('educationController', function ($scope, $http) {
  //*****************PAGE-BUFFER**********// 
  setTimeout($scope.PageLoaded, 0); /******/
  //*****************PAGE-BUFFER**********// 
});
psdnetAppControllers.controller('podwebController', function ($scope, $http) {
  //*****************PAGE-BUFFER**********// 
  setTimeout($scope.PageLoaded, 0); /******/
  //*****************PAGE-BUFFER**********// 
});
psdnetAppControllers.controller('learningController', function ($scope, $http) {
  //*****************PAGE-BUFFER**********// 
  setTimeout($scope.PageLoaded, 0); /******/
  //*****************PAGE-BUFFER**********// 
});
psdnetAppControllers.controller('libraryController', function ($scope, $http) {
  //*****************PAGE-BUFFER**********// 
  setTimeout($scope.PageLoaded, 0); /******/
  //*****************PAGE-BUFFER**********// 
});
psdnetAppControllers.controller('aboutController', function ($scope, $http) {
  //*****************PAGE-BUFFER**********// 
  setTimeout($scope.PageLoaded, 0); /******/
  //*****************PAGE-BUFFER**********// 
});



//Filters/////////////////////////////////////////////////////////////////////////
//                                                                              //
//                                                                              //
//                              Filters                                         //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////

//Create an array of integers for ng-options usage.
psdnetAppControllers.filter('range', function () {
  return function (input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i = min; i <= max; i++)
      input.push(i);
    return input;
  };
});


//this filter allows linking to external URL's

String.prototype.startWith = function (str) {
  return this.indexOf(str) == 0;
};

psdnetAppControllers.filter("linkFilter", function () {
  return function (link) {
    var result;
    var startingUrl = "http://";
    var httpsStartingUrl = "https://";
    if (link.startWith(startingUrl) || link.startWith(httpsStartingUrl)) {
      result = link;
    }
    else {
      result = startingUrl + link;
    }
    return result;
  }
});






//Global controller Functions/////////////////////////////////////////////////////
//                                                                              //
//                                                                              //
//                              FUNCTIONS                                       //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
//retrieves the message object for its pages.
//Path is the route from route.js, index is the page's name in the pages object, http and scope are provide by the controller.
function GetMessages(path, index, http, scope) {
  http.get(path)
    .then(function (res) {
      if (index != '') {
        scope.messages = res.data[0].pages[index];
      }
      else {
        scope.messagePile = res.data[0].pages;
      }

    });

};

  // function stageController($scope) {
  //     $scope.pw1 = 'password';
  // }

/*
  var pdfResults = null;
  $scope.uploadPDF = function(file, errFiles) {

    $scope.f = file;
    console.log(file);
    $scope.errFile = errFiles && errFiles[0];


    if(file){
      var reader = new FileReader();
      reader.onload = function(readerEvt) {
        var binaryString = readerEvt.target.result;
        pdfResults = btoa(binaryString);

      };

      reader.readAsBinaryString(file);

    }


  };
  $scope.ConfirmUpload = function(){
    if(pdfResults != null)
     $http.post('upload/pdf', {pdfResults}).then(
      function(res){
        console.log(res);
      });
 };*/