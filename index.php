<?php 
        if($_SERVER['HTTP_HOST'] != "publicz.raileurope.com" || $_SERVER['HTTP_HOST'] == "localhost"){ //this is to make work in development env
          require('../../wp-blog-header.php');
		  include('../../wp-content/themes/hestia/header.php'); ///wp-content/themes/hestia
		  //get_header();
		}
		
		
		if($_SERVER['HTTP_HOST'] == "publicz.raileurope.com" || $_SERVER['HTTP_HOST'] == "localhost"){ //this is to make work in development env
			echo  '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
				   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
				   <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
				   <script type="text/javascript" src="https://d3js.org/d3.v3.js"></script>
				   <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"></script>';
				   //function current_user_can($dummy){return true};
		}
		else{
			echo  '<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
				   <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
				   <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
				   <script type="text/javascript" src="http://d3js.org/d3.v3.js"></script>
				   <script src="http://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"></script>';
		}
		
		//Hack to work out of wordpress
		function current_user_can($role){
			return true;
		}
		function wp_login_url($dummy){return "";} 
		function get_permalink() {return "";}
?> 

 
 

 
 <br/>
  
    <rktree class="panel-body tree-view">
		 
        <title>Family Tree</title>
		<!-- script type="text/javascript" src="http://d3js.org/d3.v3.js"></script -->
		<!-- script src="js/d3.js"></script -->
		
        <!-- script src="js/main.js"></script -->
     
		 <link rel="stylesheet" type="text/css" href="css/style.css">
         <script src="js/main.js"></script>
		 
		<script type="text/javascript">     
 
        </script>
        
    </rktree> 
	
	 <div class="container">
	  
	  <!-- Modal -->
	  <div class="modal fade" id="myModal" role="dialog">
			<div class="modal-dialog">
			    <form name="myform" id="myform" method="post" enctype="multipart/form-data">
					<!-- Modal content-->
					<div class="modal-content">
					<div class="modal-header">
					  <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <?php 
                            if (current_user_can( 'administrator' ) || current_user_can( 'editor' ) ){
					           echo "<h4 class='modal-title'>Edit Member | Add New Child Member</h4>";
                            }
                            else {
							   printf( '<a href="%s">%s</a>',  wp_login_url( get_permalink() ), __( 'You need to login to modify this content!' ));
                               //echo "<h4 class='modal-title'><a href='http://khaiyumfamily.com/wp-login.php' target='_blank'>Login</a> to Add or Modify the Family Tree</h4>";
                            }
                        ?>
					</div>
					<div class="modal-body">
					  
					  <!-- *********MODEL-BODY-BEGIN ******* -->
						<div class="row">
							
							  <div class="col-sm-12">
							        
									<div class="form-group">
										<img name="profile_photo" id='img-upload'/> 
									</div>
									
									<div class="form-group">
									  <label for="usr">Name:</label>
									  <input type="text" class="form-control" id="name">
									</div>
									<!-- div class="form-group">
									  <label for="spause_name">Spause Name:</label>
									  <input type="text" class="form-control" name="spause_name" id="spause_name">
									</div -->
									<div class="form-group">
									      <label for="bio_data">Biodata:</label>
										  <textarea class="form-control" rows="3" name="bio_data" id="bio_data"></textarea>
						            </div>                                 
									<?php if ( current_user_can( 'administrator' ) ||  current_user_can( 'editor' ) ){ ?>									
									    <div class="form-group">
									      <label for="email">Email:</label>
									      <input type="text" class="form-control" id="email" name="email">
									    </div>
									    <div class="form-group">
									      <label for="phone">Phone:</label>
									      <input type="text" class="form-control" id="phone" name="phone">
									    </div>										
									<?php } ?>


							        <?php if (current_user_can( 'administrator' ) ||  current_user_can( 'editor' ) ){ ?>
									<div class="form-group upload_image_control">
										<label>Upload Image</label>
											
										<input class="btn btn-primary" type="file" id="imgInp"/>
										<input type="hidden" class="form-control" readonly>
										
										<!-- img id='img-upload'/ -->
										<canvas id="myCanvas" width="450" height="300" style="display:none"/>
										
									</div>
									<?php } ?>
							  </div>
							  
						</div>			  
					  <!-- *********MODEL-BODY-END   ******* -->
					  
					</div>
					<div class="modal-footer">

					    <?php 
                            if (current_user_can( 'administrator' ) ||  current_user_can( 'editor' ) ){
					            echo "<button type='button' class='btn btn-primary' onClick='doEditSelectedMember()'  id='edit_selected_member'>Edit This Member</button>";

					            echo '<button type="button" class="btn btn-warning" onClick="doAddNewMember()" id="add_new_child_member">Add New Child Member</button>';

 					            echo '<button type="button" class="btn btn-danger"  onClick="saveData()" id="save_btn">Save</button>';
                            }
                        ?>
					  
					  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>

					</div>

				  </div>
			    </form>
			</div>
	  </div>
	  
	</div>
 
 <script>
	$(document).ready( function() {
		    document.title = "Family Tree";
		   
			$(document).on('change', '.btn-file :file', function() {
			var input = $(this),
				label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
			input.trigger('fileselect', [label]);
			});

			$('.btn-file :file').on('fileselect', function(event, label) {
				
				var input = $(this).parents('.input-group').find(':text'),
					log = label;
				
				if( input.length ) {
					input.val(log);
				} else {
					if( log ) alert(log);
				}
			
			});
			function readURL(input) {
				if (input.files && input.files[0]) {
					var reader = new FileReader();
					
					reader.onload = function (e) {
						$('#img-upload').attr('src', e.target.result);
					}
					
					reader.readAsDataURL(input.files[0]);
				}
			}

			$("#imgInp").change(function(){
				if(this.files[0].size > 5000000){
				   alert("File is too big!");
				   this.value = "";
				};
				
				
				
				readURL(this);
			}); 	
		});
 </script>
 
    
 
<?php 
    if($_SERVER['HTTP_HOST'] != "publicz.raileurope.com" || $_SERVER['HTTP_HOST'] == "localhost"){ //this is to make work in development env
        get_footer();  
	}
 ?>
 