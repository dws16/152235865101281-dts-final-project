import { useEffect, useState } from 'react';

import { Container, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAuthState } from 'react-firebase-hooks/auth';

import Card from '../components/CustomCard';
import Search from '../components/Home/Search';
import PokemonCard from '../components/Home/PokemonCard';
import Loading from '../components/Loading';
import NotFound from '../components/Home/NotFound';

import pokeball from '../assets/pokeball.png';
import auth from '../libs/firebase';
import { getPokemons, searchPokemons } from '../services/pokeapi';


const style = {
  maxWidth: '80px',
  display: 'block',
  marginBottom: '-40px',
  marginLeft: 'auto',
  marginRight: 'auto',
  position: 'relative',
}

export default function Home() {

  const [pokemons, setPokemons] = useState(new Set());
  const [offset, setOffset] = useState(0);
  const [load, setLoad] = useState(true);
  const [search, setSearch] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);

  const [user, loading] = useAuthState(auth);

  const handleScroll = () => {
    const now = window.innerHeight + document.documentElement.scrollTop + 30;
    const bottom = document.scrollingElement.scrollHeight;
    if (now > bottom) {
      setOffset(offset + 60);
    }
  }

  const loadPokemon = () => {
    getPokemons(offset).then(data => {
      setPokemons(prev => {
        return new Set([...prev, ...data]);
      });
      setLoad(prev => false);
    })
  }

  useEffect(() => {
    document.title = 'Home - Pokébot';
  }, []);

  useEffect(() => {
    setLoad(prev => true);
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }

    setOffset(0);
    if (search !== '') {
      searchPokemons(search)
        .then(data => {
          setPokemons(new Set(data));
          setLoad(false);
        })
    } else {
      setPokemons(new Set());
      loadPokemon();
    }
  }, [search]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    if (offset < 845 && !loading && !search) {
      loadPokemon();
    }
  }, [loading, offset]);

  if (load) {
    return <Loading />;
  }

  return (
    <Container>
      <Grid container spacing={1} justifyContent="flex-start" alignItems="flex-start" sx={{ marginBottom: 5 }}>
        <Grid item md={12}>
          <img src={pokeball} style={style} alt={'pokeball'} />
          <Card>
            <Box my={2} px={5}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item md={4} textAlign="start">
                  <Typography variant="h5" component="h1" color="primary" sx={{ fontWeight: 700 }} gutterBottom>
                    Pokédex
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Search search={search} setSearch={setSearch} />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {pokemons.size < 1 ?
        <Grid container spacing={1}>
          <Grid item md={12}>
            <NotFound />
          </Grid>
        </Grid>
        :
        <Grid container spacing={3}>
          {pokemons && Array.from(pokemons).map(pokemon => (
            <Grid item md={4} key={pokemon.name}>
              <PokemonCard pokemon={pokemon} />
            </Grid>
          ))}
        </Grid>
      }
    </Container>
  );
}