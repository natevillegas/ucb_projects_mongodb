var articleIndex = 0
var articleID;

$(document).on('click', '#scrape', function() {
    $.getJSON('/news', function(data) {
        var article = data[articleIndex];
        articleID = article._id;
        $('#title').text(article.title);
        $('#link').attr('href', article.href);
        $('#link').text('Go to article')
        getNotes();
        articleIndex++;
    });
    return false;
});

$(document).on('click', '#comment-button', function() {
    $.ajax({
        method: "POST",
        url: "/news/" + articleID,
        data: {
            body: $('#comment').val()
        }
    }).done(function(data) {
      $('#comment').val('');
      getNotes();
    });
  return false;
});

function getNotes(){
	$.ajax({
		method: 'GET',
		url: "/news/" + articleID
	}).done(function(data){
    $('#comment-window').empty();
      for (var i = 0; i < data.notes.length; i++) {
        var div = $('<div class="comment-div">');
        div.append('<p class="comment">' + data.notes[i].body +  "</p>")
        div.append('<button type="button" class="btn btn-xs btn-danger delete" id="' + data.notes[i]._id + '">x</button>')
        $('#comment-window').append(div);
        var log = $('#comment-window');
        log.animate({ scrollTop: log.prop('scrollHeight')}, 1000);
      }
	});
}

$(document).on('click', '.delete', function(){
  var noteID = $(this).attr('id');
  $.ajax({
    method: 'DELETE',
    url: '/notes/' + noteID,
    success: function(result) {
        getNotes();
    }
  });
});
