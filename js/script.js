"use strict";

window.addEventListener("DOMContentLoaded", () => {

    // Tabs
    // Получаем необходимые элементы
    const tabs = document.querySelectorAll(".tabheader__item"),
          tabsContent = document.querySelectorAll(".tabcontent"),
          tabsParent = document.querySelector(".tabheader__items");

    // Скрывает неиспользуемые вкладки
    function hideTabContent () {
        tabsContent.forEach(item => {
            item.classList.add("hide");
            item.classList.remove("show", "fade");
        });
        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active");
        });
    }

    // Отображает текущую вкладку
    function showTabContent(i = 0) {
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    // Делегируем события родителя, назначаем обработчик
    tabsParent.addEventListener("click", (event) => {
        const target = event.target;
        console.log(event.target);

        if (target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer
    const deadline = "2021-07-05";

    // Устанавливает таймер
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60)) % 24),
              minutes = Math.floor((t / (1000 * 60)) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            "total": t,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds,
        };
    }

    // Проверяет значение числа
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    // Устанавливает таймер на страницу
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector("#days"),
              hours = timer.querySelector("#hours"),
              minutes = timer.querySelector("#minutes"),
              seconds = timer.querySelector("#seconds"),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();
        
        // Обновляет таймер
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock(".timer", deadline);

    // Modal
    // Создаем модальное окно
    const modalTrigger = document.querySelectorAll("[data-modal]"),
          modal = document.querySelector(".modal");

    modalTrigger.forEach(btn => {
    btn.addEventListener("click", openModal);
    });
  
    // Открывает модальное окно
    function openModal () {
        modal.classList.add("show");
        modal.classList.remove("hide");
        document.body.style.overflow = "hidden";
        clearInterval(modalTimerId);
    }

    // Закрывает модальное окно
    function closeModal () {
        modal.classList.add("hide");
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }

    // Закрывает модальное окно при клике на подложку или "Х"
    modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.getAttribute("data-close" == "")) {
            closeModal();
        }
    });

    // Закрывает модальное окно при нажатии клавиши ESC
    document.addEventListener("keydown", (event) => {
        if (event.code === "Escape" && modal.classList.contains("show")) {
        closeModal();
        }
    });

    // Показываем модальное окно через 10 секунд
    const modalTimerId = setTimeout(openModal, 50000);

    // Показывает модальное окно, если пользователь пролистал всю страницу
    function showModalByScroll () {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.
            documentElement.scrollHeight) {
                openModal();
                window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);

    // Classes
    // Используем классы для карточек меню

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 72; // пока статический курс валют
            this.changeToRub(); // сразу рассчитываем курс
        }
        // Конвертирует курс доллара в рубли
        changeToRub() {
            this.price = this.price * this.transfer;
        }

        // Формирует верстку
        render() {
            const element = document.createElement("div"); // создаем элемент "div"

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

             element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    // Отправляет GET-запрос. Формирует исключение для cat
    const getResorce = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // getResorce("http://localhost:3000/menu")
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
    //         });
    //     });

    // Реализация динамической верстки с помощью axios
    axios.get("http://localhost:3000/menu")
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        });

    // Forms

    const forms = document.querySelectorAll("form");

    // Создаем объект для вывода текста сообщений
    const message = {
        loading: "img/form/spinner.svg",
        success: "Спасибо! Скоро мы с вами свяжемся",
        failure: "Что-то пошло не так ...",
    };

    // Связываем формы с функцией postData
    forms.forEach(item => {
        bindPostData(item);
    });

    // Настраивает POST-запрос
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: data
        });

        return await res.json();
    };

    // Функция отвечает за постинг данных
    function bindPostData(form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const statusMessage = document.createElement("img");
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement("afterend", statusMessage);


            // // Запрос с FormData
            // const formData = new FormData(form);

            // fetch("server.php", {
            //     method: "POST",
            //     // headers: {
            //     //     "Content-type": "application/json"
            //     // },
            //     body: formData
            // })
            // .then(data => data.text())
            // .then(data => {
            //     console.log(data);
            //     showThanksModal(message.success);
            //     statusMessage.remove();
            // })
            // .catch(() => {
            //     showThanksModal(message.failure);
            // })
            // .finally(() => {
            //     form.reset();
            // });

            // Запрос с JSON
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData("http://localhost:3000/requests", json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        });
    }

    // После постинга показывает второе модальное окно с сообщением
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector(".modal__dialog");

        prevModalDialog.classList.add("hide");
        openModal();

        const thanksModal = document.createElement("div");
        thanksModal.classList.add("modal__dialog");

        // Формируем верстку модального окна
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector(".modal").append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add("show");
            prevModalDialog.classList.remove("hide");
            closeModal();
        }, 4000);
    }

    // Получаем доступ к БД
    fetch("db.json")
        .then(data => data.json())
        .then(res => console.log(res));
});