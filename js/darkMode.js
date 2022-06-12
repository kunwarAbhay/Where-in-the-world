const darkModeBtn = document.querySelector(".btn--dark-mode");
const body = document.querySelector("body");


class Mode {
    constructor() {
        this.setMode();
        darkModeBtn.addEventListener("click", this.changeMode);
    }

    changeMode = function () {
        if (localStorage.getItem("dark-mode") === "0") {
            localStorage.setItem("dark-mode", "1"); // Dark mode enabled
            darkModeBtn.querySelector("span").textContent = "Light Mode";
            body.classList.add("dark-mode");
        }
        else {
            localStorage.setItem("dark-mode", "0"); // Dark mode disabled
            darkModeBtn.querySelector("span").textContent = "Dark Mode";
            body.classList.remove("dark-mode");
        }
    }

    setMode = function () {
        if (localStorage.getItem("dark-mode") === "1") {
            darkModeBtn.querySelector("span").textContent = "Light Mode";
            body.classList.add("dark-mode");
        }
        else {
            darkModeBtn.querySelector("span").textContent = "Dark Mode";
            body.classList.remove("dark-mode");
        }
    }
}

const mode = new Mode();