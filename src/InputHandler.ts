import Vec2D from "./Vec2D";

export type PointerFunctionType = 'field' | 'gravity' | 'throw';

export class InputHandler {
  private static instance: InputHandler;
  public clicked: boolean = false;
  private pointerFunction: PointerFunctionType;
  public pointerPosition = new Vec2D(0, 0)
  public clickStartPosition = new Vec2D(0, 0)


  private constructor() {
    this.pointerFunction = 'field';
  }

  public static getInstance(): InputHandler {
    if (!InputHandler.instance) {
      InputHandler.instance = new InputHandler();
      InputHandler.instance.initializeEventListeners();
    }
    return InputHandler.instance;
  }

  private initializeEventListeners(): void {
    const main_body = document.getElementById('main_container');
    if (!main_body) return;

    main_body.addEventListener("mousedown", this.handleMouseDown.bind(this));
    main_body.addEventListener("mouseup", this.handleMouseUp.bind(this));
    main_body.addEventListener("mousemove", this.handleMoveEvent.bind(this));
    main_body.addEventListener("touchstart", this.handleMouseDown.bind(this));
    main_body.addEventListener("touchend", this.handleMouseUp.bind(this));
    main_body.addEventListener("touchmove", this.handleMoveEvent.bind(this));
    main_body.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  private handleMouseDown(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();
    this.clicked = true;

    if (event instanceof MouseEvent) {
      this.pointerPosition.x = event.clientX;
      this.pointerPosition.y = event.clientY;
    } else if (event instanceof TouchEvent) {
      this.pointerPosition.x = event.touches[0].clientX;
      this.pointerPosition.y = event.touches[0].clientY;
    }

    this.clickStartPosition.x = this.pointerPosition.x;
    this.clickStartPosition.y = this.pointerPosition.y;
    
  }

  private handleMouseUp(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();
    this.clicked = false;
  }

  private handleMoveEvent(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();
    if (this.clicked) {
      if (event instanceof MouseEvent) {
        this.pointerPosition.x = event.clientX;
        this.pointerPosition.y = event.clientY;
      } else if (event instanceof TouchEvent) {
        this.pointerPosition.x = event.touches[0].clientX;
        this.pointerPosition.y = event.touches[0].clientY;
      }
    }
  }
}