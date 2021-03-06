---
title: "Что нужно знать про работу с промисами в js"
date: "2021-05-02"
tags: ["JavaScript", "Frontend"]
active: "true"
---

Небольшая статья о важных моментах работы с промисами в Javascript.
Эта колонка не является мануалом к изучению промисов с нуля.
На практических примерах мы рассмотрим наиболее важные моменты.

## Содержание

<ul>
    <li><a href="#1">Javascript однопоточный и асинхронный</a></li>
    <li><a href="#2">Порядок выполнения задач</a></li>
    <li><a href="#3">Цепочка выполнения промисов</a></li>
    <li><a href="#4">Способы перехвата ошибок</a></li>
    <li><a href="#5">Улучшаем работу с помощью async await</a></li>
</ul>

## Javascript однопоточный и асинхронный<a name="1"></a>

> JavaScript это однопоточный язык программирования.

Что это значит? Это значит, что все действия,
которые выполняются с помощью языка происходят друг за
другом и ожидают окончания выполнения предыдущих действий.

Например:

```javascript
console.log('Hello world!');
let a = 1;
func1();
func2();
```

Но вместе с этим javascript асинхронный.
Благодаря наличию промисов и таймаутов, мы можем выполнять более сложные и долгие операции,
не блокируя основной поток выполнения нашего кода.


## Порядок выполнения задач<a name="2"></a>

Мы выяснили, что таймауты и промисы умеют откладывать задачи.
Но что выполнится с наибольшим приоритетом Promise или setTimeout?

Важно понимать, когда браузер что-то откладывает, он складывает это в очередь.
Так вот существует несколько очередей. Очередь микро и макро задач.
Promise относится в микрозадачам, а работа с таймаутами к макроазадчам.
Микрозадачи выполняются раньше.

```javascript
setTimeout(() => console.log("timeout")); // 3

Promise.resolve()
  .then(() => console.log("promise")); // 2

console.log("code"); // 1

// выполнится в таком порядке
// code -> promise -> timeout
```

Микрозадачам важно выполнится раньше. Тут важно понимать,
<a href="https://learn.javascript.ru/event-loop" target="_blank">как работает событийный цикл в js</a> 

## Цепочка выполнения промисов<a name="3"></a>

> Чтобы один промис ждал ответ от другого, необходимо не забывать ставить return

Часто может потребоваться выполнить несколько зависимых друг от друга запросов к серверу.
Тут мы сталкиваемся с цепочкой промисов, когда внутри промиса необходимо ожидать ответ от другого запроса.

```javascript
fetch('/user')
    .then(res => {
        return user;
    })
    .then(user => {
        return fetch(`/orders/${user.id}`);
    })
    .then(orders => {
        // Делаем что-то с ответом
    })
```

Каждый последующий вызов промиса зависит от предыдущего.
Когда мы в then возвращаем что-то, то этот результат передается по цепочке в следующий then.

<a href="https://www.instagram.com/p/CLlhmsZglRa/" target="_blank">В одном из постов в инстаграме я выкладывал пример задачи с собеседования на эту тему</a> 

### then после catch

Особой хитростью у промисов является то, что если вызвать then после catch, то он тоже выполнится.

```javascript
p
    .then(res => res)
    .catch(err => err)
    .then(() => // тут можно еще что-то делать);
```

## Способы перехвата ошибок<a name="4"></a>

У нас есть два варианта обработки ошибок.

```javascript
// Напишем свой промис, в котором будет выполняться запрос

// Запрос к серверу, который выбрасывает ошибку
function customFetch(url) {
    throw new Error("Ошибка запрса");
}

let p = new Promise((res, rej) => {
    customFetch('/users');
});

// 1 способ перехвата ошибки
p
  .then(res => console.log(res))
  .catch(err => console.error(err))

// 2 способ перехвата ошибки
p
  .then(
    (res) => console.log(res),
    (err) => console.error(err)
  );
```

На самом деле они обозначают одно и то же. Так как catch это сокращенный вызов от then с двумя колбэками.

```javascript
// Можно написать так
p.catch(callback);

// А можно так
p.then(null, failureCallback);
```

### catch во внутреннем промисе

Лучше всего избегать глубокой вложенности промисов. Так как это усложняет читаемость кода.
Ниже будет о том, как можно этого избежать.

Но важно понимать, что catch во внутреннем промисе не обрабатывает ошибки внешнего промиса.

Например:

```javascript
fetchUserDataByEmail('email@mail.ru')
    .then(user => fetchUserOrders(user.id)
      .then(orders => doSmth(orders))
      .catch(e => {})) // Не обрабатывает ошибки от fetchUserDataByEmail
    .then(() => doSmth2())
    .catch(e => console.log("Критическая ошибка: " + e.message));
```

## Улучшаем работу с помощью async await<a name="5"></a>

Промисы тоже могут доставить неудобства во время работы. Основные минусы:

#### Сложно дебажить

Встроенный браузерный дебагер не всегда корректно может ходить по цепочке промисов

#### Promise hell

Если у нас сложная цепочка зависимых промисов, то это может привести к трудночитаемому коду.

Все эти проблемы можно решить благодаря использованию async await.
Он представляет из себя синтаксический сахар и выглядит как синхронный код.

## Преимущества использования async await

- Удобно читать код
- Удобно обрабатывать ошибки
- Дебагер отлично справляется с кодом

```javascript
async function getUsersOrders(email) {
  try {
  
    // Каждый промис ждет выполнения предыдущего.
    // Сколько бы промисов мы тут не выполнили, они будут выглядеть как синхронный код, который удобно читать.
    const users = await getUserByEmail('/users/', { email });
    const orders = await getOrders(`/orders/${users.id}`);

    return orders;
  } catch(err) {
    handleError(err); // Обрабатываем ошибку
  }
}
```

### Полезные ссылки

- <a href="https://github.com/azat-io/you-dont-know-js-ru" target="_blank">Серия книг You do not know JS, переведенная на русский</a>
- <a href="https://habr.com/ru/company/ruvds/blog/337042/" target="_blank">Как работает движок в JS</a>
- <a href="https://addyosmani.com/resources/essentialjsdesignpatterns/book/#constructorpatternjavascript" target="_blank">Бесплатная онлайн книга по шаблонам проектирования в JS</a>
- <a href="https://chillcoding.dev/what-you-need-to-know-about-algorithms/" target="_blank">Нужны ли алгоритмы джуну, разбираемся с основами</a>
- <a href="https://chillcoding.dev/create-own-npm-package/" target="_blank">Что такое npm. Пишем свой модуль и публикуем.</a>
