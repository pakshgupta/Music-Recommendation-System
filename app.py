from flask import Flask, request, render_template
import numpy as np
import pandas as pd
import pickle

# loading models
df = pickle.load(open('df (1).pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))


def recommendation(song_df):
    matches = df[df['song'] == song_df]
    if matches.empty:
        print(f"No matches found for '{song_df}'.")
        return []
    idx = matches.index[0]
    distances = sorted(list(enumerate(similarity[idx])), reverse=True, key=lambda x: x[1])

    songs = []
    for m_id in distances[1:21]:
        songs.append(df.iloc[m_id[0]].song)

    return songs


# flask app
app = Flask(__name__)


# paths
# @app.route('/')
# def index():
#     names = list(df['song'].values)
#     return render_template('index.html', name=names)

@app.route('/')
def index():
    names = df['song'].values.tolist()  # Convert the column to a list
    return render_template('index.html', names=names)


# @app.route('/recom', methods=['POST'])
# def mysong():
#     user_song = request.form['names']
#     songs = recommendation(user_song)
#
#     return render_template('index.html', songs=songs)

@app.route('/recom', methods=['POST'])
def mysong():
    user_song = request.form['names']
    songs = recommendation(user_song)

    return render_template('index.html', name=list(df['song'].values), songs=songs)


# python
if __name__ == "__main__":
    app.run(debug=False)
