import DatePicker from "./datepicker.js";

export default class FlappyPicker {

    open = false;
    day = [];
    month = [];
    year = [];

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

    createPickerWindow() {
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("Pickerwindow");

        document.body.appendChild(this.canvas);

        const rect = this.el.getBoundingClientRect();

        this.canvas.style.position = "absolute";
        this.canvas.style.top = `${rect.bottom + window.scrollY}px`;
        this.canvas.style.left = `${rect.left + window.scrollX}px`;
        this.canvas.style.zIndex = "9999";

        this.dp = new DatePicker(this.canvas, this.el);
        this.dp.start();

        //Event when a number is hit
        this.canvas.addEventListener('date-selected', (e) => {
            this.handleDateChange(e.detail.type, e.detail.date);
        });

        this._boundOnDocClick = (e) => {
            if (!this.canvas.contains(e.target) && !this.el.contains(e.target)) {
                this.closePicker();
            }
        };
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
        if(this.year.length==3)
        {
            this.year.push(number);
            this.dp.gameCompleted();
            //this.dp.stop();
            //this.canvas.remove();
            this.displaydate();
            return;
        }
        if(this.day.length<2)
        {
            this.day.push(number);
        }
        else if(this.day.length==2 && this.month.length<2)
        {
            this.month.push(number);
        }
        else if(this.day.length==2 && this.month.length==2 && this.year.length<=4)
        {
            this.year.push(number);
        }

        this.displaydate();
    }

    displaydate()
    {
        const day = this.day.join('');
        const month = this.month.join('');
        const year = this.year.join('');

        this.inputField.value = `${day}/${month}/${year}`;
    }
};

window.FlappyPicker = FlappyPicker;