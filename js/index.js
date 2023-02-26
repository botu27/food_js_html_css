window.addEventListener("DOMContentLoaded", () => {

    // header menu tabs and its controllers

    // header tabs which contains menus
    const tabs = document.querySelectorAll(".tabheader__item");
    // headers tabs content
    const tabsContent = document.querySelectorAll(".tabcontent");
    // parent of control buttons in header
    const tabsParent = document.querySelector(".tabheader__items");

    // toggle visibility of tabs in header which contains different menus
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add("hide");
            item.classList.remove("show", "fade");
        });

        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active");
        });
    }

    // toggle active class of the selected / unselected menu tab
    function showTabContent(i = 0) {
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");
        tabs[i].classList.add("tabheader__item_active");
    }

    // event delegation... button controlles delegates click to its buttons
    tabsParent.addEventListener("click", (event) => {
        const target = event.target;
        if (target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    });

    hideTabContent();
    showTabContent();

    // Count down timer
    const deadline = "2023-07-15";

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date());
        let days = 0;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        if (t > 0) {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((t / (1000 * 60)) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            total: t, days, hours, minutes, seconds
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector);
        const days = timer.querySelector("#days");
        const hours = timer.querySelector("#hours");
        const minutes = timer.querySelector("#minutes");
        const seconds = timer.querySelector("#seconds");
        const timerInterval = setInterval(updateClock, 1000);

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            // in case out of bounds, reset interval
            if (t.total <= 0) {
                clearInterval(timerInterval);
            }
        }

        function getZero(t) {
            return t < 10 && t >= 0 ? ('0' + t) : t;
        }
    }

    setClock(".timer", deadline);

    // Modal windows
    const modalOpen = document.querySelectorAll("[data-modal]");
    const modalClose = document.querySelector("[data-close]");
    const modalWindow = document.querySelector(".modal");

    function openModal() {
        modalWindow.classList.add("modal_open");
        document.body.style.overflow = "hidden";
        clearInterval(modalTimerId);
    }

    modalOpen.forEach(t => {
        t.addEventListener("click", (e) => {
            openModal();
        });
    });

    modalClose.addEventListener("click", closeModal);

    modalWindow.addEventListener("click", (e) => {
        if (e.target == modalWindow) {
            closeModal();
        }
    })

    function closeModal() {
        modalWindow.classList.remove("modal_open");
        document.body.style.overflow = "";
    }

    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && modalWindow.classList.contains("modal_open")) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 5000);

    function showModalByScroll() {
        // console.log(window.scrollY + document.documentElement.clientHeight, document.documentElement.scrollHeight);
        if ((window.scrollY + document.documentElement.clientHeight + 5) >= document.documentElement.scrollHeight) {
            openModal();
            removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

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
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        ".menu .container"
    ).render();
});
