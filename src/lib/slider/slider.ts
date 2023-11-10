export default function handle(node: HTMLElement) {
  const onDown = getOnDown(node);

  node.addEventListener("touchstart", onDown);
  node.addEventListener("mousedown", onDown);
  return {
    destroy() {
      node.removeEventListener("touchstart", onDown);
      node.removeEventListener("mousedown", onDown);
    }
  };
}

function getOnDown(node: HTMLElement) {
  const onMove = getOnMove(node);

  return function (e: TouchEvent | MouseEvent) {
    e.preventDefault();
    node.dispatchEvent(new CustomEvent("dragstart"));

    const moveevent = "touches" in e ? "touchmove" : "mousemove";
    const upevent = "touches" in e ? "touchend" : "mouseup";

    document.addEventListener(moveevent, onMove);
    document.addEventListener(upevent, onUp);

    function onUp(e: TouchEvent | MouseEvent) {
      e.stopPropagation();

      document.removeEventListener(moveevent, onMove);
      document.removeEventListener(upevent, onUp);

      node.dispatchEvent(new CustomEvent("dragend"));
    };
  };
}

function getOnMove(node: HTMLElement) {
  const track: HTMLElement = node.parentNode as HTMLElement;

  return function (e: TouchEvent | MouseEvent) {
    const { bottom, height } = track.getBoundingClientRect();
    //setting this up so box doesn't go beyond top/bottom of thermometer
    const clickOffset = "touches" in e ? e.touches[0].clientY : e.clientY;
    const clickPos = Math.min(Math.max((bottom - clickOffset) / height, 0.30), 0.93) || .1;
    node.dispatchEvent(new CustomEvent("drag", { detail: clickPos }));
  };
}