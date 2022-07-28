from . import db
from datetime import datetime
from pytz import timezone


class Pokemon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pokemon_id = db.Column(db.Integer, nullable=False)
    pokemon_name = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime,
                           nullable=False,
                           default=datetime.now(timezone('Asia/Jakarta')))
    def __repr__(self):
        return '<Pokemon %r>' % self.name
