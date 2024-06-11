<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>My first three.js app</title>
{{--NEEDS TO BE LINKED WITH VITE!!!--}}
    @vite(["resources/css/game/main.css", "resources/js/game/main.js"])
</head>
<body>
<canvas id="game_screen"></canvas>
<div id="hud">
    <a>Hello!</a>
</div>
</body>
</html>
