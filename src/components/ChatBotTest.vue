<script>
export default {
  name: 'MyChatbot',
  data() {
    return {
      userInput: '',
      messages: []
    };
  },
  methods: {
    async sendMessage() {
      if (this.userInput.trim()) {
        // Ajouter le message de l'utilisateur dans le chat
        this.messages.push({ sender: 'user', text: this.userInput });

        const question = this.userInput; // Récupère la question à envoyer
        this.userInput = ''; // Réinitialiser l'input utilisateur

        try {
          // Appeler le backend et récupérer la réponse
          const response = await this.getBotResponse(question);

          // Ajouter la réponse du bot au chat
          this.messages.push({ sender: 'bot', text: response });
        } catch (error) {
          console.error('Erreur lors de l’appel au backend :', error);
          this.messages.push({
            sender: 'bot',
            text: 'Une erreur est survenue. Réessayez plus tard.'
          });
        }
      }
    },
    async getBotResponse(question) {
      // Utilisation de fetch pour envoyer la requête au backend
      const response = await fetch('https://chatbot-dpi-back.onrender.com/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l’appel au backend');
      }

      const data = await response.json();

      // Retourne la réponse du backend
      return data.answer; // Assure-toi que ton backend retourne ce format
    }
  }
};

/*BACKEND
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Pour autoriser les requêtes CORS depuis le frontend

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint pour gérer les questions du chatbot
app.post('/api/chatbot', (req, res) => {
  const question = req.body.question;

  // Logique pour traiter la question et générer une réponse
  let response;
  switch (question.toLowerCase()) {
    case 'bonjour':
      response = 'Bonjour ! Comment puis-je vous aider ?';
      break;
    case 'quelle est la capitale de la France ?':
      response = 'La capitale de la France est Paris.';
      break;
    default:
      response = "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ?";
  }

  // Envoyer la réponse au frontend
  res.json({ answer: response });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});*/

</script>

