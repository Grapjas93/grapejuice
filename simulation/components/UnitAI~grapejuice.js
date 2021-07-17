
UnitAI.prototype.AddOrder = function(type, data, queued, pushFront)
{
	if (this.expectedRoute)
		this.expectedRoute = undefined;

	if (pushFront)
		this.PushOrderFront(type, data);
	else if (queued)
		this.PushOrder(type, data);
	else
		this.ReplaceOrder(type, data);
	
	// grapejuice
	let cmpAttack = Engine.QueryInterface(this.entity, IID_Attack);
	if(cmpAttack != null && this.IsFormationController() == false)
	{
		if (type == "Attack")
		{
			// start the 500ms interval timer to check if we can charge our target
			cmpAttack.GetBestAttackAgainst(data.target);
		}
	}
};

// Setting the next state to the current state will leave/re-enter the top-most substate.
// Must be called from inside the FSM.
UnitAI.prototype.SetNextState = function(state)
{
	warn(state);
	this.UnitFsm.SetNextState(this, state);
	
	let cmpAttack = Engine.QueryInterface(this.entity, IID_Attack);
	if (!cmpAttack)
	return; 
	
	if (this.IsFormationController() == false)
	{
		if (state == "IDLE" || state == "FORMATIONMEMBER.IDLE" || state == "ROAMING" || state == "LINGERING")
		{
			warn("IDLE")
			cmpAttack.CanRechargeEnergy();		
			cmpAttack.StopCanChargeTimer();	
		}
		else if (state == "INDIVIDUAL.COMBAT.APPROACHING")
		{
			cmpAttack.StopRechargingEnergy();
		}
		else 
		{
			warn("IS NOT COMBAT")
			cmpAttack.StopRechargingEnergy();
			cmpAttack.StopCanChargeTimer();	
		}
	}
};

Engine.ReRegisterComponentType(IID_UnitAI, "UnitAI", UnitAI);
