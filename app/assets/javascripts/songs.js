// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).on('page:change', function(evt) {
  
  // Set up the validation by attaching a click handler to our form 
  // This defines a function that will run when the button is clicked
  $('form.new_song input.button, form.edit_song input.button').click(function() {

    // Check if the form is valid
    var valid = doValidation();
    console.log("loaded");

    return valid;
  });

  // Hook up soundcloud search
  $('#soundcloud-search-btn').click(function() {
    console.log('soundcloud search clicked');

    var query = $('#soundcloud-search').val();

    SC.get("/tracks", 
      { q: query, limit: 20 }, 
      function(tracks) {
        console.log(tracks);
        var container = $('#soundcloud-results');
        console.log(container);
        for (var i=0; i<tracks.length; i++) {
          var list_item = $('<li>');
          list_item.text(tracks[i].title);
          container.append(list_item);
          // SC.oEmbed(tracks[i].permalink_url, {}, list_item[0]);
        }
      }
    );
  });  

});


/** TODO: Fill in these functions **/
function doValidation() {
  // If the form is valid, return true
  // Otherwise return false
  // We can get all the inputs in the form by doing the following:
  // $('input')
  // And loop through them using an each loop (http://api.jquery.com/each/)
  return true;
}

function showErrorMessages() {
  // Show the error messages in the page
  // You can show them all at once in a list
  // Or highlight the specific fields that are incorrect
  // Use the jQuery insert, attr, html, text, and/or css functions
  // i.e. http://api.jquery.com/append/
}