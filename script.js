// Stockage utilisateurs
let users = JSON.parse(localStorage.getItem("users")) || [];

// Plans d'investissement
const plans = [
  {montant:3000, revenu:500, duree:30, total:15000, img:"images/voiture_3000.png"},
  {montant:5000, revenu:800, duree:30, total:24000, img:"images/voiture_5000.png"},
  {montant:15000, revenu:2500, duree:30, total:75000, img:"images/voiture_15000.png"},
  {montant:20000, revenu:3300, duree:30, total:99000, img:"images/voiture_20000.png"},
  {montant:30000, revenu:5000, duree:30, total:150000, img:"images/voiture_30000.png"},
  {montant:50000, revenu:8500, duree:30, total:255000, img:"images/voiture_50000.png"},
  {montant:100000, revenu:17500, duree:30, total:525000, img:"images/voiture_100000.png"},
  {montant:200000, revenu:35000, duree:30, total:1050000, img:"images/voiture_200000.png"},
  {montant:500000, revenu:90000, duree:30, total:2700000, img:"images/voiture_500000.png"},
  {montant:750000, revenu:140000, duree:30, total:4200000, img:"images/voiture_750000.png"},
  {montant:1000000, revenu:180000, duree:30, total:5400000, img:"images/voiture_1000000.png"}
];

// -------------------- Inscription --------------------
document.getElementById("inscription-submit").onclick = function(){
  let pays = document.getElementById("inscription-pays").value.trim();
  let numero = document.getElementById("inscription-numero").value.trim();
  let surnom = document.getElementById("inscription-surnom").value.trim();
  let email = document.getElementById("inscription-email").value.trim();
  let password = document.getElementById("inscription-password").value.trim();
  
  if(!pays || !numero || !surnom || !email || !password){
    alert("Veuillez remplir tous les champs");
    return;
  }
  
  if(password.length<6 || !(/\d/.test(password) && /[a-zA-Z]/.test(password))){
    alert("Le mot de passe doit contenir au moins 6 caractères, chiffres et lettres");
    return;
  }
  
  if(users.some(u=>u.pays===pays && u.numero===numero)){
    alert("Ce compte existe déjà");
    return;
  }
  
  users.push({pays, numero, surnom, email, password, historique:[], solde:0});
  localStorage.setItem("users", JSON.stringify(users));
  alert(`${surnom}, votre compte a été créé avec succès`);
  document.getElementById("inscription-page").style.display="none";
  document.getElementById("dashboard-page").style.display="block";
};

// -------------------- Connexion --------------------
document.getElementById("aller-connexion").onclick = function(){
  document.getElementById("inscription-page").style.display="none";
  document.getElementById("connexion-page").style.display="block";
};

document.getElementById("connexion-submit").onclick = function(){
  let pays = document.getElementById("connexion-pays").value.trim();
  let numero = document.getElementById("connexion-numero").value.trim();
  let password = document.getElementById("connexion-password").value.trim();
  
  let user = users.find(u=>u.pays===pays && u.numero===numero && u.password===password);
  if(!user){
    alert("Identifiants incorrects");
    return;
  }
  alert(`${user.surnom}, connexion réussie`);
  document.getElementById("connexion-page").style.display="none";
  document.getElementById("dashboard-page").style.display="block";
};

// -------------------- Plans --------------------
function afficherPlans(){
  const container = document.getElementById("plans-container");
  container.innerHTML = "";
  plans.forEach(plan=>{
    const div = document.createElement("div");
    div.className="plan-card";
    div.innerHTML = `<img src="${plan.img}" alt="Plan">
                     <h3>${plan.montant} CFA</h3>
                     <p>Revenu quotidien : ${plan.revenu} CFA</p>
                     <p>Durée : ${plan.duree} jours</p>
                     <p>Total : ${plan.total} CFA</p>
                     <button onclick="investir(${plan.montant})">Investir</button>`;
    container.appendChild(div);
  });
}

function investir(montant){
  alert(`Vous avez choisi d'investir ${montant} CFA`);
}

// -------------------- Menu navigation --------------------
document.getElementById("btn-recharger").onclick = function(){
  document.getElementById("dashboard-page").style.display="none";
  document.getElementById("recharge-page").style.display="block";
};

document.getElementById("btn-retirer").onclick = function(){
  document.getElementById("dashboard-page").style.display="none";
  document.getElementById("retrait-page").style.display="block";
};

document.getElementById("btn-conditions").onclick = function(){
  alert("Conditions: Respectez les règles du site, minimum 750 CFA pour retrait, réinvestissez intelligemment...");
};

// Recharge OTP simulation
document.getElementById("recharge-continu").onclick = function(){
  document.getElementById("recharge-otp-page").style.display="block";
};

document.getElementById("recharge-confirm").onclick = function(){
  alert("Demande de recharge soumise avec succès. Email envoyé.");
  document.getElementById("recharge-page").style.display="none";
  document.getElementById("dashboard-page").style.display="block";
};

// Retrait simulation
document.getElementById("retrait-confirm").onclick = function(){
  alert("Demande de retrait soumise avec succès. Email envoyé.");
  document.getElementById("retrait-page").style.display="none";
  document.getElementById("dashboard-page").style.display="block";
};

// Afficher les plans quand page chargée
window.onload = function(){
  afficherPlans();
};