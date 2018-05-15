<?php
if($_SERVER["REQUEST_METHOD"] == "GET"){
	 
	   //$image_name = $_GET["image_name"];
	   
	   $path = "js/data.json";
	    
	  
	   //$data = file_get_contents($path);
	   $data = fopen($path, 'rb');
	    
	   //echo "<img src='$base64'/>";
	   //echo $base64;
	   // send the right headers
       header("Content-Type: text/json");
       header("Content-Length: " . filesize($path));
       
       // dump the picture and stop the script
       fpassthru($data);
       exit;
	 
	 
	   header("HTTP/1.1 200 OK", true, 200);
}
else{
	echo "bad request";
	header('HTTP/1.1 401 Unauthorized', true, 400);
}
?>