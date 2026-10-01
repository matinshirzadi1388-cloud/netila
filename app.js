const $=id=>document.getElementById(id);
let mode="login", user=localStorage.getItem("neon_current"), activeChat="Ali";

const demoChats=[
 {name:"Ali",initial:"A",msg:"خوب، پیامبر کردم",time:"14:32",badge:2,status:"آنلاین"},
 {name:"Sara",initial:"S",msg:"عکس",time:"13:15",badge:1,status:"آخرین بازدید اخیراً"},
 {name:"Reza",initial:"R",msg:"اینو دیدی؟",time:"12:48",badge:0,status:"آنلاین"},
 {name:"Gaming Group",initial:"G",msg:"Mohammad: سلام بچه‌ها 👋",time:"11:20",badge:4,status:"۵ عضو"},
 {name:"Channel",initial:"N",msg:"خبرهای جدید منتشر شد",time:"10:05",badge:0,status:"کانال"},
 {name:"Mahdi",initial:"M",msg:"دمت گرم!",time:"09:37",badge:0,status:"آخرین بازدید امروز"}
];

function users(){return JSON.parse(localStorage.getItem("neon_users")||"{}")}
function saveUsers(x){localStorage.setItem("neon_users",JSON.stringify(x))}
function initials(x){return (x||"?")[0].toUpperCase()}
function showToast(t){const x=$("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}

function renderAuth(){
 $("authScreen").classList.remove("hidden");$("app").classList.add("hidden");
 $("loginTab").classList.toggle("active",mode==="login");$("registerTab").classList.toggle("active",mode==="register");
 $("authTitle").textContent=mode==="login"?"خوش آمدید 👋":"ایجاد حساب کاربری";
 $("authSub").textContent=mode==="login"?"برای ادامه وارد حساب خود شوید":"یک حساب جدید در Netila بسازید";
 $("authBtn").innerHTML=mode==="login"?"ورود <b>→</b>":"ثبت نام <b>＋</b>";
 $("confirmBox").classList.toggle("hidden",mode!=="register");
 $("confirm").required=mode==="register";$("authError").textContent="";
}
function renderApp(){
 $("authScreen").classList.add("hidden");$("app").classList.remove("hidden");
 $("miniName").textContent=user;$("miniAvatar").textContent=initials(user);
 $("settingsName").textContent=user;$("settingsHandle").textContent=user;$("largeAvatar").textContent=initials(user);
 renderChats();loadMessages();
}
$("loginTab").onclick=()=>{mode="login";renderAuth()}
$("registerTab").onclick=()=>{mode="register";renderAuth()}
$("switchAuth").onclick=()=>{mode=mode==="login"?"register":"login";renderAuth()}
$("togglePass").onclick=()=>{$("password").type=$("password").type==="password"?"text":"password"}
$("authForm").onsubmit=e=>{
 e.preventDefault();let name=$("username").value.trim(),pass=$("password").value,db=users();
 if(!/^[A-Za-z0-9_]{3,24}$/.test(name)){return $("authError").textContent="نام کاربری باید ۳ تا ۲۴ کاراکتر انگلیسی، عدد یا _ باشد."}
 if(mode==="register"){
  if(pass.length<4)return $("authError").textContent="رمز عبور باید حداقل ۴ کاراکتر باشد.";
  if(pass!==$("confirm").value)return $("authError").textContent="تکرار رمز عبور درست نیست.";
  if(db[name])return $("authError").textContent="این نام کاربری قبلاً وجود دارد.";
  db[name]={password:pass,createdAt:Date.now()};saveUsers(db);user=name;
 }else{
  if(!db[name]||db[name].password!==pass)return $("authError").textContent="نام کاربری یا رمز عبور اشتباه است.";
  user=name;
 }
 localStorage.setItem("neon_current",user);renderApp();
}

function renderChats(filter=""){
 $("chatList").innerHTML="";
 demoChats.filter(c=>c.name.toLowerCase().includes(filter.toLowerCase())).forEach((c,i)=>{
  const d=document.createElement("div");d.className="chat-item "+(c.name===activeChat?"active":"");
  d.innerHTML=`<div class="avatar">${c.initial}</div><div class="chat-info"><b>${c.name}</b><p>${c.msg}</p></div><div><span class="time">${c.time}</span>${c.badge?`<br><span class="badge">${c.badge}</span>`:""}</div>`;
  d.onclick=()=>openChat(c.name,c.initial,c.status);$("chatList").appendChild(d);
 })
}
$("search").oninput=e=>renderChats(e.target.value)
function openChat(name,initial,status){
 activeChat=name;$("chatTitle").textContent=name;$("chatAvatar").textContent=initial;$("chatStatus").textContent=status||"آنلاین";
 renderChats($("search").value);loadMessages();$("app").classList.add("mobile-chat");
}
function msgKey(){return `neon_msgs_${user}_${activeChat}`}
function loadMessages(){
 let box=$("messages"),data=JSON.parse(localStorage.getItem(msgKey())||"[]");box.innerHTML='<div class="date-pill">امروز</div>';
 if(!data.length){
  const demo=activeChat==="Ali"?[
   {t:"سلام علی 👋",mine:true,time:"14:20"},{t:"سلام! چطوری؟",mine:false,time:"14:23"},
   {t:"خوبم، تو چطوری؟",mine:true,time:"14:25"},{t:"عالی! چند دقیقه دیگه بهم پیام بده ⏱",mine:false,time:"14:27"}
  ]:[];data=demo;
 }
 data.forEach(addBubble);box.scrollTop=box.scrollHeight;
}
function addBubble(m){
 const d=document.createElement("div");d.className="bubble "+(m.mine?"mine":"");
 const safe=document.createElement("div");safe.textContent=m.t;d.appendChild(safe);
 const meta=document.createElement("div");meta.className="meta";meta.textContent=m.time+(m.mine?"  ✓✓":"");d.appendChild(meta);$("messages").appendChild(d);
}
$("messageForm").onsubmit=e=>{
 e.preventDefault();let inp=$("message"),t=inp.value.trim();if(!t)return;
 let data=JSON.parse(localStorage.getItem(msgKey())||"[]"),m={t,mine:true,time:new Date().toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit"})};
 data.push(m);localStorage.setItem(msgKey(),JSON.stringify(data));addBubble(m);inp.value="";$("messages").scrollTop=$("messages").scrollHeight;
 setTimeout(()=>showToast("پیام شما در این نسخه محلی ذخیره شد ✓"),150);
}
$("emoji").onclick=()=>{$("emojiPanel").classList.toggle("hidden")}
$("emojiPanel").onclick=e=>{if(e.target.tagName==="BUTTON"){$("message").value+=e.target.textContent;$("message").focus()}}
$("attach").onclick=()=>showToast("ارسال فایل در نسخه بعدی فعال می‌شود")
$("newChat").onclick=()=>showToast("ساخت چت جدید در نسخه بعدی اضافه می‌شود")
$("settingsBtn").onclick=()=>{$("settingsPanel").classList.remove("hidden")}
$("closeSettings").onclick=()=>{$("settingsPanel").classList.add("hidden")}
$("profileBtn").onclick=()=>{$("settingsPanel").classList.remove("hidden")}
$("logout").onclick=()=>{localStorage.removeItem("neon_current");user=null;mode="login";renderAuth()}
$("backBtn").onclick=()=>{$("app").classList.remove("mobile-chat")}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");showToast("این بخش در حال آماده‌سازی است")})

if(user)renderApp();else renderAuth();
