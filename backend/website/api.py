from flask import Blueprint,  request, Response
from itsdangerous import json
from .models import Pokemon
from . import db
from flask_cors import cross_origin

api = Blueprint('api', __name__)

@api.route('/store', methods=['POST'])
@cross_origin()
def store():

    pokemon_id = request.form.get('pokemon_id')
    pokemon_name = request.form.get('pokemon_name')
    email = request.form.get('email')
    name = request.form.get('name')

    errors = []

    if not pokemon_id or not pokemon_name:
        errors.append('Pokemon is required')
    if not email:
        errors.append('Email is required')
    if not name:
        errors.append('Name is required')
    
    if errors:
        data = json.dumps({'success': False, 'message': errors})
        return Response(data, status=400, mimetype='application/json')

    pokemonName = Pokemon.query.filter_by(email=email).filter(Pokemon.name == name.lower()).first()
    
    if pokemonName:
        return Response(json.dumps({'success': False, 'message':'Pokemon name already exists'}), status=400, mimetype='application/json')

    pokemon = Pokemon(pokemon_id=pokemon_id, pokemon_name=pokemon_name, email=email, name=name)
    db.session.add(pokemon)
    db.session.commit()

    data = json.dumps({'success': True, 'message': 'Pokemon has been added'})
    return Response(data, status=200, mimetype='application/json')

@api.route('/delete/<int:id>', methods=['DELETE'])
def delete(id):
    pokemon = Pokemon.query.get(id)

    db.session.delete(pokemon)
    db.session.commit()
    data = json.dumps(
        {'success': True, 'message': 'Pokemon has been released'})
    return Response(data, status=200, mimetype='application/json')


@api.route('/get_all/<string:email>/<int:limit>/<int:offset>', methods=['GET'])
def get(email, limit = 10, offset = 0):
    
    pokemons = Pokemon.query.filter_by(
        email=email).order_by(Pokemon.created_at.desc()).limit(limit).offset(offset).all()

    pokemons_list = []
    for pokemon in pokemons:
        pokemons_list.append({
            'id': pokemon.id,
            'name': pokemon.name,
            'pokemon_name': pokemon.pokemon_name,
            'pokemon_id': pokemon.pokemon_id,
        })
    data = json.dumps({'success': True, 'pokemons': pokemons_list})
    return Response(data, status=200, mimetype='application/json')


@api.route('/get/<string:email>/<string:pokemon_id>', methods=['GET'])
def get_by_id(email, pokemon_id):
      
      pokemon = Pokemon.query.filter_by(
          email=email, pokemon_id=pokemon_id).all()
  
      data = json.dumps({'success': True, 'pokemon': len(pokemon)})
      return Response(data, status=200, mimetype='application/json')
