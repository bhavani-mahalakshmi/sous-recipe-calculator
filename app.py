from flask import Flask, jsonify, render_template, request

from queries import get_recipe, insert_recipe

app = Flask(__name__)

@app.route('/')
def index():
    # response_body = {
    #     "message": "Get the damn job!!"
    # }
    # return response_body
    return render_template('index.html')

@app.route('/recipe', methods=['GET', 'POST'])
def recipe():
    if request.method == 'GET':
        result = get_recipe()
        return jsonify(isError = False,
                    message= "Success",
                    statusCode = 200,
                    data = result), 200

    if request.method == 'POST':
        insert_recipe(request.json["recipe"])
        return jsonify(isError = False,
                    message= "Success",
                    statusCode = 200,
                    data = None), 200