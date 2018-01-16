<?php
	if( empty( $_POST['nombre'] ) ){
		$_asistent['msg'] = 'Falta ingresar tu nombre.';
		$_asistent['success'] = flase;
		echo json_encode($_asistent);
		die();
	}
	else if ( !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ){
		$_asistent['msg'] = 'Proporciona un email válido.';
		$_asistent['success'] = flase;
		echo json_encode($_asistent);
		die();
	}
	else if( empty( $_POST['comentarios'] ) ){
		$_asistent['msg'] = 'Nos interesa saber tus comentarios, favor de proporcionarlos.';
		$_asistent['success'] = flase;
		echo json_encode($_asistent);
		die();
	}
	else{
		$captcha = md5(strtoupper($_POST['defaultReal']) . 'griant');
		if ($captcha == $_POST['realpersonhash']) {
			$envia_mail = true;
			$_asistent['msg'] = 'Captcha Valido';
			$_asistent['success'] = true;
			// Envio de email
			$data['mensaje'] = '<h2>Datos del contacto</h2><br>
						<br><strong>Nombre: </strong> '.($_POST['nombre']).'
						<br><strong>E-mail: </strong> '.($_POST['email']).'	
                        <br><strong>Tel: </strong> '.($_POST['telphone']).'
                        <br><strong>Giro del negocio: </strong> '.($_POST['giro']).'
						<br>
						<strong>Comentario: </strong><br>
						<p style="text-align:left">'.($_POST['comentarios']).'</p>
						';

			$de = $_POST['email'];        
			$para  = 'info@protagonbusiness.com';
			$asunto = 'Quiero asistir a BNI';		 

			$mensaje = load_page('templete/formato.html');
			$_REPLACE['MENSAJE'] = $data['mensaje'];
			$mensaje = replace($mensaje,$_REPLACE);

			$cabeceras  = 'MIME-Version: 1.0' . "\r\n";
			$cabeceras .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
			 
			$cabeceras .= 'From: Quiero asistir a BNI <'.$de.'>' . "\r\n";

			if($envia_mail){
				if( mail($para, $asunto, $mensaje, $cabeceras) ){
					$_asistent['msg'] = 'Se ha enviado su información con exito!';
					$_asistent['success'] = true;
					echo json_encode($_asistent);
					die();
				}else{
					$_asistent['msg'] = 'Ha ocurrido un error!. Intentalo mas tarde.';
					$_asistent['success'] = false;
					echo json_encode($_asistent);
					die();
				}
				
			}
		}
		else{			
			$_asistent['msg'] = 'Captcha incorrecto.';
			$_asistent['success'] = flase;
			echo json_encode($_asistent);
			die();
		}
		
	}


	function replace($template,$_DICTIONARY){
		foreach ($_DICTIONARY as $clave=>$valor) {
			$template = str_replace(':'.$clave.':', $valor, $template);
		}		
		return $template;
	}

	function load_page($page){
		return file_get_contents($page);
	}
?>