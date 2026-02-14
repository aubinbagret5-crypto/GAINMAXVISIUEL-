let users = []; // Users.json simulé
let retraits = []; // Retrait.json simulé
let currentUser = null;

// --- Inscription
document.getElementById("signup-btn").addEventListener("click", () => {
  const nom = document.getElementById("signup-nom").value;
  const numero = document.getElementById("signup-numero").value;
  const password = document.getElementById("signup-password").value;

  if(password.length<6) { alert("Mot de passe doit avoir au moins 6 caractères"); return; }
  if(users.find(u=>u.numero===numero)){ alert("Numéro déjà utilisé, connectez-vous"); return; }

  users.push({nom, numero, password, solde:0, investissements:[]});
  alert("Votre compte a été créé avec succès");
  document.getElementById("signup-section").style.display="none";
  document.getElementById("login-section").style.display="block";
});

// --- Connexion
document.getElementById("login-btn").addEventListener("click", () => {
  const numero = document.getElementById("login-numero").value;
  const password = document.getElementById("login-password").value;
  const user = users.find(u=>u.numero===numero && u.password===password);
  if(!user){ alert("Utilisateur ou mot de passe incorrect"); return; }
  currentUser = user;
  document.getElementById("login-section").style.display="none";
  document.getElementById("main-menu").style.display="block";
  document.getElementById("accueil-section").style.display="block";
});

// --- Menu navigation
document.getElementById("menu-accueil").addEventListener("click", ()=>{ showSection("accueil"); });
document.getElementById("menu-plan").addEventListener("click", ()=>{ showSection("plan"); renderPlans(); });
document.getElementById("menu-partager").addEventListener("click", ()=>{ showSection("partager"); renderPartager(); });
document.getElementById("menu-moi").addEventListener("click", ()=>{ showSection("moi"); renderMoi(); });

function showSection(section){
  ["accueil","plan","partager","moi"].forEach(s=>{
    document.getElementById(`${s}-section`).style.display = s===section?"block":"none";
  });
}

// --- Plans d'investissement
const plans = [
  {montant:3000, revenu:500, duree:30},
  {montant:5000, revenu:800, duree:30},
  {montant:10000, revenu:1500, duree:30},
  {montant:25000, revenu:4000, duree:30},
  {montant:50000, revenu:8000, duree:30},
  {montant:100000, revenu:16000, duree:30}
];

function renderPlans(){
  const container = document.getElementById("plan-section");
  container.innerHTML="";
  plans.forEach((p,i)=>{
    const card = document.createElement("div");
    card.className="plan-card";
    card.innerHTML=`<strong>Plan ${i+1}</strong><br>
      Montant: ${p.montant} FCFA<br>
      Revenu quotidien: ${p.revenu} FCFA<br>
      Durée: ${p.duree} jours<br>
      <button class="invest-btn">Investir</button>`;
    container.appendChild(card);

    card.querySelector(".invest-btn").addEventListener("click",()=>{
      if(!currentUser){ alert("Veuillez créer un compte pour investir"); return; }
      if(currentUser.solde<p.montant){ alert("Solde insuffisant"); return; }
      currentUser.solde -= p.montant;
      currentUser.investissements.push({plan:i, date:new Date()});
      alert("Produit acheté avec succès");
    });
  });
}

// --- Assistance IA
const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

chatToggle.addEventListener("click", ()=>{ chatBox.style.display = chatBox.style.display==="none"?"flex":"none"; });

const responses = {
  "inscrire":"Pour créer un compte, cliquez sur 'S’inscrire', remplissez vos informations, puis validez.",
  "comment créer un compte":"Pour créer un compte, cliquez sur 'S’inscrire', remplissez le formulaire et validez.",
  "mot de passe oublié":"Cliquez sur 'Mot de passe oublié' et suivez les instructions pour récupérer votre accès.",
  "recharger":"Allez dans Accueil → Recharge pour ajouter du solde à votre compte.",
  "retrait":"Le retrait minimum est de 500 FCFA. Suivez les étapes de retrait dans Accueil → Retrait.",
  "investir":"Choisissez un plan dans Plans, assurez-vous d’avoir assez de solde puis cliquez sur Investir.",
  "solde insuffisant":"Votre solde est insuffisant. Recharger d’abord votre compte pour investir.",
  "parrainage":"Votre code de parrainage se trouve dans Partager. Vous gagnez un bonus quand le lien est utilisé."
};

chatSend.addEventListener("click", ()=>{
  const question = chatInput.value.trim().toLowerCase();
  if(!question) return;

  const qDiv = document.createElement("div");
  qDiv.textContent="Vous: "+chatInput.value; qDiv.style.fontWeight="bold";
  chatMessages.appendChild(qDiv);

  let answered=false;
  for(let key in responses){
    if(question.includes(key)){
      if((key==="recharger"||key==="retrait"||key==="investir"||key==="solde insuffisant")&&!currentUser){
        const aDiv=document.createElement("div");
        aDiv.textContent="Assist: Veuillez créer un compte pour utiliser cette fonctionnalité.";
        chatMessages.appendChild(aDiv);
      } else {
        const aDiv=document.createElement("div");
        aDiv.textContent="Assist: "+responses[key];
        chatMessages.appendChild(aDiv);
      }
      answered=true; break;
    }
  }
  if(!answered){
    const aDiv=document.createElement("div");
    aDiv.textContent="Assist: Merci pour votre question. Notre équipe vous répondra bientôt par email.";
    chatMessages.appendChild(aDiv);

    // Envoi mail automatique via serveur
    fetch("http://localhost:3000/send-assist-mail",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({question:chatInput.value,user:currentUser?currentUser.numero:"Non connecté"})
    }).catch(err=>console.log(err));
  }

  chatInput.value=""; chatMessages.scrollTop=chatMessages.scrollHeight;
});