import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Card from "../CustomCard";
import shadowBall from "../../assets/poke-shadow.png";
import theme from "../../assets/mui-theme";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../libs/firebase";
import { getPokemon } from "../../services/api";
import { useEffect, useState } from "react";

export default function PokemonCard({ pokemon }) {

  const [user, loading, error] = useAuthState(auth);
  const [load, setLoad] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user && !loading && !error) {
      getPokemon(user?.email, pokemon.id).then(data => {
        setTotal(data.pokemon);
        setLoad(false);
      }).catch(err => {
        console.log(err);
      });
    }
  }, [user, loading, error]);

  const imgStyle = {
    maxWidth: "150px",
    display: "block",
    marginBottom: "-40px",
    marginLeft: "-20px",
    marginRight: "auto",
    position: "relative",
  };

  const shadowStyle = {
    maxWidth: "100px",
    display: "block",
    marginTop: "0px",
    marginLeft: "-20px",
    marginRight: "auto",
    position: "absolute",
  }

  const hoverStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: `5px 5px 0px ${theme.palette.secondary.main}`,
    top: "-40px",
    transform: "translateY(-10px)",
  }

  const cardStyle = {
    maxWidth: "150px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    marginLeft: "auto",
    marginTop: "-30px",
  }

  return (
    <Link to={`/pokemon/${pokemon.name}`}>
      <Card sx={{ ':hover': hoverStyle, transition: "transform 0.3s" }}>
        {user?.email && (
          <Card sx={cardStyle}>
            <Typography variant="subtitle2">
              You Have: {load ? "..." : total}
            </Typography>
          </Card>
        )}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Grid container alignItems='center' >
            <Grid item md={4}>
              <img src={shadowBall} style={shadowStyle} alt={pokemon.name} />
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} height="150" style={imgStyle} alt={pokemon.name} />
            </Grid>
            <Grid item md={8} >
              <Typography variant="h5" component="h1" color="text" sx={{ fontWeight: 700 }} gutterBottom>
                {pokemon.name.toUpperCase()}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Card>
    </Link>
  )
};