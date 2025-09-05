let postsTable, usersCache = {};

async function loadUsersCache(){
  try{
    const users = await fetch(API.users).then(r=>r.json()).catch(()=>[]);
    (users || []).forEach(u => usersCache[u.id] = u.name);
  }catch(e){ console.error(e); }
}

function mergePosts(apiPosts){
  const edits = getPostEdits();
  const deleted = new Set(getDeleted());
  const locals = getLocalPosts();
  const apiFiltered = (apiPosts || []).filter(p => !deleted.has(p.id)).map(p => edits[p.id] ? {...p, ...edits[p.id]} : p);
  return [...apiFiltered, ...locals];
}

async function loadPosts(){
  showLoader();
  try{
    await loadUsersCache();
    const apiPosts = await fetch(API.posts).then(r=>r.json()).catch(()=>[]);
    const all = mergePosts(apiPosts);
    const rows = all.map(p => [
      p.id,
      p.title,
      p.body,
      usersCache[p.userId] || p.userId || '—',
      `<button class="btn view-comments" data-id="${p.id}"><i class="fas fa-comments"></i></button>
       <button class="btn edit" data-id="${p.id}"><i class="fas fa-edit"></i></button>
       <button class="btn danger del" data-id="${p.id}"><i class="fas fa-trash"></i></button>`
    ]);
    if(postsTable){ postsTable.clear().rows.add(rows).draw(); }
    else{
      postsTable = $('#postsTable').DataTable({
        data: rows,
        columns: [
          {title:'ID'},{title:'Title'},{title:'Body'},{title:'User'},{title:'Actions', orderable:false, searchable:false}
        ],
        pageLength: 8
      });
    }
  }catch(e){ console.error(e); toastError('Failed to load posts'); }
  finally{ hideLoader(); }
}

$(function(){
  loadPosts();

  $('#postSearch').on('input', function(){ postsTable.search(this.value).draw(); });

  $('#addPostBtn').on('click', function(){
    $('#postModalTitle').text('Add Post');
    $('#p_id').val('local-' + Date.now());
    $('#p_title').val('');
    $('#p_body').val('');
    $('#postModal').removeClass('hidden');
  });

  // edit from table
  $('#postsTable').on('click', '.edit', function(){
    const data = postsTable.row($(this).closest('tr')).data();
    $('#postModalTitle').text('Edit Post');
    $('#p_id').val(data[0]);
    $('#p_title').val(data[1]);
    $('#p_body').val(data[2]);
    $('#postModal').removeClass('hidden');
  });

  // delete post (local handling)
  $('#postsTable').on('click', '.del', function(){
    const id = $(this).data('id');
    // if it's numeric and <=100, treat as API id -> mark deleted
    const numeric = Number(id);
    if(!isNaN(numeric) && numeric <= 100){
      const d = new Set(getDeleted()); d.add(numeric); saveDeleted([...d]);
    } else {
      // local post -> remove from localPosts
      const locals = getLocalPosts().filter(p => String(p.id) !== String(id)); saveLocalPosts(locals);
    }
    postsTable.row($(this).closest('tr')).remove().draw();
    toastInfo('Post removed (local only)');
  });

  // view comments
  $('#postsTable').on('click', '.view-comments', async function(){
    const id = $(this).data('id');
    $('#commentsList').empty(); $('#commentsPostId').text(id);
    $('#commentsModal').removeClass('hidden');
    showLoader();
    try{
      const comments = await fetch(API.comments(id)).then(r=>r.json()).catch(()=>[]);
      if(!comments || comments.length===0){ $('#commentsList').html('<p class="muted">No comments</p>'); }
      else{
        comments.forEach(c => {
          $('#commentsList').append(`<div class="comment"><strong>${c.email}</strong><p>${c.body}</p><hr/></div>`);
        });
      }
    }catch(e){ toastError('Failed to load comments'); }
    finally{ hideLoader(); }
  });

  // save post (add/edit)
  $('#postForm').on('submit', function(e){
    e.preventDefault();
    const id = $('#p_id').val();
    const title = $('#p_title').val();
    const body = $('#p_body').val();
    // if local id (string 'local-') add to localPosts
    if(String(id).startsWith('local-')){
      const locals = getLocalPosts();
      locals.push({id, title, body, userId: 0});
      saveLocalPosts(locals);
      toastSuccess('Post added locally');
    } else {
      // edit: if numeric and <=100 -> save in edits map; if local stored differently, update locals
      const num = Number(id);
      if(!isNaN(num) && num <= 100){
        const edits = getPostEdits(); edits[num] = {id: num, title, body}; savePostEdits(edits);
      } else {
        // possibly editing local post with numeric-like id; update locals
        const locals = getLocalPosts();
        const idx = locals.findIndex(p => String(p.id) === String(id));
        if(idx >= 0){ locals[idx] = {...locals[idx], title, body}; saveLocalPosts(locals); }
        else { // fallback, add as local
          locals.push({id, title, body, userId:0}); saveLocalPosts(locals);
        }
      }
      toastSuccess('Post updated locally');
    }
    $('#postModal').addClass('hidden');
    loadPosts();
  });

  $('#postCancel').on('click', ()=> $('#postModal').addClass('hidden'));
  $('#closeComments').on('click', ()=> $('#commentsModal').addClass('hidden'));
});