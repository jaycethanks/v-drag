import type { App } from "vue";
import type { Directive, DirectiveBinding } from "vue";


const timeStamp = new Date().getTime();
const boxClassName = `box-${timeStamp}`;
const pointerClassName = `pointer-${timeStamp}`;

const addElPositionIndicator = (moveElement: HTMLDivElement) => {
  const pointerXAxisLabel = document.createElement("span");
  const pointerYAxisLabel = document.createElement("span");
  pointerXAxisLabel.classList.add(`${boxClassName}-labelx`);
  pointerYAxisLabel.classList.add(`${boxClassName}-labely`);
  moveElement.appendChild(pointerXAxisLabel);
  moveElement.appendChild(pointerYAxisLabel);
};
const updateElPositionIndicator = (x: string, y: string) => {
  const pointerxlabel = document.querySelector(`.${boxClassName}-labelx`);
  const pointerylabel = document.querySelector(`.${boxClassName}-labely`);
  pointerxlabel!.textContent = x;
  pointerylabel!.textContent = y;
};
const addPointerIndicator = () => {
  const pointer: HTMLDivElement = document.querySelector(`.${pointerClassName}`) || document.createElement("div");
  pointer.classList.add(boxClassName, pointerClassName);
  // axis label
  const pointerXAxisLabel = document.createElement("span");
  const pointerYAxisLabel = document.createElement("span");
  pointerXAxisLabel.classList.add(`${pointerClassName}-labelx`);
  pointerYAxisLabel.classList.add(`${pointerClassName}-labely`);
  pointer.appendChild(pointerXAxisLabel);
  pointer.appendChild(pointerYAxisLabel);
  document.body.appendChild(pointer);
};
const updatePointerIndicator = (e: MouseEvent) => {
  const pointer: HTMLDivElement = document.querySelector(`.${pointerClassName}`) || document.createElement("div");
  const pointerxlabel = document.querySelector(`.${pointerClassName}-labelx`);
  const pointerylabel = document.querySelector(`.${pointerClassName}-labely`);
  pointerxlabel!.textContent = e.clientX + "px";
  pointerylabel!.textContent = e.clientY + "px";
  pointer.style.left = e.clientX + "px";
  pointer.style.top = e.clientY + "px";
};
const removePointerIndicator = () => {
  const pointer: HTMLDivElement = document.querySelector(`.${pointerClassName}`);
  pointer && document.body.removeChild(pointer);
};
const attachRelatedClass = (indicator: boolean, el: HTMLElement) => {
  indicator && el.classList.add(boxClassName);
  const style = document.createElement("style");
  style.textContent = `
.${boxClassName} {
  position: absolute;
}
.${boxClassName}::before {
  content: "";
  width: 1px;
  border-top: 1px dashed;
  left: -100vw;
  width: 200vw;
  top: -2px;
  position: absolute;
}
.${boxClassName}::after {
  content: "";
  width: 1px;
  border-right: 1px dashed;
  left: -2px;
  height: 200vh;
  top: -100vh;
  position: absolute;
}

.${pointerClassName}::before {
  border-top: 1px dashed red;
}
.${pointerClassName}::after {
  border-right: 1px dashed red;
}

.${pointerClassName}-labelx,.${pointerClassName}-labely{
  color:red;
  position: absolute;
}
.${pointerClassName}-labelx {
  left:100px
}
.${pointerClassName}-labely {
  bottom:100px
}
.${boxClassName}-labelx,.${boxClassName}-labely{
  color:blue;
  position: absolute;
}
.${boxClassName}-labelx{
  left:-100px
  
}
.${boxClassName}-labely{
  top:-100px

}
`;
  document.body.appendChild(style);
};



const _vDrag: Directive<any, void> = (el: HTMLElement, binding: DirectiveBinding) => {
  const {
    modifiers: { indicator, keep },
    value,
  } = binding;
  const userValue = value;
  let moveElement: HTMLDivElement = el as HTMLDivElement;
  // let moveElement: HTMLDivElement = el.firstElementChild as HTMLDivElement;
  attachRelatedClass(indicator, el);
  const mouseDown = (e: MouseEvent) => {
    // 用户传入的callback
    userValue?.mousedown();
    indicator && addPointerIndicator();
    indicator && addElPositionIndicator(moveElement);
    let x = e.clientX - el.offsetLeft;
    let y = e.clientY - el.offsetTop;
    const move = (e: MouseEvent) => {
      indicator && updatePointerIndicator(e);
      el.style.left = e.clientX - x + "px";
      el.style.top = e.clientY - y + "px";
      indicator && updateElPositionIndicator(el.style.left, el.style.top);
    };
    document.addEventListener("mousemove", move);
    const mouseup = () => {
      // 用户传入的callback
      userValue?.mouseup();
      !keep && removePointerIndicator();

      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", mouseup);
    };
    document.addEventListener("mouseup", mouseup);
  };
  moveElement.addEventListener("mousedown", mouseDown);
};


const vDragIntaller = {
  install(app: App) {
    console.log('[app]: ', app)
    app.directive("drag", _vDrag)
  }
}

export default vDragIntaller
export const vDrag = vDragIntaller