(function(window) {
    'use strict';
    var TOPIC_PANEL_PARENT = '.col-sm-9'; // parent element where the topic panels should go

    var App = window.App || {};
    var $ = window.jQuery;

    function addToSchedule(className, url = '#') {
        var parent = $('#schedule');
        //parent.find('.dropdown-menu').append('<li><a href="' + url + '">' + className + '</a></li>');
        parent.find('tbody').append('<tr><td><li>' + className + '</li></td></tr>');
    }

    function addTopic(topicText = '', username = 'Anonymous', votes = 0, voteStatus = 0, topicID = 0) {
        var topicPanel = $('#topicProto').clone();
        topicPanel.appendTo(TOPIC_PANEL_PARENT);
        topicPanel.attr('id', topicID);
        topicPanel.data({
            'topic': topicText,
            'username': username,
            'votes': votes,
            'voteStatus': voteStatus,
            'topicID': topicID
        });

        topicPanel.find('.panel-title').text(topicText);
        topicPanel.find('.panel-body').html("<i>submitted by</i> " + username);
        topicPanel.find('.count').text(votes);

        topicPanel.find('button').click(function() {
            var topicPanel = $(this).parents('.panel')
            //console.log($(this).parents('.panel'));

            var topicID = topicPanel.data('topicID');
            console.log(topicID);
            var votes = topicPanel.data('votes');
            //alert(votes);
            var voteStatus = topicPanel.data('voteStatus');
            var temp = voteStatus;

            if ($(this).hasClass('upvote')) {
                voteStatus = (voteStatus == 1) ? 0 : 1;
            } else if ($(this).hasClass('downvote')) {
                voteStatus = (voteStatus == -1) ? 0 : -1;
            } else {
                return;
            }
            $.ajax({
                type: "PUT",
                dataType: "json",
                url: "/topics/" + topicID + "?voteStatus=" + voteStatus + "&votes=" + voteStatus,
                success: function(data) {


                }
            });
            votes = votes - temp + voteStatus;
            console.log(temp + " :temp");
            topicPanel.data({
                'votes': votes,
                'voteStatus': voteStatus
            });
            updateTopicVotes(topicID);

            console.log('Voted on topic: "' + topicPanel.data('topic') + '" (ID: ' + topicID + ')\tvoteStatus: ' + voteStatus);
        });
        updateTopicVotes(topicID);
        topicPanel.show();
    }
    $(document).on('click', '#deleteTopic', function() {
        var topicPanel = $(this).parents('.panel')
        var topicID = topicPanel.data('topicID');
        removeTopic(topicID);
        console.log('Deleted topic ' + topicID);
        $.ajax({
            type: "DELETE",
            dataType: "json",
            url: "/topics/" + topicID,
            success: function(data) {}
        });

    });

    function removeTopic(topicID) {
        $(TOPIC_PANEL_PARENT).find('#' + topicID).remove();
    }


    function updateTopicVotes(topicID) {
        var topicPanel = $(TOPIC_PANEL_PARENT).find('#' + topicID);

        topicPanel.find('.count').text(topicPanel.data('votes'));
        switch (topicPanel.data('voteStatus')) {
            case 0:
                // user did not vote
                topicPanel.find('.upvote').removeClass('btn-success');
                topicPanel.find('.downvote').removeClass('btn-danger');
                break;
            case -1:
                // user downvoted this topic
                topicPanel.find('.upvote').removeClass('btn-success');
                topicPanel.find('.downvote').addClass('btn-danger');
                break;
            case +1:
                // user upvoted this topic
                topicPanel.find('.upvote').addClass('btn-success');
                topicPanel.find('.downvote').removeClass('btn-danger');
                break;
        }
    }

    function setClassName(className) {
        $('.navbar-brand').text(className);
    }

    // Topic submit modal
    $(document).on('click', '#createTopicModal .btn-primary', function() {
        var topic = $('#newTopic').val();
        var email = $('#email').val();
        if (topic == '') return;
        $('#newTopic').val('');
        console.log("Creating Topic: " + topic);
        addTopic(topic, email);
        $.ajax({
            type: "POST",
            url: "/topics",
            data: {
                topic: {
                    title: topic
                }
            },
            success: "ok",
            dataType: "script"
        });

    });

    $(document).ready(function() {

        // NOTE: Load all schedule and topic info here!

        setClassName('CPSC 473');
        var userId = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        console.log(userId + " userid");
        console.log("Loading Schedule");
        addToSchedule('CPSC 473', '/r/CPSC473');
        console.log("Loading Topics.");
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/topics",
            success: function(data) {
                var as = data;
                //sorting the topics
                if (window.location.href.indexOf("controversial") == -1) {
                    as.sort(function(a, b) {
                        var a_votes = 0;
                        for (var j = 0; j < a.topic_users.length; j++) {
                            a_votes += a.topic_users[j].votes;
                        }
                        var b_votes = 0;
                        for (var j = 0; j < b.topic_users.length; j++) {
                            b_votes += b.topic_users[j].votes;
                        }
                        return b_votes - a_votes;
                    });
                    console.log('sorting by top votes');
                } else {
                    console.log('sorting by controversial');
                    as.sort(function(a, b) {

                        var a_votes = 0;
                        for (var j = 0; j < a.topic_users.length; j++) {
                            a_votes += a.topic_users[j].votes;
                        }
                        var a_controversy = a_votes / Math.max(Math.abs(a_votes), 1);
                        console.log(a_controversy)
                        var b_votes = 0;
                        for (var j = 0; j < b.topic_users.length; j++) {
                            b_votes += b.topic_users[j].votes;
                        }
                        var b_controversy = b_votes / Math.max(Math.abs(b_votes), 1);
                        return b_controversy - a_controversy;
                    });
                }

                var voteStatus2 = 0;
                for (var i = 0; i < as.length; i++) {
                    var votess = 0;
                    var tc = as[i].topic_users.length;
                    console.log("length" + tc)
                    for (var j = 0; j < tc; j++) {
                        if (as[i].topic_users[j].user_id == userId) {
                            voteStatus2 = as[i].topic_users[j].vote_status;
                        }

                        votess = votess + as[i].topic_users[j].votes;
                    }
                    //This will load all the topics with votes
                    addTopic(as[i].title, as[i].email, votess, voteStatus2, as[i].id);
                }
            }
        });




    });


    window.addToSchedule = addToSchedule;
    window.addTopic = addTopic;
    window.removeTopic = removeTopic;
    //window.updateTopicVotes = updateTopicVotes;      // only used internally
    window.setClassName = setClassName;

})(window);
