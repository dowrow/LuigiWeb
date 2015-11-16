/*global $, console*/
(function ($) {
    'use strict';

    function getTareas(contenido) {
        var tareas = [],
            lineas = contenido.split(/\r?\n/);
        lineas.forEach(function (linea) {
            if (linea.indexOf('class ') > -1) {
                var tarea = linea.split(" ")[1].split("(")[0];
                tareas.push(tarea);
            }
        });
        return tareas;
    }

    function updateTasks() {
        var tasksEndpoint = '/tasks/',
            fichero = $('#categoria').val();

        $.get(tasksEndpoint + fichero)
            .done(function (data) {
                var tareas = getTareas(data);
                $('#tarea').empty();
                tareas.forEach(function (tarea) {
                    $('#tarea').append('<option value="' + tarea + '">' + tarea + '</option>');
                });
            });
    }

    function onLoad() {
        updateTasks();
        $('#categoria').change(updateTasks);
    }

    $(onLoad());

}($));
