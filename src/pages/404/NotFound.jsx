import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import Button from "@mui/material/Button";
import Home from "@mui/icons-material/Home";

import { ReactComponent as AstronautSvg } from "~/assets/404/astronaut.svg";
import { ReactComponent as PlanetSvg } from "~/assets/404/planet.svg";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        width: " 100vw",
        height: "100vh",
        bgcolor: "#25344C",
        color: "white",
      }}
    >
      <Box
        sx={{
          "@keyframes stars": {
            "0%": { backgroundPosition: "-100% 100%" },
            "100%": { backgroundPosition: "0 0" },
          },
          animation: "stars 12s linear infinite alternate",
          height: "100%",
          width: "100%",
          backgroundImage: 'url("src/assets/404/particles.png")',
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h1" sx={{ fontSize: "100px", fontWeight: "800" }}>
          404
        </Typography>

        <Typography
          sx={{
            fontWeight: "400",
            fontSize: "18px !important",
            maxWidth: "350px",
            lineHeight: "25px",
            textAlign: "center",
          }}
        >
          LOST IN&nbsp;
          <Typography
            variant="span"
            sx={{
              position: "relative",
              "&:after": {
                position: "absolute",
                content: '""',
                borderBottom: "3px solid #FDBA26",
                left: 0,
                top: "43%",
                width: "100%",
              },
            }}
          >
            &nbsp;SPACE&nbsp;
          </Typography>
          &nbsp;
          <Typography variant="span" sx={{ color: "#FDBA26", fontWeight: 500 }}>
            Trello
          </Typography>
          ?<br />
          Hmm, looks like that page doesn&apos;t exist.
        </Typography>
        <Box sx={{ width: "390px", height: "390px", position: "relative" }}>
          <SvgIcon
            component={AstronautSvg}
            inheritViewBox
            sx={{
              width: "50px",
              height: "50px",
              position: "absolute",
              top: "20px",
              left: "25px",
              "@keyframes spinAround": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
              },
              animation: "spinAround 5s linear 0s infinite",
            }}
          />
          <PlanetSvg />
        </Box>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            startIcon={<Home />}
            sx={{
              display: "flex",
              alignItems: "center",
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "#FDBA26",
                color: "#FDBA26",
              },
            }}
          >
            Go Home
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default NotFound;
