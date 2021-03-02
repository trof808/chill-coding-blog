---
title: "Как работает this в JavaScript?"
tags: ["Frontend", "Javascript"]
date: "2021-02-22"
active: "true"
ready: "true"
---


В мире ООП мы оперируем объектами реального мира, которые наделены различными умениями и характеристиками,
засчёт методов и свойств.

> this - позволяет нам получить доступ к свойствам и методам текущего объекта

Но в Javascript ООП немного своеобразно и отличается от классических подходов, которые реализованы в таких языках как
Java и C#.

Представим, что у нас есть объект электро-автомобиль. У которого есть максимальная скорость и максимальный заряд.
И мы хотим вызвать его метод, который вернет нам максимально возможное расстояние.
```javascript
let car = {
  maxSpeed: 10,
  chargingHours: 5,
  getMaxDistance() {
    return this.maxSpeed * this.chargingHours;
  }
}
```

Тут все понятно, this имеет отношение к текущему объекту

## Переиспользование методов

Но что, если мы хотим сделать общую функцию, которую можно применить к нескольким объектам?

```javascript
let user1 = {
  name: "Petr",
  surname: "Smirnov"
};

let user2 = {
  name: "Alex",
  surname: "Smith"
};

function getFullName() {
  return this.name + " " + this.surname;
}

user1.fullName = getFullName;
user2.fullName = getFullName;

console.log(user1.fullName()); // Petr Smirnov 
console.log(user2.fullName()); // Alex Smith
```

Особенность this в js является то, что он свободен и применяется к тому объекту, в котором вызывается.

Казалось бы это удобно. Но также имеет свои последствия, о которых нужно знать.

## Потеря контекста

Если мы попытаемся вызвать метод в рамках объекта, у которого нет нужных свойств, то будет ошибка
Это называется потеря контекста.

Рассмотрим предыдущий пример.

```javascript
let car = {
  maxSpeed: 10,
  chargingHours: 5,
  getMaxDistance() {
    return this.maxSpeed * this.chargingHours;
  }
}

let maxDistance = car.getMaxDistance;

console.log(maxDistance()); // Ошибка
```

В переменную maxDistance мы присвоили не результат функции, а ссылку на эту функцию (Reference Type),
так как функция является объектом.

> Значение this определяется в момент выполнения функции, а не в момент ее создания. 

## Потеря контекста при передаче методов в качестве callback функции

Одним из популярных примеров потери контекста является передача метода объекта в setTimeout.

```javascript
let car = {
  maxSpeed: 10,
  chargingHours: 5,
  getMaxDistance() {
    console.log(this.maxSpeed * this.chargingHours);
  }
}

setTimeout(car.getMaxDistance, 1000) // NaN
```

В данном случае setTimeout откладывает выполнение метода на 1 секунду. Как это происходит?

Браузер через одну секунду кладет в очередь макрозадач функцию getMaxDistance объекта car.

Но так как мы передали не результат функции, а ссылку на нее, то выполнилась она уже в другом контексте,
в котором не было таких свойств как maxSpeed и chargingHours.

setTimeout устанавливает this=window. То есть метод getMaxDistance выполнился в рамках контекста window.
```javascript
setTimeout(() => console.log(this)) // window
console.log(window.maxSpeed) // undefined
console.log(window.chargingHours) // undefined
```

Это привело к тому, то результатом умножения двух свойств получилась ошибка вычисления NaN.

## Способы избежать потери контекста

#### #1 Обернуть в анонимную функцию.

Обернуть вызов в анонимную функцию. Тут сработало замыкание. При передаче функции в очередь,
движок также передал туда все видимые переменные в рамках области видимости, в том числе объект car.

```javascript
setTimeout(function() {
  car.getMaxDistance();
}, 1000) // 50
```

Но тут есть нюанс, если до выполнения функции в setTimeout измениться объект car,
то это отразится на результате его выполнения.

```javascript
setTimeout(function() {
  car.getMaxDistance();
}, 1000) // 45 мы можем не узнать о том, что с объектом, что-то произошло

// Выполнится раньше чем setTimeout
car.getMaxDistance = function() {
  console.log(this.maxSpeed * this.chargingHours * 0.9);
}
```

#### #2 Привязываем контекст с помощью bind

bind возвращает специальный метод, который сохраняет функциональность,
но строго привязывает ее к определенному объекту.

```javascript
let carMaxDistance = car.getMaxDistance.bind(car);

setTimeout(carMaxDistance, 1000) // 50

// Выполнится раньше чем setTimeout, но нам уже все равно
car.getMaxDistance = function() {
  console.log(this.maxSpeed * this.chargingHours * 0.9);
}
```

Теперь мы можем гарантировать, что метод выполнится корректно по отношению к объекту 

#### #3 Использовать стрелочные функции

Особенность стрелочной функции в том, что у нее вообще нет контекста.
Он определяется в момент создания.

```javascript
const showContext = () => {
  console.log(this); // undefined
}
```

Пример потери контекста с обычной функцией

```javascript
function Car() {
  // В конструкторе Person() `this` указывает на себя.
  this.speed = 0;
  
  // Каждую секунду увеличиваем скорость
  setInterval(function incrementSpeed() {
    this.speed++; // Нет доступа к свойству
    console.log(this.speed); // NaN
  }, 1000);
}

let car = new Car();
```

Решение с помощью стрелочной функции

```javascript
function Car() {
  this.speed = 0;

  setInterval(() => {
    this.speed++;
    console.log(this.speed);
  }, 1000);
}

let car = new Car();
```

Так как у стрелочной функции контекст определяется в момент создания,
то мы запомнили свойство speed в контексте вызова функции.

## Подведем итог

- У обычной функции контекст создается в момент вызова. Вне объекта он равен window
- Когда мы вызываем функцию через точку object.method(), то контекстом является объект до точки object
- Стрелочная функция не имеет контекста и сохраняет его в момент создания
- метод bind помогает привязать контекст выполнения к функции
