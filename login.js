const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
  ? 'http://localhost:4000/api/auth' 
  : '/api/auth';

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
  };

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include"  // <-- Ajouté pour permettre l'envoi des cookies
    });

    if (!res.ok) {
  const errorText = await res.text();
  console.error("Erreur API:", res.status, errorText);
  alert(result.error || "Erreur de connexion");
  return;
}
  

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Erreur de connexion");
      return;
    }

    // ✅ STOCKAGE CORRECT
    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("refreshToken", result.refreshToken);
    localStorage.setItem("boltUserData", JSON.stringify(result.user));

    // ✅ REDIRECTION GARANTIE
    const role = result.user.role;

    if (role === "driver") {
      window.location.href = "chauffeur.html";
    } else {
      window.location.href = "accueil.html";
    }

  }catch (err) {
  console.error("Fetch error:", err);
  alert("Erreur de connexion au serveur");
}
});
