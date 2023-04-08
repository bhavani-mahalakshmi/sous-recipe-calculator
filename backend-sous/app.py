from flask import Flask, jsonify, request

from queries import get_recipe, insert_recipe

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/recipe', methods=['GET', 'POST'])
def recipe():
    if request.method == 'GET':
        try:
            result = get_recipe()
            return jsonify(isError = False,
                        message= "Success",
                        statusCode = 200,
                        data = result), 200
        except Exception as e:
            return jsonify(isError = True,
                        message= str(e),
                        statusCode = 500,
                        data = None), 500

    if request.method == 'POST':
        try:
            insert_recipe(request.json["recipe"])
            return jsonify(isError = False,
                        message= "Success",
                        statusCode = 200,
                        data = None), 200
        except Exception as e:
            return jsonify(isError = True,
                        message= str(e),
                        statusCode = 500,
                        data = None), 500        

app.run(host='0.0.0.0', port=8080)