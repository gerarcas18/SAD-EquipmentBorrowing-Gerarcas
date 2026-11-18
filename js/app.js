const $ = (id) => document.getElementById(id);
let currentUser=null,equipmentCache=[],transactionCache=[];
const today=()=>new Date().toISOString().slice(0,10);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const msg=(s,err=false)=>{$("appMessage").textContent=s;$("appMessage").className="message"+(err?" error":"");};
const loginMsg=(s,err=false)=>{$("loginMessage").textContent=s;$("loginMessage").className="message"+(err?" error":"");};
const status=t=>t.status!=="Returned"&&t.due_date<today()?"Overdue":t.status;
async function init(){
 $("todayLabel").textContent=new Date().toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});
 $("dateBorrowed").value=today();$("dateBorrowed").max=today();
 const {data:{session},error}=await supabaseClient.auth.getSession();
 if(error)loginMsg(error.message,true);
 if(session)await showApp(session.user);else $("authView").classList.remove("hidden");
}
async function showApp(user){currentUser=user;$("authView").classList.add("hidden");$("appView").classList.remove("hidden");$("signedInAs").textContent=user.email||"Signed in";await refresh();}
async function refresh(){
 const [eq,tr]=await Promise.all([supabaseClient.from("equipment").select("*").order("created_at",{ascending:false}),supabaseClient.from("borrow_transactions").select("*, equipment(equipment_name,asset_code)").order("created_at",{ascending:false})]);
 if(eq.error||tr.error){msg(eq.error?.message||tr.error?.message,true);return;}
 equipmentCache=eq.data||[];transactionCache=(tr.data||[]).map(t=>({...t,status:status(t)}));render();
}
function render(){
 const active=transactionCache.filter(t=>t.status!=="Returned");
 $("totalCount").textContent=equipmentCache.length;
 $("availableCount").textContent=equipmentCache.filter(e=>e.availability==="Available").length;
 $("borrowedCount").textContent=equipmentCache.filter(e=>e.availability==="Borrowed").length;
 $("returnedCount").textContent=transactionCache.filter(t=>t.status==="Returned").length;
 $("overdueCount").textContent=active.filter(t=>t.status==="Overdue").length;
 $("recentRows").innerHTML=transactionCache.slice(0,6).map(t=>`<tr><td>${esc(t.borrower_name)}</td><td>${esc(t.equipment?.equipment_name||"—")}</td><td>${esc(t.due_date)}</td><td><span class="pill ${t.status}">${t.status}</span></td></tr>`).join("")||'<tr><td colspan="4">No transactions yet.</td></tr>';
 const q=$("equipmentSearch").value.toLowerCase(),f=$("availabilityFilter").value;
 const er=equipmentCache.filter(e=>(!f||e.availability===f)&&(`${e.equipment_name} ${e.asset_code}`.toLowerCase().includes(q)));
 $("equipmentRows").innerHTML=er.map(e=>`<tr><td>${esc(e.asset_code)}</td><td>${esc(e.equipment_name)}</td><td>${esc(e.category)}</td><td>${esc(e.condition)}</td><td><span class="pill ${e.availability}">${e.availability}</span></td><td><button class="table-action" data-edit="${e.id}">Edit</button><button class="table-action danger" data-delete="${e.id}">Delete</button></td></tr>`).join("")||'<tr><td colspan="6">No equipment records found.</td></tr>';
 const tq=$("transactionSearch").value.toLowerCase(),tf=$("statusFilter").value;
 const tr=transactionCache.filter(t=>(!tf||t.status===tf)&&(`${t.borrower_name} ${t.equipment?.equipment_name||""} ${t.equipment?.asset_code||""}`.toLowerCase().includes(tq)));
 $("transactionRows").innerHTML=tr.map(t=>`<tr><td>${esc(t.borrower_name)}<br><small>${esc(t.borrower_type)} · ${esc(t.department)}</small></td><td>${esc(t.equipment?.equipment_name||"—")}<br><small>${esc(t.equipment?.asset_code||"")}</small></td><td>${esc(t.date_borrowed)}</td><td>${esc(t.due_date)}</td><td>${esc(t.date_returned||"—")}</td><td><span class="pill ${t.status}">${t.status}</span></td><td>${t.status!=="Returned"?`<button class="table-action" data-return="${t.id}">Return</button>`:"—"}</td></tr>`).join("")||'<tr><td colspan="7">No transactions found.</td></tr>';
 const available=equipmentCache.filter(e=>e.availability==="Available");
 $("borrowEquipment").innerHTML=available.map(e=>`<option value="${e.id}">${esc(e.equipment_name)} (${esc(e.asset_code)})</option>`).join("");
 $("newBorrowBtn").disabled=!available.length;
}
function section(name){["dashboard","equipment","transactions"].forEach(s=>$(`${s}Section`).classList.toggle("hidden",s!==name));document.querySelectorAll("[data-section]").forEach(b=>b.classList.toggle("active",b.dataset.section===name));$("pageTitle").textContent=name[0].toUpperCase()+name.slice(1);}
document.querySelectorAll("[data-section]").forEach(b=>b.addEventListener("click",()=>section(b.dataset.section)));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).close()));
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();loginMsg("Signing in…");const {data,error}=await supabaseClient.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error)loginMsg(error.message,true);else await showApp(data.user);});
$("logoutBtn").addEventListener("click",async()=>{const {error}=await supabaseClient.auth.signOut();if(error){msg(error.message,true);return;}currentUser=null;$("appView").classList.add("hidden");$("authView").classList.remove("hidden");});
$("addEquipmentBtn").addEventListener("click",()=>{$("equipmentForm").reset();$("equipmentId").value="";$("equipmentDialogTitle").textContent="Add equipment";$("equipmentDialog").showModal();});
$("equipmentRows").addEventListener("click",async e=>{
 const edit=e.target.dataset.edit,del=e.target.dataset.delete;
 if(edit){const x=equipmentCache.find(v=>String(v.id)===edit);if(!x)return;$("equipmentId").value=x.id;$("equipmentName").value=x.equipment_name;$("equipmentCategory").value=x.category;$("assetCode").value=x.asset_code;$("equipmentCondition").value=x.condition;$("equipmentDialogTitle").textContent="Edit equipment";$("equipmentDialog").showModal();}
 if(del){const x=equipmentCache.find(v=>String(v.id)===del);if(!x)return;if(x.availability==="Borrowed"){msg("Return this equipment before deleting it.",true);return;}if(!confirm(`Delete ${x.equipment_name}?`))return;const {error}=await supabaseClient.from("equipment").delete().eq("id",del);if(error)msg(error.message,true);else{msg("Equipment deleted.");await refresh();}}
});
$("equipmentForm").addEventListener("submit",async e=>{e.preventDefault();const id=$("equipmentId").value,p={equipment_name:$("equipmentName").value.trim(),category:$("equipmentCategory").value.trim(),asset_code:$("assetCode").value.trim(),condition:$("equipmentCondition").value};const r=id?await supabaseClient.from("equipment").update(p).eq("id",id):await supabaseClient.from("equipment").insert(p);if(r.error){msg(r.error.message,true);return;}$("equipmentDialog").close();msg(id?"Equipment updated.":"Equipment added.");await refresh();});
$("newBorrowBtn").addEventListener("click",()=>{render();if(!$("borrowEquipment").options.length){msg("No available equipment to borrow.",true);return;}$("borrowForm").reset();$("dateBorrowed").value=today();$("dateBorrowed").max=today();$("dueDate").min=today();$("borrowDialog").showModal();});
$("borrowForm").addEventListener("submit",async e=>{
 e.preventDefault();const borrowed=$("dateBorrowed").value,due=$("dueDate").value,eid=$("borrowEquipment").value;
 if(due<borrowed){msg("Due date cannot be earlier than borrowing date.",true);return;}
 const item=equipmentCache.find(x=>String(x.id)===eid);if(!item||item.availability!=="Available"){msg("Equipment is no longer available. Refresh and try again.",true);return;}
 const {data:locked,error:lockErr}=await supabaseClient.from("equipment").update({availability:"Borrowed"}).eq("id",eid).eq("availability","Available").select("id");
 if(lockErr||!locked?.length){msg(lockErr?.message||"Equipment was just borrowed by another user. Refresh.",true);return;}
 const payload={equipment_id:Number(eid),borrower_name:$("borrowerName").value.trim(),borrower_type:$("borrowerType").value,department:$("department").value.trim(),date_borrowed:borrowed,due_date:due,status:"Borrowed",user_id:currentUser.id};
 const {error}=await supabaseClient.from("borrow_transactions").insert(payload);
 if(error){await supabaseClient.from("equipment").update({availability:"Available"}).eq("id",eid);msg(error.message,true);return;}
 $("borrowDialog").close();msg("Borrowing transaction recorded.");await refresh();
});
$("transactionRows").addEventListener("click",async e=>{
 const id=e.target.dataset.return;if(!id)return;const t=transactionCache.find(x=>String(x.id)===id);if(!t||t.status==="Returned")return;
 if(!confirm(`Confirm return of ${t.equipment?.equipment_name||"this equipment"}?`))return;
 const {data:done,error}=await supabaseClient.from("borrow_transactions").update({status:"Returned",date_returned:today()}).eq("id",id).neq("status","Returned").select("id");
 if(error||!done?.length){msg(error?.message||"This transaction was already returned.",true);return;}
 const {error:eqErr}=await supabaseClient.from("equipment").update({availability:"Available"}).eq("id",t.equipment_id);
 if(eqErr){msg("Return recorded, but equipment availability update failed: "+eqErr.message,true);return;}msg("Equipment returned successfully.");await refresh();
});
["equipmentSearch","transactionSearch"].forEach(id=>$(id).addEventListener("input",render));
["availabilityFilter","statusFilter"].forEach(id=>$(id).addEventListener("change",render));
supabaseClient.auth.onAuthStateChange((_event,session)=>{if(!session&&currentUser){currentUser=null;$("appView").classList.add("hidden");$("authView").classList.remove("hidden");}});
init();