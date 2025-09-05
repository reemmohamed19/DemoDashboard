$(async function(){
  showLoader();
  try{
    const [users, posts, comments] = await Promise.all([
      fetch(API.users).then(r=>r.json()).catch(()=>[]),
      fetch(API.posts).then(r=>r.json()).catch(()=>[]),
      fetch('https://jsonplaceholder.typicode.com/comments').then(r=>r.json()).catch(()=>[])
    ]);
    const localPosts = getLocalPosts();
    const deleted = new Set(getDeleted());
    const localUsers = JSON.parse(localStorage.getItem('md_v4_localUsers') || '[]');

    // Users count = API users + local users
    $('#statUsers').text((users && users.length ? users.length : 0) + localUsers.length);

    // Posts count = API posts (excluding deleted) + local posts
    const apiCount = (posts && posts.length) ? posts.filter(p=>!deleted.has(p.id)).length : 0;
    $('#statPosts').text(apiCount + localPosts.length);

    // Comments count from API only
    $('#statComments').text((comments && comments.length) ? comments.length : 0);
  }catch(e){
    console.error(e); toastError('Failed to load dashboard');
  }finally{ hideLoader(); }
});