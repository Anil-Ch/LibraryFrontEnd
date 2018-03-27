  // Add Book Html File

$(document).ready(function () {
          
// Hide New Publisher Fields
$("#newPublisher").hide();

// Author & Publisher Lists    
var PublisherList = []; 
var AuthorList = []; 
                
//load publisher and authors
   {
//load publisher         
// ________________________ make ajax call 
                  $.ajax({
                         type: "GET",
                         cache: false,
                          url: "http://localhost:61045/publisher"
                          }).done(function(data) {
                           AssignPublisher(data);
                          })
                          .fail(function(msg) {
                            	 $('#model-title-content').text('Alert');
								$('#model-body-content').text('Publisher List Not Loaded ! ');
								$('#myModal').modal('show');   	
                          });
                                                      
                  
            function AssignPublisher(data){
                      PublisherList = data;  
                      var autoCompletePublisherList = [];
                      for(var index in data){
                          autoCompletePublisherList[index] = data[index].PublisherName;
                      }
                      
                      $("#bookPublisher").autocomplete({  
                              source: autoCompletePublisherList  
                            });  
                    }                                       
                  
            function GetPublisherDetails(name) {                      
                      for(var index in PublisherList){                          
                            var publisher = PublisherList[index];                          
                                if(publisher["PublisherName"].trim() === name.trim()){
                                    return {
                                             PublisherName:publisher["PublisherName"].trim(),
                                             PublishedDate:publisher["publishedDate"]
                                      }
                                }                          
                        }
						return null;		
                    }  //end function                                     
// ___________________  end load publisher
              
              
//load Author
// ______________________________ make ajax call 
                  $.ajax({
                         type: "GET",
                         cache: false,
                          url: "http://localhost:61045/author"
                        }).done(function(data) {
                           AssignAuthor(data);
                          })
                         .fail(function(msg) {                           
								$('#model-title-content').text('Alert');
								$('#model-body-content').text('AuthorList List Not Loaded !');
								$('#myModal').modal('show');   
                          });
                  
            function AssignAuthor(data){
                      AuthorList = data;                           
                      var autoCompleteAuthorList = [];
                      for(var index in data){
                          autoCompleteAuthorList[index] = data[index].AuthorName;
                      }
                      
                        function split( val ) {
                          return val.split( /,\s*/ );
                        }
                
                        function extractLast( term ) {
                          return split( term ).pop();
                        }
 
        // don't navigate away from the field on tab when selecting an item     
                    $( "#bookAuthors" ).on( "keydown", function( event ) {
                        if ( event.keyCode === $.ui.keyCode.TAB &&
                            $( this ).autocomplete( "instance" ).menu.active ) {
                          event.preventDefault();
                        }
                      }).autocomplete({
                        minLength: 0,
                        source: function( request, response ) {
                          // delegate back to autocomplete, but extract the last term
                          response( $.ui.autocomplete.filter(
                            autoCompleteAuthorList, extractLast( request.term ) ) );
                        },
                        focus: function() {
                          // prevent value inserted on focus
                          return false;
                        },
                        select: function( event, ui ) {
                          var terms = split( this.value );
                          // remove the current input
                          terms.pop();
                          // add the selected item
                          terms.push( ui.item.value );
                          // add placeholder to get the comma-and-space at the end
                          terms.push( "" );
                          this.value = terms.join( ", " );
                          return false;
                        }
                      });
                    }
            
                function GetAuthorDetails(name) {                      
                      for(var index in AuthorList){                          
                            var author = AuthorList[index]; 
                            var authorName = author["AuthorName"].trim();
                                if(authorName === name.trim()){
                                    return {
                                            AuthorName :author["AuthorName"],
                                          }
                                      }
				  }						
									return null;
                }//end function  
       
        // end load author
   }
                   
// perform validation on form fields
    function ValidationFields() {
              try{
                  //Book Title
                  var booktitle = $("#bookTitle").val();
                  if(booktitle === ""){
                      throw "Fill Book Title Field.";
                  }
                     
                //Book IsbnNo  
                  var bookisbnno = $("#bookIsbnNo").val();
                  if(bookisbnno === ""){
                      throw "Fill Book IsbnNo Field."
                  }
                  
                  //Book Genre
                  var bookgenre = $("#bookGenre").val();
                  if(bookgenre === ""){
                      throw "Fill Book Genre Field."
                  }
                  
                  //Book Publisher
                  var bookpublisher = $("#bookPublisher").val();
                  if(bookpublisher === ""){
                      throw "Select Book Publisher."
                  }
                  if($("#pubDate").is(":visible")){
                      if($("#pubDate").val() === "")
                      throw "Fill Book Published Date.";
                  }
                                    
                   //Book Authors
                   var bookauthor=[];
                   bookauthor=$("#bookAuthors").val();
                   if(bookauthor === ""){
                    throw "Fill Book AuthorName Field."
                   }
                
                  return "success";
              }
              catch(msg){
                  return msg;
              }            
    }
    
// clear all form fields
    function ClearFields() {
               $("#bookTitle").val("");
               $("#bookIsbnNo").val("");
               $("#bookAuthors").val("");
               $("#pubDate").val("");
               $("#bookGenre").val("");
               $("#bookPublisher").val("");              
          }
 
 
    $("#bookTitle,#bookIsbnNo,#bookGenre,#bookPublisher,#bookAuthors").focusin(function(){             
              $(this).addClass("BackgroundEffects");
              $(this).css("border-color", "black")
          });
  
    $("#bookTitle,#bookIsbnNo,#bookGenre,#bookPublisher,#bookAuthors").focusout(function(){             
              $(this).removeClass("BackgroundEffects");
               $(this).css("border-color" ,"")
          }); 
    
// Depeding Upon Publihser Value Show & Hide Published Date
    $("#bookPublisher").focusout(function(){
         var tempPublisherValue = GetPublisherDetails($("#bookPublisher").val().trim());
         if(tempPublisherValue === null){
            $("#newPublisher").show();
			 $("#pubDate").focus();
         }
        else{
            $("#newPublisher").hide();
        }
    });
  
		   
	function CreateJsonObjectAndSendRequest(){
				   var booktitle = $("#bookTitle").val();
                   var bookisbno = $("#bookIsbnNo").val();
                   var bookgenre = $("#bookGenre").val();
                   var bookpublisher = $("#bookPublisher").val();
                                                    
        // Publisher Block
                 {
                     var publisher = {};
                     if($("#pubDate").is(":visible")){
                          var  pubDate=$("#pubDate").val().toString("dd/MM/yyyy");
                          publisher = {
                                            PublisherName: bookpublisher,
                                            PublishedDate: pubDate
                                      }                          
                        }                   
                        else{
                                publisher =  GetPublisherDetails(bookpublisher);               
                        }               
                  }
        
        // Author Block
                {
                    var bookauthor = [];
                    var authorContainerList;
                    var authors = [];
                   
                // Extract Author Names from Author List Names                    
                        authorList =  $("#bookAuthors").val();
                        var bookauthor = authorList.split(',');
                    
                    var authorCount = 0;
                    for(var authorName in bookauthor){
                            var value = bookauthor[authorName].trim();
                        if(value !== ""){
                            authors[authorCount] = {
                                AuthorName:value,
                                }
                           authorCount++;
                       }
                    }
                 }
           
        // Creating Json Data
                var JsonBookData = {
                          BookIsnbnNo:bookisbno,
                          Title:booktitle,
                          Genre:bookgenre,
                          Publisher: publisher,
                          AuthorList:authors
                        };
          
             
        // make ajax call   
                $.ajax({                                
                                 url: "http://localhost:61045/book",
                                 type: "POST",                                                                  
                                 data: JsonBookData
                            })
                .done(function(msg) {
								$('#model-title-content').text('Alert');
								$('#model-body-content').text('Successfully : '+msg);
								$('#myModal').modal('show');
								ClearFields();                            
                            })
                .fail(function(msg) {
								var responseTexts = msg.responseJSON;
								$('#model-title-content').text('Alert');
								$('#model-body-content').text('Record Not Inserted ! Error :'+responseTexts);
								$('#myModal').modal('show');                          
                            })
                
	}
 
 
 	   $('#bookForm').on('init.field.fv', function(e, data) {
			 // IMPORTANT: You must declare .on('init.field.fv')
			// before calling .formValidation(options)
            // data.fv      --> The FormValidation instance
            // data.field   --> The field name
            // data.element --> The field element

            var $parent = data.element.parents('.form-group'),
                $icon   = $parent.find('.form-control-feedback[data-fv-icon-for="' + data.field + '"]');

            // You can retrieve the icon element by
            // $icon = data.element.data('fv.icon');

            $icon.on('click.clearing', function() {
                // Check if the field is valid or not via the icon class
                if ($icon.hasClass('glyphicon-remove')) {
                    // Clear the field
                    data.fv.resetField(data.element);
                }
            });
        }).formValidation({
			framework: 'bootstrap',
			icon: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				bookTitle: {
					row: '.col-xs-8',
					validators: {
						notEmpty: {
							message: 'The book title is required'
						},
						stringLength: {
							max: 200,
							message: 'The book title must be less than 200 characters long'
						},
						regexp: {
							regexp: /^[a-zA-Z0-9_:\s]+$/,
							message: 'The book title can only consist of alphabetical, number, colon and underscore'
						}
					}
				},
				bookIsbnNo: {
					row: '.col-xs-8',
					validators: {
						notEmpty: {
							message: 'The Book IsnbnNo is required' 
						},
						regexp: {
								regexp: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
								message: 'The format of your Book IsnbnNo is invalid. It should be ISBN-13: 978-0-596-52068-7 or ISBN-10 0-596-52068-9'
							}
					}
				},
				bookGenre: {
					row: '.col-xs-4',
					validators: {
						notEmpty: {
							message: 'The book genre is required'
						}
					}
				},
				bookPublisher: {
					row: '.col-xs-4',
					validators: {
						notEmpty: {
							message: 'The publisher name is required'
						},
						stringLength: {
							max: 80,
							message: 'The publisher name must be less than 80 characters long'
						},
						regexp: {
							regexp: /^[a-zA-Z_\s]+$/,
							message: 'The publisher name can only consist of alphabetical and underscore'
						}
					}
				},
				bookAuthors: {
					row: '.col-xs-4',
					validators: {
						notEmpty: {
							message: 'The author name is required'
						},
						stringLength: {
							max: 80,
							message: 'The author name must be less than 80 characters long'
						},
						regexp: {
							regexp: /^[a-zA-Z_,\s]+$/,
							message: 'The author name can only consist of alphabetical and underscore'
						}
					}
				}          
			}
		}).on('success.form.fv', function(e) {
						 // Prevent form submission
							e.preventDefault();
			
						//succes validation
						console.log("Valid Data");
                        // Creating Json Data and Sending Data to Server via Api's
						CreateJsonObjectAndSendRequest();
								
        }) .on('err.validator.fv', function (e, data) { 
						//validation failed
						e.preventDefault();	
						console.log("Not Valid Data ");						
		 }).on('err.form.fv', function(e) {
					e.preventDefault();
					console.log("form error");
        });
 

});// document Ready function ends
