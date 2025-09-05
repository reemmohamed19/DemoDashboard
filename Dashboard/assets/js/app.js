const API = {
  users: 'https://jsonplaceholder.typicode.com/users',
  posts: 'https://jsonplaceholder.typicode.com/posts',
  comments: (id) => `https://jsonplaceholder.typicode.com/comments?postId=${id}`
};

const LS = {
  favUsers: 'md_v4_favUsers',
  localPosts: 'md_v4_localPosts',
  postEdits: 'md_v4_postEdits',
  postDeleted: 'md_v4_postDeleted'
};

function showLoader(){ $('#loader').removeClass('hidden'); }
function hideLoader(){ $('#loader').addClass('hidden'); }

function toastSuccess(msg){ toastr.success(msg); }
function toastError(msg){ toastr.error(msg); }
function toastInfo(msg){ toastr.info(msg); }

function getFavs(){ try{return JSON.parse(localStorage.getItem(LS.favUsers)||'[]')}catch{return []} }
function saveFavs(a){ localStorage.setItem(LS.favUsers, JSON.stringify(a)) }
function toggleFav(id){ const s = new Set(getFavs()); if(s.has(id)){ s.delete(id); saveFavs([...s]); toastInfo('Removed from favorites') }else{ s.add(id); saveFavs([...s]); toastSuccess('Added to favorites') } }

function getLocalPosts(){ try{return JSON.parse(localStorage.getItem(LS.localPosts)||'[]')}catch{return []} }
function saveLocalPosts(a){ localStorage.setItem(LS.localPosts, JSON.stringify(a)) }
function getPostEdits(){ try{return JSON.parse(localStorage.getItem(LS.postEdits)||'{}')}catch{return {} } }
function savePostEdits(m){ localStorage.setItem(LS.postEdits, JSON.stringify(m)) }
function getDeleted(){ try{return JSON.parse(localStorage.getItem(LS.postDeleted)||'[]')}catch{return [] } }
function saveDeleted(a){ localStorage.setItem(LS.postDeleted, JSON.stringify(a)) }

$(function(){
  toastr.options = { positionClass: 'toast-bottom-right', timeOut: 2000 };
  // theme toggle
  const savedTheme = localStorage.getItem('md_v4_theme') || 'dark';
  if(savedTheme==='light') document.documentElement.classList.add('light'); else document.documentElement.classList.remove('light');
  if(savedTheme==='light') $('body').removeClass('dark'); else $('body').addClass('dark');
  $('#themeToggle').on('click', function(){
    const nowLight = document.documentElement.classList.toggle('light');
    if(nowLight){ $('body').removeClass('dark'); localStorage.setItem('md_v4_theme','light'); $(this).find('i').attr('class','fas fa-sun') }
    else{ $('body').addClass('dark'); localStorage.setItem('md_v4_theme','dark'); $(this).find('i').attr('class','fas fa-moon') }
  });
});