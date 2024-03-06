import {db} from "../Firebase-config"
import { collection, writeBatch, doc } from "firebase/firestore";
import playersData from "../NFLStats/SeasonStatsPlayers.json"

const UploadPlayerData = async () => {
    const leaguesCollection = collection(db, "players");
  
    // Split the playersData into chunks of 500
    const chunks = [];
    for (let i = 0; i < playersData.length; i += 500) {
      chunks.push(playersData.slice(i, i + 500));
    }
  
    // For each chunk, upload the players data
    for (const chunk of chunks) {
      const batch = writeBatch(db);
      for (const player of chunk) {
        // Create a new object with only the properties you're interested in
        const playerData = {
          PlayerID: player.PlayerID,
          Team: player.Team,
          Number: player.Number,
          Name: player.Name,
          Position: player.FantasyPosition,
          GamesPlayed: player.Played,
          GamesStarted: player.Started,
          PassingAttempts: player.PassingAttempts,
          PassingCompletions: player.PassingCompletions,
          PassingYards: player.PassingYards,
          PassingTouchdowns: player.PassingTouchdowns,
          PassingInterceptions: player.PassingInterceptions,
          RushingAttempts: player.RushingAttempts,
          RushingYards: player.RushingYards,
          RushingTouchdowns: player.RushingTouchdowns,
          ReceivingTargets: player.ReceivingTargets,
          ReceivingYards: player.ReceivingYards,
          ReceivingTouchdowns: player.ReceivingTouchdowns,
          Fumbles: player.Fumbles,
          FumblesLost: player.FumblesLost,
          KickReturnTouchdowns: player.KickReturnTouchdowns,
          SoloTackles: player.SoloTackles,
          AssistedTackles: player.AssistedTackles,
          TacklesForLoss: player.TacklesForLoss,
          Sacks: player.Sacks,
          SackYards: player.SackYards,
          QuarterbackHits: player.QuarterbackHits,
          PassesDefended: player.PassesDefended,
          FumblesForced: player.FumblesForced,
          FumblesRecovered: player.FumblesRecovered,
          FumbleReturnTouchdowns: player.FumbleReturnTouchdowns,
          Interceptions: player.Interceptions,
          InterceptionReturnTouchdowns: player.InterceptionReturnTouchdowns,
          FieldGoalsAttempted: player.FieldGoalsAttempted,
          FieldGoalsMade: player.FieldGoalsMade,
          ExtraPointsMade: player.ExtraPointsMade,
          TwoPointConversionPasses: player.TwoPointConversionPasses,
          TwoPointConversionRuns: player.TwoPointConversionRuns,
          TwoPointConversionReceptions: player.TwoPointConversionReceptions,
          FieldGoalsMade0to19: player.FieldGoalsMade0to19,
          FieldGoalsMade20to29: player.FieldGoalsMade20to29,
          FieldGoalsMade30to39: player.FieldGoalsMade30to39,
          FieldGoalsMade40to49: player.FieldGoalsMade40to49,
          FieldGoalsMade50Plus: player.FieldGoalsMade50Plus,
          AverageDraftPosition: player.AverageDraftPosition,
          AverageDraftPositionPPR: player.AverageDraftPositionPPR,
          TeamID: player.TeamID,
          AverageDraftPositionRookie: player.AverageDraftPositionRookie,
          AverageDraftPositionDynasty: player.AverageDraftPositionDynasty,
          AverageDraftPosition2QB: player.AverageDraftPosition2QB
        };

        const docRef = doc(leaguesCollection);
        batch.set(docRef, playerData);
      }
      await batch.commit();
    }
};

export default UploadPlayerData;