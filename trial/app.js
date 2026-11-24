import {categoryData} from "../js/categories.js";

// データはこのページが開いている間だけメモリー上に保持します。
// localStorage / sessionStorage / IndexedDB / Firebase は使用しません。
const $=id=>document.getElementById(id);
const blank=()=>({products:[],settings:{heroImage:"",logoImage:"",title:"おトク発見ナビ"}});
let state=blank();
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const links=p=>[
 p.amazonUrl&&{label:"Amazonで見る",url:p.amazonUrl},
 p.rakutenUrl&&{label:"楽天市場で見る",url:p.rakutenUrl},
 p.otherUrl&&{label:(p.otherStoreName||"その他")+"で見る",url:p.otherUrl}
].filter(Boolean);
function fileData(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
function setStatus(id,msg){const el=$(id);if(el)el.textContent=msg;}
function showView(){
 const admin=location.hash==="#admin";
 $("homeView").hidden=admin;$("adminView").hidden=!admin;
 $("adminLink").textContent=admin?"メイン画面へ戻る":"管理画面";
 $("adminLink").href=admin?"#":"#admin";
 if(!admin)render();
}
window.addEventListener("hashchange",showView);

const main=$("mainCategory"),sub=$("subCategory");
Object.keys(categoryData).forEach(n=>{main.add(new Option(n,n));$("filterMain").add(new Option(n,n));});
function updateSub(selected=""){sub.innerHTML='<option value="">中カテゴリーを選択</option>';(categoryData[main.value]||[]).forEach(n=>sub.add(new Option(n,n)));sub.value=selected;}
main.addEventListener("change",()=>updateSub());
$("filterMain").addEventListener("change",()=>{$("filterSub").innerHTML='<option value="">すべて</option>';(categoryData[$("filterMain").value]||[]).forEach(n=>$("filterSub").add(new Option(n,n)));render();});
$("filterSub").addEventListener("change",render);
$("search").addEventListener("input",render);$("sort").addEventListener("change",render);

function drawAdmin(){
 const list=$("productList");list.innerHTML="";
 if(!state.products.length){list.innerHTML='<p class="empty">商品はまだ登録されていません。</p>';return;}
 state.products.forEach(p=>{
  const item=document.createElement("article");item.className="item";
  item.innerHTML=(p.image?'<img src="'+p.image+'" alt="">':'')+'<div class="item-info"><b>'+esc(p.name)+'</b><small>'+esc(p.mainCategory)+' ＞ '+esc(p.subCategory)+'</small></div><button type="button" class="remove">削除</button>';
  item.querySelector(".remove").addEventListener("click",()=>{if(!confirm("「"+p.name+"」を削除しますか？"))return;state.products=state.products.filter(x=>x.id!==p.id);drawAdmin();render();});
  list.append(item);
 });
}
$("productForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const name=$("name").value.trim(),url=$("amazonUrl").value.trim()||$("rakutenUrl").value.trim()||$("otherUrl").value.trim();
 if(!name||!main.value||!sub.value||!url){alert("商品名・大カテゴリー・中カテゴリー・販売リンクを入力してください。");return;}
 if(!/^https:\/\//i.test(url)){alert("販売リンクはhttps://から始まるURLを入力してください。");return;}
 const file=$("imageFile").files[0];let image="";
 try{if(file)image=await fileData(file);}catch{alert("画像を読み込めませんでした。");return;}
 state.products.push({id:Date.now()+Math.random(),name,mainCategory:main.value,subCategory:sub.value,description:$("description").value.trim(),image,amazonUrl:$("amazonUrl").value.trim(),rakutenUrl:$("rakutenUrl").value.trim(),otherUrl:$("otherUrl").value.trim(),otherStoreName:$("otherStoreName").value.trim()});
 e.target.reset();updateSub();$("imagePreview").hidden=true;drawAdmin();render();setStatus("formStatus","商品を追加しました。メイン画面で確認できます。");
});
$("imageFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{$("imagePreview").src=await fileData(f);$("imagePreview").hidden=false;}catch{setStatus("formStatus","画像を読み込めませんでした。");}});
$("clearAll").addEventListener("click",()=>{if(!confirm("商品・画像・サイト設定・入力内容をすべて消去しますか？この操作は取り消せません。"))return;state=blank();$("productForm").reset();$("siteTitleInput").value=state.settings.title;$("heroFile").value="";$("logoFile").value="";$("imagePreview").hidden=true;drawAdmin();render();setStatus("formStatus","すべてのデータを消去しました。");});
$("saveSettings").addEventListener("click",async()=>{try{const hero=$("heroFile").files[0],logo=$("logoFile").files[0];if(hero)state.settings.heroImage=await fileData(hero);if(logo)state.settings.logoImage=await fileData(logo);state.settings.title=$("siteTitleInput").value.trim()||"おトク発見ナビ";applySettings();setStatus("settingsStatus","設定を反映しました。");}catch{setStatus("settingsStatus","画像を読み込めませんでした。");}});
function applySettings(){$("siteTitle").textContent=state.settings.title;if(state.settings.logoImage){$("siteLogo").src=state.settings.logoImage;$("siteLogo").hidden=false;}else $("siteLogo").hidden=true;if(state.settings.heroImage){$("heroImage").src=state.settings.heroImage;$("heroImage").hidden=false;}else $("heroImage").hidden=true;}
function render(){
 const keyword=$("search").value.trim().toLowerCase(),mc=$("filterMain").value,sc=$("filterSub").value;
 let products=state.products.filter(p=>(!mc||p.mainCategory===mc)&&(!sc||p.subCategory===sc)&&[p.name,p.description,p.mainCategory,p.subCategory].join(" ").toLowerCase().includes(keyword));
 if($("sort").value==="name")products.sort((a,b)=>a.name.localeCompare(b.name,"ja"));
 $("count").textContent=products.length+"件";$("productGrid").innerHTML="";
 if(!products.length){$("productGrid").innerHTML='<p class="empty">商品がありません。管理画面から商品を追加してください。</p>';return;}
 products.forEach(p=>{const card=document.createElement("article");card.className="card";const img=p.image?'<img src="'+p.image+'" alt="'+esc(p.name)+'">':'<span>🛍️</span>';card.innerHTML='<div class="photo">'+img+'</div><small>'+esc(p.mainCategory)+' ＞ '+esc(p.subCategory)+'</small><h3>'+esc(p.name)+'</h3><p>'+esc(p.description)+'</p><button type="button" class="detail">詳細・販売先を見る</button>';card.querySelector(".detail").addEventListener("click",()=>{const urls=links(p);$("detailContent").innerHTML='<h2>'+esc(p.name)+'</h2>'+(p.image?'<img class="detail-image" src="'+p.image+'" alt="">':'')+'<p>'+esc(p.description)+'</p>'+urls.map(x=>'<a class="buy" href="'+esc(x.url)+'" target="_blank" rel="noopener">'+esc(x.label)+'</a>').join("");$("detailDialog").showModal();});$("productGrid").append(card);});
}
$("closeDetail").addEventListener("click",()=>$("detailDialog").close());
$("siteTitleInput").value=state.settings.title;applySettings();drawAdmin();showView();
