angular.module('psdnetAppControllers').controller('comnarrativesController', function ($scope, $rootScope, $location, $anchorScroll) {
  $scope.selected = -1;
  $scope.loadNarrative = function(index) {
    console.log(index);
    $('.profile-card-preview .profile-card-main-content').remove();
    if (index == $scope.selected) {
      $scope.selected = -1;
      $scope.gotoAnchorAndForget($scope.data[index].id);
    } else {
      $scope.selected = index;
      setTimeout(function() {
        $('.profile-card-main-content')
          .removeAttr('id')
          .clone()
          .insertAfter('.profile-card-preview:nth-child('+parseInt(index+1)+') .profile-card-preview-content')
          .find('.profile-card-img, .profile-card-name').remove();
        if (window.matchMedia("(min-width:30em)").matches) {
          $scope.gotoAnchorAndForget("profile-card-main");
        } else {
          $scope.gotoAnchorAndForget($scope.data[index].id);
        }
        setTimeout(function(){
          $('video')[0].play();
        });
        // setTimeout(function() {
        //   $scope.$apply();
        // }, 0)
      }, 0);
    }
  };
  $scope.closeNarrative = function() {
    var index = $scope.selected;
    $scope.loadProfile($scope.selected); //closes
    $scope.gotoAnchorAndForget("profile-card-preview-"+ index);
  };

  $scope.getVideoSrc = function(index) {
    var url = $scope.data[index].videoPath;
    console.log(url);
    return $sce.trustAsResourceUrl(url);
  }

  $scope.colorHighlights = [
    "#00C7B1",
    "#004F71",
    "#E40046",
    // "#232323",
  ];

  $scope.data = [
    {
      "id": "s-jama",
      "name": "Sarah Jama",
      "title": "Master of Arts Student at McMaster University",
      "imgPath": "/Assets/Images/Community/narratives/sjama.jpg",
      "videoPath": "/Assets/Videos/narratives/sjama.m4v",
      "bio": "Sarah Jama is completing a Master of Arts in Social Psychology at McMaster University in Hamilton, Ontario. In her academic career, Sarah has been very active member of the campus community. As a member of the Student Representative Assembly, Social Sciences Caucus and their Abilities Coordinator she has advocated for student rights and worked to address a variety of student issues on campus. Since 2014, Sarah has been the Ontario Director of National Educational Association of Disabled Students (NEADS). Sarah plans to continue her activism work upon graduation and is considering continued studies in critical disability studies and law.",
      "learnLinks": [
        "https://ca.linkedin.com/in/sarahjama"
      ],
    },
    {
      "id": "n-faba",
      "name": "Neil Faba",
      "title": "Communications Consultant",
      "imgPath": "/Assets/Images/Community/narratives/nfaba.jpg",
      "videoPath": "/Assets/Videos/narratives/nfaba.m4v",
      "bio": "Neil Faba completed his Bachelor of Journalism at Carlton University in Ottawa, Ontario in 2001. He worked in publishing for more than a decade as an editor and writer, before switching to communications consulting. Since 2013, he has been a Communication and Change Consultant for the Canadian firm Eckler Ltd. Neil also worked for a number of years as a researcher and consultant for the National Educational Association of Disabled Students (NEADS).",
      "learnLinks": [
        "https://www.linkedin.com/in/neilfaba"
      ],
    },
    {
      "id": "m-sukhai",
      "name": "Dr. Mahadeo Sukhai",
      "title": "Cancer Researcher and Science Literacy and Higher Education Advocate",
      "imgPath": "/Assets/Images/Community/narratives/msukhai.jpg",
      "videoPath": "/Assets/Videos/narratives/msukhai.m4v",
      "bio": "Dr. Mahadeo Sukhai is an experienced team leader in cancer research focused on innovative and ground-breaking work in clinical genomics and variant interpretation, molecular diagnostics, translational drug development, and hematology/oncology. The world’s first blind cancer researcher, Dr. Sukhai holds a PhD in Medical Biophysics from the University of Toronto. In addition to his scientific research, Dr. Sukhai has a strong interest in higher education and science education, particularly related to the quality of and access to higher education and scientific training programs by students with disabilities. He is a mentor for numerous students and engaged in research and publishing activities in this area. Throughout his substantial volunteer leadership career, he also has greatly contributed to a variety of not-for-profit and charitable organizations, including the National Educational Association of Disabled Students (NEADS) and the Canadian National Institute for the Blind, where he is currently a senior Board member. Dr. Sukhai is lead author of a forthcoming book, Creating a Culture of Accessibility in the Sciences, and is a leader in developing the dialogue around accessibility in science education.",
      "learnLinks": [
        "https://ca.linkedin.com/in/mahadeo-sukhai-19735817"
      ],
    },
    {
      "id": "m-graham",
      "name": "Melissa Graham",
      "title": "Community Activist and Organizer",
      "imgPath": "/Assets/Images/Community/narratives/mgraham.jpg",
      "videoPath": "/Assets/Videos/narratives/mgraham.m4v",
      "bio": "Melissa Graham is a community activist and organizer. She has authored numerous articles and blogs about issues impacting the disability community. Melissa completed a Master of Social Work with a concentration is social justice at the University of Toronto in 2010. Since, 2012, she has been a Community Facilitator of the Direct Funding Self-Managed Attendant Services program at the Centre for Independent Living (CILT) in Toronto. Through over a decade of community engagement, Melissa has made significant contributions within the disability community and beyond. Her volunteer work has included being a member of Citizens with Disabilities Ontario and a Disability, Access and Inclusion Advisory Committee Member for the City of Toronto. She is also one of the founders and organizers of the Toronto Disability Pride March.",
      "learnLinks": [
        "https://www.linkedin.com/in/melissa-graham-2b053a19"
      ],
    },
    {
      "id": "c-champagne",
      "name": "Chawana Champagne",
      "title": "Creative Marketing and Graphic Designer",
      "imgPath": "/Assets/Images/Community/narratives/cchampagne.jpg",
      "videoPath": "/Assets/Videos/narratives/cchampagne.m4v",
      "bio": "Chawana Champagne is a creative marketing and graphic designer who has worked with wineries, municipalities, and not-for-profit organizations. Through volunteering, she also has contributed her skills in communications and fundraising for local organizations and events. Chawana began her post-secondary education studying marketing at Niagara College in Niagara on the Lake, Ontario in 1999. She received an Honors Diploma in Graphic Design in 2013 and a postgraduate Diploma in Public Relations from Mohawk Collage in Hamilton Ontario. Today, she is the design and marketing manager for Nickel Brook Brewing Company and a provisional member of Registered Graphic Designers of Ontario (RGD). Chawana has increasingly become interested in designing for inclusivity, and presented her ideas and story as a guest speaker at the RGD’s Design Educators Conference in Toronto in 2015.",
      "learnLinks": [
        "https://www.linkedin.com/in/chawana-champagne-431b875b",
        "http://www.realbold.media/portfolio_item/chawanas-story/"
      ],
    },
    {
      "id": "s-stonier",
      "name": "Sarah Stonier",
      "title": "Registered Nurse working at Ottawa's Children's Treatment Centre",
      "imgPath": "/Assets/Images/Community/narratives/sstonier.jpg",
      "videoPath": "/Assets/Videos/narratives/sstonier.m4v",
      "bio": "Sarah Stonier is a registered nurse and, since 2012, has worked at the Ottawa Children’s Treatment Centre in respite services for medically fragile or technologically dependent children and youth, and their families. She completed her Bachelor of Nursing at the University of New Brunswick in 2010. Sarah is outspoken about her experiences of disability in post-secondary education and self-advocacy in the field of healthcare. She presented on these topics at the National Educational Association of Disabled Students (NEADS) national conference in Ottawa in 2008 and Halifax Job Search Strategies Forum in 2009.",
      "learnLinks": [
        "https://ca.linkedin.com/in/sarah-stonier-b29b8b21",
        "http://www.neads.ca/en/about/projects/jss/halifax2009_report_Stonier.php"
      ],
    },
    {
      "id": "r-malhotra",
      "name": "Dr. Ravi Malhotra",
      "title": "Associate Professor, Researcher and Author",
      "imgPath": "/Assets/Images/Community/narratives/rmalhotra.png",
      "videoPath": "/Assets/Videos/narratives/rmalhotra.m4v",
      "bio": "Dr. Ravi Malhotra is an Associate Professor in the Faculty of Law at the University of Ottawa where he has worked since 2006. He has earned a number of degrees, including a Bachelor of Arts focused on political science and legal studies from Carleton University in 1994, a Bachelor of Law from the University of Ottawa in 1998, and a Master of Arts focused on international relations and affairs from Carleton University in 1999.  His postgraduate law degrees include a Master of Laws from Harvard Law School in Cambridge, Massachusetts in 2002 and a Doctor of Juridical Science from the University of Toronto in 2007.  His primary research interests are in labor and employment law, human rights, globalization and disability rights. As a researcher and author, Dr. Ravi Malhotra has published articles in a number of journals and book chapters, and has also co-authored Exploring Disability Identity and Disability Rights through Narratives: Finding a Voice of Their Own. He is a member of the Human Rights Committee of the Council of Canadians with Disabilities.",
      "learnLinks": [
        "https://www.linkedin.com/in/ravi-malhotra-15576069"
      ],
    },
    {
      "id": "k-foster",
      "name": "Kai Foster",
      "title": "Teacher and Master of Social Work Candidate",
      "imgPath": "/Assets/Images/Community/narratives/kfoster.jpg",
      "videoPath": "/Assets/Videos/narratives/kfoster.m4v",
      "bio": "Kai Foster received a Diploma in the Early Childhood Education program at Algonquin College in 2009, followed by a Bachelor in Child Studies with a minor in Women and Gender Studies in 2014 and a Bachelor of Social Work in 2016 at Carleton University in Ottawa, Ontario. Their academic areas of interests include queer studies, indigenous studies, women and gender studies, intersectionality, people with disabilities, and children and youth. As a life-long learner, Kai plans to enter the Master of Social Work program at Carleton University in 2016. Working concurrently while being a student, Kai is a supply teacher in Early Year Centres for the City of Ottawa and does respite care for children with special needs. Kai enjoys spending time with friends, family, their partner and dog Charlie.",
      "learnLinks": [],
    },
  ];

});
