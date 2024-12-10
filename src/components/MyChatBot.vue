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
    
    <!-- User input -->
    <div class="input-area">
      <input 
        v-model="userInput" 
        placeholder="Tapez votre message..." 
        @keyup.enter="sendMessage" 
      />
      <button @click="sendMessage">Envoyer</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyChatbot',
  data() {
    return {
      userInput: '', // Saisie de l'utilisateur
      messages: []   // Historique des messages
    };
  },
  methods: {
    async sendMessage() {
      // Vérification : message vide
      if (this.userInput.trim()) {
        // Ajoute le message utilisateur dans l'historique
        this.messages.push({ sender: 'user', text: this.userInput });

        const userMessage = this.userInput; // Sauvegarde le message
        this.userInput = ''; // Réinitialise le champ d'entrée
        this.$nextTick(() => this.scrollToBottom()); // Scroll en bas

        // Envoie la requête au backend pour récupérer la réponse
        await this.fetchBotResponse(userMessage);
      }
    },
    async fetchBotResponse(userMessage) {
      try {
        // Envoie de la requête au backend
        const response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage }) // Envoie du message
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la communication avec le serveur');
        }

        const data = await response.json(); // Récupère la réponse du backend

        // Ajoute la réponse du bot dans l'historique
        this.messages.push({ sender: 'bot', text: data.reply });
        this.$nextTick(() => this.scrollToBottom());
      } catch (error) {
        console.error(error);
        // Message d'erreur en cas de problème
        this.messages.push({ sender: 'bot', text: 'Une erreur est survenue. Réessayez plus tard.' });
      }
    },
    scrollToBottom() {
      // Scroll automatique vers le bas de la fenêtre
      const chatWindow = this.$el.querySelector('.chat-window');
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    }
  }
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
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}

.input-area input {
  flex: 1;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
}

.input-area button {
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
</style>
