// Informações de credenciais do Google
const CLIENT_ID = "109333146457-5nbhc5jvhqare3kg6ubbe3vmbi118rg0.apps.googleusercontent.com";
const API_KEY = "AIzaSyBdfacuYMZ1iEZKJR4ddQKN9iqekl6sORU";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
//14:08
// Variáveis para o token e inicialização
let tokenClient;
let gapiInitialized = false;
let gisInitialized = false;

// Inicializa o cliente GAPI
function initializeGAPI() {
    gapi.load("client", async () => {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        });
        gapiInitialized = true;
        console.log("GAPI Inicializado");
    });
}

// Inicializa o GIS (Google Identity Services)
function initializeGIS() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            if (response.error) {
                console.error("Erro ao obter token:", response);
                return;
            }
            console.log("Token recebido:", response.access_token);
        },
    });
    gisInitialized = true;
    console.log("GIS Inicializado");
}

// Função de login do Google
function handleLogin() {
    if (gapiInitialized && gisInitialized) {
        tokenClient.requestAccessToken();
        window.location.href='informativos.html'
    } else {
        alert("Erro ao inicializar o Google Login. Tente novamente.");
    }
}

// Cria um evento no Google Calendar
function createEvent() {
    // Captura os valores do formulário
    const title = document.getElementById('event-title').value;
    const location = document.getElementById('event-location').value;
    const description = document.getElementById('event-description').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const email = document.getElementById('email').value;

    // Validação básica de campos
    if (!title || !startDate || !endDate) {
        alert("Por favor, preencha todos os campos obrigatórios!");
        return;
    }

    // Monta o objeto do evento
    const event = {
        summary: title,
        location: location,
        description: description,
        start: {
            dateTime: startDate,
            timeZone: 'America/Sao_Paulo'
        },
        end: {
            dateTime: endDate,
            timeZone: 'America/Sao_Paulo'
        },
        attendees: [{ email: email }], // Convidados
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 10 }
            ]
        }
    };

    // Verifica se o token foi obtido antes de criar o evento
    gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
    }).then((response) => {
        alert(`Evento criado com sucesso! Link: ${response.result.htmlLink}`);
        console.log("Evento criado:", response.result);
    }).catch((error) => {
        alert("Erro ao criar o evento.");
        console.error("Erro ao criar o evento:", error);
    });
}

const createEventButton = document.getElementById("create-event-button");
// Adiciona eventos aos botões
document.addEventListener("DOMContentLoaded", () => {
    initializeGAPI();
    initializeGIS();

    const loginButton = document.getElementById("login-button");

    if (loginButton) {
        loginButton.addEventListener("click", handleLogin);
    } else {
        console.error("Botão de login não encontrado no DOM!");
    }

    if (createEventButton) {
        createEventButton.addEventListener("click", createEvent);
    } else {
        console.error("Botão de criação de evento não encontrado no DOM!");
    }
});
