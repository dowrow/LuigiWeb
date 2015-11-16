import logging
from flask import Flask, request, render_template, send_from_directory
from os import listdir
from os.path import isfile, join

# Ruta relativa al directio de tareas Luigi
TASKS_PATH = '../'

app = Flask(__name__)
app.debug = True

@app.route('/tasks/<nombre>')
def returnTaskCode(nombre):
    return send_from_directory(TASKS_PATH, nombre)

@app.route('/js/<nombre>')
def returnScript(nombre):
    return send_from_directory('templates/js', nombre)

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
    app.run()
