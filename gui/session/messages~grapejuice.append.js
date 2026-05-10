g_NotificationsTypes["myCameraMoveTo"] = function (notification, player)
{
	if (player === Engine.GetPlayerID()) {
    let [x, y] = [notification.positionX, notification.positionY]
    // transform x,y variables if you need to or not :)
    Engine.CameraMoveTo(x,y)
	}
}

g_NotificationsTypes["discovered"] = function(notification, player)
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

    Engine.PlayUISound("audio/interface/alarm/alarm_discovered_player.ogg", false);

    addChatMessage({
        "type": "discovered",
        "player": player,
        "playerFound": notification.playerFound,
        "target": notification.target,
        "position": notification.position,
        "diplomacy": notification.diplomacy
    });

}