export default class InputController {
    constructor() {
        this._current = {
            mouseX: 0,
            mouseY: 0,
            mouseXDelta: 0,
            mouseYDelta: 0,
        }
 
        this._keys = {};
        this._previous = null;

        this._setupMovementHandle();
        this._setupRotationHandle();
    }

    keyPressed(key) {
        return key in this._keys && this._keys[key] === true;
    }

    _setupMovementHandle() {
        addEventListener("keydown", (event) => {
            this._keys[event.key.toLowerCase()] = true;
        }, false);
    
        addEventListener("keyup", (event) => {
            this._keys[event.key.toLowerCase()] = false;
        }, false);
    }

    _setupRotationHandle() {
        addEventListener("mousemove", e => {
            const {
                movementX,
                movementY
              } = e;

            this._current.mouseX += movementX / 10;
            this._current.mouseY += movementY / 10;

            if(this._previous === null) {
                this._previous = {...this._current};
            }

            this._current.mouseXDelta = this._current.mouseX - this._previous.mouseX;
            this._current.mouseYDelta = this._current.mouseY - this._previous.mouseY;
        });
    }

    update() {
        this._previous = {...this._current};
        this._current.mouseXDelta = 0
        this._current.mouseYDelta = 0
    }
}