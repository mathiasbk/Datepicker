
# Datetimepicker

Simple datepicker as 2D game where you hit the obstacles with the numbers you want in the date.


![demo screenshot](https://github.com/mathiasbk/Datepicker/blob/main/demo.png?raw=true)

## Demo

Live demo: https://mathiasbk.github.io/Datepicker/example.html

## How to use 

1. Include the module in your page:
```html
<script type="module" src="src/main.js"></script>
<link rel="stylesheet" href="src/datepicker.css">
```

2. Add a target element:
```html
<div id="date-target"></div>
```

3. Initialize the picker (on DOMContentLoaded):
```html
<script>
document.addEventListener('DOMContentLoaded', () => {
  FlappyPicker.init(el);
});
</script>
```

