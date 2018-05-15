<?php 
        if($_SERVER['HTTP_HOST'] != "publicz.raileurope.com"){ //this is to make work in development env
          require('../../wp-blog-header.php');
		  include('../../wp-content/themes/hestia/header.php'); ///wp-content/themes/hestia
		  //get_header();
		}
		
		
		if($_SERVER['HTTP_HOST'] == "publicz.raileurope.com"){ //this is to make work in development env
		     
			echo  '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
				   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
				   <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
				   <script type="text/javascript" src="https://d3js.org/d3.v3.js"></script>';
		}
		else {
			echo  '<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
				   <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
				   <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
				   <script type="text/javascript" src="http://d3js.org/d3.v3.js"></script>';
		}
?> 

 

<?php
 
 get_header();
 echo "<br/><br/><br/>";
  
?>

<?php
if ( !current_user_can( 'administrator' ) && !current_user_can( 'editor' ) ){
    echo "<br/><br/><br/><br/><h1>Access Denied!! Please login as admin to edit the host data.</h1>";
	return;
}
else{
echo "<br/><br/><br/><br/><h1>Access Success!! .</h1>";
	return;
}
?> 



  
 
<?php 
    if($_SERVER['HTTP_HOST'] != "publicz.raileurope.com"){ //this is to make work in development env
        get_footer(); 
	}
 ?>
