<?php
	
	//POST['url']を取得します
	
	if(array_key_exists("url", $_POST)){
		
		$context = stream_context_create(array(
			'http' => array('ignore_errors' => true)
		));
		
		$response = file_get_contents($_POST["url"], false, $context);
		
		if (strpos($http_response_header[0], '200')) {
			echo($response);
		}	
	}