function frm_send(){
	this.version = "1.0", 
	this.develop = "Desarrollador: griant.com"
}

frm_send.prototype.send = function( options ){
	// console.log( options );
	var formData = new FormData( $("#" + options.frm )[0] );
		
	$.ajax({
		url: options.action,  
		type: 'POST',
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
		beforeSend: function(){
			//$("#msgBox").html( msgLoad( 'Guardando ...' ) );
		},
		success: function( data ){				
			var array = eval("(" + data + ")");
			if(array.success == true)
			{
				// Mostramos mensajes de resultados
                $("#msgfrm").html( '<div class="alert alert-info" role="alert">'+ options.msg_success +'</div>' );
                $("#nombre").val('');
                $("#correo").val('');
                $("#telphone").val('');
                $("#conetarios").val('');
                $("#defaultReal").val('');
                $("#defaultReal2").val('');


			}
			else
			{
                $("#msgfrm").html( '<div class="alert alert-danger" role="alert">'+ array.msg +'</div>' );
			}
		},
		error: function(){
            $("#msgfrm").html( '<div class="alert alert-danger" role="alert">'+ options.msg_error +'</div>' );
		}
	});	
}
var frmSend = new frm_send;

$(".frm_send").on( "click", function(){
	var formulario = $(this).data( "idfrm" );
	var action = $(this).data( "action" );

	frmSend.send({
		frm : formulario,
		action: action,
		msg_success: 'Su mensaje se ha enviado correctamente, unos de nuestros representantes se cominicará contigo! Gracias.', 
		msg_error: 'Lo sentimos, intente de nuevo mas tarde'
	});
});