function onAdd(i, q_id) {
	let note_id = `note_${i}_content`;
  let note = {
    q_id: q_id,
    content: $(`#${note_id}`).val(),
    tags: [$('#note_tag_'+i).find(":selected").text()],
  };
  //note.tags.push($('#note_tag_'+i).find(":selected").text());
  //note.q_id = question['q_id'] ;
  //note.q_id = q_id ;
  request = $.ajax({url:'/questions/add_note', type:'POST', data:JSON.stringify(note)});

  request.done(function(msg) {
    window.location.href = "/";
  });
  request.fail(function(jqXHR, textStatus) {
    alert( "Request failed: " + textStatus );
  });
}