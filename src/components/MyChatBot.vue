<template>
  <div class="chatbot-container">
    <!-- Titre -->
    <div class="chatbot-header">
      <h1>ChatBot DPI</h1>
    </div>

    <div class="chat-window">
      <!-- Chat messages -->
      <div class="chat-log">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.sender]"
        >
          {{ message.text }}
        </div>
      </div>
    </div>

    <!-- Zone de sélection entre saisie libre et liste déroulante -->
    <div class="input-toggle">
      <label>
        <input
          type="radio"
          value="list"
          v-model="inputMode"
        />
        Liste déroulante
      </label>
      <label>
        <input
          type="radio"
          value="free"
          v-model="inputMode"
        />
        Saisie libre
      </label>
    </div>

    <!-- Zone de saisie -->
    <div class="input-area">
      <!-- Liste déroulante pour les catégories principales -->
      <div v-if="inputMode === 'list'">
        <label for="mainCategorySelect">Catégorie principale :</label>
        <select v-model="selectedMainCategory" @change="fetchSubCategories">
          <option value="" disabled>Choisissez une catégorie principale...</option>
          <option v-for="(category, index) in mainCategories" :key="index" :value="category">
            {{ category }}
          </option>
        </select>

        <!-- Liste déroulante pour les sous-catégories -->
        <label for="subCategorySelect">Sous-catégorie :</label>
        <select v-model="selectedSubCategory" @change="fetchQuestionsForSubCategory" :disabled="!selectedMainCategory">
          <option value="" disabled>Choisissez une sous-catégorie...</option>
          <option v-for="(subCategory, index) in subCategories" :key="index" :value="subCategory">
            {{ subCategory }}
          </option>
        </select>

        <!-- Liste déroulante pour les questions -->
        <label for="questionSelect">Question :</label>
        <select v-model="selectedQuestion" :disabled="!selectedSubCategory">
          <option value="" disabled>Choisissez une question...</option>
          <option v-for="(question, index) in questions" :key="index" :value="question">
            {{ question }}
          </option>
        </select>
        <button @click="sendMessage">Envoyer</button>
      </div>

      <!-- Saisie libre -->
      <div v-else>
        <input
          v-model="freeText"
          type="text"
          placeholder="Posez votre question..."
        />
        <button @click="sendMessage">Envoyer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyChatbot",
  data() {
    return {
      inputMode: "list", // "list" ou "free" pour basculer entre les modes
      selectedMainCategory: "", // Catégorie principale sélectionnée
      selectedSubCategory: "", // Sous-catégorie sélectionnée
      selectedQuestion: "", // Question sélectionnée dans la liste
      freeText: "", // Texte libre saisi par l'utilisateur
      mainCategories: [], // Liste des catégories principales
      subCategories: [], // Liste des sous-catégories
      questions: [], // Liste des questions
      messages: [], // Historique des messages
    };
  },
  created() {
    this.fetchMainCategories(); // Récupère les catégories principales au chargement
  },
  methods: {
    // Récupère les catégories principales depuis l'API
    async fetchMainCategories() {
      try {
        const response = await fetch("http://localhost:3001/api/categories");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des catégories principales");
        }
        this.mainCategories = await response.json();
      } catch (error) {
        console.error(error);
      }
    },

    // Récupère les sous-catégories pour une catégorie principale
    async fetchSubCategories() {
      if (!this.selectedMainCategory) return;

      try {
        const response = await fetch(`http://localhost:3001/api/categories/${this.selectedMainCategory}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des sous-catégories");
        }
        const categoryData = await response.json();
        this.subCategories = Object.keys(categoryData); // Sous-catégories
        this.selectedSubCategory = ""; // Réinitialise la sélection de sous-catégorie
        this.questions = []; // Réinitialise les questions
      } catch (error) {
        console.error(error);
      }
    },

    // Récupère les questions pour une sous-catégorie spécifique
    async fetchQuestionsForSubCategory() {
      if (!this.selectedSubCategory || !this.selectedMainCategory) return;

      try {
        const response = await fetch(
          `http://localhost:3001/api/categories/${this.selectedMainCategory}/${this.selectedSubCategory}/questions`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des questions");
        }
        this.questions = await response.json();
        this.selectedQuestion = ""; // Réinitialise la question après le changement de sous-catégorie
      } catch (error) {
        console.error(error);
      }
    },

    async sendMessage() {
      let userMessage = "";

      // Détermine le message à envoyer selon le mode
      if (this.inputMode === "list" && this.selectedQuestion) {
        userMessage = this.selectedQuestion;
        this.selectedQuestion = ""; // Réinitialise la sélection
      } else if (this.inputMode === "free" && this.freeText.trim()) {
        userMessage = this.freeText.trim();
        this.freeText = ""; // Réinitialise le champ texte
      } else {
        // Aucun message valide
        alert("Veuillez entrer une question !");
        return;
      }

      // Ajoute le message utilisateur dans l'historique
      this.messages.push({ sender: "user", text: userMessage });
      this.$nextTick(() => this.scrollToBottom());

      // Envoie la requête au backend pour récupérer la réponse
      await this.fetchBotResponse(userMessage);
    },

    async fetchBotResponse(userMessage) {
      try {
        const response = await fetch("http://localhost:3001/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la communication avec le serveur");
        }

        const data = await response.json();
        this.messages.push({ sender: "bot", text: data.reply });
        this.$nextTick(() => this.scrollToBottom());
      } catch (error) {
        console.error(error);
        this.messages.push({
          sender: "bot",
          text: "Une erreur est survenue. Réessayez plus tard.",
        });
      }
    },

    scrollToBottom() {
      const chatWindow = this.$el.querySelector(".chat-window");
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    },
  },
};
</script>


<style scoped>
/* Ajout d'une couleur de fond pour toute la page */
:host {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5; /* Couleur de fond */
}

.chatbot-container {
  width: 70%; /* Augmente la largeur pour occuper plus d'espace */
  max-width: 80%; /* Limite maximale de largeur */
  height: 80vh; /* La hauteur reste dynamique */
  margin: 20px auto; /* Centre horizontalement avec auto et ajoute un espace au-dessus */
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ajoute une ombre pour plus d'élégance */
}

/* Style du header */
.chatbot-header {
  background-color: #007bff;
  color: white;
  text-align: center;
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.chatbot-header h1 {
  margin: 0;
  font-size: 20px;
}

/* Fenêtre de chat */
.chat-window {
  flex: 1;
  padding: 10px;
  overflow-y: auto; /* Permet le scroll interne */
  background-color: white;
  border-bottom: 1px solid #ddd;
}

.chat-log .message {
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 5px;
  max-width: 100%;
  word-wrap: break-word;
}

.chat-log .user {
  background-color: #e1f5fe;
  align-self: flex-end;
}

.chat-log .bot {
  background-color: #e0e0e0;
}

/* Zone de saisie */
.input-area {
  width: 100%;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}


.input-area input {
  width: 70%;
  flex: 1;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
}

.input-area button {
  width: 20%;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.input-area button:hover {
  background-color: #0056b3;
}

.input-toggle {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-around;
}
</style>
