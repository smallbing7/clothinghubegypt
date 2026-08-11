/*
  1) Create a Supabase project.
  2) In this file, replace the two placeholders below.
  3) Run supabase-setup.sql in Supabase SQL Editor.
  4) Create your admin user in Supabase Authentication > Users.
*/
const SUPABASE_URL = "https://qnsljfdaqfebpcsbehpm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_DKheV3t2LIRqxwYbBOhpbw_S8P-eg2q";

const configured = !SUPABASE_URL.startsWith("YOUR_") && !SUPABASE_ANON_KEY.startsWith("YOUR_");
const client = configured ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const $ = id => document.getElementById(id);
const msg = (id, text, error=false) => { $(id).textContent = text; $(id).classList.toggle("error", error); };

async function requireAdmin() {
  if (!client) return;
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    $("loginPanel").classList.remove("hidden");
    $("dashboard").classList.add("hidden");
    return;
  }
  const { data: profile, error } = await client.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (error || !profile) {
    await client.auth.signOut();
    msg("loginMessage", "This account is not an admin.", true);
    return;
  }
  $("loginPanel").classList.add("hidden");
  $("dashboard").classList.remove("hidden");
  await Promise.all([loadProducts(), loadAffiliates(), loadQuotes()]);
}

$("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  if (!client) return msg("loginMessage", "Add your Supabase URL and anon/publishable key in admin.js first.", true);
  msg("loginMessage", "Logging in...");
  const { error } = await client.auth.signInWithPassword({email:$("email").value.trim(), password:$("password").value});
  if (error) return msg("loginMessage", error.message, true);
  msg("loginMessage", "");
  await requireAdmin();
});

$("logoutBtn").addEventListener("click", async () => { if(client) await client.auth.signOut(); location.reload(); });

async function loadProducts(){
  if(!client) return;
  const {data,error}=await client.from("products").select("*").order("created_at",{ascending:false});
  if(error) return $("productsList").textContent=error.message;
  $("productsList").innerHTML = data.length ? data.map(p=>`
    <div class="item">
      <strong>${esc(p.name)}</strong>
      <small>${esc(p.category)} · ${esc(p.price)} · ${esc(p.image)}</small>
      <div class="itemActions">
        <button onclick='editProduct(${JSON.stringify(p)})'>Edit</button>
        <button class="danger" onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    </div>`).join("") : "<p>No products yet.</p>";
}

window.editProduct = p => {
  $("productId").value=p.id; $("productName").value=p.name; $("productCategory").value=p.category;
  $("productPrice").value=p.price; $("productImage").value=p.image; $("productDescription").value=p.description||"";
  scrollTo({top:0,behavior:"smooth"});
};

async function deleteProduct(id){
  if(!confirm("Delete this product?")) return;
  const {error}=await client.from("products").delete().eq("id",id);
  if(error) return alert(error.message);
  await loadProducts();
}

$("productForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const payload={name:$("productName").value.trim(),category:$("productCategory").value.trim(),price:$("productPrice").value.trim(),image:$("productImage").value.trim(),description:$("productDescription").value.trim()};
  const id=$("productId").value;
  const result=id ? await client.from("products").update(payload).eq("id",id) : await client.from("products").insert(payload);
  if(result.error) return msg("productMessage",result.error.message,true);
  msg("productMessage",id?"Product updated.":"Product added.");
  clearForm(); await loadProducts();
});

function clearForm(){["productId","productName","productCategory","productPrice","productImage","productDescription"].forEach(id=>$(id).value="");}
$("cancelEdit").addEventListener("click",clearForm);
$("refreshProducts").addEventListener("click",loadProducts);

async function loadAffiliates(){
  if(!client) return;
  const {data,error}=await client.from("affiliate_applications").select("*").order("created_at",{ascending:false});
  if(error) return $("affiliateList").textContent=error.message;
  $("affiliateList").innerHTML=data.length?data.map(a=>`
    <div class="item">
      <strong>${esc(a.name)}</strong>
      <small>${esc(a.email)} · WhatsApp: ${esc(a.whatsapp)} · ${esc(a.country)}</small>
      <p>${esc(a.promotion_method||"")}<br>${esc(a.audience||"")}</p>
    </div>`).join(""):"<p>No affiliate applications yet.</p>";
}
$("refreshAffiliates").addEventListener("click",loadAffiliates);

function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

if(configured){ requireAdmin(); } else {
  $("loginPanel").classList.remove("hidden");
  msg("loginMessage","Supabase is not configured yet. Add credentials to admin.js.",true);
}
