//function that displays the available start points according to the route's chosen direction
$(document).ready(function(){
    $("#dir").change(function() {
        var parent = $(this).val(); 
        switch(parent){ 
            case 'north':
                $("#7").hide();
                $("#1").show();
                break;
            case 'south':
                $("#7").show();
                $("#1").hide();
                break;              
        }
    });
});