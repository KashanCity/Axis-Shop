const products = [
 {id:1,name:"کیپ OptiFine",price:20000,emoji:"⚡",desc:"کیپ جذاب OptiFine برای استایل Minecraft"},
 {id:2,name:"کیپ Purple Heart",price:1600000,emoji:"💜",desc:"کیپ خاص و پریمیوم Purple Heart"},
 {id:3,name:"کیپ منس",price:180000,emoji:"🎮",desc:"کیپ گیمینگ با ظاهر متفاوت"},
 {id:4,name:"کیپ هوم",price:100000,emoji:"🏠",desc:"کیپ هوم با طراحی خاص"},
 {id:5,name:"کیپ کاپر",price:60000,emoji:"🟠",desc:"کیپ کاپر با استایل متفاوت"},
 {id:6,name:"کیپ بیلدر",price:70000,emoji:"🧱",desc:"انتخاب مناسب برای بیلدرها"}
];

// Intentionally session-only: nothing is saved to localStorage, cookies, IndexedDB or a server.
let cart = [];
let account = null;

const grid = document.getElementById("productGrid");
const modalBackdrop = document.getElementById("modalBackdrop");
const modal = document.getElementById("modal");
const toastEl = document.getElementById("toast");

function toman(n){ return n.toLocaleString("fa-IR") + " تومان"; }
function toast(t){toastEl.textContent=t;toastEl.classList.add("show");setTimeout(()=>toastEl.classList.remove("show"),2200)}

function renderProducts(){
 grid.innerHTML = products.map(p=>`
  <article class="product">
   <div class="product-image"><div class="placeholder">${p.emoji}</div></div>
   <h3>${p.name}</h3><p class="desc">${p.desc}</p>
   <div class="price-row"><div class="price">${toman(p.price)}</div>
   <button class="add" onclick="addToCart(${p.id})">افزودن به سبد</button></div>
  </article>`).join("");
 document.getElementById("productCount").textContent = `${products.length} محصول`;
}
function updateCartCount(){document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0)}
function addToCart(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});updateCartCount();toast("محصول به سبد خرید اضافه شد")}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);openCart()}
function openModal(){modalBackdrop.classList.add("open")}
function closeModal(){modalBackdrop.classList.remove("open")}

function openCart(){
 if(!cart.length){modal.innerHTML=`<button class="close" onclick="closeModal()">✕</button><h2>سبد خرید</h2><div class="notice">🛒 سبد خرید شما خالی است.</div>`;openModal();return}
 let total=0;
 const rows=cart.map(i=>{const p=products.find(x=>x.id===i.id);total+=p.price*i.qty;return `<div class="cart-item"><div><b>${p.name}</b><br><small>${i.qty} × ${toman(p.price)}</small></div><button class="remove" onclick="removeFromCart(${p.id})">حذف</button></div>`}).join("");
 modal.innerHTML=`<button class="close" onclick="closeModal()">✕</button><h2>سبد خرید</h2>${rows}<div class="total"><span>جمع کل</span><span>${toman(total)}</span></div><button class="btn primary" style="width:100%" onclick="checkout()">ادامه ثبت سفارش</button>`;
 openModal();
}
function checkout(){
 if(!account){openAccount(true);return}
 const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
 modal.innerHTML=`<button class="close" onclick="closeModal()">✕</button><h2>ثبت سفارش</h2>
 <div class="notice">مبلغ سفارش: <b>${toman(total)}</b><br>پس از ثبت، برای پرداخت و ارسال رسید با پشتیبانی روبیکا هماهنگ کن.</div>
 <div class="field"><label>نام</label><input id="orderName" value="${account.name||""}"></div>
 <div class="field"><label>آیدی روبیکا</label><input id="orderRubika" value="${account.rubika||""}" placeholder="@username"></div>
 <button class="btn primary" style="width:100%" onclick="submitOrder()">ثبت سفارش</button>`;
}
function submitOrder(){
 const name=document.getElementById("orderName").value.trim(), rubika=document.getElementById("orderRubika").value.trim();
 if(!name||!rubika){toast("نام و آیدی روبیکا را وارد کن");return}
 const order="#GS-"+Math.floor(10000+Math.random()*90000);
 modal.innerHTML=`<button class="close" onclick="closeModal()">✕</button><h2>سفارش ثبت شد 🎉</h2><div class="notice">شماره سفارش: <b>${order}</b><br>اطلاعات این سفارش فقط تا وقتی این صفحه را باز نگه داشته‌ای در حافظه مرورگر است و روی سرور ذخیره نشده است.<br><br>برای پرداخت/ارسال رسید با <b>@the_kenkiX7</b> در روبیکا هماهنگ کن.</div><a class="btn primary" style="display:block;text-align:center;margin-top:15px" href="https://rubika.ir/the_kenkiX7" target="_blank">رفتن به پشتیبانی</a>`;
 cart=[];updateCartCount();toast("سفارش با موفقیت ثبت شد");
}
function openAccount(forceCheckout=false){
 if(account){
  modal.innerHTML=`<button class="close" onclick="closeModal()">✕</button><h2>حساب کاربری</h2><div class="account-box"><div class="account-status">👤 <b>${account.name}</b><br><small>${account.rubika||"آیدی ثبت نشده"}</small></div><div class="notice">حساب کاربری Axis Shop فقط در حافظه موقت همین صفحه نگه داشته می‌شود؛ با بستن یا Refresh صفحه از بین می‌رود.</div><button class="btn secondary" onclick="logout()">خروج از حساب</button></div>`;
  openModal(); return;
 }
 modal.innerHTML=`<button class="close" onclick="closeModal()">✕</button><h2>ورود سریع</h2>
 <div class="notice">برای اینکه Axis Shop بدون هاست و دیتابیس هم کار کند، حساب کاربری این نسخه فقط در حافظه موقت مرورگر نگه داشته می‌شود و در هیچ جایی ذخیره نمی‌شود. با Refresh یا بستن صفحه پاک می‌شود.</div>
 <div class="field"><label>نام</label><input id="accName" placeholder="مثلاً Armin"></div>
 <div class="field"><label>آیدی روبیکا</label><input id="accRubika" placeholder="@username"></div>
 <button class="btn primary" style="width:100%" onclick="loginTemp(${forceCheckout})">ورود به حساب</button>`;
 openModal();
}
function loginTemp(forceCheckout){
 const name=document.getElementById("accName").value.trim(), rubika=document.getElementById("accRubika").value.trim();
 if(!name){toast("نامت را وارد کن");return}
 account={name,rubika};
 toast("ورود موقت انجام شد");
 forceCheckout?checkout():openAccount();
}
function logout(){account=null;closeModal();toast("از حساب خارج شد")}
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("accountBtn").onclick=()=>openAccount();
modalBackdrop.addEventListener("click",e=>{if(e.target===modalBackdrop)closeModal()});
renderProducts();updateCartCount();
