const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photoResult = document.getElementById('photoResult');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const btnCapture = document.getElementById('btnCapture');
const filterSelect = document.getElementById('filterSelect');
const studentNameInput = document.getElementById('studentName');
const errorMsg = document.getElementById('errorMsg');
const resultContainer = document.getElementById('resultContainer');

let mediaStream = null;

// Função para Ligar a Câmera (RF01 e RF07)
btnStart.addEventListener('click', async () => {
    errorMsg.textContent = '';
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: false 
        });
        video.srcObject = mediaStream;
        
        btnStart.disabled = true;
        btnStop.disabled = false;
        btnCapture.disabled = false;
    } catch (error) {
        console.error("Erro ao acessar a câmera:", error);
        errorMsg.textContent = "Erro: Permissão negada ou câmera indisponível no dispositivo.";
    }
});

// Função para Desligar a Câmera Corretamente (RF06 e Bônus / Dica analítica)
btnStop.addEventListener('click', () => {
    if (mediaStream) {
        // Percorre e encerra todas as faixas (tracks) do stream para poupar hardware/energia
        mediaStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        mediaStream = null;

        btnStart.disabled = false;
        btnStop.disabled = true;
        btnCapture.disabled = true;
    }
});

// Função de Captura e Processamento no Canvas (RF02, RF03, RF04 e RF05)
btnCapture.addEventListener('click', () => {
    if (!mediaStream) {
        errorMsg.textContent = "A câmera não está ligada!";
        return;
    }

    const studentName = studentNameInput.value.trim() || "Aluno(a)";
    
    // Configura as dimensões do Canvas com base no vídeo atual
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext('2d');

    // RF03 — Aplica o filtro visual escolhido via context.filter
    const selectedFilter = filterSelect.value;
    context.filter = selectedFilter;

    // Desenha a imagem atual do vídeo no Canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Reseta o filtro para desenhar o texto sem distorções de cor indesejadas
    context.filter = 'none';

    // Formata a Data e Hora atual
    const now = new Date();
    const dateTimeString = now.toLocaleString('pt-BR');

    // RF04 — Escreve dinamicamente o nome e a data/hora sobre a foto
    context.fillStyle = 'rgba(0, 0, 0, 0.6)'; // Fundo translúcido para leitura
    context.fillRect(20, canvas.height - 80, canvas.width - 40, 60);

    context.fillStyle = '#FFFFFF';
    context.font = 'bold 20px Arial';
    context.fillText(`Nome: ${studentName}`, 35, canvas.height - 45);
    context.font = '16px Arial';
    context.fillText(`Data/Hora: ${dateTimeString}`, 35, canvas.height - 20);

    // RF05 — Converte o canvas para imagem e exibe na interface
    const dataURL = canvas.toDataURL('image/png');
    photoResult.src = dataURL;
    resultContainer.style.display = 'block';
});