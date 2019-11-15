import { observable } from "mobx";

const person = observable({
  name: "cyitao",
  age: 23
});

let array = observable([100, 200, 300]);

export { person, array };
