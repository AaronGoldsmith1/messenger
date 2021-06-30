import React from "react";
import {
  Grid,
  Box,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as BubbleSVG } from "../assets/bubble.svg"
import bgImg from "../assets/bg-img.png";

const HomeSideImage = () => {
  const useStyles = makeStyles({
    sideBanner: {
      backgroundImage: `linear-gradient(rgb(58 141 255 / 85%), rgb(134 185 255 / 85%)), url(${bgImg})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
    },
    bannerText:{
      color: "white",
      fontSize: "2.2rem",
      margin: "0px 2rem 0px 2rem",
    },
    bannerIcon: {
      color: "white",
      alignSelf: "center",
    }
  });

  const classes = useStyles();

  return (
    <Box component={Grid} item sm={4} md={5} display={{ xs: "none", md: "block" }}>
      <Grid container className={classes.sideBanner}>
        <Grid item container direction="column" justify="center">
          <BubbleSVG className={classes.bannerIcon}/>
          <Typography align="center" className={classes.bannerText}>Converse with anyone in any language</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HomeSideImage;