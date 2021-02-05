---
title: "Лучшие практики написание кода на JavaScript"
tags: ["Frontend", "JavaScript"]
date: "2021-02-06"
active: "true"
ready: "true"
---

Если вы начали учить JavaScript, или уже пишите небольшие приложения, я очень хочу, чтобы каждый из вас писал чистый код,
который не содержит потенциальных ошибок.

Есть общепринятые нормы и правила написания кода, но некоторые понятия могут отличаться в зависимости от языка.

Давайте взглянем на это со стороны JavaScript.

### Пишите чистые функции

По возможности старайтесь писать чистые функции или чистые функциональные компоненты, например в React.

> Чистая функция - эта функция, которая зависит только от входных параметров. Если входные аргументы не изменились,
> то результат должен остаться таким же

Это уменьшит количество зависимостей функции от внешних переменных и снизит вероятность потенциальных ошибок.
А еще чистые функции могут кешировать значение и не пересчитывать возвращаемый результат, если входные аргументы не изменились.

Также упрощается тестирование подобных функций.

```javascript
// ❌ bad
var tax = 5;
function finalProductsPrice(productsPrice, bonus) {
  return (productsPrice - bonus) + productsPrice * (tax / 100);
}

// ✅ great
function finalProductsPrice(productsPrice, bonus, tax) {
  return (productsPrice - bonus) + productsPrice * (tax / 100);
}
```

### Используйте === вместо ==

Используя == можно наткнуться на неожиданное приведение типов, а
=== сравнивает и значения и типы.

```javascript
// ❌ bad
123 == '123' // true
false == 0 // true
'' == false // true

// ✅ good
123 === '123' // false
false === 0 // false
'' === false // false
```

### Не используйте var. Используйте let и const

Все дело в области видимости. В JavaScript по умолчанию 2 области видимости
* Глобальная область, обычно это объект window
* Область видимости любой функции, которую вы создали

let и const добавляют еще одну область внутри любого блока { }. То есть, созданная переменная не будет видна за пределами
этих скобок. Это касается, циклов, условий и других конструкций.

```javascript
// ❌ Имеем доступ к i и userName за пределами блока
function concatUsersNames(users) {
  var usersNames = '';
  
  for (var i = 0; i < users.length; i++) {
    var userName = users[i].name;
    usersNames += userName;
  }
  
  console.log(i);
  console.log(userName);
}

// ✅ Не имеем доступ к переменным за пределами цикла
function concatUsersNames(users) {
  let usersNames = '';
  
  for (let i = 0; i < users.length; i++) {
    let userName = users[i].name;
    usersNames += userName;
  }
  
  console.log(i);
  console.log(userName);
}
```

### Используйте тернарный оператор с умом

В JavaScript есть возможность писать условие в одну строку с использованием тернарного оператора '?'
Но иногда это превращается в хаос, из-за которого трудно понять, что происходит. Не делайте так.

```javascript
// ❌ Больше чем два условия уже сложно разобрать
let a = 1;
let b = 2;
let role = a === 1 ? b === 2 ? 'ADMIN' : 'MANAGER' : 'GUEST';

// ✅ с одним уже лучше
let role = a === 1 ? 'ADMIN' : 'MANAGER';

// ✅ Или так
let role = 'GUEST';
if (a === 1) {
  if (b === 2) {
    role = 'ADMIN';
  } else {
    role = 'MANAGER';
  }
}
```

### Используйте async await вместо Promises

Промисы привнесли в нашу жизнь глоток свежего воздуха после callback hell.
Но async await еще более упрощают жизнь и имеют существенные плюсы.

* Проще дебажить код. Встроенный дебагер порой некорректно работает с промисами и не может ходить по цепочке.
* Обработка ошибок в async await осуществляется подобно синхронному коду, нет никаких вложенностей, мы просто идем последовательно

```javascript
// ❌ Такое себе
fetch('/user')
  .then(res => res.json())
  .then(res => {
    return fetch('/products', {userId: res.data.userId})
                      .then(res => res.json());
  })
  .then(res => res.data)
  .catch(err => console.error(err));

// ✅ Выглядит лучше
try {
  let res = await fetch('/user');
  let user = await res.json().data;
  let products = fetch('/products', {userId: user.userId});
  return { products, user };
} catch(err) {
  console.error(err);
}
```

### Обязательно используйте Linter

<a href="https://eslint.org/" target="_blank">JSLisnt</a> упростит вам жизнь. Практически любые стилистические моменты, или моменты, которые содержат потенциальные ошибки,
обнаруживаются с помощью линтера.

Это сильно сократит время на мелкие исправления и вы сосредоточитесь на более важных вещах во время разработки.
