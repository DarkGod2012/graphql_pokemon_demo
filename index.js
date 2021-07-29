const express = require('express');
const expressGraphQL = require('express-graphql');
const { 
    GraphQLSchema,
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInputObjectType ,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = require('graphql');
const app = express();

// Data
const pokemons = [
    { id: 1, name: 'Bulbasaur', hp: 45, atk: 49, def: 49, spAtk: 65, spDef: 65, speed: 45, typeId: 1},
    { id: 2, name: 'Ivysaur', hp: 60, atk: 62, def: 63, spAtk: 80, spDef: 80, speed: 60, typeId: 1},
    { id: 3, name: 'Venusaur', hp: 80, atk: 82, def: 83, spAtk: 100, spDef: 100, speed: 80, typeId: 1},
    { id: 4, name: 'Charmander', hp: 39, atk: 52, def: 43, spAtk: 60, spDef: 60, speed: 65, typeId: 2},
    { id: 5, name: 'Charmeleon', hp: 58 , atk: 64, def: 58, spAtk: 80, spDef: 65, speed: 80, typeId: 2},
    { id: 6, name: 'Charizard', hp: 78, atk: 84, def: 78, spAtk: 109, spDef: 85, speed: 100, typeId: 2},
    { id: 7, name: 'Squirtle', hp: 44, atk: 48, def: 65, spAtk: 50, spDef: 64, speed: 43, typeId: 3},
    { id: 8, name: 'Wartortle', hp: 59, atk: 63, def: 80, spAtk: 65, spDef: 80, speed: 58, typeId: 3},
    { id: 9, name: 'Blastoise', hp: 79, atk: 83, def: 100, spAtk: 85, spDef: 105, speed: 78, typeId: 3},
];

const types = [
    { id: 1, name: 'grass'},
    { id: 2, name: 'water'},
    { id: 3, name: 'fire'},
    { id: 4, name: 'electric'},
];

const PokemonType = new GraphQLObjectType({
    name: 'PokemonType',
    description: "pokemon's type'",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        pokemons: {
            type: new GraphQLList(Pokemon),
            resolve: (type) => pokemons.filter(pokemon => pokemon.typeId === type.id),
        }
    })
});

const Pokemon = new GraphQLObjectType({
    name: 'Pokemon',
    description: 'pokemon species',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        hp: { type: GraphQLNonNull(GraphQLInt) },
        atk: { type: GraphQLNonNull(GraphQLInt) },
        def: { type: GraphQLNonNull(GraphQLInt) },
        spAtk: { type: GraphQLNonNull(GraphQLInt) },
        spDef: { type: GraphQLNonNull(GraphQLInt) },
        speed: { type: GraphQLNonNull(GraphQLInt) },
        typeId: { type: GraphQLNonNull(GraphQLInt) },
        type: {
            type: PokemonType,
            resolve: (pokemon) => {
                return types.find(type => type.id === pokemon.typeId);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        pokemons: {
            type: new GraphQLList(Pokemon),
            resolve: () => pokemons,
        },
        pokemon: {
            type: Pokemon,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => pokemons.find(pokemon => pokemon.id === args.id),
        } ,
        pokemonTypes: {
            type: new GraphQLList(PokemonType),
            resolve: () => types,
        },
        pokemonType: {
            type: PokemonType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => types.find(type => type.id === args.id),
        }
    })
})

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addPokemon: {
            type: PokemonType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                hp: { type: GraphQLNonNull(GraphQLInt) },
                atk: { type: GraphQLNonNull(GraphQLInt) },
                def: { type: GraphQLNonNull(GraphQLInt) },
                spAtk: { type: GraphQLNonNull(GraphQLInt) },
                spDef: { type: GraphQLNonNull(GraphQLInt) },
                typeId: { type: GraphQLNonNull(GraphQLInt) },
                speed: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const newPokemon = {
                    id: pokemons.length + 1,
                    name: args.name,
                    hp: args.hp,
                    atk: args.atk,
                    def: args.def,
                    spAtk: args.spAtk,
                    spDef: args.spDef,
                    speed: args.speed,
                };
                pokemons.push(newPokemon);
                return newPokemon;
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
})

app.use('/graphql', expressGraphQL({ 
    schema: schema,
    graphiql: true 
}));
app.listen(5000, () => console.log('Server Runing'));