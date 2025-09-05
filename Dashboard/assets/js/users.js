let usersTable;
async function loadUsers(){
  showLoader();
  try{
    const data = await fetch(API.users).then(r=>r.json()).catch(()=>[]);
    const localUsers = JSON.parse(localStorage.getItem('md_v4_localUsers') || '[]');
    const allUsers = [...data, ...localUsers];
    const rows = allUsers.map(u => ({
      fav: `<span class="favorite ${getFavs().includes(u.id)?'active':''}" data-id="${u.id}">★</span>`,
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      company: u.company?.name || '',
      actions: `<button class="btn view" data-id="${u.id}"><i class="fas fa-eye"></i></button>
                <button class="btn edit" data-id="${u.id}"><i class="fas fa-edit"></i></button>
                <button class="btn danger del" data-id="${u.id}"><i class="fas fa-trash"></i></button>`
    }));

    const dataArr = rows.map(r=>[r.fav, r.id, r.name, r.username, r.email, r.company, r.actions]);
    if(usersTable){ usersTable.clear().rows.add(dataArr).draw(); }
    else{
      usersTable = $('#usersTable').DataTable({
        data: dataArr,
        columns: [
          { title:'Fav' },{title:'ID'},{title:'Name'},{title:'Username'},{title:'Email'},{title:'Company'},{title:'Actions', orderable:false, searchable:false }
        ],
        pageLength: 8
      });
    }
  }catch(e){ console.error(e); toastError('Failed to load users'); }
  finally{ hideLoader(); }
}

$(function(){
  loadUsers();

  // refresh
  $('#refreshUsers').on('click', ()=> loadUsers());

  // toggle favorite
  $('#usersTable').on('click', '.favorite', function(){
    const id = Number($(this).data('id'));
    toggleFav(id);
    $(this).toggleClass('active');
  });

  // view -> open modal read-only
  $('#usersTable').on('click', '.view', async function(){
    const id = Number($(this).data('id'));
    showLoader();
    try{
      const user = await fetch(API.users + '/' + id).then(r=>r.json()).catch(()=>null);
      $('#userModalTitle').text('View User');
      $('#u_id').val(user?.id || id);
      $('#u_name').val(user?.name || '');
      $('#u_username').val(user?.username || '');
      $('#u_email').val(user?.email || '');
      $('#u_company').val(user?.company?.name || '');
      $('#userForm input').prop('disabled', true);
      $('#userModal').removeClass('hidden');
    }catch(e){ toastError('Failed to load user'); }
    finally{ hideLoader(); }
  });

  // edit
  $('#usersTable').on('click', '.edit', async function(){
    const id = Number($(this).data('id'));
    showLoader();
    try{
      const user = await fetch(API.users + '/' + id).then(r=>r.json()).catch(()=>null);
      $('#userModalTitle').text('Edit User');
      $('#u_id').val(user?.id || id);
      $('#u_name').val(user?.name || '');
      $('#u_username').val(user?.username || '');
      $('#u_email').val(user?.email || '');
      $('#u_company').val(user?.company?.name || '');
      $('#userForm input').prop('disabled', false);
      $('#userModal').removeClass('hidden');
    }catch(e){ toastError('Failed to load user'); }
    finally{ hideLoader(); }
  });

  // delete (local table removal)
  $('#usersTable').on('click', '.del', function(){
    const id = $(this).data('id');
    let localUsers = JSON.parse(localStorage.getItem('md_v4_localUsers') || '[]');
    localUsers = localUsers.filter(u => String(u.id) !== String(id));
    localStorage.setItem('md_v4_localUsers', JSON.stringify(localUsers));

    usersTable.row($(this).closest('tr')).remove().draw();
    toastInfo('User removed (local only)');
  });

  // add user
  $('#addUserBtn').on('click', ()=>{
    $('#userModalTitle').text('Add User');
    $('#u_id').val('local-' + Date.now());
    $('#u_name').val('');
    $('#u_username').val('');
    $('#u_email').val('');
    $('#u_company').val('');
    $('#userForm input').prop('disabled', false);
    $('#userModal').removeClass('hidden');
  });

  // save user (local)
  $('#userForm').on('submit', function(e){
    e.preventDefault();
    const id = $('#u_id').val();
    const nameVal = $('#u_name').val();
    const usernameVal = $('#u_username').val();
    const emailVal = $('#u_email').val();
    const companyVal = $('#u_company').val();

    let localUsers = JSON.parse(localStorage.getItem('md_v4_localUsers') || '[]');
    // if exists, update; else add
    const idx = localUsers.findIndex(u => String(u.id) === String(id));
    if(idx >= 0){ localUsers[idx] = {id, name: nameVal, username: usernameVal, email: emailVal, company:{name: companyVal}}; }
    else{ localUsers.push({id, name: nameVal, username: usernameVal, email: emailVal, company:{name: companyVal}}); }
    localStorage.setItem('md_v4_localUsers', JSON.stringify(localUsers));

    $('#userModal').addClass('hidden');
    loadUsers();
    toastSuccess('Saved locally');
  });

  $('#userCancel').on('click', ()=> $('#userModal').addClass('hidden'));
});