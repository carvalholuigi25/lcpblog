console.log('loaded scripts.js!');

const myoffcanvas = document.querySelectorAll('.offcanvas')[0];

if(myoffcanvas) {
    myoffcanvas.addEventListener('shown.bs.offcanvas', () => {
        if(document.body.style.getPropertyValue("padding-right")) {
            document.body.style.removeProperty("padding-right");
        }
    });
}
