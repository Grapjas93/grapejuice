g_NotificationsTypes["myCameraMoveTo"] = function (notification, player)
{
	if (player === Engine.GetPlayerID()) {
    let [x, y] = [notification.positionX, notification.positionY]
    // transform x,y variables if you need to or not :)
    Engine.CameraMoveTo(x,y)
	}
}