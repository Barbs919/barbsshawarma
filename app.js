const defaultData={phone:"2348071357711",paystackPublicKey:"",categories:["All","Shawarma","Grills","Meals"],menu:[
{id:1,name:"Chicken Shawarma",category:"Shawarma",price:1000,emoji:"🌯",desc:"Fresh chicken shawarma with tasty fillings and sauce.",active:true},
{id:2,name:"Barbecue Chicken",category:"Grills",price:0,emoji:"🍗",desc:"Smoky, juicy grilled chicken.",active:true},
{id:3,name:"Suya",category:"Grills",price:0,emoji:"🥩",desc:"Spicy grilled suya, served fresh.",active:true},
{id:4,name:"Turkey",category:"Grills",price:0,emoji:"🦃",desc:"Tender grilled turkey.",active:true},
{id:5,name:"Chicken & Chips",category:"Meals",price:0,emoji:"🍟",desc:"Crispy chips with juicy chicken.",active:true},
{id:6,name:"Spaghetti",category:"Meals",price:0,emoji:"🍝",desc:"Tasty spaghetti meal.",active:true}]};
let data=JSON.parse(localStorage.getItem("barbsData")||"null")||defaultData,cart=JSON.parse(localStorage.getItem("barbsCart")||"[]"),cat="All";
const money=n=>"₦"+Number(n||0).toLocaleString("en-NG");
const saveCart=()=>{localStorage.setItem("barbsCart",JSON.stringify(cart));document.getElementById("cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0)};
function tabs(){document.getElementById("tabs").innerHTML=data.categories.map(c=>`<button class="tab ${c===cat?"active":""}" onclick="setCat('${c}')">${c}</button>`).join("")}
function setCat(c){cat=c;tabs();renderMenu()}
function renderMenu(){
 const q=(document.getElementById("search").value||"").toLowerCase();
 const list=data.menu.filter(x=>x.active&&(cat==="All"||x.category===cat)&&(!q||x.name.toLowerCase().includes(q)));
 document.getElementById("menuGrid").innerHTML=list.map(x=>`<article class="menu-card"><div class="menu-img">${x.emoji||"🍽️"}</div><div class="menu-body"><h3>${x.name}</h3><p>${x.desc||""}</p><div class="menu-actions"><span class="price ${x.price?"":"muted"}">${x.price?money(x.price):"Price coming soon"}</span><button class="small-btn" ${x.price?"":"disabled"} onclick="add(${x.id})">${x.price?"ADD":"SOON"}</button></div></div></article>`).join("")||`<p>No menu items found.</p>`;
}
function add(id){let x=cart.find(c=>c.id===id);x?x.qty++:cart.push({id,qty:1});saveCart();toast("Added to cart")}
function openCart(){renderCart();document.getElementById("cartModal").classList.remove("hidden")}
function closeCart(){document.getElementById("cartModal").classList.add("hidden")}
function renderCart(){
 let box=document.getElementById("cartItems"),total=0;
 if(!cart.length){box.innerHTML="<p>Your cart is empty. Add something delicious.</p>";document.getElementById("cartTotal").textContent=money(0);return}
 box.innerHTML=cart.map(c=>{let i=data.menu.find(x=>x.id===c.id),s=i.price*c.qty;total+=s;return `<div class="cart-line"><div><b>${i.name}</b><small>${money(i.price)} each</small></div><div class="qty"><button onclick="qty(${i.id},-1)">−</button><b>${c.qty}</b><button onclick="qty(${i.id},1)">+</button></div><b>${money(s)}</b></div>`}).join("");
 document.getElementById("cartTotal").textContent=money(total);
}
function qty(id,d){let x=cart.find(c=>c.id===id);x.qty+=d;if(x.qty<1)cart=cart.filter(c=>c.id!==id);saveCart();renderCart()}
document.getElementById("orderType").addEventListener("change",e=>document.getElementById("address").required=e.target.value==="delivery");
document.getElementById("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();if(!cart.length)return toast("Your cart is empty");
 let total=cart.reduce((s,c)=>s+data.menu.find(i=>i.id===c.id).price*c.qty,0);
 let o={id:"BARBS-"+Date.now(),date:new Date().toISOString(),customer:customerName.value,phone:customerPhone.value,type:orderType.value,address:address.value,payment:paymentMethod.value,total,items:cart.map(c=>{let i=data.menu.find(x=>x.id===c.id);return{name:i.name,qty:c.qty,price:i.price}})};
 let orders=JSON.parse(localStorage.getItem("barbsOrders")||"[]");orders.unshift(o);localStorage.setItem("barbsOrders",JSON.stringify(orders));
 let text=`Hello BARB'S SHAWARMA AND GRILLS 👋%0A%0A*New Order: ${o.id}*%0A${o.items.map(i=>`${i.name} x${i.qty} — ${money(i.price*i.qty)}`).join("%0A")}%0A%0A*Total: ${money(total)}*%0AName: ${o.customer}%0APhone: ${o.phone}%0A${o.type==="delivery"?"Address: "+o.address:"Pickup"}%0APayment: ${o.payment==="cod"?"Pay on Delivery":"Pay Online"}`;
 window.open(`https://wa.me/${data.phone}?text=${text}`,"_blank");
 toast("Order prepared — WhatsApp opened");cart=[];saveCart();setTimeout(closeCart,600);
});
function toast(t){let x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2500)}
document.getElementById("year").textContent=new Date().getFullYear();tabs();renderMenu();saveCart();
