const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

let DbPath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());

let db = null;

const initilizeDBandServer = async () => {
  try {
    db = await open({
      filename: DbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("http server connection started at 3000");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initilizeDBandServer();

app.get("/players/", async (request, response) => {
  const getAllPlayer = `select * from cricket_team`;
  const playersArray = await db.all(getAllPlayer);
  response.send(playersArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const playerDetailsQuery = `insert into
        cricket_team(player_name,jersey_number,role)
        values
            (
             ${player_name},
             ${jersey_number},
             ${role})`;
  const dbResponse = await db.run(playerDetailsQuery);
  response.send("Player Added To Team");
});

app.put("/players/:player_id/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const { player_id } = request.params;
  const updatePlayerDetailsQuery = `update 
  cricket_team
        set
             player_name = ${player_name},
             jersey_number = ${jersey_number},
             role = ${role})
        where player_id = ${player_id}`;
  const dbResponseupdate = await db.run(playerDetailsQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const deletePlayerDetailsQuery = `delete from 
  cricket_team
        set
        where player_id = ${player_id}`;
  const dbResponsedelete = await db.run(playerDetailsQuery);
  response.send("Player Removed");
});

module.exports = app;
