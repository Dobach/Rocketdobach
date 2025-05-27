let timer = null;
let totalSeconds = 0;
let elapsedSeconds = 0;
let intervals = [];

document.getElementById("addInterval").addEventListener("click", () => {
    const intervalDiv = document.createElement("div");
    intervalDiv.className = "interval";
    intervalDiv.innerHTML = `
        <input type="number" placeholder="Minutos" min="0" class="minutes">
        <input type="number" placeholder="Segundos" min="0" max="59" class="seconds">
        <input type="url" placeholder="URL del sonido" class="sound">
        <button type="button" class="remove">Eliminar</button>
    `;
    intervalDiv.querySelector(".remove").addEventListener("click", () => {
        intervalDiv.remove();
    });
    document.getElementById("intervalInputs").appendChild(intervalDiv);
});

function updateDisplay() {
    const remaining = Math.max(0, totalSeconds - elapsedSeconds);
    const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
    const secs = String(remaining % 60).padStart(2, '0');
    document.getElementById("timerDisplay").textContent = `${mins}:${secs}`;
}

document.getElementById("startButton").addEventListener("click", () => {
    if (timer) return; // Evitar múltiples temporizadores

    const mins = parseInt(document.getElementById("countdownMinutes").value) || 0;
    const secs = parseInt(document.getElementById("countdownSeconds").value) || 0;
    totalSeconds = mins * 60 + secs;
    elapsedSeconds = 0;

    // Configurar intervalos dinámicos
    intervals = Array.from(document.querySelectorAll(".interval")).map(div => {
        const min = parseInt(div.querySelector(".minutes").value) || 0;
        const sec = parseInt(div.querySelector(".seconds").value) || 0;
        const sound = div.querySelector(".sound").value;
        return {
            interval: min * 60 + sec,
            sound
        };
    }).filter(i => i.interval > 0 && i.sound);

    // Ordenar intervalos por duración descendente para priorizar el más largo en caso de coincidencia
    intervals.sort((a, b) => b.interval - a.interval);

    document.getElementById("statusDisplay").textContent = "Estado: En progreso";
    updateDisplay();

    timer = setInterval(() => {
        elapsedSeconds++;

        updateDisplay();

        // Revisar si hay algún sonido que debe sonar en este momento
        for (let intervalObj of intervals) {
            if (elapsedSeconds % intervalObj.interval === 0) {
                new Audio(intervalObj.sound).play();
                break; // Solo sonará el primer (mayor) intervalo que coincida
            }
        }

        if (elapsedSeconds >= totalSeconds) {
            clearInterval(timer);
            timer = null;
            document.getElementById("statusDisplay").textContent = "Estado: Terminado";
        }
    }, 1000);
});

document.getElementById("stopButton").addEventListener("click", () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
        document.getElementById("statusDisplay").textContent = "Estado: Detenido";
    }
});
