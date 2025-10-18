import DatePicker from "./datepicker.js";

export default class FlappyPicker {

    open = false;
    day = 0;
    month = 0;
    year = 0;

    constructor(element)
    {
        this.el = element;
        this._boundOnDocClick = this._onDocumentClick.bind(this);
        this.init();
    }

    init()
    {
        this.showPickerOutput();

        this.el.addEventListener("click", (e) => {
            if (!this.open) {
                this.open = true;
                this.createPickerWindow();
            } else {
                this.closePicker();
            }
        });
    }
    static init(el) {
        return new FlappyPicker(el);
    }

    showPickerOutput()
    {
        this.inputField = document.createElement("input");
        this.inputField.classList.add("date-input");
        this.inputField.placeholder = "Select date";
        this.inputField.readOnly = true;

        const calendarIcon = document.createElement("span");
        calendarIcon.classList.add("calendar-icon");
        calendarIcon.innerText = "📅";


        const wrapper = document.createElement("div");
        wrapper.classList.add("date-container");

        wrapper.appendChild(this.inputField);
        wrapper.appendChild(calendarIcon);

        this.el.appendChild(wrapper);

        wrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!this.open) {
                this.open = true;
                this.createPickerWindow();
            }
        });
    }

    createPickerWindow()
    {
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("Pickerwindow");
        this.el.after(this.canvas);

        this.dp = new DatePicker(this.canvas, this.el);
        this.dp.start();

        this.canvas.addEventListener('date-selected', (e) =>
        {
            this.handleDateChange(e.detail.type, e.detail.date);
        });
        document.addEventListener("mousedown", this._boundOnDocClick);
    }
    closePicker()
    {
        this.open = false;
        if (this.canvas) {
            this.dp.stop();
            this.canvas.remove();
        }
        document.removeEventListener("mousedown", this._boundOnDocClick);
    }

    _onDocumentClick(e)
    {
        const target = e.composedPath ? e.composedPath()[0] : e.target;
        const clickInsideTrigger = this.el && (this.el.contains(target) || this.el === target);
        const clickInsideCanvas = this.canvas && (this.canvas.contains(target) || this.canvas === target);
        if (!clickInsideTrigger && !clickInsideCanvas) {
            this.closePicker();
        }
    }

    handleDateChange(type, number)
    {
        console.log("type: " + type + " number: " + number);
        if (type === 'day') {
            this.day = String(number).padStart(2, '0');
        } else if (type === 'month') {
            this.month = String(number).padStart(2, '0');
        } else if (type === 'year') {
            this.year = String(number).padStart(4, '0');
        }

    this.displaydate();
    }

    displaydate()
    {
        const day = String(this.day).padStart(2, '0');
        const month = String(this.month).padStart(2, '0');
        const year = String(this.year).padStart(4, '0');

        this.inputField.value = `${day}/${month}/${year}`;
    }
};

window.FlappyPicker = FlappyPicker;