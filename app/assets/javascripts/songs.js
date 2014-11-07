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

  // Make sure ToneDen is ready
  ToneDenReady = window.ToneDenReady || [];
  ToneDenReady.push(function() {
    console.log('ToneDenReady');
  });

  // Hook up soundcloud search
  $('#soundcloud-search-btn').click(function() {
    console.log('soundcloud search clicked');
    var query = $('#soundcloud-search').val();

    // Call our API using the SDK
    SC.get("/tracks", 
      { q: query, limit: 5 }, 
      function(tracks) {
        // Grab the container div
        var container = $('#soundcloud-results');
        
        // Remove any previous results
        container.empty();
        
        // Loop through our track objects
        for (var i=0; i<tracks.length; i++) {
          // Create a list item to hold our players
          var list_item = $('<li>').addClass('player-list-item');
          // Set the data attribute so we can retrieve the track later
          list_item.data('track-id', tracks[i].id)
          container.append(list_item);
          
          // Create the ToneDen player
          addPlayer(list_item, tracks[i]);

        } // End for loop
      } // End callback function
    ); // End SC.get call
  });  

});

function addPlayer(domEle, track) {
  ToneDen.player.create({
    dom: domEle,
    single: true,
    mini: true,
    urls: [
      track.permalink_url
    ],
  });

  // This is a bit hacky, but ToneDen doesn't give us a DOMReady event
  // And the trackReady event doesn't fire if the track fails to load
  var interval = setInterval(function() {
    var playlist_link = $('.follow-link', domEle);
    if (playlist_link.length === 0) {
      return;
    }
    else {
      clearInterval(interval);
    }
    // Hijack the "follow" link to use our playlist functionality instead
    playlist_link.text('ADD TO PLAYLIST').attr('href', 'javascript:;').attr('target', '');

    // Make sure the playlist link takes up the full available space
    playlist_link.parent().removeClass('tdlarge-6').addClass('tdlarge-12');

    // Add our own event handler (and remove the default one)
    playlist_link.off('click').click(addToPlaylist);
  }, 200);
}

// Click handlers take one parameter: the event object
function addToPlaylist(event) {
  var tgt = $(event.target);
  var parent = tgt.parents('.player-list-item');
  var trackId = parent.data('track-id')
  console.log("Clicked track ID is " + trackId);

  var playlist_id = $('#playlist_id').val();
  var url = '/playlists/' + playlist_id + '/songs'

  SC.get('/tracks/' + trackId, {}, function(track) {
    track.name = track.title;
    var data = track;
    // Set the soundcloud_id based on the id of the track
    data.souncloud_id = track.id;
    // Set the artist attribute from the user that uploaded the track
    data.artist = track.user.username;

    // Send the Ajax Request
    $.ajax({
      method: 'POST',
      url: url,
      dataType: 'json',
      data: {song: track},
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      }
    }).success(function(data) {
      console.log(data);
      $('#soundcloud-results').html(
        '<div data-alert class="alert-box success radius">' +
          'Track ' + data.name + ' succesfully added to the playlist' + 
          '<a href="#" class="close">&times;</a>' +
        '</div>'
      )
    }).fail(function(response, errors) {
      console.log(errors);
      $('#soundcloud-results').html(
        '<div data-alert class="alert-box alert radius">' + 
          'There were some errors adding the track:' + errors +
          '<a href="#" class="close">&times;</a>' +
        '</div>'
      );
    });
  });

  // For simplicity sake, we can only add a single song at a time to the playlist for now
  // The goal of this function is to auto-populate the form on the page with the values
  // From the selected track (i.e. artist, genre, duration, title, etc)
  // I would recommend clearing out our current search results 
  // (or all of the list items that aren't the clicked one)


}


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