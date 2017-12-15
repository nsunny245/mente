angular.module('psdnetAppControllers').controller('comprofilesController', function ($scope, $rootScope, $location, $anchorScroll) {
  $scope.selected = -1;
  $scope.loadProfile = function(index) {
    console.log(index);
    $('.profile-card-preview .profile-card-main-content').remove();
    if (index == $scope.selected) {
      $scope.selected = -1;
      $scope.gotoAnchorAndForget($scope.data[index].id);
    } else {
      console.log("different");
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
        // setTimeout(function() {
        //   $scope.$apply();
        // }, 0)
      }, 0);
    }
  }
  $scope.closeProfile = function() {
    var index = $scope.selected;
    $scope.loadProfile($scope.selected); //closes
    $scope.gotoAnchorAndForget("profile-card-preview-"+ index);
  }

  $scope.colorHighlights = [
    "#00C7B1",
    "#004F71",
    "#E40046",
  ];

  $scope.data = [
    {
      "id": "t-guidice",
      "name": "Tiffany Del Guidice",
      "title": "Personal Support Worker",
      "imgPath": "/Assets/Images/Community/profiles/tguidice.jpg",
      "videoPath": "",

      "quote": "",
      "currentOccupations": ["I presently work as a Personal Support Worker."],
      "weblinks": [],
      "education": ["I returned to school in 2008, and completed the Wastewater Technician program. However, the one that I am most proud of is Personal Support Worker that I completed in 2015. Both programs were at Algonquin College in Ottawa."],
      "memorableExperiences": ["What stands out the most for me was when I was introduced to the strategist, and my counsellor at the Centre for students with disabilities -both women were half my age!!! I said to myself what could these two kids teach me??? These two women were my key to success by teaching me a new ways of learning and opening new doors to technology. The rest of the team were a great influence on my learning strategies and this is what made a big difference in my schooling."],
      "roleOfDisability": ["In 2008, I was not aware of the technology that could help people with disabilities. It was like my disability was the main character and I had to learn to work with it and not against it. I felt shame and frustrated because I was not able to understand certain concepts in a math equation as an example. It would take me longer to understand it then most of the other students in class and I would have to make up cartoon characters in Math or Algebra to remember what they meant. Part of my disability is a having a short-term memory problem as I don’t have a memory. So, as a result, I would have my own language to remember certain scientific words. This would mean extra time doing homework and I would be jealous that I had to do it and my classmates did not."],
      "insights": ["Key insights for me would be not standing behind my disability like a victim but more standing in front of it and taking control of it.  Especially now that I have these technological tools which helps with my self-esteem and the ability to work at tasks on my own.  Asking for help is very courageous, necessary and one should not feel shame about this."],
      "impactOfEducation": ["At 14 I was told that I would have to live with my parents or get married because there was no future for me. This is my third time in college I enjoy going to school I’m thirsty for knowledge now that I have the proper tools and that Algonquin College has been a safe place for me to get the help that I need."],
      "future": ["In five years, I see myself as having completed my fourth college certification in palliative care and a little business course. Definitely continuously learning is on the forefront of my mind."],
    },

    {
      "id": "c-mohler",
      "name": "Chelsea Mohler",
      "title": "Research Consultant, Author and Tutor",
      "imgPath": "/Assets/Images/Community/profiles/cmohler.jpg",
      "videoPath": "",

      "quote": "",
      "currentOccupations": [
        "Research Consultant: National Educational Association of Disabled Students (NEADS)",
        "Tutor, Office for Students with Disabilities: University of Toronto",
        "Co-Author: Creating a Culture of Accessibility in the Sciences (Elsevier Publishing)"
      ],
      "education": [
        "Honours Bachelor of Arts, Wilfrid Laurier University (Brantford). Graduated in 2009",
        "Master of Science, Occupational Sciences, Western University (AKA University of Western Ontario). Graduated in 2011"
      ],
      "weblinks": ["https://ca.linkedin.com/in/mohlerc"],
      "memorableExperiences": ["I think what stands out for me about my experience when I look back, is that we, as students, really can, and do, make change.  I know it seems like an overwhelming task at times just to be a student, never mind being a student with a disability who has additional accommodation needs and barriers to face, but our advocacy efforts really do matter in mobilizing change at our institutions.  I think back to experiences during my undergraduate degree where I was the first student with vision loss on the small satellite campus.  Being a student with the goal of having a more inclusive and accessible campus put me in the unique position to effect change for other students that followed.  I know from visiting the campus since graduating, and keeping in contact with faculty, that the work I did to evoke changes towards greater inclusion continue to be implemented today."],
      "roleOfDisability": ["Someone has to be first!  For me, my disability largely contributed to my ability to be a strong self-advocate, champion, and trailblazer.  In my experience both during my undergraduate and graduate degree, I was either the “first blind student” in my institution (in the case of my undergraduate) or in my program (in the case of my Master’s).  Being first can be exciting, but it also comes with it’s share of challenges and lessons to be learned.  This might sound familiar: “I want the same as what everyone else has.” Or: “I don’t want to have to fight for my education or employment anymore.” I think for me, advocating for myself was not only something I was doing to improve my own educational experience, but I wanted to improve the journey for those students with disabilities who attended school after I did.  This being said, it isn’t the physical barriers that are the most challenging to advocate to remove (an inaccessible classroom, signs that are not in Braille, ETC), it is the attitudinal barriers that are the most difficult to ameliorate.  Because the attitudes of educators, decision-makers, and administrators shape what policies will be implemented, and where funding dollars are spent, being able to articulate the importance of a more inclusive institution is a critical skill I take with me today.  By being first, I can give back to society, pay my own success forward, mentor those who come after me."],
      "insights": ["Not everyone will get it!  Most people I encounter on a daily basis have had little to no exposure to people with vision loss, and that is no different when you get to post-secondary!  One thing I learned very early on is patience, patience, patience!  I know for myself, I was again, the “first blind person” that many of my professors and teaching assistants had ever worked with.  So, being able to explain, in plain language what my disability-related accommodations were, and how I best functioned/learned in the classroom was of utmost importance.  Honestly, I discovered some were better than others, and when it came right down to it, most really wanted to help and just didn’t know how.  So, again, being able to be patient and explain what my needs were really helped me to have a more well-rounded and positive experience."],
      "impactOfEducation": ["I know the reality is that many of us will not acquire employment without some form of training or education.  So, this is certainly exacerbated for a student with a disability.  It becomes even more critical that we gain the education that might open that door to employment.  For me, this door was opened in graduate school when I discovered my passion for research – specifically as it relates to disability and employment transition outcomes.  For me, learning that my own lived experience was something I could research, and thereby, hopefully impact others, was a huge learning.  Not to mention, of course, the skills and contacts I gained are invaluable as I move forward."],
      "future": ["I always find this question tricky to answer, because life is ever-changing, and I’m learning about new opportunities all the time.  So, for now, I’d like to go back to school.  As I mentioned earlier, I am passionate about transitions into employment for persons with disabilities, and the mentorship opportunities that go along with that transition.  I’d like to expand on this work further by returning to graduate school to complete a PHD."],
    },

    {
      "id": "f-odette",
      "name": "Francine Odette",
      "title": "Post-Secondary Education Instructor, Researcher and Author",
      "imgPath": "/Assets/Images/Community/profiles/fodette.jpg",
      "videoPath": "",

      "quote": "",
      "currentOccupations": ["I am an instructor at George Brown College in the Assaulted Women and Children’s Counsellor Advocate Program. I also am a co-teacher of the course, Disability Discourse: The Experienced Life, which I believe is the first course offered in the college system that looks at disability issues through critical disability analysis. I began working at the college in 2008 when I was working as a program manager for an organisation that centred on gender-based anti-violence work with a focus on issues pertaining to women with disabilities and Deaf women. I was at that organization for almost 9 years.  Much of my work over the last 20+ years has focused on taking a gendered perspective on issues related to disability and inclusion, and I work directly with communities of people with disabilities as well as service providers in the area of social work, health care, and the law."],
      "education": [
        "Carleton University, Masters of Social Work",
        "York University, BA in Psychology",
        "Seneca College, Social Service Worker"
      ],
      "weblinks": [],
      "memorableExperiences": ["One of the things that was the most impactful for me when I first started postsecondary education was my connection with others who live with disabilities. I remember very distinctly my first meeting with the coordinator of services for disabled students at the University that I was attending.  This coordinator also was the teacher of the only course at that time that was looking at issues of inclusion from a disability perspective. This person later became a mentor in my life. I believe what made a difference to me was that this person was someone who lived with varying impairments and was successful, which was very counter to the kinds of messages I grew up with, especially in public school and high-school.  This person was doing all the things that I believed I could do but this idea was made real to me because she was living it."],
      "roleOfDisability": ["There were many times when I was the only person living with a visible disability in whatever program or course I was registered in. I think this was a double-edged sword. On one hand I felt a lot of pressure to succeed and on the other hand I was determined to challenge the dominant discourse about the lack of expectation that college programs administrators had of students with disabilities that was present then. Also, when I was completing my Masters, there was a lot of expectation that I would know or could speak to what the issues were for others with disabilities. So, another sort of entry point for me was learning more about what other people with disabilities experienced at school, which I was not as interested in then as I am today. But it was during those earlier days of thinking about my and others’ experiences that created space for me to learn more about myself and develop more of an understanding and critique of the impact of the dominant discourses in my life, as well as the lives of others."],
      "insights": ["One key learning for me was the reality that I was often on my own in forging new connections with people who may have had little exposure to people with disabilities in their lives prior to meeting me or people who engaged with people with disabilities from a place of paternalism. As a result, I learned to engage in conversations about disability, and my life as someone with a disability, as it being about an experience as opposed to a problem.  I think this is a new idea for many people. And not everyone is going to get it, which is not always easy to sit with. I think too that I learned early that making connection was about making others’ comfortable in their own discomfort or unknowing when it came to being in relationship with someone with a disability. In University, this was particularly evident to me when I was living in residence where there were no supports in place because few students with disabilities were living in residence at that time. As a result, I learned pretty quickly how to connect with people to reduce my isolation and be part of the dormitory floor and activities. I didn’t expect to be treated differently than others and admit that my own awareness of disability advocacy and the politics of disability was not as informed as it is now. I really just wanted to be connected to my non-disabled peers who were also in my classes and who I hung out with at the end of the day."],
      "impactOfEducation": ["I think attending post-secondary education gave me the opportunity to develop my skills in connecting and engaging with people. As a result of those earlier experiences, I have learned that being in community and creating community with others is critical to me and my sense of self in the world. When I was in school, trying to go to classes and complete assignments to meet the requirements of my program, that sometimes felt hard. But it was something I needed to do to feel like I could be successful and reach my goals by the end of my school ‘career’. I think the skills that I developed in post-secondary education have made it possible for me to work in a variety of different settings where I get to focus on people and engage in meaningful communication with them and to use my abilities to work in teams and collaborate in meaningful ways. These are all things that are essential to the field of social work and now to my teaching career."],
      "future": ["I have often toyed with the thought of going back to school for my PhD.  I started out in the area of social work and now, as an educator, apply the knowledge I have gained through my work and life. There is a part of me that is very interested in creating learning opportunities for younger people with disabilities. I am not sure if continuing with my education would take me to a different place than I am now, but I would welcome the chance to create spaces where students with disabilities can talk about their experiences so that they can examine and unpack many of the negative messages that we all have grown up with that squelches what is ‘what is ‘possible’ in our lives."],
    },

    {
      "id": "e-suen",
      "name": "Elizabeth Suen",
      "title": "Graduate Student, Creative Consultant and Community Health Researcher",
      "imgPath": "/Assets/Images/Community/profiles/esuen.jpg",
      "videoPath": "",

      "quote": "I’ve learned to appreciate and nurture all of my talents and interests.",
      "currentOccupations": ["Graduate student, self-employed creative consultant and community health researcher"],
      "education": ["University of Ontario Institute of Technology"],
      "weblinks": [
        "https://ca.linkedin.com/in/elizabeth-suen-95895256/",
        "https://twitter.com/lizsuen/",
        "http://theartofexperience.ca/about/ourstudents/"
      ],
      "memorableExperiences": ["I am currently a post-secondary student, but have been in school for a while (currently finishing Master’s degree, beginning second-entry nursing program in September). I guess looking back to my undergraduate studies, something that stood out to me was finding role models and mentors who are both very successful in their field of work AND really awesome human beings. I aspire to be like them, staying grounded and genuinely passionate while living and thriving in the competitiveness that permeates the workforce. Another thing that stood out to me was finding out that I had the ability to become a student leader. Also, making friends with people from all walks of life and being pleasantly surprised that they didn’t find me to be too weird."],
      "roleOfDisability": ["I’ve had to take time off of school during my undergraduate studies due to my disability. During my undergraduate studies I was able to receive accommodations when writing tests and exams because of issues related to anxiety and depression that would be triggered in conventional testing environments. I am grateful that most of my professors were understanding regarding my needs, but a small handful of people who gave me difficulty due to their attitudes towards disability. It was a bit awkward answering questions when my classmates would ask why I didn’t write tests and exams with them. However, I feel that things have gotten better now that there is a growing awareness of mental illness and other invisible disabilities (we still have a long way to go though)."],
      "insights": ["I’ve learned to appreciate and nurture all of my talents and interests. For example, I’ve always been passionate about the visual arts and art-making. At the same time, I’ve cultivated a love for research and scholarship. As I prepare to enter nursing school I am excited to become a healthcare professional, and look forward to honing my skills and developing my practice moving forward. When I graduated from high school I thought that I had to pursue only one of these passions. However, through my post-secondary educational experiences, I have learned that I can be simultaneously be an artist, scientist, and healthcare professional. However, pursuing this path takes a lot of hard work as well as an investment of time (and money + energy)!"],
      "impactOfEducation": ["Post-secondary education has given me a vocabulary with which I can better articulate myself, and to better understanding of how power is constructed, deconstructed, and reconstructed within institutions and society. It has also provided me with opportunities to build my resume in order to compete in an increasingly competitive job market."],
      "future": ["Practicing as a registered nurse specializing in mental health (preferably geriatric or youth mental health), and starting (or in the midst of completing) a PhD."],
    },

    {
      "id": "g-wilson",
      "name": "Geoff Wilson",
      "title": "Project Coordinator, Pieces to Pathways",
      "imgPath": "/Assets/Images/Community/profiles/gwilson.jpg",
      "videoPath": "",

      "quote": "I believe that being in recovery has given me a lot of insight into my goals.",
      "currentOccupations": ["Currently, I am the project coordinator at Pieces to Pathways, a project focused on developing a peer led substance use support program for LGBTQ youth who are 16 to 29 years old in Toronto, Ontario."],
      "education": [
        "Pre-Community Services, 1 year certificate program at George Brown College",
        "Social Service Worker Diploma, George Brown College",
        "Honors Bachelor of Arts, University of Toronto, majoring in equity and sexual diversity studies."
      ],
      "weblinks": ["livingnotexisting.com"],
      "memorableExperiences": [
        "I returned to school after being out of high school for several years. Because of having lived with addiction, I had a good idea of areas I wanted to work in and people I want to work. This is the areas of substance use and mental health. What stands out for me the most is that being in recovery provided me with a clear pathway and goals for my education.",
        "In total, I was in school for about 9 years. I began with a 1 year certificate, then a diploma at college, and then entered a university program. The certificate program was flexible and allowed time to ease into school which was helpful when I began my education. This pathway allowed me to transition through my education and gave me time to reflect and learn."
      ],
      "roleOfDisability": [
        "I believe that being in recovery has given me a lot of insight into my goals. Becoming sober has provided direction and allowed me to be clear about my goals for education. My lived experiences with addiction, recovery, and sobriety has played a formative role in developing purpose and understanding. My common history and experience with others now allows me to work in meaningful and supportive ways with others dealing with addiction and I appreciate the significance of peer work. I also am always aware that I always need to stay mindful of what I am doing to stay in recovery, because “If you don’t your recovery first, you lose everything”.",
        "When I began school my memory and concentration were not good at first. I was experiencing the impact to my previous drug use.  I found I had to learn to be patient with myself, my areas of strength, and areas I needed to work on or to improve."
      ],
      "insights": ["The key insights I have taken from my education are to be patient and to stay true to what I want to do and to do everything with integrity. My work is in service, and in spirt of helping and supporting others. Also, I entered post secondary education as a mature student. This was later than others around me, such as people I went to high school with. They completed their education before me and then went on to other areas of their lives. I was dealing with addiction and recovery. I learned we are all on our own journey and not to compare myself to others."],
      "impactOfEducation": ["Post secondary education has afforded me opportunities and privilege to what I am doing today. I realized that I have many skills and abilities that allow me to engage in different environments and with various people effectively. In my work, I have to be able to be able to present myself across different environments and people, and I do this while staying true to who I am and being myself. I am able to be open about my experiences with addiction, recovery, and sobriety, and can draw on my experiences to help others. By going to school and opening up possibilities, I also have created a narrative that contradicts the often usual narrative of addicts who end up dead or in jail."],
      "future": ["I see myself continuing to work with Pieces to Pathways, that this socially valuable program will gain full time permeant funding that allows the program to expand its scope. I also planned to enter a Masters of Social Work program."],
    },

    {
      "id": "r-rozinskis",
      "name": "Russell Rozinskis",
      "title": "Social Support Worker and Graduate student",
      "imgPath": "/Assets/Images/Community/profiles/rrozinskis.jpg",
      "videoPath": "",

      "quote": "",
      "currentOccupations": ["Social Support Worker with Community Living Toronto, Student in Ph.D. in Critical Disability Studies, York University"],
      "education": [
        "York University - Honours Bachelor of English",
        "George Brown College – Social Service Worker Diploma",
        "York University – Masters of Critical Disability Studies"
      ],
      "weblinks": [],
      "memorableExperiences": [
        "Anxiety and feeling unsupported. There is a bubble that surrounds post-secondary education that insulates itself from the world, even though it somehow has a lot of power and influence in the world. The anxiety stems from this unwritten culture that exists where you need to find your life-long friends/soul mates, get the best job, and understand that education is actually more of a brand then a place that leads to a career. For example, during my two years at George Brown College, the only qualifications I had for both of my placements was the fact that I was a student at George Brown. The brand of George Brown meant something to places I was applying to do my placement. I regularly heard comments like “George Brown students just seem to be ‘with it’ more than students from other colleges.” I applied to some of those other Colleges, and the entrance requirements into similar programs to the one I took at George Brown is basically the same. I chose George Brown because of location. No joke, some of the other placement students from other colleges had a much better handle of their placement than I did.",
        "This is where the unsupported part comes in. A lot of the professional development side is self-driven under the name of the post-secondary institution. Academia is a white-collared world, so unless you have experience in that type of world (which probably most students do not), it is a strange new world. Many academic, I will term “customs”, are foreign. In many workplaces, there is a work culture that is understood and for new hires there is a process of teaching these customs. In academia, there is little emphasis on this. I am sure there are faculty and staff who are able to help out, but it is easy to feel annoying when you have questions like “How long should I wait for an email response from a professor before I should email again” or “How do I tell someone I don’t want to work with that I don’t want to work with them on a project?”    Another example of feeling unsupported is when I was at George Brown, most of the work going into finding a placement was done by us students. I get that it is part of the experience, but I am paying to get a job. The general discourse on finding a job is that if you have to pay or invest financially into a job before you are hired, then you probably should not do it."
      ],
      "roleOfDisability": ["The bipolar played a role into making me feel like I was: a) too different to make meaningful friendships, b) that all my professors were annoyed or did not like me for one reason or another, c) that I was constantly saying or writing the wrong things and somehow I am going to get into some hypothetical “trouble,” and d) the fear that at any second I could have a break from “reality” resulting in failing my studies thus without post-secondary education I would never amount to anything in life. Therefore, I have spent the majority of my post-secondary education not making friends, being alone, being scared and anxious, and having horrible sleep patterns. I never got involved with anything to do with school and have only recently (at the level of my Masters) made a few friends from post-secondary education programs I have attended."],
      "insights": ["Post-secondary has gone from being a privilege to something that is necessary in our society. It has this status of being a privilege, but really, you sort of need it to get a job almost anywhere. It appears post-secondary institutions have not figured this out yet. They operate with the attitude that you the student are there because you are privileged and know how things work in this white-collar upper class world. When in truth, most jobs want some sort of post-secondary education, meaning post-secondary education is a necessity. Students are not rich, not versed in upper class white-collar life, and don’t have a clear path (or even idea) where they want post-secondary education to lead them. They just know they need it. Classmates that seem to do be the most engaged and most “successful” seem to be those who have family or friends involved with higher education and are able to form a solid circle of like-minded classmates."],
      "impactOfEducation": ["I have a lot of ideas. Non-stop ideas. Post-secondary educated has given me a place to put all those ideas in a meaningful way, instead of having to hold them in or feel unfulfilled. I suspect without school I would be a lot less motivated in life. Also, with my social woes, at least post-secondary education gives me a class to attend where there is a potential social interaction. So, in a sense, it has kept me from feeling totally isolated in the world and totally alone."],
      "future": ["I am the worst with a five-year plan thing. I usually just go with the flow. I plan on having my Ph.D. completed by then so hopefully some awesome teaching job in post-secondary education."],
    },
  ];
});
