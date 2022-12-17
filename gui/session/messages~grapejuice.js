/**
 * Defines how the GUI reacts to notifications that are sent by the simulation.
 * Don't open new pages (message boxes) here! Otherwise further notifications
 * handled in the same turn can't access the GUI objects anymore.
 */
 var g_NotificationsTypes =
 {
     "aichat": function(notification, player)
     {
         let message = {
             "type": "message",
             "text": notification.message,
             "guid": findGuidForPlayerID(player) || -1,
             "player": player,
             "translate": true
         };

         if (notification.translateParameters)
         {
             message.translateParameters = notification.translateParameters;
             message.parameters = notification.parameters;
             colorizePlayernameParameters(notification.parameters);
         }

         addChatMessage(message);
     },
     "defeat": function(notification, player)
     {
         playersFinished(notification.allies, notification.message, false);
     },
     "won": function(notification, player)
     {
         playersFinished(notification.allies, notification.message, true);
     },
     "diplomacy": function(notification, player)
     {
         updatePlayerData();
         g_DiplomacyColors.onDiplomacyChange();

         addChatMessage({
             "type": "diplomacy",
             "sourcePlayer": player,
             "targetPlayer": notification.targetPlayer,
             "status": notification.status
         });
     },
     "ceasefire-ended": function(notification, player)
     {
         updatePlayerData();
         for (let handler of g_CeasefireEndedHandlers)
             handler();
     },
     "tutorial": function(notification, player)
     {
         updateTutorial(notification);
     },
     "tribute": function(notification, player)
     {
         addChatMessage({
             "type": "tribute",
             "sourcePlayer": notification.donator,
             "targetPlayer": player,
             "amounts": notification.amounts
         });
     },
     "barter": function(notification, player)
     {
         addChatMessage({
             "type": "barter",
             "player": player,
             "amountGiven": notification.amountGiven,
             "amountGained": notification.amountGained,
             "resourceGiven": notification.resourceGiven,
             "resourceGained": notification.resourceGained
         });
     },
     "spy-response": function(notification, player)
     {
         g_DiplomacyDialog.onSpyResponse(notification, player);

         if (notification.entity && g_ViewedPlayer == player)
         {
             g_DiplomacyDialog.close();
             setCameraFollow(notification.entity);
         }
     },
     "attack": function(notification, player)
     {
         if (player != g_ViewedPlayer)
             return;

         // Focus camera on attacks
         if (g_FollowPlayer)
         {
             setCameraFollow(notification.target);

             g_Selection.reset();
             if (notification.target)
                 g_Selection.addList([notification.target]);
         }

         g_LastAttack = { "target": notification.target, "position": notification.position };

         if (Engine.ConfigDB_GetValue("user", "gui.session.notifications.attack") !== "true")
             return;

         addChatMessage({
             "type": "attack",
             "player": player,
             "attacker": notification.attacker,
             "target": notification.target,
             "position": notification.position,
             "targetIsDomesticAnimal": notification.targetIsDomesticAnimal
         });
     },
     // grapejuice
     "discovered": function(notification, player)
     {
         if (player != g_ViewedPlayer)
             return;

         // Focus camera on attacks
         if (g_FollowPlayer)
         {
             setCameraFollow(notification.target);

             g_Selection.reset();
             if (notification.target)
                 g_Selection.addList([notification.target]);
         }

         g_LastAttack = { "target": notification.target, "position": notification.position };

         if (Engine.ConfigDB_GetValue("user", "gui.session.notifications.discovered") !== "true")
             return;

        Engine.PlayUISound("audio/interface/alarm/alarm_discovered_player.ogg", false);

         addChatMessage({
             "type": "discovered",
             "player": player,
             "playerFound": notification.playerFound,
             "target": notification.target,
             "position": notification.position,
             "diplomacy": notification.diplomacy
         });

     },
     "phase": function(notification, player)
     {
         addChatMessage({
             "type": "phase",
             "player": player,
             "phaseName": notification.phaseName,
             "phaseState": notification.phaseState
         });
     },
     "dialog": function(notification, player)
     {
         if (player == Engine.GetPlayerID())
             openDialog(notification.dialogName, notification.data, player);
     },
     "playercommand": function(notification, player)
     {
         // For observers, focus the camera on units commanded by the selected player
         if (!g_FollowPlayer || player != g_ViewedPlayer)
             return;

         let cmd = notification.cmd;

         // Ignore rallypoint commands of trained animals
         let entState = cmd.entities && cmd.entities[0] && GetEntityState(cmd.entities[0]);
         if (g_ViewedPlayer != 0 &&
             entState && entState.identity && entState.identity.classes &&
             entState.identity.classes.indexOf("Animal") != -1)
             return;

         // Focus the structure to build.
         if (cmd.type == "repair")
         {
             let targetState = GetEntityState(cmd.target);
             if (targetState)
                 Engine.CameraMoveTo(targetState.position.x, targetState.position.z);
         }
         else if (cmd.type == "delete-entities" && notification.position)
             Engine.CameraMoveTo(notification.position.x, notification.position.y);
         // Focus commanded entities, but don't lose previous focus when training units
         else if (cmd.type != "train" && cmd.type != "research" && entState)
             setCameraFollow(cmd.entities[0]);

         if (["walk", "attack-walk", "patrol"].indexOf(cmd.type) != -1)
             DrawTargetMarker(cmd);

         // Select units affected by that command
         let selection = [];
         if (cmd.entities)
             selection = cmd.entities;
         if (cmd.target)
             selection.push(cmd.target);

         // Allow gaia in selection when gathering
         g_Selection.reset();
         g_Selection.addList(selection, false, cmd.type == "gather");
     },
     "play-tracks": function(notification, player)
     {
         if (notification.lock)
         {
             global.music.storeTracks(notification.tracks.map(track => ({ "Type": "custom", "File": track })));
             global.music.setState(global.music.states.CUSTOM);
         }

         global.music.setLocked(notification.lock);
     },
     "map-flare": function(notification, player)
     {
         // Don't display for the player that did the flare because they will see it immediately
         if (player != Engine.GetPlayerID() && g_Players[player].isMutualAlly[Engine.GetPlayerID()])
         {
             let now = Date.now();
             if (g_FlareRateLimitLastTimes.length)
             {
                 g_FlareRateLimitLastTimes = g_FlareRateLimitLastTimes.filter(t => now - t < g_FlareRateLimitScope * 1000);
                 if (g_FlareRateLimitLastTimes.length >= g_FlareRateLimitMaximumFlares)
                 {
                     warn("Received too many flares. Dropping a flare request by '" + g_Players[player].name + "'.");
                     return;
                 }
             }
             g_FlareRateLimitLastTimes.push(now);

             displayFlare(notification.target, player);
             Engine.PlayUISound(g_FlareSound, false);
         }
     }
 };

// grapejuice
g_NotificationsTypes["myCameraMoveTo"] = function (notification, player)
{
	if (player === Engine.GetPlayerID()) {
    let [x, y] = [notification.positionX, notification.positionY]
    // transform x,y variables if you need to or not :)
    Engine.CameraMoveTo(x,y)
	}
}