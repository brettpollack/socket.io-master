$(function() {

    // Initialize varibles
    var $coordinates;
    var pageDimensions = [$('body').width(),$('body').height()];
    $( window ).resize( function() {
        pageDimensions = [$('body').width(),$('body').height()];
    });

    // Prompt for setting a username
    var connected = false;  

    var socket = io();

    //    This piece of functionality does three things:
    //    It prints a red square when and where the user clicks
    //    It stores the click's coordinates in an object called coordinates
    //    It calls the sendSquare function

    $('#stage').click(function(e) {
        console.log(e.pageX+ ' , ' + e.pageY);
        coordinates = [e.pageX, e.pageY];
        addTappingPoint(coordinates.concat(pageDimensions));
        sendCoordinates(coordinates.concat(pageDimensions));
    });

    //    This function parses the flatten coordinates into an object again and then displays it as a square

    function addTappingPoint(final_coordinates){
        console.log(final_coordinates);
        var thisPoint = jQuery('<div/>', {
            class: 'coordinates_div pre-animate'
        }).appendTo('#stage').css( {
            "left": final_coordinates[0]*(pageDimensions[0] / final_coordinates[2]),
            "top": final_coordinates[1] * ( pageDimensions[1] / final_coordinates[3])
        });
        $(thisPoint).offset()
        $(thisPoint).removeClass('pre-animate')

        $(thisPoint).on('transitionend webkitTransitionEnd oTransitionEnd', function(e) {
            if (e.originalEvent.propertyName == 'opacity') {
                $(this).remove(); 
            }
        });
    }

    // This function flattens the coordinates object so we can send it accross and then calls addTappingPoint and the socket.emit(new coordinates) event
    function sendCoordinates (obj) {
        // if there is a non-empty message and a socket connection
        if (obj && connected) {
            socket.emit('new coordinates', obj);
        }
    }

    //NVS add a username
    socket.emit('add user', 'xyz');

    // Socket events

    // Whenever the server emits 'login', log the login message
    socket.on('login', function (data) {
        connected = true;
        // Display the welcome message
        var message = "Welcome to Socket.IO Chat – ";
    });

    // Whenever the server emits 'new coordinates', update the chat body
    socket.on('new coordinates', function (data) {
        // NVS - we receive an object back so we have to explicitly pass
        // the coordinates part of the message (ignoring username)
        if ("vibrate" in window.navigator) {
            window.navigator.vibrate(250);
        }
        addTappingPoint(data.message);
    });
});