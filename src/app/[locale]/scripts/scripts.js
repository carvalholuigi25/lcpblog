console.log('loaded scripts.js!');

function setMySystemTheme() {
    const htmlth = document.querySelector('html');
    if(htmlth && htmlth.getAttribute("data-bs-theme") == "system") {
        const hours = new Date().getHours();
        htmlth.setAttribute("data-bs-theme", (hours >= 6 && hours < 18 ? "light" : "dark"));
    }
}

function RemovePaddingOffCanvas() {
    const myoffcanvas = document.querySelectorAll('.offcanvas')[0];

    if(myoffcanvas) {
        myoffcanvas.addEventListener('shown.bs.offcanvas', () => {
            if(document.body.style.getPropertyValue("padding-right")) {
                document.body.style.removeProperty("padding-right");
            }

            if(document.querySelector(".navbar").style.getPropertyValue("padding-right")) {
                document.querySelector(".navbar").style.removeProperty("padding-right");
            }
        });
    }
}

RemovePaddingOffCanvas();
setMySystemTheme();

clearInterval();
setInterval(() => {
    setMySystemTheme();
}, 1000 * 60 * 60);