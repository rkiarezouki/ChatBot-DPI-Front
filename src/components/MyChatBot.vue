<template>
  <div class="chatbot-container">
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
  name: 'MyChatbot',  // Nom du composant changé ici
  data() {
    return {
      userInput: '',
      messages: []
    };
  },
  methods: {
    sendMessage() {
      if (this.userInput.trim()) {
        // Ajouter le message de l'utilisateur
        this.messages.push({ sender: 'user', text: this.userInput });

        // Effacer l'input après l'envoi du message
        this.userInput = '';

        // Simuler une réponse du bot
        this.simulateBotResponse();
      }
    },
    simulateBotResponse() {
      // Réponse du bot après un délai de 500ms
      setTimeout(() => {
        const botResponse = `Bot: Vous avez dit "${this.messages[this.messages.length - 1].text}"`;
        this.messages.push({ sender: 'bot', text: botResponse });
      }, 500);
    }
  }
};
</script>

<style scoped>
.chatbot-container {
  width: 400px;
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
}

.chat-window {
  flex: 1;
  padding: 10px;
  overflow-y: scroll;
  background-color: white;
  border-bottom: 1px solid #ddd;
}

.chat-log .message {
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 5px;
  max-width: 75%;
  word-wrap: break-word;
}

.chat-log .user {
  background-color: #e1f5fe;
  align-self: flex-end;
}

.chat-log .bot {
  background-color: #e0e0e0;
}

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
