from boggle import Boggle
from flask import Flask, request, render_template, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension


boggle_game = Boggle()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'

debug = DebugToolbarExtension(app)

@app.route('/')
def create_board():

    return render_template('index.html')

@app.route('/board')
def display_board():
    """Displays Boggle board."""

    size = int(request.args.get('size'))
    board = boggle_game.make_board(size)
    session['board'] = board

    return render_template('board.html', board=board)

@app.route('/board', methods=['POST'])
def get_guess():
    """Gets guess and returns validation."""

    print("hello from POST board", request)
    guess = request.form.get('guess')
    board = session['board']
    guess_is_valid = boggle_game.check_valid_word(board, guess)

    return jsonify({"result": guess_is_valid })

@app.route('/stats', methods=['POST'])
def stats():
    """Gets user's score and updates times played and high score."""

    score = int(request.form.get('score'))
    high_score = session.get('high_score', 0)
    times_played = session.get('times_played', 0)
    times_played += 1
    if score > high_score:
        session['high_score'] = score
        high_score = score
    session['times_played'] = times_played

    return jsonify({"score": high_score, "times_played": times_played})