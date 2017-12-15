angular.module('psdnetAppControllers').controller('chatController', function($scope, $interval, $http, $rootScope){

    $scope.activeChats = [];

    $scope.assignees = {
      'current': [],
      'past': []
    }

    //setting current assignees
    let isMentee = $rootScope.userIsMentee();
    if (isMentee) {
      $scope.assignees.current = [$scope.myAssignee];
    } else {
      $scope.assignees.current = $scope.myAssignee;
    }
    //setting past assignees
    $http.get('/retrievePastProfileInfo').then(function (res) {
      console.log("profile",res);
      if (res.status !== 401) {
        $scope.assignees.past = res.data;
      }
    });


    $scope.newChatPost = '';
    $scope.currentDate = Date.now();
    $scope.ChatAuth = function(pass){
      console.log("passing");
      $http.post('/chat/login',{email : $rootScope.userProfile.email ,password: pass}).then(function(res){
        $rootScope.chatAuthorized = res.data;
        $scope.UpdateChat();
        $scope.currentDate = Date.now();
        // $scope.resizeChat();
        // $scope.setActiveDefault();
      });
    };

    var desktop = window.matchMedia('(min-width: 48em)');
    desktop.onchange = function(){
      if (desktop.matches) {
        $('.chat-main, .channels').show();
        $scope.resizeChat();
        $scope.setActiveDefault();
      } else {
        if ($('.tab-chat.active').length > 0) {
          $('.channels').hide();
        } else {
          $('.chat-main').hide();
        }
      }
    };
    $scope.setActiveDefault = function() {
      console.log("setActiveDefault");
      if (desktop.matches) {
        var channelTabs = $('.chat-tab');
        if (channelTabs.filter('.active').length == 0) {
          if (channelTabs.length > 1) {
            $(channelTabs[0]).addClass('active');
          } else {
            channelTabs.addClass('active');
          }
        }
      }
    };


    $scope.visibleChats = [true,false,false,false];
    $scope.tabChat = function(index, enterChat = true, chatCTN = null){
      //if (false == $scope.visibleChats[index]) {

        if (chatCTN !== null) {
          $scope.activeChats = chatCTN;
        }

        $scope.visibleChats = [false,false,false,false];
        $scope.visibleChats[index] = true;

        if (enterChat && ! desktop.matches) {
          $('.chat-main').show();
          $('.channels').hide();
          $(window).scrollTop(0);
          $scope.resizeChat();
        }
        index++;
        var tab = $('.chat-tab:nth-of-type('+index+')');
        tab.addClass('active')
        .siblings('.chat-tab').removeClass('active');
      /*} else {
        index += 2;
        var tab = $('.chat-tab:nth-of-type('+index+') button');
        tab.addClass('active')
        .parent().siblings().find('button').removeClass('active');
      }*/
    };
    $scope.returnToChannels = function() {
      if (!desktop.matches) {
        $('.chat-main').hide();
        $('.channels').show();
      }
    };
    $(window).bind('load', function(){
      $scope.resizeChat();
    });
    $(window).on('resize', function(){
      $scope.resizeChat();
    });
    $scope.resizeChat = function() {
      var chat = $('.chat-main');
      var channels = $('.channels');
      if (chat.is(':visible') || channels.is(':visible') && desktop.matches) {
        var offset = $('.dash').height() + $('.navbar-brand').height();
        var height = $(window).height() - offset;
        /*if (desktop.matches) {
          console.log('desktop');
          chat.height("");
        } else*/ if (chat.is(':visible')/* && !window.matchMedia('(min-width:60em)').matches*/) {
          //var maxHeight = chat.css('max-height');
          //if (height < maxHeight) {
            chat.height(height);

          /*} else if (chat.height() < maxHeight) {
            chat.height(maxHeight);*/
          //}
        }
        /*if (channels.is(':visible')) {
          if (desktop.matches) {
            channels.height(height);
          } else {
            channels.height("auto");
          }
        }*/
      }
    }

    $scope.MatchSender = function(sender){
        return sender == $scope.userProfile.email;
    };
    $scope.PostChat = function(chatIndex, newMessage){
        if(newMessage === '' || newMessage === undefined){return;}
        if($scope.userProfile.status === 'mentee')
        {

            $http.post('chat/Post', {   'mentee': $scope.userProfile.email,
                                        'mentor': $scope.userProfile.mentee[0].mentor,
                                        'chatIndex': chatIndex,
                                        'message' : {'sender': $scope.userProfile.mentee[0].firstName + " " + $scope.userProfile.mentee[0].lastName,
                                                     'content': newMessage,
                                                     'status': 'new',
                                                      'flag': 'none'}}).then(function(res){
                                                        $scope.UpdateChat();
                                                     });

           $scope.newChatPost = '';
        }
        else if($scope.userProfile.status === 'mentor' || $scope.userProfile.status === 'mentorFull')
        {

            $http.post('chat/Post', {   'mentee': $scope.activeChats.mentee,
                                        'mentor': $scope.userProfile.email,
                                        'chatIndex': chatIndex,
                                        'message' : { 'sender': $scope.userProfile.mentor[0].firstName + " " + $scope.userProfile.mentor[0].lastName,
                                                      'content': newMessage,
                                                      'status': 'new',
                                                      'flag': 'none'}
                                          }).then(function(res){
                                                        $scope.UpdateChat();
                                        });


          }

          $scope.newChatPost = '';
    };
    $scope.MarkAsRead = function(msgIndex, chatIndex, sender, isNew){
        if(isNew != 'new')
        {
          return;
        }
        if(sender != $scope.userProfile.email)
        {

            $http.post(  'chat/MarkAsRead',
                  {'chatid': $scope.$parent.chatid,
                    'msgIndex': msgIndex,
                    'chatIndex': chatIndex
                  }
                  ).then(function(res){
                $scope.UpdateChat();
              });

            }
    };
    //var chatStatus = [8];
    $scope.ChatTyping = function(chatIndex, content, menteeIndex){
/*      console.log(content);
      var newStatus;
      if(content === ''){
        newStatus = 'online';
      }
      else{
        newStatus = 'typing';

      }
      if(chatStatus[chatIndex] != newStatus){
        chatStatus[chatIndex] = newStatus;
        $http.post('/chat/updateStatus', { 'status': chatStatus[chatIndex], 'chatID': chatIndex, 'menteeIndex' : menteeIndex });
      }
*/
    };



    $scope.hideChannelGroups = function(meta) {
      for (let i=0; i<meta.length; ++i) {
        meta[i] = false;
      }
    }

  });
