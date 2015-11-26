# -*- coding: utf-8 -*- #
import logging
import hashlib
import json
from pprint import pprint
from flask import Flask, request, render_template, send_from_directory
from os import listdir
import os
from os.path import isfile, join

# Puerto publico del servidor
PORT = 8081

# Hash de la contraseña de acceso
PASSWORD_SHA1_HASH = '81137cffce516c9d72c36bc0231d1c268c584347'

# Ruta relativa al directorio de tareas Luigi
TASKS_PATH = '../'

app = Flask(__name__)

@app.route('/tareas/<nombre>')
def returnTaskCode(nombre):
    return send_from_directory(TASKS_PATH, nombre)

@app.route('/css/<nombre>')
def returnStyle(nombre):
    return send_from_directory('templates/css', nombre)

@app.route('/js/<nombre>')
def returnScript(nombre):
    return send_from_directory('templates/js', nombre)

@app.route('/acceder')
def acceder():
    password = request.args.get('password', '')
    passwordHash = hashlib.sha1(password).hexdigest()
    if passwordHash == PASSWORD_SHA1_HASH:
        return 'ok'
    else:
        return 'error'

@app.route('/lanzar/<categoria>/<tarea>', methods=['POST'])
def lanzarTarea(categoria, tarea):
    llamada = 'PYTHONPATH=\'\' luigi --module ' + categoria + ' ' + tarea;
    jsonObject = request.get_json()
    password = jsonObject['password']
    parametros = jsonObject['parametros[]']

    for parametro in parametros:
        llamada += ' --' + parametro['nombre'] + ' ' + parametro['valor']

    passwordHash = hashlib.sha1(password).hexdigest()
    if passwordHash == PASSWORD_SHA1_HASH:
        try:
            os.system('cd .. && ' + llamada + ' &')
            return 'ok'
        except e:
            return e
    else:
        return 'error'

@app.route('/')
def index():
    ficheros = [ f for f in listdir(TASKS_PATH) if isfile(join(TASKS_PATH,f)) ]
    categorias = []
    for fichero in ficheros:
        nombreFichero = fichero.split('.')[0]
        extensionFichero = fichero.split('.')[1]
        if (nombreFichero != '__init__' and extensionFichero == 'py'):
            categorias.append({ 'fichero': fichero, 'nombre': fichero.split('.')[0]})
    return render_template('index.html', categorias=categorias)

if __name__ == '__main__':
    app.run(debug=True, port=PORT, host='0.0.0.0')
