function reportes(){
    var ini = $(".fech_ini").val();
    var fin = $(".fech_fin").val();
    if (ini=='')  {
        $("#falini").html('<div class="alert alert-danger alert-dismissable">'+
                                '<i class="fa fa-arrow-up"></i>'+
                                '<b> </b> Campo obligatorio </div>' );
    }else if (fin=='') {
        $("#falini").html('');
        $("#falfin").html('<div class="alert alert-danger alert-dismissable">'+
                                '<i class="fa fa-arrow-up"></i>'+
                                '<b> </b> Campo obligatorio </div>' );
    }else{
        $("#falfin").html('');
        var opciones = "width=1200, height=600, scrollbars=NO";
        window.open("reportes.php?ini="+ini+"&fin="+fin,"Reportes Leads", opciones);   
    }
     
}

function login(){
    var formData = new FormData($("#form_login")[0]);
    $.ajax({
        url: 'ctrl/login.ctrl.php',  
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function(){
            $("#men_login").html( msgLoad( 'Verificando ...' ) );
        },
        success: function( data ){
            var array = eval("(" + data + ")");
            if(array.success == true){
                $("#men_login").html( msgInfo( array.msg ) );
                setTimeout(function(){ 
                    $("#login").removeClass("block");
                    $("#login").addClass("none");
                    $("#datos").removeClass("none");
                    $("#datos").addClass("block");
                }, 2000);
            }else{
                $("#men_login").html( msgError( array.msg ) );
            }
        }
    });     
}

function salir(){
    var r = confirm( 'Estas a punto de salir, Aceptar para continuar!' );
    if (r){
        $.ajax({
            url: 'ctrl/salir.ctrl.php',
            success: function(){                
                setTimeout(function () {
                    location.reload();
                }, 0500);
            }
        });
    }
}

function save(){
    var formData = new FormData($("#form_datos")[0]);
    $.ajax({
        url: 'ctrl/save.ctrl.php',  
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function( data ){
            var array = eval("(" + data + ")");
            if(array.success == true){
                $("#mensaje").html( msgInfo( array.msg ) );
                setTimeout(function(){ 
                    location.reload();
                }, 1000);
            }else{
                $("#mensaje").html( msgError( array.msg ) );
            }
        }
    });     
}

function Delete( user_id ){
    var r = confirm( 'Estas a punto de elimiar este registro, Aceptar para continuar!' );
    if (r){
        $.ajax({
            url: 'ctrl/delete.ctrl.php',
            type: 'POST',
            data: param({
                    "user_id" : user_id
                }),
            success: function( data ){  
                var array = eval("(" + data + ")");
                setTimeout(function(){ 
                    location.reload();
                }, 500);
            }
        });
    }
}

function Add( user_id ){
    $.ajax({
        url: 'ctrl/add.ctrl.php',
        type: 'POST',
        data: param({
                "user_id" : user_id
            }),
        success: function( data ){  
            var array = eval("(" + data + ")");
            if(array.success == true){
                setTimeout(function(){ 
                    location.reload();
                }, 500);
            }
        }
    });
}

function Quitar( envio_id ){
    $.ajax({
        url: 'ctrl/quitar.ctrl.php',
        type: 'POST',
        data: param({
                "envio_id" : envio_id
            }),
        success: function( data ){  
            var array = eval("(" + data + ")");
            if(array.success == true){
                setTimeout(function(){ 
                    location.reload();
                }, 500);
            }
        }
    });
}

function msgError(msg, titulo) {
    var tit = ( titulo == '' )? '' : ' ';
    return '<div class="alert alert-danger alert-dismissable">'+
                '<i class="fa fa-exclamation-triangle"></i>'+
                '<b>' + tit + '</b> '+ 
                msg + 
            '</div>';
}

function msgInfo(msg, titulo) {
    var tit = ( titulo == '' )? '' : ' ';
    return '<div class="alert alert-info alert-dismissable">'+
                '<i class="fa fa-info"></i>'+
                '<b>' + tit + '</b> '+ 
                msg + 
            '</div>';
}

function msgLoad( leyenda ) {
    var text = '';
    if( leyenda != '' ) {text = '<p style="font-size:10px;">' + leyenda + '</p>';}
    else {text = '';}
    return '<center>' + text + '<img src="reseñas/11.gif" id="msgLoad" /></center>';
}

function param(a){
    var parametros = '';
    $.each(a, function(key, val){
        parametros = parametros + key + '=' + val + '&';
    });
    return parametros;
}