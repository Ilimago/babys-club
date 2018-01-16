//Sort random function
function random(owlSelector){
    owlSelector.children().sort(function(){
        return Math.round(Math.random()) - 0.5;
        }).each(function(){
          $(this).appendTo(owlSelector);
        });
    }     
    $(document).ready(function() {
      $("#owl-demo").owlCarousel({
        itemsCustom : [
        [0, 2],
        [450, 4],
        [600, 5],
        [700, 6],
        [1000, 8],
        [1200, 8],
        [1400, 8],
        [1600, 8]
        ],
        navigation: true,
        autoPlay: true,
        pagination: false,
        beforeInit : function(elem){
          random(elem);
        }   
    });
});


