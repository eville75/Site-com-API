// Função de login
function login(event) {
    event.preventDefault(); // Previne o envio do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Dados de login fixos para teste
    const validEmail = "usuario@teste.com";
    const validPassword = "12345";

    if (email === validEmail && password === validPassword) {
        // Login bem-sucedido - redireciona para a página de agendamentos
        window.location.href = "informativos.html";
    } else {
        // Exibe mensagem de erro
        errorMessage.textContent = "E-mail ou senha incorretos. Tente novamente.";
        errorMessage.style.display = "block"; // Mostra a mensagem de erro
    }
}

// Array com os horários disponíveis
const horariosDisponiveis = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
];

// Seleciona os elementos de data e horários
const dateInput = document.getElementById("appointmentDate");
const timesContainer = document.getElementById("times");
const confirmButton = document.getElementById("confirmButton");

let horarioSelecionado = null; // Armazena o horário selecionado pelo usuário

// Função para gerar os horários na interface
function gerarHorarios() {
    timesContainer.innerHTML = ""; // Limpa os horários antigos
    horarioSelecionado = null; // Reseta o horário selecionado

    horariosDisponiveis.forEach(horario => {
        const timeButton = document.createElement("button");
        timeButton.textContent = horario;
        timeButton.className = "time-btn";

        // Adiciona um evento de clique ao botão de horário
        timeButton.addEventListener("click", () => {
            horarioSelecionado = horario;
            document.querySelectorAll(".time-btn").forEach(btn => btn.classList.remove("selected"));
            timeButton.classList.add("selected");
        });

        timesContainer.appendChild(timeButton);
    });
}

// Evento que dispara ao selecionar uma data
dateInput.addEventListener("change", () => {
    if (dateInput.value) {
        const selectedDate = new Date(dateInput.value);
        const dayOfWeek = selectedDate.getDay();

        // Verifica se é sábado (6) ou domingo (0)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            alert("Sábados e domingos não estão disponíveis para agendamento.");
            dateInput.value = ''; // Limpa a seleção de data
            timesContainer.innerHTML = ''; // Limpa os horários
        } else {
            gerarHorarios();
        }
    }
});

// Função de confirmação de agendamento
confirmButton.addEventListener("click", () => {
    const tipoAtendimento = document.getElementById("type").value;
    const dataSelecionada = dateInput.value;

    if (!dataSelecionada || !horarioSelecionado) {
        alert("Por favor, selecione uma data e um horário para confirmar o agendamento.");
        return;
    }

    alert(`Agendamento confirmado!\nTipo: ${tipoAtendimento}\nData: ${dataSelecionada}\nHorário: ${horarioSelecionado}`);
});

// Validação de data para desativar sábados e domingos
document.getElementById("appointmentDate").addEventListener("change", function() {
    const data = new Date(this.value + "T00:00"); // Adiciona o horário para evitar problemas de fuso horário
    const diaSemana = data.getDay();

    // Verifica se o dia é sábado (6) ou domingo (0)
    if (diaSemana === 0 || diaSemana === 6) {
        document.getElementById("error-message").style.display = "block";
        this.value = ""; // Limpa a data selecionada
    } else {
        document.getElementById("error-message").style.display = "none";
    }
});
