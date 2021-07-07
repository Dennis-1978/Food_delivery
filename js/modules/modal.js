// Modal
// Открывает модальное окно
function openModal (modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
    
    console.log(modalTimerId);
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

// Закрывает модальное окно
function closeModal (modalSelector) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "";
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    // Создаем модальное окно
    const modalTrigger = document.querySelectorAll(triggerSelector),
          modal = document.querySelector(modalSelector);

    modalTrigger.forEach(btn => {
    btn.addEventListener("click", () => openModal(modalSelector, modalTimerId));
    });
      
    // Закрывает модальное окно при клике на подложку или "Х"
    modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.getAttribute("data-close" == "")) {
            closeModal(modalSelector);
        }
    });

    // Закрывает модальное окно при нажатии клавиши ESC
    document.addEventListener("keydown", (event) => {
        if (event.code === "Escape" && modal.classList.contains("show")) {
        closeModal(modalSelector);
        }
    });

    // Показывает модальное окно, если пользователь пролистал всю страницу
    function showModalByScroll () {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.
            documentElement.scrollHeight) {
                openModal(modalSelector, modalTimerId);
                window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);
}

export default modal;
export {openModal};
export {closeModal};