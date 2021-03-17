---
title: "Инкапсуляция в JavaScript"
date: "2021-03-18"
tags: ["JavaScript", "Frontend"]
active: "true"
ready: "true"
---

## Что это и зачем?

Понятие инкапсуляция принадлежит к объектно ориентированному программированию (ООП).
Оно помогает скрывать внутреннюю реализацию объектов от внешнего мира. А также предоставляет
дополнительную возможность для управления внутренними данными с помощью языковых конструкций.

## Возможности JavaScript

В языке Javascript есть несклько способов реализации инкапсуляции. Чаще всего, когда мы говорим
об инкапсуляции во фронтенде, нам на ум приходят замыкания и работа с модулями.

Модули позволяют скрыть работу с данными внутри себя и экспортирвать наружу только необходимое.

А замыкания позволяют сохранять переменные внутри области видимости одной функции.

### Функции и замыкания

Функции имеют возможность скрывать данные засчет замыкания.
Каждая функция в момент своего жизненного цикла хранит переменные из родительской области видимости.
Это называется **лексическим окружением**.

Пример инкапсуляции и получения доступа к переменным даже при вызове функции вне родительской.

```javascript
function calculatePriceWithTax() {
    let RUS_TAX = 20;
    let ITALY_TAX = 22;
    let SPAIN_TAX = 21;

    function getFinalPrice(price, country) {
        switch(country) {
            case 'RUS':
                return price + (price * RUS_TAX / 100);
            case 'ITALY':
                return price + (price * ITALY_TAX / 100);
            case 'SPAIN':
                return price + (price * SPAIN_TAX / 100);
            break;
        }
    }

    return { getFinalPrice };
}

const { getFinalPrice } = calculatePriceWithTax();

getFinalPrice(100, 'RUS'); // 80
```

Я привел в пример функцию ```calculatePriceWithTax```, которая хранит в себе переменные НДС разных стран.
А также возвращает функцию, которая имеет доступ к этим переменным и считает финальную цену. 

Данный пример демонстрирует, что функция ```getFinalPrice``` может получить доступ к переменным внутри функции ```calculatePriceWithTax```,
несмотря на то, что она вызывается за ее пределами.
Это говорит о том, что функция запомнила эти переменные в своем лексическом окружении.

### Immediately Invoked Function Expression - IIFE

Наиболее распространенный способ модуляции кода в JavaScript. Основной принцип тут тоже заложен
через использование замыканий, сейчас вы в этом убедитесь.

IIFE это функция, которая определяется и тут же вызывается. Засчет подобной конструкции мы инкапсулируем
переменные и функции, не засоряя при этом глобальную область видимости ненужными данными.

```javascript
(function() {
    const TAX = 20;
    const FIXED_BONUS = 15;

    function getPriceWithTax(price) {
        return price + price * TAX / 100;
    }

    function getPriceWithBonus(price) {
        return getPriceWithTax(price) - price * FIXED_BONUS / 100
    }

    const priceModule = {
        getPriceWithTax,
        getPriceWithBonus
    };

    window.priceModule = priceModule;
})();

console.log(window.priceModule); // {getPriceWithTax: ƒ, getPriceWithBonus: ƒ}
```
Теперь любой модуль сможет получить доступ к методам модуля priceModule, но не будет знать о том, что происходит внутри.
Отличным примером может быть библиотека lodash. На гитхабе можно посмотреть ее реализацию.

### EcmaScript Модули

У стандартной модуляции в JavaScript есть проблема. Несмтря на то, что благодаря использованию функции
мы имеем возможность инкапсулировать данные, такой подход затрудняет обмен переменными между функциями.
Также такой подход затрудняет поддержку кода.

Нам нужен более простой подход к созданию модулей. И тут на помощь приходят ES модули.
По сути они представляют из себя синтаксический сахар и по итогу все равно транслируются в IIFE.

Но на этапе разработки это значительно упрощает написание кода и его поддержку.

Вот все тот же пример, реализованный с помощью ES модулей. 

```javascript

// priceModule.js
const TAX = 20;
const FIXED_BONUS = 15;

function getPriceWithTax(price) {
    return price + price * TAX / 100;
}

function getPriceWithBonus(price) {
    return getPriceWithTax(price) - price * FIXED_BONUS / 100
}

export {
    getPriceWithTax,
    getPriceWithBonus
};

// Файл где мы хотим использовать методы из priceModule.s
import { getPriceWithTax, getPriceWithBonus } from 'priceModule.js';
```

На данный момент это самый предпочтительный способ.

### Создание объектов через class и инкапсуляция с `#`

С момента прихода EcmaScript2015 мы получили возможность создавать объекты
с помощью ключевого слова class, подобно ООП языкам таким как Java и C#.

Но еще чуть позже была добавлена возможность делать поля внутри класса приватными.
Это достойная фича, которую давно ждали. Вот как она выглядит.

```javascript
class PriceModule {
    #TAX = 20;
    #FIXED_BONUS = 15;

    getPriceWithTax(price) {
        return price + price * this.#TAX / 100;
    }

    getPriceWithBonus(price) {
        return this.getPriceWithTax(price) - price * this.#FIXED_BONUS / 100;
    }
}

const priceModule = new PriceModule();

console.log(priceModule.#TAX) // Uncaught SyntaxError: Private field '#TAX' must be declared in an enclosing class
```

Получить доступ к переменным с # можно только изнутри класса.

### Полезные ссылки

- <a href="https://learn.javascript.ru/closure" target="_blank">Подробнее про замыкания, Lexical Environment и IIFE</a>
- <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes" target="_blank">Подробнее про классы в JavaScript</a>
- <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes/Private_class_fields" target="_blank">Подробнее про приватные поля в JavaScript</a>
- <a href="https://learn.javascript.ru/modules-intro" target="_blank">Подробнее про ES модули</a>
