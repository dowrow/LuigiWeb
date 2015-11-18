/*global $, console, localStorage*/
(function ($, localStorage) {
    'use strict';

    var tareasEndpoint = '/tareas/',
        lanzarEndpoint = '/lanzar/',
        password = '';

    function acceder() {
        password = localStorage.getItem('password') || $('#password').val();
        $.get('/acceder', { password: password})
            .done(function (data) {
                if (data === 'ok') {
                    localStorage.setItem('password', password);
                    $('#panel').toggle();
                    $('#acceso').toggle();
                }
            });
    }

    function lanzarTarea() {
        var categoria = $('#categoria option:selected').text(),
            tarea = $('#tarea').val(),
            parametros = [],
            url = lanzarEndpoint + categoria + '/' + tarea,
            inputsParametro = $('.parametro'),
            data;

        inputsParametro.each(function () {
            parametros.push({
                nombre: $(this).attr('name'),
                valor: $(this).val()
            });
        });

        data = {
            'password': password,
            'parametros[]': parametros
        };

        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8'
        }).done(function (data) {
            $('#panel').toggle();
            if (data === 'ok') {
                $('#success').toggle();
            } else {
                $('#error').toggle();
            }
        });
    }

    function getTareas(contenido) {
        var tareas = [],
            lineas = contenido.split(/\r?\n/);

        lineas.forEach(function (linea) {
            if (linea.indexOf('class ') > -1) {
                var tarea = linea.split(' ')[1].split('(')[0];
                tareas.push(tarea);
            }
        });
        return tareas;
    }

    function getComentario(contenido, nombreTarea) {
        var clase = contenido.split('class ' + nombreTarea)[1].split('class ')[0],
            comentario = clase.split('\"\"\"')[1] || 'Esta tarea no tiene descripción.';
        return comentario;
    }

    function getParametros(contenido, nombreTarea) {
        var parametros = [],
            lineasClase = contenido.split('class ' + nombreTarea)[1].split('class ')[0].split(/\r?\n/);

        lineasClase.forEach(function (lineaClase) {
            if (lineaClase.indexOf('luigi.Parameter(') > -1) {
                var nombreParametro = lineaClase.split(' = ')[0],
                    defaultValue = '';
                if (lineaClase.indexOf('luigi.Parameter(default="') > -1) {
                    defaultValue = lineaClase.split('luigi.Parameter(default="')[1].split('")')[0];
                }
                parametros.push({
                    'nombre': nombreParametro.replace('\t', ''),
                    'valor': defaultValue.replace('\t', '')
                });
            }
        });
        return parametros;
    }

    function updateComentario() {
        var fichero = $('#categoria').val(),
            tarea = $('#tarea').val();

        $.get(tareasEndpoint + fichero)
            .done(function (data) {
                var info = getComentario(data, tarea);
                $('#comentario').empty();
                $('#comentario').html(info);
            });
    }

    function updateParametros() {
        var fichero = $('#categoria').val(),
            tarea = $('#tarea').val();

        $.get(tareasEndpoint + fichero)
            .done(function (data) {
                var htmlParametro = '',
                    parametros = getParametros(data, tarea);
                $('#parametros').empty();
                if (parametros.length < 1) {
                    $('#parametros').append('<span>Esta tarea no admite parámetros</span>');
                    return;
                }
                parametros.forEach(function (parametro) {
                    htmlParametro = '<label>' + parametro.nombre
                                        + ': </label><input class="parametro form-control" name="'
                                        + parametro.nombre + '" type="text" value="'
                                        + parametro.valor + '"/><br/>';
                    $('#parametros').append(htmlParametro);
                });
            });
    }



    function updateTareas() {
        var fichero = $('#categoria').val();

        $.get(tareasEndpoint + fichero)
            .done(function (data) {
                var tareas = getTareas(data);
                $('#tarea').empty();
                tareas.forEach(function (tarea) {
                    $('#tarea').append('<option value="' + tarea + '">' + tarea + '</option>');
                });
                updateParametros();
                updateComentario();
            });
    }

    function onLoad() {
        $('#panel').toggle();
        $('#success').toggle();
        $('#error').toggle();
        acceder();
        updateTareas();
        $('#categoria').change(updateTareas);
        $('#tarea').change(updateParametros);
        $('#acceder').click(acceder);
        $('#lanzar').click(lanzarTarea);
    }

    $(onLoad());

}($, localStorage));
