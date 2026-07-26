export type GameAction =
  | "interact"
  | "namaste"
  | "pause"
  | "camera-left"
  | "camera-right"
  | "camera-zoom-in"
  | "camera-zoom-out"
  | "confirm"
  | "back"
  | "recover";

export type GameInputState = {
  moveX: number;
  moveY: number;
  accelerate: boolean;
  brake: boolean;
  boost: boolean;
};

export const EMPTY_GAME_INPUT: GameInputState = {
  moveX: 0,
  moveY: 0,
  accelerate: false,
  brake: false,
  boost: false,
};

/** Adapter contract for future Gamepad/controller polling without leaking raw button codes. */
export type GameInputAdapter = {
  connect: (controller: GameInputController) => void;
  disconnect: () => void;
};

const KEY_TO_ACTION: Record<string, GameAction | undefined> = {
  KeyE: "interact",
  Enter: "confirm",
  KeyN: "namaste",
  KeyP: "pause",
  Escape: "pause",
  KeyQ: "camera-left",
  KeyR: "camera-right",
  Equal: "camera-zoom-in",
  Minus: "camera-zoom-out",
  Backspace: "recover",
};

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest("input, textarea, select, button, a, [contenteditable='true'], [role='dialog']")
  );
};

export class GameInputController {
  readonly state: GameInputState = { ...EMPTY_GAME_INPUT };
  private pressed = new Set<string>();
  private listeners = new Set<(action: GameAction) => void>();
  private attached = false;

  subscribe(listener: (action: GameAction) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  attach() {
    if (this.attached || typeof window === "undefined") return;
    this.attached = true;
    window.addEventListener("keydown", this.onKeyDown, { passive: false });
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.reset);
  }

  detach() {
    if (!this.attached || typeof window === "undefined") return;
    this.attached = false;
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.reset);
    this.reset();
  }

  setTouchControl(control: "left" | "right" | "forward" | "backward" | "boost", active: boolean) {
    this.pressed[active ? "add" : "delete"](`touch:${control}`);
    this.syncAxes();
  }

  applyAdapterState(state: Partial<GameInputState>) {
    Object.assign(this.state, state);
  }

  trigger(action: GameAction) {
    this.listeners.forEach((listener) => listener(action));
  }

  reset = () => {
    this.pressed.clear();
    Object.assign(this.state, EMPTY_GAME_INPUT);
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (isEditableTarget(event.target) && event.code !== "Escape") return;
    const movementKey = [
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
      "ArrowUp",
      "ArrowLeft",
      "ArrowDown",
      "ArrowRight",
      "ShiftLeft",
      "ShiftRight",
    ].includes(event.code);
    const action = KEY_TO_ACTION[event.code];
    if (movementKey || action) event.preventDefault();
    this.pressed.add(event.code);
    this.syncAxes();
    if (action && !event.repeat) this.trigger(action);
  };

  private onKeyUp = (event: KeyboardEvent) => {
    this.pressed.delete(event.code);
    this.syncAxes();
  };

  private syncAxes() {
    const has = (...keys: string[]) => keys.some((key) => this.pressed.has(key));
    this.state.moveX =
      Number(has("KeyD", "ArrowRight", "touch:right")) -
      Number(has("KeyA", "ArrowLeft", "touch:left"));
    this.state.moveY =
      Number(has("KeyW", "ArrowUp", "touch:forward")) -
      Number(has("KeyS", "ArrowDown", "touch:backward"));
    this.state.accelerate = has("KeyW", "ArrowUp", "touch:forward");
    this.state.brake = has("KeyS", "ArrowDown", "touch:backward");
    this.state.boost = has("ShiftLeft", "ShiftRight", "touch:boost");
  }
}
