 // Display Book Data Html File

$(document).ready(function () {
   
//Hide Search Field by default    
$("#SearchFieldValue").attr('disabled',true);
$("#SearchBook").attr('disabled',true);
$("#clearTable").attr('disabled',true);
    
//on Page load set default text to input field
$("#SearchFieldValue").attr('placeholder',"");
    
// Displaying DataTable    
function LoadDataTable(data) {
      
$("#bookTable").DataTable().destroy();
    
	var bookDataTable = $("#bookTable").DataTable({
	 columnDefs: [ {
            "searchable": false,
            "orderable": false,
            "targets": 0
        } ],
        order: [[ 1, 'asc' ]],
        data: data,		 
        columns: [
			{ "data": null },
            { "data": "BookTitle" },
			{ "data": "BookIsbnNo" },
            { "data": "BookGenre" },            
            { "data": "Publisher" },  
			{ "data": "AuthorList" , "render": "[, ].AuthorName"}			
        ]		
    } ); 

	 bookDataTable.on( 'order.dt search.dt', function () {
        bookDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();
               
}
          
             
// WebApi : Find All Record
    function GetAllBookRecord() { 
                $.ajax({
                         type: "GET",
                         cache: false,
                         url: "http://localhost:61045/book/",
                         success: function (data) {                                                         
                             LoadDataTable(data);
                        },                    
                        error : function () {
                            deleteBookRows();
                             $('#model-title-content').text('Alert');
								$('#model-body-content').text('No Record found !');
								$('#myModal').modal('show')                         
                        }
                     });                 
            }
               
// WebApi : Find By BookAuthorName
    function FindByAuthor() { 
                var authorName = $("#SearchFieldValue").val().trim();
                
                $.ajax({
                         type: "GET",
                         cache: false,
                         url: "http://localhost:61045/book/find/authorname/"+authorName,
                         success: function (data) {                            
                               LoadDataTable(data);                      
                        },                    
                        error : function () {
                            deleteBookRows();
                             $('#model-title-content').text('Alert');
								$('#model-body-content').text('No Record found !');
								$('#myModal').modal('show')                           
                        }
                     });                 
            }
          
// WebApi : Find By BookTitle
    function FindByTitle() { 
                var bookTitle = $("#SearchFieldValue").val().trim();
               
                $.ajax({
                         type: "GET",
                         cache: false,
                         url: "http://localhost:61045/book/find/title/"+bookTitle,
                         success: function (data) { 
                             LoadDataTable(data);                      
                        },                    
                        error : function () {
                            deleteBookRows();
                              $('#model-title-content').text('Alert');
								$('#model-body-content').text('No Record found !');
								$('#myModal').modal('show')                                    
                        }
                     });                
            }
                    
// WebApi : Find By Genre
    function FindByGenre() { 
                var bookGenre = $("#SearchFieldValue").val().trim();
                
                $.ajax({
                         type: "GET",
                         cache: false,
                         url: "http://localhost:61045/book/find/genre/"+bookGenre,
                         success: function (data) {                            
                              LoadDataTable(data);                       
                        },                    
                        error : function () {
                            deleteBookRows();
                             $('#model-title-content').text('Alert');
								$('#model-body-content').text('No Record found !');
								$('#myModal').modal('show')                       
                        }
                     });                 
            }
         
//clearFields 
    $("#clearTable").click(function () {                             
                deleteBookRows(); 
                $("#SearchFieldValue").attr('placeholder',"") 
                $("#selectedOption").val("-1");
                $("#SearchFieldValue").val("");
				 $("#SearchFieldValue").attr('disabled',true);
            });
     
// Remove & Clear DataTable    
    function deleteBookRows() {
                 try {
                       //Get the reference of the Table.                    
					var table = $("#bookTable").DataTable();

					//clear datatable
					table.clear().draw();

					//destroy datatable
					table.destroy();					
			}catch(e) {
							$('#model-title-content').text('Error');
							$('#model-body-content').text(e);
							$('#myModal').modal('show') 
			}
            }
          
    $("#selectedOption").change(function(){
               deleteBookRows();
               var selectedOption = $("#selectedOption").val();
               $("#SearchFieldValue").attr('placeholder',"")  
               $("#SearchFieldValue").val("");
               $("#SearchBook").attr('disabled',false); 
               
            if(selectedOption === '-1'){
                  $("#SearchFieldValue").attr('disabled',true);
                  $("#SearchBook").attr('disabled',true);
                  $("#clearTable").attr('disabled',true);
              }
        
              if(selectedOption === 'All'){
                  $("#SearchFieldValue").attr('disabled',true);
                   $("#SearchBook").attr('disabled',true); 
                   $("#clearTable").attr('disabled',false);
                   GetAllBookRecord();
              }
              
              if(selectedOption === 'Title'){
                  $("#SearchFieldValue").attr('disabled',false);
                  $("#clearTable").attr('disabled',false);
                  $("#SearchFieldValue").attr('placeholder',"Enter Book Title")                  
              }
              
              if(selectedOption === 'Genre'){
                  $("#SearchFieldValue").attr('disabled',false);
                  $("#clearTable").attr('disabled',false);
                  $("#SearchFieldValue").attr('placeholder',"Enter Book Genre")                   
              }
              
              if(selectedOption === 'AuthorName'){
                  $("#SearchFieldValue").attr('disabled',false);
                  $("#clearTable").attr('disabled',false);
                  $("#SearchFieldValue").attr('placeholder',"Enter Book Author Name")                   
              }
          });
            
    $("#SearchBook").click(function(){
                var selectedOption = $("#selectedOption").val();
                if(selectedOption === 'Title'){
                    var enteredValue = $("#SearchFieldValue").val();
                    if(enteredValue !== ''){
                            FindByTitle();
                       }
                    else {
							$('#model-title-content').text('Alert');
							$('#model-body-content').text('Enter Book Title');
							$('#myModal').modal('show')  
                    }
                }
                
              if(selectedOption === 'Genre'){
                    var enteredValue = $("#SearchFieldValue").val();
                    if(enteredValue !== ''){
                            FindByGenre();
                       }
                   else {
                            $('#model-title-content').text('Alert');
                            $('#model-body-content').text('Enter Book Genre');
							$('#myModal').modal('show') 
                    }
                }
              
              if(selectedOption === 'AuthorName'){
                    var enteredValue = $("#SearchFieldValue").val();
                    if(enteredValue !== ''){
                            FindByAuthor();
                       }
                   else {
								$('#model-title-content').text('Alert');
								$('#model-body-content').text('Enter Author Name');
								$('#myModal').modal('show')
                	    }
                }
          });
                                             
});// document Ready function ends
