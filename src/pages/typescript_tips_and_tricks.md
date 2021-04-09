---
title: "Typescript Tips and Tricks"
date: "2021-04-09"
tags: ["Frontend"]
active: "true"
---

### О чем поговорим

* Не используйте тип React.FC
* Несколько возможных возвращаемых типов
* Что такое Generics и как их использовать
* Как типизировать Ref
* Много маленьких интерфейсов лучше одного большого
* Что делать, если сторонняя библиотека не типизирована

React уже сложно представить без Typescript.

Typescript позволяет проектировать масштабируемую архитектуру, за счет наличия интерфейсов и типов.
А также код становится самодокументируемым и лаконичным.

Но для того, чтобы наличие типов в React приложении себя оправдывало,
необходимо следовать некоторым правилам и использовать преимущества по максимуму.


### Не используйте тип React.FC для функциональных компонент

Проще говоря, вот так делать не рекомендуется.

```typescript
const UserAvatar: React.FC = () => { /*... */ };

// Нам не нужно прокидывать children в UserAvatar
const UserPage = () => {
    <div>
      <UserAvatar />
    </div>
}
```

Основная причина в том, что тип React.FC обязывает компонент в качестве пропсов принимать children.
Хотя на самом деле далеко не часто нам необходимо пробрасывать дочерние компоненты в качестве свойств.

Вторая причина, я не могу пробрасывать дженерики. Часто это бывает необходимо, чтобы задать параметризированный тип для пропсов.

```typescript
// Не будет работать
const CustomPage: React.FC</* ??? */> = <T>(props: Props<T>) => {/*...*/}
```

```typescript
// Хорошо
type Props<T> = {
   item: T
   callback: (t: T) => void
}
const CustomPage = <T>(props: Props<T>) => {/*...*/}
```

### Discriminated Unions - Несколько возможных возвращаемых типов

Typescript позволяет создавать типы, которые могут иметь несколько возможных возвращаемых значений.

```typescript
type IdentityType = string | number | null;
// Теперь он может быть только строкой, числом или null
const userIdentity: sumVal;

type  ButtonSizeType = "small" | "medium" | "large";
```

Это отлично подходит при использовании redux, когда мы определяем типы для actions.
Экшенов у нас может быть много, но функция reducer у нас одна и она должна иметь возможность принимать все необходимые экшены.

```typescript
type SetUserAuthActionType = { type: 'SET_USER_AUTH_ACTION_TYPE', payload: boolean };
type SetUserInfoActionType = { type: 'SET_USER_AUTH_ACTION_TYPE', payload: IUser };
type ResetUserInfoActionType = { type: 'SET_USER_AUTH_ACTION_TYPE' };

type UserActionsType = 
    SetUserAuthActionType |
    SetUserInfoActionType |
    ResetUserInfoActionType;

function userReducer(state: typeof initialState, action: UserActionsType) {
  switch(action.type) {
    //...
  }
}
```

### Generics - как ими пользоваться

Джеренири - это параметризированный тип. То есть тип возвращаемого объекта определяется в момент вызова функции.

Самый простой пример - универсальный метод ```get``` для получения данных с бэкенда.

```typescript
function get<T>(url: string): Promise<T> {
  return fetch(url).then(res => (res.json() as T));
}

const user: User = get<User>('/user/1');
const orders: Array<Order> = get<Array<Order>>('/user/1');
```

### Refs - управление узлами элементов

Иногда нам необходимо управлять узлами компонент в дочерних элементах.
Например, мы хотим управлять фокусом, выделением, анимацией компонента.
А для этого придется получить доступ к DOM свойствам этого элемента.

В этом могут помочь два метода React:

```forwardRef``` создает компонент с возможностью
передачи в него ссылки на ref.


```createRef ``` создаем ref в том месте, где мы хотим управлять компонентом
и передаем его внутрь компонента при вызове.


```typescript
type Props = { children: React.ReactNode; type: "submit" | "button" };
export type Ref = HTMLButtonElement;
const FancyButton = React.forwardRef<Ref, Props>((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// Теперь реф будет указывать непосредственно на DOM-узел button:
const ref = React.createRef<HTMLDivElement>();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

### Разделяйте интерфейсы

Часто бывает, что нам необходимо использовать несколько видов кнопок в интерфейсе.
Кнопки могут быть с иконкой, без иконки, с текстом, без текста, круглые, прямоугольные,
с дополнительными действиями при вызове и прочее.

Когда мы создаем интерфейс для какого-то объекта, то пихаем в него все до кучи.
Это усложняет внесение изменений и добавление новых видов кнопок.

```typescript
interface IButton {
  icon: string;
  value: string;
  onClick: () => void;
  size: "sm" | "md" | "lg";
}

// Если мы захотим добавить новый тип кнопок, то вероятно добавим очередное свойство для это
interface IButton {
  //...
  type: "circle" | "square";
}
```

Лучшим способом будет создавать несколько небольших интерфейсов, которые наследуются от базового.

```typescript
interface IButton {
  onClick: () => void;
  size: "sm" | "md" | "lg";
}

interface IconButton extends IButton {
  icon: string;
}

interface IconTextButton extends IButton {
  icon: string;
  value: string;
}

interface CircleButton extends IconButton {}
```

В дальнейшем это упростит добавление новых видов кнопок в интерфейс.

### Что если сторонняя библиотека не типизирована.

Бывает так, что сторонний модуль не типизирован. Разработчики не прописали типы для их элементов.
Это может вызвать проблемы при использовании в React/Typescript приложениях.

В качестве решения можно добавить файл ```typedec.d.ts```, в котором будут прописаны нетипизированные модули.
Он добавит тип any для всех подобных модулей.

```typescript
// inside typedec.d.ts
declare module "my-untyped-module";
```

В ```tsconfig.json``` должен быть прописан путь к папке, где лежит этот файл.

```typescript
// inside tsconfig.json
{
  // ...
  "include": [
    "src" // src/typedec.d.ts
  ]
  // ...
}
```

### Полезные ссылки

- <a href="https://fettblog.eu/tidy-typescript-avoid-enums/" target="_blank">Почему лучше не использовать ENUM</a>
- <a href="https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions" target="_blank">Typescript for functional programmers</a>
- <a href="https://github.com/typescript-cheatsheets/react" target="_blank">React Typescript cheatsheet</a>
