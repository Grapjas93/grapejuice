// grapejuice, only apply status effects if they have intervals (usefull for (de)activating them through auras)
/**
 * Called by Attacking effects. Adds status effects for each entry in the effectData.
 *
 * @param {Object} effectData - An object containing the status effects to give to the entity.
 * @param {number} attacker - The entity ID of the attacker.
 * @param {number} attackerOwner - The player ID of the attacker.
 * @param {number} bonusMultiplier - A value to multiply the damage with (not implemented yet for SE).
 *
 * @return {Object} - The codes of the status effects which were processed.
 */
StatusEffectsReceiver.prototype.ApplyStatus = function(effectData, attacker, attackerOwner)
{
	for (let effect in effectData)
		// Only apply statuseffect if it has an interval.
		// We can activate/deactivate statuseffect attacks with an aura by changing interval from 0 to 0> (braziers for example) / grapejuice
		if (effectData[effect].Interval > 0)
			this.AddStatus(effect, effectData[effect], attacker, attackerOwner);

	// TODO: implement loot?

	return { "inflictedStatuses": Object.keys(effectData) };
};

Engine.ReRegisterComponentType(IID_StatusEffectsReceiver, "StatusEffectsReceiver", StatusEffectsReceiver);
